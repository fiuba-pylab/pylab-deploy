import { Collection } from "./collection";

export class Set extends Collection{
    override add(element:any){
        this.values.push(element)
    }

    override substract(element?: any): void {
        this.values.splice(this.values.indexOf(element), 1)
    }

    override access(index: string): void {
        
    }


    override insert(index:number, value:any){}
    
    override print(): string {
        return '('+this.values+')';

    }
}