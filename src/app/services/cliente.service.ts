import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Cliente } from '../models/Cliente';
import { StorageService } from './StorageService';



@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  http = inject(HttpClient);
  storage = inject(StorageService); // Injetar o serviço de armazenamento
  //API = "http://localhost:8080/cad"
  API = "https://disciplined-perception-production.up.railway.app/cad"


  constructor() { }

  listAll(): Observable<Cliente[]>{ 
    return this.http.get<Cliente[]>(this.API, {
      headers: this.createAuthorizationHeader()
    });
  }

  save(cliente:Cliente): Observable<string>{ 
     return this.http.post<string>(this.API, cliente  ,{ responseType: 'text' as 'json',
      headers: this.createAuthorizationHeader()
     })//Retorno string? Sempre usar responseType

  }
  saveFila(cliente: Cliente): Observable<string> {
    return this.http.post<string>(`${this.API}/fila`, cliente, { responseType: 'text' as 'json' ,
      headers: this.createAuthorizationHeader()
    });
  }
  

  cancelarEExcluir(id: number): Observable<string> {
    return this.http.put<string>(`${this.API}/cancelar/${id}`, {}, { responseType: 'text' as 'json' ,
      headers: this.createAuthorizationHeader()
    });
  }




  reagendarConsulta(id: number, cliente: Cliente): Observable<Cliente> {
    // Criando o ClienteDTO para enviar ao backend
    const clienteDTO = {
      dataConsulta: cliente.dataConsulta,  // Envia a data da consulta
      medico: cliente.medico,  // Envia o médico
    };
  
    const url = `${this.API}/reagendar/${id}`;  // Endpoint para reagendar
    return this.http.put<Cliente>(url, clienteDTO, {
      headers: this.createAuthorizationHeader()
    }) ;  // Envia os dados de reagendamento para o backend
  }




  getTelefone(clienteId: number): Observable<string> {
    return this.http.get<string>(`${this.API}/${clienteId}/telefone`,{
      headers: this.createAuthorizationHeader()
    });
  }


  listarClientesPorMedico(medico: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.API}/medico/${medico}`,{
      headers: this.createAuthorizationHeader()
    });
  }
   // Método para buscar clientes pelo nome
   buscarClientesPorNome(nome: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.API}/cliente?nome=${nome}`,{
      headers: this.createAuthorizationHeader()
    });
  }

  private createAuthorizationHeader(): HttpHeaders { // Cria a autorização (TOKEN) no cabeçalho
    const token = this.storage.getItem('auth_token'); // Obter o token do seu StorageService
    return token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : new HttpHeaders();
  }
}
