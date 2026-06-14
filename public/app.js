// ESTADO GLOBAL DA APLICACÃO
let matches = [];
let selectedMatch = null;
let currentSelections = [];
let teamsList = [];
let selectedDate = 'today'; // Filtro de data
let tickets = [
  { selections: [], stake: 10.00, type: 'criar_aposta', status: 'ganho', useCredits: false },
  { selections: [], stake: 10.00, type: 'criar_aposta', status: 'ganho', useCredits: false },
  { selections: [], stake: 10.00, type: 'criar_aposta', status: 'ganho', useCredits: false },
  { selections: [], stake: 10.00, type: 'criar_aposta', status: 'ganho', useCredits: false }
];
let activeTicketIndex = 0;

// Mapeamento de bandeiras/emojis dos times
const teamEmojis = {
  "Brasil": "🇧🇷", "Panamá": "🇵🇦", "México": "🇲🇽", "África do Sul": "🇿🇦",
  "Coreia do Sul": "🇰🇷", "Tchéquia": "🇨🇿", "Canadá": "🇨🇦", "Bolívia": "🇧🇴",
  "Escócia": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "Inglaterra": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Nova Zelândia": "🇳🇿", "Argentina": "🇦🇷",
  "França": "🇫🇷", "Espanha": "🇪🇸", "Portugal": "🇵🇹", "Alemanha": "🇩🇪",
  "Uruguai": "🇺🇾", "Bélgica": "🇧🇪", "Holanda": "🇳🇱", "Croácia": "🇭🇷",
  "Colômbia": "🇨🇴", "Marrocos": "🇲🇦", "Haiti": "🇭🇹", "Catar": "🇶🇦",
  "Suíça": "🇨🇭", "Austrália": "🇦🇺", "Turquia": "🇹🇷", "Curaçao": "🇨🇼",
  "Japão": "🇯🇵", "Costa do Marfim": "🇨🇮", "Equador": "🇪🇨", "Suécia": "🇸🇪",
  "Tunísia": "🇹🇳", "Cabo Verde": "🇨🇻", "Egito": "🇪🇬", "Arábia Saudita": "🇸🇦",
  "Irã": "🇮🇷", "Senegal": "🇸🇳", "Iraque": "🇮🇶", "Noruega": "🇳🇴",
  "Argélia": "🇩🇿", "Áustria": "🇦🇹", "Jordânia": "🇯🇴", "RD Congo": "🇨🇩",
  "Uzbequistão": "🇺🇿", "Estados Unidos": "🇺🇸", "Paraguai": "🇵🇾", "Gana": "🇬🇭",
  "Flamengo": "🔴", "Palmeiras": "🟢", "Real Madrid": "⚪", "Barcelona": "🔵🔴",
  "Manchester City": "🔵", "Liverpool": "🔴", "Arsenal": "🔴⚪", "Chelsea": "🔵",
  "Tottenham": "⚪", "Newcastle": "⚫⚪", "Aston Villa": "🟤", "West Ham": "🟤",
  "Bournemouth": "🔴⚫", "Brighton": "🔵⚪", "Crystal Palace": "🔴🔵",
  "Nottingham": "🔴", "Brentford": "🔴⚪", "Fulham": "⚪",
  "Inter Milão": "🔵⚫", "Juventus": "⚫⚪", "Napoli": "🔵", "Roma": "🟡🔴",
  "Lazio": "🔵⚪", "Atalanta": "🔵⚫", "Fiorentina": "🟣",
  "Bayern Munich": "🔴", "Borussia Dortmund": "🟡⚫", "RB Leipzig": "🔴⚪",
  "Bayer Leverkusen": "🔴⚫", "Eintracht Frankfurt": "⚫🔴", "VfB Stuttgart": "🔴⚪",
  "PSG": "🔵🔴", "Monaco": "🔴⚪", "Lyon": "🔵⚪", "Lille": "🔴⚪", "Nice": "🔴⚫",
  "São Paulo": "⚪🔴⚫", "Corinthians": "⚫⚪", "Botafogo": "⚫⚪", "Fluminense": "🟢🔴⚪",
  "Atlético-MG": "⚫⚪", "Cruzeiro": "🔵⚪", "Grêmio": "🔵⚪⚫", "Internacional": "🔴⚪",
  "Bahia": "🔵🔴⚪", "Vasco": "⚫⚪"
};

// DOM Elements
const matchesListEl = document.getElementById('matchesList');
const sectionCustomizeEl = document.getElementById('sectionCustomize');
const selectionsListContainerEl = document.getElementById('selectionsListContainer');
const btnAddSelectionEl = document.getElementById('btnAddSelection');
const btnAutoGenerateEl = document.getElementById('btnAutoGenerate');
const btnDownloadImageEl = document.getElementById('btnDownloadImage');
const btnCustomMatchEl = document.getElementById('btnCustomMatch');

// Inputs
const inputLeague = document.getElementById('inputLeague');
const inputHomeTeam = document.getElementById('inputHomeTeam');
const inputAwayTeam = document.getElementById('inputAwayTeam');
const inputScore = document.getElementById('inputScore');
const inputTimeElapsed = document.getElementById('inputTimeElapsed');
const inputPossession = document.getElementById('inputPossession');
const inputStake = document.getElementById('inputStake');
const inputType = document.getElementById('inputType');
const inputStatus = document.getElementById('inputStatus');
const inputUseCredits = document.getElementById('inputUseCredits');

// Telegram Inputs
const telegramBotTokenInput = document.getElementById('telegramBotToken');
const telegramChatIdInput = document.getElementById('telegramChatId');
const telegramMessageTextInput = document.getElementById('telegramMessageText');
const btnCopyMessageEl = document.getElementById('btnCopyMessage');
const btnSendTelegramEl = document.getElementById('btnSendTelegram');
const telegramStatusEl = document.getElementById('telegramStatus');

