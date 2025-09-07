<template>
  <div class="layout-auth">
    <FormMatricula :cursos="cursos" :matriculas="matriculas" @atualizar="carregarMatriculas" @confirmado="mostrarAlerta" @identidade-alterada="onIdentidadeAlterada" />
    <transition name="fade">
      <div v-if="alertaSucesso.visivel" :class="['alert-confirma', alertaSucesso.tipo, 'inline']">
        <strong>{{ alertaSucesso.titulo }}</strong>
        <div class="detalhe">{{ alertaSucesso.texto }}</div>
        <button class="fechar" @click="fecharAlerta">×</button>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="alertaAviso.visivel" class="alert-confirma aviso inline">
        <strong>Atenção</strong>
        <div class="detalhe">{{ alertaAviso.texto }}</div>
      </div>
    </transition>
    <GestaoMatriculas v-if="!alertaAviso.visivel" :cursos="cursos" :matriculas="matriculasFiltradas" @atualizar="carregarMatriculas" @solicitar-cancelamento="abrirModalCancelamento" />

    <transition name="fade">
      <div v-if="modalCancelamento.visivel" class="modal-overlay">
        <div class="modal">
          <h3>Confirmar cancelamento</h3>
          <p class="texto">Remover matrícula de <strong>{{ modalCancelamento.item.nome }}</strong> em <strong>{{ nomeCurso(modalCancelamento.item.cursoId) }}</strong>?</p>
          <div class="acoes">
            <button class="btn btn-neutral" @click="fecharModal">Manter</button>
            <button class="btn btn-danger" @click="confirmarCancelamento">Cancelar matrícula</button>
          </div>
          <button class="fechar" @click="fecharModal">×</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import FormMatricula from '../matricula/FormMatricula.vue';
import GestaoMatriculas from '../gestao/GestaoMatriculas.vue';
export default {
  name: 'FormularioMatricula',
  components: { FormMatricula, GestaoMatriculas },
  data() {
    return {
  cursos: [],
  matriculas: [],
  usuarioRef: { nome: '', email: '' },
  alertaSucesso: { visivel: false, texto: '', titulo: '', tipo: 'sucesso' },
  alertaAviso: { visivel: false, texto: '' },
  timeoutId: null,
  modalCancelamento: { visivel: false, item: {} }
    };
  },
  computed: {
    matriculasFiltradas() {
  if (!this.usuarioRef.email) return this.matriculas;
  return this.matriculas.filter(m => this.normalizarEmail(m.email) === this.usuarioRef.email && this.normalizarNome(m.nome) === this.usuarioRef.nome);
    }
  },
  mounted() {
    fetch('http://localhost:3001/cursos')
      .then(async r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => { this.cursos = data; })
      .catch(() => { this.mensagem = 'Erro ao carregar cursos.'; this.mensagemTipo = 'erro'; });
    this.carregarMatriculas();
  },
  methods: {
    normalizarEmail(e) { return (e || '').trim().toLowerCase(); },
    normalizarNome(n) { return (n || '').trim().replace(/\s+/g,' '); },
    carregarMatriculas() {
      fetch('http://localhost:3001/matriculas')
        .then(async r => { if (!r.ok) throw new Error(); return r.json(); })
        .then(data => { this.matriculas = data; })
        .catch(() => {});
    },
    onIdentidadeAlterada(payload) {
      if (!this.usuarioRef.email) return;
      const nomeNorm = this.normalizarNome(payload.nome);
      const emailNorm = this.normalizarEmail(payload.email);
      const diferente = (payload.nome && payload.email) && (nomeNorm !== this.usuarioRef.nome || emailNorm !== this.usuarioRef.email);
      if (diferente) {
        this.alertaAviso.texto = 'Os dados digitados podem estar incorretos ou pertencer a outro usuário';
        this.alertaAviso.visivel = true;
      } else {
        this.alertaAviso.visivel = false;
      }
    },
    nomeCurso(id) { const c = this.cursos.find(c => c.id === id); return c ? c.nome : 'curso'; },
    mostrarAlerta(payload) {
      const curso = this.cursos.find(c => c.id === payload.cursoId);
      const acao = payload.acao || payload.action || 'create';
      if (acao === 'cancel') {
        this.alertaSucesso.titulo = '❌ Matrícula cancelada';
        this.alertaSucesso.texto = `${payload.nome || ''} não está inscrito em ${curso ? curso.nome : 'curso'}.`;
        this.alertaSucesso.tipo = 'cancel';
      } else {
        this.alertaSucesso.titulo = '✅ Matrícula confirmada';
        this.alertaSucesso.texto = `${payload.nome} inscrito em ${curso ? curso.nome : 'curso'}.`;
        this.alertaSucesso.tipo = 'sucesso';
        const nomeNorm = this.normalizarNome(payload.nome);
        const emailNorm = this.normalizarEmail(payload.email);
        if (!this.usuarioRef.email) {
          this.usuarioRef = { nome: nomeNorm, email: emailNorm };
        }
        if (this.usuarioRef.email === emailNorm && this.usuarioRef.nome === nomeNorm) {
          this.alertaAviso.visivel = false;
        }
      }
      this.alertaSucesso.visivel = true;
      if (this.timeoutId) clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => { this.alertaSucesso.visivel = false; }, 4500);
    },
    fecharAlerta() {
      this.alertaSucesso.visivel = false;
      if (this.timeoutId) clearTimeout(this.timeoutId);
    },
    abrirModalCancelamento(item) {
      this.modalCancelamento.item = item;
      this.modalCancelamento.visivel = true;
    },
    fecharModal() {
      this.modalCancelamento.visivel = false;
      this.modalCancelamento.item = {};
    },
  confirmarCancelamento() {
      const m = this.modalCancelamento.item;
      if (!m || !m.email) return;
      fetch(`http://localhost:3001/matriculas/${encodeURIComponent(m.email)}/${m.cursoId}`, { method: 'DELETE' })
        .then(async r => { if (!r.ok) throw new Error(); return r.json(); })
        .then(() => {
      this.mostrarAlerta({ nome: m.nome, cursoId: m.cursoId, acao: 'cancel' });
          this.carregarMatriculas();
        })
        .finally(() => this.fecharModal());
    }
  }
};
</script>

