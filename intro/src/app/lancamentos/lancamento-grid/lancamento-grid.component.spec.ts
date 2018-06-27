import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LancamentoGridComponent } from './lancamento-grid.component';

describe('LancamentoGridComponent', () => {
  let component: LancamentoGridComponent;
  let fixture: ComponentFixture<LancamentoGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LancamentoGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LancamentoGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