// Ticket Elements (Preview)
const ticketHeaderStake = document.getElementById('ticketHeaderStake');
const betGroupTitle = document.getElementById('betGroupTitle');
const betGroupOdd = document.getElementById('betGroupOdd');
const ticketSelectionsList = document.getElementById('ticketSelectionsList');
const homeFlag = document.getElementById('homeFlag');
const homeName = document.getElementById('homeName');
const homeScore = document.getElementById('homeScore');
const awayFlag = document.getElementById('awayFlag');
const awayName = document.getElementById('awayName');
const awayScore = document.getElementById('awayScore');
const possessionText = document.getElementById('possessionText');
const matchTimeText = document.getElementById('matchTimeText');
const footerStake = document.getElementById('footerStake');
const footerCreditsLabel = document.getElementById('footerCreditsLabel');
const footerReturnLabel = document.getElementById('footerReturnLabel');
const footerReturnValue = document.getElementById('footerReturnValue');
const ticketActionButton = document.getElementById('ticketActionButton');

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', async () => {
  // Carregar credenciais salvas do Telegram no localStorage (facilita para o usuário)
  if (localStorage.getItem('tg_bot_token')) {
    telegramBotTokenInput.value = localStorage.getItem('tg_bot_token');
  }
  if (localStorage.getItem('tg_chat_id')) {
    telegramChatIdInput.value = localStorage.getItem('tg_chat_id');
  }

  // Configurar listeners para abas de múltiplos bilhetes
  const tabButtons = document.querySelectorAll('#ticketTabs .tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.getAttribute('data-index'));
      switchActiveTicket(idx);
    });
  });

  // Carregar jogos e times
  await fetchTeams();
  await fetchMatches();

  // Event Listeners para atualizações em tempo real dos inputs
  const inputsToWatch = [
    inputLeague, inputHomeTeam, inputAwayTeam, inputScore,
    inputTimeElapsed, inputPossession, inputStake, inputType,
    inputStatus, inputUseCredits
  ];
  inputsToWatch.forEach(input => {
    input.addEventListener('input', () => {
      saveActiveTicketState();
      updateTicketPreview();
    });
  });

  btnAddSelectionEl.addEventListener('click', () => {
    addSelectionRow();
    saveActiveTicketState();
  });
  btnAutoGenerateEl.addEventListener('click', () => autoGenerateSelections(true));
  btnDownloadImageEl.addEventListener('click', downloadTicketImage);
  btnCustomMatchEl.addEventListener('click', setupCustomMatch);
  btnCopyMessageEl.addEventListener('click', copyTelegramMessage);
  btnSendTelegramEl.addEventListener('click', sendToTelegram);

  // FILTRO DE DATA
  const dateFilterEl = document.getElementById('dateFilter');
  if (dateFilterEl) {
    dateFilterEl.addEventListener('click', (e) => {
      if (e.target.classList.contains('date-btn')) {
        // Remover active de todos
        dateFilterEl.querySelectorAll('.date-btn').forEach(btn => btn.classList.remove('active'));
        // Adicionar active no clicado
        e.target.classList.add('active');
        // Atualizar filtro
        selectedDate = e.target.getAttribute('data-date');
        renderMatchesList();
      }
    });
  }

  // BOTÃO DE ATUALIZAR JOGOS
  const btnRefreshFixtures = document.getElementById('btnRefreshFixtures');
  if (btnRefreshFixtures) {
    btnRefreshFixtures.addEventListener('click', async () => {
      btnRefreshFixtures.textContent = '⏳ Atualizando...';
      btnRefreshFixtures.disabled = true;
      try {
        const res = await fetch('/api/refresh-fixtures', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          btnRefreshFixtures.textContent = '✅ Atualizado!';
          await fetchMatches(); // Recarregar jogos
          setTimeout(() => {
            btnRefreshFixtures.textContent = '🔄 Atualizar Jogos';
            btnRefreshFixtures.disabled = false;
          }, 2000);
        } else {
          btnRefreshFixtures.textContent = '❌ Erro';
          setTimeout(() => {
            btnRefreshFixtures.textContent = '🔄 Atualizar Jogos';
            btnRefreshFixtures.disabled = false;
          }, 2000);
        }
      } catch (err) {
        btnRefreshFixtures.textContent = '❌ Erro';
        setTimeout(() => {
          btnRefreshFixtures.textContent = '🔄 Atualizar Jogos';
          btnRefreshFixtures.disabled = false;
        }, 2000);
      }
    });
  }
});

// BUSCAR TIMES DO BACKEND
async function fetchTeams() {
  try {
    const res = await fetch('/api/teams');
    teamsList = await res.json();
  } catch (err) {
    console.error("Erro ao buscar times:", err);
  }
}

// BUSCAR JOGOS DO BACKEND
async function fetchMatches() {
  try {
    const res = await fetch('/api/matches');
    matches = await res.json();
    renderMatchesList();
  } catch (err) {
    console.error("Erro ao buscar jogos:", err);
    matchesListEl.innerHTML = `<p class="error">Erro ao carregar jogos. Verifique se o servidor está rodando.</p>`;
  }
}

// ATIVAR E CARREGAR UM BILHETE ESPECÍFICO
function switchActiveTicket(index) {
  saveActiveTicketState();
  activeTicketIndex = index;

  document.querySelectorAll('#ticketTabs .tab-btn').forEach((btn, i) => {
    if (i === index) btn.classList.add('active');
    else btn.classList.remove('active');
  });

  loadActiveTicketState();
  renderSelectionsEditor();
  updateTicketPreview();
}

function saveActiveTicketState() {
  if (!tickets[activeTicketIndex]) return;
  tickets[activeTicketIndex].stake = parseFloat(inputStake.value) || 0;
  tickets[activeTicketIndex].type = inputType.value;
  tickets[activeTicketIndex].status = inputStatus.value;
  tickets[activeTicketIndex].useCredits = inputUseCredits.checked;
  tickets[activeTicketIndex].selections = [...currentSelections];
}

