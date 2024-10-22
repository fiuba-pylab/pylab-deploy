import { Structure } from "./structure";
import { evaluate, replaceOperators, replaceVariables } from "../utils";
import { CodeService } from "../services/code.service";
import { VariablesService } from "../services/variables.service";
export class WhileStructure extends Structure{
    super(){}
    currentLine: number = 0;
    setScope(code: any){
        const lines: any[] = code.split('\n');
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            
            const tabs = line.match(/^\s*/)[0].length / 4;
            if(tabs > this.level){
                this.lines.push(line);
            }

            if(tabs <= this.level || line.match(/^\n*/)[0].length == 1){
                break;
            }
        }
    }

    override execute(amountToAdd?: number): {amount: number, finish: boolean}{
        const variables = this.variablesService!.getVariables(this.context);
        var condition_replaced = replaceOperators(replaceVariables(this.condition, variables));
        if(this.currentLine == this.lines.length && evaluate(condition_replaced)){
            this.currentLine = 1;
            if(this.collectionInfo){
                const collection = variables[this.collectionInfo.varIteratorName]
                const collectionIsArray = collection?.values.length
                const variableForArray = variables['ForIteratorVariable'+this.collectionInfo.tempVarName]

                const inverseActualIndex = Number(variableForArray[variableForArray.length-1])-1
                //decremento la variables inyterna del for
                variables['ForIteratorVariable'+this.collectionInfo.tempVarName].push(inverseActualIndex)

                //cambio el valor de la variable a iterar
                const index = collectionIsArray?(collection.values.length-1 - inverseActualIndex):(Object.keys(collection?.values).length-1 - inverseActualIndex)
                variables[this.collectionInfo.tempVarName] = collection.values[collectionIsArray?index:Object.keys(collection?.values)[index]]
            }
            return {amount: -(this.lines.length), finish: false};

        }
        if(this.currentLine == this.lines.length && !evaluate(condition_replaced)){
            return {amount: 0, finish: true};
        }
        if(this.currentLine > 0 && this.currentLine < this.lines.length){
            this.currentLine += amountToAdd ?? 0;
            return {amount: 0, finish: false};
        }
        if(evaluate(condition_replaced)){
            this.currentLine++;
            return {amount: 1, finish: false};
        }
        return {amount: this.lines.length+1, finish: true};
    }

    override clone(codeService: CodeService | null = null, variablesService: VariablesService | null = null): Structure {
        let clone = new WhileStructure(this.level, this.condition, codeService, variablesService, this.context)
        clone.currentLine = this.currentLine;
        clone.lines = [...this.lines];

        return clone;
    }
}