/* ==========================================================================
   CRÔNICAS DE ELARION — Backend gratuito (Google Apps Script)
   --------------------------------------------------------------------------
   Este script transforma a planilha "ElarionDatabase" em um mini-banco de
   dados para o site estático (GitHub Pages), sem custo nenhum.

   COMO INSTALAR (5 passos, uma vez só):
     1. Abra a planilha ElarionDatabase.
     2. Menu  Extensões > Apps Script.
     3. Apague o conteúdo do arquivo e cole TODO este arquivo.
     4. Salve, depois clique em  Implantar > Nova implantação:
          Tipo .............. Aplicativo da Web
          Executar como ..... Eu
          Quem tem acesso ... Qualquer pessoa
     5. Copie a URL gerada (…/exec) e cole em js/core.js,
        na constante GOOGLE_SHEETS_URL.

   As abas (Acessos, Quests, Progresso, Feedback) são criadas
   automaticamente com cabeçalho na primeira vez que forem usadas —
   não é preciso montar nada à mão na planilha.
   ========================================================================== */

/* Versão deste arquivo. Serve para conferir se a implantação do Web App
   está servindo o código atual: abra a URL /exec?tipo=versao no navegador.
   Se o número vier diferente do que está aqui, a implantação está velha —
   vá em Implantar > Gerenciar implantações > editar (lápis) > Versão:
   "Nova versão" > Implantar. Salvar o código NÃO atualiza o Web App. */
var VERSAO = '2026-10-21a';

var PLANILHA_ID = '1mXuGu9zMVaZJsOGvKOw1v_MRV4YUUWAwV-14QX_zA6Y';

/* Cabeçalho de cada aba. A chave é o nome da aba. */
var ABAS = {
  Acessos:   ['Data', 'Nome', 'Turma', 'Papel', 'ID da campanha'],
  Quests:    ['Data', 'ID', 'Território', 'Título', 'Pergunta', 'Alternativas', 'Resposta correta'],
  Progresso: ['Data', 'Nome', 'Turma', 'Campanha', 'ID da campanha', 'Nível', 'XP', 'Ouro', 'Determinação', 'Inspiração', 'Encontros', 'Insígnias'],
  Feedback:  ['Data', 'Nome', 'Turma', 'Papel', 'Nota', 'Comentário', 'Escola'],
  Campanha:  ['Data', 'ID', 'Nome', 'Turma', 'Título', 'Prólogo', 'Capítulos',
              'Nível', 'Faixa etária', 'Checkpoints', 'Atualizada em'],
  Itens:     ['Data', 'Nome', 'Efeito', 'Valor', 'Preço', 'Descrição']
};

/** Devolve a aba pedida, criando-a com cabeçalho se ainda não existir. */
function pegarAba(nome) {
  var planilha = SpreadsheetApp.openById(PLANILHA_ID);
  var aba = planilha.getSheetByName(nome);
  if (!aba) {
    aba = planilha.insertSheet(nome);
    var cabecalho = ABAS[nome] || ['Data', 'Dados'];
    aba.appendRow(cabecalho);
    aba.getRange(1, 1, 1, cabecalho.length)
       .setFontWeight('bold')
       .setBackground('#161D2B')
       .setFontColor('#C9A227');
    aba.setFrozenRows(1);
  }
  return aba;
}

/* ==========================================================================
   GRAVAÇÃO — chamada pelo site via POST (registrarNoGoogleSheets em core.js)
   ========================================================================== */
