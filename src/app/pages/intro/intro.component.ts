import { Component } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatChip } from '@angular/material/chips';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [MatButtonModule, MatChip],
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.scss'
})
export class IntroComponent {
  constructor(private router: Router){}

  authors = [
    {
      name: "Aguilar Pedro",
      github: "https://github.com/PedroAguilar98"
    },
    {
      name: "Flynn Pedro",
      github: "https://github.com/LordOfThePing"
    },
    {
      name: 'Fraccaro Agustina',
      github: "https://github.com/agusfraccaro"
    },
    {
      name: 'Schmidt Agustina',
      github: "https://github.com/agusschmidt"
    },
  ]

  goToHome(){
    this.router.navigate(['/home']);
  }
}
