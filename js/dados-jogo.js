/* ==========================================================================
   CRÔNICAS DE ELARION — dados-jogo.js
   ==========================================================================
   Este arquivo é o "banco de dados" do jogo: classes, territórios, quests
   (missões/perguntas), badges e eventos aleatórios do Mestre.

   É o arquivo mais fácil de editar para ADICIONAR CONTEÚDO NOVO: um
   professor de outra disciplina só precisa copiar o formato de uma quest
   e trocar a pergunta — não precisa mexer em HTML, CSS ou no restante do
   JavaScript.
   ========================================================================== */

/* ============================================================
   CLASSES DE PERSONAGEM
   Cada classe tem um atributo principal (usado nos testes de dado)
   e uma habilidade especial (apenas narrativa/visual neste protótipo —
   pode virar mecânica real em versões futuras).
   ============================================================ */
const CLASSES = [
  {
    id: 'mago-logica',
    nome: 'Mago da Lógica',
    icone: '🧙‍♂️',
    atributoPrincipal: 'razao',
    habilidade: 'Visão Arcana',
    descricaoHabilidade: 'Pode pedir 1 dica por missão.'
  },
  {
    id: 'guardiao-uniao',
    nome: 'Guardião da União',
    icone: '🛡️',
    atributoPrincipal: 'harmonia',
    habilidade: 'Aliança',
    descricaoHabilidade: 'Fortalece o trabalho em equipe da turma.'
  },
  {
    id: 'druida-jardim',
    nome: 'Druida da Cidade-Jardim',
    icone: '🌿',
    atributoPrincipal: 'natureza',
    habilidade: 'Brotar',
    descricaoHabilidade: 'Ganha um pouco mais de XP a cada acerto seguido.'
  },
  {
    id: 'arauto-justica',
    nome: 'Arauto da Justiça',
    icone: '⚖️',
    atributoPrincipal: 'firmeza',
    habilidade: 'Julgamento',
    descricaoHabilidade: 'Tem vantagem (sorte extra) em desafios do Salão da Justiça.'
  }
];

/* ============================================================
   ATRIBUTOS
   Cada atributo rege um grupo de disciplinas — isso é o que conecta
   o sistema de dados (d20 + modificador) ao conteúdo pedagógico.
   ============================================================ */
const ATRIBUTOS = {
  razao:    { nome: 'Razão',    rege: 'Lógica e Matemática' },
  harmonia: { nome: 'Harmonia', rege: 'Português, Artes e trabalho em grupo' },
  natureza: { nome: 'Natureza', rege: 'Ciências' },
  firmeza:  { nome: 'Firmeza',  rege: 'História e Justiça/Cidadania' }
};

/* ============================================================
   TERRITÓRIOS DO MAPA
   Cada território liga a um ODS da ONU e a um atributo/disciplina.
   ============================================================ */
const TERRITORIOS = [
  {
    id: 'vale-do-saber',
    nome: 'Vale do Saber',
    tema: 'Lógica e Matemática',
    ods: 'ODS 4 — Educação de qualidade',
    atributo: 'razao',
    icone: '📘',
    cor: '#C9A227'
  },
  {
    id: 'terras-unidas',
    nome: 'Terras Unidas',
    tema: 'Igualdade e colaboração',
    ods: 'ODS 10 — Redução das desigualdades',
    atributo: 'harmonia',
    icone: '🤝',
    cor: '#3A7A8C'
  },
  {
    id: 'cidade-jardim',
    nome: 'Cidade-Jardim',
    tema: 'Sustentabilidade',
    ods: 'ODS 11 — Cidades e comunidades sustentáveis',
    atributo: 'natureza',
    icone: '🌸',
    cor: '#2E7D4F'
  },
  {
    id: 'salao-da-justica',
    nome: 'Salão da Justiça',
    tema: 'Justiça e cidadania',
    ods: 'ODS 16 — Paz, justiça e instituições eficazes',
    atributo: 'firmeza',
    icone: '⚖️',
    cor: '#A33B3B'
  }
];
/* ============================================================
   QUESTS — agora são ENCONTROS, não perguntas soltas
   ============================================================
   Cada encontro tem três camadas, na ordem em que o aluno vive:

   1. CENA      -> quem está na frente dele (npc ou inimigo) e o que diz
   2. ABORDAGEM -> como ele decide agir. Cada abordagem usa um atributo
                   diferente e tem a sua própria dificuldade (cd). Não
                   existe abordagem errada: existem caminhos com riscos
                   diferentes, e a classe do personagem favorece um deles.
   3. DESAFIO   -> a pergunta de conteúdo, que resolve a cena. O
                   resultado do dado (rolado ANTES) muda o que acontece
                   em volta: um crítico pode eliminar uma alternativa,
                   uma falha deixa o inimigo agir primeiro.

   Campos de cada quest:
     id, territorioId, titulo
     npc        -> { nome, icone, fala }      (opcional)
     inimigo    -> { nome, icone, fala, golpe, dano }  (opcional)
     narrativa  -> a cena, em texto corrido
     abordagens -> lista de { id, texto, atributo, cd, sucesso, falha }
                   'sucesso'/'falha' são a narrativa daquele caminho
     pergunta, alternativas, respostaCorreta
     xp, ouro   -> recompensa base (modificada pela faixa do dado)
   ============================================================ */
