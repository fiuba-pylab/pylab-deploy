import { NATIVE_FUNCTIONS, REGEX_CONSTS } from "../constants";
import { CodeService } from "../services/code.service";
import { evaluate, replaceVariables } from "../utils";
import { Collection } from "./collection";
import { Dictionary } from "./dictionary";
import { List } from "./list";
import { Tuple } from "./tuple";

const operations = {
    '+=': (a: number, b: number) => a + b,
    '-=': (a: number, b: number) => a - b,
    '*=': (a: number, b: number) => a * b,
    '//=': (a: number, b: number) => Math.floor(a / b),
    '/=': (a: number, b: number) => a / b,
};
type Operator = keyof typeof operations;


export async function evaluateExpression(expression: string, codeService:CodeService,varName?: string): Promise<string> {
    let previousExpression;
    let currentExpression = expression;

    do {
        previousExpression = currentExpression;
        currentExpression = await replaceAsync(currentExpression, REGEX_CONSTS.REGEX_FUNCTIONS, async (match, funcName, args) => {
            let evaluatedArgs = await Promise.all(args.split(',').map(async (arg: string) => await evaluateExpression(arg.trim(), codeService,varName)));
            return await evaluateFunction(funcName, evaluatedArgs.join(','), codeService, varName);
        });
    } while (currentExpression !== previousExpression);

    return currentExpression;
}

export async function applyFunctions(variableValue: any, variables: any ,codeService:CodeService,varName?: string): Promise<any> {
    let result = variableValue;
    result = replaceVariables(result, variables);
    result = await evaluateExpression(result, codeService,varName);
    result = result.replace(/False/g, 'false').replace(/True/g, 'true')
    return result;
}


async function evaluateFunction(funcName: string, args: string, codeService:CodeService ,varName?: string): Promise<string> {
    let evalArgs = evaluate(args);
    switch (funcName) {
        case NATIVE_FUNCTIONS.FLOAT:
            return String(Number(evalArgs));
        case NATIVE_FUNCTIONS.INT:
            return String(parseInt(evalArgs));
        case NATIVE_FUNCTIONS.STR:
            return String(evalArgs);
        case NATIVE_FUNCTIONS.MATH_POW:
            var funcArgs = (args as string).split(',');
            return (Math.pow(Number(funcArgs[0]), Number(funcArgs[1]))).toString();
        case NATIVE_FUNCTIONS.MATH_SQRT:
            let imaginary = false
            if (evalArgs < 0) {
                evalArgs = evalArgs * -1;
                imaginary = true
            }
            return ((Math.sqrt(Number(evalArgs))).toString() + (imaginary ? 'i' : ''));
        case NATIVE_FUNCTIONS.MATH_ROUND:
            var funcArgs = (args as string).split(',');
            if (funcArgs.length > 1) {
                return Number(funcArgs[0]).toFixed(Number(funcArgs[1])).toString();
            }
            return (Math.round(Number(evalArgs))).toString();
        case NATIVE_FUNCTIONS.MATH_ASIN:
            return (Math.asin(Number(evalArgs))).toString();
        case NATIVE_FUNCTIONS.MATH_LOG10:
            return (Math.log10(Number(evalArgs))).toString();
        case NATIVE_FUNCTIONS.LEN:
            return String((evalArgs as string).length);
        case NATIVE_FUNCTIONS.INPUT:
            return codeService.getInput(evalArgs, varName?? '');
        case NATIVE_FUNCTIONS.ABS:
            return (Math.abs(Number(evalArgs))).toString();
        default:
            return evalArgs;
    }
}

export async function matchCollection(varValue: string, variables: any, collectionName: string, codeService:CodeService) {
    let collectionAccess;
    if (collectionAccess = collectionName.match(REGEX_CONSTS.REGEX_COLLECTION_ACCESS)) {
        const value = collectionAccess[4]? collectionAccess[4] : collectionAccess[2];
        const index = collectionAccess[5]? collectionAccess[5] : collectionAccess[3];
        const accessIndex = evaluate(await applyFunctions(index, variables, codeService));
        //caso en que se indexa un string
        if(typeof(variables[value]) == 'string'){
            return variables[value][Number(index)]
        }
        var valueFromCollection = variables[value].access(accessIndex) ? variables[value].access(accessIndex) : 'None' 
        if(collectionAccess[1]){
            return Number(valueFromCollection);
        }
        return valueFromCollection;
    }
    const variable = variables[varValue]
    if(variable && variable instanceof Collection){
        varValue = variable.values
    }
    let varMatch;
    if (varValue.match(REGEX_CONSTS.REGEX_LIST)) {
        const values:any = varValue.slice(1, varValue.length - 1).replace(/\, /g, ',').split(',');
        for(let i = 0; i<values.length; i++){
            let variable;
            if(variables && (variable = variables[values[i]])){
                values[i] = variable
            }
            
        }
        return new List(values);
    } else if (varMatch = varValue.match(REGEX_CONSTS.REGEX_DICTIONARY)) {
        const dictionaryElements = varValue.slice(1, varValue.length - 1).replace(/\, /g, ',').split(',');
        const dictionary = new Dictionary();
        let element;
        if(dictionaryElements[0] != ''){
            for (element of dictionaryElements) {
                dictionary.add(element.toString());
            }
        }
        return dictionary;
    } else if (varValue.match(REGEX_CONSTS.REGGEX_SET)) {
        if(varValue == 'set()')
            return new Set();
        const values = varValue.slice(1, varValue.length - 1).replace(/\, /g, ',').split(',');
        return new Set(values);
    } else if (varValue.match(REGEX_CONSTS.REGGEX_TUPLE)) {
        const values = varValue.slice(1, varValue.length - 1).replace(/\, /g, ',').split(',');
        return new Tuple(values);
    }  else {
        return null;
    }
}

export function applyOperation(variableValue: number, operator: Operator, value: number): number {
    if (operator in operations) {
        return operations[operator](variableValue, value);
    } else {
        throw new Error('Operador no soportado');
    }
}


export async function replaceAsync(str: string, regex: RegExp, asyncFn: (match: string, ...args: any[]) => Promise<string>): Promise<string> {
    const promises: Promise<string>[] = [];
    str.replace(regex, (match, ...args) => {
        const promise = asyncFn(match, ...args);
        promises.push(promise);
        return match;
    });
    const data = await Promise.all(promises);
    return str.replace(regex, () => data.shift()!);
}


export function cleanPrintValue(value: string): string {
    value = value.replace(/^[^'"]*['"]/, '');
    value = value.replace(/^"|'(.*)"|'$/, '$1');
    value = value.replace(/["']/g, '');
    value = value.replace(/\\n|\n/g, '<br>');
    value = value.replace(/\\t|\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
    return value;
}

export function replaceVariablesInPrint(template: string, valores: { [clave: string]: any }): string {
    return Object.entries(valores).reduce((resultado, [clave, valor]) => {
        if(valor instanceof Collection){
            if(valor instanceof Dictionary){
                valor = Object.values(valor.values)
            } else {
                valor = valor.values
            }
        }
        const regex = new RegExp(`\\{\\b${printVarRegex(clave)}\\b\\}`, 'g');
        return resultado.replace(regex, valor);
    }, template);
}

function printVarRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}