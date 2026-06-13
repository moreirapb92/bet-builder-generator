(async () => {
  const teams = ['Austrália', 'Turquia'];
  for (const team of teams) {
    console.log(`\n=== ${team} ===`);
    try {
      const r = await fetch(`http://localhost:3001/api/players?team=${encodeURIComponent(team)}`);
      const d = await r.json();
      const players = d.players || d;
      console.log(`Total: ${players.length}`);
      players.forEach(p => console.log(`  ${p.name} | ${p.pos} | ${p.specialties.join(', ')}`));
    } catch(e) { console.log('ERRO:', e.message); }
  }
})();
