import { Component, Input , OnChanges, SimpleChanges, OnDestroy, EventEmitter, Output, OnInit, AfterViewInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import * as monaco from 'monaco-editor';
import { CodeService } from '../../services/code.service';
import { Coordinator } from '../../classes/coordinator';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatMenuModule, MatMenuTrigger} from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { VariablesService } from '../../services/variables.service';

const LANGUAGE = 'python';
@Component({
  selector: 'app-code-view',
  templateUrl: './code-view.component.html',
  styleUrls: ['./code-view.component.scss'],
  imports:[MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, CommonModule, MatIcon, MatButtonModule, MatMenuModule],
  standalone: true
})
export class CodeViewComponent implements AfterViewInit, OnDestroy, OnInit {

  @Input() code: string = '';
  @Input() inputs: any[] = []; 
  @Input() highlightLine: number = 0;
  @Output() variablesChanged = new EventEmitter<any>();
  forms:any = []
  private editor: monaco.editor.IStandaloneCodeEditor | null = null;
  private decorationsCollection: monaco.editor.IEditorDecorationsCollection | null = null;
  private coordinator: any = null;

  velocities = [0.5, 1, 2];
  velocity = 1;
  mode = 'manual';
  isRunning: boolean = false;
  isPaused: boolean = false;
  isFinished: boolean = false; 
  intervalId: any = null;
  previousActivated: boolean = false;
  readonly menuTrigger = viewChild.required(MatMenuTrigger);
  
  constructor(private codeService: CodeService, private dialog: MatDialog, private variablesService: VariablesService) { }

  ngOnInit(): void {
    if(!this.inputs) return;
    this.codeService.addDialog(this.dialog);
    this.codeService.addInputs(this.inputs);
  }

  ngAfterViewInit(): void { 
    this.initEditor();
    this.codeService.pause.subscribe(async (value)=> {
      this.isPaused = value;
    });
    this.codeService.highlightLine.subscribe(async (value)=> {
      this.highlightLine = Number(value);
      this.updateDecorations();
    });
    this.codeService.previousActivated.subscribe(async (value)=> {
      this.previousActivated = value;
    });
  }

  loadSelects():void{
    for(let {name, type, form} of this.forms){
      let option = this.parseOption(form.value, type);
      if (option === null) {
        return ;
      }
    }
    this.codeService.reset(); 
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.editor) {
      if (changes['code']) {
        this.codeService.setLength(this.code.length);
        this.reset();
        this.coordinator = new Coordinator(this.codeService, this.code, this.variablesService);
        this.editor.setValue(this.code);
        this.updateDecorations();
      }
    }
  }

  private parseOption(option: any, type: string): any {
    if (option === null || option === undefined || option === "") {
      return null
    }
    switch (type) {
      case "int":
      case "float":
      return Number(option)
      case "string":
      default: 
        return String(option)
    } 

  }

  private initEditor(): void {
    this.editor = monaco.editor.create(document.getElementById('editor-container')!, {
      value: this.code,
      theme: 'vs-dark',
      language: LANGUAGE,
      readOnly: true,
      tabSize: 4,
      insertSpaces: false,
      minimap: { enabled: false }
    });
    
    this.decorationsCollection = this.editor.createDecorationsCollection();
  }

  private updateDecorations(): void {
    if (this.editor && this.decorationsCollection && !this.isFinished) {          
      const newDecorations = this.highlightLine !== null ? [{
        range: new monaco.Range(this.highlightLine, 1, this.highlightLine, 1),
        options: {
          isWholeLine: true,
          inlineClassName: 'selected-line'
        }
      }] : [];
      this.decorationsCollection.clear()      
      this.decorationsCollection.set(newDecorations)
      this.editor.revealLineInCenter(this.highlightLine);
    }    
  }

  async nextLine() {
    if (this.decorationsCollection && this.coordinator) {
      await this.coordinator.executeForward();
    }
    if(!this.previousActivated){
      this.previousActivated = true;
    }
    if(this.code != "" && this.highlightLine === this.code.split('\n').length + 1){
      this.isFinished = true;
      this.decorationsCollection?.clear();
    }
  }

  async previousLine() {
    if(this.isFinished){
      this.isFinished = false;
    }
    if (this.decorationsCollection && this.coordinator) {
      await this.coordinator.executePrevious();
    }
  }

  setVelocity(level: any) {
    this.velocity = level;
  }

  play(){
    if (this.isPaused) {
      this.isPaused = false;
    } else if (!this.isRunning) {
      this.isRunning = true;
      this.intervalId = setInterval(() => {
        if (!this.isPaused) {
          this.nextLine();
        }
      }, 1000/this.velocity); 
    }
  }

  pause(){
    this.isPaused = true;
  }

  stop() {
    this.isRunning = false;
    clearInterval(this.intervalId);
  }

  reset(){
    this.isRunning = false;
    this.isPaused = true;
    this.isFinished = false;
    this.previousActivated = false;
    clearInterval(this.intervalId);
    this.codeService.reset();
    if(this.coordinator){
      this.coordinator.reset();
    }
  }

  ngOnDestroy(): void {
    if (this.editor) {
      this.editor.dispose();
    }
  }
}
