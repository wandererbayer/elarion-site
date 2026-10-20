/* ==========================================================================
   CRÔNICAS DE ELARION — campanha-tutorial.js
   --------------------------------------------------------------------------
   "O Sino de Vilarim" — a campanha de entrada, feita para ser a PRIMEIRA
   partida de uma turma e do professor.

   Ela segue a lógica de uma aventura introdutória de RPG de mesa: cada
   encontro apresenta uma regra nova, na ordem em que ela importa, e a
   história dá um motivo para a regra existir. Ninguém lê um manual —
   aprende jogando.

     Encontro 1  →  escolher a abordagem      (CD 9, sem inimigo)
     Encontro 2  →  a rolagem e a dificuldade (CD 11)
     Encontro 3  →  Determinação: errar custa (inimigo de 1 de dano)
     Encontro 4  →  Inspiração: a re-rolagem  (CD 12)
     Encontro 5  →  falhar muda a cena        (CD 11)
     Encontro 6  →  o desfecho                (CD 10)

   Diferenças para "O Último Inverno de Pedravasta":
     - Conteúdo de 5º e 6º ano (sequências, dobro e metade, frações
       simples, divisão exata, perímetro, leitura de tabela).
     - Dificuldades entre 9 e 12, contra 10 a 16 de Pedravasta.
     - Inimigos custam 1 de Determinação, não 2 ou 3.
     - Um território por encontro: insígnias chegam rápido, o que
       importa muito para quem está começando.
     - Tom acolhedor. O conflito é um desentendimento entre vizinhos,
       não uma ameaça à cidade.

   Referências de desenho: a estrutura de aventura-tutorial do D&D, que
   introduz uma mecânica por cena; e a postura do Daggerheart, em que a
   ficção vem antes da regra e a falha empurra a história em vez de
   travá-la. Por isso nenhum encontro aqui termina em "tente de novo".
   ========================================================================== */

