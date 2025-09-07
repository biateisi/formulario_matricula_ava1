<template>
  <div id="app">
    <h1>Matrícula em Cursos Online</h1>
    <h2>Protótipo de formulário</h2>
  <FormularioMatricula />
  </div>
</template>

<script>
import FormularioMatricula from './components/formulario/FormularioMatricula.vue';
export default {
  name: 'App',
  components: {
    FormularioMatricula
  }
};
</script>

<style>
body {
  font-family: Arial, sans-serif;
  background: #f5f5f5;
}
#app { max-width: 1100px; margin:2rem auto 3rem; }
h1 { margin-bottom:.25rem; }
h2 { margin-top:0; font-size:1rem; font-weight:500; color:#444; }
</style>
