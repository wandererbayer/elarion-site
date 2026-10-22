/* ==========================================================================
   CRÔNICAS DE ELARION — core.js
   ==========================================================================
   Este arquivo é o "motor" do jogo. Ele é carregado em TODAS as páginas
   (depois de dados-jogo.js) e contém funções genéricas e reutilizáveis:

   - Estado        -> salvar/ler a sessão e o personagem no localStorage
   - Dados (RPG)    -> rolagem de d20 animada + teste de atributo
   - Sheets         -> integração opcional com Google Sheets (placeholder)
   - Utilidades     -> toast de aviso, cálculo de nível, proteção de página

   localStorage é usado porque o site é 100% estático (sem servidor/banco
   de dados pago) — cada navegador guarda o progresso do próprio jogador.
   ========================================================================== */

/* ============================================================
   1. ESTADO DO JOGADOR (localStorage)
   ============================================================ */
const Estado = {
  // Chaves usadas no localStorage (centralizadas aqui para evitar erro de digitação)
  CHAVE_SESSAO: 'elarion_sessao',
  CHAVE_PERSONAGEM: 'elarion_personagem',
  CHAVE_ULTIMO_RESULTADO: 'elarion_ultimo_resultado',

  /** Salva quem está logado (papel: aluno ou mestre, nome e turma). */
  salvarSessao(sessao) {
    localStorage.setItem(this.CHAVE_SESSAO, JSON.stringify(sessao));
  },

  /** Lê a sessão atual. Retorna null se ninguém fez login ainda. */
  getSessao() {
    const dados = localStorage.getItem(this.CHAVE_SESSAO);
    return dados ? JSON.parse(dados) : null;
  },

  /**
   * Chave do personagem: CAMPANHA + jogador.
   *
   * Duas correções moram aqui. A primeira veio antes: havia uma chave única
   * para o navegador inteiro, e quem entrasse depois herdava o herói de quem
   * entrou antes. A segunda é esta: a ficha também precisa pertencer a uma
   * campanha. Sem isso, o mesmo aluno levava o herói de uma aventura para
   * outra, e o elenco de uma campanha nova nascia vazio enquanto as fichas
   * continuavam penduradas em lugar nenhum.
   *
   * Agora cada aluno tem um herói POR campanha — que é o que faz sentido:
   * aventura nova, personagem novo.
   */
  chavePersonagem(campanhaId) {
    const apelido = this.apelidoJogador();
    if (!apelido) return this.CHAVE_PERSONAGEM;

    const campanha = campanhaId || this.getCampanhaId();
    return campanha
      ? this.CHAVE_PERSONAGEM + ':' + campanha + ':' + apelido
      : this.CHAVE_PERSONAGEM + ':' + apelido;
  },

  /** Apelido do jogador atual: nome e turma viram uma chave estável. */
  apelidoJogador() {
    const sessao = this.getSessao();
    if (!sessao) return '';
    return (sessao.nome + '|' + sessao.turma).toLowerCase().replace(/[^a-z0-9]+/g, '-');
  },

  /** Campanha em que este jogador entrou, escolhida no login. */
  getCampanhaId() {
    const sessao = this.getSessao();
    return (sessao && sessao.campanhaId) || '';
  },

  /**
   * Salva o personagem. Junto vai o 'jogador' (nome e turma da sessão):
   * é por ele que o painel do mestre identifica a pessoa, e não pelo nome
   * do herói — que o aluno escolhe e pode ser qualquer coisa.
   */
  salvarPersonagem(personagem) {
    const sessao = this.getSessao();
    if (sessao) {
      personagem.jogador = {
        chave: this.apelidoJogador(),
        nome: sessao.nome,
        turma: sessao.turma
      };
      personagem.campanhaId = sessao.campanhaId || '';
    }
    localStorage.setItem(this.chavePersonagem(), JSON.stringify(personagem));
  },

  /**
   * Lê o personagem salvo. Retorna null se o aluno ainda não criou um.
   *
   * Compatibilidade: heróis criados antes desta versão estão na chave sem
   * campanha. Se existir um, ele é adotado pela campanha atual na primeira
   * leitura — ninguém perde o progresso que já tinha.
   */
  getPersonagem() {
    const dados = localStorage.getItem(this.chavePersonagem());
    if (dados) return JSON.parse(dados);

    const apelido = this.apelidoJogador();
    if (!apelido || !this.getCampanhaId()) return null;

    const antigo = localStorage.getItem(this.CHAVE_PERSONAGEM + ':' + apelido);
    if (!antigo) return null;

    const personagem = JSON.parse(antigo);
    localStorage.setItem(this.chavePersonagem(), antigo);
    localStorage.removeItem(this.CHAVE_PERSONAGEM + ':' + apelido);
    return personagem;
  },

  /** Apaga só o herói do jogador atual (botão "Recomeçar herói"). */
  apagarPersonagem() {
    localStorage.removeItem(this.chavePersonagem());
    localStorage.removeItem(this.CHAVE_ULTIMO_RESULTADO);
  },

  /** Guarda o resultado da última missão jogada, para a tela de resultado ler. */
  salvarUltimoResultado(resultado) {
    localStorage.setItem(this.CHAVE_ULTIMO_RESULTADO, JSON.stringify(resultado));
  },
  getUltimoResultado() {
    const dados = localStorage.getItem(this.CHAVE_ULTIMO_RESULTADO);
    return dados ? JSON.parse(dados) : null;
  },

  /** Apaga tudo (usado no botão "Sair"). */
  limparTudo() {
    // Só encerra a sessão: os heróis de cada jogador continuam salvos,
    // para que ele volte depois e encontre o progresso onde parou.
    localStorage.removeItem(this.CHAVE_SESSAO);
    localStorage.removeItem(this.CHAVE_ULTIMO_RESULTADO);
  }
};

/* ============================================================
   2. PROTEÇÃO DE PÁGINA (usabilidade)
   Evita que alguém acesse direto "mapa.html" sem ter feito login,
   ou "mestre.html" sendo um aluno, etc. Redireciona para a página
   correta quando falta algo.
   ============================================================ */
function exigirSessao(papelNecessario) {
  const sessao = Estado.getSessao();
  if (!sessao) {
    window.location.href = 'login.html';
    return null;
  }
  if (papelNecessario && sessao.papel !== papelNecessario) {
    // Ex: um aluno tentando abrir o painel do mestre é mandado para o mapa.
    window.location.href = sessao.papel === 'mestre' ? 'mestre.html' : 'mapa.html';
    return null;
  }
  return sessao;
}

function exigirPersonagem() {
  const personagem = Estado.getPersonagem();
  if (!personagem) {
    window.location.href = 'personagem.html';
    return null;
  }
  // Heróis criados antes desta versão não têm Determinação/Inspiração:
  // normalizar evita quebrar o jogo de quem já estava jogando.
  return Recursos.normalizar(personagem);
}

/* ============================================================
   3. SISTEMA DE NÍVEL E XP
   Cada nível exige mais XP que o anterior (100 XP x nível atual).
   Isso é só uma fórmula simples — pode ser ajustada livremente.
   ============================================================ */
