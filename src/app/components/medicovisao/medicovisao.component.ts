import { Component, inject } from '@angular/core';
import { Cliente } from '../../models/Cliente';
import { ClienteService } from '../../services/cliente.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { jsPDF } from 'jspdf';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { AxiosService } from '../../services/axios.service';




@Component({
  selector: 'app-medicovisao',
  standalone: true,
  imports: [FormsModule,CommonModule,MdbFormsModule],
  templateUrl: './medicovisao.component.html',
  styleUrl: './medicovisao.component.scss'
})
export class MedicovisaoComponent {


  cliente: Cliente[] = [];
  clienteSelecionado: any = null;  // Variável para armazenar o cliente selecionado


  service = inject(ClienteService);
  axiosService = inject(AxiosService);

  router = inject(Router);

  medicoSelecionado: string = '';
  medicos = ['Dr. Orlando Azevedo', 'Dr. Bruno', 'Dr. Naldo Nogueira']; // Lista de médicos
  clientesFiltrados: Cliente[] = []; // Para armazenar clientes filtrados

   // Variáveis para controle do modal e dados do cliente
   modalAtestadoAberto: boolean = false;
   textoAtestado: string = '';
   diasAfastamento: number = 0; // Variável para armazenar os dias de afastamento
   filtroConsultasHoje: boolean = false;

   modalReceitaAberto: boolean = false;  // Variável para controlar o modal de receita
   remedios: { nome: string, observacao: string }[] = []; // Array para armazenar os remédios e suas observações
   textoReceita: string = '';  // Texto da receita médica


