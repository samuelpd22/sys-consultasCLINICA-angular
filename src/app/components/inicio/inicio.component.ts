import { Component, EventEmitter, inject, Output } from '@angular/core';

import { AxiosService } from '../../services/axios.service';
import { FormsModule } from '@angular/forms'; // Importando o FormsModule
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {

  @Output() onLoginSuccess = new EventEmitter<void>();
  @Output() onLoginError = new EventEmitter<string>();

  login: string = '';
  password: string = '';
  errorMessage: string = ''; // Para armazenar mensagens de erro

  constructor(private axiosService: AxiosService, private router : Router) {}

  onLogin(): void {
    this.errorMessage = ''; // Limpar erro anterior

    // Fazendo a requisição ao backend
    this.axiosService
      .request('POST', '/inicio', {
        login: this.login,
        password: this.password,
      })
      .then((response) => {
        // Sucesso no login
        this.axiosService.setAuthToken(response.data.token); // Armazenar o token
        this.onLoginSuccess.emit(); // Emitir evento de sucesso
        Swal.fire({
          icon: 'success',
          title: 'Login realizado com sucesso!',
          confirmButtonText: 'OK',
        }).then(() => {
          // Após o Swal, redirecionar para /painel
          this.router.navigate(['/painel']);
        });
      })
      .catch((error) => {
        // Capturar a mensagem correta do backend
        const errorMessage = error.response?.data?.message || 'Erro desconhecido';
        
        // Atualizar o estado e exibir o erro
        this.errorMessage = 'Erro no login: ' + errorMessage;
        this.axiosService.setAuthToken(null); // Limpar o token
        this.onLoginError.emit(errorMessage); // Emitir evento de erro
        
        Swal.fire({
          icon: 'error',
          title: 'Erro ao tentar login',
          text: errorMessage,
          confirmButtonText: 'Tente novamente',
        });
      });
    }

  onRegister(input: any): void {
		this.axiosService.request(
		    "POST",
		    "/register",
		    {
		        firstName: input.firstName,
		        lastName: input.lastName,
		        login: input.login,
		        password: input.password
		    }).then(
		    response => {
		        this.axiosService.setAuthToken(response.data.token);
		    }).catch(
		    error => {
		        this.axiosService.setAuthToken(null);
		    }
		);
	}


	private checkAuthToken(): void {
		const token = this.axiosService.getAuthToken();
		if (token) {
		  // Se o token existe, pode redirecionar para a seção de mensagens ou outra lógica
		} else {
		  // Se não existe, mostrar o welcome ou login
		}
	  }

	  private showErrorAlert(): void {
		Swal.fire({
		  icon: 'error',
		  title: 'Erro',
		  text: 'Usuário ou senha incorretos.',
		  confirmButtonText: 'OK'
		});
	  }

	  onLogout(): void {
		this.axiosService.setAuthToken(null); // Limpa o token
	  }
}