import { CodeService } from "../services/code.service";
import { REGEX_CONSTS } from "../constants";
import { VariablesService } from "../services/variables.service";
import { evaluate, replaceVariables } from "../utils";
import { Context } from "./context";
import { Structure } from "./structure";
import { Collection } from "./collection";

export class DefStructure extends Structure{
    constructor(level: number, condition: string, codeService: CodeService | null, variablesService: VariablesService | null, context: Context) {
        super(level, condition, codeService, variablesService, context);
        if (codeService) this.position = codeService!.getHighlightLine();
        const definition = condition.match(REGEX_CONSTS.REGEX_DEF);
        if (definition != null) {
            const params = definition[2].split(",").map((arg: string) => arg.trim());
            this.parameters = params.reduce((acc: any, param: string) => {
                if(param.match(REGEX_CONSTS.REGEX_NAMED_PARAMS)){
                    const [key, value] = param.split("=");
                    acc[key.trim()] = [evaluate(value)];
                    return acc;
                }
                acc[param] = [];
                return acc;
            }, {});
            this.name = definition[1].trim();
        }
    }
    currentLine: number = -1;
    parameters: { [key: string]: any } = {};
    name: string = "";
    position: number = 0;
    called: boolean = false;
    myContext: Context | undefined;
    setScope(code: any){
        const lines: any[] = code.split('\n');
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            
            const tabs = Math.round(line.match(/^\s*/)[0].length / 4);
            if(tabs > this.level){
                this.lines.push(line);
            }

            if(tabs <= this.level || line.match(/^\n*/)[0].length == 1){
                break;
            }
        }
        this.codeService!.setFunction(this.name, this);
    }

    override execute(amountToAdd?: number): {amount: number, finish: boolean}{
        // si es la primera vez que llamo al execute, quiere decir que es cuando 
        // se declaro la funcion, entonces tengo que avanzar hasta salir del scope de la
        // funcion para que se vuelva aca solo si se llamo a la funcion en el programa
        if(this.currentLine == -1){ 
            this.currentLine++;
            return {amount: this.lines.length+1, finish: true};
        }

        // llamaron a la funcion
        if(this.currentLine == 0 && !this.called){ 
            this.called = true;
            this.codeService!.goToLine(this.position);
            return {amount: 0, finish: false};
        }

        if(this.currentLine == 0 && this.called){
            this.currentLine++;
            return {amount: 1, finish: false};
        }

        if(this.lines[this.currentLine-1].trim().match(REGEX_CONSTS.REGEX_RETURN) && this.currentLine != this.lines.length){
            return {amount: 1, finish: true};
        }

        this.currentLine += amountToAdd ?? 1;

        // ejecutando la función
        if (this.currentLine > 0 && this.currentLine <= this.lines.length){
            return {amount: 0, finish: false};    
        } else { // termine de ejecutar la función
            return {amount: 1, finish: true};
        }
    }

    override isFunction(): boolean {
        return true;
    }

    setParameters(args: string[]){
        const variables = this.variablesService!.getVariables(this.context);
        Object.keys(this.parameters).forEach((param, index) => {
            if(args[index]){
                const match = args[index].match(REGEX_CONSTS.REGEX_NAMED_PARAMS);
                if(match){
                    const key = match[1];
                    const value = match[2];
                    this.parameters[key] = evaluate(replaceVariables(value, variables));
                    return;
                }
                if(!this.parameters[param]){
                    this.parameters[param] = []
                }
                if(args[index]){
                    if(variables[args[index]] instanceof Collection){
                        this.parameters[param] = variables[args[index]]
                    } else {
                        this.parameters[param] = evaluate(replaceVariables(args[index], variables));
                    }
                }
            }
        });

        if (this.myContext) {
            this.variablesService!.setVariables(this.myContext, this.parameters);
        }
    }

    setContext(context: Context){
        this.myContext = context;
    }

    insideAFunction(): boolean {
        return (this.context.name != 'global');
    }

    deepClone(context: Context): DefStructure {
        const clone = new DefStructure(
            this.level,
            this.condition,
            this.codeService,       
            this.variablesService!,  
            context!
        );
        
        clone.currentLine = this.currentLine;
        clone.parameters = JSON.parse(JSON.stringify(this.parameters));
        clone.name = this.name;
        clone.position = this.position;
        clone.called = this.called;
        
        clone.lines = [...this.lines];
        
        return clone;
    }

    override clone(codeService: CodeService | null = null, variablesService: VariablesService | null = null): DefStructure {
        const clone = new DefStructure(
            this.level,
            this.condition,
            codeService,
            variablesService,  
            this.context.clone()
        );
        
        clone.currentLine = this.currentLine;
        clone.parameters = JSON.parse(JSON.stringify(this.parameters));
        clone.name = this.name;
        clone.position = this.position;
        clone.called = this.called;
        clone.myContext = this.myContext ? this.myContext.clone() : undefined;
        
        clone.lines = [...this.lines];
        
        return clone;
    }
}