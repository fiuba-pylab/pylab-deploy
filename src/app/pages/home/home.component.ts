import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { SvgComponent } from '../../components/svg/svg.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, SvgComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private router: Router) {
  }
  cards: any[] = [
    {titulo: 'Introducción', imagen: 'introduccion.png', tipo: 'introduccion'},
    {titulo: 'Selección simple', imagen: 'seleccion_simple1.png', tipo: 'seleccion-simple'},
    {titulo: 'Selección múltiple', imagen: 'seleccion_multiple1.png', tipo: 'seleccion-multiple'},
    {titulo: 'Iteraciones', imagen: 'iteraciones.png', tipo: 'iteraciones'},
    {titulo: 'Funciones', imagen: 'funciones.png', tipo: 'funciones'},
    {titulo: 'Tuplas y listas', imagen: 'tuplas_listas.png', tipo: 'tuplas-listas'},
    {titulo: 'Conjuntos y diccionarios', imagen: 'conjuntos_diccionarios.png', tipo: 'conjuntos-diccionarios'},
  ]

  listPrograms(tipo: string){
    this.router.navigate(['/list', tipo]);
  }

}
