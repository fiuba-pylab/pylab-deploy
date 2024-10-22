import { cloneDeep } from 'lodash';

export class Context{
    name: string = 'global';
    id: string = '';
    return: any[] = [];
    returnVariables: string[] = [];
    callLine: number = 0;
    constructor(id: string, funcCallLine?: number, name?: string){
        this.id = id;
        if(funcCallLine){
            this.callLine = funcCallLine;
        }
        if(name){
            this.name = name;
        }
    }

    setReturnValue(value: any[]){
        this.return = value;
    }

    setReturnVarName(variable: string[]){
        this.returnVariables = variable;
    }

    getReturnValue(){
        return {names: this.returnVariables, values: this.return};
    }

    getCallLine(){
        return this.callLine;
    }

    clone(): Context{
        return cloneDeep(this);
    }
}