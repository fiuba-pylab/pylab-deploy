import { Collection } from "./collection";

export class List extends Collection{

    override add(element:any){
        this.values.push(element)
    }

    override substract(element?: any): void {
        this.values.splice(this.values.indexOf(element), 1)
    }

    override access(index:string){
        return this.values[Number(index)]
    }

    override insert(index:number, value:any){
        this.values[index] = value
    }
    
    override print(): string {
        let values_aux = []
        for(let value of this.values){
            if(value instanceof Collection){
                values_aux.push(value.print())
            } else {
                values_aux.push(value)
            }
        }
        return '['+values_aux+']';
    }

    override clone(): Collection {
        const clone = new List();
        clone.values = JSON.parse(JSON.stringify(this.values));
        return clone;
    }
}