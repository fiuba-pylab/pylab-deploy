import { Component } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.scss'
})
export class IntroComponent {
  constructor(private router: Router){}

  authors = [
    {
      name: "Aguilar Pedro",
      github: "https://github.com/pedroaguilar"
    },
    {
      name: "Flynn Pedro",
      github: "https://github.com/pedroaguilar"
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
