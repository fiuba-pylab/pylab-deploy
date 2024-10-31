import { Injectable } from '@angular/core'
import { Location } from '@angular/common'
import { Router, NavigationEnd } from '@angular/router'
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private history: string[] = []
  private behaviorSubjectIsHome = new BehaviorSubject<boolean>(true);
  isHome = this.behaviorSubjectIsHome.asObservable();
  constructor(private router: Router, private location: Location) { }
  
  public startSaveHistory():void{
    this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.history.push(event.urlAfterRedirects)
          if(event.urlAfterRedirects != '/intro'){
            this.behaviorSubjectIsHome.next(false);
          }else{
            this.behaviorSubjectIsHome.next(true);
          }        
        }
    });
  }

  public goBack(): void {
    this.history.pop();
    
    if (this.history.length > 0) {
      this.location.back()
    } else {
      this.router.navigateByUrl("/")
    }
  }
}