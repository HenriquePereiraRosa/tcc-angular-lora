import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.css']
})
export class LancamentoCadastroComponent implements OnInit {

  tipos = [
    { label: 'Receita', value: 'RECEITA'},
    { label: 'Despeza', value: 'DESPEZA'},
  ];

  default = 'RECEITA'; // Default value os selectButton

  categories = [];

  constructor() {
    this.categories = [
      {label: 'Cat1', value: 1},
      {label: 'Cat2', value: 2},
      {label: 'Cat3', value: 3},
      {label: 'Cat4', value: 4},
    ];
   }

  ngOnInit() {
  }

}