<style scoped>
.layout-auth { display:flex; flex-direction:column; gap:2rem; background:linear-gradient(135deg,#005d97,#008a74); padding:2.5rem 2.75rem 3rem; border-radius:26px; color:#fff; box-shadow:0 6px 30px -4px rgba(0,0,0,.28); max-width:1000px; margin:0 auto; }
.layout-auth > * { background:linear-gradient(160deg,rgba(255,255,255,.18),rgba(255,255,255,.07)); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,.16); border-radius:20px; padding:2rem 2rem 2.3rem; box-shadow:0 4px 18px -2px rgba(0,0,0,.22); }
 .layout-auth h2 { font-size:1.05rem; font-weight:600; letter-spacing:.5px; margin:0 0 .9rem; text-transform:none; }
 .layout-auth .panel-sub { font-size:.8rem; font-weight:400; opacity:.9; margin:-.5rem 0 1.2rem; }
 .alert-confirma { position:relative; background:#ffffff; color:#224; border-left:5px solid #15a362; padding:.9rem 2.2rem .9rem 1rem; border-radius:14px; box-shadow:0 6px 24px -6px rgba(0,0,0,.35); font-size:.85rem; display:flex; flex-direction:column; gap:.35rem; animation:slideDown .45s ease; }
 .alert-confirma.inline { background:rgba(255,255,255,.95); backdrop-filter:blur(4px); -webkit-backdrop-filter:blur(4px); }
 .alert-confirma.cancel { border-left-color:#d32f2f; }
 .alert-confirma.cancel strong { color:#b71c1c; }
 .alert-confirma.sucesso strong { color:#0d6844; }
 .alert-confirma.aviso { border-left-color:#f1b600; background:rgba(255,255,255,.93); }
 .alert-confirma.aviso strong { color:#8a5b00; }

 .modal-overlay { position:fixed; inset:0; background:rgba(15,25,35,.65); display:flex; align-items:center; justify-content:center; z-index:50; backdrop-filter:blur(3px); }
 .modal { position:relative; background:#ffffff; color:#1f2b33; width:100%; max-width:440px; padding:1.4rem 1.6rem 1.55rem; border-radius:18px; box-shadow:0 8px 40px -6px rgba(0,0,0,.35); display:flex; flex-direction:column; gap:1.1rem; }
 .modal h3 { margin:0; font-size:1.05rem; font-weight:600; }
 .modal .texto { font-size:.8rem; line-height:1.35; }
 .modal .acoes { display:flex; gap:.75rem; justify-content:flex-end; flex-wrap:wrap; }
 .modal button { font-family:inherit; }

 .modal .fechar { position:absolute; top:6px; right:10px; background:transparent; border:none; font-size:1.1rem; cursor:pointer; color:#444; line-height:1; }
 .alert-confirma .detalhe { font-size:.72rem; opacity:.85; }
 .alert-confirma .fechar { position:absolute; top:6px; right:10px; background:transparent; border:none; font-size:1.1rem; cursor:pointer; color:#444; line-height:1; }
 .fade-enter-active, .fade-leave-active { transition: opacity .35s; }
 .fade-enter, .fade-leave-to { opacity:0; }
 @keyframes slideDown { from { transform:translateY(-8px); opacity:0; } to { transform:translateY(0); opacity:1; } }
@media (max-width: 720px) { .layout-auth { padding:2rem 1.35rem 2.4rem; border-radius:22px; } .layout-auth > * { padding:1.55rem 1.25rem 2rem; } }
</style>
