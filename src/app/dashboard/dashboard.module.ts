import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PanelModule } from 'primeng/panel';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { SliderModule } from 'primeng/slider';
import { SpinnerModule } from 'primeng/spinner';
import {ButtonModule} from 'primeng/button';

import { SharedModule } from './../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    PanelModule,
    ChartModule,
    CardModule,
    SliderModule,
    SpinnerModule,
    ButtonModule,

    SharedModule,
    DashboardRoutingModule
  ],
  declarations: [DashboardComponent],
  providers: [ DecimalPipe ]
})
export class DashboardModule { }
