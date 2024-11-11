import { NATIVE_FUNCTIONS, REGEX_CONSTS, VALID_OPERATORS } from "../constants";
import { CodeService } from "../services/code.service";
import { VariablesService } from "../services/variables.service";
import { evaluate, replaceVariables } from "../utils";
import { Collection } from "./collection";
import { Context } from "./context";
import { Dictionary } from "./dictionary";
import { List } from "./list";
import {Set} from "./set"
import { Tuple } from "./tuple";
import {replaceVariablesInPrint, cleanPrintValue, matchCollection, applyOperation, evaluateExpression, applyFunctions} from "./executor-utils"

const collectionOperations: { [key: string]: (set: Set, ...sets: Set[]) => Set } = {
    intersection: (set, ...sets) => set.intersection(...sets),
    difference: (set, ...sets) => set.difference(...sets),
    '&': (set, ...sets) => set.intersection(...sets),
    '-': (set, ...sets) => set.difference(...sets),
    '|': (set, ...sets) => set.union(...sets),
    '^': (set, ...sets) => set.symmetric_difference(...sets),
};

const collectionSetOps = {
    '-': (set: Set, values: []) => values.forEach((value: string) => set.substract(value)),
    '|': (set: Set, values: []) => values.forEach((value: string) => set.add(value)),
};

type SetOperator = keyof typeof collectionSetOps;

export class Executor{
    lines:string[];
    codeService: CodeService | null;
    variablesService: VariablesService | null
    context: Context;
    variables : { [key:string]: any } 
    constructor(lines:string[], codeService:CodeService | null, variablesService: VariablesService | null, context: Context ){
        this.lines = lines
        this.codeService = codeService
        this.variablesService = variablesService
        this.context = context

        this.variables = this.variablesService!.getVariables(this.context);
    }

    async checkPrint(){
        
        const print = this.lines[0].match(REGEX_CONSTS.REGEX_PRINT);
        if (print) {
            let value = print[1]
            if (print[2]) {
                value = print[2]
            }
            let printValue = replaceVariablesInPrint(value, this.variables);
            printValue = await evaluateExpression(printValue, this.codeService!);
            printValue = cleanPrintValue(printValue);

            const end = printValue.match(REGEX_CONSTS.REGEX_PRINT_END);
            if(end){
                printValue = printValue.replace(REGEX_CONSTS.REGEX_PRINT_END, ' ');
            }else{
                printValue = printValue + '<br>';
            }
            this.codeService!.setPrint(printValue);
        }
        this.variablesService!.setVariables(this.context, this.variables);
        return null
    }

