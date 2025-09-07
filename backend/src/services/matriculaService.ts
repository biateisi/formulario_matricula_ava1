import { matriculas, Matricula } from '../data/store';

export function criarMatricula(dados: Matricula) {
  matriculas.push(dados);
  return dados;
}

export function listarMatriculas() {
  return matriculas;
}

export function removerMatricula(email: string, cursoId: number) {
  const idx = matriculas.findIndex(m => m.email === email && m.cursoId === cursoId);
  if (idx === -1) return undefined;
  const removida = matriculas.splice(idx, 1)[0];
  return removida;
}
