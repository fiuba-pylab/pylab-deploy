export abstract class Collection{
    values:any[] | any
    constructor(initialValues?:any[] | any){
        this.values = (initialValues && initialValues[0]  === '' ? [] : initialValues)
    }
    
    abstract add(element:any):void

    abstract substract(element?:any):void

    abstract access(index:string):void

    abstract insert(index: number | string, value:any):void

    abstract print():string

    len(): number{
        return this.values.length
    }

    in(element:any): boolean{
        return this.values.includes(element)
    }
}

