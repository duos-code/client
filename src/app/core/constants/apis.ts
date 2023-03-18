const base_url= 'https://two3x-server.onrender.com';
//const base_url= 'http://localhost:3000';
export const Apis: any = {
  base_url:base_url,
  compile_c:  +`${base_url}/compile/c`,
  compile_cpp: `${base_url}/compile/cpp`,
  compile_node: `${base_url}/compile/node`,
  compile_java: `${base_url}/compile/java`,
  compile_py: `${base_url}/compile/py`,
};
