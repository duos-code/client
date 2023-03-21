import { Injectable } from '@angular/core';
import { Code } from '../interfaces/code.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CompileService {
  private headers: any = new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*');

  private domain: string | undefined;

  constructor(private http: HttpClient) {
    this.domain = environment.base_url;
  }

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
    const url = this.domain + '/compile/c';
    return this.http.post(
      url,
      { code: code, stdin: stdin },
      { headers: this.headers }
    );
  }

  compileCpp(code: string, stdin: string): any {
    const url = this.domain + '/compile/cpp';
    return this.http.post(
      url,
      { code: code, stdin: stdin },
      { headers: this.headers }
    );
  }

  compileNode(code: string, stdin: string): any {
    const url = this.domain + '/compile/node';
    return this.http.post(
      url,
      { code: code, stdin: stdin },
      { headers: this.headers }
    );
  }

  compileJava(code: string, stdin: string): any {
    const url = this.domain + '/compile/java';
    return this.http.post(
      url,
      { code: code, stdin: stdin },
      { headers: this.headers }
    );
  }

  compilePy(code: string, stdin: string): any {
    const url = this.domain + '/compile/py';
    return this.http.post(
      url,
      { code: code, stdin: stdin },
      { headers: this.headers }
    );
  }
}
