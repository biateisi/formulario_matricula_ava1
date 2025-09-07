import express from 'express';
import cors from 'cors';
import matriculasRoutes from './routes/matriculas';

const app = express();
app.use(cors());
app.use(express.json());

app.use(matriculasRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
