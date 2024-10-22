import { Collection } from "./collection";

export class Dictionary extends Collection{
    constructor(){
        super()
        this.values = {}
    }
    
    override add(element:string){
        const components = element.split(": ")
        this.values[components[0]] = components[1]
    }

    override substract(element?: any): void {
    }

    access(index:string){
        return this.values[index]
    }

    override insert(index:string, value:any){
        this.values[index] = value
    }

    override print(): string {
        const cleanedValues = Object.fromEntries(
          Object.entries(this.values).map(([key, value]) => [
            key.replace(/^"|"$/g, ''),  
            (value as string).replace(/^"|"$/g, '') 
          ])
        );
        return JSON.stringify(cleanedValues);
    }
      
}