const QUESTS = [
  /* ---------- Vale do Saber ---------- */
  {
    id: 'vale-1',
    territorioId: 'vale-do-saber',
    titulo: 'Os Três Baús de Vareth',
    npc: {
      nome: 'Vareth, o Guarda-Chaves',
      icone: '🗝️',
      fala: 'Três baús, três etiquetas, e um engraçado trocou todas. Nenhuma está certa — isso eu garanto. Abra um só e me diga o que há nos outros dois.'
    },
    narrativa: 'O velho não pisca enquanto fala. Atrás dele, três baús de ferro suam orvalho na penumbra do arquivo. A etiqueta do primeiro diz OURO, a do segundo PEDRAS, a do terceiro MISTO — e todas mentem.',
    abordagens: [
      {
        id: 'razao', texto: 'Deduzir pela lógica: se nenhuma etiqueta está certa, uma delas entrega tudo.',
        atributo: 'razao', cd: 12,
        sucesso: 'Você percorre as três etiquetas com o dedo e o raciocínio fecha sozinho. Vareth ergue uma sobrancelha: ele não esperava tão rápido.',
        falha: 'Você começa pela etiqueta errada e se enrola. Vareth cruza os braços e espera, como quem já viu isso muitas vezes.'
      },
      {
        id: 'firmeza', texto: 'Pressionar Vareth: fazê-lo repetir a regra até escapar uma pista.',
        atributo: 'firmeza', cd: 14,
        sucesso: 'Vareth repete a regra uma vez a mais do que devia — e nessa repetição você ouve onde está a trava do enigma.',
        falha: 'Vareth cala. "A regra é a regra, aprendiz. Ela não muda de forma só porque você insistiu."'
      },
      {
        id: 'harmonia', texto: 'Pedir ajuda aos outros aprendizes do arquivo antes de decidir.',
        atributo: 'harmonia', cd: 10,
        sucesso: 'Três vozes discordam, uma concorda, e no meio da confusão alguém diz a frase que organiza tudo.',
        falha: 'Todo mundo tem certeza de coisas diferentes. Você volta para os baús mais confuso do que saiu.'
      }
    ],
    pergunta: 'Abrindo apenas um baú, qual escolha garante descobrir o conteúdo dos três?',
    alternativas: [
      { id: 'a', texto: 'O baú etiquetado MISTO' },
      { id: 'b', texto: 'Qualquer um, ao acaso' },
      { id: 'c', texto: 'Não é possível descobrir' },
      { id: 'd', texto: 'É preciso abrir os três' }
    ],
    respostaCorreta: 'a', xp: 40, ouro: 15
  },
  {
    id: 'vale-2',
    territorioId: 'vale-do-saber',
    titulo: 'A Trilha que Dobra',
    inimigo: {
      nome: 'Devorador de Passos',
      icone: '🕷️',
      fala: 'Cada pedra que você pisa errado, eu como. E você tem poucos pés.',
      golpe: 'A criatura engole a pedra sob o seu pé e o chão some por um instante.',
      dano: 2
    },
    narrativa: 'A trilha encantada tem placas numeradas: 2, 4, 8, 16. Entre uma e outra, algo com pernas demais se move sob as pedras, esperando o passo errado.',
    abordagens: [
      {
        id: 'razao', texto: 'Ler a sequência antes de pisar e calcular a próxima pedra.',
        atributo: 'razao', cd: 10,
        sucesso: 'O padrão salta aos olhos antes mesmo do segundo número. Você já sabe onde pisar.',
        falha: 'Os números embaralham na cabeça. Você pisa no escuro e a criatura percebe.'
      },
      {
        id: 'natureza', texto: 'Observar por onde a criatura NÃO passa — ela evita as pedras firmes.',
        atributo: 'natureza', cd: 13,
        sucesso: 'Há musgo intacto em certas pedras: ali a coisa nunca passou. É o seu caminho.',
        falha: 'O musgo está em tudo. Você perde tempo olhando o chão enquanto algo rodeia você.'
      },
      {
        id: 'firmeza', texto: 'Atravessar rápido, sem hesitar, e confiar no instinto.',
        atributo: 'firmeza', cd: 15,
        sucesso: 'Você corre antes que o medo alcance. A criatura erra o bote por meio passo.',
        falha: 'Coragem sem cálculo é só pressa. Você escorrega na terceira pedra.'
      }
    ],
    pergunta: 'Qual é o próximo número da sequência 2, 4, 8, 16?',
    alternativas: [
      { id: 'a', texto: '18' }, { id: 'b', texto: '24' }, { id: 'c', texto: '32' }, { id: 'd', texto: '20' }
    ],
    respostaCorreta: 'c', xp: 35, ouro: 10
  },

  /* ---------- Terras Unidas ---------- */
  {
    id: 'terras-1',
    territorioId: 'terras-unidas',
    titulo: 'A Divisão que Racha o Vale',
    npc: {
      nome: 'Mestra Ilda, dos Celeiros',
      icone: '🌾',
      fala: 'Cento e vinte sacas, três vilarejos, e todos juram que merecem mais. Divida você — e seja rápido, porque eles trouxeram foices.'
    },
    narrativa: 'Os três vilarejos têm 30, 50 e 40 moradores. O grão veio num carro só, e está parado na praça com meia dúzia de homens em volta, cada um com uma conta na cabeça.',
    abordagens: [
      {
        id: 'razao', texto: 'Calcular a proporção na frente de todos, em voz alta.',
        atributo: 'razao', cd: 13,
        sucesso: 'Você fala os números devagar, e a praça escuta. Contra uma conta feita à vista, é difícil gritar.',
        falha: 'Você erra uma divisão no meio e alguém ri. A partir daí, ninguém mais ouve o resto.'
      },
      {
        id: 'harmonia', texto: 'Juntar um representante de cada vilarejo e decidir com eles.',
        atributo: 'harmonia', cd: 11,
        sucesso: 'Três pessoas sentam no mesmo degrau. Não viram amigas, mas param de gritar — e isso basta.',
        falha: 'Os três chegam, se olham, e lembram de uma briga de vinte anos atrás. Agora são três discussões.'
      },
      {
        id: 'firmeza', texto: 'Impor a divisão pela autoridade do Salão e assumir a bronca.',
        atributo: 'firmeza', cd: 15,
        sucesso: 'Você decide, anuncia, e segura o olhar de quem reclama. Resmungam — mas carregam as sacas.',
        falha: 'Autoridade sem explicação vira teimosia. Um deles cospe no chão e vai embora de mãos vazias.'
      }
    ],
    pergunta: 'Dividindo 120 sacas proporcionalmente, quantas o vilarejo de 50 moradores recebe?',
    alternativas: [
      { id: 'a', texto: '30' }, { id: 'b', texto: '40' }, { id: 'c', texto: '50' }, { id: 'd', texto: '60' }
    ],
    respostaCorreta: 'c', xp: 45, ouro: 15
  },
  {
    id: 'terras-2',
    territorioId: 'terras-unidas',
    titulo: 'A Mesa Comum',
    npc: {
      nome: 'Brun, o Taverneiro',
      icone: '🍺',
      fala: 'Vinte e quatro pessoas, duas famílias que se odeiam há gerações, e uma festa marcada para hoje. Monte os grupos de trabalho antes que eles montem as trincheiras.'
    },
    narrativa: 'A taverna cheira a pão e a rancor antigo. Vinte e quatro pessoas, e cada grupo de trabalho precisa de exatamente seis para dar conta das tarefas.',
    abordagens: [
      {
        id: 'harmonia', texto: 'Misturar as duas famílias dentro de cada grupo, de propósito.',
        atributo: 'harmonia', cd: 12,
        sucesso: 'Dá trabalho, mas funciona: quem precisa passar a farinha para o outro acaba falando com ele.',
        falha: 'Eles obedecem e se calam. O silêncio na cozinha é pior do que a briga.'
      },
      {
        id: 'razao', texto: 'Dividir pela conta pura e deixar o resto se resolver.',
        atributo: 'razao', cd: 10,
        sucesso: 'A conta fecha, os grupos se formam, e ninguém tem argumento contra aritmética.',
        falha: 'Os números fecham, mas você deixa as duas famílias separadas — e agora são dois times, não seis grupos.'
      }
    ],
    pergunta: 'Se cada grupo precisa de 6 pessoas, quantos grupos saem de 24?',
    alternativas: [
      { id: 'a', texto: '3' }, { id: 'b', texto: '4' }, { id: 'c', texto: '5' }, { id: 'd', texto: '6' }
    ],
    respostaCorreta: 'b', xp: 35, ouro: 10
  },

  /* ---------- Cidade-Jardim ---------- */
  {
    id: 'jardim-1',
    territorioId: 'cidade-jardim',
    titulo: 'A Praça que Secou',
    inimigo: {
      nome: 'Raiz-Morta',
      icone: '🥀',
      fala: 'Plante. Plante como sempre plantaram: tudo junto, tudo agora. Eu como o que vem depois.',
      golpe: 'As raízes mortas se enroscam nos seus pés e puxam para baixo.',
      dano: 2
    },
    narrativa: 'Duzentos e quarenta metros de praça rachada. As mudas precisam entrar a cada vinte metros, das duas pontas até o fim — e algo sob a terra conta cada muda que você erra.',
    abordagens: [
      {
        id: 'razao', texto: 'Medir e marcar os pontos antes de abrir o primeiro buraco.',
        atributo: 'razao', cd: 14,
        sucesso: 'Você marca a praça inteira com giz antes de tocar a terra. Nada fica ao acaso.',
        falha: 'A conta parece simples demais e você confia nela cedo demais. Falta uma muda — ou sobra.'
      },
      {
        id: 'natureza', texto: 'Ler o terreno: onde a terra ainda respira, a muda pega.',
        atributo: 'natureza', cd: 12,
        sucesso: 'Você ajoelha, aperta a terra na mão e sabe. A praça te diz onde quer ser plantada.',
        falha: 'A terra está morta demais para falar. Você planta no escuro.'
      },
      {
        id: 'harmonia', texto: 'Chamar os moradores para plantar junto, cada um num trecho.',
        atributo: 'harmonia', cd: 11,
        sucesso: 'Dezenas de mãos abrem buracos ao mesmo tempo. A Raiz-Morta não dá conta de tanta gente.',
        falha: 'Vêm poucos, e desconfiados. Metade desiste antes do meio-dia.'
      }
    ],
    pergunta: 'Numa praça de 240 metros, com árvores a cada 20 metros e incluindo as duas pontas, quantas árvores são plantadas?',
    alternativas: [
      { id: 'a', texto: '11' }, { id: 'b', texto: '12' }, { id: 'c', texto: '13' }, { id: 'd', texto: '14' }
    ],
    respostaCorreta: 'c', xp: 45, ouro: 15
  },
  {
    id: 'jardim-2',
    territorioId: 'cidade-jardim',
    titulo: 'A Horta Comunitária',
    npc: {
      nome: 'Dona Herme, a Semeadora',
      icone: '🌱',
      fala: 'Terreno pequeno, muita boca. Me diga como se planta pensando em quem vem no ano que vem, e não só em quem tem fome hoje.'
    },
    narrativa: 'O terreno nos fundos é menor do que a necessidade do bairro. Dona Herme já viu três hortas morrerem ali — sempre pelo mesmo motivo.',
    abordagens: [
      {
        id: 'natureza', texto: 'Planejar canteiros por ciclo de cultivo e rotação.',
        atributo: 'natureza', cd: 12,
        sucesso: 'Você desenha a rotação no chão com um graveto. Dona Herme reconhece o desenho — é o que ela tentou explicar por anos.',
        falha: 'Você propõe uma rotação bonita no papel e impossível naquele solo.'
      },
      {
        id: 'harmonia', texto: 'Perguntar ao bairro o que cada família consegue cuidar.',
        atributo: 'harmonia', cd: 10,
        sucesso: 'Sai uma lista torta e honesta do que as pessoas realmente conseguem manter. É com isso que se planta.',
        falha: 'Cada um pede uma coisa diferente e ninguém se compromete com nada.'
      }
    ],
    pergunta: 'Qual atitude representa melhor o uso sustentável de um espaço pequeno?',
    alternativas: [
      { id: 'a', texto: 'Plantar tudo espalhado, sem planejamento' },
      { id: 'b', texto: 'Organizar canteiros compactos e bem distribuídos' },
      { id: 'c', texto: 'Usar todo o terreno para uma única espécie' },
      { id: 'd', texto: 'Não plantar, para evitar o risco de errar' }
    ],
    respostaCorreta: 'b', xp: 35, ouro: 10
  },

  /* ---------- Salão da Justiça ---------- */
  {
    id: 'justica-1',
    territorioId: 'salao-da-justica',
    titulo: 'O Julgamento dos Três',
    inimigo: {
      nome: 'O Terceiro Suspeito',
      icone: '🎭',
      fala: 'Um sempre mente. Um sempre diz a verdade. E eu? Eu decido na hora. Boa sorte.',
      golpe: 'A resposta dele muda no meio da frase e leva a sua certeza junto.',
      dano: 3
    },
    narrativa: 'Três figuras encapuzadas diante do Salão. Um nunca mente, outro nunca diz a verdade, e o terceiro escolhe conforme o humor. Você tem duas perguntas.',
    abordagens: [
      {
        id: 'razao', texto: 'Montar perguntas que funcionem qualquer que seja a resposta.',
        atributo: 'razao', cd: 16,
        sucesso: 'Você formula a pergunta que se fecha sozinha: mentira ou verdade, a resposta entrega o mesmo.',
        falha: 'Sua pergunta depende de boa-fé. Com esses três, boa-fé é luxo.'
      },
      {
        id: 'firmeza', texto: 'Encarar os três e testar quem vacila sob pressão.',
        atributo: 'firmeza', cd: 14,
        sucesso: 'Dois sustentam o olhar. Um não. Já é informação.',
        falha: 'Os três sustentam. O do meio até sorri.'
      },
      {
        id: 'harmonia', texto: 'Conversar com eles antes, sem acusar ninguém.',
        atributo: 'harmonia', cd: 13,
        sucesso: 'Na conversa fiada, um deles se contradiz sobre algo bobo — e isso basta.',
        falha: 'Eles gostam de você. Isso não os torna honestos.'
      }
    ],
    pergunta: 'Com apenas duas perguntas bem escolhidas, é possível identificar quem é quem?',
    alternativas: [
      { id: 'a', texto: 'Sim, é possível' },
      { id: 'b', texto: 'Não, são necessárias ao menos três' },
      { id: 'c', texto: 'Não, é impossível' },
      { id: 'd', texto: 'Só por sorteio' }
    ],
    respostaCorreta: 'a', xp: 50, ouro: 20
  },
  {
    id: 'justica-2',
    territorioId: 'salao-da-justica',
    titulo: 'A Regra e a Exceção',
    npc: {
      nome: 'Juíza Oren',
      icone: '⚖️',
      fala: 'A lei proíbe armas aqui dentro. Meus guardas entram armados todo dia. Você vai me dizer que a lei está errada, ou que meus guardas estão?'
    },
    narrativa: 'O Salão está em silêncio. A Juíza Oren não está testando o seu conhecimento da lei — está testando se você entende para que ela serve.',
    abordagens: [
      {
        id: 'firmeza', texto: 'Defender que a exceção tem de estar escrita e justificada.',
        atributo: 'firmeza', cd: 13,
        sucesso: 'Oren assente devagar. "Exceção sem justificativa escrita é privilégio. Você entendeu."',
        falha: 'Você defende a letra fria e Oren rebate: "Então prenda meus guardas. Vá em frente."'
      },
      {
        id: 'harmonia', texto: 'Perguntar quem a regra protege, antes de discutir a regra.',
        atributo: 'harmonia', cd: 12,
        sucesso: '"Finalmente", diz Oren. "Alguém que pergunta para quem a lei serve antes de recitá-la."',
        falha: 'A pergunta sai vaga e Oren perde o interesse antes de você terminar.'
      }
    ],
    pergunta: 'Uma regra que admite exceção justificada representa qual princípio?',
    alternativas: [
      { id: 'a', texto: 'Aplicação cega da lei, sem exceções' },
      { id: 'b', texto: 'Aplicação justa, considerando o contexto' },
      { id: 'c', texto: 'Ausência de regras' },
      { id: 'd', texto: 'Privilégio sem justificativa' }
    ],
    respostaCorreta: 'b', xp: 40, ouro: 15
  }
];

