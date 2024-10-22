import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Context } from "../classes/context";

@Injectable({
    providedIn: 'root',
})
export class VariablesService {
    private behaviorSubjectContexts = new BehaviorSubject<Map<Context, { [key:string]: any }>>(new Map<Context, { [key:string]: any }>());
      
    contexts = this.behaviorSubjectContexts.asObservable();

    constructor() {}

    getVariables(p_context: Context): { [key:string]: any }  {
        for (const [context, variables] of this.behaviorSubjectContexts.value.entries()) {
            if (context.id === p_context.id) {
                return variables;
            }
        }
        return {};
    }

    setVariables(p_context: Context, variables: any): void {
        let existingContext: Context | undefined;

        for (const context of this.behaviorSubjectContexts.value.keys()) {
            if (context.id === p_context.id) {
                existingContext = context;
                break;
            }
        }

        let contexts = new Map<Context, { [key:string]: any }>(this.behaviorSubjectContexts.value);
        if (existingContext) {
            contexts = this.behaviorSubjectContexts.value.set(existingContext, variables);
        } else {
            contexts = this.behaviorSubjectContexts.value.set(p_context, variables);
        }

        this.behaviorSubjectContexts.next(contexts);
    }

    setPreviousVariables(p_contexts: Map<Context, { [key:string]: any }>){
        const contexts = new Map<Context, { [key: string]: any }>();
        for (const [context, variables] of p_contexts.entries()) {
            const clonedContext = context.clone();
            contexts.set(clonedContext, { ...variables });
        }
        this.behaviorSubjectContexts.next(contexts);
    }

    deleteContext(context: Context): void {
        for(const [key, _] of this.behaviorSubjectContexts.value.entries()){
            if(key.id === context.id){
                this.behaviorSubjectContexts.value.delete(key);
                break;
            }
        }
        this.behaviorSubjectContexts.next(this.behaviorSubjectContexts.value);
    }

    reset(){
        this.behaviorSubjectContexts.next(new Map<Context, { [key:string]: any }>());
    }
}