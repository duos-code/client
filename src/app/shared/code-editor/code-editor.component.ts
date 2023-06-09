import { ToastrService } from 'ngx-toastr';
import { FileService } from './../../core/services/file.service';
import { compiled } from './../../core/interfaces/compiled.interface';
import { CompileService } from './../../core/services/compile.service';
import { CommunicationService } from 'src/app/core/services/communication.service';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Code } from 'src/app/core/interfaces/code.interface';
import { language } from 'src/app/core/constants/language';
import { Router } from '@angular/router';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css'],
})
export class CodeEditorComponent {
  @ViewChild('codeRef') codeRef!: ElementRef;

  @Input() fileName: string = '';

  @Input() activeTheme = 'vs';

  @Input() codeModel: Code = {
    uri: 'main.c',
    value: '',
    input: '',
    output: 'Click on RUN button to see the output',
    editorOptions: { theme: 'vs-light', language: 'javascript' },
  };

  @Output() anyChangedEvent: EventEmitter<Code> = new EventEmitter<Code>();

  editorRef: any;

  @Input() newCode: any;

  public languages: Array<string> = language;

  constructor(
    private compiler: CompileService,
    private fileService: FileService,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  onInit(editor: any) {
    this.editorRef = editor;
  }

  onLanguageChange(option: any) {
    if (this.codeModel.editorOptions.language == option.value) return;
    this.codeModel.editorOptions.language = option.value;
    this.anyChangedEvent.emit(this.codeModel);
  }

  onInputChange(inputBox: any) {
    if (this.codeModel.input == inputBox.value) return;
    this.codeModel.input = inputBox.value;
    this.anyChangedEvent.emit(this.codeModel);
  }

  onCodeChange(code: any) {
    if (this.codeModel.value == this.newCode) return;
    this.anyChangedEvent.emit(this.codeModel);
  }

  handleDownloadCode() {
    var code = this.codeModel.value;
    var lenguage = this.codeModel.editorOptions.language;
    var fileName = this.fileName;
    this.fileService.saveCodeAsFile(code, lenguage, fileName);
  }

  handleCopyRoomCode() {
    navigator.clipboard.writeText(window.location.href);
    this.toastrService.info('copied metting link');
  }

  handleRunCode() {
    this.codeModel.output = 'compling ..';
    this.compiler.runCode(this.codeModel).subscribe((res: compiled) => {
      if (res.exitCode) {
        this.codeModel.output = res.stderr;
      }
      if (!res.exitCode) {
        this.codeModel.output = res.stdout;
      }
      this.anyChangedEvent.emit(this.codeModel);
    });

    //console.log(this.codeModel);
  }
}