function loadActiveTicketState() {
  const t = tickets[activeTicketIndex];
  if (!t) return;
  inputStake.value = t.stake;
  inputType.value = t.type;
  inputStatus.value = t.status;
  inputUseCredits.checked = t.useCredits;
  currentSelections = [...t.selections];
}

// RENDERIZAR LISTA DE JOGOS (com filtro de data)
function renderMatchesList() {
  matchesListEl.innerHTML = '';
  
  // Data de hoje
  const today = new Date();
  const todayStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = `${String(tomorrow.getDate()).padStart(2, '0')}/${String(tomorrow.getMonth() + 1).padStart(2, '0')}/${tomorrow.getFullYear()}`;
  
  // Filtrar jogos
  const filteredMatches = matches.filter(match => {
    if (selectedDate === 'all') return true;
    if (selectedDate === 'today') return match.date === todayStr;
    if (selectedDate === 'tomorrow') return match.date === tomorrowStr;
    return match.date === selectedDate;
  });
  
  if (filteredMatches.length === 0) {
    matchesListEl.innerHTML = '<p class="no-matches">Nenhum jogo encontrado para esta data.</p>';
    return;
  }
  
  filteredMatches.forEach(match => {
    const emojiHome = teamEmojis[match.home] || "⚽";
    const emojiAway = teamEmojis[match.away] || "⚽";
    
    const card = document.createElement('div');
    card.className = 'match-item-card';
    if (selectedMatch && selectedMatch.id === match.id) {
      card.classList.add('active');
    }
    
    card.innerHTML = `
      <div class="match-item-header">
        <span>${match.league}</span>
        <span>${match.date} ${match.time}</span>
      </div>
      <div class="match-item-teams">
        <span>${emojiHome} ${match.home} vs ${match.away} ${emojiAway}</span>
        <span class="match-item-score">${match.score} (${match.status})</span>
      </div>
    `;
    
    card.addEventListener('click', () => selectMatch(match));
    matchesListEl.appendChild(card);
  });
}

// SELECIONAR UM JOGO E AUTO-GERAR
async function selectMatch(match) {
  selectedMatch = match;
  renderMatchesList();

  // Preencher inputs básicos com base no jogo selecionado
  inputLeague.value = match.league;
  inputHomeTeam.value = match.home;
  inputAwayTeam.value = match.away;
  inputScore.value = match.score;
  inputTimeElapsed.value = match.timeElapsed !== "00:00" ? match.timeElapsed : "Aguardando";
  inputPossession.value = match.status === "Ao Vivo" ? "Jogo com Posse Dinâmica" : "Partida não iniciada";
  
  // Mostrar seção de customização
  sectionCustomizeEl.style.display = 'block';

  // Reseta para a primeira aba (Bilhete 1) ao selecionar um novo jogo
  activeTicketIndex = 0;
  document.querySelectorAll('#ticketTabs .tab-btn').forEach((btn, i) => {
    if (i === 0) btn.classList.add('active');
    else btn.classList.remove('active');
  });

  // Gerar palpites automáticos para este jogo
  await autoGenerateSelections();
}

// CONFIGURAR JOGO PERSONALIZADO
function setupCustomMatch() {
  selectedMatch = { id: 'custom', home: 'Time Casa', away: 'Time Fora', league: 'Liga Personalizada', score: '0-0', status: 'Aguardando', timeElapsed: '00:00' };
  
  // Resetar classes ativas na lista de jogos
  document.querySelectorAll('.match-item-card').forEach(c => c.classList.remove('active'));

  inputLeague.value = "Campeonato Brasileiro";
  inputHomeTeam.value = "Flamengo";
  inputAwayTeam.value = "Palmeiras";
  inputScore.value = "0-0";
  inputTimeElapsed.value = "Aguardando";
  inputPossession.value = "Aquecimento";
  
  sectionCustomizeEl.style.display = 'block';

  // Reseta para a primeira aba (Bilhete 1)
  activeTicketIndex = 0;
  document.querySelectorAll('#ticketTabs .tab-btn').forEach((btn, i) => {
    if (i === 0) btn.classList.add('active');
    else btn.classList.remove('active');
  });

  autoGenerateSelections();
}