function doPost(e) {
  try {
    var corpo = JSON.parse(e.postData.contents);
    var tipo = String(corpo.tipo || '').toLowerCase();
    var d = corpo.dados || {};
    var agora = corpo.data || new Date().toISOString();

    if (tipo === 'acesso') {
      pegarAba('Acessos').appendRow([agora, d.nome || '', d.turma || '', d.papel || '', d.campanhaId || '']);

    } else if (tipo === 'quest') {
      var alternativas = (d.alternativas || [])
        .map(function (a) { return a.id + ') ' + a.texto; })
        .join(' | ');
      pegarAba('Quests').appendRow([
        agora, d.id || '', d.territorioId || '', d.titulo || '',
        d.pergunta || '', alternativas, d.respostaCorreta || ''
      ]);

    } else if (tipo === 'progresso') {
      pegarAba('Progresso').appendRow([
        agora, d.nome || '', d.turma || '', d.campanha || '', d.campanhaId || '',
        d.nivel || '', d.xp || 0, d.ouro || 0, d.determinacao, d.inspiracao,
        (d.missoesConcluidas || []).length, (d.badges || []).join(', ')
      ]);

    } else if (tipo === 'campanha') {
      pegarAba('Campanha').appendRow([
        agora, d.id || '', d.nome || '', d.turma || '',
        d.titulo || '', d.prologo || '', JSON.stringify(d.capitulos || {}),
        d.nivel || '', d.faixaEtaria || '',
        JSON.stringify(d.checkpoints || []), d.atualizadaEm || agora
      ]);

    } else if (tipo === 'item') {
      pegarAba('Itens').appendRow([
        agora, d.nome || '', d.efeito || '', d.valor || '', d.preco || '', d.descricao || ''
      ]);

    } else if (tipo === 'feedback') {
      pegarAba('Feedback').appendRow([
        agora, d.nome || '', d.turma || '', d.papel || '', d.nota || '',
        d.texto || d.mensagem || '', d.escola || ''
      ]);

    } else {
      // Tipo novo: cria uma aba com esse nome e guarda o JSON cru,
      // assim o site pode mandar novos tipos sem mexer neste script.
      var nomeAba = tipo.charAt(0).toUpperCase() + tipo.slice(1);
      pegarAba(nomeAba).appendRow([agora, JSON.stringify(d)]);
    }

    return responder({ ok: true });
  } catch (erro) {
    return responder({ ok: false, erro: String(erro) });
  }
}

/* ==========================================================================
   LEITURA — chamada pelo painel do mestre (lerDoGoogleSheets em core.js)
   Exemplos:  ...exec?tipo=alunos   ...exec?tipo=quests
   ========================================================================== */
function doGet(e) {
  try {
    var tipo = String((e && e.parameter && e.parameter.tipo) || 'alunos').toLowerCase();

    if (tipo === 'versao') {
      return responder({ versao: VERSAO, abas: Object.keys(ABAS) });
    }

    if (tipo === 'alunos' || tipo === 'acessos') {
      // Agrupa os acessos por aluno, mantendo o acesso mais recente de cada um.
      var linhas = lerLinhas('Acessos');
      var porAluno = {};
      linhas.forEach(function (l) {
        var chave = (l[1] || '') + '|' + (l[2] || '');
        porAluno[chave] = { nome: l[1] || '', turma: l[2] || '', acesso: formatarData(l[0]),
                            papel: l[3] || '', campanhaId: l[4] || '' };
      });
      return responder(Object.keys(porAluno).map(function (k) { return porAluno[k]; }));
    }

    if (tipo === 'feedbacks') {
      /* Só as avaliações de 4 ou 5 estrelas, e SEM nome nem turma: este
         endereço é público (acesso "qualquer pessoa"), então devolve
         apenas o que a tela inicial pode mostrar. Os nomes continuam
         na planilha, visíveis só para quem tem acesso a ela. */
      return responder(lerLinhas('Feedback')
        .filter(function (l) { return Number(l[4]) >= 4; })
        .map(function (l) {
          return { data: formatarData(l[0]), nota: Number(l[4]),
                   texto: l[5], escola: l[6] || '' };
        }));
    }

    if (tipo === 'campanhas' || tipo === 'campanha') {
      /* Uma linha por SALVAMENTO: a mesma campanha aparece várias vezes.
         Guardamos só a última de cada ID — é o estado atual dela.
         É isto que faz a campanha do professor chegar ao navegador do aluno. */
      var porId = {};
      lerLinhas('Campanha').forEach(function (l) {
        var id = String(l[1] || '').trim();
        /* Linhas gravadas antes desta versão têm o Título na coluna B, não o
           ID. Exigir o formato "camp-<número>" descarta essas sobras sem
           precisar limpar a aba à mão. */
        if (!/^camp-\d+$/.test(id)) return;
        porId[id] = {
          id: id,
          nome: l[2] || '',
          turma: l[3] || '',
          titulo: l[4] || '',
          prologo: l[5] || '',
          capitulos: decodificar(l[6], {}),
          nivel: l[7] || '',
          faixaEtaria: l[8] || '',
          checkpoints: decodificar(l[9], []),
          atualizadaEm: l[10] ? String(l[10]) : ''
        };
      });
      return responder(Object.keys(porId).map(function (k) { return porId[k]; }));
    }

    if (tipo === 'quests') {
      return responder(lerLinhas('Quests').map(function (l) {
        return { data: formatarData(l[0]), id: l[1], territorioId: l[2], titulo: l[3],
                 pergunta: l[4], alternativas: l[5], respostaCorreta: l[6] };
      }));
    }

    if (tipo === 'progresso') {
      return responder(lerLinhas('Progresso').map(function (l) {
        return { data: formatarData(l[0]), nome: l[1], turma: l[2],
                 campanha: l[3], campanhaId: l[4], nivel: l[5],
                 xp: l[6], ouro: l[7], determinacao: l[8], inspiracao: l[9],
                 missoes: l[10], badges: l[11] };
      }));
    }

    return responder([]);
  } catch (erro) {
    return responder({ ok: false, erro: String(erro) });
  }
}

