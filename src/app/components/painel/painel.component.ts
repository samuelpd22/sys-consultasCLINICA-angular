import { Component, inject, OnInit } from '@angular/core';
import { Cliente } from '../../models/Cliente';
import { ClienteService } from '../../services/cliente.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AxiosService } from '../../services/axios.service';

@Component({
  selector: 'app-painel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './painel.component.html',
  styleUrl: './painel.component.scss'
})
export class PainelComponent implements OnInit {
  service = inject(ClienteService);
  axiosService = inject(AxiosService);
  router = inject(Router);

  cliente: Cliente[] = [];
  clienteSelecionado: any = null;  // Variável para armazenar o cliente selecionado

  consultasAgendadas: number = 0; // Contador para consultas agendadas
  consultasCanceladas: number = 0; // Contador para consultas canceladas
  consultasPendentesMarcacao: number = 0; // Contador para consultas pendentes

  medicoSelecionado: string = '';
  medicos = ['Dr. Orlando Azevedo', 'Dr. Bruno', 'Dr. Naldo Nogueira']; // Lista de médicos
  clientesFiltrados: Cliente[] = []; // Para armazenar clientes filtrados

  modalDadosGeraisAberto: boolean = false; // Controla o modal de dados gerais
  modalReagendamentoAberto: boolean = false; // Controla o modal de reagendamento



  
    ngOnInit(): void {
      const token = this.axiosService.getAuthToken();
    if (!token) {
        // Redirecionar para o login ou mostrar um alerta
        this.router.navigate(['/inicio']);
    }
        this.listaDeClientes();
  }

  isTokenValid(): boolean {
    const token = this.axiosService.getAuthToken();  // Verifica o token no AxiosService
    return token !== null;  // Retorna true se o token existir
  }

  // Função de logout
  logout(): void {
    // Limpa o token
    this.axiosService.setAuthToken(null);

    // Redireciona para a página de login
    this.router.navigate(['/inicio']);
  }

  

  




  // Método para buscar a lista de clientes
  listaDeClientes(): void {
    this.service.listAll().subscribe({
      next: (lista) => {
        const statusOrder: { [key: string]: number } = { 'Agendado': 1, 'Pendente': 2, 'Cancelado': 3 };
  
        // Obtém a data atual e subtrai um dia
        const dataAtual = new Date();
        dataAtual.setHours(0, 0, 0, 0); // Zera horas, minutos, segundos e milissegundos
        dataAtual.setDate(dataAtual.getDate() - 1); // Subtrai um dia
  
        this.cliente = lista
          .filter(cliente => {
            const dataConsulta = new Date(cliente.dataConsulta);
            dataConsulta.setHours(0, 0, 0, 0); // Zera horas, minutos, segundos e milissegundos da data da consulta
            return dataConsulta >= dataAtual; // Compara apenas as partes da data
          })
          .sort((a, b) => {
            if (statusOrder[a.status] !== statusOrder[b.status]) {
              return statusOrder[a.status] - statusOrder[b.status];
            } else {
              return new Date(a.dataConsulta).getTime() - new Date(b.dataConsulta).getTime();
            }
          });
  
        this.clientesFiltrados = [...this.cliente]; // Atualiza os clientes filtrados
        this.atualizarContadores(); // Atualiza os contadores após o filtro
      },
      error: (err) => {
        console.error('Erro ao carregar clientes:', err);
      }
    });
  }


  


  buscarClientesPorMedico(): void {
    if (this.medicoSelecionado) {
      this.clientesFiltrados = this.cliente.filter(c => c.medico === this.medicoSelecionado);
    } else {
      this.clientesFiltrados = [...this.cliente];
    }
    this.atualizarContadores();
  }

  atualizarContadores(): void {
    this.consultasAgendadas = this.clientesFiltrados.filter(c => c.status === 'Agendado').length;
    this.consultasCanceladas = this.clientesFiltrados.filter(c => c.status === 'Cancelado').length;
    this.consultasPendentesMarcacao = this.clientesFiltrados.filter(c => c.status === 'Pendente').length;
  }

  reagendar(cliente: any): void {
    this.clienteSelecionado = { ...cliente }; // Cria uma cópia do cliente para edição
    this.abrirModalReagendamento(cliente); // Abre o modal de reagendamento
  }

  salvarReagendamento(): void {
    this.service.reagendarConsulta(this.clienteSelecionado.id, this.clienteSelecionado).subscribe({
      next: (response) => {
        console.log('Consulta reagendada:', response);
        this.fecharModal();  // Fecha o modal após salvar
        this.listaDeClientes(); // Atualiza a lista de clientes
      },
      error: (error) => {
        console.error('Erro ao reagendar consulta:', error);
      }
    });
  }

  fecharModal(): void {
    this.modalReagendamentoAberto = false;
    this.modalDadosGeraisAberto = false; // Fechar todos os modais ao chamar este método
    this.clienteSelecionado = null;
  }

  cancelarCliente(id: number): void {
    this.service.cancelarEExcluir(id).subscribe({
      next: (response) => {
        console.log(response);
        this.listaDeClientes();
      },
      error: (error) => {
        console.error('Erro ao cancelar cliente:', error);
      }
    });
  }

  navigateToMedico(): void {
    this.router.navigate(['/medico']);
  }

  navigateToRegistrar(): void {
    this.router.navigate(['/registrar']);
  }

  agendar(cliente: any): void {
    this.service.getTelefone(cliente.id).subscribe(response => {
      const telefone = typeof response === 'string' ? response : String(response);
      if (telefone) {
        let formattedTelefone = telefone.replace(/\D/g, '');
        const whatsappUrl = `https://web.whatsapp.com/send?phone=${formattedTelefone}&text=Olá, gostaria de agendar uma consulta.`;
        window.open(whatsappUrl, '_blank');
      }
    });
  }

  abrirModalDadosGerais(cliente: any): void {
    this.clienteSelecionado = cliente;
    this.modalDadosGeraisAberto = true;
    this.modalReagendamentoAberto = false; // Fecha o modal de reagendamento
  }

  fecharModalDadosGerais(): void {
    this.modalDadosGeraisAberto = false;
    this.clienteSelecionado = null;
  }

  abrirModalReagendamento(cliente: any): void {
    this.clienteSelecionado = { ...cliente };
    this.modalReagendamentoAberto = true;
    this.modalDadosGeraisAberto = false; // Fecha o modal de dados gerais
  }

  fecharModalReagendamento(): void {
    this.modalReagendamentoAberto = false;
    this.clienteSelecionado = null;
  }
}
