const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const playersData = require('./playersData');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Anti-cache para arquivos estáticos
app.use(express.static('public', {
  etag: false,
  lastModified: false,
  setHeaders: (res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');
  }
}));

// ─────────────────────────────────────────────
//  CACHE PERSISTENTE EM DISCO
// ─────────────────────────────────────────────
const CACHE_FILE = path.join(__dirname, 'data', 'api_cache.json');
let diskCache = {};

try {
  if (fs.existsSync(CACHE_FILE)) {
    diskCache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    console.log(`[Cache] ${Object.keys(diskCache).length} times carregados do cache em disco.`);
  }
} catch (e) {
  console.error('[Cache] Erro ao ler cache:', e.message);
}

function saveDiskCache() {
  try {
    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(diskCache, null, 2), 'utf8');
  } catch (e) {
    console.error('[Cache] Erro ao salvar cache:', e.message);
  }
}

// Status do prefetch (para o frontend acompanhar)
let prefetchStatus = { running: false, total: 0, done: 0, current: '', errors: [] };

// ─────────────────────────────────────────────
//  TITULARES CONFIRMADOS - COPA DO MUNDO 2026
//  Fonte: ge.globo (confirmado), Goal.com (provaveis)
//  SEM GOLEIROS (filtrados no codigo)
// ─────────────────────────────────────────────
const confirmedStarters = {
  "Argélia": [
    "Belghali", "Belaid", "Bensebaini", "Ait-Nouri", "Zerrouki", "Boudaoui", "Mahrez", "Aouar", "Chaibi", "Gouiri"
  ],
  "Arábia Saudita": [
    "Boushal", "Tambakti", "Al-Amri", "Al-Harbi", "Kanno", "Al-Khaibari", "N. Al-Dawsari", "Mandash", "Al-Buraikan", "S. Al-Dawsari"
  ],
  "Argentina": [
    "Molina", "Otamendi", "Romero", "Tagliafico", "Mac Allister", "Paredes", "Fernandez", "Messi", "Alvarez", "Almada"
  ],
  "Austrália": [
    "Italiano", "Degenek", "Souttar", "Circati", "Bos", "Metcalfe", "Devlin", "O'Neill", "Irankunda", "Touré"
  ],
  "Áustria": [
    "Laimer", "Lienhart", "Alaba", "Mwene", "X. Schlager", "Seiwald", "Wimmer", "Baumgartner", "Sabitzer", "Arnautovic"
  ],
  "Bélgica": [
    "Castagne", "Debast", "Theate", "De Cuyper", "Tielemans", "Onana", "Doku", "De Bruyne", "Trossard", "De Ketelaere"
  ],
  "Bósnia": [
    "Dedic", "Katic", "Muharemovic", "Kolasinac", "Bajraktarevic", "Sunjic", "Tahirovic", "Memic", "Demirovic", "Dzeko"
  ],
  "Brasil": [
    "Ibañez", "Marquinhos", "Gabriel Magalhães", "Douglas Santos", "Casemiro", "Bruno Guimarães", "Lucas Paquetá", "Raphinha", "Vinícius Jr.", "Igor Thiago"
  ],
  "Canadá": [
    "Sigur", "Bombito", "Jones", "Laryea", "Buchanan", "Koné", "Eustaquio", "Davies", "Oluwaseyi", "David"
  ],
  "Cabo Verde": [
    "Moreira", "Lopes", "Borges", "Lopes Cabral", "Lenini", "Duarte", "Rodrigues", "Monteiro", "Cabral", "Livramento"
  ],
  "Colômbia": [
    "Muñoz", "Sánchez", "Mina", "Mojica", "Lerma", "Ríos", "Arias", "James", "Diaz", "Suárez"
  ],
  "Coreia do Sul": [
    "Seol", "Min-jae Kim", "Han-beom Lee", "Tae-seok Lee", "Wang", "Castrop", "Kang-in Lee", "Jae-sung Lee", "Bae", "Son"
  ],
  "Costa do Marfim": [
    "Doué", "Koussonou", "Ndicka", "Konan", "Kessié", "Sangaré", "Oulai", "Pepé", "Guessand", "Diomandé"
  ],
  "Curaçao": [
    "Sambo", "Van Ejma", "Obispo", "Floranus", "J. Bacuna", "Comenancia", "L. Bacuna", "Chong", "Locadia", "Gorré"
  ],
  "Croácia": [
    "Stanisic", "Sutalo", "Caleta-Car", "Gvardiol", "Sucic", "Modric", "Pasalic", "Kramaric", "Perisic", "Budimir"
  ],
  "Equador": [
    "Preciado", "Ordonez", "Pacho", "HIncapié", "Vite", "Caicedo", "Castillo", "Yeboah", "Valencia", "Angulo"
  ],
  "Egito": [
    "Ibrahim", "Abdelmaguif", "Rabia", "Hany", "Ateya", "Lasheen", "Fatouh", "Ashour", "Salah", "Marmoush"
  ],
  "França": [
    "Koundé", "Saliba", "Upamecano", "Hernandez", "Rabiot", "Tchouameni", "Dembelé", "Olise", "Doué", "Mbappé"
  ],
  "Alemanha": [
    "Kimmich", "Tah", "Schlotterbeck", "Raum", "Pavlovic", "Goreztka", "Sané", "Musiala", "Wirtz", "Havertz"
  ],
  "Gana": [
    "Adjetei", "Seidu", "Oppong", "Yirenkyi", "Sibo", "Partey", "Mensah", "Sulemana", "Semenyo", "Ayew"
  ],
  "Japão": [
    "Tomiyasu", "Taniguchi", "Itakura", "Doan", "Endo", "Tanaka", "Nakamura", "Kubo", "Ito", "Ueda"
  ],
  "Jordânia": [
    "Abu Dahab", "Nasib", "Al-Arab", "Haddad", "Al-Rawahbdeh", "Al-Rashdan", "Abu Taha", "Tamari", "Olwan", "Al-Mardi"
  ],
  "Haiti": [
    "Arcus", "Adé", "Duverne", "Expérience", "Deedson", "Bellegarde", "Pierre", "Isidor", "Nazon", "Providence"
  ],
  "Inglaterra": [
    "James", "Guehi", "Konsa", "O'Reilly", "Anderson", "Rice", "Saka", "Bellingham", "Eze", "Kane"
  ],
  "Irã": [
    "Yousefi", "Kanaani", "Khalilzadeh", "Mohammadi", "Ezatolahi", "Ghoddos", "Jahanbakhsh", "Ghayedi", "Mohebi", "Taremi"
  ],
  "Iraque": [
    "Hussein Ali", "Sulaka", "Tahseen", "Doski", "Al-Ammari", "Bayesh", "Ali Jasim", "Iqbal", "Amyn", "Aymen Hussein"
  ],
  "Marrocos": [
    "Hakimi", "Diop", "Aguerd", "Salah-Eddine", "Ounahi", "El Aynaoui", "Brahim Diaz", "Saibari", "Talbi", "El Kaabi"
  ],
  "México": [
    "Sánchez", "Montes", "Vasquez", "Gallardo", "Pineda", "Alvarez", "Fidalgo", "Vega", "Jimenez", "Quinones"
  ],
  "Noruega": [
    "Ryerson", "Heggem", "Ostigard", "Wolfe", "Thorstvedt", "Berg", "Berge", "Sorloth", "Haaland", "Nusa"
  ],
  "Nova Zelândia": [
    "Payne", "Bindon", "Boxall", "Cacace", "Samenic", "Bell", "McCowatt", "Singh", "Garbett", "Wood"
  ],
  "Holanda": [
    "Dumfries", "Van Dijk", "Aké", "Van de Ven", "De Jong", "Gravenberch", "Malen", "Reijnders", "Gakpo", "Depay"
  ],
  "Panamá": [
    "Farina", "Andrade", "Cordoba", "Murillo", "Carrasquilla", "Godoy", "Davis", "Barcenas", "Diaz", "Fajardo"
  ],
  "Paraguai": [
    "Caceres", "G. Gomez", "Alderete", "Alonso", "D. Gomez", "Ojeda", "Bobadilla", "Almiron", "Enciso", "Avalos"
  ],
  "Portugal": [
    "Cancelo", "Ruben Dias", "Inacio", "Nuno Mendes", "Joao Neves", "Vitinha", "Bruno Fernandes", "Bernardo Silva", "Cristiano Ronaldo", "Joao Felix"
  ],
  "Catar": [
    "Al-Oui", "Khoukhi", "Pedro Miguel", "Al-Amin", "Boudiaf", "Fathy", "Laye", "Edmilson Junior", "Almoez Ali", "Afif"
  ],
  "Escócia": [
    "Hickey", "Hanley", "McKenna", "Robertson", "Ferguson", "Gannon-Doak", "Christie", "McTominay", "McGinn", "Adams"
  ],
  "Espanha": [
    "Llorente", "Cubarsì", "Laporte", "Cucurella", "Pedri", "Rodri", "Fabian Ruiz", "Yamal", "Oyarzabal", "N. Williams"
  ],
  "Estados Unidos": [
    "Freeman", "Richards", "Trusty", "Antonee Robinson", "McKennie", "Berhalter", "Adams", "Weah", "Balogun", "Pulisic"
  ],
  "África do Sul": [
    "Mudau", "Sibisi", "Ndamane", "Modiba", "Sithole", "Mokoena", "Apollis", "Zwane", "Mofokeng", "Foster"
  ],
  "Suécia": [
    "Starfelt", "Lagerbielke", "Lindelof", "Svensson", "Karlstrom", "Ayari", "Gudmundsson", "Nygren", "Elanga", "Gyokeres"
  ],
  "Suíça": [
    "Widmer", "Akanji", "Elvedi", "Rodriguez", "Freuler", "Xhaka", "Rieder", "Ndoye", "Embolo", "Vargas"
  ],
  "Tunísia": [
    "Valery", "Bronn", "Talbi", "Abdi", "Gharbi", "Skhiri", "Hannibal", "Achouri", "Mastouri", "Tounekti"
  ],
  "Turquia": [
    "Demiral", "Kabak", "Bardakci", "Celik", "Calhanoglu", "Kokcu", "Ozer", "Guler", "Yildiz", "Akturkoglu"
  ],
  "Uruguai": [
    "Valera", "Gimenez", "Araujo", "Olivera", "Valverde", "Ugarte", "Bentancur", "Canobbio", "Nunez", "Rodriguez"
  ],
  "Uzbequistão": [
    "Abdullaev", "Ashurmatov", "Khusanov", "Sayfiev", "Shukurov", "Khamrobekov", "Nasrullaev", "Ganiev", "Urunov", "Shomurodov"
  ],
  "Tchéquia": [
    "Chaloupek", "Hranac", "Krejci", "Zeleny", "Soucek", "Darida", "Coufal", "Provod", "Sulc", "Schick"
  ],
  "RD Congo": [
    "Wan-Bissaka", "Mbemba", "Tuanzebe", "Masuaku", "Pickel", "Moutoussamy", "Bongonda", "Kakuta", "Wissa", "Bakambu"
  ],
  "Senegal": [
    "Diatta", "Koulibaly", "Niakhaté", "Jakobs", "Idrissa Gueye", "Pape Gueye", "Ismaila Sarr", "Iliman Ndiaye", "Mané", "Jackson"
  ],
  "Sérvia": [
    "Pavlovic", "Milenkovic", "Gudelj", "Zivkovic", "Maksimovic", "Lucic", "Tadic", "Jovic", "Vlahovic", "Mitrovic"
  ],
};