/* ==========================================================================
   AUXILIARES
   ========================================================================== */

/** Todas as linhas de uma aba, sem o cabeçalho. */
function lerLinhas(nomeAba) {
  var aba = pegarAba(nomeAba);
  var ultima = aba.getLastRow();
  if (ultima < 2) return [];
  return aba.getRange(2, 1, ultima - 1, aba.getLastColumn()).getValues();
}

/** JSON guardado em célula -> objeto. Célula vazia ou quebrada vira o padrão. */
function decodificar(valor, padrao) {
  if (valor === '' || valor === null || valor === undefined) return padrao;
  try { return JSON.parse(String(valor)); } catch (erro) { return padrao; }
}

/** Converte a data para o formato brasileiro curto (dd/mm hh:mm). */
function formatarData(valor) {
  if (!valor) return '—';
  var data = (valor instanceof Date) ? valor : new Date(valor);
  if (isNaN(data.getTime())) return String(valor);
  return Utilities.formatDate(data, 'America/Sao_Paulo', 'dd/MM HH:mm');
}

/** Resposta JSON padrão do Web App. */
function responder(objeto) {
  return ContentService
    .createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Corrige o cabeçalho de uma aba que JÁ EXISTE.
 *
 * pegarAba() só escreve o cabeçalho quando cria a aba. Então, quando este
 * script ganha colunas novas (foi o caso de Papel, Nota e Escola em
 * Feedback), as abas antigas continuam com o cabeçalho velho. Esta função
 * reescreve a primeira linha conforme a lista em ABAS.
 *
 * Os dados já gravados NÃO são movidos de coluna: se houver linhas antigas
 * em ordem diferente, elas ficam desalinhadas e o log avisa.
 */
function atualizarCabecalho(nome) {
  var cabecalho = ABAS[nome];
  if (!cabecalho) return;

  var aba = pegarAba(nome);
  var colunasAtuais = aba.getLastColumn();
  var atual = colunasAtuais ? aba.getRange(1, 1, 1, colunasAtuais).getValues()[0] : [];

  if (atual.join('|') === cabecalho.join('|')) return; // já está certo

  aba.getRange(1, 1, 1, cabecalho.length).setValues([cabecalho]);
  aba.getRange(1, 1, 1, cabecalho.length)
     .setFontWeight('bold')
     .setBackground('#161D2B')
     .setFontColor('#C9A227');
  aba.setFrozenRows(1);

  // Sobrou coluna do cabeçalho antigo à direita? Limpa o título dela.
  if (colunasAtuais > cabecalho.length) {
    aba.getRange(1, cabecalho.length + 1, 1, colunasAtuais - cabecalho.length).clearContent();
  }

  Logger.log('Cabeçalho de "' + nome + '" atualizado: ' + cabecalho.join(', ')
           + (aba.getLastRow() > 1 ? '  (ATENÇÃO: há linhas antigas que podem estar desalinhadas)' : ''));
}

/**
 * Rode esta função no editor (botão ▶) sempre que atualizar este script:
 * ela cria as abas que faltam e corrige o cabeçalho das que já existem.
 */
function prepararPlanilha() {
  Object.keys(ABAS).forEach(function (nome) {
    pegarAba(nome);
    atualizarCabecalho(nome);
  });
  Logger.log('Abas prontas: ' + Object.keys(ABAS).join(', '));
}
