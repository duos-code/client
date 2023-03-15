import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

import * as ace from 'ace-builds';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-beautify';

const THEME = 'ace/theme/github';
const LANG = 'ace/mode/javascript';
@Component({
  selector: 'app-ng-code-editor',
  templateUrl: './ng-code-editor.component.html',
  styleUrls: ['./ng-code-editor.component.css'],
})
export class NgCodeEditorComponent {
  @ViewChild('codeEditor') codeEditorElmRef!: ElementRef;
    private codeEditor!: ace.Ace.Editor;

    constructor() { }

    ngOnInit () {
        const element = this.codeEditorElmRef.nativeElement;
        const editorOptions: Partial<ace.Ace.EditorOptions> = {
            highlightActiveLine: true,
            minLines: 10,
            maxLines: Infinity,
        };

        this.codeEditor = ace.edit(element, editorOptions);
        this.codeEditor.setTheme(THEME);
        this.codeEditor.getSession().setMode(LANG);
        this.codeEditor.setShowFoldWidgets(true); // for the scope fold feature
     }
}
