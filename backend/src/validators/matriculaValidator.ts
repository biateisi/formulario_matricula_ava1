import { matriculas } from '../data/store';
import { cursos } from '../data/cursos';

export interface NovaMatriculaInput { nome?: string; email?: string; cursoId?: number; }

export interface ValidacaoResultado {
  valido: boolean;
  status: number;
  erro?: string;
  normalizado?: { nome: string; email: string; cursoId: number };
}

const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function validarNovaMatricula(input: NovaMatriculaInput): ValidacaoResultado {
  let nome = typeof input.nome === 'string' ? input.nome.trim() : '';
  let email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
  const cursoId = typeof input.cursoId === 'number' ? input.cursoId : undefined;

  if (!nome || !email || !cursoId) {
    return { valido: false, status: 400, erro: 'Todos os campos são obrigatórios.' };
  }
  if (!emailRegex.test(email)) {
    return { valido: false, status: 400, erro: 'E-mail inválido.' };
  }
  if (!cursos.find(c => c.id === cursoId)) {
    return { valido: false, status: 400, erro: 'Curso inválido.' };
  }
  if (matriculas.some(m => m.email === email && m.cursoId === cursoId)) {
    return { valido: false, status: 409, erro: 'Já existe uma matrícula deste e-mail neste curso.' };
  }

  return { valido: true, status: 201, normalizado: { nome, email, cursoId } };
}
