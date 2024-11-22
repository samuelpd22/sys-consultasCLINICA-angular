import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sucesso',
  standalone: true,
  imports: [],
  templateUrl: './sucesso.component.html',
  styleUrl: './sucesso.component.scss'
})
export class SucessoComponent implements OnInit{
  
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Redirecionar para /painel após 5 segundos
    setTimeout(() => {
      this.router.navigate(['/painel']);
    }, 5000); // 5000ms = 5 segundos
  }

}