function calcularNivel(xpTotal) {
  let nivel = 1;
  let xpRestante = xpTotal;
  let xpParaProximo = 100;
  while (xpRestante >= xpParaProximo) {
    xpRestante -= xpParaProximo;
    nivel++;
    xpParaProximo = 100 * nivel;
  }
  return { nivel, xpAtualNoNivel: xpRestante, xpParaProximoNivel: xpParaProximo };
}

/** Modificador ao estilo D&D: atributo 10 = +0, cada 2 pontos acima/abaixo muda 1. */
function calcularModificador(valorAtributo) {
  return Math.floor((valorAtributo - 10) / 2);
}

/** Rola 3 dados de 6 lados e soma (método clássico de RPG de mesa para gerar atributos, resultado entre 3 e 18). */
function rolar3d6() {
  let soma = 0;
  for (let i = 0; i < 3; i++) soma += Math.floor(Math.random() * 6) + 1;
  return soma;
}

/* ============================================================
   4. ROLAGEM DE DADOS — o coração do RPG
   ============================================================ */

/**
 * Cria e mostra o modal de rolagem de dados na tela, com uma pequena
 * animação (o número "gira" por um instante antes de parar), igual ao
 * efeito usado em jogos de D&D digitais.
 *
 * @param {number} lados       - lados do dado (sempre 20 no nosso jogo: d20)
 * @param {function} aoTerminar - função chamada com o valor final sorteado
 */
/**
 * Modal de rolagem no estilo Baldur's Gate 3: a dificuldade (CD) e cada
 * modificador ficam VISÍVEIS antes de rolar, e o dado é rolado sem que o
 * jogador saiba o resultado. A tensão vem da transparência, não do mistério.
 *
 * @param {object} opcoes
 *   cd            - dificuldade a bater
 *   modificadores - lista de { rotulo, valor } exibida linha a linha
 *   vantagem      - 'vantagem' | 'desvantagem' | null (rola 2d20)
 *   titulo        - texto do cabeçalho
 *   podeReRolar   - se o jogador tem Inspiração/item para repetir a rolagem
 *   aoReRolar     - callback chamado quando ele decide gastar a re-rolagem
 *   aoTerminar    - callback({ valorDado, dados, total, sucesso, critico, falhaCritica })
 */
function rolarDadoAnimado({ cd, modificadores = [], vantagem = null, titulo = 'Teste de Atributo',
                            podeReRolar = false, aoReRolar = null, aoTerminar }) {
  const somaMods = modificadores.reduce((total, m) => total + m.valor, 0);

  const linhasMods = modificadores
    .map(m => `<div class="mod-linha"><span>${escaparHTML(m.rotulo)}</span><strong>${m.valor >= 0 ? '+' : ''}${m.valor}</strong></div>`)
    .join('');

  const selo = vantagem
    ? `<span class="selo-vantagem ${vantagem}">${vantagem === 'vantagem' ? 'Vantagem' : 'Desvantagem'}</span>`
    : '';

  const overlay = document.createElement('div');
  overlay.className = 'modal-dados-overlay';
  overlay.innerHTML = `
    <div class="modal-dados">
      <h3>${escaparHTML(titulo)}</h3>
      <div class="cd-alvo">Dificuldade <strong>${cd}</strong> ${selo}</div>
      <div class="mod-lista">
        <div class="mod-linha"><span>Dado (d20)</span><strong>?</strong></div>
        ${linhasMods}
        <div class="mod-linha total"><span>Total</span><strong id="dado-total-preview">? ${somaMods >= 0 ? '+' : ''}${somaMods}</strong></div>
      </div>
      <div class="dado-visual">🎲</div>
      <div class="dado-resultado" id="dado-resultado-valor">?</div>
      <p class="dado-detalhe" id="dado-detalhe"></p>
      <button class="btn btn-primary btn-block" id="btn-rolar-dado">Rolar o Dado</button>
      <button class="btn btn-outline btn-block mt-1" id="btn-rerrolar" style="display:none;">
        ⟲ Gastar Inspiração e rolar de novo
      </button>
    </div>`;
  document.body.appendChild(overlay);

  const botao = overlay.querySelector('#btn-rolar-dado');
  const botaoRe = overlay.querySelector('#btn-rerrolar');
  const resultadoEl = overlay.querySelector('#dado-resultado-valor');
  const detalheEl = overlay.querySelector('#dado-detalhe');
  const totalEl = overlay.querySelector('#dado-total-preview');

  /** Executa uma rolagem (com animação) e mostra o desfecho. */
  function rolar() {
    botao.disabled = true;
    botaoRe.style.display = 'none';
    resultadoEl.classList.remove('critico-sucesso', 'critico-falha');

    let giros = 0;
    const intervalo = setInterval(() => {
      resultadoEl.textContent = Math.floor(Math.random() * 20) + 1;
      giros++;
      if (giros < 12) return;

      clearInterval(intervalo);

      // Vantagem/desvantagem: dois dados, fica com o melhor ou o pior.
      const dados = [Math.floor(Math.random() * 20) + 1];
      if (vantagem) dados.push(Math.floor(Math.random() * 20) + 1);
      const valorDado = vantagem === 'vantagem' ? Math.max(...dados)
                      : vantagem === 'desvantagem' ? Math.min(...dados)
                      : dados[0];

      const total = valorDado + somaMods;
      const critico = valorDado === 20;
      const falhaCritica = valorDado === 1;
      const sucesso = critico || (!falhaCritica && total >= cd);

      resultadoEl.textContent = valorDado;
      if (critico) resultadoEl.classList.add('critico-sucesso');
      if (falhaCritica) resultadoEl.classList.add('critico-falha');

      totalEl.textContent = `${total}`;
      detalheEl.textContent = (vantagem ? `Dados: ${dados.join(' e ')} → ` : '')
        + `${valorDado} ${somaMods >= 0 ? '+' : '−'} ${Math.abs(somaMods)} = ${total} contra CD ${cd}`;

      const desfecho = { valorDado, dados, total, sucesso, critico, falhaCritica };

      // Falhou e ainda pode gastar Inspiração? Oferece a re-rolagem (BG3).
      if (!sucesso && podeReRolar && aoReRolar) {
        botaoRe.style.display = 'flex';
        botaoRe.onclick = () => {
          if (aoReRolar() === false) return; // sem recurso: mantém o resultado
          rolar();
        };
        botao.textContent = 'Aceitar o destino';
        botao.disabled = false;
        botao.onclick = () => { fechar(desfecho); };
        return;
      }

      setTimeout(() => fechar(desfecho), 1400);
    }, 70);
  }

  function fechar(desfecho) {
    if (overlay.parentNode) document.body.removeChild(overlay);
    aoTerminar(desfecho);
  }

  botao.addEventListener('click', rolar);
}

/**
 * Teste de atributo: monta a lista de modificadores (atributo, itens,
 * afinidade de classe) e chama o modal de rolagem.
 *
 * @param {object} opcoes
 *   personagem, atributo, cd, vantagem, titulo, aoConcluir
 */
