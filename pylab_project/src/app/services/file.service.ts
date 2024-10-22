import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Program } from '../classes/program';

@Injectable({
  providedIn: 'root',
})
export class FileService {

  private filesUrl = 'assets/programas';

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
    let programs: Program[] = [];
    /* this.http.get(folderUrl, { responseType: 'json' }).subscribe((data: any) => {
      for (let i = 0; i < data.length; i++) {
        let program = new Program(data[i].id, data[i].title, data[i].description, data[i].difficulty, data[i].introduction, data[i].inputs);
        programs.push(program);
      }
    });
    return programs */
    return this.http.get<any[]>(folderUrl).pipe(
      map(data => {
          return data.map(item => new Program(
              item.id,
              item.title,
              item.description,
              item.difficulty,
              item.introduction,
              item.inputs
          ));
      })
  );
  }
}
