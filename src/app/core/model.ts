export class Estado {
  id: number;
  nome: string;
}

export class Cidade {
  id: number;
  nome: string;
  estado = new Estado();
}

export class Endereco {
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  cidade = new Cidade();
}

export class Contato {
  id: number;
  nome: string;
  email: string;
  telefone: string;

  constructor(id?: number,
    nome?: string,
    email?: string,
    telefone?: string) {
      this.id = id;
      this.nome = nome;
      this.email = email;
      this.telefone = telefone;
  }
}

export class Pessoa {
  id: number;
  nome: string;
  endereco = new Endereco();
  ativo = true;
  contatos = new Array<Contato>();
}

export class Categoria {
  id: number;
}

export class Lancamento {
  id: number;
  tipo = 'RECEITA';
  descricao: string;
  dataVencimento: Date;
  dataPagamento: Date;
  valor: number;
  observacao: string;
  pessoa = new Pessoa();
  categoria = new Categoria();
  anexo: string;
  urlAnexo: string;
}

export class Sensor {
  current: number;
  voltage: number;
  temperature: number;
  humidity: number;
  date: String;

  constructor(
    current: number,
    voltage: number,
    temperature: number,
    humidity: number,
    date: String) {
      this.current = current;
      this.voltage = voltage;
      this.temperature = temperature;
      this.humidity = humidity;
      this.date = date;
    }
}

export class Email {
  id: number;
  email: string;
}
