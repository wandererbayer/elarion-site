/* ==========================================================================
   CRÔNICAS DE ELARION — campanha-avancada.js
   --------------------------------------------------------------------------
   "A Última Colheita de Aurélia" — a campanha de nível avançado, para
   Ensino Médio (15 a 17 anos).

   O que muda em relação às outras duas:

     - Conteúdo de Ensino Médio: média contra mediana, crescimento
       exponencial, amostragem e viés, probabilidade condicional,
       sistema com restrição, e leitura crítica de argumento.
     - Dificuldades de 13 a 18 (a iniciante vai de 9 a 12).
     - Inimigos custam 3 de Determinação.
     - Nenhum encontro tem resposta moralmente limpa. O desafio de
       conteúdo sempre tem uma resposta certa; a decisão que vem depois,
       não.

   O tema é o que torna esta campanha adequada a essa idade: Aurélia
   resolveu a fome com um sistema que decide quem recebe o quê. O sistema
   funciona. E decide a partir de dados históricos que carregam os
   preconceitos antigos da cidade — então a Ribeira sempre recebe menos,
   "porque estatisticamente desperdiça mais".

   Não há vilão. Há uma decisão que ninguém assume. É sobre isso que a
   turma vai discutir, e é por isso que a matemática importa aqui: sem
   entender média, amostra e taxa de erro, não dá para auditar nada.

   Referências de desenho: campanhas de nível alto de D&D, em que o
   antagonista tem um argumento defensável; e a postura do Daggerheart,
   em que a falha cobra um preço e empurra a história adiante.
   ========================================================================== */

