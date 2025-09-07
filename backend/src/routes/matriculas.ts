import { Router, Request, Response } from 'express';
import { cursos } from '../data/cursos';
import { validarNovaMatricula } from '../validators/matriculaValidator';
import { criarMatricula, listarMatriculas, removerMatricula } from '../services/matriculaService';

const router = Router();

router.get('/cursos', (_req: Request, res: Response) => {
  res.json(cursos);
});

router.get('/matriculas', (_req: Request, res: Response) => {
  res.json(listarMatriculas());
});

router.post('/matricula', (req: Request, res: Response) => {
  const resultado = validarNovaMatricula(req.body);
  if (!resultado.valido || !resultado.normalizado) {
    return res.status(resultado.status).json({ erro: resultado.erro });
  }
  criarMatricula(resultado.normalizado);
  return res.status(201).json({ mensagem: 'Matrícula realizada com sucesso!' });
});

router.delete('/matriculas/:email/:cursoId', (req: Request, res: Response) => {
  const email = decodeURIComponent(req.params.email).toLowerCase();
  const cursoId = Number(req.params.cursoId);
  const removida = removerMatricula(email, cursoId);
  if (!removida) {
    return res.status(404).json({ erro: 'Matrícula não encontrada.' });
  }
  return res.json({ mensagem: 'Matrícula cancelada.', removida });
});

export default router;
