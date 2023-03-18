import { Injectable } from '@angular/core';
import { Code } from '../interfaces/code.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Apis } from '../constants/apis';

@Injectable({
  providedIn: 'root',
})
export class CompileService {
  private headers: any = new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*');

  constructor(private http: HttpClient) {}

  runCode(codeModel: Code): any {
    switch (codeModel.editorOptions.language) {
      case 'c':
        return this.compileC(codeModel.value, codeModel.input);

      case 'cpp':
        return this.compileCpp(codeModel.value, codeModel.input);

      case 'node':
        return this.compileNode(codeModel.value, codeModel.input);

      case 'java':
        return this.compileJava(codeModel.value, codeModel.input);

      case 'python':
        return this.compilePy(codeModel.value, codeModel.input);

      default:
        return null;
    }
  }

  compileC(code: string, stdin: string): any {
    const url = Apis.compile_c;
    return this.http.post(
      url,
      { code: code, stdin: stdin },
      { headers: this.headers }
    );
  }

  compileCpp(code: string, stdin: string): any {
    const url = Apis.compile_cpp;
    return this.http.post(
      url,
      { code: code, stdin: stdin },
      { headers: this.headers }
    );
  }

  compileNode(code: string, stdin: string): any {
    const url = Apis.compile_node;
    return this.http.post(
      url,
      { code: code, stdin: stdin },
      { headers: this.headers }
    );
  }

  compileJava(code: string, stdin: string): any {
    const url = Apis.compile_java;
    return this.http.post(
      url,
      { code: code, stdin: stdin },
      { headers: this.headers }
    );
  }

  compilePy(code: string, stdin: string): any {
    const url = Apis.compile_py;
    return this.http.post(
      url,
      { code: code, stdin: stdin },
      { headers: this.headers }
    );
  }
}