/* ============================================================
   ITENS — a loja que dá função ao ouro
   ============================================================
   Cada item tem um 'efeito' que o motor sabe aplicar (ver core.js,
   função usarItem). Os efeitos foram escolhidos para criar DECISÃO:
   gastar agora num encontro difícil ou guardar para o chefe?
   ============================================================ */
const ITENS = [
  {
    id: 'pocao-determinacao', nome: 'Poção de Ânimo', icone: '🧪', preco: 25,
    efeito: 'determinacao', valor: 3,
    descricao: 'Recupera 3 pontos de Determinação. Use quando a barra estiver no fim.'
  },
  {
    id: 'pena-inspiracao', nome: 'Pena do Bardo', icone: '🪶', preco: 40,
    efeito: 'inspiracao', valor: 1,
    descricao: 'Concede 1 ponto de Inspiração, que paga uma re-rolagem de dado.'
  },
  {
    id: 'tomo-sabedoria', nome: 'Tomo de Vareth', icone: '📗', preco: 35,
    efeito: 'bonus-rolagem', valor: 2,
    descricao: '+2 na próxima rolagem de dado, seja qual for a abordagem.'
  },
  {
    id: 'lente-revelacao', nome: 'Lente da Revelação', icone: '🔍', preco: 50,
    efeito: 'eliminar-alternativa', valor: 1,
    descricao: 'Apaga uma alternativa errada do próximo desafio.'
  },
  {
    id: 'amuleto-sorte', nome: 'Amuleto de Osso', icone: '🦴', preco: 60,
    efeito: 'anular-falha-critica', valor: 1,
    descricao: 'A próxima falha crítica vira uma falha comum. Quebra ao ser usado.'
  },
  {
    id: 'manto-vantagem', nome: 'Manto do Caçador', icone: '🧥', preco: 80,
    efeito: 'vantagem', valor: 1,
    descricao: 'Vantagem na próxima rolagem: rola dois dados e fica com o melhor.'
  }
];

