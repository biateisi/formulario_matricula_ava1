<template>
  <div class="card-matricula">
    <h1>Nova Matrícula</h1>
    <p class="panel-sub">Preencha os dados para se inscrever</p>
    <form @submit.prevent="onSubmit" class="formulario-matricula">
      <div class="campo">
        <label for="nome">Nome completo</label>
  <input id="nome" v-model="nome" @input="emitIdentidade" type="text" required />
        <span v-if="erros.nome" class="erro">{{ erros.nome }}</span>
      </div>
      <div class="campo">
        <label for="email">E-mail</label>
  <input id="email" v-model="email" @input="emitIdentidade" type="email" required />
        <span v-if="erros.email" class="erro">{{ erros.email }}</span>
      </div>
      <div class="campo">
        <label for="curso">Curso</label>
        <select id="curso" v-model.number="cursoId" required>
          <option value="" disabled>Selecione um curso</option>
          <option v-for="curso in cursos" :key="curso.id" :value="curso.id">{{ curso.nome }}</option>
        </select>
        <span v-if="erros.cursoId" class="erro">{{ erros.cursoId }}</span>
      </div>
  <button type="submit" class="btn btn-primario btn-full" :disabled="carregando">
        <span v-if="carregando">Enviando...</span>
        <span v-else>Matricular</span>
      </button>
  <div v-if="mensagem && mensagemTipo === 'erro'" :class="['alerta', mensagemTipo]">{{ mensagem }}</div>
    </form>
  </div>
</template>

<script>
import { validarDadosMatricula } from '../../utils/validacao';
export default {
  name: 'FormMatricula',
  props: {
    cursos: { type: Array, required: true },
    matriculas: { type: Array, required: true }
  },
  data() {
    return {
      nome: '',
      email: '',
      cursoId: '',
      erros: {},
      carregando: false,
  mensagem: '',
  mensagemTipo: ''
    };
  },
  methods: {
    emitIdentidade() {
      this.$emit('identidade-alterada', { nome: this.nome, email: this.email });
    },
    validar() {
      this.erros = validarDadosMatricula({
        nome: this.nome,
        email: this.email,
        cursoId: this.cursoId,
        matriculas: this.matriculas
      });
      return Object.keys(this.erros).length === 0;
    },
    onSubmit() {
      if (!this.validar()) return;
      this.carregando = true;
      this.mensagem = '';
      fetch('http://localhost:3001/matricula', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: this.nome, email: this.email, cursoId: this.cursoId })
      })
        .then(async resp => {
          if (!resp.ok) {
            const data = await resp.json().catch(() => ({}));
            throw new Error(data.erro || 'Erro ao enviar matrícula.');
          }
          return resp.json();
        })
        .then(() => {
          this.$emit('confirmado', { nome: this.nome, email: this.email, cursoId: this.cursoId });
          this.$emit('atualizar');
          this.nome = '';
          this.email = '';
          this.cursoId = '';
          this.mensagem = '';
          this.mensagemTipo = '';
        })
        .catch(err => {
          this.mensagem = err.message || 'Erro ao enviar matrícula.';
          this.mensagemTipo = 'erro';
        })
        .finally(() => { this.carregando = false; });
    }
  }
};
</script>

<style scoped>
.card-matricula { display:flex; flex-direction:column; }
</style>
