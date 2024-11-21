import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cliente } from '../../models/Cliente';
import { ClienteService } from '../../services/cliente.service';
import { FormsModule } from '@angular/forms';  // 
import { Router } from '@angular/router';
import { AxiosService } from '../../services/axios.service';





@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [CommonModule,FormsModule, ],
  templateUrl: './registrar.component.html',
  styleUrl: './registrar.component.scss'
})
export class RegistrarComponent {
genderOptions: any;
suggestedClients: Cliente[] = [];


cliente: Cliente[]=[];
clienteEdit: Cliente = new Cliente(0,"","","","","","","","","","","","",false)

router = inject(Router);

service = inject(ClienteService);
axiosService = inject(AxiosService);


ngOnInit(): void {
    const token = this.axiosService.getAuthToken();
  if (!token) {
      // Redirecionar para o login ou mostrar um alerta
      this.router.navigate(['/inicio']);
  }
}

salvar() {
  if (this.clienteEdit.nome && this.clienteEdit.email) {
    this.service.save(this.clienteEdit).subscribe({
      next: (mensagem) => {
        // Redireciona para a página "/sucesso" após salvar com sucesso
        this.router.navigate(['/sucesso']);
      },
      error: (erro) => {
        alert("Ocorreu algum erro");
      }
    });
  } else {
    alert("Por favor, preencha todos os campos");
  }
}


 // Função chamada sempre que o nome mudar
 onNomeChange(): void {
  const searchTerm = this.clienteEdit.nome.trim().toLowerCase(); // Captura o texto digitado
  if (searchTerm.length > 0) {
    this.service.buscarClientesPorNome(searchTerm).subscribe(
      (clientes: Cliente[]) => {
        this.suggestedClients = clientes; // Atualiza as sugestões com os clientes filtrados
      },
      (error) => {
        console.error('Erro ao buscar clientes:', error);
      }
    );
  } else {
    this.suggestedClients = []; // Limpa as sugestões se o campo estiver vazio
  }
}

// Função chamada ao selecionar um cliente sugerido
selectClient(client: Cliente): void {
  this.clienteEdit = { ...client }; // Preenche o formulário com os dados do cliente selecionado
  this.suggestedClients = []; // Limpar as sugestões após a seleção
}






}