/** Itens da loja: os fixos acima + os que o professor cadastrou. */
function getItensCustomizados() {
  try {
    const bruto = localStorage.getItem('elarion_itens_customizados');
    const lista = bruto ? JSON.parse(bruto) : [];
    return Array.isArray(lista) ? lista : [];
  } catch (erro) {
    return [];
  }
}
function todosOsItens() { return ITENS.concat(getItensCustomizados()); }
function buscarItem(id) { return todosOsItens().find(i => i.id === id); }


/* ============================================================
   BADGES (conquistas)
   Desbloqueadas quando o jogador conclui TODAS as quests de um território.
   ============================================================ */
const BADGES = [
  { id: 'badge-vale', territorioId: 'vale-do-saber', nome: 'Mestre da Lógica', icone: '📘' },
  { id: 'badge-terras', territorioId: 'terras-unidas', nome: 'Guardião da União', icone: '🤝' },
  { id: 'badge-jardim', territorioId: 'cidade-jardim', nome: 'Guardião Verde', icone: '🌸' },
  { id: 'badge-justica', territorioId: 'salao-da-justica', nome: 'Arauto da Justiça', icone: '⚖️' },
  { id: 'badge-lenda', territorioId: null, nome: 'Lenda de Elarion', icone: '👑' } // concedido ao concluir os 4 territórios
];

