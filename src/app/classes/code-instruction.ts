import { CodeService } from "../services/code.service";
import { VariablesService } from "../services/variables.service";
import { NATIVE_FUNCTIONS, REGEX_CONSTS, VALID_OPERATORS } from "../constants";
import { evaluate, replaceVariables } from "../utils";
import { Dictionary } from "./dictionary";
import { List } from "./list";
import { Structure } from "./structure";
import { Tuple } from "./tuple";
import { Collection } from "./collection";
import { Set } from "./set";
import { Executor } from "./executor";

export class CodeInstruction extends Structure {
    super() { }
    setScope(code: any) {
        const lines: any[] = code.split('\n');
        this.lines.push(lines[0]);
    }


    override async execute(): Promise<{ amount: number; finish: boolean; }> {
        
        
        this.lines[0] = this.lines[0].trim();
        if (this.lines[0].split(' ')[0] == 'elif') {
            return { amount: 0, finish: true };
        }
        const executor = new Executor(this.lines, this.codeService, this.variablesService, this.context)
        let ret = null;
        return (ret = await executor.checkVariableDeclaration())?ret:
        (ret = await executor.checkCollectionSetOperations())?ret: 
        (ret = await executor.checkOperations())?ret:
        (ret = await executor.checkPrint())?ret:
        (ret = await executor.checkCollectionAdd())?ret:
        (ret = await executor.checkCollectionSubstract())?ret:
        (ret = await executor.checkCollectionIndexing())?ret:
        (ret = await executor.checkReturn())?ret:
        { amount: 1, finish: true }
        
    }

    override clone(codeService: CodeService | null, variablesService: VariablesService | null): Structure {
        return new CodeInstruction(this.level, this.condition, codeService, variablesService, this.context);
    }

    

}

