import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from '../../services/file.service';
import { lastValueFrom } from 'rxjs';
import { PYTHON_DOC_URL } from '../../constants';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { Comment } from '../../classes/comment';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [MatPaginatorModule, CommonModule, MatCardModule, MatIconModule, MatButtonModule, SpinnerComponent],
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
})
export class CommentsComponent implements OnInit {
  comment: Comment = new Comment("", "", "", "", "");
  id: string = "";
  loadingInfo: boolean = true;

  constructor(private router: Router, private route: ActivatedRoute, private fileService: FileService) { }

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') ?? "";
    await this.LoadInfo();
  }

  async LoadInfo() {
    this.loadingInfo = true;
    try {
        this.comment = await lastValueFrom(this.fileService.getComment(this.id));
    } catch (error) {
        console.log('Error loading files:', error);
    } finally {
        this.loadingInfo = false;
    }
  }
}