    async checkVariableDeclaration(){
        const variableDeclaration = this.lines[0].match(REGEX_CONSTS.REGEX_VARIABLE_DECLARATION);
        if (variableDeclaration) {
            const varName = variableDeclaration[1];
            let varValue = variableDeclaration[2];
            let collectionFunctions = varValue.match(REGEX_CONSTS.REGEX_COLLECTION_LEN);
            let collectionsIn = varValue.match(REGEX_CONSTS.REGEX_IN_COLLECTIONS);
            let collectionsOperations = varValue.match(REGEX_CONSTS.REGEX_BETWEEN_SET_OPERATIONS);
            let split = varValue.match(REGEX_CONSTS.REGEX_SPLIT);
 
            if(split){
                 const variable = split[1];
                 this.variables[varName] = new List(this.variables[variable].replace(/,/g, '').replace(/'/g, '').split(' '));
                 this.variablesService!.setVariables(this.context, this.variables);
                 return { amount: 1, finish: true };
            }
            
            if(collectionFunctions){
                this.variables[varName] = this.variables[collectionFunctions[1]]?.len();
                this.variablesService!.setVariables(this.context, this.variables);
                return { amount: 1, finish: true };
            }
 
             if(collectionsIn){
                 const elemento = await applyFunctions(collectionsIn[1], this.variables, this.codeService!);
                 const variable = collectionsIn[2];
                 if(this.variables[variable].in(elemento.replace(/^'|'$/g, ''))){
                    this.variables[varName] = 'True';
                 }else{
                    this.variables[varName] = 'False';
                 }
                 this.variablesService!.setVariables(this.context, this.variables);
                 return { amount: 1, finish: true };
             }
 
             if(collectionsOperations){
                 const variable = collectionsOperations[1];
                 const operation = collectionsOperations[2];
                 const values = collectionsOperations[3].split(',').map((value: string) => value.trim());
                 const sets = values.map((value: string) => this.variables[value]);
                 if (collectionOperations[operation] && this.variables[variable] && this.variables[variable] instanceof Set) {
                     this.variables[varName] = collectionOperations[operation](this.variables[variable], ...sets);
                     this.variablesService!.setVariables(this.context, this.variables);
                     return { amount: 1, finish: true };
                 }  
             }
             varValue = await  applyFunctions(variableDeclaration[2], this.variables, this.codeService!,varName);
             console.log("varValue", varValue)
             let collection = await matchCollection(varValue, this.variables, variableDeclaration[2], this.codeService!);
          
             if (!collection) {
                 this.variables[varName] = evaluate(varValue);
             } else {
                 this.variables[varName] = collection;
             }
         }
         this.variablesService!.setVariables(this.context, this.variables);
         return null
    }

    async checkCollectionSetOperations(){
        const collectionSetOperations = this.lines[0].match(REGEX_CONSTS.REGEX_SET_OPERATIONS);
        if(collectionSetOperations){
            const variable = collectionSetOperations[1];
            const operator = collectionSetOperations[2];
            const values:any = collectionSetOperations[3].trim();
            if(this.variables[variable] && this.variables[variable] instanceof Set){
                collectionSetOps[operator as SetOperator](this.variables[variable], values.split(',').map((value: string) => value.trim().replace(/^'|'$/g, '')));
            }
            this.variablesService!.setVariables(this.context, this.variables);
            return { amount: 1, finish: true };
        }
        this.variablesService!.setVariables(this.context, this.variables);
        return null
    }

    async checkOperations(){
        const operations = this.lines[0].match(REGEX_CONSTS.REGEX_OPERATIONS);
        if (operations) {
            const variable = operations[1];
            const operator:any = operations[2];
            let value = operations[3];
            value = await applyFunctions(value, this.variables, this.codeService!);
            this.variables[variable] = applyOperation(Number(replaceVariables(variable, this.variables)), operator, Number(evaluate(value)));
        }
        this.variablesService!.setVariables(this.context, this.variables);
        return null
    }

    async checkCollectionAdd(){
        const collectionAdd = this.lines[0].match(REGEX_CONSTS.REGEX_COLLECTION_ADD);
        if (collectionAdd) {
            const variable = collectionAdd[1];
            const operator = collectionAdd[2];
            const value = collectionAdd[3];
            if (VALID_OPERATORS.validAddOperators.includes(operator)) {
                this.variables[variable].add(await applyFunctions(value, this.variables, this.codeService!,variable))
            } else if (collectionAdd[5] == '+') {
                let tuple;
                let values = []
                if(tuple = this.variables[collectionAdd[6]]){
                    values = tuple.values
                } else {
                    values = collectionAdd[6].split(', ')
                }
                for (let tupleValue of values) {
                    this.variables[collectionAdd[4]].add(tupleValue)
                }
            }
        }
        this.variablesService!.setVariables(this.context, this.variables);
        return null
    }

    async checkCollectionSubstract(){
        const collectionSubstract = this.lines[0].match(REGEX_CONSTS.REGEX_COLLECTION_SUBSTRACT);
        if (collectionSubstract) {
            const variable = collectionSubstract[1];
            const operator = collectionSubstract[2];
            const value = collectionSubstract[3];
            if (VALID_OPERATORS.validSubstractOperators.includes(operator)) {
                this.variables[variable].substract(await applyFunctions(value, this.variables, this.codeService!,variable))
            }
        }
        this.variablesService!.setVariables(this.context, this.variables);
        return null
    }

    async checkReturn(){
        const isReturn = this.lines[0].match(REGEX_CONSTS.REGEX_RETURN);
        if (isReturn) {
            let values = isReturn[1].split(',').map((value: string) => value.trim());
            if (values) {
                for (let i = 0; i < values.length; i++) {
                    let value = await applyFunctions(values[i], this.variables, this.codeService!)
                    values[i] = evaluate(value);
                }
                this.context.setReturnValue(values);
            }
        }
        this.variablesService!.setVariables(this.context, this.variables);
        return null
    }

    async checkCollectionIndexing(){
        const collectionIndexing = this.lines[0].match(REGEX_CONSTS.INDEXING_COLLECTION)
        if(collectionIndexing){
            const collection_index = this.lines[0].split('=')[0]
            const varnName = collection_index.split('[')[0]
            let collection:Collection
            if(collection = this.variables[varnName]){
                const values = this.lines[0].split('=')[1]
                let varValue = evaluate(await  applyFunctions(values, this.variables, this.codeService!));
                const index_values = collection_index.split('[')[1].slice(0, -2)
                const evaluate_index = evaluate(await applyFunctions(index_values, this.variables, this.codeService!))
                collection.insert(evaluate_index, varValue)
            }
        }
        this.variablesService!.setVariables(this.context, this.variables);
        return null
    }

    

}