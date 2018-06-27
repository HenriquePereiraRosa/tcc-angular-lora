import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TooltipModule } from 'primeng/tooltip';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownModule } from 'primeng/dropdown';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { InputMaskModule } from 'primeng/inputmask';
import { DataTableModule } from 'primeng/components/datatable/datatable';
import { ButtonModule } from 'primeng/components/button/button';
import { InputTextModule } from 'primeng/components/inputtext/inputtext';
import { TabViewModule } from 'primeng/tabview';

import { LancamentoGridComponent } from './lancamento-grid/lancamento-grid.component';
import { LancamentoCadastroComponent } from './lancamento-cadastro/lancamento-cadastro.component';
import { LancamentosPesquisaComponent } from './lancamentos-pesquisa/lancamentos-pesquisa.component';
import { SharedModule } from './../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,            // Enable Forms #fromAngular
    InputTextModule,
    ButtonModule,
    DataTableModule,
    TabViewModule,
    TooltipModule,
    InputTextareaModule,
    CalendarModule,
    SelectButtonModule,
    BrowserAnimationsModule,  // Solve some Rendering problems
    DropdownModule,
    CurrencyMaskModule,       // Mask for Currency
    InputMaskModule,          // To create an input Mask
    SharedModule
  ],
  declarations: [
    LancamentosPesquisaComponent,
    LancamentoCadastroComponent,
    LancamentoGridComponent
  ],
  exports: [
  LancamentosPesquisaComponent,
  LancamentoCadastroComponent
  ]
})
export class LancamentosModule { }
