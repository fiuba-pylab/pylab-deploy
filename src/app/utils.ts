import { Collection } from "./classes/collection";
import { NATIVE_FUNCTIONS, REGEX_CONSTS } from "./constants";

export function replaceVariables(template: string, valores: { [clave: string]: any[] }): string {

    return Object.entries(valores).reduce((resultado, [clave, valor]) => {
        const regex = new RegExp(`\\b${escapeRegExp(clave)}\\b`, 'g');
        var replacement;
        
        if(valor instanceof Collection){
            return resultado;
        }
        if(typeof valor === 'string'){
            if(`'${valor}'`.match(NATIVE_FUNCTIONS.NONE)){
                replacement = 'None'
            } else {
                replacement = `'${valor}'`
            }
        }else{
            replacement = valor;
        }
       
        return resultado.replace(regex, Array.isArray(replacement) ? JSON.stringify(replacement) : replacement);
    }, template);
}
function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function replaceOperators(template: string): string {
    return template
            .replace(/and/g, '&&')
            .replace(/or/g, '||')
            .replace(/is not/g, '!=')
            .replace(/is/g, '==')
            .replace(/False/g, 'false')
            .replace(/True/g, 'true');
}

export function evaluate(code: any): any {
    // TODO: Sanitize input
    const match_multiply = code.match(REGEX_CONSTS.REGEX_MULTIPLY_LETTERS)
    if(match_multiply){
        return match_multiply[2].repeat(Number(eval(match_multiply[1])))
    }

    code = code.replace(NATIVE_FUNCTIONS.NONE, "'None'")
    
    code = code.replace(REGEX_CONSTS.REGEX_MULTIPLY_LETTERS, (match: any, expr: string, letter: string) => {
        const number = eval(expr.trim());
        return `'${letter.repeat(number)}'`;
    });
    

    while (REGEX_CONSTS.REGEX_IN_OPERATION.test(code)) {
        code = code.replace(REGEX_CONSTS.REGEX_IN_OPERATION, (match: any, number: string, collection: any) => {
            if(collection.split(',').map((num: string) => parseInt(num)).includes(parseInt(number))){
                return 'true';
            }
            return 'false';
        });
    }

    while (REGEX_CONSTS.REGEX_NOT_IN_OPERATION.test(code)) {
        code = code.replace(REGEX_CONSTS.REGEX_NOT_IN_OPERATION, (match: any, number: string, collection: any) => {
            if(!collection.split(',').map((num: string) => parseInt(num)).includes(parseInt(number))){
                return 'true';
            }
            return 'false';
        });
    }

    while (REGEX_CONSTS.REGEX_DIVISION.test(code)) {
        code = code.replace(REGEX_CONSTS.REGEX_DIVISION, (match: any, num1: string, num2: string) => {
            const result = Math.floor(parseInt(num1) / parseInt(num2));
            return result.toString();
        });
    }
   
    while (REGEX_CONSTS.REGEX_EXPONENT.test(code)) {
        code = code.replace(REGEX_CONSTS.REGEX_EXPONENT, (match: any, num1: string, num2: string) => {
            const result = Math.pow(parseFloat(num1), parseFloat(num2));
            return result.toString();
        });
    }

    if(code.match(REGEX_CONSTS.IMAGINARY)){
        return complex_evaluation(code)
    }

    try {
        return eval(code);
    } catch (e) {
        console.error(e);
        return code;
    }
}

function complex_evaluation(code:string){
    const imaginary = code.match(REGEX_CONSTS.IMAGINARY)??''
    const real_part = eval(code.replace(imaginary[0], ''))
    const imaginary_part = eval(code.replace(REGEX_CONSTS.REAL, '').replace('i',''))
    return real_part + ` ${imaginary[0][0]} ` + imaginary_part + 'i'
}