// Tentar carregar escalacoes atualizadas do disco (atualizado pelo GitHub Actions ou cron)
try {
  const lineupsFile = path.join(__dirname, 'data', 'lineups.json');
  if (fs.existsSync(lineupsFile)) {
    const loadedLineups = JSON.parse(fs.readFileSync(lineupsFile, 'utf8'));
    const loadedCount = Object.keys(loadedLineups).length;
    if (loadedCount > 0) {
      Object.assign(confirmedStarters, loadedLineups);
      console.log(`[Lineups] ${loadedCount} lineups carregados de data/lineups.json`);
    }
  }
} catch (e) {
  console.error('[Lineups] Erro ao carregar data/lineups.json:', e.message);
}

// ─────────────────────────────────────────────
//  48 TIMES DA COPA DO MUNDO 2026
// ─────────────────────────────────────────────
const worldCupTeams2026 = {
  // Grupo A
  "Estados Unidos":   "United States",
  "Panamá":           "Panama",
  "México":           "Mexico",
  // Grupo B
  "Canadá":           "Canada",
  "Chile":            "Chile",
  "Equador":          "Ecuador",
  // Grupo C
  "Brasil":           "Brazil",
  "Japão":            "Japan",
  "Bolívia":          "Bolivia",
  "Haiti":            "Haiti",
  // Grupo D
  "Portugal":         "Portugal",
  "Argentina":        "Argentina",
  "Marrocos":         "Morocco",
  // Grupo E
  "França":           "France",
  "Alemanha":         "Germany",
  "Nigéria":          "Nigeria",
  // Grupo F
  "Espanha":          "Spain",
  "Inglaterra":       "England",
  "Senegal":          "Senegal",
  // Grupo G
  "Uruguai":          "Uruguay",
  "Colômbia":         "Colombia",
  "Costa do Marfim":  "Ivory Coast",
  // Grupo H
  "Holanda":          "Netherlands",
  "Bélgica":          "Belgium",
  "Austrália":        "Australia",
  // Grupo I
  "Coreia do Sul":    "South Korea",
  "Itália":           "Italy",
  "Venezuela":        "Venezuela",
  // Grupo J
  "Turquia":          "Turkey",
  "Croácia":          "Croatia",
  "Egito":            "Egypt",
  // Grupo K
  "Sérvia":           "Serbia",
  "Dinamarca":        "Denmark",
  "Camarões":         "Cameroon",
  // Grupo L
  "Suíça":            "Switzerland",
  "Arábia Saudita":   "Saudi Arabia",
  "Romênia":          "Romania",
  // Extra (potenciais classificados)
  "Tchéquia":         "Czech Republic",
  "Escócia":          "Scotland",
  "Polônia":          "Poland",
  "Gana":             "Ghana",
  "Peru":             "Peru",
  "Paraguai":         "Paraguay",
  "Irã":              "Iran",
  "Argélia":          "Algeria",
  "Nova Zelândia":    "New Zealand",
  "Panamá":           "Panama",
  "Costa Rica":       "Costa Rica",
  "Áustria":          "Austria",
  "África do Sul":    "South Africa",
  "Qatar":            "Qatar",
};

// ─────────────────────────────────────────────
//  TRADUÇÃO DE NOMES DE TIMES
// ─────────────────────────────────────────────
const teamNameTranslations = {
  // Construído a partir da lista acima + extras
  "brasil":           "Brazil",
  "argentina":        "Argentina",
  "frança":           "France",
  "franca":           "France",
  "espanha":          "Spain",
  "portugal":         "Portugal",
  "alemanha":         "Germany",
  "uruguai":          "Uruguay",
  "colômbia":         "Colombia",
  "colombia":         "Colombia",
  "chile":            "Chile",
  "equador":          "Ecuador",
  "venezuela":        "Venezuela",
  "peru":             "Peru",
  "paraguai":         "Paraguay",
  "bolívia":          "Bolivia",
  "bolivia":          "Bolivia",
  "panamá":           "Panama",
  "panama":           "Panama",
  "costa rica":       "Costa Rica",
  "estados unidos":   "United States",
  "eua":              "United States",
  "usa":              "United States",
  "canadá":           "Canada",
  "canada":           "Canada",
  "méxico":           "Mexico",
  "mexico":           "Mexico",
  "Inglaterra":       "England",
  "inglaterra":       "England",
  "holanda":          "Netherlands",
  "bélgica":          "Belgium",
  "belgica":          "Belgium",
  "itália":           "Italy",
  "italia":           "Italy",
  "turquia":          "Turkey",
  "croácia":          "Croatia",
  "croacia":          "Croatia",
  "sérvia":           "Serbia",
  "serbia":           "Serbia",
  "dinamarca":        "Denmark",
  "suíça":            "Switzerland",
  "suica":            "Switzerland",
  "áustria":          "Austria",
  "austria":          "Austria",
  "polônia":          "Poland",
  "polonia":          "Poland",
  "romênia":          "Romania",
  "romania":          "Romania",
  "tchéquia":         "Czech Republic",
  "tchequia":         "Czech Republic",
  "escócia":          "Scotland",
  "escocia":          "Scotland",
  "coreia do sul":    "South Korea",
  "japão":            "Japan",
  "japao":            "Japan",
  "irã":              "Iran",
  "ira":              "Iran",
  "arábia saudita":   "Saudi Arabia",
  "arabia saudita":   "Saudi Arabia",
  "qatar":            "Qatar",
  "austrália":        "Australia",
  "australia":        "Australia",
  "nova zelândia":    "New Zealand",
  "nova zelandia":    "New Zealand",
  "marrocos":         "Morocco",
  "senegal":          "Senegal",
  "nigéria":          "Nigeria",
  "haiti":            "Haiti",
  "nigeria":          "Nigeria",
  "gana":             "Ghana",
  "camarões":         "Cameroon",
  "camaroes":         "Cameroon",
  "costa do marfim":  "Ivory Coast",
  "egito":            "Egypt",
  "argélia":          "Algeria",
  "algeria":          "Algeria",
  "áfrica do sul":    "South Africa",
  "africa do sul":    "South Africa",
  // Clubes
  "flamengo":         "Flamengo",
  "palmeiras":        "Palmeiras",
  "real madrid":      "Real Madrid",
  "manchester city":  "Manchester City",
};

function translateTeamToEnglish(teamName) {
  const normalized = teamName.trim().toLowerCase();
  return teamNameTranslations[normalized] || teamName;
}

// ─────────────────────────────────────────────
//  CLASSIFICAÇÃO INTELIGENTE POR ESTATÍSTICAS
// ─────────────────────────────────────────────

function buildBaseMarkets(posCode) {
  if (posCode === 'FWD') return { scorer: 2.50, header: 6.50, outsideBox: 9.00, assist: 3.50, card: 5.00 };
  if (posCode === 'MID') return { scorer: 4.50, header: 13.00, outsideBox: 7.50, assist: 3.00, card: 2.80 };
  return              { scorer: 9.00, header: 8.50, outsideBox: 22.00, assist: 11.00, card: 2.30 }; // DEF
}

function adjustOdds(base, goals, assists, yellowCards) {
  const m = { ...base };
  // Odds menores para quem marca mais
  if (goals >= 20)     m.scorer = Math.max(1.55, m.scorer * 0.65);
  else if (goals >= 12) m.scorer = Math.max(2.00, m.scorer * 0.78);
  else if (goals >= 7)  m.scorer = m.scorer * 0.90;

  // Odds menores para quem dá mais assistências
  if (assists >= 12)    m.assist = Math.max(1.80, m.assist * 0.65);
  else if (assists >= 7) m.assist = Math.max(2.20, m.assist * 0.80);
  else if (assists >= 4) m.assist = m.assist * 0.90;

  // Odds menores para mais cartões
  if (yellowCards >= 8) m.card = Math.max(1.80, m.card * 0.72);
  else if (yellowCards >= 5) m.card = m.card * 0.85;

  return Object.fromEntries(Object.entries(m).map(([k, v]) => [k, parseFloat(v.toFixed(2))]));
}

