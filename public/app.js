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

// GERAR PALPITES DE FORMA INTELIGENTE (ODD 20+)
async function autoGenerateSelections(isRegen = false) {
  const home = inputHomeTeam.value;
  const away = inputAwayTeam.value;

  try {
    // Mostrar feedback de carregamento
    const btnGerar = document.getElementById('btnAutoGenerate');
    if (btnGerar) { btnGerar.textContent = '⏳ Buscando jogadores...'; btnGerar.disabled = true; }

    // Buscar jogadores para ambos os times
    const [homeRes, awayRes] = await Promise.all([
      fetch(`/api/players?team=${encodeURIComponent(home)}`).then(r => r.json()),
      fetch(`/api/players?team=${encodeURIComponent(away)}`).then(r => r.json())
    ]);

    if (btnGerar) { btnGerar.textContent = '✨ Gerar Palpites Automáticos'; btnGerar.disabled = false; }


    let homePlayers = homeRes.players || [];
    let awayPlayers = awayRes.players || [];

    // Avisar se algum time ficou sem jogadores
    if (homePlayers.length === 0) {
      alert(`⚠️ Nenhum jogador encontrado para "${home}".\nVerifique se o nome do time está correto ou se a chave da API está configurada.`);
      return;
    }
    if (awayPlayers.length === 0) {
      alert(`⚠️ Nenhum jogador encontrado para "${away}".\nVerifique se o nome do time está correto ou se a chave da API está configurada.`);
      return;
    }

    const marketTypes = [
      { key: 'scorer', label: 'Para Marcar', format: (p) => `Para ${p} marcar` },
      { key: 'header', label: 'Marcar de Cabeça', format: (p) => `Para ${p} marcar um Cabeceio` },
      { key: 'outsideBox', label: 'Marcar de Fora da Área', format: (p) => `Para ${p} marcar de Fora da Área` },
      { key: 'assist', label: 'Jogador a Dar Assistência', format: (p) => `${p} - Para Dar Assistência` },
      { key: 'card', label: 'Para o Jogador Ser Advertido', format: (p) => `Para ${p} Ser Advertido` }
    ];

    // ═══════════════════════════════════════════
    //  DETERMINAR FAVORITO (peso para seleção)
    // ═══════════════════════════════════════════
    const teamStrengthMap = {
      "Brasil": 0.75, "Argentina": 0.75, "França": 0.75, "Inglaterra": 0.78,
      "Espanha": 0.78, "Alemanha": 0.80, "Portugal": 0.80,
      "Uruguai": 0.85, "Bélgica": 0.85, "Holanda": 0.85, "Colômbia": 0.88,
      "Croácia": 0.88, "Marrocos": 0.88,
      "Japão": 1.00, "Coreia do Sul": 1.00, "Austrália": 1.00, "Suíça": 1.00,
      "Senegal": 1.00, "Egito": 1.05, "Equador": 1.05, "Costa do Marfim": 1.05,
      "México": 1.05, "Irã": 1.05, "Tunísia": 1.05, "Arábia Saudita": 1.10,
      "Panamá": 1.10, "Canadá": 1.10, "Noruega": 1.10,
      "Gana": 1.20, "Escócia": 1.20, "Paraguai": 1.20, "Suécia": 1.20,
      "Áustria": 1.20, "Turquia": 1.25, "Catar": 1.25,
      "Tchéquia": 1.35, "África do Sul": 1.35, "RD Congo": 1.35,
      "Bósnia": 1.35, "Argélia": 1.35, "Iraque": 1.40,
      "Uzbequistão": 1.50, "Jordânia": 1.50, "Haiti": 1.50,
      "Cabo Verde": 1.50, "Curaçao": 1.50, "Nova Zelândia": 1.50, "Bolívia": 1.50,
      "Real Madrid": 0.70, "Barcelona": 0.70, "Manchester City": 0.72, "Liverpool": 0.72,
      "Arsenal": 0.75, "Bayern Munich": 0.72, "PSG": 0.75, "Inter Milão": 0.78,
      "Atlético Madrid": 0.78, "Napoli": 0.80, "Borussia Dortmund": 0.80,
      "Chelsea": 0.82, "Juventus": 0.82, "Tottenham": 0.85, "Newcastle": 0.85,
      "Flamengo": 0.80, "Palmeiras": 0.80, "São Paulo": 0.90, "Botafogo": 0.90,
    };

    const homeStrength = teamStrengthMap[home] || 1.0;
    const awayStrength = teamStrengthMap[away] || 1.0;
    
    // homeStrength menor = favorito
    const homeIsFavorite = homeStrength < awayStrength;
    const awayIsFavorite = awayStrength < homeStrength;
    const strengthDiff = Math.abs(homeStrength - awayStrength);
    
    // Calcular peso de seleção: favorito ganha mais peso
    // Se diff > 0.2 = superfavorito (75% favorito, 25% desfavorecido)
    // Se diff > 0.1 = favorito (65% favorito, 35% desfavorecido)
    // Se diff <= 0.1 = equilibrado (55% casa, 45% fora)
    let homeWeight, awayWeight;
    if (homeIsFavorite) {
      homeWeight = strengthDiff > 0.2 ? 0.75 : strengthDiff > 0.1 ? 0.65 : 0.55;
      awayWeight = 1 - homeWeight;
    } else if (awayIsFavorite) {
      awayWeight = strengthDiff > 0.2 ? 0.75 : strengthDiff > 0.1 ? 0.65 : 0.55;
      homeWeight = 1 - awayWeight;
    } else {
      homeWeight = 0.55;
      awayWeight = 0.45;
    }

    // Gerar os 4 bilhetes
    for (let tIdx = 0; tIdx < 4; tIdx++) {
      let combinedOdd = 1;
      let selectedSelections = [];
      let attempts = 0;
      const maxAttempts = 100;

      // Define a estratégia do bilhete:
      // Bilhetes 0 e 1: Gols e Assistências (Apenas 'scorer' e 'assist')
      // Bilhetes 2 e 3: Gols Especiais (Apenas 'header' e 'outsideBox')
      const allowedKeys = (tIdx === 0 || tIdx === 1) ? ['scorer', 'assist'] : ['header', 'outsideBox'];
      const currentMarketTypes = marketTypes.filter(m => allowedKeys.includes(m.key));

      while ((combinedOdd < 20 || combinedOdd > 200) && attempts < maxAttempts) {
        combinedOdd = 1;
        selectedSelections = [];
        attempts++;

        // Se for Gols/Assists, 3 palpites (múltipla mais encorpada)
        // Se for Gols Especiais, 2 palpites bastam devido às odds altas
        const numSelections = (tIdx === 0 || tIdx === 1) 
          ? 3 // 3 palpites fixos
          : 2; // 2 palpites fixos
          
        const usedPlayers = new Set();
        let homeCount = 0;
        let awayCount = 0;

        // Para bilhetes Gols/Assists, garantir pelo menos 1 scorer e 1 assist
        const usedMarkets = new Set();

        for (let i = 0; i < numSelections; i++) {
          // Escolher time baseado no peso do favoritismo
          const isHome = Math.random() < homeWeight;
          const playerPool = isHome ? homePlayers : awayPlayers;
          if (playerPool.length === 0) continue;

          // Limitar jogadores do desfavorecido
          const maxFromUnderdog = homeIsFavorite ? 
            (awayWeight > 0.4 ? 2 : 1) : 
            (homeWeight > 0.4 ? 2 : 1);
          
          if (isHome && !homeIsFavorite && homeCount >= maxFromUnderdog) continue;
          if (!isHome && !awayIsFavorite && awayCount >= maxFromUnderdog) continue;

          // GARANTIR MISTURA: primeiro scorer, depois assist (ou vice-versa)
          let market;
          if (tIdx === 0 || tIdx === 1) {
            // Bilhete Gols/Assists: garantir pelo menos 1 de cada
            if (i === 0) {
              // Primeiro: scorer
              market = currentMarketTypes.find(m => m.key === 'scorer');
            } else if (i === 1 && !usedMarkets.has('assist')) {
              // Segundo: assist (se ainda não teve)
              market = currentMarketTypes.find(m => m.key === 'assist');
            } else if (i === 1 && usedMarkets.has('assist')) {
              // Já teve assist, colocar scorer
              market = currentMarketTypes.find(m => m.key === 'scorer');
            } else {
              // Terceiro: qualquer um
              market = currentMarketTypes[Math.floor(Math.random() * currentMarketTypes.length)];
            }
          } else {
            // Bilhete Gols Especiais: qualquer um
            market = currentMarketTypes[Math.floor(Math.random() * currentMarketTypes.length)];
          }

          // Filtra jogadores com essa especialidade e ordena por odds (menor = melhor)
          // Para scorer/assist: só FWD e MID (não zagueiro/goleiro)
          // Para header/outsideBox: todos podem
          let matchingPlayers = playerPool
            .filter(p => {
              if (!p.specialties || !p.specialties.includes(market.key)) return false;
              if (market.key === 'scorer' || market.key === 'assist') {
                return p.pos === 'FWD' || p.pos === 'MID';
              }
              return true;
            })
            .sort((a, b) => (a.markets?.[market.key] || 99) - (b.markets?.[market.key] || 99));
          if (matchingPlayers.length === 0) {
            // Se não tem jogador com essa especialidade, pular esta iteração
            // NÃO forçar jogador que não tem a especialidade
            continue;
          }

          // Pega o MELHOR jogador (menor odd = mais provável)
          const player = matchingPlayers[0];
          
          if (usedPlayers.has(player.name)) continue;
          usedPlayers.add(player.name);
          usedMarkets.add(market.key);
          
          // Contar jogadores de cada time
          if (isHome) homeCount++;
          else awayCount++;

          // Ajusta para uma especialidade do jogador que seja permitida na estratégia
          let finalMarket = market;
          if (player.specialties && player.specialties.length > 0 && !player.specialties.includes(market.key)) {
            const allowedPlayerSpecs = player.specialties.filter(s => allowedKeys.includes(s));
            if (allowedPlayerSpecs.length > 0) {
              const randomSpec = allowedPlayerSpecs[Math.floor(Math.random() * allowedPlayerSpecs.length)];
              const matchingMarket = marketTypes.find(m => m.key === randomSpec);
              if (matchingMarket) {
                finalMarket = matchingMarket;
              }
            }
          }

          // Usa odds fixa do jogador (sem variação aleatória)
          const finalOdd = player.markets[finalMarket.key] || 3.00;

          selectedSelections.push({
            title: finalMarket.format(player.name),
            market: finalMarket.label,
            odd: finalOdd,
            status: 'ganho',
            subplus: Math.random() > 0.3
          });

          combinedOdd *= finalOdd;
        }
      }

      // Se falhar na geração, coloca um fallback compatível com a estratégia
      // Priorizar jogadores do favorito no fallback
      if (combinedOdd < 20) {
        const favoritePlayers = homeIsFavorite ? homePlayers : awayPlayers;
        const underdogPlayers = homeIsFavorite ? awayPlayers : homePlayers;
        const p1 = favoritePlayers[0] || { name: "Atacante" };
        const p2 = favoritePlayers[1] || { name: "Meio-Campo" };
        const p3 = underdogPlayers[0] || { name: "Jogador" };
        
        if (tIdx === 0 || tIdx === 1) {
          // Gols e Assistências fallback (2 do favorito, 1 do desfavorecido)
          selectedSelections = [
            { title: `Para ${p1.name} marcar`, market: "Para Marcar", odd: 2.20, status: 'ganho', subplus: true },
            { title: `${p2.name} - Para Dar Assistência`, market: "Jogador a Dar Assistência", odd: 3.50, status: 'ganho', subplus: true },
            { title: `Para ${p3.name} marcar`, market: "Para Marcar", odd: 2.80, status: 'ganho', subplus: false }
          ];
          combinedOdd = 21.56;
        } else {
          // Gols Especiais fallback (2 do favorito)
          selectedSelections = [
            { title: `Para ${p1.name} marcar um Cabeceio`, market: "Marcar de Cabeça", odd: 7.00, status: 'ganho', subplus: true },
            { title: `Para ${p2.name} marcar de Fora da Área`, market: "Marcar de Fora da Área", odd: 8.50, status: 'ganho', subplus: false }
          ];
          combinedOdd = 59.50;
        }
      }

      // Salva no estado do ticket correspondente
      tickets[tIdx].selections = selectedSelections;
    }

    // Recarrega o estado do bilhete atualmente selecionado (aba ativa)
    loadActiveTicketState();
    renderSelectionsEditor();
    updateTicketPreview();

  } catch (err) {
    console.error("Erro ao auto-gerar múltiplos palpites:", err);
  }
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
