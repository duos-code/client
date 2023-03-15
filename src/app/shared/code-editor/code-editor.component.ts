import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Code } from 'src/app/core/interfaces/code.interface';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css'],
})
export class CodeEditorComponent {
  @ViewChild('codeRef') codeRef!: ElementRef;

  @Input() activeTheme = 'vs';

  @Input() codeModel: Code = {
    language: 'c',
    uri: 'main.c',
    value: '{}',
    input: '',
    output: 'Click on RUN button to see the output',
  };

  @Output() anyChangedEvent: EventEmitter<Code> = new EventEmitter<Code>();

  options = {
    contextmenu: false,
    minimap: {
      enabled: false,
    },
  };

  readOnly = false;

  dependencies: string[] = [
    '@types/node',
    '@ngstack/translate',
    '@ngstack/code-editor',
  ];

  onLanguageChange(option: any) {
    this.codeModel.language = option.value;
    this.anyChangedEvent.emit(this.codeModel);
  }

  onInputChange(inputBox: any) {
    this.codeModel.input = inputBox.value;
    this.anyChangedEvent.emit(this.codeModel);
    console.log(this.codeModel.value);
  }

  onCodeChange(code: any) {
    console.log(this.codeModel.value);
    // if (code != this.codeModel.value) {
    //   this.codeModel.value = code;
    //   this.anyChangedEvent.emit(this.codeModel);
    // }
    //this.anyChangedEvent.emit(this.codeModel);
  }

  handleRunCode() {
    // this.anyChangedEvent.emit(this.codeModel);
    // this.codeModel.value = 'kjkjhk';
    //this.codeRef.nativeElement;
    console.log(this.codeRef.nativeElement);
  }
}