// GERAR PALPITES DE FORMA INTELIGENTE
async function autoGenerateSelections(isRegen = false) {
  const home = inputHomeTeam.value;
  const away = inputAwayTeam.value;

  try {
    const btnGerar = document.getElementById('btnAutoGenerate');
    if (btnGerar) { btnGerar.textContent = '⏳ Buscando jogadores...'; btnGerar.disabled = true; }

    const [homeRes, awayRes] = await Promise.all([
      fetch(`/api/players?team=${encodeURIComponent(home)}`).then(r => r.json()),
      fetch(`/api/players?team=${encodeURIComponent(away)}`).then(r => r.json())
    ]);

    if (btnGerar) { btnGerar.textContent = '✨ Gerar Palpites Automáticos'; btnGerar.disabled = false; }

    let homePlayers = homeRes.players || [];
    let awayPlayers = awayRes.players || [];

    if (homePlayers.length === 0) {
      alert(`⚠️ Nenhum jogador encontrado para "${home}".`);
      return;
    }
    if (awayPlayers.length === 0) {
      alert(`⚠️ Nenhum jogador encontrado para "${away}".`);
      return;
    }

// ─── NORMALIZAÇÃO DE NOMES DE TIMES ─────────────────
// A API retorna nomes em inglês (ex: "Turkey", "Australia") mas
// o teamStrengthMap usa português (ex: "Turquia", "Austrália")
const teamNameToPortuguese = {
  "australia": "Austrália",
  "brazil": "Brasil",
  "türkiye": "Turquia",
  "turkey": "Turquia",
  "t r turkey": "Turquia",
  "tr turkey": "Turquia",
  "tr turquia": "Turquia",
  "japan": "Japão",
  "south korea": "Coreia do Sul",
  "czech republic": "Tchéquia",
  "croatia": "Croácia",
  "serbia": "Sérvia",
  "denmark": "Dinamarca",
  "switzerland": "Suíça",
  "austria": "Áustria",
  "netherlands": "Holanda",
  "belgium": "Bélgica",
  "spain": "Espanha",
  "england": "Inglaterra",
  "france": "França",
  "germany": "Alemanha",
  "portugal": "Portugal",
  "italy": "Itália",
  "uruguay": "Uruguai",
  "colombia": "Colômbia",
  "argentina": "Argentina",
  "paraguay": "Paraguai",
  "peru": "Peru",
  "venezuela": "Venezuela",
  "chile": "Chile",
  "bolivia": "Bolívia",
  "ecuador": "Equador",
  "ivory coast": "Costa do Marfim",
  "morocco": "Marrocos",
  "egypt": "Egito",
  "senegal": "Senegal",
  "nigeria": "Nigéria",
  "cameroon": "Camarões",
  "ghana": "Gana",
  "algeria": "Argélia",
  "tunisia": "Tunísia",
  "south africa": "África do Sul",
  "saudi arabia": "Arábia Saudita",
  "united states": "Estados Unidos",
  "canada": "Canadá",
  "mexico": "México",
  "panama": "Panamá",
  "iran": "Irã",
  "iraq": "Iraque",
  "jordan": "Jordânia",
  "uzbekistan": "Uzbequistão",
  "new zealand": "Nova Zelândia",
  "haiti": "Haiti",
  "costa rica": "Costa Rica",
  "scotland": "Escócia",
  "poland": "Polônia",
  "romania": "Romênia",
  "sweden": "Suécia",
  "norway": "Noruega",
  "croatia": "Croácia",
  "qatar": "Catar",
  "cabo verde": "Cabo Verde",
  "cape verde": "Cabo Verde",
  "curaçao": "Curaçao",
  "curacao": "Curaçao",
  "dr congo": "RD Congo",
  "rd congo": "RD Congo",
  "bosnia": "Bósnia",
  "austrália": "Austrália",
  "escócia": "Escócia",
  "canadá": "Canadá",
  "tchéquia": "Tchéquia",
  "inglaterra": "Inglaterra",
  "alemanha": "Alemanha",
  "espanha": "Espanha",
  "frança": "França",
  "portugal": "Portugal",
  "holanda": "Holanda",
  "bélgica": "Bélgica",
  "croácia": "Croácia",
  "uruguai": "Uruguai",
  "colômbia": "Colômbia",
  "argentina": "Argentina",
  "sérvia": "Sérvia",
  "dinamarca": "Dinamarca",
  "marrocos": "Marrocos",
  "egito": "Egito",
  "senegal": "Senegal",
  "nigéria": "Nigéria",
  "gana": "Gana",
  "argélia": "Argélia",
  "tunísia": "Tunísia",
  "áfrica do sul": "África do Sul",
  "arábia saudita": "Arábia Saudita",
  "irã": "Irã",
  "iraque": "Iraque",
  "suíça": "Suíça",
  "áustria": "Áustria",
  "polônia": "Polônia",
  "suécia": "Suécia",
  "noruega": "Noruega",
  "romênia": "Romênia",
  "paraguai": "Paraguai",
  "canadá": "Canadá",
  "méxico": "México",
  "panamá": "Panamá",
  "equador": "Equador",
  "bolívia": "Bolívia",
  "coreia do sul": "Coreia do Sul",
  "nova zelândia": "Nova Zelândia",
  "uzbequistão": "Uzbequistão",
};

function normalizeTeamName(name) {
  if (!name) return name;
  const trimmed = name.trim();
  // Tenta pela tabela de tradução (inglês → português)
  const key = trimmed.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (teamNameToPortuguese[key]) return teamNameToPortuguese[key];
  return trimmed;
}

    const marketTypes = [
      { key: 'scorer', label: 'Para Marcar', format: (p) => `Para ${p} marcar` },
      { key: 'header', label: 'Marcar de Cabeça', format: (p) => `Para ${p} marcar um Cabeceio` },
      { key: 'outsideBox', label: 'Marcar de Fora da Área', format: (p) => `Para ${p} marcar de Fora da Área` },
      { key: 'assist', label: 'Jogador a Dar Assistência', format: (p) => `${p} - Para Dar Assistência` },
      { key: 'card', label: 'Para o Jogador Ser Advertido', format: (p) => `Para ${p} Ser Advertido` }
    ];

    // ═══════════════════════════════════════════
    //  NORMALIZAR NOMES DOS TIMES (inglês → português)
    // ═══════════════════════════════════════════
    const homeNorm = normalizeTeamName(home);
    const awayNorm = normalizeTeamName(away);
    console.log(`[Distribuição] timeCasa="${home}"→"${homeNorm}" timeFora="${away}"→"${awayNorm}"`);

    // ═══════════════════════════════════════════
    //  DETERMINAR FAVORITO
    // ═══════════════════════════════════════════
    const homeStrength = teamStrengthMap[homeNorm] || 1.0;
    const awayStrength = teamStrengthMap[awayNorm] || 1.0;
    const homeIsFavorite = homeStrength < awayStrength;
    const awayIsFavorite = awayStrength < homeStrength;
    const strengthDiff = Math.abs(homeStrength - awayStrength);

    // Classificar nível de favoritismo
    let isFav, isUnd, favPool, undPool;
    if (strengthDiff <= 0.10) {
      isFav = null; isUnd = null; favPool = null; undPool = null;
    } else if (homeIsFavorite) {
      isFav = 'home'; isUnd = 'away'; favPool = homePlayers; undPool = awayPlayers;
    } else {
      isFav = 'away'; isUnd = 'home'; favPool = awayPlayers; undPool = homePlayers;
    }
    const nivelFav = !isFav ? 'equilibrado' : (strengthDiff > 0.20 ? 'favorito claro' : 'favorito leve');
    console.log(`[Distribuição] favorito=${isFav || 'nenhum'} nivelFavoritismo="${nivelFav}" diff=${strengthDiff.toFixed(2)}`);

    // Gerar os 4 bilhetes
    for (let tIdx = 0; tIdx < 4; tIdx++) {
      let combinedOdd = 1;
      let selectedSelections = [];

      const isGoalAssist = (tIdx === 0 || tIdx === 1);
      const allowedKeys = isGoalAssist ? ['scorer', 'assist'] : ['header', 'outsideBox'];
      const numSelections = isGoalAssist ? 3 : 2;

      // Ordem alternada dos mercados entre tickets do mesmo par
      const marketOrder = isGoalAssist
        ? (tIdx === 0 ? ['scorer', 'assist'] : ['assist', 'scorer'])
        : (tIdx === 2 ? ['header', 'outsideBox'] : ['outsideBox', 'header']);

      // ─── DISTRIBUIÇÃO DOS TIMES ─────────────────
      // teamOrder[i] define qual time joga na i-ésima posição
      let teamOrder = [];
      const isClearFav = isFav && strengthDiff > 0.20;

      if (isClearFav) {
        // Favorito claro: 3 sel → 2 fav + 1 und; 2 sel → 2 fav
        if (numSelections === 3) teamOrder = [isFav, isFav, isUnd];
        else teamOrder = [isFav, isFav];
      } else if (isFav) {
        // Favorito leve: 3 sel → 2 fav + 1 und
        if (numSelections === 3) teamOrder = [isFav, isFav, isUnd];
        else teamOrder = [isFav, isUnd];
      } else {
        // Equilibrado: 3 sel → 2 de um + 1 do outro; 2 sel → 1 cada
        if (numSelections === 3) teamOrder = ['home', 'away', 'home'];
        else teamOrder = ['home', 'away'];
      }

      // Tickets 1/3: inverter ordem para variar entre pares
      if (tIdx === 1 || tIdx === 3) teamOrder = [...teamOrder].reverse();

      const favCount = teamOrder.filter(s => s === isFav).length;
      const undCount = teamOrder.filter(s => s === isUnd).length;
      console.log(`[Distribuição] Bilhete ${tIdx}: numSelections=${numSelections} teamOrder=[${teamOrder.join(',')}] favorito=${isFav||'?'} und=${isUnd||'?'} esperado=${favCount}xFav + ${undCount}xUnd`);

      // Tentar gerar (sem loop de tentativas – deterministico)
      const usedNames = new Set();
      const usedMarkets = new Set();

      for (let i = 0; i < numSelections; i++) {
        const side = teamOrder[i % teamOrder.length];
        const isHome = side === 'home';
        const pool = isHome ? homePlayers : awayPlayers;

        const desiredMarket = marketOrder[i % marketOrder.length];

        // Se já usou esse mercado, escolher o alternativo
        let marketKey = desiredMarket;
        if (usedMarkets.has(marketKey)) {
          const alt = marketOrder.find(m => !usedMarkets.has(m));
          if (alt) marketKey = alt;
        }

        const player = pickBest(pool, marketKey, usedNames, isHome ? awayStrength : homeStrength);
        if (!player) {
          // Tentar mercado alternativo
          const altKey = marketOrder.find(m => m !== marketKey);
          if (altKey) {
            const altPlayer = pickBest(pool, altKey, usedNames, isHome ? awayStrength : homeStrength);
            if (altPlayer) {
              usedNames.add(altPlayer.name);
              usedMarkets.add(altKey);
              const mt = marketTypes.find(m => m.key === altKey);
              const odd = altPlayer.markets?.[altKey] || (altKey === 'scorer' ? 2.50 : altKey === 'assist' ? 3.50 : 7.00);
              selectedSelections.push({ title: mt.format(altPlayer.name), market: mt.label, odd, status: 'ganho', subplus: true, team: isHome ? homeNorm : awayNorm, playerName: altPlayer.name });
              combinedOdd *= odd;
            }
          }
          continue;
        }

        usedNames.add(player.name);
        usedMarkets.add(marketKey);
        const mt = marketTypes.find(m => m.key === marketKey);
        const odd = player.markets?.[marketKey] || (marketKey === 'scorer' ? 2.50 : marketKey === 'assist' ? 3.50 : marketKey === 'header' ? 7.00 : 8.50);
        selectedSelections.push({ title: mt.format(player.name), market: mt.label, odd, status: 'ganho', subplus: Math.random() > 0.3, team: isHome ? homeNorm : awayNorm, playerName: player.name });
        combinedOdd *= odd;
      }

      // Fallback se não gerou nada
      if (selectedSelections.length < numSelections) {
        const fSide = isFav || (homeStrength <= awayStrength ? 'home' : 'away');
        const fPool = fSide === 'home' ? homePlayers : awayPlayers;
        const uPool = fSide === 'home' ? awayPlayers : homePlayers;

        const fOpp = fSide === 'home' ? awayStrength : homeStrength;
        const uOpp = fSide === 'home' ? homeStrength : awayStrength;
        const best = (pool, key, opp = 1.0) => pickBest(pool, key, new Set(), opp);
        const odd = (pool, key) => best(pool, key, 1.0)?.markets?.[key] || (key === 'scorer' ? 2.50 : key === 'assist' ? 3.50 : key === 'header' ? 7.00 : 8.50);

        if (isGoalAssist) {
          const fScorer = best(fPool, 'scorer', fOpp);
          const fAssist = best(fPool, 'assist', fOpp);
          const uScorer = best(uPool, 'scorer', uOpp);
          const undTeamName = fSide === 'home' ? awayNorm : homeNorm;
          const favTeamName = fSide === 'home' ? homeNorm : awayNorm;
          selectedSelections = [
            { title: `Para ${fScorer?.name || 'Jogador'} marcar`, market: "Para Marcar", odd: odd(fPool, 'scorer'), status: 'ganho', subplus: true, team: favTeamName, playerName: fScorer?.name },
            { title: `${fAssist?.name || 'Jogador'} - Para Dar Assistência`, market: "Jogador a Dar Assistência", odd: odd(fPool, 'assist'), status: 'ganho', subplus: true, team: favTeamName, playerName: fAssist?.name },
            { title: `Para ${uScorer?.name || 'Jogador'} marcar`, market: "Para Marcar", odd: odd(uPool, 'scorer'), status: 'ganho', subplus: false, team: undTeamName, playerName: uScorer?.name }
          ];
        } else {
          const fHeader = best(fPool, 'header', fOpp);
          const fOutside = best(fPool, 'outsideBox', fOpp);
          const favTeamName = fSide === 'home' ? homeNorm : awayNorm;
          selectedSelections = [
            { title: `Para ${fHeader?.name || 'Jogador'} marcar um Cabeceio`, market: "Marcar de Cabeça", odd: odd(fPool, 'header'), status: 'ganho', subplus: true, team: favTeamName, playerName: fHeader?.name },
            { title: `Para ${fOutside?.name || 'Jogador'} marcar de Fora da Área`, market: "Marcar de Fora da Área", odd: odd(fPool, 'outsideBox'), status: 'ganho', subplus: false, team: favTeamName, playerName: fOutside?.name }
          ];
        }
        combinedOdd = selectedSelections.reduce((a, s) => a * s.odd, 1);
      }

      tickets[tIdx].selections = selectedSelections;

      // ─── VALIDAÇÃO FINAL: garantir cota por time ─────
      const favNameRaw = isFav === 'home' ? home : isFav === 'away' ? away : null;
      const undNameRaw = isUnd === 'home' ? home : isUnd === 'away' ? away : null;
      const favNorm = favNameRaw ? normalizeTeamName(favNameRaw) : null;
      const undNorm = undNameRaw ? normalizeTeamName(undNameRaw) : null;
      if (isClearFav && favNorm && undNorm) {
        const actualFav = selectedSelections.filter(s => s.team === favNorm).length;
        const actualUnd = selectedSelections.filter(s => s.team === undNorm).length;
        if (actualUnd > actualFav) {
          console.warn(`⚠️ [Distribuição] Bilhete ${tIdx}: VIOLAÇÃO! Und(${actualUnd}) > Fav(${actualFav}). Corrigindo...`);
          // Trocar o último und selecionado pelo melhor fav disponível
          const lastUndIdx = [...selectedSelections].reverse().findIndex(s => s.team === undNorm);
          if (lastUndIdx >= 0) {
            const realIdx = selectedSelections.length - 1 - lastUndIdx;
            const altKey = marketOrder[realIdx % marketOrder.length];
            const bestFav = pickBest(favPool, altKey, new Set(selectedSelections.map(s => s.playerName).filter(Boolean)), isFav === 'home' ? awayStrength : homeStrength);
            if (bestFav) {
              const mt = marketTypes.find(m => m.key === altKey);
              selectedSelections[realIdx] = {
                title: mt.format(bestFav.name),
                market: mt.label,
                odd: bestFav.markets?.[altKey] || (altKey === 'scorer' ? 2.50 : altKey === 'assist' ? 3.50 : 7.00),
                status: 'ganho',
                subplus: true,
                team: favNorm,
                playerName: bestFav.name
              };
              combinedOdd = selectedSelections.reduce((a, s) => a * s.odd, 1);
              tickets[tIdx].selections = selectedSelections;
              console.log(`✅ [Distribuição] Bilhete ${tIdx}: corrigido → trocou por ${bestFav.name}`);
            }
          }
        }
      }
      console.log(`[Distribuição] Bilhete ${tIdx}: final=${selectedSelections.map(s=>s.playerName||s.title).join(', ')}`);
    }

    loadActiveTicketState();
    renderSelectionsEditor();
    updateTicketPreview();

  } catch (err) {
    console.error("Erro ao auto-gerar múltiplos palpites:", err);
  }
}

