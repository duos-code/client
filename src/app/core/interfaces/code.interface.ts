interface editorOptions {
  theme: string, language:string
}

export interface Code {
  uri: string;
  input: string;
  value: string;
  output: string;
  editorOptions: editorOptions;
}