function testarAtributo({ personagem, atributo, cd, vantagem = null, titulo, aoConcluir }) {
  const modificadores = [];

  const mod = calcularModificador(personagem.atributos[atributo]);
  modificadores.push({ rotulo: ATRIBUTOS[atributo].nome, valor: mod });

  // Bônus temporário de item (Tomo de Vareth), consumido nesta rolagem.
  const bonusItem = personagem.efeitos && personagem.efeitos.bonusRolagem;
  if (bonusItem) {
    modificadores.push({ rotulo: 'Tomo de Vareth', valor: bonusItem });
    delete personagem.efeitos.bonusRolagem;
  }

  // Afinidade: a classe treinou justamente este atributo.
  const classe = buscarClasse(personagem.classeId);
  if (classe && classe.atributoPrincipal === atributo) {
    modificadores.push({ rotulo: 'Afinidade de ' + classe.nome, valor: 2 });
  }

  // Manto do Caçador dá vantagem; desvantagem vem da cena.
  if (personagem.efeitos && personagem.efeitos.vantagem) {
    vantagem = 'vantagem';
    delete personagem.efeitos.vantagem;
  }

  rolarDadoAnimado({
    cd,
    modificadores,
    vantagem,
    titulo: titulo || 'Teste de ' + ATRIBUTOS[atributo].nome,
    podeReRolar: Recursos.podeReRolar(personagem),
    aoReRolar: () => Recursos.gastarReRolagem(personagem),
    aoTerminar: (desfecho) => {
      // Amuleto de Osso transforma falha crítica em falha comum.
      if (desfecho.falhaCritica && personagem.efeitos && personagem.efeitos.anularFalhaCritica) {
        delete personagem.efeitos.anularFalhaCritica;
        desfecho.falhaCritica = false;
        desfecho.amuletoQuebrou = true;
      }
      Estado.salvarPersonagem(personagem);
      aoConcluir(desfecho);
    }
  });
}

/* ============================================================
   5. INTEGRAÇÃO COM GOOGLE SHEETS (backend gratuito)
   ============================================================
   Como o site é 100% estático (GitHub Pages), não existe um servidor
   de verdade para guardar dados. A solução gratuita é usar uma
   planilha do Google como "banco de dados", acessada através de um
   Google Apps Script publicado como "Web App".

   PASSO A PASSO para configurar (resumo — detalhes completos no README.md):
   1. Crie uma planilha no Google Sheets com abas "Acessos" e "Quests".
   2. Em Extensões > Apps Script, cole um script com uma função doPost(e)
      que recebe os dados em JSON e grava na aba correspondente.
   3. Publique como "Implantação" > "Web app", acesso "Qualquer pessoa".
   4. Copie a URL gerada e cole abaixo em GOOGLE_SHEETS_URL.
   ============================================================ */

// TODO (substitua pela URL do seu Google Apps Script depois de publicá-lo):
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzXp0ztp9cA-OLjJN7kcWSsjyyyUvtsbU7u648M_DzQVXwPWR_CVr0RnzkV8d9nlQdQ/exec';

/* ID da planilha "ElarionDatabase" (so para referencia/documentacao — quem
   acessa a planilha e o Apps Script publicado, nao o navegador do aluno). */
const PLANILHA_ID = '1mXuGu9zMVaZJsOGvKOw1v_MRV4YUUWAwV-14QX_zA6Y';

/** True quando o professor ja colou a URL do Apps Script acima. */
function sheetsConfigurado() {
  return Boolean(GOOGLE_SHEETS_URL) && !GOOGLE_SHEETS_URL.startsWith('COLE_AQUI');
}

/**
 * Envia um registro para a planilha (ex: log de acesso do aluno, ou uma
 * quest nova criada pelo professor). Funciona mesmo se a URL não estiver
 * configurada — nesse caso, só avisa no console e segue o jogo normalmente,
 * sem travar nada (o localStorage já garante que o jogo funciona offline).
 *
 * @param {string} tipo  - 'acesso' | 'quest' | 'feedback'
 * @param {object} dados - objeto com as informações a enviar
 */
function registrarNoGoogleSheets(tipo, dados) {
  if (!sheetsConfigurado()) {
    console.warn('[Elarion] Google Sheets não configurado ainda — registro apenas local.', tipo, dados);
    return Promise.resolve(false);
  }
  /* O Apps Script devolve Access-Control-Allow-Origin: * nas respostas do
     ContentService, então dá para LER o resultado — era isso que faltava:
     com mode:'no-cors' o site jurava ter gravado mesmo quando falhava.
     text/plain evita o preflight OPTIONS, que o Apps Script não trata bem.
     Se a leitura falhar, NÃO reenviamos (duplicaria a linha): devolvemos
     null, que significa "enviado, resultado desconhecido". Quem precisa de
     certeza usa Campanhas.publicar(), que confere lendo a planilha. */
  const corpo = JSON.stringify({ tipo, dados, data: new Date().toISOString() });

  return fetch(GOOGLE_SHEETS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    /* keepalive mantém o envio de pé mesmo se a página sair do ar no meio —
       é o caso do login, que registra o acesso e troca de tela em seguida.
       Sem isto o navegador cancelava o registro e o aluno não aparecia no
       elenco do professor. O limite do keepalive é 64 KB; uma campanha
       grande passa disso, e aí vai sem ele (ninguém navega ao salvar). */
    keepalive: corpo.length < 60000,
    body: corpo
  })
    .then(resposta => resposta.json())
    .then(json => (json && json.ok === false ? false : true))
    .catch(erro => {
      console.warn('[Elarion] Enviado, mas sem confirmação de leitura:', erro);
      return null;
    });
}

/**
 * Le dados da planilha (lista de alunos, quests publicadas pelo professor...).
 * O Apps Script responde a um GET com ?tipo=alunos / ?tipo=quests devolvendo JSON.
 * Se a URL nao estiver configurada ou a rede falhar, devolve lista vazia — a tela
 * que chamou decide o que mostrar no lugar.
 *
 * @param {string} tipo - 'alunos' | 'quests' | 'acessos'
 * @returns {Promise<Array>}
 */
function lerDoGoogleSheets(tipo, opcoes) {
  const estrito = Boolean(opcoes && opcoes.estrito);

  if (!sheetsConfigurado()) {
    console.warn('[Elarion] Google Sheets nao configurado — leitura ignorada.', tipo);
    if (estrito) return Promise.reject(new Error('planilha não configurada'));
    return Promise.resolve([]);
  }
  return fetch(GOOGLE_SHEETS_URL + '?tipo=' + encodeURIComponent(tipo))
    .then(resposta => {
      if (!resposta.ok) throw new Error('HTTP ' + resposta.status);
      return resposta.json();
    })
    .then(json => (Array.isArray(json) ? json : (json && json.dados) || []))
    .catch(erro => {
      console.error('[Elarion] Falha ao ler a planilha:', erro);
      /* No modo estrito a falha SOBE. Devolver [] escondia a queda da
         planilha atrás de "nenhuma campanha publicada". */
      if (estrito) throw erro;
      return [];
    });
}

