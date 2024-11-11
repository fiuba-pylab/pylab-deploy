import { Collection } from "./collection";

export class Set extends Collection{
    constructor(values?: any){
        if (values){
            super(values);
            return;
        }
        super();
        this.values = [];
    }
    override add(element: any) {
        if (!this.values.includes(element)) {
            this.values.push(element);
        }
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

    union(...sets: Set[]): Set {
        const result = new Set();
        const allValues = new Set();
    
        const allSets = [this, ...sets];
        allSets.forEach(set => {
            set.values.forEach((value: string) => {
                allValues.add(value.trim()); 
            });
        });
    
        result.values = Array.from(allValues.values);
    
        return result;
    }

    symmetric_difference(...sets: Set[]): Set {
        const result = new Set();
        const allValues = [...this.values, ...sets.flatMap(set => set.values.map((value: any) => value.trim()))];

        allValues.forEach((value: any) => {
            const isInThisSet = this.values.includes(value);
            const isInOtherSets = sets.some(set => set.values.includes(value));

            if (isInThisSet !== isInOtherSets) { 
                result.add(value);
            }
        });

        return result;
    }

    override clone(): Collection {
        const clone = new Set();
        clone.values = [...this.values];
        return clone;
    }
    
}