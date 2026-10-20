/* ==========================================================================
   CRÔNICAS DE ELARION — tutorial.js
   --------------------------------------------------------------------------
   Tutorial guiado: escurece a tela, recorta um buraco em volta do elemento
   que está sendo explicado e mostra um balão ao lado dele.

   Como usar numa página:

     Tutorial.iniciar('mestre', [
       { titulo: 'Bem-vindo', texto: 'Explicação geral.' },            // sem alvo: centralizado
       { alvo: '#campo-x', titulo: 'Este campo', texto: 'O que ele faz.' }
     ]);

   Passos cujo elemento não existe na tela são pulados automaticamente —
   assim a mesma lista serve para telas que mudam conforme o estado.

   O tutorial roda sozinho na primeira visita de cada tela e fica guardado
   em localStorage. O botão "Tutorial" na barra reabre quando o usuário quiser.
   ========================================================================== */

const Tutorial = {
  PREFIXO_CHAVE: 'elarion_tutorial_',

  passos: [],
  indice: 0,
  chave: '',
  elementos: null,

  /* ============================================================
     CONTROLE
     ============================================================ */

  /** Já viu o tutorial desta tela? */
  jaViu(chave) {
    try {
      return localStorage.getItem(this.PREFIXO_CHAVE + chave) === 'visto';
    } catch (erro) {
      return false;
    }
  },

  marcarComoVisto(chave) {
    try {
      localStorage.setItem(this.PREFIXO_CHAVE + chave, 'visto');
    } catch (erro) {
      /* navegador sem localStorage: o tutorial só não é lembrado */
    }
  },

  /**
   * Abre o tutorial.
   *
   * @param {string} chave  - identifica a tela (ex: 'mestre', 'mapa')
   * @param {Array}  passos - lista de { alvo?, titulo, texto }
   * @param {object} opcoes - { apenasPrimeiraVez: true } para abrir sozinho
   */
  iniciar(chave, passos, opcoes = {}) {
    if (opcoes.apenasPrimeiraVez && this.jaViu(chave)) return;

    this.chave = chave;
    // Fora os passos sem alvo, só entram os que existem mesmo na tela.
    this.passos = passos.filter(p => !p.alvo || document.querySelector(p.alvo));
    this.indice = 0;

    if (!this.passos.length) return;

    this.montarCena();
    this.mostrarPasso();
  },

  /** Registra o botão que reabre o tutorial e, se for o caso, abre sozinho. */
  instalar(chave, passos, seletorBotao) {
    const botao = seletorBotao && document.querySelector(seletorBotao);
    if (botao) {
      botao.addEventListener('click', (evento) => {
        evento.preventDefault();
        this.iniciar(chave, passos);
      });
    }
    this.iniciar(chave, passos, { apenasPrimeiraVez: true });
  },

  /* ============================================================
     DESENHO
     ============================================================ */

  montarCena() {
    const cena = document.createElement('div');
    cena.className = 'tutorial-cena';
    cena.innerHTML = `
      <div class="tutorial-recorte" id="tutorial-recorte"></div>
      <div class="tutorial-balao" id="tutorial-balao">
        <span class="tutorial-passo-num" id="tutorial-contador"></span>
        <h3 id="tutorial-titulo"></h3>
        <p id="tutorial-texto"></p>
        <div class="tutorial-acoes">
          <button type="button" class="tutorial-pular" id="tutorial-pular">Pular</button>
          <div class="tutorial-navegacao">
            <button type="button" class="btn btn-secondary btn-sm" id="tutorial-voltar">Voltar</button>
            <button type="button" class="btn btn-primary btn-sm" id="tutorial-avancar">Próximo</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(cena);

    this.elementos = {
      cena,
      recorte: cena.querySelector('#tutorial-recorte'),
      balao: cena.querySelector('#tutorial-balao'),
      contador: cena.querySelector('#tutorial-contador'),
      titulo: cena.querySelector('#tutorial-titulo'),
      texto: cena.querySelector('#tutorial-texto'),
      voltar: cena.querySelector('#tutorial-voltar'),
      avancar: cena.querySelector('#tutorial-avancar'),
      pular: cena.querySelector('#tutorial-pular')
    };

    this.elementos.avancar.addEventListener('click', () => this.avancar());
    this.elementos.voltar.addEventListener('click', () => this.voltar());
    this.elementos.pular.addEventListener('click', () => this.encerrar());

    // Esc fecha; setas navegam.
    this._aoTeclar = (evento) => {
      if (evento.key === 'Escape') this.encerrar();
      if (evento.key === 'ArrowRight' || evento.key === 'Enter') this.avancar();
      if (evento.key === 'ArrowLeft') this.voltar();
    };
    document.addEventListener('keydown', this._aoTeclar);

    // Reposiciona se a janela mudar de tamanho ou rolar.
    this._aoMover = () => this.posicionar();
    window.addEventListener('resize', this._aoMover);
    window.addEventListener('scroll', this._aoMover, true);
  },

  mostrarPasso() {
    const passo = this.passos[this.indice];
    const el = this.elementos;

    el.contador.textContent = `Passo ${this.indice + 1} de ${this.passos.length}`;
    el.titulo.textContent = passo.titulo;
    el.texto.textContent = passo.texto;

    el.voltar.style.visibility = this.indice === 0 ? 'hidden' : 'visible';
    el.avancar.textContent = this.indice === this.passos.length - 1 ? 'Concluir' : 'Próximo';

    // Leva o elemento para a área visível antes de medir onde ele está.
    const alvo = passo.alvo && document.querySelector(passo.alvo);
    if (alvo) alvo.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => this.posicionar(), alvo ? 320 : 0);
  },

  /** Coloca o recorte sobre o elemento e o balão no espaço que couber. */
  posicionar() {
    if (!this.elementos) return;

    const passo = this.passos[this.indice];
    const alvo = passo.alvo && document.querySelector(passo.alvo);
    const recorte = this.elementos.recorte;
    const balao = this.elementos.balao;

    // Passo sem alvo: só o balão, no centro da tela.
    if (!alvo) {
      recorte.style.display = 'none';
      balao.classList.add('centralizado');
      balao.style.top = '';
      balao.style.left = '';
      return;
    }

    balao.classList.remove('centralizado');
    recorte.style.display = 'block';

    const area = alvo.getBoundingClientRect();
    const margem = 8;

    recorte.style.top = (area.top - margem) + 'px';
    recorte.style.left = (area.left - margem) + 'px';
    recorte.style.width = (area.width + margem * 2) + 'px';
    recorte.style.height = (area.height + margem * 2) + 'px';

    // Abaixo do alvo quando couber; acima quando não couber.
    const alturaBalao = balao.offsetHeight || 170;
    const larguraBalao = balao.offsetWidth || 320;
    const cabeAbaixo = area.bottom + alturaBalao + 24 < window.innerHeight;

    const topo = cabeAbaixo ? area.bottom + 16 : Math.max(12, area.top - alturaBalao - 16);
    let esquerda = area.left + area.width / 2 - larguraBalao / 2;
    esquerda = Math.max(12, Math.min(esquerda, window.innerWidth - larguraBalao - 12));

    balao.style.top = topo + 'px';
    balao.style.left = esquerda + 'px';
  },

  /* ============================================================
     NAVEGAÇÃO
     ============================================================ */

  avancar() {
    if (this.indice >= this.passos.length - 1) {
      this.encerrar();
      return;
    }
    this.indice++;
    this.mostrarPasso();
  },

  voltar() {
    if (this.indice === 0) return;
    this.indice--;
    this.mostrarPasso();
  },

  encerrar() {
    if (!this.elementos) return;

    this.marcarComoVisto(this.chave);
    document.removeEventListener('keydown', this._aoTeclar);
    window.removeEventListener('resize', this._aoMover);
    window.removeEventListener('scroll', this._aoMover, true);

    this.elementos.cena.remove();
    this.elementos = null;
  }
};
