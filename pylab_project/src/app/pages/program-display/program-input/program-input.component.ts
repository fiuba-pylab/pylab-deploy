import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';


interface ResponseForm {
  name:string
  form: FormControl
}

@Component({
  selector: 'app-program-input',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, CommonModule, MatIconModule, MatChipsModule],
  templateUrl: './program-input.component.html',
  styleUrl: './program-input.component.css'
})

export class ProgramInput implements OnInit{
  forms:ResponseForm[] = []
  data = inject(MAT_DIALOG_DATA);

  constructor(public dialog: MatDialogRef<ProgramInput>){

  }
  ngOnInit(): void {

  }
  onOptionSelected(opt: string){
    this.dialog.close(opt)
  }

}