  ngOnInit(): void {
    const token = this.axiosService.getAuthToken();
    if (!token) {
        // Redirecionar para o login ou mostrar um alerta
        this.router.navigate(['/inicio']);
    }
    this.listaDeClientes();
  }

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
      },
      error: (err) => {
        console.error('Erro ao carregar clientes:', err);
      }
    });
  }
  
  // Função para aplicar os filtros ao clicar nos checkboxes
  aplicarFiltro(): void {
    this.listaDeClientes(); // Recarrega os clientes aplicando os filtros
  }


  
  buscarClientesPorMedico(): void {
    if (this.medicoSelecionado) {
      this.clientesFiltrados = this.cliente.filter(c => c.medico === this.medicoSelecionado);
    } else {
      this.clientesFiltrados = [...this.cliente];
    }
    
  }

  formatarData(data: string): string {
    const dataObj = new Date(data); // Cria o objeto Date a partir da string
    const dia = String(dataObj.getDate()).padStart(2, '0'); // Pega o dia com dois dígitos
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0'); // Pega o mês com dois dígitos (lembrando que os meses começam do zero)
    const ano = dataObj.getFullYear(); // Pega o ano
    
    return `${dia}/${mes}/${ano}`; // Retorna a data no formato 'dd/MM/yyyy'
}

   // Função para abrir o modal de atestado com os dados do paciente
   abrirModalAtestado(cliente: any): void {
    this.clienteSelecionado = cliente;
    // Ajustando a data para o fuso horário local
    const dataConsulta = new Date(this.clienteSelecionado.dataConsulta + 'T00:00:00'); // Adicionando a hora fictícia
    const dataFormatada = dataConsulta.toLocaleDateString('pt-BR'); // Formata a data como 'dd/MM/yyyy'
  

    this.textoAtestado = `A presente consulta foi realizada com sucesso. O paciente ${this.clienteSelecionado.nome} compareceu ao consultório no dia ${dataFormatada} para atendimento médico. O atendimento foi realizado pelo médico ${this.clienteSelecionado.medico}. O(a) paciente se encontra com a saúde estável, e não há contraindicações para as atividades cotidianas, salvo a recomendação de repouso, se necessário. Caso o médico deseje, poderá ser especificado o período recomendado para afastamento ou descanso conforme a situação clínica do paciente. 
    .
`;

    this.modalAtestadoAberto = true;
}

  // Função para fechar o modal de atestado
  fecharModalAtestado(): void {
    this.modalAtestadoAberto = false;
  }

  // Função para gerar o atestado em PDF
  gerarAtestado(): void {
    const doc = new jsPDF();
  
    // Definindo margens e largura máxima para o conteúdo
    const margemX = 20; // margem à esquerda
    const margemY = 20; // margem superior
    const larguraMaxima = 180; // largura máxima do texto (considerando margens)
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
  
    // Título
    doc.text("Atestado Médico", margemX, margemY);
  
    // Usando o campo de dataConsulta diretamente como string
    const dataConsulta = new Date(this.clienteSelecionado.dataConsulta); // Converte para Date
    const dataFormatada = dataConsulta.toLocaleDateString('pt-BR');  
    // Definindo o texto do atestado

  
    // Configuração da fonte para o conteúdo
    doc.setFontSize(12);
    const linhas: string[] = doc.splitTextToSize(this.textoAtestado, larguraMaxima);
  
    // Desenhando o texto no PDF com margens
    let y = margemY + 10; // Ajuste para o início do texto após o título
    linhas.forEach((linha: string) => { // Especificando o tipo 'string' para 'linha'
      doc.text(linha, margemX, y);
      y += 10; // Adicionando uma linha em branco entre cada linha de texto
    });
  
    // Adicionando espaço para assinatura do médico
    y += 20; // Ajusta o espaço para a assinatura
  
    // Informações da assinatura
    doc.setFontSize(12);
    doc.text("Assinatura do Médico:", 140, y);
    doc.text(this.clienteSelecionado.medico, 140, y + 10); // Nome do médico ao lado direito
  
    // Desenhando a linha de assinatura
    doc.setLineWidth(0.5);
    doc.line(140, y + 12, 190, y + 12); // Linha para assinatura (ajuste as coordenadas conforme necessário)
  
    // Salvar como PDF
    doc.save(`${this.clienteSelecionado.nome}_Atestado.pdf`);
    this.fecharModalAtestado();
  }


  // Método para verificar se a consulta é hoje
  ConsultaHoje(dataConsulta: string): boolean {
    const dataConsultaDate = new Date(dataConsulta + 'T00:00:00'); // Adiciona a hora para evitar problemas de fuso horário
    const hoje = new Date(); // Data atual
  
    const isHoje =
      dataConsultaDate.getDate() === hoje.getDate() &&
      dataConsultaDate.getMonth() === hoje.getMonth() &&
      dataConsultaDate.getFullYear() === hoje.getFullYear();
  
    console.log(`Comparando dataConsulta: ${dataConsultaDate}, hoje: ${hoje}, é hoje? ${isHoje}`);
    return isHoje;
  }








  abrirModalReceita(cliente: any): void {
    this.clienteSelecionado = cliente;
    this.remedios = [];  // Limpar os remédios ao abrir o modal
    this.modalReceitaAberto = true;
  }

  // Função para adicionar um novo campo de remédio
  adicionarRemedio(): void {
    this.remedios.push({ nome: '', observacao: '' });
  }

  // Função para remover um remédio
  removerRemedio(index: number): void {
    this.remedios.splice(index, 1);
  }

  // Função para fechar o modal de Receita Médica
  fecharModalReceita(): void {
    this.modalReceitaAberto = false;
  }

  // Função para gerar o PDF da Receita Médica
  gerarReceita(): void {
    const doc = new jsPDF();

    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);

    // Título
    doc.text("Receita Médica", 20, 20);

    // Informações do paciente e médico
    const dataConsulta = new Date(this.clienteSelecionado.dataConsulta);
    const dataFormatada = dataConsulta.toLocaleDateString('pt-BR');
    doc.setFontSize(12);
    doc.text(`Paciente: ${this.clienteSelecionado.nome}`, 20, 30);
    doc.text(`Data da Consulta: ${dataFormatada}`, 20, 40);
    doc.text(`Médico: ${this.clienteSelecionado.medico}`, 20, 50);

    // Listar os remédios
    let y = 60;
    this.remedios.forEach((remedio) => {
      doc.text(`Remédio: ${remedio.nome}`, 20, y);
      doc.text(`Observação: ${remedio.observacao}`, 20, y + 10);
      y += 20;
    });

    // Texto adicional da receita
    doc.text(`Observações: ${this.textoReceita}`, 20, y + 10);

    // Gerar o PDF
    doc.save(`${this.clienteSelecionado.nome}_Receita.pdf`);
    this.fecharModalReceita();
  }

 


  clienteAcoesAberto: any = null; // Variável para controle do painel de ações

  // Método para alternar a visibilidade do painel de ações
  toggleAcoes(cliente: any): void {
      if (this.clienteAcoesAberto === cliente) {
          this.clienteAcoesAberto = null; // Fecha o painel se o cliente já está aberto
      } else {
          this.clienteAcoesAberto = cliente; // Abre o painel para o cliente clicado
      }
  }


  isTokenValid(): boolean {
    const token = this.axiosService.getAuthToken();  // Verifica o token no AxiosService
    return token !== null;  // Retorna true se o token existir
  }
  logout(): void {
    // Limpa o token
    this.axiosService.setAuthToken(null);

    // Redireciona para a página de login
    this.router.navigate(['/inicio']);
  }




  
}