// ─────────────────────────────────────────────
//  FAVORITISMO POR COPA 2026 (ajusta odds)
//  Times fortes: odds menores = mais prováveis
//  Times fracos: odds maiores = menos prováveis
// ─────────────────────────────────────────────
const teamStrength = {
  // TOP FAVORITOS (odds -25%)
  "Brasil": 0.75, "Argentina": 0.75, "França": 0.75, "Inglaterra": 0.78,
  "Espanha": 0.78, "Alemanha": 0.80, "Portugal": 0.80,
  // FORTES (odds -15%)
  "Uruguai": 0.85, "Bélgica": 0.85, "Holanda": 0.85, "Colômbia": 0.88,
  "Croácia": 0.88, "Marrocos": 0.88,
  // MÉDIOS (odds normais)
  "Japão": 1.00, "Coreia do Sul": 1.00, "Austrália": 1.00, "Suíça": 1.00,
  "Senegal": 1.00, "Egito": 1.05, "Equador": 1.05, "Costa do Marfim": 1.05,
  "México": 1.05, "Irã": 1.05, "Tunísia": 1.05, "Arábia Saudita": 1.10,
  "Panamá": 1.10, "Canadá": 1.10, "Noruega": 1.10,
  // FRACOS (odds +20%)
  "Gana": 1.20, "Escócia": 1.20, "Paraguai": 1.20, "Suécia": 1.20,
  "Áustria": 1.20, "Turquia": 1.25, "Catar": 1.25,
  // MUITO FRACOS (odds +35%)
  "Tchéquia": 1.35, "África do Sul": 1.35, "RD Congo": 1.35,
  "Bósnia": 1.35, "Argélia": 1.35, "Iraque": 1.40,
  // FRACOS MÁXIMO (odds +50%)
  "Uzbequistão": 1.50, "Jordânia": 1.50, "Haiti": 1.50,
  "Cabo Verde": 1.50, "Curaçao": 1.50, "Nova Zelândia": 1.50,
  "Bolívia": 1.50,
  // BRASILEIRÃO (clubes)
  "Flamengo": 0.80, "Palmeiras": 0.80, "São Paulo": 0.90, "Botafogo": 0.90,
  "Grêmio": 0.95, "Internacional": 0.95, "Corinthians": 0.95, "Atlético-MG": 0.95,
  "Cruzeiro": 1.00, "Fluminense": 1.00, "Bahia": 1.05, "Vasco": 1.10,
  // EUROPEUS (clubes)
  "Real Madrid": 0.70, "Barcelona": 0.70, "Manchester City": 0.72, "Liverpool": 0.72,
  "Arsenal": 0.75, "Bayern Munich": 0.72, "PSG": 0.75, "Inter Milão": 0.78,
  "Atlético Madrid": 0.78, "Napoli": 0.80, "Borussia Dortmund": 0.80,
  "Chelsea": 0.82, "Juventus": 0.82, "Tottenham": 0.85, "Newcastle": 0.85,
  "Bayer Leverkusen": 0.78, "RB Leipzig": 0.82, "AC Milan": 0.85,
  "Monaco": 0.88, "Lyon": 0.90, "Lille": 0.90, "Nice": 0.95,
  "Roma": 0.88, "Lazio": 0.90, "Atalanta": 0.82, "Fiorentina": 0.90,
  "Real Sociedad": 0.88, "Athletic Bilbao": 0.88, "Real Betis": 0.90,
  "Girona": 0.90, "Valencia": 0.95, "Villarreal": 0.90, "Sevilla": 0.88,
  "West Ham": 0.90, "Aston Villa": 0.88, "Brighton": 0.90, "Bournemouth": 0.95,
  "Fulham": 0.95, "Brentford": 0.95, "Crystal Palace": 0.95, "Nottingham": 0.95,
  "Eintracht Frankfurt": 0.88, "VfB Stuttgart": 0.88,
};

function adjustOddsForFavorite(odds, teamName) {
  const multiplier = teamStrength[teamName] || 1.0;
  const adjusted = { ...odds };
  for (const key of Object.keys(adjusted)) {
    if (key === 'card') {
      // Cartões: time fraco recebe mais (joga defensivo/agitado)
      adjusted[key] = parseFloat((adjusted[key] * (2 - multiplier)).toFixed(2));
    } else {
      // Gols/assistências: time favorito = odds menores
      adjusted[key] = parseFloat((adjusted[key] * multiplier).toFixed(2));
    }
  }
  return adjusted;
}

/**
 * Calcula métricas (0-100) para cada mercado baseado em estatísticas reais.
 * Usa per-90 para normalizar minutos jogados.
 */
function calculatePlayerMetrics(posCode, stats) {
  const metrics = { scorer: 0, assist: 0, header: 0, outsideBox: 0, card: 0 };

  if (!stats) return metrics;

  const goals      = stats?.goals?.total      || 0;
  const assists    = stats?.goals?.assists     || 0;
  const keyPasses  = stats?.passes?.key        || 0;
  const yellowCards = stats?.cards?.yellow     || 0;
  const redCards   = stats?.cards?.red         || 0;
  const shots      = stats?.shots?.total       || 0;
  const shotsOn    = stats?.shots?.on          || 0;
  const duelsWon   = stats?.duels?.won         || 0;
  const aerialWon  = stats?.duels?.aerial_won  || 0;
  const minutes    = stats?.games?.minutes     || 0;

  if (minutes <= 0) return metrics;

  const p90 = 90 / minutes;
  const gPer90 = goals * p90;
  const aPer90 = assists * p90;
  const sPer90 = shots * p90;
  const soPer90 = shotsOn * p90;
  const kpPer90 = keyPasses * p90;
  const ycPer90 = yellowCards * p90;
  const awPer90 = aerialWon * p90;
  const dwPer90 = duelsWon * p90;

  // ─── SCORER ─────────────────────────────────
  // Peso maior para FWD, menor para DEF
  const scorerWeight = posCode === 'FWD' ? 1.0 : posCode === 'MID' ? 1.8 : 4.0;
  // gPer90: 0.5+ g/90 é excelente para FWD
  let scorerRaw = gPer90 * 30 + soPer90 * 3 + (goals > 0 ? Math.min(15, shots / goals * 2) : 0);
  // Se fez gols em jogos importantes (minutos baixos mas gols altos), dar boost
  if (goals >= 10) scorerRaw += 20;
  else if (goals >= 5) scorerRaw += 10;
  metrics.scorer = Math.min(100, Math.round(scorerRaw / scorerWeight));

  // ─── ASSIST ─────────────────────────────────
  const assistWeight = posCode === 'FWD' ? 1.0 : posCode === 'MID' ? 1.2 : 3.0;
  let assistRaw = aPer90 * 30 + kpPer90 * 3;
  if (assists >= 8) assistRaw += 20;
  else if (assists >= 4) assistRaw += 10;
  metrics.assist = Math.min(100, Math.round(assistRaw / assistWeight));

  // ─── HEADER ─────────────────────────────────
  const headerWeight = posCode === 'DEF' ? 1.0 : posCode === 'FWD' ? 1.2 : 1.5;
  let headerRaw = awPer90 * 4 + gPer90 * 8 + (duelsWon >= 80 ? 15 : duelsWon >= 40 ? 8 : 0);
  metrics.header = Math.min(100, Math.round(headerRaw / headerWeight));

  // ─── OUTSIDE BOX ────────────────────────────
  const obWeight = 1.0;
  // Quanto mais chutes, maior chance de marcar de fora. ShotsOn é proxy para chutes no alvo
  let obRaw = sPer90 * 3 + gPer90 * 10 + (shots >= 30 ? 15 : shots >= 15 ? 8 : 0);
  metrics.outsideBox = Math.min(100, Math.round(obRaw / obWeight));

  // ─── CARD ───────────────────────────────────
  const cardWeight = posCode === 'DEF' ? 1.0 : posCode === 'MID' ? 1.2 : 1.8;
  let cardRaw = ycPer90 * 20 + redCards * 15 + dwPer90 * 0.5;
  metrics.card = Math.min(100, Math.round(cardRaw / cardWeight));

  return metrics;
}

/**
 * Converte uma métrica (0-100) em odd aproximada.
 * Score alto → odd baixa (provável)
 * Score baixo → odd alta (improvável)
 */
function metricToOdd(score) {
  if (score >= 95) return +(1.50 + Math.random() * 0.30).toFixed(2);
  if (score >= 85) return +(2.00 + Math.random() * 0.50).toFixed(2);
  if (score >= 75) return +(2.50 + Math.random() * 1.00).toFixed(2);
  if (score >= 65) return +(3.50 + Math.random() * 1.50).toFixed(2);
  if (score >= 50) return +(5.00 + Math.random() * 2.00).toFixed(2);
  if (score >= 35) return +(7.00 + Math.random() * 3.00).toFixed(2);
  if (score >= 20) return +(10.00 + Math.random() * 5.00).toFixed(2);
  return +(20.00 + Math.random() * 30.00).toFixed(2);
}

/**
 * Classifica um jogador com base em métricas calculadas das estatísticas reais.
 * Usa dados da API-Football para determinar quem é mais propenso a cada mercado.
 */
function classifyPlayer(position, stats) {
  const posUpper = (position || '').toUpperCase();
  let posCode = 'MID';
  if (posUpper === 'ATTACKER' || posUpper === 'F') posCode = 'FWD';
  else if (posUpper === 'DEFENDER' || posUpper === 'D') posCode = 'DEF';

  const metrics = calculatePlayerMetrics(posCode, stats);

  // Especialidades: baseadas na métrica (≥ 35 para considerar relevante)
  const specialties = [];
  if (metrics.scorer >= 35) specialties.push('scorer');
  if (metrics.assist >= 35) specialties.push('assist');
  if (metrics.header >= 35) specialties.push('header');
  if (metrics.outsideBox >= 35) specialties.push('outsideBox');
  if (metrics.card >= 35) specialties.push('card');

  // Fallback se não tiver nenhuma especialidade
  if (specialties.length === 0) {
    if (posCode === 'FWD') specialties.push('scorer');
    else if (posCode === 'MID') specialties.push('outsideBox');
    else specialties.push('card');
  }

  // Mercados: odds baseadas nas métricas
  const markets = {
    scorer: metricToOdd(metrics.scorer),
    header: metricToOdd(metrics.header),
    outsideBox: metricToOdd(metrics.outsideBox),
    assist: metricToOdd(metrics.assist),
    card: metricToOdd(metrics.card),
  };

  return { posCode, specialties, markets, metrics };
}

