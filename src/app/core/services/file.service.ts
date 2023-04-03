import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor() {}

  private getLenguageExtension(lenguage: string): string {
    switch (lenguage) {
      case 'c':
        return 'c';
      case 'cpp':
        return 'cpp';
      case 'javascript':
        return 'js';
      case 'java':
        return 'java';
      case 'python':
        return 'py';
      default:
        return 'text';
    }
  }

  saveCodeAsFile(code: string, lenguage: string, fileName: string) {
    if (!code) code = '';

    if (!fileName) fileName = 'duoscode';

    if (!lenguage) lenguage = 'text';

    try {
      var a = document.createElement('a');
      var file = new Blob([code], { type: 'text/plain' });

      a.href = URL.createObjectURL(file);
      a.download = fileName + '.' + this.getLenguageExtension(lenguage);
      a.click();
    } catch (e: any) {
      console.error(e);
    }
  }
}
