import { REGEX_CONSTS } from "../constants";
import { CodeService } from "../services/code.service";
import { Structure } from "./structure";
import { VariablesService } from "../services/variables.service";
import { evaluate, replaceVariables } from "../utils";
import { Context } from "./context";
import { DefStructure } from "./structure-def";
import { StructureFactory } from "./structure-factory";
import { v4 as uuidv4 } from 'uuid';
import { Collection } from "./collection";

export class Coordinator {
    structures: any[] = [];
    code: string[] = [];
    codeService: CodeService;
    currentLine: number = 0;
    functions: { [key: string]: DefStructure } = {};
    executingFunction: boolean = false;
    contexts: Context[] = [new Context(uuidv4())];
    variablesService: any;
    constructor(codeService: CodeService, code: string, variablesService: VariablesService) {
        this.variablesService = variablesService;        
        this.codeService = codeService;
        this.code = code.split('\n');
        this.codeService.functions.subscribe(async (value: { [key: string]: DefStructure; })=> {
            this.functions = value;
        });
        this.variablesService.reset();
        this.codeService.addNewState(this);
    }

    private analize() {
        const matchResult = this.code[this.currentLine].match(/^\s*/);
        const level = matchResult ? matchResult[0].length / 4 : 0;
        const call = containsFunctionName(this.code[this.currentLine], this.functions);
        if(call != null){
            const context = new Context(uuidv4(), this.currentLine, call);
            if(this.code[this.currentLine].includes('def')){
                return;
            }
            const returnVar = this.code[this.currentLine].match(REGEX_CONSTS.REGEX_RETURN_VARIABLES);
            if (returnVar != null) {
                const varNames = returnVar[1].split(',').map((name: string) => name.trim());
                context.setReturnVarName(varNames);
            }   

            const func = this.functions[call].deepClone(this.contexts[this.contexts.length-1]);
            func.setContext(context);
            const params = this.code[this.currentLine].match(/\(([^)]+)\)/);
            if(params != null){
                const args = params[1].split(',').map((arg: string) => arg.trim());
                func.setParameters(args);
            }
            this.contexts.push(context);
            this.structures.push(func);
            this.executingFunction = true;
            this.currentLine = this.functions[call].position - 1;
            return;
        }

        const lastContext = this.contexts.pop();
        let clonedContext = null;
        if(lastContext){
            clonedContext = lastContext.clone();
        }
        const structure = StructureFactory.analize(this.code[this.currentLine], level, this.codeService, this.variablesService, lastContext ? clonedContext! : this.contexts[this.contexts.length - 1]);
        this.contexts.push(clonedContext ? clonedContext : this.contexts[this.contexts.length - 1]);
        this.structures.push(structure);
        structure.setScope(this.code.slice(this.currentLine).join('\n')); 
    }

    async executePrevious() {
        await this.codeService.getStateFromPreviousLine().then((response: any) => {
            if (response.previousState){
                this.currentLine = response.previousState.currentLine;
                this.structures = [];
                for (let i = 0; i < response.previousState.structures.length; i++) {
                    this.structures[i] = response.previousState.structures[i].clone(this.codeService, this.variablesService);
                }
                this.codeService.setPreviousFunctions(response.previousState.functions, this.variablesService);
                this.contexts = [...response.previousState.contexts.keys()]; 
                this.variablesService.setPreviousVariables(response.previousState.contexts);
                this.executingFunction = response.previousState.executingFunction;
                return;
            } 
        });
        
        if(this.currentLine == 0 && this.executingFunction){
            this.codeService.previousState(true);
        }else if(this.currentLine == 0 && !this.executingFunction){
            this.codeService.previousState(false);
        }
    }

    async executeForward() {
        let prevAmount = 0;
        let lastStructure = null;
        this.analize();
        for (let i = this.structures.length - 1; i >= 0; i--){
            const structure : Structure = this.structures[i];
            const result = await structure.execute(prevAmount);
            if (result.finish) {
                lastStructure = this.finishStructure(lastStructure, structure);
            }
            if(lastStructure && lastStructure.isFunction()){
                prevAmount = 1;
                lastStructure = null;
            }else{
                prevAmount += result.amount;
            }
            this.currentLine += result.amount;
            this.codeService.nextLine(result.amount, this);

            if (structure.isFunction() && !result.finish) {
                break;
            }
        }
        this.codeService.addNewState(this);
    }

    clone() {
        const newCoordinator:any = {}
        newCoordinator.currentLine = this.currentLine;
        newCoordinator.structures = this.structures.map(structure => structure.clone());
        let clonedFunctions: { [key: string]: DefStructure } = {};
        for (const key in this.functions) {
            if (this.functions.hasOwnProperty(key)) {
              clonedFunctions[key] = this.functions[key].clone();
            }
          }
        newCoordinator.functions = clonedFunctions;
        newCoordinator.contexts = new Map<Context, { [key: string]: any }>(
          this.contexts.map((context) => {
            const clonedContext = context.clone();
            const clonedVariables: { [key: string]: any } = {};
            const variables = this.variablesService.getVariables(context);
            Object.keys(variables).forEach((key) => {
                if(variables[key] instanceof Collection){
                    clonedVariables[key] = variables[key].clone();
                    return;
                }
                clonedVariables[key] = variables[key];
            });
            return [clonedContext, { ...clonedVariables }];
          })
        );
        newCoordinator.executingFunction = this.executingFunction;
        return newCoordinator;
    }

    reset(){
        this.structures = [];
        this.currentLine = 0;
        this.executingFunction = false;
        this.contexts = this.contexts.slice(0, 1);
        this.variablesService.reset();
    }

    private finishStructure(lastStructure: any, structure: Structure){
        if(structure == this.structures[this.structures.length - 1]){
            lastStructure = this.structures.pop();
        }else if(structure.isFunction() && structure != this.structures[this.structures.length - 1]){
            let j = this.structures.length - 1;
            while(j >= 0 && !this.structures[j].isFunction() && this.structures[j] != structure){
                this.structures.pop();
                j--;
            }
            lastStructure = this.structures.pop();
        }
        if(this.executingFunction && structure.isFunction()){
            const lastContext = this.contexts.pop();
            this.codeService.goToLine(lastContext!.getCallLine() + 1, this);
            this.currentLine = lastContext!.getCallLine();
            const variables = this.variablesService.getVariables(this.contexts[this.contexts.length - 1]);
            const returnVar = lastContext?.getReturnValue();
            if(returnVar){
                for(let i = 0; i < returnVar.names.length; i++){
                    variables[returnVar.names[i]] = returnVar.values[i];
                }
            }
            this.variablesService.deleteContext(lastContext);
            this.variablesService.setVariables(this.contexts[this.contexts.length-1], variables);
        }
        return lastStructure;
    }
}

function containsFunctionName(str: string, dict: {[key: string]: any}): string | null{
    for (let key in dict) {
        if (new RegExp(`\\b${key}\\(`).test(str)) {
            return key; 
        }
    }
    return null;
}