// ─────────────────────────────────────────────
//  FETCH DO TIME NA API (com stats)
// ─────────────────────────────────────────────
async function fetchSquadFromApiFootball(teamName) {
  const apiKey = process.env.API_FOOTBALL_KEY;
  if (!apiKey || apiKey === 'SUA_CHAVE_AQUI' || apiKey.length < 10) return null;

  let normalizedTeam = teamName.trim().toLowerCase();

  // 1. Cache em disco
  if (diskCache[normalizedTeam]) {
    console.log(`[Cache] Dados do disco para: ${teamName}`);
    return diskCache[normalizedTeam];
  }

  // 1b. Normalizar nome do time: "Scotland" → "Escócia", "Australia" → "Austrália", etc.
  // Primeiro tenta reverse lookup no mapa de traduções
  const reverseTranslations = {};
  for (const [ptName, enName] of Object.entries(teamNameTranslations)) {
    const enNorm = enName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    // Preferir versão acentuada (e.g. "escócia" em vez de "escocia")
    if (!reverseTranslations[enNorm] || ptName.normalize('NFD').replace(/[\u0300-\u036f]/g, '') !== ptName) {
      reverseTranslations[enNorm] = ptName;
    }
  }
  // Também mapeia confirmedStarters (versão normalizada sem acento)
  for (const key of Object.keys(confirmedStarters)) {
    const norm = key.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (!reverseTranslations[norm]) {
      reverseTranslations[norm] = key;
    }
  }
  for (const key of Object.keys(playersData)) {
    const norm = key.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (!reverseTranslations[norm]) {
      reverseTranslations[norm] = key;
    }
  }
  const normalizedInput = normalizedTeam.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (reverseTranslations[normalizedInput]) {
    teamName = reverseTranslations[normalizedInput];
    normalizedTeam = teamName.trim().toLowerCase();
  }

  // 2. Para seleções da Copa 2026, usar titulares confirmados
  if (confirmedStarters[teamName]) {
    console.log(`[Titulares] Usando escalação confirmada para: ${teamName}`);
    
    // Buscar stats da API
    const statsRes = await fetch(`https://v3.football.api-sports.io/players?team=${getTeamId(teamName)}&season=2024&page=1`,
      { headers: { 'x-apisports-key': apiKey } });
    const statsData = await statsRes.json();
    
    // Criar mapa normalizado para busca
    const statsMap = {};
    for (const item of (statsData.response || [])) {
      if (item?.player?.name && item?.statistics?.[0]) {
        const apiName = item.player.name;
        statsMap[apiName] = item.statistics[0];
        const normalized = apiName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        statsMap[normalized] = item.statistics[0];
      }
    }
    
    // Buscar dados locais do playersData.js
    const localTeam = playersData[teamName];
    const localPlayers = localTeam?.players || [];
    
    // Criar mapa local normalizado
    const localMap = {};
    for (const p of localPlayers) {
      const key = p.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      localMap[key] = p;
      // Também mapear sem acentos
      localMap[p.name] = p;
    }
    
    console.log(`[API] Stats: ${Object.keys(statsMap).length / 2} | Local: ${localPlayers.length}`);
    
    const players = [];
    
    for (const starterName of confirmedStarters[teamName]) {
      // 1. PRIMEIRO: Buscar nos dados LOCAIS (tem especialidades corretas)
      let localPlayer = null;
      const starterNorm = starterName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      
      // Busca direta
      localPlayer = localMap[starterName] || localMap[starterNorm];
      
      // Busca por substring
      if (!localPlayer) {
        for (const [key, p] of Object.entries(localMap)) {
          if (typeof key === 'string' && key.length > 3) {
            if (key.includes(starterNorm) || starterNorm.includes(key)) {
              localPlayer = p;
              break;
            }
          }
        }
      }
      
      // Se encontrou local, usar ele (especialidades manuais)
      if (localPlayer) {
        players.push({
          name: starterName,
          pos: localPlayer.pos,
          specialties: localPlayer.specialties,
          markets: localPlayer.markets,
          metrics: localPlayer.metrics || null
        });
        console.log(`  ✓ ${starterName} → LOCAL (especialidades manuais)`);
        continue;
      }
      
      // 2. SENÃO: Buscar stats da API e classificar
      let stats = null;
      
      // Busca por aliases
      if (playerNameAliases[starterName]) {
        for (const alias of playerNameAliases[starterName]) {
          stats = statsMap[alias] || statsMap[alias.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')];
          if (stats) break;
        }
      }
      
      // Busca por substring na API
      if (!stats) {
        for (const [apiName, apiStats] of Object.entries(statsMap)) {
          if (typeof apiName === 'string' && apiName.length > 3) {
            const apiNameNorm = apiName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            if (apiNameNorm.includes(starterNorm) || starterNorm.includes(apiNameNorm)) {
              stats = apiStats;
              break;
            }
          }
        }
      }
      
      // Classificar com stats da API
      const position = stats?.games?.position || guessPosition(starterName);
      
      // Pular goleiros
      if (position === 'Goalkeeper') {
        console.log(`  ⏭ ${starterName} → GOLEIRO (pulado)`);
        continue;
      }
      
      const { posCode, specialties, markets, metrics } = classifyPlayer(position, stats);
      
      players.push({
        name: starterName,
        pos: posCode,
        specialties,
        markets,
        metrics: stats ? metrics : null
      });
      console.log(`  ⚠ ${starterName} → API (stats: ${stats ? 'sim' : 'não'})`);
    }
    
    diskCache[normalizedTeam] = players;
    saveDiskCache();
    console.log(`[Titulares] "${teamName}": ${players.length} titulares salvos.`);
    return players;
  }

  // 3. Para clubes, usar lógica da API
  try {
    const searchName = translateTeamToEnglish(teamName);
    console.log(`[API] Buscando: "${teamName}" → "${searchName}"`);

    const searchRes  = await fetch(`https://v3.football.api-sports.io/teams?search=${encodeURIComponent(searchName)}`,
      { headers: { 'x-apisports-key': apiKey } });
    const searchData = await searchRes.json();

    if (!searchData.response || searchData.response.length === 0) {
      console.log(`[API] Time não encontrado: ${teamName}`);
      return null;
    }

    const teamId   = searchData.response[0].team.id;
    console.log(`[API] ID ${teamId}. Buscando elenco...`);

    const squadRes  = await fetch(`https://v3.football.api-sports.io/players/squads?team=${teamId}`,
      { headers: { 'x-apisports-key': apiKey } });
    const squadData = await squadRes.json();
    const rawSquad  = squadData.response?.[0]?.players || [];

    if (rawSquad.length === 0) {
      console.log(`[API] Elenco vazio para ID ${teamId}`);
      return null;
    }

    const statsRes  = await fetch(`https://v3.football.api-sports.io/players?team=${teamId}&season=2024&page=1`,
      { headers: { 'x-apisports-key': apiKey } });
    const statsData = await statsRes.json();

    const statsMap = {};
    for (const item of (statsData.response || [])) {
      if (item?.player?.name && item?.statistics?.[0]) {
        statsMap[item.player.name] = item.statistics[0];
      }
    }

    const allPlayers = rawSquad
      .filter(p => p.position !== 'Goalkeeper')
      .map(p => {
        const stats = statsMap[p.name] || null;
        const minutes = stats?.games?.minutes || 0;
        const { posCode, specialties, markets, metrics } = classifyPlayer(p.position, stats);
        return { name: p.name, pos: posCode, specialties, markets, metrics: stats ? metrics : null, minutes };
      });

    allPlayers.sort((a, b) => b.minutes - a.minutes);
    const players = allPlayers.slice(0, 14);

    if (players.length === 0) return null;

    diskCache[normalizedTeam] = players;
    saveDiskCache();
    console.log(`[API] "${teamName}": ${players.length} jogadores salvos no cache.`);
    return players;

  } catch (err) {
    console.error(`[API] Erro para "${teamName}":`, err.message);
    return null;
  }
}

// Helper para obter ID do time
function getTeamId(teamName) {
  const teamIds = {
    "Brasil": 11, "Argentina": 1, "França": 2, "Inglaterra": 7,
    "Espanha": 10, "Portugal": 11, "Alemanha": 14, "Bélgica": 8,
    "Holanda": 16, "Uruguai": 15, "Croácia": 12, "Colômbia": 9,
    "Marrocos": 18, "Coreia do Sul": 19, "Tchéquia": 20,
    "Escócia": 21, "México": 22, "África do Sul": 23,
    "Panamá": 24, "Nova Zelândia": 25, "Canadá": 26
  };
  return teamIds[teamName] || 11;
}

// ─────────────────────────────────────────────
//  ADIVINHAR POSIÇÃO POR NOME (fallback)
// ─────────────────────────────────────────────
function guessPosition(playerName) {
  const name = playerName.toLowerCase();
  
  // Goleiros conhecidos
  const goalkeepers = ['alisson', 'alisson becker', 'ederson', 'martin', 'neuer', 'courtois', 
    'livakovic', 'bono', 'martinez', 'martínez', 'emiliano', 'pickford', 'simon', 'unai',
    'diogo costa', 'verbruggen', 'rochet', 'hornicek', 'gordon', 'rangel', 'mosquera', 'williams',
    'crocombe', 'crepeau', 'kobel', 'nyland', 'szczesny', 'donnarumma', 'ter stegen'];
  
  for (const gk of goalkeepers) {
    if (name.includes(gk)) return 'Goalkeeper';
  }
  
  // Defensores conhecidos
  const defenders = ['marquinhos', 'gabriel', 'dani alves', 'thiago silva', 'militão', 
    'otamendi', 'romero', 'cristian romero', 'tagliafico', 'molina', 'cancelo', 'dias',
    'ruben dias', 'inácio', 'nuno mendes', 'kimmich', 'tah', 'schlotterbeck', 'raum',
    'gvardiol', 'sutalo', 'caleta-car', 'van dijk', 'aké', 'ake', 'dumfries', 'van de ven',
    'hakimi', 'aguerd', 'diop', 'koundé', 'saliba', 'upamecano', 'hernandez', 'theo',
    'reece james', 'guehi', 'konsa', "o'reilly", 'cubarsí', 'cubarsi', 'laporte', 'cucurella',
    'stanisic', 'valera', 'giménez', 'gimenez', 'araújo', 'araujo', 'olivera', 'wesley',
    'douglas santos', 'adé', 'duverne', 'arcus', 'bindon', 'boxall', 'payne', 'sigur',
    'bombito', 'jones', 'laryea', 'sibisi', 'ndamane', 'modiba', 'mudau', 'farina', 'andrade',
    'córdoba', 'cordoba', 'hickey', 'hanley', 'mckenna', 'robertson', 'ferguson',
    'debast', 'theate', 'de cuyper', 'castagne', 'choupo-moting', 'bensebaini', 'ait-nouri',
    'schlager', 'laimer', 'lienhart', 'alaba', 'mwene', 'tomiyasu', 'taniguchi', 'itakura',
    'souttar', 'circati', 'bos', 'italiano', 'degenek', 'katic', 'muharemovic', 'kolasinac',
    'dedic', 'abdullah', 'ashurmatov', 'khusanov', 'starfelt', 'lagerbielke', 'lindelof',
    'elvedi', 'akanji', 'widmer', 'rodriguez', 'aké', 'van de ven', 'kozlov', 'diallo',
    'konaté', 'koulibaly', 'niakhaté', 'jakobs', 'diatta', 'ndicka', 'konan', 'koussonou',
    'doué', 'moreira', 'lopes', 'borges', 'cabral', 'lenini', 'duarte',
    'dawoud', 'ibrahim', 'rabia', 'abdelmaguif', 'fatouh', 'lasheen',
    'preciado', 'ordonez', 'pacho', 'hincapié', 'hincapie'];
  
  for (const def of defenders) {
    if (name.includes(def)) return 'DEFENDER';
  }
  
  // Meio-campistas conhecidos
  const midfielders = ['casemiro', 'bruno guimarães', 'bruno guimaraes', 'paulinho', 'fabinho',
    'de paul', 'paredes', 'mac allister', 'enzo fernández', 'enzo fernandez',
    'tchouaméni', 'rabiot', 'goretzka', 'pavlovic', 'bellingham', 'rice', 'declan rice',
    'pedri', 'rodri', 'fabián ruiz', 'fabián', 'bruno fernandes', 'vitinha', 'joão neves',
    'tielemans', 'onana', 'de jong', 'gravenberch', 'ugarte', 'bentancur',
    'modric', 'sucic', 'pasalic', 'kramaric', 'perisic', 'lerma', 'ríos', 'rios',
    'ounahi', 'el aynaoui', 'saibari', 'kang-in lee', 'jae-sung lee', 'castrop',
    'wang', 'sithole', 'mokoena', 'soucek', 'coufal', 'provod', 'sulc', 'darida',
    'mcginn', 'mcgin', 'christie', 'gannon-doak', 'gordon',
    'pineda', 'edson álvarez', 'edson alvarez', 'fidalgo',
    'carrasquilla', 'godoy', 'murillo', 'deedson', 'bellegarde', 'pierre',
    'samenic', 'bell', 'mccowatt', 'singh', 'garbett',
    'koné', 'kone', 'eustaquio', 'mckennie', 'berhalter', 'adams',
    'kanno', 'al-khaibari', 'n. al-dawsari', 'al-dawsari',
    'zerrouki', 'boudaoui', 'aouar', 'chaibi',
    'vanne', 'van', 'wijnaldum', 'de roon', 'koopmeiners', 'berghuis',
    'valverde', 'bentancur', 'pelliari', 'canobbio',
    'kessié', 'kessie', 'sangaré', 'sangare', 'oulai',
    'kante', 'ngolo', 'matuidi', 'sissoko',
    'henderson', 'ward-prowse', 'mount', 'mount', 'gallagher',
    'thorstvedt', 'berg', 'berge',
    'mendy', 'idrissa gueye', 'pape gueye',
    'skhiri', 'hannibal', 'gharbi',
    'calhanoglu', 'kokcu', 'ozer', 'yokuslu', 'tufan',
    'berardi', 'barella', 'verratti', 'jorginho', 'locatelli',
    'alaba', 'seiwald', 'x. schlager', 'wimmer', 'baumgartner', 'sabitzer',
    'partey', 'sibo', 'yirenkyi', 'mensah',
    'khamrobekov', 'nasrullaev', 'shukurov', 'sayfiev',
    'fathy', 'laye', 'boudiaf'];
  
  for (const mid of midfielders) {
    if (name.includes(mid)) return 'MIDFIELDER';
  }
  
  // Atacantes conhecidos
  const forwards = ['neymar', 'vinícius', 'vinicius', 'rodrygo', 'raphinha', 'paquetá', 'paqueta',
    'messi', 'di maría', 'alvarez', 'julian álvarez', 'julian alvarez', 'almada',
    'mbappé', 'mbappe', 'griezmann', 'giroud', 'dembele', 'dembélé',
    'kane', 'saka', 'foden', 'palmer', 'sterling',
    'yamal', 'williams', 'nico williams', 'oyarzabal',
    'ronaldo', 'cristiano ronaldo', 'joão félix', 'joao felix', 'bernardo silva', 'leão', 'leao',
    'havertz', 'wirtz', 'musiala', 'sane', 'fullkrug', 'füllkrug',
    'doku', 'trossard', 'de ketelaere',
    'gakpo', 'malen', 'depay',
    'núñez', 'nunez', 'darwin',
    'budimir',
    'el kaabi',
    'son', 'hwang',
    'schick',
    'adams', 'mcginn',
    'fajardo', 'barcenas', 'díaz', 'diaz',
    'wood',
    'david', 'jonathan david',
    'pulisic', 'weah', 'balogun',
    'marmoush', 'salah',
    'jackson', 'mané', 'mane', 'sarr', 'ndiaye',
    'brahim', 'día', 'días', 'diaz',
    'semeyo', 'ayew', 'sulemana',
    'toko ekambi', 'choupo-moting',
    'cunha', 'matheus cunha',
    'henry martín', 'henry martin', 'santiago giménez',
    'jiménez', 'raúl jiménez', 'raul jimenez',
    'enciso', 'avalos', 'almirón', 'almiron',
    'isidor', 'nazon', 'providence',
    'garbett', 'singh',
    'oluwaseyi',
    'touré', 'toure',
    'gyökeres', 'gyokeres',
    'vargas', 'embolo', 'ndoye',
    'harry kane', 'kane',
    'jota', 'diogo jota',
    'rafael leão', 'rafael leao',
    'patrik schick', 'schick',
    'lawrence shankland', 'shankland',
    'carmelo algarañaz', 'marcelo martins',
    'evidence makgopa', 'percy tau'];
  
  for (const fwd of forwards) {
    if (name.includes(fwd)) return 'ATTACKER';
  }
  
  // Default: baseado em padrões de nome
  // Jogadores com "FC", "CF", "ST" no nome geralmente são atacantes
  return 'MIDFIELDER'; // Default
}

// ─────────────────────────────────────────────
//  ALIASES DE NOMES (API vs Real)
// ─────────────────────────────────────────────
const playerNameAliases = {
  // Brasil
  "Vinícius Jr.": ["Vinícius Júnior", "Vinicius Junior", "Vinícius"],
  "Gabriel Magalhães": ["Gabriel Magalhães", "Gabriel", "Gabriel Magalhaes"],
  "Douglas Santos": ["Douglas Santos", "Douglas"],
  "Luis Henrique": ["Luis Henrique"],
  "Bruno Guimarães": ["Bruno Guimarães", "Bruno Guimaraes"],
  "Matheus Cunha": ["Matheus Cunha"],
  "Alisson": ["Alisson Becker", "Alisson"],
  // Argentina
  "Emiliano Martínez": ["Emiliano Martínez", "Emiliano Martinez", "Dibu Martínez"],
  "Cristian Romero": ["Cristian Romero", "Cuti Romero"],
  "Julian Álvarez": ["Julián Álvarez", "Julian Alvarez"],
  "Thiago Almada": ["Thiago Almada"],
  // França
  "Theo Hernandez": ["Théo Hernandez", "Theo Hernandez", "Théo Hernández"],
  "Tchouaméni": ["Aurélien Tchouaméni", "Tchouaméni"],
  "Dembélé": ["Ousmane Dembélé", "Dembélé", "Dembele"],
  "Mbappé": ["Kylian Mbappé", "Mbappé", "Mbappe"],
  // Inglaterra
  "Reece James": ["Reece James"],
  "Declan Rice": ["Declan Rice", "Rice"],
  "Saka": ["Bukayo Saka", "Saka"],
  "Bellingham": ["Jude Bellingham", "Bellingham"],
  "Eze": ["Eberechi Eze", "Eze"],
  "Harry Kane": ["Harry Kane", "Kane"],
  // Espanha
  "Unai Simón": ["Unai Simón", "Unai Simon"],
  "Cubarsí": ["Pau Cubarsí", "Cubarsí", "Cubarsi"],
  "Pedri": ["Pedri"],
  "Rodri": ["Rodri", "Rodrigo Hernández"],
  "Yamal": ["Lamine Yamal", "Yamal"],
  "Oyarzabal": ["Mikel Oyarzabal", "Oyarzabal"],
  "Nico Williams": ["Nico Williams"],
  // Portugal
  "Diogo Costa": ["Diogo Costa"],
  "Cancelo": ["João Cancelo", "Cancelo"],
  "Ruben Dias": ["Rúben Dias", "Ruben Dias"],
  "Inácio": ["Gonçalo Inácio", "Inácio"],
  "Nuno Mendes": ["Nuno Mendes"],
  "João Neves": ["João Neves"],
  "Vitinha": ["Vitinha"],
  "Bruno Fernandes": ["Bruno Fernandes"],
  "Bernardo Silva": ["Bernardo Silva"],
  "Cristiano Ronaldo": ["Cristiano Ronaldo", "Ronaldo"],
  "João Félix": ["João Félix", "Joao Felix"],
  // Alemanha
  "Neuer": ["Manuel Neuer", "Neuer"],
  "Kimmich": ["Joshua Kimmich", "Kimmich"],
  "Tah": ["Jonathan Tah", "Tah"],
  "Schlotterbeck": ["Nico Schlotterbeck", "Schlotterbeck"],
  "Raum": ["David Raum", "Raum"],
  "Pavlovic": ["Aleksandar Pavlović", "Pavlovic"],
  "Goretzka": ["Leon Goretzka", "Goretzka"],
  "Sané": ["Leroy Sané", "Sane"],
  "Musiala": ["Jamal Musiala", "Musiala"],
  "Wirtz": ["Florian Wirtz", "Wirtz"],
  "Havertz": ["Kai Havertz", "Havertz"],
  // Bélgica
  "Courtois": ["Thibaut Courtois", "Courtois"],
  "Castagne": ["Timothy Castagne", "Castagne"],
  "Debast": ["Zeno Debast", "Debast"],
  "Theate": ["Arthur Theate", "Theate"],
  "De Cuyper": ["Maxim De Cuyper", "De Cuyper"],
  "Tielemans": ["Youri Tielemans", "Tielemans"],
  "Onana": ["Amadou Onana", "Onana"],
  "Doku": ["Jérémy Doku", "Doku", "Dokou"],
  "De Bruyne": ["Kevin De Bruyne", "De Bruyne"],
  "Trossard": ["Leandro Trossard", "Trossard"],
  "De Ketelaere": ["Charles De Ketelaere", "De Ketelaere"],
  // Holanda
  "Verbruggen": ["Bart Verbruggen", "Verbruggen"],
  "Dumfries": ["Denzel Dumfries", "Dumfries"],
  "Van Dijk": ["Virgil van Dijk", "Van Dijk"],
  "Aké": ["Nathan Aké", "Ake"],
  "Van de Ven": ["Micky van de Ven", "Van de Ven"],
  "De Jong": ["Frenkie de Jong", "De Jong"],
  "Gravenberch": ["Ryan Gravenberch", "Gravenberch"],
  "Malen": ["Donyell Malen", "Malen"],
  "Reijnders": ["Tijjani Reijnders", "Reijnders"],
  "Gakpo": ["Cody Gakpo", "Gakpo"],
  "Depay": ["Memphis Depay", "Depay"],
  // Uruguai
  "Rochet": ["Sergio Rochet", "Rochet"],
  "Valera": ["Nahitan Nández", "Valera"],
  "Giménez": ["José Giménez", "Giménez"],
  "Ronald Araújo": ["Ronald Araújo", "Araújo", "Araujo"],
  "Olivera": ["Matías Olivera", "Olivera"],
  "Valverde": ["Federico Valverde", "Valverde"],
  "Ugarte": ["Manuel Ugarte", "Ugarte"],
  "Bentancur": ["Rodrigo Bentancur", "Bentancur"],
  "Canobbio": ["Facundo Pellistri", "Canobbio"],
  "Darwin Núñez": ["Darwin Núñez", "Darwin Nunez", "Núñez"],
  "Rodríguez": ["Maximiliano Rodríguez", "Rodríguez"],
  // Croácia
  "Livakovic": ["Dominik Livaković", "Livakovic"],
  "Stanisic": ["Josip Stanišić", "Stanisic"],
  "Sutalo": ["Josip Šutalo", "Sutalo"],
  "Caleta-Car": ["Duje Ćaleta-Car", "Caleta-Car"],
  "Gvardiol": ["Joško Gvardiol", "Gvardiol"],
  "Sucic": ["Luka Sučić", "Sucic"],
  "Modric": ["Luka Modrić", "Modric"],
  "Pasalic": ["Mario Pašalić", "Pasalic"],
  "Kramaric": ["Andrej Kramarić", "Kramaric"],
  "Perisic": ["Ivan Perišić", "Perisic"],
  "Budimir": ["Ante Budimir", "Budimir"],
  // Colômbia
  "Montero": ["Camilo Vargas", "Montero"],
  "Muñoz": ["Daniel Muñoz", "Muñoz"],
  "Sánchez": ["Davinson Sánchez", "Sánchez"],
  "Mina": ["Yerry Mina", "Mina"],
  "Mojica": ["Johan Mojica", "Mojica"],
  "Lerma": ["Jefferson Lerma", "Lerma"],
  "Ríos": ["Kevin Castaño", "Ríos"],
  "Arias": ["Santiago Arias", "Arias"],
  "James Rodríguez": ["James Rodríguez", "James"],
  "Luis Díaz": ["Luis Díaz", "Díaz", "Diaz"],
  "Suárez": ["Mateos Urre", "Suárez"],
  // Marrocos
  "Bono": ["Yassine Bounou", "Bono"],
  "Hakimi": ["Achraf Hakimi", "Hakimi"],
  "Diop": ["Nayef Aguerd", "Diop"],
  "Aguerd": ["Nayef Aguerd", "Aguerd"],
  "Salah-Eddine": ["Abdel Abqar", "Salah-Eddine"],
  "Ounahi": ["Azzedine Ounahi", "Ounahi"],
  "El Aynaoui": ["Bilal El Khannouss", "El Aynaoui"],
  "Brahim Díaz": ["Brahim Díaz", "Brahim"],
  "Saibari": ["Amine Saibari", "Saibari"],
  "Talbi": ["Chadi Talbi", "Talbi"],
  "El Kaabi": ["Ayoub El Kaabi", "El Kaabi"],
  // Coreia do Sul
  "Son": ["Heung-Min Son", "Son"],
  // Tchéquia
  "Soucek": ["Tomáš Souček", "Soucek"],
  "Coufal": ["Vladimír Coufal", "Coufal"],
  "Provod": ["Lukáš Provod", "Provod"],
  "Sulc": ["Pavel Šulc", "Sulc"],
  "Schick": ["Patrik Schick", "Schick"],
  // Escócia
  "McTominay": ["Scott McTominay", "McTominay"],
  "McGinn": ["John McGinn", "McGinn"],
  "Robertson": ["Andy Robertson", "Robertson"],
  "Adams": ["Che Adams", "Adams"],
  // México
  "Edson Álvarez": ["Edson Álvarez", "Edson Alvarez"],
  // Panamá
  "Carrasquilla": ["Adalberto Carrasquilla", "Carrasquilla"],
  "Fajardo": ["José Fajardo", "Fajardo"],
  // Nova Zelândia
  "Chris Wood": ["Chris Wood"],
  // Canadá
  "Eustaquio": ["Stephen Eustáquio", "Eustaquio"],
  "Davies": ["Alphonso Davies", "Davies"],
  "Jonathan David": ["Jonathan David", "David"],
};

// ─────────────────────────────────────────────
//  LISTA DE JOGOS - COPA DO MUNDO 2026 + LIGAS
// ─────────────────────────────────────────────
const matchesList = [
  // ═══════════════════════════════════════════
  //  COPA DO MUNDO 2026 - FASE DE GRUPOS
  // ═══════════════════════════════════════════
  // 11 de junho
  { id: "wc-1",   home: "México",        away: "África do Sul",  league: "Copa do Mundo - Grupo A", date: "11/06/2026", time: "16:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "wc-2",   home: "Coreia do Sul", away: "Tchéquia",       league: "Copa do Mundo - Grupo A", date: "11/06/2026", time: "23:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  // 12 de junho
  { id: "wc-3",   home: "Canadá",        away: "Bósnia",         league: "Copa do Mundo - Grupo B", date: "12/06/2026", time: "16:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "wc-4",   home: "Estados Unidos", away: "Paraguai",      league: "Copa do Mundo - Grupo D", date: "12/06/2026", time: "22:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  // 13 de junho
  { id: "wc-5",   home: "Catar",         away: "Suíça",          league: "Copa do Mundo - Grupo B", date: "13/06/2026", time: "16:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "wc-6",   home: "Brasil",        away: "Marrocos",       league: "Copa do Mundo - Grupo C", date: "13/06/2026", time: "19:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "wc-7",   home: "Haiti",         away: "Escócia",        league: "Copa do Mundo - Grupo C", date: "13/06/2026", time: "22:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "wc-8",   home: "Austrália",     away: "Turquia",        league: "Copa do Mundo - Grupo D", date: "13/06/2026", time: "01:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  // 14 de junho
  { id: "wc-9",   home: "Alemanha",      away: "Curaçao",        league: "Copa do Mundo - Grupo E", date: "14/06/2026", time: "14:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "wc-10",  home: "Holanda",       away: "Japão",          league: "Copa do Mundo - Grupo F", date: "14/06/2026", time: "17:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "wc-11",  home: "Costa do Marfim", away: "Equador",      league: "Copa do Mundo - Grupo E", date: "14/06/2026", time: "20:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "wc-12",  home: "Suécia",        away: "Tunísia",        league: "Copa do Mundo - Grupo F", date: "14/06/2026", time: "23:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  // 15 de junho
  { id: "wc-13",  home: "Espanha",       away: "Cabo Verde",     league: "Copa do Mundo - Grupo H", date: "15/06/2026", time: "13:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "wc-14",  home: "Bélgica",       away: "Egito",          league: "Copa do Mundo - Grupo G", date: "15/06/2026", time: "16:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "wc-15",  home: "Arábia Saudita", away: "Uruguai",       league: "Copa do Mundo - Grupo H", date: "15/06/2026", time: "19:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "wc-16",  home: "Irã",           away: "Nova Zelândia",  league: "Copa do Mundo - Grupo G", date: "15/06/2026", time: "22:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  // 16 de junho
  { id: "wc-17",  home: "França",        away: "Senegal",        league: "Copa do Mundo - Grupo I", date: "16/06/2026", time: "16:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "wc-18",  home: "Iraque",        away: "Noruega",        league: "Copa do Mundo - Grupo I", date: "16/06/2026", time: "19:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "wc-19",  home: "Argentina",     away: "Argélia",        league: "Copa do Mundo - Grupo J", date: "16/06/2026", time: "22:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "wc-20",  home: "Áustria",       away: "Jordânia",       league: "Copa do Mundo - Grupo J", date: "16/06/2026", time: "01:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  // 17 de junho
  { id: "wc-21",  home: "Portugal",      away: "RD Congo",       league: "Copa do Mundo - Grupo K", date: "17/06/2026", time: "14:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "wc-22",  home: "Inglaterra",    away: "Croácia",        league: "Copa do Mundo - Grupo L", date: "17/06/2026", time: "17:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "wc-23",  home: "Gana",          away: "Panamá",         league: "Copa do Mundo - Grupo L", date: "17/06/2026", time: "20:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "wc-24",  home: "Uzbequistão",   away: "Colômbia",       league: "Copa do Mundo - Grupo K", date: "17/06/2026", time: "23:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  // 19 de junho - Brasil x Haiti
  { id: "wc-25",  home: "Escócia",       away: "Marrocos",       league: "Copa do Mundo - Grupo C", date: "19/06/2026", time: "19:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "wc-26",  home: "Brasil",        away: "Haiti",          league: "Copa do Mundo - Grupo C", date: "19/06/2026", time: "21:30", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  // 23 de junho - Rodada 3
  { id: "wc-27",  home: "Brasil",        away: "Escócia",        league: "Copa do Mundo - Grupo C", date: "23/06/2026", time: "16:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "wc-28",  home: "Argentina",     away: "Áustria",        league: "Copa do Mundo - Grupo J", date: "22/06/2026", time: "14:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "wc-29",  home: "França",        away: "Iraque",         league: "Copa do Mundo - Grupo I", date: "22/06/2026", time: "18:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "wc-30",  home: "Portugal",      away: "Colômbia",       league: "Copa do Mundo - Grupo K", date: "27/06/2026", time: "20:30", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "wc-31",  home: "Inglaterra",    away: "Gana",           league: "Copa do Mundo - Grupo L", date: "23/06/2026", time: "17:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "wc-32",  home: "Espanha",       away: "Uruguai",        league: "Copa do Mundo - Grupo H", date: "26/06/2026", time: "21:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },

  // ═══════════════════════════════════════════
  //  PREMIER LEAGUE - INGLATERRA 2025/26
  // ═══════════════════════════════════════════
  { id: "pl-1",  home: "Liverpool",      away: "Arsenal",        league: "Premier League", date: "14/06/2026", time: "13:30", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "pl-2",  home: "Manchester City", away: "Chelsea",       league: "Premier League", date: "14/06/2026", time: "16:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "pl-3",  home: "Newcastle",      away: "Tottenham",      league: "Premier League", date: "14/06/2026", time: "18:30", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "pl-4",  home: "Aston Villa",    away: "Brighton",       league: "Premier League", date: "15/06/2026", time: "14:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "pl-5",  home: "West Ham",       away: "Fulham",         league: "Premier League", date: "15/06/2026", time: "16:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "pl-6",  home: "Bournemouth",    away: "Brentford",      league: "Premier League", date: "15/06/2026", time: "16:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "pl-7",  home: "Crystal Palace", away: "Nottingham",     league: "Premier League", date: "15/06/2026", time: "18:30", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "pl-8",  home: "Manchester United", away: "Wolverhampton", league: "Premier League", date: "16/06/2026", time: "21:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },

  // ═══════════════════════════════════════════
  //  LALIGA - ESPANHA 2025/26
  // ═══════════════════════════════════════════
  { id: "ll-1",  home: "Real Madrid",    away: "Barcelona",      league: "LaLiga", date: "14/06/2026", time: "21:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "ll-2",  home: "Atlético Madrid", away: "Sevilla",       league: "LaLiga", date: "15/06/2026", time: "18:30", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "ll-3",  home: "Real Sociedad",  away: "Athletic Bilbao", league: "LaLiga", date: "15/06/2026", time: "21:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "ll-4",  home: "Real Betis",     away: "Villarreal",     league: "LaLiga", date: "16/06/2026", time: "19:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "ll-5",  home: "Girona",         away: "Valencia",       league: "LaLiga", date: "16/06/2026", time: "21:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },

  // ═══════════════════════════════════════════
  //  SERIE A - ITÁLIA 2025/26
  // ═══════════════════════════════════════════
  { id: "sa-1",  home: "Inter Milão",    away: "AC Milan",       league: "Serie A", date: "14/06/2026", time: "18:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "sa-2",  home: "Juventus",       away: "Napoli",         league: "Serie A", date: "15/06/2026", time: "15:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "sa-3",  home: "Roma",           away: "Lazio",          league: "Serie A", date: "15/06/2026", time: "18:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "sa-4",  home: "Atalanta",       away: "Fiorentina",     league: "Serie A", date: "16/06/2026", time: "18:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },

  // ═══════════════════════════════════════════
  //  BUNDESLIGA - ALEMANHA 2025/26
  // ═══════════════════════════════════════════
  { id: "bl-1",  home: "Bayern Munich",  away: "Borussia Dortmund", league: "Bundesliga", date: "14/06/2026", time: "15:30", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "bl-2",  home: "RB Leipzig",     away: "Bayer Leverkusen", league: "Bundesliga", date: "15/06/2026", time: "15:30", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "bl-3",  home: "Eintracht Frankfurt", away: "VfB Stuttgart", league: "Bundesliga", date: "15/06/2026", time: "18:30", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },

  // ═══════════════════════════════════════════
  //  LIGUE 1 - FRANÇA 2025/26
  // ═══════════════════════════════════════════
  { id: "l1-1",  home: "PSG",            away: "Olympique Marseille", league: "Ligue 1", date: "14/06/2026", time: "21:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "l1-2",  home: "Monaco",         away: "Lyon",           league: "Ligue 1", date: "15/06/2026", time: "17:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "l1-3",  home: "Lille",          away: "Nice",           league: "Ligue 1", date: "15/06/2026", time: "21:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },

  // ═══════════════════════════════════════════
  //  BRASILEIRÃO SÉRIE A 2026
  // ═══════════════════════════════════════════
  { id: "bra-1",  home: "Flamengo",      away: "Palmeiras",      league: "Brasileirão Série A", date: "15/06/2026", time: "16:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "bra-2",  home: "São Paulo",     away: "Corinthians",    league: "Brasileirão Série A", date: "15/06/2026", time: "18:30", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "bra-3",  home: "Botafogo",      away: "Fluminense",     league: "Brasileirão Série A", date: "15/06/2026", time: "21:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "bra-4",  home: "Atlético-MG",   away: "Cruzeiro",       league: "Brasileirão Série A", date: "16/06/2026", time: "19:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "bra-5",  home: "Grêmio",        away: "Internacional",  league: "Brasileirão Série A", date: "16/06/2026", time: "21:30", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "bra-6",  home: "Bahia",         away: "Vasco",          league: "Brasileirão Série A", date: "16/06/2026", time: "19:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },

  // ═══════════════════════════════════════════
  //  LIBERTADORES 2026 - OITAVAS
  // ═══════════════════════════════════════════
  { id: "lib-1",  home: "Flamengo",      away: "River Plate",    league: "Libertadores - Oitavas", date: "17/06/2026", time: "21:30", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
  { id: "lib-2",  home: "Palmeiras",     away: "Boca Juniors",   league: "Libertadores - Oitavas", date: "18/06/2026", time: "21:30", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },

  // ═══════════════════════════════════════════
  //  CHAMPIONS LEAGUE 2025/26 - FINAL
  // ═══════════════════════════════════════════
  { id: "ucl-1",  home: "Real Madrid",   away: "Arsenal",        league: "Champions League - Final", date: "31/05/2026", time: "16:00", status: "Aguardando", score: "0-0", timeElapsed: "00:00" },
];

// Helper: infere métricas aproximadas das odds quando não há stats
function ensureMetrics(player) {
  if (!player.metrics) player.metrics = {};
  const keys = ['scorer', 'assist', 'header', 'outsideBox', 'card'];
  // Se todas as métricas são 0, o jogador não tinha stats → derivar das odds
  const allZero = keys.every(k => !player.metrics[k]);
  if (allZero) {
    for (const key of keys) {
      if (player.markets?.[key] != null) {
        player.metrics[key] = Math.max(0, Math.min(100, Math.round(100 - player.markets[key] * 3)));
      } else {
        player.metrics[key] = 0;
      }
    }
  } else {
    // Preencher métricas individuais faltantes
    for (const key of keys) {
      if (player.metrics[key] === undefined || player.metrics[key] === null) {
        if (player.markets?.[key] != null) {
          player.metrics[key] = Math.max(0, Math.min(100, Math.round(100 - player.markets[key] * 3)));
        } else {
          player.metrics[key] = 0;
        }
      }
    }
  }
  return player;
}

// ─────────────────────────────────────────────
//  ENDPOINTS
// ─────────────────────────────────────────────

app.get('/api/players', async (req, res) => {
  const { team } = req.query;
  if (!team) return res.status(400).json({ error: "Parâmetro 'team' é obrigatório." });

  const normalizedTeam = team.trim().toLowerCase();

  // Helper: normalizar posição
  function normalizePos(p) {
    if (p.pos) return p.pos;
    const pos = (p.position || '').toLowerCase();
    if (pos.includes('attack') || pos === 'f') return 'FWD';
    if (pos.includes('defend') || pos === 'd') return 'DEF';
    if (pos.includes('midfield') || pos === 'm') return 'MID';
    if (pos.includes('goal')) return 'GK';
    return 'MID';
  }

  // Garantir que todos os jogadores tenham métricas
  const fillMetrics = (players) => players.map(p => ensureMetrics(p));

  // Cache em disco (jogadores da API)
  if (diskCache[normalizedTeam]) {
    const cached = fillMetrics(diskCache[normalizedTeam].map(p => ({ ...p, pos: normalizePos(p) })));
    return res.json({ players: cached, source: 'cache' });
  }

  // API externa (e salva no cache)
  const apiPlayers = await fetchSquadFromApiFootball(team);
  if (apiPlayers?.length > 0) {
    // Garantir que todos têm pos normalizado
    apiPlayers.forEach(p => { p.pos = normalizePos(p); });

    // Mescla dados da API com dados curados locais (especialidades + odds precisas)
    const localTeam = playersData[team];
    if (localTeam?.players?.length > 0) {
      const localMap = {};
      for (const p of localTeam.players) {
        const key = p.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        localMap[key] = p;
      }
      for (const p of apiPlayers) {
        const key = p.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (localMap[key]) {
          p.specialties = localMap[key].specialties;
          p.markets = localMap[key].markets;
          p.pos = localMap[key].pos || p.pos;
        }
      }
    }
    fillMetrics(apiPlayers);
    diskCache[normalizedTeam] = apiPlayers;
    saveDiskCache();
    return res.json({ players: apiPlayers, source: 'api' });
  }

  // Fallback: dados locais se API falhar
  const localData = playersData[team];
  if (localData?.players?.length > 0) {
    const players = fillMetrics(localData.players.map(p => ({ ...p, pos: normalizePos(p) })));
    return res.json({ players, source: 'local' });
  }

  return res.json({ players: [], source: 'none' });
});

app.get('/api/teams', (req, res) => {
  const local = Object.keys(playersData).map(name => ({ name, source: 'local' }));
  const cached = Object.keys(diskCache).map(name => ({ name: name, source: 'cache' }));
  const all = [...local];
  cached.forEach(c => { if (!all.find(l => l.name.toLowerCase() === c.name)) all.push(c); });
  res.json(all);
});

// ─── Limpar cache (força re-busca da API) ─────
app.post('/api/clear-cache', (req, res) => {
  diskCache = {};
  saveDiskCache();
  console.log('[Cache] Cache limpo manualmente.');
  res.json({ ok: true, message: 'Cache limpo com sucesso.' });
});

// ─── Status do prefetch ───────────────────────
app.get('/api/prefetch-status', (req, res) => res.json(prefetchStatus));

// ─── Cache info ───────────────────────────────
app.get('/api/cache-info', (req, res) => {
  const cachedTeams = Object.keys(diskCache);
  const wcTotal = Object.keys(worldCupTeams2026).length;
  const wcCached = Object.keys(worldCupTeams2026)
    .filter(t => diskCache[t.trim().toLowerCase()]).length;

  res.json({
    totalCached: cachedTeams.length,
    wcTotal,
    wcCached,
    teams: cachedTeams
  });
});

// ─── Prefetch de TODOS os 48 times da Copa ───
app.post('/api/prefetch-all-wc', async (req, res) => {
  if (prefetchStatus.running) {
    return res.json({ message: 'Prefetch já em andamento.', status: prefetchStatus });
  }

  const teamList = Object.keys(worldCupTeams2026);
  prefetchStatus = { running: true, total: teamList.length, done: 0, current: '', errors: [] };
  res.json({ message: `Prefetch iniciado para ${teamList.length} times. Acompanhe em /api/prefetch-status.` });

  // Roda em background (sem bloquear resposta)
  (async () => {
    for (const teamPT of teamList) {
      prefetchStatus.current = teamPT;
      const normalized = teamPT.trim().toLowerCase();

      if (diskCache[normalized]) {
        console.log(`[Prefetch] "${teamPT}" já no cache. Pulando.`);
        prefetchStatus.done++;
        continue;
      }

      try {
        const result = await fetchSquadFromApiFootball(teamPT);
        if (!result) prefetchStatus.errors.push(teamPT);
      } catch (e) {
        prefetchStatus.errors.push(teamPT);
      }

      prefetchStatus.done++;
      // Respeita limite: ~10 req/min → ~1 req/6s. Fazemos 3 req/time → 18s entre times
      await new Promise(r => setTimeout(r, 6500));
    }

    prefetchStatus.running = false;
    prefetchStatus.current = '';
    console.log(`[Prefetch] Concluído! ${prefetchStatus.done} times processados, ${prefetchStatus.errors.length} erros.`);
    saveDiskCache();
  })();
});

// ─── Limpar cache de um time (forçar re-fetch) ─
app.delete('/api/cache/:team', (req, res) => {
  const team = decodeURIComponent(req.params.team).trim().toLowerCase();
  if (diskCache[team]) {
    delete diskCache[team];
    saveDiskCache();
    res.json({ message: `Cache de "${team}" removido. Próxima consulta buscará da API.` });
  } else {
    res.json({ message: `Time "${team}" não estava no cache.` });
  }
});

// ─────────────────────────────────────────────
//  ATUALIZACAO AUTOMATICA DE LINEUPS (Goal.com)
// ─────────────────────────────────────────────

let lastLineupUpdate = null;
let lineupUpdateRunning = false;

async function refreshLineupsFromGoal() {
  if (lineupUpdateRunning) return { message: 'Atualização já em andamento.' };
  lineupUpdateRunning = true;

  try {
    const { main } = require('./scripts/auto-update-lineups');
    const result = await main();

    // Atualizar confirmedStarters em memória
    if (result && Object.keys(result).length > 0) {
      Object.assign(confirmedStarters, result);
      lastLineupUpdate = new Date().toISOString();
      console.log(`[Lineups] Atualizado: ${Object.keys(result).length} times`);
    }

    lineupUpdateRunning = false;
    return { message: 'Lineups atualizados com sucesso!', count: Object.keys(result || {}).length, updatedAt: lastLineupUpdate };
  } catch (e) {
    lineupUpdateRunning = false;
    console.error('[Lineups] Erro na atualização:', e.message);
    return { message: `Erro: ${e.message}` };
  }
}

// Agendar atualização automática a cada 6 horas (0 */6 * * *)
cron.schedule('0 */6 * * *', () => {
  console.log('[Cron] Iniciando atualização automática de lineups...');
  refreshLineupsFromGoal().then(result => {
    console.log('[Cron] Resultado:', result.message);
  });
});

app.post('/api/refresh-lineups', async (req, res) => {
  const result = await refreshLineupsFromGoal();
  res.json(result);
});

app.get('/api/lineups-status', (req, res) => {
  res.json({
    totalTeams: Object.keys(confirmedStarters).length,
    lastUpdate: lastLineupUpdate,
    running: lineupUpdateRunning,
  });
});

// ─────────────────────────────────────────────
//  TELEGRAM
// ─────────────────────────────────────────────
app.post('/api/send-telegram', async (req, res) => {
  const { botToken, chatId, text, image } = req.body;
  if (!botToken || !chatId) return res.status(400).json({ error: 'Token e chatId são obrigatórios.' });

  try {
    if (image && image.startsWith('data:image')) {
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const blob = new Blob([buffer], { type: 'image/png' });
      const formData = new FormData();
      formData.append('chat_id', chatId);
      formData.append('photo', blob, 'bilhete.png');
      const caption = text.length > 1024 ? text.substring(0, 1000) + '...' : text;
      formData.append('caption', caption);
      formData.append('parse_mode', 'HTML');

      const r = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, { method: 'POST', body: formData });
      const result = await r.json();
      if (!result.ok) throw new Error(result.description);

      if (text.length > 1024) {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
        });
      }
      return res.json({ success: true, message: 'Bilhete enviado!' });
    } else {
      const r = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
      });
      const result = await r.json();
      if (!result.ok) throw new Error(result.description);
      return res.json({ success: true, message: 'Mensagem enviada!' });
    }
  } catch (err) {
    console.error('[Telegram] Erro:', err.message);
    return res.status(500).json({ error: `Erro ao enviar: ${err.message}` });
  }
});

// ─────────────────────────────────────────────
//  PREFETCH DE JOGOS DA API (atualização diária)
// ─────────────────────────────────────────────
const FIXTURES_CACHE_FILE = path.join(__dirname, 'data', 'fixtures_cache.json');
let cachedFixtures = [];
let lastFixturesUpdate = null;

// Carregar cache de fixtures
try {
  if (fs.existsSync(FIXTURES_CACHE_FILE)) {
    const data = JSON.parse(fs.readFileSync(FIXTURES_CACHE_FILE, 'utf8'));
    cachedFixtures = data.fixtures || [];
    lastFixturesUpdate = data.lastUpdate || null;
    console.log(`[Fixtures] ${cachedFixtures.length} jogos carregados do cache.`);
  }
} catch (e) {
  console.error('[Fixtures] Erro ao ler cache:', e.message);
}

function saveFixturesCache() {
  try {
    fs.mkdirSync(path.dirname(FIXTURES_CACHE_FILE), { recursive: true });
    fs.writeFileSync(FIXTURES_CACHE_FILE, JSON.stringify({
      fixtures: cachedFixtures,
      lastUpdate: lastFixturesUpdate
    }, null, 2), 'utf8');
  } catch (e) {
    console.error('[Fixtures] Erro ao salvar cache:', e.message);
  }
}

// Buscar jogos de ligas específicas
const leagueIds = {
  'Premier League': 39,
  'LaLiga': 140,
  'Serie A': 135,
  'Bundesliga': 78,
  'Ligue 1': 61,
  'Brasil': 71,
  'Libertadores': 13,
  'Champions League': 2,
  'Copa do Mundo': 1
};

async function fetchFixturesFromApi() {
  const apiKey = process.env.API_FOOTBALL_KEY;
  if (!apiKey || apiKey === 'SUA_CHAVE_AQUI' || apiKey.length < 10) {
    console.log('[Fixtures] API key não configurada.');
    return;
  }

  console.log('[Fixtures] Buscando jogos da API...');
  const allFixtures = [];

  for (const [leagueName, leagueId] of Object.entries(leagueIds)) {
    try {
      const res = await fetch(
        `https://v3.football.api-sports.io/fixtures?league=${leagueId}&season=2025&next=10`,
        { headers: { 'x-apisports-key': apiKey } }
      );
      const data = await res.json();

      if (data.response) {
        for (const f of data.response) {
          const date = f.fixture.date?.split('T')[0] || '';
          const time = f.fixture.date?.split('T')[1]?.substring(0, 5) || '00:00';
          
          allFixtures.push({
            id: `api-${f.fixture.id}`,
            home: f.teams.home.name,
            away: f.teams.aways?.name || f.teams.away.name,
            league: leagueName,
            date: date.split('-').reverse().join('/'),
            time: time,
            status: f.fixture.status?.short || 'NS',
            score: `${f.goals.home || 0}-${f.goals.away || 0}`,
            timeElapsed: f.fixture.status?.elapsed ? `${f.fixture.status.elapsed}'` : '00:00'
          });
        }
      }
      
      // Rate limit: 1 requisição por segundo
      await new Promise(r => setTimeout(r, 1500));
    } catch (err) {
      console.error(`[Fixtures] Erro para ${leagueName}:`, err.message);
    }
  }

  if (allFixtures.length > 0) {
    cachedFixtures = allFixtures;
    lastFixturesUpdate = new Date().toISOString();
    saveFixturesCache();
    console.log(`[Fixtures] ${allFixtures.length} jogos salvos no cache.`);
  }
}

// Endpoint para buscar jogos (combina hardcoded + API)
app.get('/api/matches', (req, res) => {
  // Se tem cache de fixtures da API, usar ele + hardcoded
  if (cachedFixtures.length > 0) {
    // Juntar hardcoded com API, sem duplicar
    const allIds = new Set(matchesList.map(m => m.id));
    const apiOnly = cachedFixtures.filter(m => !allIds.has(m.id));
    return res.json([...matchesList, ...apiOnly]);
  }
  res.json(matchesList);
});

// Endpoint para forçar atualização dos jogos
app.post('/api/refresh-fixtures', async (req, res) => {
  try {
    await fetchFixturesFromApi();
    res.json({ 
      success: true, 
      message: `${cachedFixtures.length} jogos atualizados.`,
      lastUpdate: lastFixturesUpdate
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint para ver status
app.get('/api/fixtures-status', (req, res) => {
  res.json({
    total: cachedFixtures.length,
    lastUpdate: lastFixturesUpdate,
    hardcoded: matchesList.length
  });
});

// Auto-atualizar ao iniciar (se cache estiver velho ou vazio)
if (cachedFixtures.length === 0 || !lastFixturesUpdate) {
  console.log('[Fixtures] Cache vazio, buscando dados iniciais...');
  fetchFixturesFromApi();
}

// Atualizar a cada 6 horas
setInterval(() => {
  console.log('[Fixtures] Atualização periódica...');
  fetchFixturesFromApi();
}, 6 * 60 * 60 * 1000);

app.listen(PORT, () => console.log(`Servidor rodando com sucesso na porta ${PORT}`));