/* ============================================================
   EVENTOS ALEATÓRIOS DO MESTRE (usado em mesa-mestre.html)
   O professor rola o "d20 do Mestre" e, conforme a faixa do
   resultado, um evento de turma é sugerido.
   ============================================================ */
const EVENTOS_MESTRE = [
  { min: 1,  max: 5,  texto: '🌫️ Névoa do Esquecimento: a turma toda faz uma revisão rápida antes de continuar.' },
  { min: 6,  max: 10, texto: '🗺️ Encontro Tranquilo: siga o plano de aula normalmente.' },
  { min: 11, max: 15, texto: '✨ Encontro Favorável: conceda +5 XP bônus a quem acertar a próxima quest.' },
  { min: 16, max: 19, texto: '🐉 Desafio do Chefe: escolha a quest mais difícil disponível para a turma resolver em grupo.' },
  { min: 20, max: 20, texto: '👑 Crítico do Mestre! Toda a turma ganha uma recompensa surpresa (a critério do professor).' }
];

/** Retorna o texto do evento correspondente ao valor rolado no d20. */
function buscarEventoMestre(valorDado) {
  const evento = EVENTOS_MESTRE.find(e => valorDado >= e.min && valorDado <= e.max);
  return evento ? evento.texto : 'Nada de especial acontece desta vez.';
}

