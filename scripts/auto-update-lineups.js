const axios = require('axios');
const fs = require('fs');
const path = require('path');

const GOAL_URL = 'https://www.goal.com/en-us/lists/probable-line-ups-world-cup-2026-starters-and-expected-starting-xi-of-the-48-national-teams/blt0d21c342d47a4cc2';

const teamNameMap = {
  'ALGERIA': 'Argélia',
  'SAUDI ARABIA': 'Arábia Saudita',
  'ARGENTINA': 'Argentina',
  'AUSTRALIA': 'Austrália',
  'AUSTRIA': 'Áustria',
  'BELGIUM': 'Bélgica',
  'BOSNIA': 'Bósnia',
  'BRAZIL': 'Brasil',
  'CANADA': 'Canadá',
  'CAPE VERDE': 'Cabo Verde',
  'COLOMBIA': 'Colômbia',
  'SOUTH KOREA': 'Coreia do Sul',
  'IVORY COAST': 'Costa do Marfim',
  'CURACAO': 'Curaçao',
  'CROATIA': 'Croácia',
  'ECUADOR': 'Equador',
  'EGYPT': 'Egito',
  'FRANCE': 'França',
  'GERMANY': 'Alemanha',
  'GHANA': 'Gana',
  'JAPAN': 'Japão',
  'JORDAN': 'Jordânia',
  'HAITI': 'Haiti',
  'ENGLAND': 'Inglaterra',
  'IRAN': 'Irã',
  'IRAQ': 'Iraque',
  'MOROCCO': 'Marrocos',
  'MEXICO': 'México',
  'NORWAY': 'Noruega',
  'NEW ZEALAND': 'Nova Zelândia',
  'NETHERLANDS': 'Holanda',
  'PANAMA': 'Panamá',
  'PARAGUAY': 'Paraguai',
  'PORTUGAL': 'Portugal',
  'QATAR': 'Catar',
  'SCOTLAND': 'Escócia',
  'SPAIN': 'Espanha',
  'UNITED STATES': 'Estados Unidos',
  'SOUTH AFRICA': 'África do Sul',
  'SWEDEN': 'Suécia',
  'SWISS': 'Suíça',
  'TUNISIA': 'Tunísia',
  'TURKEY': 'Turquia',
  'URUGUAY': 'Uruguai',
  'UZBEKISTAN': 'Uzbequistão',
  'CZECH REPUBLIC': 'Tchéquia',
  'DEMOCRATIC REPUBLIC OF THE CONGO': 'RD Congo',
  'SENEGAL': 'Senegal',
};

const serbiaLineup = [
  'Pavlovic', 'Milenkovic', 'Gudelj',
  'Zivkovic', 'Maksimovic', 'Lucic',
  'Tadic', 'Jovic', 'Vlahovic', 'Mitrovic'
];

const gkNames = new Set([
  'Zidane', 'Al-Aqidi', 'Martinez', 'Ryan', 'A. Schlager', 'Courtois', 'Vasilj', 'Alisson',
  'Crepeau', 'Voziha', 'Montero', 'Seung-gyu Kim', 'Fofana', 'Room', 'Livakovic', 'Galindez',
  'El Shenawy', 'Maignan', 'Neuer', 'Asare', 'Suzuki', 'Abulaila', 'Placide', 'Pickford',
  'Beyranvand', 'Hassan', 'Bono', 'Rangel', 'Nyland', 'Crocombe', 'Verbruggen', 'Mosquera',
  'Gill', 'Costa', 'Barsham', 'Gordon', 'Simon', 'Freese', 'Williams', 'Nordfeldt', 'Kobel',
  'Dahmen', 'Cakir', 'Rochet', 'Nematov', 'Hornicek', 'Mpasi', 'Mendy'
]);

function removeGK(players) {
  if (!players || players.length === 0) return [];
  if (gkNames.has(players[0])) return players.slice(1);
  return players;
}

async function fetchGoalData() {
  console.log('Fetching Goal.com page...');
  const res = await axios.get(GOAL_URL, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    timeout: 30000
  });

  const $ = require('cheerio').load(res.data);
  const nextDataScript = $('script#__NEXT_DATA__').html();
  if (!nextDataScript) {
    throw new Error('__NEXT_DATA__ not found in page');
  }

  const data = JSON.parse(nextDataScript);
  const content = data.props?.pageProps?.content;
  if (!content) {
    throw new Error('pageProps.content not found in __NEXT_DATA__');
  }

  return content;
}

