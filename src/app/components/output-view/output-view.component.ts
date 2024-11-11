import { Component, OnInit } from '@angular/core';
import { CodeService } from '../../services/code.service';

@Component({
  selector: 'app-output-view',
  standalone: true,
  imports: [],
  templateUrl: './output-view.component.html',
  styleUrl: './output-view.component.css'
})
export class OutputViewComponent implements OnInit {
  print: string = '';
  constructor(private codeService: CodeService) { }

  ngOnInit() {
    this.codeService.print.subscribe((value) => {
      this.print = value;
    });
  } 

}
