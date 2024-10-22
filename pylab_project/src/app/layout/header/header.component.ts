import { Component, EventEmitter, Output } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';
import { HelpDialogComponent } from '../../components/helpDialog/helpDialog.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Output() sidebarEvent = new EventEmitter<any>();

  constructor(public dialog: MatDialog){}

  openHelpDialog(){
    const dialogRef = this.dialog.open(HelpDialogComponent, {});
  }
}