// Helper: obter métrica (0-100) para um jogador e mercado, com ajuste por adversário
function getMetric(p, key, opponentStrength = 1.0) {
  const base = p.metrics?.[key] ?? (p.markets?.[key] ? Math.max(0, Math.min(100, 100 - p.markets[key] * 3)) : 0);
  // opponentStrength: < 1 = adversário forte (reduz score), > 1 = adversário fraco (aumenta score)
  if (key === 'scorer' || key === 'assist' || key === 'header' || key === 'outsideBox') {
    return Math.min(100, Math.round(base * opponentStrength));
  }
  return base;
}

// Helper: pegar o melhor jogador de um time para um mercado (sem repetir nome)
function pickBest(players, marketKey, forbiddenNames = new Set(), opponentStrength = 1.0) {
  const valid = players
    .filter(p => {
      if (forbiddenNames.has(p.name)) return false;
      if (marketKey === 'scorer' || marketKey === 'assist') {
        return (p.pos === 'FWD' || p.pos === 'MID') && p.specialties && p.specialties.includes(marketKey);
      }
      return true;
    })
    .sort((a, b) => getMetric(b, marketKey, opponentStrength) - getMetric(a, marketKey, opponentStrength));
  if (valid.length > 0) return valid[0];
  // Fallback: liberar restrição para header/outsideBox
  if (marketKey === 'header' || marketKey === 'outsideBox') {
    const fb = players
      .filter(p => !forbiddenNames.has(p.name))
      .sort((a, b) => getMetric(b, marketKey, opponentStrength) - getMetric(a, marketKey, opponentStrength));
    return fb[0] || null;
  }
  return null;
}

