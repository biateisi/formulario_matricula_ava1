<template>
  <div class="card-gestao">
    <h1>Seus Cursos</h1>
    <p class="panel-sub">Gerencie ou cancele abaixo</p>
    <div v-if="matriculas.length" class="tabela-wrapper">
      <table class="tabela-matriculas">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Curso</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="mat in matriculas" :key="mat.email + mat.cursoId">
            <td>{{ mat.nome }}</td>
            <td>{{ nomeCurso(mat.cursoId) }}</td>
            <td>
              <button type="button" class="btn btn-danger btn-small" @click="cancelar(mat)">Cancelar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="sem-matriculas">Nenhuma matrícula ainda.</div>
  </div>
</template>

<script>
export default {
  name: 'GestaoMatriculas',
  props: {
    cursos: { type: Array, required: true },
    matriculas: { type: Array, required: true }
  },
  methods: {
    nomeCurso(id) {
      const c = this.cursos.find(c => c.id === id);
      return c ? c.nome : '—';
    },
    cancelar(mat) {
  this.$emit('solicitar-cancelamento', mat);
    }
  }
};
</script>

<style scoped>
.card-gestao { display:flex; flex-direction:column; }
</style>
