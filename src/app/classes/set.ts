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

    intersection(...sets: Set[]): Set{
        const result = new Set();

        if (sets.length === 0) {
            return result;
        }

        const allSets = [this, ...sets];

        result.values = this.values.filter((value: any) =>
            allSets.every((set) => set.values.includes(value))
        );
    
        return result;
    }

    difference(...sets: Set[]): Set {
        const result = new Set();

        if (sets.length === 0) {
            result.values = [...this.values];
            return result;
        }

        const otherValues = sets.flatMap(set => set.values.map((value: string) => value.trim()));

        result.values = this.values.filter((value: any) => !otherValues.includes(value.trim()));

        return result;
    }
}