// RENDERIZAR EDICAO DAS SELECOES NO PAINEL
function renderSelectionsEditor() {
  selectionsListContainerEl.innerHTML = '';
  currentSelections.forEach((sel, index) => {
    const item = document.createElement('div');
    item.className = 'selection-edit-item';
    item.innerHTML = `
      <button class="btn-delete-selection" onclick="deleteSelectionRow(${index})">🗑️</button>
      <div class="form-group">
        <label>Título do Palpite (ex: Para Pedro marcar)</label>
        <input type="text" value="${sel.title}" oninput="updateSelectionData(${index}, 'title', this.value)">
      </div>
      <div class="form-group">
        <label>Mercado Subtítulo (ex: Marcar de Cabeça)</label>
        <input type="text" value="${sel.market}" oninput="updateSelectionData(${index}, 'market', this.value)">
      </div>
      <div class="form-group-row">
        <div class="form-group">
          <label>Odd</label>
          <input type="number" step="0.05" value="${sel.odd}" oninput="updateSelectionData(${index}, 'odd', parseFloat(this.value) || 1)">
        </div>
        <div class="form-group">
          <label>Substituição+</label>
          <select onchange="updateSelectionData(${index}, 'subplus', this.value === 'true')">
            <option value="true" ${sel.subplus ? 'selected' : ''}>Sim</option>
            <option value="false" ${!sel.subplus ? 'selected' : ''}>Não</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label>Status do Palpite</label>
        <select onchange="updateSelectionData(${index}, 'status', this.value)">
          <option value="ganho" ${sel.status === 'ganho' ? 'selected' : ''}>Ganho (Check Verde)</option>
          <option value="pendente" ${sel.status === 'pendente' ? 'selected' : ''}>Pendente (Círculo)</option>
          <option value="anulado" ${sel.status === 'anulado' ? 'selected' : ''}>Anulado (Cinza)</option>
        </select>
      </div>
    `;
    selectionsListContainerEl.appendChild(item);
  });
}

