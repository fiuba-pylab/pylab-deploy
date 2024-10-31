import { NATIVE_FUNCTIONS, REGEX_CONSTS, STRUCTURES } from "../constants";
import { CodeService } from "../services/code.service";
import { VariablesService } from "../services/variables.service";
import { Collection } from "./collection";
import { Context } from "./context";
import { List } from "./list";
import { DefStructure } from "./structure-def";
import { IfStructure } from "./structure-if";
import { NullStructure } from "./structure-null";
import { IterableStructure } from "./structure-iterable";


export class StructureFactory {
    
    static analize(code: string, level: number, codeService: CodeService, variablesService: VariablesService, context: Context){
        const first_word = code.trim().split(' ')[0]; 
        switch(first_word){
            case STRUCTURES.IF: 
                return new IfStructure(level, detectCondition(code), codeService, variablesService, context);
            case STRUCTURES.WHILE:
                return new IterableStructure(level, detectCondition(code), codeService, variablesService, context);
            case STRUCTURES.FOR:
                const {newCondition, collectionInfo} = forConfiguration(code, variablesService, context)
                return new IterableStructure(level, newCondition, codeService, variablesService, context, collectionInfo);
            case STRUCTURES.DEF:
                return new DefStructure(level, code, codeService, variablesService, context);
            default:
                return new NullStructure(level, "", codeService, variablesService, context);
        }        
    }

}

function forConfiguration(code:string, variablesService: VariablesService, context:Context){
    const condition = detectCondition(code)
    const variables = variablesService.getVariables(context);
    const collectionIteration = condition.match(REGEX_CONSTS.REGEX_FOR);
    let newCondition = '';
    let collectionInfo:any = {}
    if(collectionIteration){
        const varIteratorName = condition.split(' ')[2]
        let collection:Collection
        if(varIteratorName.includes(NATIVE_FUNCTIONS.RANGE)){
            const auxiliar_array = []
            const var_name = varIteratorName.replace(/[\(\)]|range/g,'')
            const array_size = variables[var_name].values.length
            for(let i = 0; i< array_size; i++){
                auxiliar_array.push(i)
            }
            collectionInfo['varIteratorName'] = 'range_' + var_name
            collection = new List(auxiliar_array)
            variables['range_' + var_name] = collection
        } else {
            collectionInfo['varIteratorName'] = varIteratorName
            collection = variables[varIteratorName]
        }
        
        const tempVarName = condition.split(' ')[0]
        collectionInfo['tempVarName'] = tempVarName
        const collectionIsArray = collection?.values.length
        const numberValuesCollection = collectionIsArray?collectionIsArray:(Object.keys(collection?.values).length)
        //definición del iterador
        variables['ForIteratorVariable' + tempVarName] = numberValuesCollection - 1;
        //definición de la variable a iterar
        variables[tempVarName] = collection?.values[collectionIsArray?0:Object.keys(collection?.values)[0]]
        newCondition = `ForIteratorVariable${tempVarName} > 0`
    }
    return {newCondition, collectionInfo}
}

function detectCondition(code: string){
    const words = code.trim().split(' ')    
    const condition = words.slice(1, words.length).join(' ').slice(0, -1);
    return condition
}