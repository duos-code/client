import {
  Component,
  Input,
  Output,
  EventEmitter,
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
    uri: 'main.c',
    value: '',
    input: '',
    output: 'Click on RUN button to see the output',
    editorOptions: { theme: 'vs-light', language: 'javascript' },
  };

  @Output() anyChangedEvent: EventEmitter<Code> = new EventEmitter<Code>();

  onInit(editor: any) {
    let line = editor.getPosition();
    console.log(line);
  }

  onLanguageChange(option: any) {
    this.codeModel.editorOptions.language = option.value;
    this.anyChangedEvent.emit(this.codeModel);
  }

  onInputChange(inputBox: any) {
    this.codeModel.input = inputBox.value;
    this.anyChangedEvent.emit(this.codeModel);
  }

  onCodeChange(code: any) {
    this.anyChangedEvent.emit(this.codeModel);
  }

  handleRunCode() {
    console.log(this.codeModel.value);
  }
}
