import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-message',
  template: `
    <!-- <p>
      message works!
    </p> -->

    <div *ngIf="temErro()" class="ui-message ui-messages-error">
      {{text}}
    </div>

  `,
  styles: []
})
export class MessageComponent implements OnInit {

  @Input() error: string;
  @Input() control: FormControl;
  @Input() text: string;

  constructor() { }

  ngOnInit() {
  }

  temErro(): boolean {
    return this.control.hasError(this.error) && this.control.dirty;
  }

}