const CAMPANHA_TUTORIAL = {

  campanha: {
    nome: 'O Sino de Vilarim',
    turma: '',
    nivel: 'iniciante',
    faixaEtaria: '10 a 12 anos',
    titulo: 'O Sino de Vilarim',

    prologo:
      'Vilarim é pequena o bastante para caber num olhar, e dividida em quatro cantos que '
      + 'quase nunca concordam: o Alto dos Livros, a Ribeira, a Horta e a Praça da Lei.\n\n'
      + 'O que mantinha a vila inteira era o Sino. Quando alguém precisava de ajuda — uma '
      + 'cheia, um incêndio, uma criança perdida —, o Sino tocava e os quatro cantos vinham '
      + 'correndo, sem perguntar de quem era a culpa.\n\n'
      + 'Na semana passada o badalo caiu. Ninguém sabe como, e cada canto culpa o outro. '
      + 'Já faz sete dias que Vilarim não se ouve.\n\n'
      + 'Mestra Corina, que cuida da torre desde sempre, chamou vocês. Não porque sejam os '
      + 'mais fortes: porque são os únicos que ainda falam com os quatro cantos.',

    capitulos: {
      'vale-do-saber':
        'O Alto dos Livros guarda o registro de como o Sino foi construído — e a chave da '
        + 'torre, que o velho bibliotecário escondeu atrás de um enigma "para ninguém mexer '
        + 'no que não entende". É por aqui que a aventura começa, e é aqui que vocês vão '
        + 'aprender como funciona uma missão em Elarion.',

      'terras-unidas':
        'A Ribeira tem a corda nova, trançada por três famílias que brigaram no meio do '
        + 'trabalho e largaram tudo pela metade. A corda existe. Falta alguém fazer as três '
        + 'famílias terminarem juntas o que começaram separadas.',

      'cidade-jardim':
        'A Horta tem a madeira certa para o suporte do badalo, mas o pomar está desorganizado '
        + 'desde que pararam de se falar. Encontrar a tábua boa no meio da bagunça é a prova '
        + 'de que vale a pena cuidar das coisas antes que elas quebrem.',

      'salao-da-justica':
        'A Praça da Lei precisa decidir quem paga o conserto — e, no fundo, se ainda faz '
        + 'sentido ter um sino que chama todo mundo. É a última conversa antes do Sino voltar '
        + 'a tocar, e ela não se resolve com força.'
    },

    checkpoints: [
      { titulo: 'Corina convoca a turma', nota: 'Leia o prólogo em voz alta. Peça que cada aluno diga em qual canto de Vilarim o personagem dele cresceu — isso já cria vínculo com a vila.', concluido: false },
      { titulo: 'A chave do bibliotecário', nota: 'Encontros 1 e 2, no Alto dos Livros. Aqui a turma aprende a escolher abordagem e a ler a dificuldade. Deixe que errem: as CDs são baixas de propósito.', concluido: false },
      { titulo: 'A corda inacabada', nota: 'Ribeira. Primeiro inimigo da campanha, e ele custa só 1 de Determinação. Aproveite para explicar a barra.', concluido: false },
      { titulo: 'A tábua certa', nota: 'Horta. Boa hora para alguém gastar Inspiração pela primeira vez — se ninguém gastar, lembre que existe.', concluido: false },
      { titulo: 'Quem paga o Sino', nota: 'Praça da Lei. Pare o jogo e abra a discussão antes de deixarem responder. Não existe resposta óbvia aqui.', concluido: false },
      { titulo: 'O Sino toca', nota: 'Desfecho. Peça a cada aluno uma frase sobre o que o personagem dele sentiu ao ouvir o Sino de novo. Encerre aí.', concluido: false }
    ]
  },

  /* ============================================================
     ITENS — poucos e baratos, para a primeira compra acontecer cedo
     ============================================================ */
  itens: [
    {
      id: 'tutorial-pao-corina', nome: 'Pão da Mestra Corina', icone: '🍞', preco: 15,
      efeito: 'determinacao', valor: 3,
      descricao: 'Ainda quente, embrulhado num pano. Recupera 3 de Determinação e melhora o dia de qualquer um.'
    },
    {
      id: 'tutorial-sino-mao', nome: 'Sineta de Mão', icone: '🔔', preco: 25,
      efeito: 'inspiracao', valor: 1,
      descricao: 'Pequena demais para ser ouvida longe, mas o som lembra você de que não está sozinho. Concede 1 de Inspiração.'
    },
    {
      id: 'tutorial-lupa', nome: 'Lupa do Bibliotecário', icone: '🔎', preco: 30,
      efeito: 'eliminar-alternativa', valor: 1,
      descricao: 'Ele empresta a contragosto. Apaga uma alternativa errada do próximo desafio.'
    }
  ],

  /* ============================================================
     ENCONTROS — seis cenas curtas, uma regra nova por vez
     ============================================================ */
  encontros: [

    /* ---------- 1. Escolher a abordagem ---------- */
    {
      id: 'tutorial-1',
      territorioId: 'vale-do-saber',
      titulo: 'A Porta do Bibliotecário',
      npc: {
        nome: 'Mestra Corina, a sineira',
        icone: '🔔',
        fala: 'A chave da torre está lá dentro, e o velho Dílio trancou a porta com um enigma. '
            + 'Não se apressem: aqui dentro, o jeito como vocês resolvem conta tanto quanto a resposta.'
      },
      narrativa:
        'A porta do Alto dos Livros tem três trincos, e ao lado deles uma placa de madeira com '
        + 'números pintados: 2, 5, 8, 11. Dílio deixou um bilhete: "Quem souber o próximo, entra."\n\n'
        + 'Corina cruza os braços e espera. Ela não vai resolver por vocês — mas também não tem pressa.',
      abordagens: [
        { id: 'a1', texto: 'Olhar os números e procurar o padrão entre eles.', atributo: 'razao', cd: 9,
          sucesso: 'De um número para o outro, sempre o mesmo salto. Assim que você vê, não dá mais para não ver.',
          falha: 'Os números embaralham na cabeça. Você respira e começa de novo — sem pressa.' },
        { id: 'a2', texto: 'Chamar os colegas e resolver em voz alta, todo mundo junto.', atributo: 'harmonia', cd: 9,
          sucesso: 'Alguém diz um número errado, outro corrige, e no meio da conversa o padrão aparece sozinho.',
          falha: 'Todo mundo fala ao mesmo tempo e ninguém escuta ninguém. Corina ri baixinho.' },
        { id: 'a3', texto: 'Bater na porta e pedir uma dica ao Dílio.', atributo: 'firmeza', cd: 10,
          sucesso: 'Dílio resmunga do outro lado, mas resmunga uma dica. Resmungo que ajuda ainda é ajuda.',
          falha: 'Silêncio do outro lado da porta. Ele ouviu, e escolheu não responder.' }
      ],
      pergunta: 'Seguindo o padrão da placa (2, 5, 8, 11), qual é o próximo número?',
      alternativas: [
        { id: 'a', texto: '12' }, { id: 'b', texto: '13' }, { id: 'c', texto: '14' }, { id: 'd', texto: '16' }
      ],
      respostaCorreta: 'c', xp: 30, ouro: 12
    },

    /* ---------- 2. A rolagem e a dificuldade ---------- */
    {
      id: 'tutorial-2',
      territorioId: 'vale-do-saber',
      titulo: 'A Escada da Torre',
      npc: {
        nome: 'Dílio, o bibliotecário',
        icone: '📚',
        fala: 'Oitenta e quatro degraus até o sino, e os seis de cima estão podres. '
            + 'Eu avisei a vila. Duas vezes. Por escrito.'
      },
      narrativa:
        'A escada sobe em espiral pelo meio da torre. Dílio diz que são 84 degraus e que você '
        + 'precisa parar antes dos seis últimos. A luz entra por uma fresta lá no alto, e dá '
        + 'para ouvir pombos.\n\n'
        + 'Antes de subir, você sente aquilo que todo aventureiro sente: a certeza de que sabe, '
        + 'e a dúvida de que vai dar certo. É para isso que serve o dado.',
      abordagens: [
        { id: 'a1', texto: 'Contar os degraus enquanto sobe, para parar na hora certa.', atributo: 'razao', cd: 11,
          sucesso: 'Você conta em voz baixa, degrau por degrau, e para exatamente onde devia.',
          falha: 'Você perde a conta no meio e precisa descer para recomeçar. Vergonha nenhuma.' },
        { id: 'a2', texto: 'Testar cada degrau com o pé antes de pôr o peso.', atributo: 'natureza', cd: 10,
          sucesso: 'A madeira boa responde firme; a podre range antes de ceder. Seu pé aprende rápido.',
          falha: 'No escuro, todo degrau range igual.' },
        { id: 'a3', texto: 'Subir rápido, confiando que a madeira aguenta.', atributo: 'firmeza', cd: 12,
          sucesso: 'Você sobe sem pensar duas vezes e chega inteiro. Às vezes funciona.',
          falha: 'Um degrau cede sob o seu pé e você se segura no corrimão por pouco.' }
      ],
      pergunta: 'Se a escada tem 84 degraus e os 6 últimos estão podres, até qual degrau dá para subir com segurança?',
      alternativas: [
        { id: 'a', texto: '74' }, { id: 'b', texto: '78' }, { id: 'c', texto: '80' }, { id: 'd', texto: '90' }
      ],
      respostaCorreta: 'b', xp: 30, ouro: 12
    },

    /* ---------- 3. Determinação: errar custa ---------- */
    {
      id: 'tutorial-3',
      territorioId: 'terras-unidas',
      titulo: 'A Corda Pela Metade',
      inimigo: {
        nome: 'Gorgo, o ganso da Ribeira',
        icone: '🪿',
        fala: '(Gorgo não fala. Gorgo abre as asas, estica o pescoço e avança. Gorgo acha que a corda é dele.)',
        golpe: 'Gorgo belisca o seu tornozelo e você desencosta da corda.',
        dano: 1
      },
      narrativa:
        'A corda nova está estendida no pátio da Ribeira, trançada até a metade e abandonada ali '
        + 'há seis dias. Três famílias começaram juntas; três famílias pararam no meio.\n\n'
        + 'E tem o Gorgo, que adotou a corda como ninho e não aceita visita. Ele não é perigoso — '
        + 'é teimoso. Mas cada bicada atrapalha, e atrapalhar custa.',
      abordagens: [
        { id: 'a1', texto: 'Chamar uma pessoa de cada família para terminar a trança junto.', atributo: 'harmonia', cd: 9,
          sucesso: 'Três pares de mãos na mesma corda. Ninguém pede desculpa, mas todo mundo fica.',
          falha: 'Dois vêm, um não. Com dois, a trança sai torta.' },
        { id: 'a2', texto: 'Calcular quanto falta e dividir o trabalho em partes iguais.', atributo: 'razao', cd: 10,
          sucesso: 'Com a conta na mão, ninguém pode dizer que fez mais que o outro.',
          falha: 'Sua divisão deixa um pedaço sobrando, e sobra vira discussão.' },
        { id: 'a3', texto: 'Distrair o Gorgo com pão enquanto os outros trabalham.', atributo: 'natureza', cd: 11,
          sucesso: 'Gorgo troca a corda por pão sem pensar duas vezes. Gorgo tem prioridades.',
          falha: 'Gorgo come o pão e volta para a corda. Gorgo é profissional.' }
      ],
      pergunta: 'A corda precisa ter 24 metros e está trançada pela metade. Quantos metros ainda faltam?',
      alternativas: [
        { id: 'a', texto: '6' }, { id: 'b', texto: '8' }, { id: 'c', texto: '12' }, { id: 'd', texto: '18' }
      ],
      respostaCorreta: 'c', xp: 35, ouro: 14
    },

    /* ---------- 4. Inspiração: a segunda chance ---------- */
    {
      id: 'tutorial-4',
      territorioId: 'cidade-jardim',
      titulo: 'A Tábua Certa',
      npc: {
        nome: 'Tiê, da Horta',
        icone: '🌿',
        fala: 'Tem tábua boa nesse monte, eu garanto. O problema é que ninguém guardou direito '
            + 'desde que a vila parou de se falar. Procure com calma — e se errar, tente de outro jeito.'
      },
      narrativa:
        'O depósito da Horta é um monte de madeira empilhada sem critério: tábua boa, tábua '
        + 'rachada, tábua verde demais. O suporte do badalo precisa de uma peça quadrada, e Tiê '
        + 'diz que ela tem 3 metros de lado.\n\n'
        + 'Tiê também diz, sem olhar para você: "Quando a gente acredita no que está fazendo, '
        + 'ganha fôlego para tentar de novo." É a deixa dela para falar de Inspiração.',
      abordagens: [
        { id: 'a1', texto: 'Medir as peças candidatas antes de carregar qualquer uma.', atributo: 'razao', cd: 11,
          sucesso: 'Medir primeiro poupa carregar errado. A peça certa aparece na terceira medida.',
          falha: 'Você mede por cima e carrega a tábua errada até lá fora.' },
        { id: 'a2', texto: 'Olhar a madeira: a que está sã tem cheiro e cor diferentes.', atributo: 'natureza', cd: 10,
          sucesso: 'Você passa a mão na madeira e sabe. Tiê assente, satisfeita.',
          falha: 'Na penumbra do depósito, toda tábua parece igual.' },
        { id: 'a3', texto: 'Pedir que Tiê conte como organizavam o depósito antigamente.', atributo: 'harmonia', cd: 9,
          sucesso: 'Ela conta — e no meio da história lembra exatamente onde a peça boa foi parar.',
          falha: 'A lembrança dela é de um depósito que não existe mais.' }
      ],
      pergunta: 'A tábua precisa ser quadrada, com 3 metros de lado. Qual é o perímetro dessa peça?',
      alternativas: [
        { id: 'a', texto: '9 metros' }, { id: 'b', texto: '12 metros' }, { id: 'c', texto: '6 metros' }, { id: 'd', texto: '15 metros' }
      ],
      respostaCorreta: 'b', xp: 35, ouro: 14
    },

    /* ---------- 5. Falhar muda a cena ---------- */
    {
      id: 'tutorial-5',
      territorioId: 'salao-da-justica',
      titulo: 'Quem Paga o Sino',
      npc: {
        nome: 'Juíza Vanda, da Praça da Lei',
        icone: '⚖️',
        fala: 'O conserto custa 120 moedas. Os quatro cantos querem que o outro pague. '
            + 'Me digam uma divisão que ninguém consiga chamar de injusta.'
      },
      narrativa:
        'A Praça da Lei é só um banco de pedra debaixo de uma figueira, mas é ali que Vilarim '
        + 'decide as coisas. Os quatro cantos mandaram um representante cada, e os quatro '
        + 'chegaram com o argumento pronto.\n\n'
        + 'Vanda não está do lado de ninguém. Ela quer ver se vocês conseguem.',
      abordagens: [
        { id: 'a1', texto: 'Propor que os quatro cantos dividam em partes iguais.', atributo: 'razao', cd: 10,
          sucesso: 'Parte igual é difícil de contestar: ninguém pagou mais que o vizinho.',
          falha: 'Alguém grita "mas a Ribeira é mais pobre!" e a conta trava.' },
        { id: 'a2', texto: 'Ouvir os quatro antes de propor qualquer número.', atributo: 'harmonia', cd: 9,
          sucesso: 'Ouvir primeiro desarma metade da briga. A proposta sai quase pronta deles mesmos.',
          falha: 'Os quatro falam muito e cada um sai mais convencido do que entrou.' },
        { id: 'a3', texto: 'Lembrar que o Sino serve a todos, inclusive a quem não quer pagar.', atributo: 'firmeza', cd: 11,
          sucesso: 'Você diz isso olhando para o representante do Alto. Ele desvia o olhar e concorda.',
          falha: 'Soa como sermão, e ninguém gosta de sermão na própria praça.' }
      ],
      pergunta: 'Dividindo 120 moedas igualmente entre os 4 cantos, quanto paga cada um?',
      alternativas: [
        { id: 'a', texto: '24' }, { id: 'b', texto: '30' }, { id: 'c', texto: '40' }, { id: 'd', texto: '60' }
      ],
      respostaCorreta: 'b', xp: 40, ouro: 16
    },

    /* ---------- 6. O desfecho ---------- */
    {
      id: 'tutorial-6',
      territorioId: 'salao-da-justica',
      titulo: 'O Sino de Vilarim',
      npc: {
        nome: 'Mestra Corina, a sineira',
        icone: '🔔',
        fala: 'Badalo no lugar, corda trançada, suporte firme, conserto pago. '
            + 'Falta uma coisa só: alguém puxar. Vai ser quem?'
      },
      narrativa:
        'A torre está cheia. Os quatro cantos subiram juntos pela primeira vez em sete dias, '
        + 'e ninguém comentou o fato — o que é, em Vilarim, a maior demonstração de paz possível.\n\n'
        + 'A corda desce do sino até a altura das suas mãos. Corina diz que é preciso puxar três '
        + 'vezes: uma para avisar, uma para chamar, uma para agradecer.',
      abordagens: [
        { id: 'a1', texto: 'Puxar sozinho, com força.', atributo: 'firmeza', cd: 10,
          sucesso: 'O sino responde no terceiro puxão, e o som enche o vale inteiro.',
          falha: 'A corda é mais pesada do que parece, e o primeiro puxão sai mudo.' },
        { id: 'a2', texto: 'Chamar um representante de cada canto para puxar junto.', atributo: 'harmonia', cd: 9,
          sucesso: 'Quatro pares de mãos na mesma corda. O som sai mais alto do que qualquer um esperava.',
          falha: 'Cada um puxa num tempo e o sino só balança.' },
        { id: 'a3', texto: 'Contar o ritmo em voz alta antes de puxar.', atributo: 'razao', cd: 9,
          sucesso: 'Um, dois, três — e o bronze obedece. Ritmo também é cálculo.',
          falha: 'Você conta e ninguém acompanha.' }
      ],
      pergunta: 'Corina pede três toques: um para avisar, um para chamar, um para agradecer. Se cada toque leva 4 segundos, quanto tempo o Sino soa ao todo?',
      alternativas: [
        { id: 'a', texto: '7 segundos' }, { id: 'b', texto: '12 segundos' }, { id: 'c', texto: '34 segundos' }, { id: 'd', texto: '43 segundos' }
      ],
      respostaCorreta: 'b', xp: 45, ouro: 20
    }
  ]
};

