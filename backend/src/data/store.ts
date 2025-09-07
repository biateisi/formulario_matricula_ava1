import type { Curso } from './cursos';

export interface Matricula {
  nome: string;
  email: string;
  cursoId: number;
}

export const matriculas: Matricula[] = [];

export function cursoExiste(cursos: Curso[], id: number) {
  return cursos.some(c => c.id === id);
}
