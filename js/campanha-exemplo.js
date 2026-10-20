/* ==========================================================================
   CRÔNICAS DE ELARION — campanha-exemplo.js
   --------------------------------------------------------------------------
   "O Último Inverno de Pedravasta" — uma campanha completa, pronta para
   jogar, que serve de modelo para professores que vão escrever a sua.

   Ela existe por dois motivos:
     1. Um mestre novo não precisa inventar tudo na primeira aula.
     2. É mais fácil entender o formato lendo um exemplo inteiro do que
        lendo a documentação dos campos.

   O conflito foi escrito de propósito sem um vilão monstruoso: Corvino
   acredita no que faz, e a turma precisa decidir se ele está errado. Isso
   rende debate em sala — que é o objetivo pedagógico real da aventura.

   Instalação: o Painel do Mestre tem o botão "Carregar campanha de exemplo",
   que chama instalarCampanhaExemplo().
   ========================================================================== */

const CAMPANHA_EXEMPLO = {

  /* ============================================================
     A CAMPANHA — história, capítulos e checkpoints
     ============================================================ */
  campanha: {
    nome: 'O Último Inverno de Pedravasta',
    turma: '',
    nivel: 'intermediaria',
    faixaEtaria: '12 a 15 anos',
    titulo: 'O Último Inverno de Pedravasta',

    prologo:
      'Pedravasta é uma cidade encravada entre duas montanhas, e há trezentos anos ela sobrevive '
      + 'ao inverno por causa da Grande Fornalha. A Fornalha não queima lenha: queima conhecimento. '
      + 'Cada cálculo resolvido, cada acordo fechado, cada semente plantada com cuidado alimenta a '
      + 'chama que mantém a cidade viva sob a neve.\n\n'
      + 'Há seis semanas, a chama começou a baixar. Não de uma vez — devagar, como quem perde o '
      + 'interesse. As ruas mais altas já congelaram. E o Arquivo Central, de onde vinha metade do '
      + 'que alimentava a Fornalha, está trancado por ordem do próprio arquivista.\n\n'
      + 'Mestre Corvino não roubou nada. Ele diz que está protegendo. Diz que o conhecimento foi '
      + 'desperdiçado por gente que não o merecia, e que vai devolvê-lo quando Pedravasta provar '
      + 'que sabe cuidar dele. Enquanto isso, a cidade esfria.\n\n'
      + 'Vocês foram chamados porque são jovens demais para terem tomado partido — e porque alguém '
      + 'precisa atravessar a cidade antes do último inverno.',

    capitulos: {
      'vale-do-saber':
        'O Arquivo Central fica no Vale do Saber, e Corvino o lacrou com fechaduras que só abrem '
        + 'para quem resolve o que está escrito nelas. Ele não queria impedir a entrada: queria '
        + 'filtrar quem entra. Dentro, as estantes estão intactas, cobertas de pó e de silêncio. '
        + 'A Mordaça ronda os corredores — uma criatura que Corvino não criou, mas que prosperou '
        + 'no vazio que ele fez: ela engole perguntas antes que sejam feitas.',

      'terras-unidas':
        'Com a Fornalha fraca, o carvão de reserva virou a moeda real de Pedravasta. Os três bairros '
        + '— Alto, Ribeira e Forja — brigam pela divisão desde a primeira semana. Mestra Ilda, que '
        + 'administra os celeiros, parou de dormir. O problema não é falta de carvão: é que ninguém '
        + 'confia na conta do outro. E cada dia de briga é um dia a menos de inverno suportável.',

      'cidade-jardim':
        'As estufas suspensas de Pedravasta alimentavam a cidade no inverno. Agora metade delas '
        + 'está morta, e os jardineiros discutem se vale replantar. O frio é só parte do problema: '
        + 'durante anos plantaram sempre a mesma coisa, no mesmo lugar, porque dava mais rápido. '
        + 'O solo cobrou a conta justamente no ano em que ninguém podia pagá-la.',

      'salao-da-justica':
        'Corvino será julgado no Salão. Ele não nega nada do que fez — vai se defender dizendo que '
        + 'a cidade é que está em julgamento, não ele. A Juíza Oren conduz. A turma não vai apenas '
        + 'assistir: vai ser chamada a opinar, e o que disser vai pesar na sentença. Não existe '
        + 'resposta pronta aqui, e é esse o ponto.'
    },

    checkpoints: [
      { titulo: 'A chama baixa', nota: 'Abertura. Leia o prólogo em voz alta. Pergunte a cada aluno por que o personagem dele atendeu ao chamado.', concluido: false },
      { titulo: 'O Arquivo lacrado', nota: 'Vale do Saber, encontros 1 e 2. A Mordaça aparece no segundo. Objetivo: entrar no Arquivo.', concluido: false },
      { titulo: 'A divisão do carvão', nota: 'Terras Unidas. Deixe a turma discutir a divisão antes de abrir a votação no jogo.', concluido: false },
      { titulo: 'As estufas mortas', nota: 'Cidade-Jardim. Bom momento para um evento de mesa: role o d20 do mestre.', concluido: false },
      { titulo: 'O julgamento de Corvino', nota: 'Salão da Justiça. Leia a defesa dele inteira antes de deixar a turma responder.', concluido: false },
      { titulo: 'A escolha final', nota: 'Reabrir o Arquivo ou refundar a Fornalha? Peça um voto por aluno, com justificativa. Sem dado — só argumento.', concluido: false }
    ]
  },

  /* ============================================================
     ITENS — a loja desta campanha
     ============================================================ */
  itens: [
    {
      id: 'exemplo-cinza-quente', nome: 'Punhado de Cinza Quente', icone: '🔥', preco: 30,
      efeito: 'determinacao', valor: 4,
      descricao: 'Brasa viva da Fornalha, guardada num pano. Recupera 4 de Determinação e queima a mão de quem a usa.'
    },
    {
      id: 'exemplo-chave-corvino', nome: 'Chave Falsa de Corvino', icone: '🗝️', preco: 55,
      efeito: 'eliminar-alternativa', valor: 1,
      descricao: 'Uma cópia malfeita que não abre nada — mas mostra qual fechadura não é a certa. Apaga uma alternativa errada.'
    },
    {
      id: 'exemplo-caderno-ilda', nome: 'Caderno de Contas de Ilda', icone: '📒', preco: 45,
      efeito: 'bonus-rolagem', valor: 3,
      descricao: 'Trinta anos de contas de celeiro, na letra apertada dela. +3 na próxima rolagem.'
    },
    {
      id: 'exemplo-luva-forja', nome: 'Luva do Bairro da Forja', icone: '🧤', preco: 70,
      efeito: 'vantagem', valor: 1,
      descricao: 'Quem trabalha na forja aprende a não errar duas vezes. Vantagem na próxima rolagem.'
    }
  ],

  /* ============================================================
     ENCONTROS — oito cenas, duas por território
     ============================================================ */
  encontros: [

    /* ---------- Vale do Saber: o Arquivo ---------- */
    {
      id: 'exemplo-vale-1',
      territorioId: 'vale-do-saber',
      titulo: 'A Fechadura de Três Voltas',
      npc: {
        nome: 'Tessa, aprendiza de arquivista',
        icone: '📚',
        fala: 'Corvino fez as fechaduras ele mesmo. Esta abre com três voltas, e o número de cada volta '
            + 'está na placa: 3, 6, 12. Ele dizia que quem não enxerga o passo não merece entrar.'
      },
      narrativa:
        'A porta do Arquivo tem três anéis de bronze, cada um com números gravados em volta. '
        + 'Tessa está sentada no degrau há dois dias, com um cobertor e um caderno cheio de tentativas '
        + 'riscadas. O frio aqui já faz o hálito virar fumaça.',
      abordagens: [
        { id: 'a1', texto: 'Ler a progressão e deduzir a quarta volta.', atributo: 'razao', cd: 11,
          sucesso: 'O padrão aparece na terceira olhada. Tessa acompanha o seu dedo e solta um palavrão de alívio.',
          falha: 'Você força um padrão que não existe e o anel trava na posição errada.' },
        { id: 'a2', texto: 'Pedir o caderno de Tessa e aproveitar o que ela já descartou.', atributo: 'harmonia', cd: 10,
          sucesso: 'Dois dias de erro alheio valem mais que uma hora de acerto sozinho. O caminho fica curto.',
          falha: 'A letra dela é pior que a fechadura. Você perde tempo decifrando rabiscos.' },
        { id: 'a3', texto: 'Forçar os anéis até ceder.', atributo: 'firmeza', cd: 16,
          sucesso: 'O bronze range e cede meio milímetro — o bastante para ver o mecanismo por dentro.',
          falha: 'O anel emperra de vez. Agora até a resposta certa vai custar mais.' }
      ],
      pergunta: 'Seguindo a lógica da placa (3, 6, 12), qual é o número da quarta volta?',
      alternativas: [
        { id: 'a', texto: '15' }, { id: 'b', texto: '18' }, { id: 'c', texto: '24' }, { id: 'd', texto: '36' }
      ],
      respostaCorreta: 'c', xp: 40, ouro: 15
    },
    {
      id: 'exemplo-vale-2',
      territorioId: 'vale-do-saber',
      titulo: 'A Mordaça entre as Estantes',
      inimigo: {
        nome: 'A Mordaça',
        icone: '🕸️',
        fala: '(Não fala. Quando você abre a boca para perguntar algo, o som simplesmente não sai.)',
        golpe: 'A Mordaça engole a sua pergunta no meio e você esquece o que ia dizer.',
        dano: 2
      },
      narrativa:
        'O Arquivo tem onze corredores e uma única lamparina acesa. Entre as estantes há algo que não '
        + 'anda: aparece. Tessa explica em sussurro que a criatura não ataca quem fica calado — ela se '
        + 'alimenta de perguntas. Problema: vocês vieram fazer perguntas. O registro da Fornalha está '
        + 'no corredor sete, e cada corredor tem o dobro de estantes do anterior. O primeiro tem 2.',
      abordagens: [
        { id: 'a1', texto: 'Calcular em que corredor está o registro antes de andar.', atributo: 'razao', cd: 13,
          sucesso: 'Você conta de cabeça, em silêncio, e vai direto. A Mordaça não tem o que engolir.',
          falha: 'Você perde a conta no meio e precisa recomeçar em voz alta. Ela escuta.' },
        { id: 'a2', texto: 'Andar devagar, lendo as lombadas, sem falar nada.', atributo: 'natureza', cd: 14,
          sucesso: 'Você se move como quem não quer ser notado. Funciona — por pouco.',
          falha: 'Onze corredores é muita estante. A paciência acaba antes do caminho.' },
        { id: 'a3', texto: 'Enfrentar: fazer uma pergunta alta, de propósito, e correr para o lado oposto.', atributo: 'firmeza', cd: 15,
          sucesso: 'A Mordaça vai atrás da isca. Você tem trinta segundos, e trinta segundos bastam.',
          falha: 'Ela não cai. Pior: agora sabe onde você está.' }
      ],
      pergunta: 'Se o primeiro corredor tem 2 estantes e cada corredor seguinte tem o dobro do anterior, quantas estantes tem o corredor 7?',
      alternativas: [
        { id: 'a', texto: '64' }, { id: 'b', texto: '128' }, { id: 'c', texto: '96' }, { id: 'd', texto: '14' }
      ],
      respostaCorreta: 'b', xp: 50, ouro: 20
    },

    /* ---------- Terras Unidas: o carvão ---------- */
    {
      id: 'exemplo-terras-1',
      territorioId: 'terras-unidas',
      titulo: 'Oitocentos Sacos e Três Bairros',
      npc: {
        nome: 'Mestra Ilda, dos celeiros',
        icone: '🌾',
        fala: 'Oitocentos sacos de carvão. Alto tem 200 moradores, Ribeira 500, Forja 300. '
            + 'Toda vez que eu proponho uma divisão, dois bairros dizem que é roubo. Proponha você.'
      },
      narrativa:
        'O celeiro está lotado de gente discutindo e vazio de qualquer decisão. Ilda tem sessenta anos, '
        + 'um caderno encardido e a paciência no fim. Na parede, alguém riscou a giz três contas '
        + 'diferentes — nenhuma bate com a outra.',
      abordagens: [
        { id: 'a1', texto: 'Fazer a conta proporcional no quadro, na frente de todos.', atributo: 'razao', cd: 12,
          sucesso: 'Você escreve os números devagar. Contra uma conta feita à vista, grito não funciona.',
          falha: 'Você erra uma divisão e alguém do Alto ri alto. Perde-se a sala.' },
        { id: 'a2', texto: 'Chamar um representante de cada bairro para fazer a conta junto.', atributo: 'harmonia', cd: 13,
          sucesso: 'Três pessoas fazem a mesma conta ao mesmo tempo. Quando bate, ninguém pode dizer que foi enganado.',
          falha: 'Os três chegam e lembram de uma briga de vinte anos atrás. Agora são três discussões.' },
        { id: 'a3', texto: 'Anunciar a divisão pela autoridade da Fornalha e encarar a bronca.', atributo: 'firmeza', cd: 15,
          sucesso: 'Você decide, anuncia e sustenta o olhar. Resmungam — mas carregam os sacos.',
          falha: 'Autoridade sem explicação vira teimosia. O Alto sai sem levar nada e isso vai voltar.' }
      ],
      pergunta: 'Dividindo 800 sacos proporcionalmente à população (200, 500 e 300), quantos sacos cabem a Ribeira?',
      alternativas: [
        { id: 'a', texto: '300' }, { id: 'b', texto: '350' }, { id: 'c', texto: '400' }, { id: 'd', texto: '450' }
      ],
      respostaCorreta: 'c', xp: 45, ouro: 15
    },
    {
      id: 'exemplo-terras-2',
      territorioId: 'terras-unidas',
      titulo: 'O Fiscal do Peso',
      inimigo: {
        nome: 'Haskel, fiscal de Corvino',
        icone: '⚖️',
        fala: 'A balança é minha, o peso é meu e a regra é minha. Reclame por escrito — no Arquivo, '
            + 'que está fechado.',
        golpe: 'Haskel confisca parte da carga alegando irregularidade e você perde tempo discutindo.',
        dano: 2
      },
      narrativa:
        'Na saída do celeiro, Haskel pesa cada carga antes de liberar. Ele cobra 15% de "taxa de '
        + 'conservação" sobre tudo o que passa, e ninguém nunca viu onde esse carvão vai parar. '
        + 'A carga de Ribeira tem 400 sacos.',
      abordagens: [
        { id: 'a1', texto: 'Calcular a taxa na frente dele e exigir o recibo da diferença.', atributo: 'razao', cd: 13,
          sucesso: 'Você diz o número antes dele terminar a conta. Haskel pisca duas vezes e escreve o recibo.',
          falha: 'Você hesita no cálculo e ele aproveita para arredondar a favor dele.' },
        { id: 'a2', texto: 'Perguntar, em voz alta, para onde vai o carvão da taxa.', atributo: 'firmeza', cd: 14,
          sucesso: 'A fila inteira para e olha. Haskel não tem resposta pronta, e silêncio diante de testemunha custa caro.',
          falha: 'Ele responde com um papel timbrado e a fila volta a andar. Você ficou de reclamão.' },
        { id: 'a3', texto: 'Conversar com os carregadores antes de enfrentar o fiscal.', atributo: 'harmonia', cd: 12,
          sucesso: 'Eles sabem de tudo há meses. Agora você tem nomes, datas e um galpão para citar.',
          falha: 'Ninguém quer perder o trabalho falando com estranho.' }
      ],
      pergunta: 'Se Haskel cobra 15% sobre 400 sacos, quantos sacos ele retém?',
      alternativas: [
        { id: 'a', texto: '40' }, { id: 'b', texto: '45' }, { id: 'c', texto: '60' }, { id: 'd', texto: '75' }
      ],
      respostaCorreta: 'c', xp: 45, ouro: 20
    },

    /* ---------- Cidade-Jardim: as estufas ---------- */
    {
      id: 'exemplo-jardim-1',
      territorioId: 'cidade-jardim',
      titulo: 'A Estufa Suspensa',
      npc: {
        nome: 'Dona Herme, a Semeadora',
        icone: '🌱',
        fala: 'Plantamos cevada nesses mesmos canteiros por nove anos seguidos porque cevada dá rápido. '
            + 'Agora o solo não devolve mais nada. Me diga o que fazer antes que eu plante cevada de novo.'
      },
      narrativa:
        'A estufa suspensa tem 18 metros por 12. Metade dos canteiros está morta, e a outra metade dá '
        + 'folhas pálidas que não alimentam ninguém. Lá fora, a neve encosta na vidraça. Dona Herme '
        + 'tem sementes de quatro culturas diferentes e não sabe se ainda dá tempo.',
      abordagens: [
        { id: 'a1', texto: 'Calcular a área útil e planejar a rotação por trechos.', atributo: 'razao', cd: 12,
          sucesso: 'Você mede, divide e marca o chão com giz. Herme reconhece o desenho: é o que ela tentou explicar por anos.',
          falha: 'A conta sai bonita no papel e impossível naquele solo.' },
        { id: 'a2', texto: 'Ler o solo: onde a terra ainda respira, replantar primeiro.', atributo: 'natureza', cd: 13,
          sucesso: 'Você ajoelha, aperta um punhado de terra e sabe. Começar pelo que ainda vive é o que salva a safra.',
          falha: 'A terra está exausta demais para dar sinal. Você planta no escuro.' },
        { id: 'a3', texto: 'Convocar o bairro para replantar em mutirão, cada família num trecho.', atributo: 'harmonia', cd: 11,
          sucesso: 'Vinte pessoas numa estufa fazem em uma tarde o que Herme faria em três semanas.',
          falha: 'Vêm poucos e desconfiados. Metade desiste antes do meio-dia.' }
      ],
      pergunta: 'Qual é a área total de uma estufa de 18 metros por 12 metros?',
      alternativas: [
        { id: 'a', texto: '30 m²' }, { id: 'b', texto: '108 m²' }, { id: 'c', texto: '216 m²' }, { id: 'd', texto: '240 m²' }
      ],
      respostaCorreta: 'c', xp: 40, ouro: 15
    },
    {
      id: 'exemplo-jardim-2',
      territorioId: 'cidade-jardim',
      titulo: 'A Conta do Ano que Vem',
      npc: {
        nome: 'Bran, jardineiro-chefe',
        icone: '🪴',
        fala: 'Tenho semente para plantar tudo hoje e comer bem até março. Ou planto dois terços e guardo '
            + 'o resto para replantar. Todo mundo está com fome agora. Decide você.'
      },
      narrativa:
        'Bran tem 90 sacas de semente e uma cidade com fome imediata. A tentação é plantar tudo: o '
        + 'inverno é agora, a primavera é hipótese. Mas quem plantou tudo nove anos seguidos foi '
        + 'exatamente quem matou as estufas.',
      abordagens: [
        { id: 'a1', texto: 'Mostrar a conta dos dois cenários, hoje e em um ano.', atributo: 'razao', cd: 13,
          sucesso: 'Dois números lado a lado valem mais que qualquer discurso. Bran olha e cala.',
          falha: 'Projeção de um ano não enche barriga hoje, e ele responde isso na sua cara.' },
        { id: 'a2', texto: 'Explicar o que o solo faz quando é usado sem descanso.', atributo: 'natureza', cd: 12,
          sucesso: 'Bran conhece o solo tanto quanto você. Faltava alguém dizer em voz alta o que ele já suspeitava.',
          falha: 'Ele já ouviu essa conversa antes — de quem não passa fome.' },
        { id: 'a3', texto: 'Propor que a decisão seja tomada pelo bairro, não por ele sozinho.', atributo: 'harmonia', cd: 14,
          sucesso: 'Dividir a decisão divide o peso. Ninguém mais pode culpar Bran, e por isso ele aceita.',
          falha: 'Assembleia com gente faminta não decide: grita.' }
      ],
      pergunta: 'Se Bran planta dois terços das 90 sacas e guarda o resto, quantas sacas ficam guardadas?',
      alternativas: [
        { id: 'a', texto: '20' }, { id: 'b', texto: '30' }, { id: 'c', texto: '45' }, { id: 'd', texto: '60' }
      ],
      respostaCorreta: 'b', xp: 45, ouro: 15
    },

    /* ---------- Salão da Justiça: o julgamento ---------- */
    {
      id: 'exemplo-justica-1',
      territorioId: 'salao-da-justica',
      titulo: 'A Defesa de Corvino',
      inimigo: {
        nome: 'Mestre Corvino',
        icone: '🪶',
        fala: 'Eu não roubei o Arquivo. Eu o protegi de uma cidade que trocava tratados de engenharia '
            + 'por lenha de inverno. Vocês me chamam de ladrão. Eu chamo o que faziam de desperdício. '
            + 'Qual de nós está errado?',
        golpe: 'Corvino vira seu próprio argumento contra você, e a plateia murmura concordando com ele.',
        dano: 3
      },
      narrativa:
        'O Salão está cheio. Corvino não está algemado, e isso incomoda. Ele é um homem magro de '
        + 'sessenta anos que passou a vida catalogando, e fala com a calma de quem já ensaiou. '
        + 'A Juíza Oren observa a turma mais do que observa o réu.',
      abordagens: [
        { id: 'a1', texto: 'Separar o que ele fez do que ele alega: o motivo não apaga o ato.', atributo: 'firmeza', cd: 15,
          sucesso: 'Você desmonta a confusão entre intenção e ato. Oren anota alguma coisa pela primeira vez.',
          falha: 'Você confunde as duas coisas junto com ele e o argumento se perde.' },
        { id: 'a2', texto: 'Apontar quem pagou a conta: mostrar a cidade sem o Arquivo.', atributo: 'harmonia', cd: 13,
          sucesso: 'Você fala dos nomes, não dos princípios. Metade da plateia conhece cada um deles.',
          falha: 'Emoção sem argumento vira lamento, e Corvino responde com estatística.' },
        { id: 'a3', texto: 'Mostrar que a tese dele se contradiz: ele também usou o Arquivo para decidir.', atributo: 'razao', cd: 16,
          sucesso: 'Se o conhecimento guardado não pode ser usado, como ele decidiu guardá-lo? Corvino não responde.',
          falha: 'A contradição existe, mas você a apresenta embolada e ela escapa.' }
      ],
      pergunta: 'Corvino trancou o Arquivo "para o bem da cidade", sem autorização de ninguém. Que princípio da justiça esse ato viola?',
      alternativas: [
        { id: 'a', texto: 'Nenhum, já que a intenção era boa' },
        { id: 'b', texto: 'O de que decisões que afetam todos precisam ser tomadas com todos' },
        { id: 'c', texto: 'O de que arquivos devem ficar sempre abertos, sem exceção' },
        { id: 'd', texto: 'O de que arquivistas não podem ter opinião' }
      ],
      respostaCorreta: 'b', xp: 55, ouro: 25
    },
    {
      id: 'exemplo-justica-2',
      territorioId: 'salao-da-justica',
      titulo: 'A Sentença',
      npc: {
        nome: 'Juíza Oren',
        icone: '⚖️',
        fala: 'Ele é culpado, isso já ficou claro. O que eu preciso de vocês é outra coisa: que pena '
            + 'devolve o Arquivo para a cidade sem transformar Corvino em mártir? Pensem antes de responder.'
      },
      narrativa:
        'O Salão esvaziou. Oren tirou a toga e serve chá numa sala pequena, atrás do tribunal. '
        + 'Ela não está testando o conhecimento de vocês sobre a lei — está testando se vocês entendem '
        + 'para que ela serve. Lá fora, a Fornalha ainda está baixa.',
      abordagens: [
        { id: 'a1', texto: 'Propor uma pena que repare: ele reabre e recataloga o Arquivo, sob supervisão.', atributo: 'firmeza', cd: 13,
          sucesso: 'Oren assente devagar. "Pena que conserta o estrago é mais difícil de odiar do que pena que só pune."',
          falha: 'Você propõe reparação sem supervisão e Oren pergunta quem garante o cumprimento.' },
        { id: 'a2', texto: 'Perguntar primeiro o que a cidade perdeu, e calcular a pena a partir disso.', atributo: 'razao', cd: 14,
          sucesso: 'Você mede o dano antes de medir o castigo. É exatamente a ordem que Oren esperava.',
          falha: 'A conta do dano é maior do que qualquer pena possível, e você trava nela.' },
        { id: 'a3', texto: 'Ouvir o que os bairros querem antes de propor qualquer coisa.', atributo: 'harmonia', cd: 12,
          sucesso: 'Três bairros, três respostas — e no meio delas, uma que serve para os três.',
          falha: 'Os três querem coisas incompatíveis e você volta a Oren sem nada.' }
      ],
      pergunta: 'Qual pena atende melhor ao objetivo de devolver o Arquivo à cidade?',
      alternativas: [
        { id: 'a', texto: 'Prisão longa, para servir de exemplo' },
        { id: 'b', texto: 'Perdão, já que a intenção era boa' },
        { id: 'c', texto: 'Obrigá-lo a reabrir e recatalogar o Arquivo sob supervisão pública' },
        { id: 'd', texto: 'Exílio imediato de Pedravasta' }
      ],
      respostaCorreta: 'c', xp: 55, ouro: 25
    }
  ]
};

