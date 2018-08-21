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
  dev_eui: string;
  vBat: number;
  current: number;
  temperature: number;
  deltaTemperature: number;
  envoironmentTemp: number;
  humidity: number;
  power: number;
  irregularity: boolean;
  date: Date;

  constructor(
    dev_eui: string,
    vBat: number,
    current: number,
    temperature: number,
    envoironmentTemp: number,
    humidity: number,
    power: number,
    irregularity: boolean,
    date: Date) {
      this.dev_eui = dev_eui;
      this.vBat = vBat;
      this.current = current;
      this.temperature = temperature;
      this.envoironmentTemp = envoironmentTemp;
      this.deltaTemperature = envoironmentTemp - temperature;
      this.humidity = humidity;
      this.power = power;
      this.irregularity = irregularity;
      this.date = date;
    }
}