/* ============================================================
   6. AVISO RÁPIDO (toast)
   ============================================================ */
function mostrarToast(mensagem) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = mensagem;
  document.body.appendChild(toast);
  // Pequeno delay para garantir que a transição CSS seja aplicada.
  setTimeout(() => toast.classList.add('visivel'), 20);
  setTimeout(() => {
    toast.classList.remove('visivel');
    setTimeout(() => toast.remove(), 400);
  }, 2600);
}


/* ============================================================
   7. SEGURANCA BASICA DE TEXTO
   Quests sao digitadas pelo professor e viram HTML na tela.
   Escapar o texto evita que uma tag colada por engano quebre
   (ou altere) a pagina.
   ============================================================ */
function escaparHTML(texto) {
  return String(texto === undefined || texto === null ? '' : texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ============================================================
   8. CONTAS DE DEMONSTRACAO (admin / admin)
   ============================================================
   O jogo nao tem servidor de autenticacao. Para apresentar o
   projeto (banca da Atividade Extensionista) existe uma conta
   fixa "admin / admin" que entra tanto como aluno quanto como
   mestre. Qualquer outro nome entra normalmente, sem senha,
   como antes.
   ============================================================ */
const CONTA_DEMO = { usuario: 'admin', senha: 'admin' };

/** Confere se o par usuario/senha digitado e a conta de demonstracao. */
function ehContaDemo(usuario, senha) {
  return String(usuario).trim().toLowerCase() === CONTA_DEMO.usuario &&
         String(senha) === CONTA_DEMO.senha;
}

/**
 * Personagem ja avancado, criado so para a conta admin: assim o avaliador
 * ve o Perfil, as Badges e a tela Final preenchidos sem precisar jogar tudo.
 */
function criarPersonagemDemo() {
  return {
    nome: 'Admin de Elarion',
    classeId: 'mago-logica',
    atributos: { razao: 16, harmonia: 14, natureza: 13, firmeza: 15 },
    xp: 260,
    ouro: 140,
    determinacao: 4,
    determinacaoMaxima: 6,
    inspiracao: 2,
    inventario: ['pocao-determinacao', 'tomo-sabedoria'],
    efeitos: {},
    feitos: [],
    missoesConcluidas: ['vale-1', 'vale-2', 'terras-1'],
    badges: ['badge-vale'],
    criadoEm: new Date().toISOString(),
    demo: true
  };
}

/* ============================================================
   9. BADGE FINAL — "Lenda de Elarion"
   Concedida quando o jogador fecha os 4 territorios.
   ============================================================ */
function concederBadgeLenda(personagem) {
  const lenda = BADGES.find(b => b.territorioId === null);
  if (!lenda || personagem.badges.includes(lenda.id)) return false;

  const fechouTudo = TERRITORIOS.every(territorio => {
    const quests = buscarQuestsDoTerritorio(territorio.id);
    return quests.length > 0 && quests.every(q => personagem.missoesConcluidas.includes(q.id));
  });

  if (fechouTudo) {
    personagem.badges.push(lenda.id);
    return true;
  }
  return false;
}


/* ============================================================
   10. CAMPANHA — a história escrita pelo professor
   ============================================================
   O professor monta, no Painel do Mestre, a história que dá sentido
   às missões: título, prólogo e um capítulo por território. Fica no
   localStorage (e vai para a planilha, se estiver configurada) e é
   lida pelo Códex e pela tela de missão. Se o professor não escrever
   nada, o jogo usa a lore padrão de Elarion.
   ============================================================ */
const Campanhas = {
  CHAVE_LISTA: 'elarion_campanhas',
  CHAVE_ATIVA: 'elarion_campanha_ativa',
  CHAVE_ANTIGA: 'elarion_campanha',   // formato de campanha única, antes desta versão

  /** Todas as campanhas salvas, como objeto { id: campanha }. */
  todas() {
    try {
      const bruto = localStorage.getItem(this.CHAVE_LISTA);
      const lista = bruto ? JSON.parse(bruto) : {};
      return (lista && typeof lista === 'object') ? lista : {};
    } catch (erro) {
      console.warn('[Elarion] Lista de campanhas inválida.', erro);
      return {};
    }
  },

  /** Em ordem de criação, pronto para desenhar um <select>. */
  lista() {
    const todas = this.todas();
    return Object.keys(todas)
      .map(id => todas[id])
      .sort((a, b) => (a.criadaEm || '').localeCompare(b.criadaEm || ''));
  },

  gravarTodas(todas) {
    localStorage.setItem(this.CHAVE_LISTA, JSON.stringify(todas));
  },

  get(id) {
    return this.todas()[id] || null;
  },

  /** Id da campanha em uso. Cria/migra uma se ainda não houver nenhuma. */
  idAtiva() {
    let id = localStorage.getItem(this.CHAVE_ATIVA);
    if (id && this.get(id)) return id;

    const lista = this.lista();
    if (lista.length) {
      this.definirAtiva(lista[0].id);
      return lista[0].id;
    }

    /* Só o professor cria campanha. O aluno que chegasse aqui ganhava uma
       "Campanha 1" inventada no próprio navegador — era por isso que ele via
       uma aventura que o professor nunca tinha criado. Agora ele fica sem
       campanha e a tela de login explica o que fazer. */
    const sessao = Estado.getSessao();
    if (sessao && sessao.papel === 'aluno') return '';

    return this.migrarOuCriar();
  },

  /** A campanha em uso pelo PROFESSOR (seletor do painel e da mesa). */
  ativa() {
    return this.get(this.idAtiva());
  },

  /**
   * A campanha de quem está jogando agora.
   *
   * Para o aluno, é a que ele escolheu no login — e não muda se o professor
   * trocar de campanha no painel. Para o professor ou para um visitante sem
   * sessão, é a campanha ativa.
   *
   * Essa separação é o que impede misturar turmas: dois alunos de campanhas
   * diferentes podem jogar no mesmo navegador sem um cair na aventura do outro.
   */
  doJogador() {
    const id = Estado.getCampanhaId();
    if (id) {
      const campanha = this.get(id);
      if (campanha) return campanha;
    }
    return this.ativa();
  },

  /** Id da campanha de quem está jogando. */
  idDoJogador() {
    return Estado.getCampanhaId() || this.idAtiva();
  },

  /** Campanhas que aceitam novos alunos, para o seletor do login. */
  paraLogin() {
    return this.lista().filter(c => c && c.id && !c.removida);
  },

  /**
   * Quantas campanhas a planilha tem publicadas agora.
   * Serve ao indicador de conexão do painel do mestre: é a única forma de
   * o professor ver, sem abrir a planilha, que o aluno vai achar a campanha.
   */
  conferirPlanilha() {
    /* Devolve a lista CRUA, com as removidas inclusive: quem chama precisa
       delas para apagar a cópia local. null significa "não respondeu", que
       é diferente de "respondeu vazio" — e a tela diz coisas diferentes. */
    return lerDoGoogleSheets('campanhas', { estrito: true })
      .then(lista => (Array.isArray(lista) ? lista : null))
      .catch(() => null);
  },

  /**
   * Traz as campanhas da planilha para este navegador.
   *
   * Sem isto, a campanha só existia no computador do professor: o aluno
   * abria o site em outra máquina e não achava nada. A planilha é o ponto
   * de encontro — o professor publica ao salvar, o aluno lê ao entrar.
   *
   * Quem está mais atualizado vence: uma edição local ainda não enviada
   * não é sobrescrita pela cópia antiga do servidor.
   *
   * @returns {Promise<Array>} as campanhas já mescladas, em ordem de criação
   */
  sincronizar() {
    return lerDoGoogleSheets('campanhas')
      .then(lista => { this.mesclarDoServidor(lista); return this.lista(); })
      .catch(() => this.lista());
  },

  /** Mescla uma lista vinda da planilha com o que já existe aqui. */
  mesclarDoServidor(lista) {
    if (!Array.isArray(lista) || !lista.length) return;

    const todas = this.todas();
    lista.forEach(remota => {
      if (!remota || !remota.id) return;
      const local = todas[remota.id];

      // Local mais novo que o servidor: mantém o local (edição em andamento).
      if (local && (local.atualizadaEm || '') > (remota.atualizadaEm || '')) return;

      /* Apagada no painel do professor: sai daqui também, em vez de
         reaparecer no seletor do aluno a cada sincronização. */
      if (remota.removida) { delete todas[remota.id]; return; }

      todas[remota.id] = Object.assign({}, local || {}, remota, {
        // O elenco local não vem da planilha; preserva o que já havia.
        jogadores: (local && local.jogadores) || [],
        criadaEm: (local && local.criadaEm) || remota.atualizadaEm || new Date().toISOString()
      });
    });

    this.gravarTodas(todas);
  },

  definirAtiva(id) {
    if (!this.get(id)) return false;
    localStorage.setItem(this.CHAVE_ATIVA, id);
    return true;
  },

  /**
   * Primeira execução desta versão: se existia uma campanha no formato
   * antigo (chave única), ela vira a campanha nº 1 em vez de se perder.
   */
  migrarOuCriar() {
    let base = { titulo: '', prologo: '', capitulos: {}, checkpoints: [] };
    try {
      const antiga = localStorage.getItem(this.CHAVE_ANTIGA);
      if (antiga) base = Object.assign(base, JSON.parse(antiga));
    } catch (erro) {
      console.warn('[Elarion] Campanha antiga ilegível — começando do zero.', erro);
    }

    /* Local apenas. Esta campanha nasce de um navegador vazio, não de um
       clique do professor — publicar aqui enchia a aba Campanha de
       "Campanha 1" a cada vez que o painel abria numa máquina nova. */
    const campanha = this.criar(base.titulo || 'Campanha 1', { base, publicar: false });
    localStorage.removeItem(this.CHAVE_ANTIGA);
    return campanha.id;
  },

  /**
   * Cria uma campanha nova e a deixa ativa.
   *
   * @param {string} nome
   * @param {object} opcoes
   *   turma       - código da turma (texto livre)
   *   base        - campos iniciais (usado na migração)
   *   importarDe  - id de outra campanha: copia o elenco de jogadores
   *   copiarTexto - true para copiar também título, prólogo, capítulos e checkpoints
   */
  criar(nome, opcoes = {}) {
    const todas = this.todas();
    const id = 'camp-' + Date.now();

    const campanha = Object.assign({
      titulo: '', prologo: '', capitulos: {}, checkpoints: [], jogadores: [],
      // Nível e faixa etária orientam o professor na escolha da aventura.
      // Valores usados: 'iniciante', 'intermediaria', 'avancada'.
      nivel: '', faixaEtaria: ''
    }, opcoes.base || {});

    campanha.id = id;
    campanha.nome = nome || 'Campanha sem nome';
    campanha.turma = opcoes.turma || '';
    campanha.criadaEm = new Date().toISOString();
    if (!Array.isArray(campanha.jogadores)) campanha.jogadores = [];

    const origem = opcoes.importarDe ? this.get(opcoes.importarDe) : null;
    if (origem) {
      // Importar elenco: os mesmos alunos, fichas intactas, história nova.
      campanha.jogadores = (origem.jogadores || []).map(j => Object.assign({}, j));
      if (opcoes.copiarTexto) {
        campanha.titulo = origem.titulo;
        campanha.prologo = origem.prologo;
        campanha.capitulos = Object.assign({}, origem.capitulos);
        campanha.checkpoints = (origem.checkpoints || [])
          .map(c => ({ titulo: c.titulo, nota: c.nota, concluido: false }));
      }
    }

    campanha.atualizadaEm = campanha.criadaEm;

    todas[id] = campanha;
    this.gravarTodas(todas);
    this.definirAtiva(id);
    /* Publica já na criação. Antes, a campanha só ia para a planilha quando o
       professor salvava a história — se ele criasse a campanha e fosse dar
       aula, o aluno não encontrava nada no seletor do login.
       A migração passa publicar:false: campanha que o professor não pediu
       não vai para a planilha (era a origem das "Campanha 1" fantasmas). */
    if (opcoes.publicar !== false) registrarNoGoogleSheets('campanha', campanha);
    return campanha;
  },

  /** Grava alterações de uma campanha (mantém id e data de criação). */
  salvar(campanha) {
    if (!campanha.id) campanha.id = this.idAtiva();

    const todas = this.todas();
    const anterior = todas[campanha.id] || {};

    campanha.nome = campanha.nome || anterior.nome || 'Campanha';
    campanha.nivel = campanha.nivel || anterior.nivel || '';
    campanha.faixaEtaria = campanha.faixaEtaria || anterior.faixaEtaria || '';
    campanha.criadaEm = anterior.criadaEm || new Date().toISOString();
    campanha.jogadores = campanha.jogadores || anterior.jogadores || [];
    campanha.atualizadaEm = new Date().toISOString();

    todas[campanha.id] = campanha;
    this.gravarTodas(todas);
    registrarNoGoogleSheets('campanha', campanha);
    return campanha;
  },

  /**
   * Publica a campanha na planilha e CONFERE lendo de volta.
   *
   * O POST sozinho não serve de prova: a resposta pode não chegar, e o
   * professor ficava sem saber se o aluno ia encontrar a campanha. Aqui
   * gravamos e perguntamos à planilha se o id realmente está lá.
   *
   * @returns {Promise<boolean>} true se a planilha confirmou
   */
  publicar(campanha) {
    if (!campanha || !campanha.id) return Promise.resolve(false);
    return registrarNoGoogleSheets('campanha', campanha)
      .then(() => lerDoGoogleSheets('campanhas'))
      .then(lista => Array.isArray(lista)
        && lista.some(c => c && c.id === campanha.id && !c.removida))
      .catch(() => false);
  },

  /**
   * Apaga a campanha aqui e avisa a planilha.
   *
   * Sem o aviso, a campanha voltava na próxima sincronização: a aba
   * Campanha é um histórico, e apagar só no navegador não apaga o
   * registro de lá.
   */
  remover(id) {
    const todas = this.todas();
    const campanha = todas[id];
    delete todas[id];
    this.gravarTodas(todas);

    if (campanha) {
      registrarNoGoogleSheets('campanha', Object.assign({}, campanha, {
        removida: true,
        atualizadaEm: new Date().toISOString()
      }));
    }

    if (localStorage.getItem(this.CHAVE_ATIVA) === id) {
      localStorage.removeItem(this.CHAVE_ATIVA);
      this.idAtiva(); // elege outra (ou cria uma nova, só local)
    }
  },

  /* ---------- Elenco ---------- */

  /**
   * Matrícula: chamada no login do aluno. A chave é a mesma usada para
   * guardar o personagem (nome|turma), e é ela que liga aluno e herói —
   * por isso o painel não duplica mais quem trocou o nome do personagem.
   */
  matricular(jogador, campanhaId) {
    const campanha = campanhaId ? this.get(campanhaId) : this.ativa();
    if (!campanha) return null;

    campanha.jogadores = campanha.jogadores || [];
    const existente = campanha.jogadores.find(j => j.chave === jogador.chave);

    if (existente) {
      existente.nome = jogador.nome;
      existente.turma = jogador.turma;
      existente.visto = new Date().toISOString();
    } else {
      campanha.jogadores.push(Object.assign({ visto: new Date().toISOString() }, jogador));
    }

    const todas = this.todas();
    todas[campanha.id] = campanha;
    this.gravarTodas(todas);
    return campanha;
  },

  /** Tira um aluno do elenco (a ficha dele continua salva no navegador). */
  removerJogador(campanhaId, chave) {
    const todas = this.todas();
    const campanha = todas[campanhaId];
    if (!campanha) return;

    campanha.jogadores = (campanha.jogadores || []).filter(j => j.chave !== chave);
    this.gravarTodas(todas);
  },

  /** Apaga a ficha do aluno NESTA campanha: ele recomeça na próxima entrada. */
  zerarFicha(chave, campanhaId) {
    const id = campanhaId || this.idAtiva();
    localStorage.removeItem(Estado.CHAVE_PERSONAGEM + ':' + id + ':' + chave);
    localStorage.removeItem(Estado.CHAVE_PERSONAGEM + ':' + chave); // formato antigo
  }
};

/* ------------------------------------------------------------
   Campanha — atalho para a campanha ATIVA.
   As telas do aluno (Códex, missão) continuam usando este nome.
   ------------------------------------------------------------ */
const Campanha = {
  /* As telas do aluno (Códex, missão) leem a campanha DELE; o painel do
     professor continua salvando na campanha ativa do seletor. */
  get() { return Campanhas.doJogador(); },
  salvar(campanha) { return Campanhas.salvar(campanha); },
  capitulo(territorioId) {
    const campanha = Campanhas.doJogador();
    return (campanha && campanha.capitulos && campanha.capitulos[territorioId]) || '';
  }
};

/* ============================================================
   11. RECURSOS DO HERÓI — Determinação, Inspiração, inventário
   ============================================================
   DETERMINAÇÃO é a "armadura" do Divinity: Original Sin 2. Ela absorve
   os erros antes que algo grave aconteça — errar não trava a missão,
   consome Determinação. Quando zera, o herói recua da cena.

   INSPIRAÇÃO é a mecânica de Baldur's Gate 3: pontos ganhos jogando de
   acordo com o personagem, gastos para re-rolar um dado. É o que torna
   a segunda chance uma DECISÃO e não um "tente de novo" infinito.
   ============================================================ */
const Recursos = {
  DETERMINACAO_MAXIMA: 6,

  /** Garante que um personagem antigo (salvo antes desta versão) tenha os campos novos. */
  normalizar(personagem) {
    if (!personagem) return personagem;
    if (typeof personagem.determinacao !== 'number') personagem.determinacao = this.DETERMINACAO_MAXIMA;
    if (typeof personagem.determinacaoMaxima !== 'number') personagem.determinacaoMaxima = this.DETERMINACAO_MAXIMA;
    if (typeof personagem.inspiracao !== 'number') personagem.inspiracao = 1;
    if (!Array.isArray(personagem.inventario)) personagem.inventario = [];
    if (!personagem.efeitos || typeof personagem.efeitos !== 'object') personagem.efeitos = {};
    if (!Array.isArray(personagem.feitos)) personagem.feitos = [];
    return personagem;
  },

  /** Tira pontos de Determinação. Devolve true se o herói foi a zero. */
  ferir(personagem, dano) {
    personagem.determinacao = Math.max(0, personagem.determinacao - dano);
    Estado.salvarPersonagem(personagem);
    return personagem.determinacao === 0;
  },

  /** Devolve pontos de Determinação, respeitando o máximo. */
  curar(personagem, quanto) {
    personagem.determinacao = Math.min(personagem.determinacaoMaxima, personagem.determinacao + quanto);
    Estado.salvarPersonagem(personagem);
  },

  /** Restaura tudo — usado quando o herói recua e volta ao mapa. */
  descansar(personagem) {
    personagem.determinacao = personagem.determinacaoMaxima;
    Estado.salvarPersonagem(personagem);
  },

  /** Concede Inspiração (máximo de 3 acumulados, como em BG3). */
  inspirar(personagem, motivo) {
    if (personagem.inspiracao >= 3) return false;
    personagem.inspiracao++;
    Estado.salvarPersonagem(personagem);
    if (motivo) mostrarToast('✦ Inspiração: ' + motivo);
    return true;
  },

  /** Tem Inspiração sobrando para repetir uma rolagem? */
  podeReRolar(personagem) {
    return personagem.inspiracao > 0;
  },

  /** Gasta 1 Inspiração. Devolve false quando não havia nenhuma. */
  gastarReRolagem(personagem) {
    if (personagem.inspiracao <= 0) {
      mostrarToast('Sem Inspiração para rolar de novo.');
      return false;
    }
    personagem.inspiracao--;
    Estado.salvarPersonagem(personagem);
    return true;
  },

  /* ---------- Inventário e loja ---------- */

  /** Compra um item se houver ouro. Devolve true no sucesso. */
  comprar(personagem, itemId) {
    const item = buscarItem(itemId);
    if (!item) return false;
    if (personagem.ouro < item.preco) {
      mostrarToast('Ouro insuficiente para ' + item.nome + '.');
      return false;
    }
    personagem.ouro -= item.preco;
    personagem.inventario.push(item.id);
    Estado.salvarPersonagem(personagem);
    mostrarToast(item.icone + ' ' + item.nome + ' comprado.');
    return true;
  },

  /**
   * Usa um item do inventário. Efeitos instantâneos agem na hora; os
   * demais ficam guardados em personagem.efeitos e são consumidos pela
   * próxima rolagem ou pelo próximo desafio.
   */
  usarItem(personagem, itemId) {
    const indice = personagem.inventario.indexOf(itemId);
    if (indice === -1) return false;

    const item = buscarItem(itemId);
    if (!item) return false;

    switch (item.efeito) {
      case 'determinacao':
        if (personagem.determinacao >= personagem.determinacaoMaxima) {
          mostrarToast('Determinação já está cheia.');
          return false;
        }
        this.curar(personagem, item.valor);
        break;
      case 'inspiracao':
        personagem.inspiracao = Math.min(3, personagem.inspiracao + item.valor);
        break;
      case 'bonus-rolagem':
        personagem.efeitos.bonusRolagem = item.valor;
        break;
      case 'eliminar-alternativa':
        personagem.efeitos.eliminarAlternativa = item.valor;
        break;
      case 'anular-falha-critica':
        personagem.efeitos.anularFalhaCritica = true;
        break;
      case 'vantagem':
        personagem.efeitos.vantagem = true;
        break;
      default:
        mostrarToast('Este item não faz nada ainda.');
        return false;
    }

    personagem.inventario.splice(indice, 1); // consumível
    Estado.salvarPersonagem(personagem);
    mostrarToast(item.icone + ' ' + item.nome + ' usado.');
    return true;
  },

  /** Inventário agrupado por item, para desenhar a mochila. */
  mochila(personagem) {
    const contagem = {};
    personagem.inventario.forEach(id => { contagem[id] = (contagem[id] || 0) + 1; });
    return Object.keys(contagem)
      .map(id => ({ item: buscarItem(id), quantidade: contagem[id] }))
      .filter(linha => linha.item);
  }
};

/* ============================================================
   12. FAIXAS DE RESULTADO
   Um teste tem quatro desfechos, e cada um muda a cena — não só o
   tamanho da recompensa. É a diferença entre "errou, tente de novo"
   e "errou, e agora a história é outra".
   ============================================================ */
function faixaDoResultado(desfecho) {
  if (desfecho.critico) return 'critico';
  if (desfecho.falhaCritica) return 'falha-critica';
  return desfecho.sucesso ? 'sucesso' : 'falha';
}

/** Multiplicador de XP/ouro por faixa. */
const MULTIPLICADOR_FAIXA = {
  'critico': 1.5,
  'sucesso': 1,
  'falha': 0.5,
  'falha-critica': 0.25
};

/** Rótulo curto de cada faixa, para o resumo da missão. */
const ROTULO_FAIXA = {
  'critico': 'Sucesso Crítico',
  'sucesso': 'Sucesso',
  'falha': 'Falha',
  'falha-critica': 'Falha Crítica'
};

/* ============================================================
   13. PROGRESSO NA PLANILHA
   O painel do mestre precisa ver o avanço de quem joga em outro
   computador. A cada encontro resolvido, mandamos uma linha para
   a aba "Progresso" da planilha.
   ============================================================ */
function registrarProgresso(personagem) {
  const sessao = Estado.getSessao() || {};
  const nivel = calcularNivel(personagem.xp).nivel;
  const campanha = Campanhas.doJogador();

  registrarNoGoogleSheets('progresso', {
    nome: sessao.nome || personagem.nome,
    turma: sessao.turma || '',
    // Sem isto, a Mesa ao Vivo não tem como saber de qual aventura veio
    // cada linha da planilha, e acaba misturando turmas.
    campanhaId: sessao.campanhaId || '',
    campanha: campanha ? campanha.nome : '',
    nivel,
    xp: personagem.xp,
    ouro: personagem.ouro,
    determinacao: personagem.determinacao,
    inspiracao: personagem.inspiracao,
    missoesConcluidas: personagem.missoesConcluidas,
    badges: personagem.badges
  });
}

/* ============================================================
   14. HERÓIS NESTE NAVEGADOR
   A Mesa ao Vivo roda na máquina do professor. Quando a turma joga
   no mesmo computador (laboratório), todos os heróis estão aqui no
   localStorage — esta função os reúne para o painel de status.
   ============================================================ */
/**
 * Heróis salvos neste navegador para uma campanha.
 *
 * A chave tem o formato  elarion_personagem:<campanha>:<jogador>, então dá
 * para separar quem é de qual aventura sem abrir ficha por ficha.
 */
function heroisLocais(campanhaId) {
  const id = campanhaId || Campanhas.idAtiva();
  const prefixo = Estado.CHAVE_PERSONAGEM + ':' + id + ':';
  const herois = [];

  for (let i = 0; i < localStorage.length; i++) {
    const chave = localStorage.key(i);
    if (!chave || chave.indexOf(prefixo) !== 0) continue;
    try {
      const personagem = Recursos.normalizar(JSON.parse(localStorage.getItem(chave)));
      herois.push({ chave: chave.slice(prefixo.length), personagem });
    } catch (erro) {
      console.warn('[Elarion] Herói ilegível no localStorage:', chave);
    }
  }
  return herois;
}

/**
 * Elenco de uma campanha, já com a ficha de cada um.
 *
 * Cada linha traz o JOGADOR (o aluno, de nome+turma) e o HERÓI que ele criou
 * NESTA campanha. A chave do jogador é o que une as duas pontas — por isso o
 * painel não duplica mais quem trocou o nome do personagem.
 *
 * Quem está matriculado mas ainda não criou herói aparece como 'semFicha',
 * para o professor ver que o aluno entrou e parou ali.
 */
function elencoDaCampanha(campanhaId) {
  const id = campanhaId || Campanhas.idAtiva();
  const campanha = Campanhas.get(id);
  if (!campanha) return [];

  const locais = {};
  heroisLocais(id).forEach(h => { locais[h.chave] = h.personagem; });

  return (campanha.jogadores || []).map(jogador => ({
    chave: jogador.chave,
    jogador,
    personagem: locais[jogador.chave] || null,
    semFicha: !locais[jogador.chave]
  }));
}

/* ============================================================
   15. FEEDBACK — estrelas e comentário
   ============================================================
   Alunos e professores avaliam o jogo de 1 a 5 estrelas, com um
   comentário opcional. Os que dão 4 ou mais aparecem na tela
   inicial: é a vitrine do projeto para quem chega.

   Fica no localStorage e, se a planilha estiver configurada, vai
   também para a aba Feedback — que é a evidência de avaliação
   pedida na entrega da Atividade Extensionista.
   ============================================================ */
const Feedback = {
  CHAVE: 'elarion_feedbacks',
  NOTA_DESTAQUE: 4,

  /** Todos os feedbacks guardados neste navegador. */
  todos() {
    try {
      const bruto = localStorage.getItem(this.CHAVE);
      const lista = bruto ? JSON.parse(bruto) : [];
      return Array.isArray(lista) ? lista : [];
    } catch (erro) {
      console.warn('[Elarion] Feedbacks ilegíveis no localStorage.', erro);
      return [];
    }
  },

  /**
   * Grava uma avaliação. Cada pessoa tem uma só: enviar de novo
   * substitui a anterior, em vez de encher a lista de repetições.
   */
  salvar({ nota, texto, papel, escola }) {
    const sessao = Estado.getSessao() || {};
    const registro = {
      nota: Number(nota),
      texto: String(texto || '').trim(),
      // Escola é o único identificador que vai para a vitrine pública.
      escola: String(escola || '').trim(),
      papel: papel || sessao.papel || 'aluno',
      // Nome e turma ficam só no registro do professor (planilha e navegador):
      // a tela inicial nunca os mostra.
      nome: sessao.nome || 'Anônimo',
      turma: sessao.turma || '',
      data: new Date().toISOString()
    };

    const lista = this.todos().filter(f => !(f.nome === registro.nome && f.papel === registro.papel));
    lista.push(registro);
    localStorage.setItem(this.CHAVE, JSON.stringify(lista));

    registrarNoGoogleSheets('feedback', registro);
    return registro;
  },

  /**
   * Apaga as avaliações guardadas NESTE navegador.
   *
   * A vitrine da tela inicial soma duas fontes: o que está no
   * localStorage e o que a planilha devolve. Limpar a planilha não
   * apaga a cópia local — por isso um depoimento de teste continua
   * aparecendo depois de o professor esvaziar a aba Feedback.
   * Este método resolve o outro lado.
   */
  limparLocais() {
    const quantos = this.todos().length;
    localStorage.removeItem(this.CHAVE);
    return quantos;
  },

  /** O que esta pessoa já respondeu (para o formulário abrir preenchido). */
  meu(papel) {
    const sessao = Estado.getSessao() || {};
    return this.todos().find(f => f.nome === sessao.nome && f.papel === (papel || sessao.papel)) || null;
  },

  /** Só os de 4 ou 5 estrelas, do mais recente para o mais antigo. */
  destaques() {
    return this.todos()
      .filter(f => f.nota >= this.NOTA_DESTAQUE)
      .sort((a, b) => (b.data || '').localeCompare(a.data || ''));
  },

  /** Média geral e total, para o resumo da tela inicial. */
  resumo() {
    const lista = this.todos();
    if (!lista.length) return { media: 0, total: 0 };
    const soma = lista.reduce((t, f) => t + (Number(f.nota) || 0), 0);
    return { media: soma / lista.length, total: lista.length };
  },

  /* ---------- Interface ---------- */

  /**
   * Monta o formulário de avaliação dentro de um elemento.
   *
   * @param {string} seletor - onde desenhar
   * @param {string} papel   - 'aluno' | 'mestre'
   */
  montarFormulario(seletor, papel) {
    const alvo = document.querySelector(seletor);
    if (!alvo) return;

    const jaRespondeu = this.meu(papel);
    const notaInicial = jaRespondeu ? jaRespondeu.nota : 0;

    alvo.innerHTML = `
      <div class="card feedback-caixa">
        <p class="rotulo-cena">Sua opinião</p>
        <h2 style="font-size:1.05rem; margin-bottom:0.3rem;">O que achou de Elarion?</h2>
        <p style="font-size:0.84rem; color:var(--text-muted); margin-bottom:0.8rem;">
          Avaliações de 4 ou 5 estrelas aparecem na tela inicial do jogo — sempre
          <strong>anônimas</strong>: só as estrelas e o comentário.
        </p>

        <div class="estrelas" id="estrelas-feedback" role="radiogroup" aria-label="Nota de 1 a 5">
          ${[1, 2, 3, 4, 5].map(n => `
            <button type="button" class="estrela ${n <= notaInicial ? 'cheia' : ''}"
                    data-nota="${n}" aria-label="${n} estrela${n > 1 ? 's' : ''}">★</button>`).join('')}
          <span class="estrelas-rotulo" id="rotulo-nota"></span>
        </div>

        <div class="form-group" style="margin-top:0.8rem;">
          <label for="campo-feedback">Comentário (opcional)</label>
          <textarea id="campo-feedback" rows="3"
            placeholder="O que funcionou, o que faltou, o que você mudaria...">${escaparHTML(jaRespondeu ? jaRespondeu.texto : '')}</textarea>
        </div>

        <div class="form-group">
          <label for="campo-escola">Escola ou instituição (opcional)</label>
          <input type="text" id="campo-escola" placeholder="Ex: E.E. Santos Dumont"
                 value="${escaparHTML(jaRespondeu ? (jaRespondeu.escola || '') : '')}">
        </div>

        <button type="button" class="btn btn-primary btn-block" id="btn-enviar-feedback">
          ${jaRespondeu ? 'Atualizar avaliação' : 'Enviar avaliação'}
        </button>
        <p class="feedback-aviso" id="aviso-feedback">${jaRespondeu ? 'Você já avaliou — pode mudar quando quiser.' : ''}</p>
      </div>`;

    let nota = notaInicial;
    const rotulos = ['', 'Ruim', 'Fraco', 'Razoável', 'Bom', 'Excelente'];
    const rotuloEl = alvo.querySelector('#rotulo-nota');
    const estrelas = Array.from(alvo.querySelectorAll('.estrela'));

    function pintar(ate) {
      estrelas.forEach(e => e.classList.toggle('cheia', Number(e.dataset.nota) <= ate));
      rotuloEl.textContent = rotulos[ate] || '';
    }
    pintar(nota);

    estrelas.forEach(botao => {
      botao.addEventListener('mouseenter', () => pintar(Number(botao.dataset.nota)));
      botao.addEventListener('mouseleave', () => pintar(nota));
      botao.addEventListener('click', () => { nota = Number(botao.dataset.nota); pintar(nota); });
    });

    alvo.querySelector('#btn-enviar-feedback').addEventListener('click', () => {
      if (!nota) {
        mostrarToast('Escolha de 1 a 5 estrelas.');
        return;
      }
      this.salvar({
        nota,
        texto: alvo.querySelector('#campo-feedback').value,
        escola: alvo.querySelector('#campo-escola').value,
        papel
      });
      alvo.querySelector('#aviso-feedback').textContent =
        nota >= this.NOTA_DESTAQUE
          ? 'Obrigado — sua avaliação vai aparecer na tela inicial.'
          : 'Obrigado. Sua avaliação foi registrada.';
      alvo.querySelector('#btn-enviar-feedback').textContent = 'Atualizar avaliação';
      mostrarToast('Avaliação registrada.');
    });
  },

  /** Desenha as estrelas de uma nota, para exibição (não clicável). */
  estrelasEmTexto(nota) {
    return '★'.repeat(nota) + '☆'.repeat(Math.max(0, 5 - nota));
  }
};

/* ============================================================
   16. NÍVEL DA CAMPANHA
   Serve para o professor escolher a aventura certa para a turma.
   ============================================================ */
const NIVEIS_CAMPANHA = {
  'iniciante':     { rotulo: 'Iniciante',     faixa: '10 a 12 anos' },
  'intermediaria': { rotulo: 'Intermediária', faixa: '12 a 15 anos' },
  'avancada':      { rotulo: 'Avançada',      faixa: '15 a 17 anos' }
};

/** Texto curto do nível, para mostrar ao lado do nome da campanha. */
function rotuloDoNivel(campanha) {
  if (!campanha || !campanha.nivel) return '';
  const nivel = NIVEIS_CAMPANHA[campanha.nivel];
  if (!nivel) return '';
  return nivel.rotulo + ' · ' + (campanha.faixaEtaria || nivel.faixa);
}