/* ============================================================
   FUNÇÕES AUXILIARES DE BUSCA
   ============================================================ */
/** Chave onde o painel do mestre grava as quests que ele cria. */
const CHAVE_QUESTS_CUSTOM = 'elarion_quests_customizadas';

/** Quests criadas pelo professor em mestre.html (podem nao existir ainda). */
function getQuestsCustomizadas() {
  try {
    const bruto = localStorage.getItem(CHAVE_QUESTS_CUSTOM);
    const lista = bruto ? JSON.parse(bruto) : [];
    return Array.isArray(lista) ? lista : [];
  } catch (erro) {
    console.warn('[Elarion] Quests customizadas invalidas no localStorage — ignorando.', erro);
    return [];
  }
}

/**
 * QUESTS fixas + encontros criados pelo professor.
 *
 * Um encontro pode pertencer a uma campanha (campanhaId): nesse caso ele
 * só aparece para quem está jogando ELA. Encontros sem campanhaId valem
 * para todas — é o caso dos oito encontros básicos de Elarion.
 */
function todasAsQuests() {
  let ativa = null;
  try {
    // Campanha de quem está jogando, não a que o professor selecionou.
    ativa = (typeof Campanhas !== 'undefined') ? Campanhas.idDoJogador() : null;
  } catch (erro) {
    ativa = null;
  }

  const customizadas = getQuestsCustomizadas()
    .filter(q => !q.campanhaId || q.campanhaId === ativa);

  return QUESTS.concat(customizadas);
}

function buscarClasse(id) { return CLASSES.find(c => c.id === id); }
function buscarTerritorio(id) { return TERRITORIOS.find(t => t.id === id); }
/**
 * Encontros de um território.
 *
 * Se a campanha ativa tem encontros próprios ali, são SÓ eles: uma campanha
 * escrita pelo professor conta a história dela, não a história padrão de
 * Elarion misturada com a dele. Sem encontros próprios, valem os básicos
 * (mais os avulsos que o professor criou fora de qualquer campanha).
 */
function buscarQuestsDoTerritorio(territorioId) {
  const daCampanha = getQuestsCustomizadas().filter(q => {
    if (q.territorioId !== territorioId || !q.campanhaId) return false;
    try {
      return q.campanhaId === Campanhas.idDoJogador();
    } catch (erro) {
      return false;
    }
  });

  if (daCampanha.length) return daCampanha;

  return todasAsQuests().filter(q => q.territorioId === territorioId);
}
function buscarQuest(id) { return todasAsQuests().find(q => q.id === id); }