const CAMPANHA_AVANCADA = {

  campanha: {
    nome: 'A Última Colheita de Aurélia',
    turma: '',
    nivel: 'avancada',
    faixaEtaria: '15 a 17 anos',
    titulo: 'A Última Colheita de Aurélia',

    prologo:
      'Há doze anos, Aurélia passava fome todo inverno. Hoje não passa mais.\n\n'
      + 'A diferença atende pelo nome de Compasso: um mecanismo de cálculo instalado sob o '
      + 'Salão, que recebe os números da cidade — colheita, nascimentos, consumo, dívidas — e '
      + 'devolve quanto cada bairro recebe de grão, água e crédito. Ele não se cansa, não aceita '
      + 'suborno e não tem parentes. Desde que foi ligado, ninguém morreu de fome em Aurélia.\n\n'
      + 'A Reitora Sélvia, que o construiu, repete isso em toda audiência. E tem razão.\n\n'
      + 'Só que a Ribeira recebe 18% menos que os outros bairros há doze anos seguidos. Quando '
      + 'perguntam o motivo, o Compasso responde o mesmo: "histórico de desperdício superior à '
      + 'média". Ninguém sabe de onde veio esse histórico. Ninguém, em doze anos, pediu para ver.\n\n'
      + 'Vocês foram nomeados auditores. Têm acesso aos registros, três semanas, e nenhuma '
      + 'autoridade para mudar nada — só para entender, e depois contar à cidade o que encontraram.',

    capitulos: {
      'vale-do-saber':
        'Os registros do Compasso ficam no Vale do Saber, em doze anos de livros que ninguém '
        + 'abriu desde que foram escritos. Auditar não é acusar: é ler com atenção o que já '
        + 'estava ali. E o primeiro problema aparece logo — os relatórios anuais falam em '
        + '"média", e média é a palavra mais fácil de usar para esconder uma distribuição.',

      'terras-unidas':
        'A Ribeira é onde o resultado do Compasso vira gente. Famílias classificadas como '
        + '"risco alto" pagam juros maiores e recebem menos crédito; e a classificação usa o '
        + 'bairro como um de seus critérios. O Compasso não foi programado para ter preconceito: '
        + 'foi alimentado com os números de uma cidade que já tinha, e aprendeu a repeti-lo com '
        + 'uma precisão que nenhum funcionário humano teria.',

      'cidade-jardim':
        'A seca de dois anos atrás obrigou o Compasso a racionar água. A conta que ele fez era '
        + 'correta e a cidade sobreviveu — mas os pomares da Ribeira secaram primeiro, e agora '
        + 'produzem menos, o que o Compasso registra como mais uma prova de que ali se produz '
        + 'pouco. O problema não é o cálculo de um ano: é o que acontece quando ele se repete.',

      'salao-da-justica':
        'A audiência pública acontece no Salão, e Sélvia vai se defender sozinha. Ela não vai '
        + 'negar os 18%, vai contextualizá-los — e o argumento dela é bom o bastante para '
        + 'convencer metade da sala. A pergunta que a turma precisa responder não é se o '
        + 'Compasso errou. É quem responde pelo erro de uma decisão que ninguém tomou.'
    },

    checkpoints: [
      { titulo: 'A nomeação', nota: 'Leia o prólogo. Antes de começar, pergunte à turma: um sistema que acerta 96% das vezes é justo? Guarde as respostas — você vai voltar a elas no fim.', concluido: false },
      { titulo: 'Os doze anos de registros', nota: 'Vale do Saber, encontros 1 e 2. Média contra mediana e crescimento exponencial. Se a turma entender o encontro 1, o resto da campanha se sustenta.', concluido: false },
      { titulo: 'A lista de risco', nota: 'Terras Unidas. Aqui aparece o conceito central: variável-proxy. O Compasso não pergunta o bairro para discriminar — pergunta porque o bairro prevê bem. É essa a armadilha.', concluido: false },
      { titulo: 'A água de dois anos atrás', nota: 'Cidade-Jardim. Mostre como uma decisão correta num ano vira injustiça acumulada em doze. Bom momento para um evento de mesa.', concluido: false },
      { titulo: 'A audiência', nota: 'Salão da Justiça. Leia a defesa de Sélvia inteira, sem interromper. Se metade da turma concordar com ela, você conduziu bem.', concluido: false },
      { titulo: 'O relatório', nota: 'Desfecho. A turma decide o que escrever no relatório final: desligar, corrigir, ou manter e publicar os dados. Peça um voto por aluno, com justificativa. Sem rolagem — só argumento.', concluido: false }
    ]
  },

  /* ============================================================
     ITENS — mais caros, e todos ligados ao trabalho de auditoria
     ============================================================ */
  itens: [
    {
      id: 'avancada-caderno-auditor', nome: 'Caderno do Auditor', icone: '📓', preco: 55,
      efeito: 'bonus-rolagem', valor: 3,
      descricao: 'Folhas pautadas e um lápis curto. Anotar antes de concluir vale +3 na próxima rolagem.'
    },
    {
      id: 'avancada-copia-registro', nome: 'Cópia de Registro', icone: '📄', preco: 70,
      efeito: 'eliminar-alternativa', valor: 1,
      descricao: 'Uma página copiada à mão do arquivo do Compasso. Elimina uma alternativa errada.'
    },
    {
      id: 'avancada-cafe-salao', nome: 'Café do Salão', icone: '☕', preco: 40,
      efeito: 'determinacao', valor: 4,
      descricao: 'Forte, amargo e servido de madrugada. Recupera 4 de Determinação.'
    },
    {
      id: 'avancada-testemunha', nome: 'Palavra de uma Testemunha', icone: '🗣️', preco: 95,
      efeito: 'vantagem', valor: 1,
      descricao: 'Alguém da Ribeira aceitou falar com você. Vantagem na próxima rolagem: dois dados, fica o melhor.'
    }
  ],

  /* ============================================================
     ENCONTROS
     ============================================================ */
  encontros: [

    /* ---------- Vale do Saber ---------- */
    {
      id: 'avancada-vale-1',
      territorioId: 'vale-do-saber',
      titulo: 'O Peso da Média',
      npc: {
        nome: 'Arquivista Noor',
        icone: '📊',
        fala: 'O relatório diz que a renda média da Ribeira subiu 20% no ano passado, e por isso '
            + 'o Compasso cortou o auxílio. Eu conferi os números: estão certos. Mas eu moro lá, '
            + 'e ninguém ficou 20% mais rico. Me explique como as duas coisas são verdade ao mesmo tempo.'
      },
      narrativa:
        'Noor abre o registro de rendas da Ribeira sobre a mesa: cem famílias, uma linha cada. '
        + 'Noventa e nove ganham entre 10 e 14 moedas por semana. Uma — a família que comprou o '
        + 'moinho — passou a ganhar 600.\n\n'
        + 'O relatório anual não mostra as cem linhas. Mostra uma só: a média.',
      abordagens: [
        { id: 'a1', texto: 'Calcular as duas medidas e colocá-las lado a lado no relatório.', atributo: 'razao', cd: 14,
          sucesso: 'Você escreve as duas na mesma página. Vistas juntas, a distância entre elas é o próprio argumento.',
          falha: 'Você calcula certo, mas apresenta só o número — e número sem comparação não convence ninguém.' },
        { id: 'a2', texto: 'Procurar na Ribeira as famílias por trás das linhas.', atributo: 'harmonia', cd: 15,
          sucesso: 'Quatro famílias contam a mesma história com palavras diferentes. Isso que a tabela não mostrava.',
          falha: 'Ninguém quer conversar com auditor. Auditor, na Ribeira, costuma vir cortar alguma coisa.' },
        { id: 'a3', texto: 'Exigir do Compasso o registro completo, linha por linha.', atributo: 'firmeza', cd: 17,
          sucesso: 'O pedido formal é negado duas vezes e aceito na terceira. As cem linhas saem impressas.',
          falha: 'O protocolo volta carimbado: "dado agregado é o formato oficial de divulgação".' }
      ],
      pergunta: 'Em 100 famílias, 99 ganham cerca de 12 moedas e uma ganha 600. Qual medida descreve melhor a renda típica da Ribeira?',
      alternativas: [
        { id: 'a', texto: 'A média, porque usa todos os valores' },
        { id: 'b', texto: 'A mediana, porque não é distorcida por um valor extremo' },
        { id: 'c', texto: 'A soma total, porque mostra a riqueza do bairro' },
        { id: 'd', texto: 'O maior valor, porque mostra o potencial do bairro' }
      ],
      respostaCorreta: 'b', xp: 55, ouro: 22
    },
    {
      id: 'avancada-vale-2',
      territorioId: 'vale-do-saber',
      titulo: 'A Curva que Dobra',
      inimigo: {
        nome: 'O Compasso',
        icone: '⚙️',
        fala: 'PROJEÇÃO ESTÁVEL. RESERVA SUFICIENTE PARA DOZE ANOS. NENHUMA AÇÃO RECOMENDADA. '
            + 'REPETIR CONSULTA EM 365 DIAS.',
        golpe: 'O Compasso devolve a mesma resposta pela quarta vez, e você perde uma tarde inteira discutindo com um mecanismo.',
        dano: 3
      },
      narrativa:
        'A reserva estratégica de Aurélia tem 6400 sacas. O consumo anual era de 25 sacas quando '
        + 'o Compasso foi ligado, e vem dobrando a cada ano desde então: 25, 50, 100, 200.\n\n'
        + 'O relatório do Compasso classifica a reserva como "suficiente para doze anos" — porque '
        + 'ele dividiu 6400 pelo consumo médio dos doze anos, e média de curva que dobra não '
        + 'descreve coisa nenhuma.',
      abordagens: [
        { id: 'a1', texto: 'Projetar ano a ano até a reserva acabar, sem usar média.', atributo: 'razao', cd: 16,
          sucesso: 'Você escreve a sequência na margem e o resultado aparece muito antes do que o relatório prometia.',
          falha: 'Você erra um termo no meio da sequência e a projeção inteira desanda.' },
        { id: 'a2', texto: 'Comparar a projeção do Compasso com os estoques reais do celeiro.', atributo: 'natureza', cd: 15,
          sucesso: 'O celeiro desmente o relatório: já está na metade do que o papel diz.',
          falha: 'O celeireiro não deixa conferir sem ordem escrita, e a ordem leva semanas.' },
        { id: 'a3', texto: 'Levar o problema direto a Sélvia, antes de ter certeza.', atributo: 'firmeza', cd: 18,
          sucesso: 'Ela escuta, pega o lápis e refaz a conta sozinha. O silêncio dela diz mais que qualquer resposta.',
          falha: 'Sem a conta pronta na mão, você soa alarmista — e perde a audiência que tinha.' }
      ],
      pergunta: 'Partindo de 25 sacas no primeiro ano e dobrando a cada ano, em qual ano o consumo ACUMULADO ultrapassa as 6400 sacas da reserva?',
      alternativas: [
        { id: 'a', texto: 'No 7º ano' }, { id: 'b', texto: 'No 9º ano' },
        { id: 'c', texto: 'No 12º ano' }, { id: 'd', texto: 'No 20º ano' }
      ],
      respostaCorreta: 'b', xp: 60, ouro: 25
    },

    /* ---------- Terras Unidas ---------- */
    {
      id: 'avancada-terras-1',
      territorioId: 'terras-unidas',
      titulo: 'A Lista de Risco',
      inimigo: {
        nome: 'Fiscais do Compasso',
        icone: '📋',
        fala: 'Não somos nós que decidimos. A lista chega pronta. Se a senhora acha que está '
            + 'errada, reclame com o Compasso — nós só cumprimos.',
        golpe: 'Os fiscais encerram o atendimento e remarcam para dali a três semanas.',
        dano: 3
      },
      narrativa:
        'Famílias classificadas como "risco alto" pagam juros maiores e recebem menos crédito. '
        + 'Você consegue a planilha de classificação e encontra os critérios: atraso em pagamentos, '
        + 'número de dependentes, tipo de ocupação — e bairro de residência.\n\n'
        + 'Morar na Ribeira soma pontos de risco. Não porque alguém programou preconceito, mas '
        + 'porque historicamente a Ribeira atrasou mais. E atrasou mais porque recebia menos.',
      abordagens: [
        { id: 'a1', texto: 'Comparar inadimplência dentro da Ribeira entre quem teve e quem não teve crédito.', atributo: 'razao', cd: 17,
          sucesso: 'Separados os dois grupos, o bairro deixa de explicar qualquer coisa. O que explica é o crédito que receberam antes.',
          falha: 'Os dois grupos saem com tamanhos muito diferentes e a comparação não se sustenta.' },
        { id: 'a2', texto: 'Reunir as famílias classificadas e levantar as histórias por trás dos atrasos.', atributo: 'harmonia', cd: 15,
          sucesso: 'Trinta pessoas numa sala, trinta razões diferentes — e nenhuma delas é "desperdício".',
          falha: 'Vêm poucas, e as que vêm têm medo de que reclamar piore a nota delas.' },
        { id: 'a3', texto: 'Cobrar dos fiscais quem assinou a decisão de incluir o bairro como critério.', atributo: 'firmeza', cd: 18,
          sucesso: 'Ninguém assinou. É isso que você precisava descobrir, e está por escrito.',
          falha: 'Cada fiscal aponta para o anterior, e a tarde acaba antes da fila de protocolos.' }
      ],
      pergunta: 'O bairro prevê bem a inadimplência porque o bairro recebeu menos crédito antes. Como se chama uma variável que entra no modelo representando outra coisa que ela não mede?',
      alternativas: [
        { id: 'a', texto: 'Variável-proxy, que carrega para o modelo a desigualdade já existente' },
        { id: 'b', texto: 'Variável aleatória, porque o resultado varia' },
        { id: 'c', texto: 'Variável irrelevante, que pode ser mantida sem efeito' },
        { id: 'd', texto: 'Variável independente, porque não depende das outras' }
      ],
      respostaCorreta: 'a', xp: 65, ouro: 26
    },
    {
      id: 'avancada-terras-2',
      territorioId: 'terras-unidas',
      titulo: 'A Amostra Torta',
      npc: {
        nome: 'Dalmo, do censo',
        icone: '📝',
        fala: 'A pesquisa que alimentou o Compasso foi feita de manhã, em dia útil, na porta das '
            + 'casas. Quem estava em casa de manhã num dia útil respondeu. Quem estava trabalhando, não. '
            + 'Eu levantei isso em 2014. Arquivaram.'
      },
      narrativa:
        'Dalmo guardou a cópia do protocolo da pesquisa original. Foram 2000 domicílios visitados '
        + 'e 500 respostas — e todas as 500 de pessoas que estavam em casa em horário comercial.\n\n'
        + 'O Compasso trata essas 500 respostas como retrato da cidade. Elas são retrato de um '
        + 'quarto dela, e justamente do quarto que trabalha menos fora de casa.',
      abordagens: [
        { id: 'a1', texto: 'Calcular a taxa de resposta e mostrar quem ficou de fora.', atributo: 'razao', cd: 15,
          sucesso: 'Uma fração simples desmonta doze anos de política pública. Dalmo ri sem alegria nenhuma.',
          falha: 'Você apresenta o número sem explicar o viés, e ele vira só mais uma estatística na pilha.' },
        { id: 'a2', texto: 'Refazer a pesquisa à noite, com voluntários da Ribeira.', atributo: 'harmonia', cd: 16,
          sucesso: 'As respostas noturnas contam outra cidade — e agora você tem as duas para comparar.',
          falha: 'Faltam voluntários e a nova amostra sai pequena demais para valer como prova.' },
        { id: 'a3', texto: 'Exigir que o protocolo arquivado em 2014 volte à pauta.', atributo: 'firmeza', cd: 17,
          sucesso: 'O protocolo é desarquivado. Doze anos depois, com a sua assinatura embaixo da dele.',
          falha: 'Pedido indeferido: "matéria já apreciada e encerrada".' }
      ],
      pergunta: 'De 2000 domicílios visitados, 500 responderam — todos em horário comercial. Qual é a taxa de resposta, e qual é o problema maior?',
      alternativas: [
        { id: 'a', texto: '25%, e o problema é só o tamanho pequeno da amostra' },
        { id: 'b', texto: '25%, e o problema maior é que quem respondeu não representa a população' },
        { id: 'c', texto: '40%, e a amostra é suficiente' },
        { id: 'd', texto: '75%, e não há problema algum' }
      ],
      respostaCorreta: 'b', xp: 60, ouro: 24
    },

    /* ---------- Cidade-Jardim ---------- */
    {
      id: 'avancada-jardim-1',
      territorioId: 'cidade-jardim',
      titulo: 'A Água Repartida',
      npc: {
        nome: 'Engenheira Rava',
        icone: '💧',
        fala: 'Na seca, sobraram 900 medidas de água por semana para três bairros. O Compasso '
            + 'distribuiu proporcionalmente ao que cada um produzia. A conta fecha. Me diga se a '
            + 'decisão estava certa.'
      },
      narrativa:
        'Rava desenha os números no quadro: o Alto produzia 50 unidades, o Centro 30, a Ribeira 20. '
        + 'O Compasso dividiu as 900 medidas nessa proporção, e assim protegeu a produção total '
        + 'da cidade. Aurélia atravessou a seca.\n\n'
        + 'Dois anos depois, os pomares da Ribeira produzem menos — e o Compasso lê essa queda '
        + 'como nova justificativa para dar menos água no próximo racionamento.',
      abordagens: [
        { id: 'a1', texto: 'Refazer a divisão e projetar o efeito dela dois anos à frente.', atributo: 'razao', cd: 16,
          sucesso: 'A conta de um ano estava certa. A de doze anos, repetida, é outra coisa — e agora está no papel.',
          falha: 'A projeção depende de premissas que você não consegue sustentar diante de Rava.' },
        { id: 'a2', texto: 'Ler o solo dos pomares da Ribeira e medir o dano real.', atributo: 'natureza', cd: 15,
          sucesso: 'As raízes contam a história toda: dois anos de sede não se recuperam numa estação.',
          falha: 'O solo está ruim, mas provar que foi a seca de dois anos atrás exige mais que uma visita.' },
        { id: 'a3', texto: 'Propor um piso mínimo por bairro, independente da produção.', atributo: 'harmonia', cd: 17,
          sucesso: 'Rava anota a proposta. "Isso custaria produção total. Mas é a primeira ideia nova em doze anos."',
          falha: 'Sem número que mostre o custo do piso, a proposta é lida como boa intenção e arquivada.' }
      ],
      pergunta: 'Dividindo 900 medidas proporcionalmente a 50, 30 e 20 unidades de produção, quanto recebe a Ribeira?',
      alternativas: [
        { id: 'a', texto: '150' }, { id: 'b', texto: '180' }, { id: 'c', texto: '200' }, { id: 'd', texto: '270' }
      ],
      respostaCorreta: 'b', xp: 55, ouro: 22
    },
    {
      id: 'avancada-jardim-2',
      territorioId: 'cidade-jardim',
      titulo: 'O Custo Adiado',
      npc: {
        nome: 'Mestre Olin, dos canais',
        icone: '🛠️',
        fala: 'Consertar o canal agora custa 400. Adiar custa 8% a mais por ano, composto. '
            + 'Todo ano o Compasso adia, porque todo ano tem coisa mais urgente. '
            + 'Faz nove anos que é assim.'
      },
      narrativa:
        'O canal da Cidade-Jardim vaza desde antes do Compasso. Cada ano o reparo é classificado '
        + 'como "não prioritário" — a decisão é correta dentro daquele ano, porque sempre há algo '
        + 'mais urgente.\n\n'
        + 'Olin guardou o orçamento de cada um dos nove anos. Lado a lado, eles mostram o que uma '
        + 'sequência de decisões corretas pode construir.',
      abordagens: [
        { id: 'a1', texto: 'Calcular o custo acumulado e comparar com o reparo original.', atributo: 'razao', cd: 16,
          sucesso: 'Os dois números na mesma linha encerram a discussão antes de ela começar.',
          falha: 'Você aplica juro simples onde era composto, e a conta sai menor do que a realidade.' },
        { id: 'a2', texto: 'Mostrar o estrago do vazamento no terreno ao redor.', atributo: 'natureza', cd: 15,
          sucesso: 'O que a planilha chamava de "não prioritário" tem metros quadrados de terra perdida.',
          falha: 'O terreno encharcado impressiona pouco quem lê relatório em gabinete.' },
        { id: 'a3', texto: 'Levar Olin para falar na próxima audiência, no lugar de você.', atributo: 'harmonia', cd: 14,
          sucesso: 'Nove anos de orçamentos na mão de quem conserta o canal valem mais que qualquer auditor.',
          falha: 'Olin não quer falar em público, e você não tem o direito de obrigá-lo.' }
      ],
      pergunta: 'Um reparo de 400 moedas encarece 8% ao ano, de forma composta. Depois de 9 anos de adiamento, o custo está mais próximo de:',
      alternativas: [
        { id: 'a', texto: '432 moedas' }, { id: 'b', texto: '688 moedas' },
        { id: 'c', texto: '800 moedas' }, { id: 'd', texto: '3600 moedas' }
      ],
      respostaCorreta: 'c', xp: 60, ouro: 24
    },

    /* ---------- Salão da Justiça ---------- */
    {
      id: 'avancada-justica-1',
      territorioId: 'salao-da-justica',
      titulo: 'A Defesa de Sélvia',
      inimigo: {
        nome: 'Reitora Sélvia',
        icone: '🏛️',
        fala: 'Antes do Compasso, Aurélia enterrava gente todo inverno. Depois dele, nenhuma. '
            + 'Vocês encontraram uma margem de erro de 4%. Eu encontrei uma cidade que não morre '
            + 'mais de fome. Qual dos dois números vocês querem defender diante dessas pessoas?',
        golpe: 'Sélvia devolve o seu próprio argumento invertido, e metade da sala se vira para olhar você.',
        dano: 3
      },
      narrativa:
        'O Salão está cheio. Sélvia fala sem papel, de pé, e não nega um único dado do relatório '
        + 'de vocês. Ela os aceita e os reposiciona: 4% de erro contra doze anos sem fome.\n\n'
        + 'O argumento é honesto no que afirma e desonesto no que omite — porque trata "manter o '
        + 'Compasso como está" e "voltar à fome" como se fossem as duas únicas opções possíveis.',
      abordagens: [
        { id: 'a1', texto: 'Nomear o problema do argumento: ele apresenta duas opções onde há mais.', atributo: 'razao', cd: 17,
          sucesso: 'Você diz em voz alta que existe uma terceira saída: corrigir. A sala inteira percebe o que faltava.',
          falha: 'Você tenta rebater os números dela e entra no terreno que ela domina.' },
        { id: 'a2', texto: 'Mostrar quem são os 4%, com nome e história.', atributo: 'harmonia', cd: 16,
          sucesso: 'Quatro por cento deixa de ser taxa quando tem nome. A plateia muda de postura.',
          falha: 'Sem dado ao lado do nome, soa como apelo emocional — e ela rebate com estatística.' },
        { id: 'a3', texto: 'Perguntar quem responde pelos 4% quando o erro acontece.', atributo: 'firmeza', cd: 18,
          sucesso: 'Sélvia abre a boca e não responde. É a primeira vez em doze anos que a pergunta é feita assim.',
          falha: 'Ela responde "a Reitoria responde" e a sala aceita, porque soa como resposta.' }
      ],
      pergunta: 'Sélvia coloca "manter o Compasso como está" contra "voltar à fome", ignorando a possibilidade de corrigi-lo. Que falha de argumentação é essa?',
      alternativas: [
        { id: 'a', texto: 'Falso dilema: apresenta duas alternativas como se fossem as únicas' },
        { id: 'b', texto: 'Ataque pessoal: desqualifica quem fala em vez do argumento' },
        { id: 'c', texto: 'Apelo à autoridade: usa o próprio cargo como prova' },
        { id: 'd', texto: 'Generalização apressada: conclui a partir de poucos casos' }
      ],
      respostaCorreta: 'a', xp: 70, ouro: 30
    },
    {
      id: 'avancada-justica-2',
      territorioId: 'salao-da-justica',
      titulo: 'Quem Responde pelo Compasso',
      npc: {
        nome: 'Juíza Oren',
        icone: '⚖️',
        fala: 'O relatório de vocês está correto, e isso é o mais fácil. Agora a parte difícil: '
            + 'uma decisão que nenhuma pessoa tomou ainda precisa de alguém que responda por ela. '
            + 'Quem vai ser, e com qual poder?'
      },
      narrativa:
        'A audiência terminou. Oren recebe vocês numa sala pequena, com o relatório marcado em '
        + 'três cores. Ela não está testando o que vocês sabem de estatística — está perguntando '
        + 'o que fazer com o que descobriram.\n\n'
        + 'Desligar o Compasso devolve a decisão a pessoas, com todos os defeitos que levaram à '
        + 'fome. Mantê-lo sem mudar nada conserva os 18%. As duas saídas fáceis são ruins.',
      abordagens: [
        { id: 'a1', texto: 'Propor auditoria pública periódica, com os dados abertos à cidade.', atributo: 'firmeza', cd: 17,
          sucesso: 'Oren anota devagar. "Regra que pode ser conferida por qualquer um é mais difícil de capturar."',
          falha: 'Você propõe auditoria sem dizer quem a faz nem com que frequência, e vira carta de intenções.' },
        { id: 'a2', texto: 'Propor que decisões sobre pessoas tenham revisão humana obrigatória.', atributo: 'harmonia', cd: 16,
          sucesso: 'Cada negativa passa a exigir um nome embaixo. Lento, caro — e responsável.',
          falha: 'Sem definir quais decisões, a revisão humana trava a cidade inteira e a proposta cai.' },
        { id: 'a3', texto: 'Propor retirar o bairro dos critérios e medir o efeito por um ano.', atributo: 'razao', cd: 18,
          sucesso: 'Mudança pequena, efeito mensurável, prazo definido. Oren chama isso de "proposta que sobrevive à política".',
          falha: 'Tirar uma variável sem prever o que entra no lugar dela deixa o modelo pior que antes.' }
      ],
      pergunta: 'Qual proposta responde melhor ao problema encontrado — um sistema que decide sobre pessoas sem que ninguém responda por isso?',
      alternativas: [
        { id: 'a', texto: 'Desligar o Compasso e voltar à decisão humana sem critérios escritos' },
        { id: 'b', texto: 'Manter tudo como está, já que o erro é de apenas 4%' },
        { id: 'c', texto: 'Abrir os dados à auditoria pública e exigir revisão humana nas decisões sobre pessoas' },
        { id: 'd', texto: 'Substituir o Compasso por outro mecanismo igual, de fabricante diferente' }
      ],
      respostaCorreta: 'c', xp: 75, ouro: 32
    }
  ]
};

/* ==========================================================================
   INSTALAÇÃO
   ========================================================================== */

/**
 * Cria a campanha avançada com os oito encontros e os quatro itens.
 * Mesma mecânica das outras duas (ver campanha-exemplo.js).
 *
 * @returns {object} a campanha criada
 */
function instalarCampanhaAvancada() {
  const modelo = CAMPANHA_AVANCADA;

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
    .filter(q => !String(q.id).startsWith('avancada-'));
  modelo.encontros.forEach(encontro => {
    quests.push(Object.assign({}, encontro, { campanhaId: campanha.id }));
  });
  localStorage.setItem(CHAVE_QUESTS_CUSTOM, JSON.stringify(quests));

  const itens = getItensCustomizados()
    .filter(i => !String(i.id).startsWith('avancada-'));
  modelo.itens.forEach(item => itens.push(Object.assign({}, item)));
  localStorage.setItem('elarion_itens_customizados', JSON.stringify(itens));

  return campanha;
}