function parseLineups(content) {
  const slides = content.slideList?.slides || [];
  console.log(`Found ${slides.length} slides`);

  const lineups = {};

  slides.forEach(slide => {
    const headline = slide.headline || '';
    const bodyHtml = slide.body?.body || '';

    // Try standard pattern: "PROBABLE TEAM NAME LINEUP"
    let match = headline.match(/PROBABLE\s+(.+?)\s+LINEUP/i);

    // Try alternate pattern: "PROBABLE LINEUP TEAM NAME" (Czech Republic, DR Congo)
    if (!match) {
      match = headline.match(/PROBABLE\s+LINEUP\s+(.+)/i);
    }

    if (match) {
      const team = match[1].trim();

      // Standard format: <strong>(4-2-3-1): Player1; Player2...</strong>
      let playerMatch = bodyHtml.match(/<strong>\([^)]+\):\s*([^<]+)<\/strong>/);

      // Alternate format: <strong>(4-2-3-1)</strong></b><span>: Player1; Player2...</span> (Senegal)
      if (!playerMatch) {
        playerMatch = bodyHtml.match(/<\/strong><\/b><span>:\s*([^<]+)<\/span>/);
      }

      if (playerMatch) {
        const playersStr = playerMatch[1].trim();
        const players = playersStr.split(/;\s*/).flatMap(p => p.split(/,\s*/)).map(p => p.trim());
        const noGK = removeGK(players);
        lineups[team] = noGK;
        console.log(`  ${team}: ${noGK.length} players`);
      }
    }
  });

  console.log(`Parsed ${Object.keys(lineups).length} team lineups`);
  return lineups;
}

function mapToLocalNames(lineups) {
  const result = {};

  for (const [goalTeam, players] of Object.entries(lineups)) {
    const ourName = teamNameMap[goalTeam];
    if (ourName) {
      result[ourName] = players;
    } else {
      console.log(`  ⚠️ No mapping for: ${goalTeam}`);
    }
  }

  // Add Serbia manually
  result['Sérvia'] = serbiaLineup;
  console.log(`  Sérvia: ${serbiaLineup.length} players (manual)`);

  // Override Brazil with confirmed lineup
  result['Brasil'] = [
    'Ibañez', 'Marquinhos', 'Gabriel Magalhães', 'Douglas Santos',
    'Casemiro', 'Bruno Guimarães', 'Lucas Paquetá',
    'Raphinha', 'Vinícius Jr.', 'Igor Thiago'
  ];
  console.log(`  Brasil: confirmed lineup (overridden)`);

  return result;
}

function generateCode(confirmedStarters) {
  let code = '// Auto-generated by auto-update-lineups.js\n';
  code += 'const confirmedStarters = {\n';
  for (const [team, players] of Object.entries(confirmedStarters)) {
    code += `  "${team}": [\n`;
    code += `    ${players.map(p => `"${p}"`).join(', ')}\n`;
    code += `  ],\n`;
  }
  code += '};\n';
  return code;
}

async function main() {
  // 1. Fetch Goal.com page
  let content;
  try {
    content = await fetchGoalData();
  } catch (e) {
    console.error('Failed to fetch Goal.com:', e.message);
    console.log('Loading cached goal-content.json as fallback...');
    if (fs.existsSync('goal-content.json')) {
      const raw = fs.readFileSync('goal-content.json', 'utf8');
      content = JSON.parse(raw);
    } else {
      throw new Error('No cached data available');
    }
  }

  // Save raw content for debugging
  fs.writeFileSync(path.join(__dirname, '..', 'data', 'goal-content.json'), JSON.stringify(content, null, 2));

  // 2. Parse lineups
  const lineups = parseLineups(content);

  // 3. Map to local team names
  const confirmedStarters = mapToLocalNames(lineups);

  // 4. Save as JSON
  const jsonPath = path.join(__dirname, '..', 'data', 'lineups.json');
  fs.writeFileSync(jsonPath, JSON.stringify(confirmedStarters, null, 2));
  console.log(`\nSaved ${Object.keys(confirmedStarters).length} teams to ${jsonPath}`);

  // 5. Generate JS code
  const code = generateCode(confirmedStarters);
  const codePath = path.join(__dirname, '..', 'data', 'lineups-code.js');
  fs.writeFileSync(codePath, code);
  console.log(`Generated code saved to ${codePath}`);

  return confirmedStarters;
}

if (require.main === module) {
  main()
    .then(result => {
      console.log('\n✅ Update complete!');
      process.exit(0);
    })
    .catch(err => {
      console.error('\n❌ Update failed:', err.message);
      process.exit(1);
    });
}

module.exports = { main };
