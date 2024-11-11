import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Program } from '../classes/program';
import { Comment } from '../classes/comment';
import { CdkMonitorFocus } from '@angular/cdk/a11y';

@Injectable({
  providedIn: 'root',
})
export class FileService {

  private filesUrl = 'assets/programas';
  private commentsUrl = 'assets/comments/comments.json';

  constructor(private http: HttpClient) { }

  getFileNames(folderName: string): Observable<Object> {
    const folderUrl = `${this.filesUrl}/${folderName}`;    
    return this.http.get(folderUrl, { responseType: 'json' });
  }

  readFile(folderName: string, fileName: string): Observable<string> {
    const fileUrl = `${this.filesUrl}/${folderName}/${fileName}`;
    return this.http.get(fileUrl, { responseType: 'text' });
  }

  getList(folderName: string): Observable<Program[]> {
    const folderUrl = `${this.filesUrl}/${folderName}/lista.json`;
    return this.http.get<any[]>(folderUrl).pipe(
      map(data => {
          return data.map(item => new Program(
              item.id,
              item.title,
              item.description,
              item.difficulty,
              item.introduction,
              item.inputs,
              item.comments
          ));
      })
    );
  }
  
  getComment(topicName: string): Observable<any> {
    return this.http.get<any[]>(this.commentsUrl).pipe(
      map((comments: any[]) => {
        const comment = comments.find(comment => comment.id === topicName);

        if (comment) {
          return new Comment(comment.body.title, comment.body.grid_1, comment.body.grid_2, comment.body.grid_3, comment.body.grid_4);
        } else {
          throw new Error(`Item with id ${topicName} not found`);
        }
      })
    );
  }
}
