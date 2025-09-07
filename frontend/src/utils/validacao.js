export function validarEmail(email) {
  if (!email) return false;
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

export function validarDadosMatricula({ nome, email, cursoId, matriculas }) {
  const erros = {};
  if (!nome) erros.nome = 'Nome obrigatório.';
  if (!validarEmail(email)) erros.email = 'E-mail válido obrigatório.';
  if (!cursoId) erros.cursoId = 'Selecione um curso.';
  if (email && cursoId && Array.isArray(matriculas)) {
    const dup = matriculas.some(m => m.email === email.trim().toLowerCase() && m.cursoId === cursoId);
    if (dup) erros.cursoId = 'Você já está matriculado neste curso.';
  }
  return erros;
}
