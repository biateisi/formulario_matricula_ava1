export const cursos = [
  { id: 1, nome: 'Matemática Básica' },
  { id: 2, nome: 'Programação em JavaScript' },
  { id: 3, nome: 'Inglês para Iniciantes' },
  { id: 4, nome: 'Portugês Instrumental' },
  { id: 5, nome: 'Lógica de Programação' },
  { id: 6, nome: 'Análise de Dados' },
  { id: 7, nome: 'Estatística Aplicada' },
  { id: 8, nome: 'Agilidade' },
  { id: 9, nome: 'Segurança da Informação' }
];

export type Curso = typeof cursos[number];
