import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { FileService } from '../../services/file.service';
import { Program } from '../../classes/program';
import { lastValueFrom } from 'rxjs';
import { of } from 'rxjs';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { MatDialog } from '@angular/material/dialog';
import { ProgramIntroModalComponent } from '../program-display/program-intro-modal/program-intro-modal.component';

@Component({
  selector: 'app-program-list',
  standalone: true,
  imports: [MatPaginatorModule, CommonModule, MatCardModule, MatIconModule, MatButtonModule, SpinnerComponent],
  templateUrl: './program-list.component.html',
  styleUrl: './program-list.component.scss',
  animations: [
    trigger('listAnimation', [
      transition('* <=> *', [
        query(':enter',
          [style({ opacity: 0 }), stagger('60ms', animate('600ms ease-out', style({ opacity: 1 })))],
          { optional: true }
        ),
        query(':leave',
          animate('200ms', style({ opacity: 0 })),
          { optional: true }
        )
      ])
    ])
  ]
})
export class ProgramListComponent implements OnInit {
  programs: Program[] = [];
  private type: string = "";
  loadingList: boolean = true;

  constructor(private router: Router, private route: ActivatedRoute, private fileService: FileService) { }

  async ngOnInit() {
    this.type = this.route.snapshot.paramMap.get('type') ?? "";
    await this.loadFiles();
  }

  async loadFiles() {
    this.loadingList = true;
    try {
      const programs: Program[] = await lastValueFrom(this.fileService.getList(this.type));
      this.loadingList = false;
      this.programs = programs.sort((a, b) => a.difficulty - b.difficulty);
    } catch (error) {
      console.log('Error loading files:', error);
      
    }
  }

  goToDisplay(program: Program) {
    this.router.navigate(['/display', this.type, program.id],{state:{program}});
  }
}