// ATUALIZAR DADO DE UMA SELECÃO ESPECÍFICA
function updateSelectionData(index, field, value) {
  if (currentSelections[index]) {
    currentSelections[index][field] = value;
    saveActiveTicketState();
    updateTicketPreview();
  }
}

// ADICIONAR NOVA SELECÃO VAZIA
function addSelectionRow() {
  currentSelections.push({
    title: "Para Novo Jogador marcar",
    market: "Marcar de Cabeça",
    odd: 3.50,
    status: 'ganho',
    subplus: false
  });
  renderSelectionsEditor();
  updateTicketPreview();
}

// EXCLUIR UMA SELECÃO
window.deleteSelectionRow = function(index) {
  currentSelections.splice(index, 1);
  saveActiveTicketState();
  renderSelectionsEditor();
  updateTicketPreview();
}

// CALCULAR ODDS E ATUALIZAR PREVIEW DO BILHETE (RÉPLICA CSS)
function updateTicketPreview() {
  const home = inputHomeTeam.value;
  const away = inputAwayTeam.value;
  const score = inputScore.value;
  const time = inputTimeElapsed.value;
  const possession = inputPossession.value;
  const stake = parseFloat(inputStake.value) || 0;
  const type = inputType.value;
  const status = inputStatus.value;
  const useCredits = inputUseCredits.checked;

  // Atualizar bandeiras aproximadas
  homeFlag.textContent = teamEmojis[home] || "⚽";
  awayFlag.textContent = teamEmojis[away] || "⚽";

  homeName.textContent = home;
  awayName.textContent = away;

  // Separar placar
  const scores = score.split('-');
  homeScore.textContent = scores[0] || '0';
  awayScore.textContent = scores[1] || '0';

  possessionText.textContent = possession;
  matchTimeText.textContent = time;

  // Se for "Simples", esconde o título "Criar Aposta"
  if (type === 'simples') {
    betGroupTitle.textContent = "SIMPLES";
  } else {
    betGroupTitle.textContent = "CRIAR APOSTA";
  }

  // Calcular Odd Total das seleções
  const totalOdd = currentSelections.reduce((acc, sel) => acc * sel.odd, 1).toFixed(2);
  betGroupOdd.textContent = totalOdd;

  // Renderizar Seleções no Bilhete
  ticketSelectionsList.innerHTML = '';
  currentSelections.forEach(sel => {
    const item = document.createElement('div');
    item.className = 'bet-selection-item';

    // Definir classe do bullet baseado no status
    let bulletClass = '';
    if (sel.status === 'pendente') bulletClass = 'pending';
    if (sel.status === 'anulado') bulletClass = 'void';

    let badgeHTML = '';
    if (sel.status === 'anulado') {
      badgeHTML = `<span class="selection-badge">Anulado</span>`;
    }

    let subPlusHTML = '';
    if (sel.subplus) {
      subPlusHTML = `
        <div class="selection-right">
          <button class="sub-btn">SUBSTITUIÇÃO+</button>
          <div class="progress-bar-container">
            <div class="progress-bar" style="width: ${sel.status === 'ganho' ? '100%; background-color:#00ff7b;' : '0%;'}"></div>
          </div>
        </div>
      `;
    }

    item.innerHTML = `
      <span class="selection-bullet ${bulletClass}"></span>
      <div class="selection-info">
        <span class="selection-name">${sel.title} ${badgeHTML}</span>
        <span class="selection-market">${sel.market}</span>
      </div>
      ${subPlusHTML}
    `;
    ticketSelectionsList.innerHTML += item.outerHTML;
  });

  // Atualizar valores do rodapé
  const stakeFormatted = `R$${stake.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  footerStake.textContent = stakeFormatted;

  if (useCredits) {
    footerCreditsLabel.style.display = 'block';
    footerCreditsLabel.textContent = `${stakeFormatted} Créditos de Aposta`;
    // Se usar créditos, o retorno total ou líquido muda na bet365
  } else {
    footerCreditsLabel.style.display = 'none';
  }

  // Se todos os palpites são "ganhos" e o status geral for ganho
  const totalReturn = stake * parseFloat(totalOdd);
  const netReturn = totalReturn - stake;

  let returnLabel = "Retorno Total";
  let returnValue = totalReturn;

  if (status === 'ganho') {
    returnLabel = "Retorno Total";
    returnValue = totalReturn;
    ticketActionButton.className = "ticket-action-button settled";
    ticketActionButton.innerHTML = `R$${returnValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Retorno Obtido`;
  } else if (status === 'perdido') {
    returnLabel = "Retorno Total";
    returnValue = 0;
    ticketActionButton.className = "ticket-action-button settled";
    ticketActionButton.style.color = "#ef4444";
    ticketActionButton.innerHTML = `Aposta Perdida`;
  } else {
    // Modo Cashout em Aberto
    returnLabel = "Retorno Líquido";
    returnValue = netReturn;
    ticketActionButton.className = "ticket-action-button";
    
    // Simula um valor de Cashout realista de 80% do retorno total
    const cashoutVal = (totalReturn * 0.82).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    ticketActionButton.textContent = `Encerrar Aposta R$${cashoutVal}`;
  }

  footerReturnLabel.textContent = returnLabel;
  footerReturnValue.textContent = `R$${returnValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Atualizar Header do Bilhete
  ticketHeaderStake.textContent = `${stakeFormatted} ${type === 'simples' ? 'Simples' : 'Criar Aposta +'}`;

  // Atualizar template da mensagem do Telegram
  generateTelegramMessageTemplate(totalOdd);
}

// GERAR TEMPLATE DE MENSAGEM DO TELEGRAM
function generateTelegramMessageTemplate(totalOdd) {
  const home = inputHomeTeam.value;
  const away = inputAwayTeam.value;
  const league = inputLeague.value;
  const type = inputType.value === 'simples' ? 'Simples' : 'Criar Aposta';

  const emojiHome = teamEmojis[home] || "⚽";
  const emojiAway = teamEmojis[away] || "⚽";

  let msg = `🚨 <b>NOVA ENTRADA ENCONTRADA! (ODD ${totalOdd})</b> 🚨\n\n`;
  msg += `🏆 <b>Competição:</b> ${league}\n`;
  msg += `⚽ <b>Partida:</b> ${emojiHome} ${home} vs ${away} ${emojiAway}\n\n`;
  msg += `📝 <b>Seleções (${type}):</b>\n`;
  
  currentSelections.forEach(sel => {
    msg += `🟢 ${sel.title} (Odd: ${sel.odd})\n`;
  });
  
  msg += `\n📊 <b>Odd Total:</b> ${totalOdd}\n`;
  msg += `💰 <b>Gestão Recomendada:</b> 1% a 2% da Banca\n\n`;
  msg += `🍀 <i>Boa sorte a todos! Entre com responsabilidade.</i>`;

  telegramMessageTextInput.value = msg;
}

// COPIAR MENSAGEM DO TELEGRAM PARA CLIPBOARD
function copyTelegramMessage() {
  telegramMessageTextInput.select();
  document.execCommand('copy');
  
  // Feedback visual
  const oldText = btnCopyMessageEl.textContent;
  btnCopyMessageEl.textContent = "✅ Copiado!";
  setTimeout(() => {
    btnCopyMessageEl.textContent = oldText;
  }, 1500);
}

// FAZER DOWNLOAD DO BILHETE COMO PNG
function downloadTicketImage() {
  const ticket = document.getElementById('bet365Ticket');
  
  // Configuração para garantir alta qualidade e fundo transparente/correto no render
  html2canvas(ticket, {
    backgroundColor: '#282828',
    scale: 2, // Aumenta a resolução para ficar limpo em telas retina
    useCORS: true
  }).then(canvas => {
    const link = document.createElement('a');
    link.download = `bilhete_bet365_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
}

// ENVIAR IMAGEM + TEXTO PARA O CANAL DO TELEGRAM
async function sendToTelegram() {
  const botToken = telegramBotTokenInput.value.trim();
  const chatId = telegramChatIdInput.value.trim();
  const text = telegramMessageTextInput.value;

  if (!botToken || !chatId) {
    showTelegramStatus("Por favor, preencha o Token do Bot e o ID do Canal antes de enviar.", "error");
    return;
  }

  // Salvar credenciais no localStorage
  localStorage.setItem('tg_bot_token', botToken);
  localStorage.setItem('tg_chat_id', chatId);

  showTelegramStatus("Gerando imagem do bilhete e enviando...", "success");

  try {
    // Gerar imagem do bilhete usando html2canvas
    const ticket = document.getElementById('bet365Ticket');
    const canvas = await html2canvas(ticket, {
      backgroundColor: '#282828',
      scale: 2,
      useCORS: true
    });
    
    const base64Image = canvas.toDataURL('image/png');

    // Chamar API interna
    const response = await fetch('/api/send-telegram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        botToken,
        chatId,
        text,
        image: base64Image
      })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      showTelegramStatus("🚀 Enviado com sucesso para o Telegram!", "success");
    } else {
      showTelegramStatus(`Erro: ${result.error || "Não foi possível enviar."}`, "error");
    }

  } catch (error) {
    console.error("Erro no envio:", error);
    showTelegramStatus(`Erro de rede ou permissão: ${error.message}`, "error");
  }
}

// MOSTRAR STATUS DA INTEGRACAO DO TELEGRAM
function showTelegramStatus(text, type) {
  telegramStatusEl.textContent = text;
  telegramStatusEl.className = `telegram-status ${type}`;
  
  if (type === 'success') {
    setTimeout(() => {
      telegramStatusEl.textContent = '';
    }, 4000);
  }
}

// LIMPAR CACHE DO SERVIDOR
async function clearCache() {
  try {
    const btn = document.getElementById('btnClearCache');
    if (btn) btn.textContent = '⏳ Limpando...';
    
    const res = await fetch('/api/clear-cache', { method: 'POST' });
    const data = await res.json();
    
    if (data.ok) {
      if (btn) btn.textContent = '✅ Cache Limpo!';
      setTimeout(() => { if (btn) btn.textContent = '🗑️ Limpar Cache'; }, 2000);
    } else {
      if (btn) btn.textContent = '❌ Erro';
      setTimeout(() => { if (btn) btn.textContent = '🗑️ Limpar Cache'; }, 2000);
    }
  } catch (err) {
    console.error('Erro ao limpar cache:', err);
  }
}