/* ==========================================================================
   INSTALAÇÃO
   ========================================================================== */

/**
 * Cria a campanha tutorial com os seis encontros e os três itens.
 * Mesma mecânica de instalarCampanhaExemplo (ver campanha-exemplo.js).
 *
 * @returns {object} a campanha criada
 */
function instalarCampanhaTutorial() {
  const modelo = CAMPANHA_TUTORIAL;

  const campanha = Campanhas.criar(modelo.campanha.nome, {
    turma: modelo.campanha.turma,
    base: {
      titulo: modelo.campanha.titulo,
      prologo: modelo.campanha.prologo,
      nivel: modelo.campanha.nivel,
      faixaEtaria: modelo.campanha.faixaEtaria,
      capitulos: Object.assign({}, modelo.campanha.capitulos),
      checkpoints: modelo.campanha.checkpoints.map(c => Object.assign({}, c))
    }
  });

  const quests = getQuestsCustomizadas()
    .filter(q => !String(q.id).startsWith('tutorial-'));
  modelo.encontros.forEach(encontro => {
    quests.push(Object.assign({}, encontro, { campanhaId: campanha.id }));
  });
  localStorage.setItem(CHAVE_QUESTS_CUSTOM, JSON.stringify(quests));

  const itens = getItensCustomizados()
    .filter(i => !String(i.id).startsWith('tutorial-'));
  modelo.itens.forEach(item => itens.push(Object.assign({}, item)));
  localStorage.setItem('elarion_itens_customizados', JSON.stringify(itens));

  return campanha;
}
