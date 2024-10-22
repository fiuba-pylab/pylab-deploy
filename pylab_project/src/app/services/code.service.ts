import { Inject, Injectable, InjectionToken } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProgramInput } from '../pages/program-display/program-input/program-input.component';
import { BehaviorSubject, firstValueFrom, lastValueFrom, Observable, take } from 'rxjs';
import { DefStructure } from '../classes/structure-def';
import { AppState } from '../ngrx/models';
import { Store } from '@ngrx/store';
import * as actions from "../ngrx/actions";
import { Coordinator } from '../classes/coordinator';
import { selectPastStates } from '../ngrx/actions';
import { VariablesService } from './variables.service';

export const CODE_LENGTH_TOKEN = new InjectionToken<number>('codeLength');

@Injectable({
  providedIn: 'root',
})
export class CodeService {
  private length: number = 0;
  private behaviorSubjectHighlight = new BehaviorSubject<number>(1);
  private behaviorSubjectPrint = new BehaviorSubject<string>('');
  private behaviorSubjectPause = new BehaviorSubject<boolean>(false);
  private behaviorOpenDialog = new BehaviorSubject<{msg: string, varName: string}>({msg: "", varName: ""});
  private behaviorSubjectFunctions = new BehaviorSubject<{
    [key: string]: DefStructure;
  }>({});
  dialog: MatDialog | undefined;
  private behaviorSubjectPreviousActivated = new BehaviorSubject<boolean>(false);

  inputs: any[] | undefined;
  highlightLine = this.behaviorSubjectHighlight.asObservable();
  print = this.behaviorSubjectPrint.asObservable();
  functions = this.behaviorSubjectFunctions.asObservable();
  pause = this.behaviorSubjectPause.asObservable(); 
  previousActivated = this.behaviorSubjectPreviousActivated.asObservable();

  constructor(private store: Store<AppState>) {}

  setLength(length: number): void {
    this.length = length;
  }

  getHighlightLine(): number {
    return this.behaviorSubjectHighlight.value;
  }

  nextLine(amount: number, coordinator: Coordinator) {
    var highlightLine = this.behaviorSubjectHighlight.value;
      if (highlightLine !== null && highlightLine < this.length) {
        highlightLine = highlightLine + amount;
        this.behaviorSubjectHighlight.next(highlightLine);
      }
  }

  getStateFromPreviousLine() {
    return new Promise(async (resolve, reject) => {
      const pastStates = await firstValueFrom(this.store.select(selectPastStates));
      if (pastStates.length > 0) {
        const previousState = pastStates[pastStates.length - 1];

        this.behaviorSubjectHighlight.next(previousState.highlightLine);
        this.behaviorSubjectPrint.next(previousState.print);
        this.store.dispatch(actions.goBack());

        resolve({ previousState: previousState });
        return;
      }
    });
  }

  reset() {
    this.behaviorSubjectHighlight.next(1);
    this.behaviorSubjectFunctions.next({});
    this.behaviorSubjectPrint.next('');
    this.store.dispatch(actions.resetState());
  }

  setPrint(value: string): void {
    const newValue = this.behaviorSubjectPrint.value + value;
    this.behaviorSubjectPrint.next(newValue);
  }

  async getInput(msg: string, varName: string): Promise<string> {

    this.behaviorSubjectPause.next(true); 
    this.behaviorOpenDialog.next({msg, varName});
    let dialog = this.dialog?.open(ProgramInput, {
      data: {
        title: msg,
        options:
          this.inputs?.find((input) => input.name === varName)?.options ?? [],
      },
      disableClose: true,
    });
    if (dialog) {
      
      let ret = await lastValueFrom(dialog.afterClosed());
      this.behaviorSubjectPause.next(false); 
      return ret
    }
    return Promise.reject('Dialog is undefined');
  }

  addDialog(dialog: MatDialog): void {
    this.dialog = dialog;
  }

  addInputs(inputs: any[]): void {
    this.inputs = inputs;
  }

  setFunction(name: string, structure: DefStructure): void {
    var functions = this.behaviorSubjectFunctions.value;
    functions[name] = structure;
    this.behaviorSubjectFunctions.next(functions);
  }

  setPreviousFunctions(p_functions: { [key: string]: DefStructure }, variablesService: VariablesService): void {
    let functions: { [key: string]: DefStructure } = {};
    for (const key in p_functions) {
      if (p_functions.hasOwnProperty(key)) {
        functions[key] = p_functions[key].clone(this, variablesService);
      }
    }
    this.behaviorSubjectFunctions.next({...functions});
  }

  goToLine(line: number, coordinator?: Coordinator): void {
    this.behaviorSubjectHighlight.next(line);
  }

  addNewState(coordinator: Coordinator): void {
    let newCoordinator = coordinator.clone();
    newCoordinator.highlightLine = this.behaviorSubjectHighlight.value;
    newCoordinator.print = this.behaviorSubjectPrint.value;

    this.store.dispatch(actions.addNew({ newCoordinator }));
  }

  previousState(state: boolean): void {
    this.behaviorSubjectPreviousActivated.next(state);
  }
}
