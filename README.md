# Crônicas de Elarion — RPG Educativo Digital

Site estático (HTML + CSS + JavaScript puro) de um RPG educativo para aprender
lógica, matemática e valores de cidadania/sustentabilidade. Não depende de
nenhum servidor pago: roda inteiro no navegador, usando `localStorage` para
guardar o progresso de cada jogador e, opcionalmente, o Google Sheets como
"banco de dados" gratuito para registrar acessos e quests criadas por professores.

## Estrutura do projeto

```
index.html         → Landing page (apresentação do projeto)
login.html          → Escolha de papel (Aluno/Mestre) + nome + turma
personagem.html     → Criação de personagem (classe + atributos)
mapa.html            → Mapa de Elarion (4 territórios)
missao.html           → Tela de missão/desafio + rolagem de dados
resultado.html         → Resultado da missão (XP/ouro ganhos)
perfil.html              → Perfil do personagem (nível, atributos, badges)
final.html                → Tela de conclusão da jornada
mestre.html                → Painel do professor (alunos + criar quests)
mesa-mestre.html             → Mesa ao vivo do mestre (d20 + sorteio de aluno)
codex.html                    → Diário de lore do jogo

css/style.css        → Todo o visual do site (cores, componentes, responsivo)
js/dados-jogo.js      → Banco de dados do jogo (classes, territórios, quests, badges)
js/core.js             → Motor do jogo (estado, rolagem de dados, Google Sheets)
assets/imagens/         → Onde colocar imagens reais (veja LEIA-ME.txt lá dentro)
```

## Como testar localmente

Basta abrir `index.html` no navegador — não precisa de instalação nem servidor.
(Alguns navegadores bloqueiam `fetch` em arquivos abertos direto do disco;
se isso acontecer, rode um servidor simples: `python3 -m http.server` dentro
da pasta do projeto e acesse `http://localhost:8000`.)

## Como publicar de graça no GitHub Pages

1. Crie um repositório novo no GitHub e suba todos os arquivos desta pasta
   (mantendo a estrutura de pastas `css/`, `js/`, `assets/`).
2. No repositório, vá em **Settings → Pages**.
3. Em "Source", selecione a branch `main` e a pasta `/ (root)`.
4. Salve. Em alguns minutos o site estará no ar em
   `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

## Contas de acesso

| Papel | Usuário | Senha | O que abre |
|---|---|---|---|
| Aluno | `admin` | `admin` | Entra com um personagem já avançado (nível 2, 3 missões feitas, 1 badge) para ver Mapa, Perfil, Códex e Final preenchidos |
| Professor | `admin` | `admin` | Painel do Mestre e Mesa ao Vivo |
| Qualquer aluno | nome livre | (em branco) | Fluxo normal: cria personagem do zero |

A senha só é exigida para o usuário `admin`. Alunos comuns continuam entrando
só com nome e código da turma (o jogo não tem servidor de autenticação).

## Como configurar o Google Sheets como backend gratuito

A planilha **ElarionDatabase** já existe:
`https://docs.google.com/spreadsheets/d/1mXuGu9zMVaZJsOGvKOw1v_MRV4YUUWAwV-14QX_zA6Y/edit`

O jogo funciona totalmente sem isso (tudo fica salvo no navegador do aluno).
O Sheets serve para o professor ver acessos e quests em um só lugar — e gera a
evidência de "fluxo de dados" pedida na entrega da Atividade Extensionista.

1. Abra a planilha → menu **Extensões → Apps Script**.
2. Apague o código de exemplo e cole todo o conteúdo de `apps-script/Codigo.gs`.
3. Salve e rode uma vez a função `prepararPlanilha` (botão ▶) para autorizar o
   script e criar as abas **Acessos, Quests, Progresso e Feedback** com cabeçalho.
4. **Implantar → Nova implantação**: tipo "Aplicativo da Web", executar como "Eu",
   acesso "Qualquer pessoa".
5. Copie a URL gerada (`https://script.google.com/macros/s/XXXXX/exec`) e cole em
   `js/core.js`, na constante `GOOGLE_SHEETS_URL` (topo da seção 5).

A partir daí: cada login de aluno e cada quest criada pelo professor são gravados
na planilha (POST), e o Painel do Mestre passa a listar os alunos reais lidos de lá
(GET `?tipo=alunos`). Sem a URL configurada, o painel mostra dados de exemplo e
avisa isso na tela.

## Como adicionar mais perguntas/quests

Abra `js/dados-jogo.js` e copie um objeto dentro da lista `QUESTS`, trocando
os valores (território, narrativa, pergunta, alternativas, resposta certa).
Não é preciso mexer em nenhum outro arquivo — a tela de missão lê essa lista
automaticamente. Professores também podem criar quests pela própria interface,
em `mestre.html`.

## O sistema de dados (por que existe)

Toda vez que o aluno acerta uma pergunta, o jogo pede uma rolagem de d20
(estilo D&D): o valor sorteado + o modificador do atributo da classe do
personagem é comparado com a "Dificuldade" (CD) da missão. Isso transforma
"responder certo" em uma ação de RPG de verdade — com chance de sucesso
total, parcial ou crítico — mantendo a aprendizagem (quem acerta sempre
ganha XP) e o clima de jogo de mesa ao mesmo tempo.
