import { Component, EventEmitter, Output } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';
import { NavigationService } from '../../services/navigation.service';
import { Router } from '@angular/router';
import { HelpDialogComponent } from '../../components/help-dialog/help-dialog.component';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Output() sidebarEvent = new EventEmitter<any>();
  isHomePage: boolean = true;

  constructor(public dialog: MatDialog, private navigationService: NavigationService, private router: Router){
    this.navigationService.startSaveHistory();
    this.navigationService.isHome.subscribe((value) => {
      this.isHomePage = value;
    });
  }

  openHelpDialog(){
    const dialogRef = this.dialog.open(HelpDialogComponent, {});
  }

  goBack(): void {
    this.navigationService.goBack();
  }
}