/* ==========================================================================
   INSTALAÇÃO
   ========================================================================== */

/**
 * Cria a campanha de exemplo, instala os oito encontros e os quatro itens.
 * Os encontros ficam marcados com o id da campanha: eles só aparecem para
 * quem estiver jogando ESTA campanha, e somem se ela for apagada.
 *
 * @returns {object} a campanha criada
 */
function instalarCampanhaExemplo() {
  const modelo = CAMPANHA_EXEMPLO;

  // 1. A campanha (já entra como ativa).
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

  // 2. Os encontros, carimbados com a campanha a que pertencem.
  const quests = getQuestsCustomizadas()
    .filter(q => !String(q.id).startsWith('exemplo-')); // evita duplicar numa segunda instalação

  modelo.encontros.forEach(encontro => {
    quests.push(Object.assign({}, encontro, { campanhaId: campanha.id }));
  });
  localStorage.setItem(CHAVE_QUESTS_CUSTOM, JSON.stringify(quests));

  // 3. Os itens da loja.
  const itens = getItensCustomizados()
    .filter(i => !String(i.id).startsWith('exemplo-'));
  modelo.itens.forEach(item => itens.push(Object.assign({}, item)));
  localStorage.setItem('elarion_itens_customizados', JSON.stringify(itens));

  return campanha;
}
