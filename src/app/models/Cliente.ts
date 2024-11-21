export class Cliente {
    id!:number;
    nome!:string;
    medico!:string;
    dataConsulta!:string;
    email!:string;
    telefone!:string;
    dataDeNascimento!:string;
    genero!:string;
    endereco!:string;
    profissao!:string;
    contatoEmergencia!:string;
    nomeContatoEmergencia!:string;
    status!:string;
    preferencial!:boolean;

  

    
    
  
  
    constructor( id:number,
            nome:string,
            email:string,
            medico:string,
            dataConsulta:string,
            telefone:string,
            dataDeNascimento:string,
            genero:string,
            endereco:string,
            profissao:string,
            contatoEmergencia:string,
            nomeContatoEmergencia:string,
            status:string,
            preferencial:boolean


    ){
      this.id = id;
      this.nome = nome;
      this.email = email;
      this.medico = medico;
      this.telefone = telefone;
      this.dataDeNascimento = dataDeNascimento;
      this.genero = genero;
      this.endereco = endereco;
      this.profissao = profissao;
      this.contatoEmergencia = contatoEmergencia;
      this.nomeContatoEmergencia = nomeContatoEmergencia;
      this.dataConsulta = dataConsulta;
      this.status = status;
      this.preferencial = preferencial;
  
    }
}