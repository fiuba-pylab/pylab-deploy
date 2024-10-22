import { Collection } from "./collection";

export class Tuple extends Collection{
    override add(element:any){
        this.values.push(element)
    }

    override substract(element?: any): void {
        
    }

    override access(index:string){
        return this.values[Number(index)]
    }


    override insert(index:number, value:any){}

    override print(): string {
        return '('+this.values+')';

    }
}