/**
 * BASE DE JOGADORES - Copa do Mundo 2026 + Principais Clubes
 * 
 * specialties: lista das especialidades REAIS do jogador (baseadas em histórico):
 *   "scorer"     → Marca gols com frequência (qualquer forma)
 *   "header"     → Especialista em gol de CABEÇA (jogadores altos, com boa movimentação aérea)
 *   "outsideBox" → Especialista em gol de FORA DA ÁREA (chutadores de longe)
 *   "assist"     → Dá assistências com frequência (criadores de jogo)
 *   "card"       → Recebe cartões com frequência (agressivos/combativos)
 * 
 * markets: odds aproximadas para cada mercado
 */

const playersData = {

  // ============================================================
  //  SELEÇÕES COPA DO MUNDO 2026
  // ============================================================

  "Brasil": {
    type: "national",
    players: [
      // Vinicius Jr. → gols pelo lado, fora da área, assistências. NÃO é de cabeça
      { name: "Vinícius Jr.", pos: "FWD", specialties: ["scorer", "outsideBox", "assist"], markets: { scorer: 2.20, header: 15.00, outsideBox: 7.00, assist: 2.80, card: 4.50 } },
      // Rodrygo → versátil, marca e dá assistência
      { name: "Rodrygo", pos: "FWD", specialties: ["scorer", "assist", "outsideBox"], markets: { scorer: 2.50, header: 13.00, outsideBox: 7.50, assist: 3.00, card: 5.00 } },
      // Raphinha → muito ativo nas assistências e chutes de fora
      { name: "Raphinha", pos: "FWD", specialties: ["outsideBox", "assist", "scorer"], markets: { scorer: 2.80, header: 16.00, outsideBox: 5.50, assist: 2.50, card: 4.00 } },
      // Matheus Cunha → atacante do Wolves, rápido, gols dentro da área e assistências
      { name: "Matheus Cunha", pos: "FWD", specialties: ["scorer", "assist"], markets: { scorer: 2.60, header: 11.00, outsideBox: 9.00, assist: 3.00, card: 3.50 } },
      // Lucas Paquetá → meia criativo, assistências e às vezes cartões
      { name: "Lucas Paquetá", pos: "MID", specialties: ["assist", "outsideBox", "card"], markets: { scorer: 4.00, header: 11.00, outsideBox: 9.00, assist: 3.00, card: 2.30 } },
      // Bruno Guimarães → meia combativo, muitos cartões
      { name: "Bruno Guimarães", pos: "MID", specialties: ["card", "outsideBox"], markets: { scorer: 6.00, header: 13.00, outsideBox: 10.00, assist: 4.50, card: 2.00 } },
      // Casemiro → volante, chutes de longe e gol de cabeça em bola parada
      { name: "Casemiro", pos: "MID", specialties: ["header", "card", "outsideBox"], markets: { scorer: 6.00, header: 7.00, outsideBox: 9.00, assist: 6.00, card: 2.00 } },
      // Marquinhos → CABEÇA em escanteios e faltas. Zagueiro goleador aéreo
      { name: "Marquinhos", pos: "DEF", specialties: ["header", "card"], markets: { scorer: 9.00, header: 8.00, outsideBox: 25.00, assist: 12.00, card: 3.50 } },
      // Gabriel Magalhães → CABEÇA em bolas paradas
      { name: "Gabriel Magalhães", pos: "DEF", specialties: ["header", "card"], markets: { scorer: 8.50, header: 7.50, outsideBox: 28.00, assist: 14.00, card: 3.00 } },
      // Danilo → lateral, defensivo, poucas assistências. Mais cartão
      { name: "Danilo", pos: "DEF", specialties: ["card"], markets: { scorer: 12.00, header: 15.00, outsideBox: 25.00, assist: 6.50, card: 2.20 } },
      // Douglas Santos → lateral, defensivo, poucas assistências
      { name: "Douglas Santos", pos: "DEF", specialties: ["card"], markets: { scorer: 13.00, header: 16.00, outsideBox: 26.00, assist: 7.00, card: 2.10 } }
    ]
  },

  "Argentina": {
    type: "national",
    players: [
      // Messi → fora da área e assistências. Menor de estatura, não é de cabeça
      { name: "Lionel Messi", pos: "FWD", specialties: ["scorer", "outsideBox", "assist"], markets: { scorer: 1.80, header: 22.00, outsideBox: 4.00, assist: 2.00, card: 7.00 } },
      // Lautaro → CABEÇA e gols dentro da área. Centro-avante físico
      { name: "Lautaro Martínez", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.10, header: 6.50, outsideBox: 12.00, assist: 4.00, card: 4.20 } },
      // Julián Álvarez → gols variados, fora da área também
      { name: "Julian Álvarez", pos: "FWD", specialties: ["scorer", "outsideBox", "assist"], markets: { scorer: 2.30, header: 10.00, outsideBox: 7.00, assist: 3.00, card: 4.50 } },
      // Mac Allister → meia box-to-box, assistências e cartões
      { name: "Alexis Mac Allister", pos: "MID", specialties: ["outsideBox", "assist", "card"], markets: { scorer: 4.20, header: 12.00, outsideBox: 7.00, assist: 3.50, card: 2.80 } },
      // De Paul → transição, cartões, assistências
      { name: "Rodrigo de Paul", pos: "MID", specialties: ["card", "assist"], markets: { scorer: 6.00, header: 16.00, outsideBox: 11.00, assist: 3.80, card: 1.95 } },
      // Enzo Fernández → chutes de fora da área e combativo
      { name: "Enzo Fernández", pos: "MID", specialties: ["outsideBox", "card"], markets: { scorer: 5.00, header: 14.00, outsideBox: 7.00, assist: 4.00, card: 2.40 } }
    ]
  },

  "França": {
    type: "national",
    players: [
      // Mbappé → velocidade, chutes potentes, fora da área e dentro também
      { name: "Kylian Mbappé", pos: "FWD", specialties: ["scorer", "outsideBox", "assist"], markets: { scorer: 1.70, header: 13.00, outsideBox: 5.00, assist: 2.50, card: 5.50 } },
      // Griezmann → ESPECIALISTA em assistências, fora da área e pênaltis
      { name: "Antoine Griezmann", pos: "FWD", specialties: ["assist", "outsideBox", "scorer"], markets: { scorer: 2.70, header: 15.00, outsideBox: 6.50, assist: 2.20, card: 3.80 } },
      // Giroud → ESPECIALISTA EM CABEÇA. Um dos maiores goleadores aéreos da história
      { name: "Olivier Giroud", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.40, header: 4.00, outsideBox: 16.00, assist: 5.00, card: 5.00 } },
      // Dembélé → dribla e cria, muitas assistências
      { name: "Ousmane Dembélé", pos: "FWD", specialties: ["assist", "outsideBox"], markets: { scorer: 3.20, header: 18.00, outsideBox: 8.00, assist: 2.50, card: 4.00 } },
      // Tchouaméni → volante, cartões e ocasionalmente de fora
      { name: "Aurélien Tchouaméni", pos: "MID", specialties: ["card", "outsideBox"], markets: { scorer: 6.50, header: 9.00, outsideBox: 8.00, assist: 6.00, card: 2.20 } },
      // Theo Hernandez → lateral, mais defensivo
      { name: "Theo Hernandez", pos: "DEF", specialties: ["header", "card"], markets: { scorer: 7.00, header: 9.00, outsideBox: 18.00, assist: 8.00, card: 2.80 } }
    ]
  },

  "Inglaterra": {
    type: "national",
    players: [
      // Harry Kane → CABEÇA e gols. Um dos melhores centroavantes aéreos da atualidade
      { name: "Harry Kane", pos: "FWD", specialties: ["scorer", "header", "assist"], markets: { scorer: 1.85, header: 4.00, outsideBox: 10.00, assist: 3.50, card: 5.00 } },
      // Bellingham → gols de tudo um pouco, box-to-box
      { name: "Jude Bellingham", pos: "MID", specialties: ["scorer", "assist", "outsideBox"], markets: { scorer: 2.60, header: 9.00, outsideBox: 8.00, assist: 2.80, card: 2.60 } },
      // Saka → pela direita, assistências e chutes de longe
      { name: "Bukayo Saka", pos: "FWD", specialties: ["scorer", "outsideBox", "assist"], markets: { scorer: 2.80, header: 17.00, outsideBox: 6.50, assist: 2.40, card: 4.50 } },
      // Foden → ESPECIALISTA EM FORA DA ÁREA. Belo chute
      { name: "Phil Foden", pos: "FWD", specialties: ["outsideBox", "assist", "scorer"], markets: { scorer: 3.00, header: 19.00, outsideBox: 5.00, assist: 2.30, card: 4.80 } },
      // Declan Rice → volante, combativo, cartões
      { name: "Declan Rice", pos: "MID", specialties: ["card", "outsideBox"], markets: { scorer: 5.50, header: 11.00, outsideBox: 9.50, assist: 4.00, card: 2.50 } },
      // Cole Palmer → assist e fora da área, herdeiro do papel de Foden
      { name: "Cole Palmer", pos: "MID", specialties: ["scorer", "assist", "outsideBox"], markets: { scorer: 2.40, header: 18.00, outsideBox: 6.00, assist: 2.20, card: 4.00 } }
    ]
  },

  "Espanha": {
    type: "national",
    players: [
      // Lamine Yamal → jovem talento, chutes de fora, criação e assistências
      { name: "Lamine Yamal", pos: "FWD", specialties: ["outsideBox", "assist", "scorer"], markets: { scorer: 3.10, header: 22.00, outsideBox: 6.50, assist: 2.20, card: 5.00 } },
      // Morata → CABEÇA, centroavante físico e aéreo
      { name: "Álvaro Morata", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.20, header: 4.50, outsideBox: 15.00, assist: 4.50, card: 4.00 } },
      // Nico Williams → pela esquerda, driblador e assistências
      { name: "Nico Williams", pos: "FWD", specialties: ["assist", "outsideBox", "scorer"], markets: { scorer: 3.20, header: 18.00, outsideBox: 8.00, assist: 2.50, card: 4.50 } },
      // Dani Olmo → criador, gols de fora e assistências
      { name: "Dani Olmo", pos: "MID", specialties: ["scorer", "outsideBox", "assist"], markets: { scorer: 2.90, header: 15.00, outsideBox: 6.00, assist: 2.80, card: 3.50 } },
      // Rodri → volante dominante, chutes de longe e cabeceios em bola parada
      { name: "Rodri", pos: "MID", specialties: ["card", "outsideBox", "header"], markets: { scorer: 4.50, header: 9.00, outsideBox: 7.00, assist: 4.00, card: 2.20 } },
      // Pedri → meia técnico, mais assistências que gols
      { name: "Pedri", pos: "MID", specialties: ["assist", "outsideBox"], markets: { scorer: 4.50, header: 18.00, outsideBox: 8.00, assist: 2.80, card: 3.50 } }
    ]
  },

  "Portugal": {
    type: "national",
    players: [
      // Cristiano Ronaldo → CABEÇA e gols. Rei dos gols de cabeça historicamente
      { name: "Cristiano Ronaldo", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 1.85, header: 3.80, outsideBox: 8.00, assist: 4.00, card: 4.50 } },
      // Bruno Fernandes → FORA DA ÁREA e assistências. Especialista em livres
      { name: "Bruno Fernandes", pos: "MID", specialties: ["outsideBox", "assist", "scorer"], markets: { scorer: 2.70, header: 16.00, outsideBox: 5.50, assist: 2.00, card: 2.50 } },
      // Bernardo Silva → meia técnico, assistências
      { name: "Bernardo Silva", pos: "MID", specialties: ["assist", "outsideBox"], markets: { scorer: 3.50, header: 19.00, outsideBox: 9.00, assist: 2.30, card: 3.80 } },
      // Rafael Leão → velocidade, assistências, gols pelo lado
      { name: "Rafael Leão", pos: "FWD", specialties: ["scorer", "assist", "outsideBox"], markets: { scorer: 3.00, header: 15.00, outsideBox: 8.00, assist: 2.60, card: 4.20 } },
      // João Félix → versátil, chutes de fora e dentro
      { name: "João Félix", pos: "FWD", specialties: ["scorer", "outsideBox", "assist"], markets: { scorer: 3.00, header: 12.00, outsideBox: 7.00, assist: 3.20, card: 4.50 } }
    ]
  },

  "Alemanha": {
    type: "national",
    players: [
      // Florian Wirtz → meia génio, fora da área e assistências
      { name: "Florian Wirtz", pos: "MID", specialties: ["outsideBox", "assist", "scorer"], markets: { scorer: 2.80, header: 18.00, outsideBox: 6.00, assist: 2.20, card: 4.00 } },
      // Jamal Musiala → driblador, marca de fora e cria jogadas
      { name: "Jamal Musiala", pos: "MID", specialties: ["outsideBox", "assist", "scorer"], markets: { scorer: 2.90, header: 17.00, outsideBox: 6.50, assist: 2.40, card: 4.20 } },
      // Kai Havertz → CABEÇA e gols dentro da área, também marca de fora eventualmente
      { name: "Kai Havertz", pos: "FWD", specialties: ["scorer", "header", "assist"], markets: { scorer: 2.30, header: 6.50, outsideBox: 11.00, assist: 3.20, card: 3.50 } },
      // Gündogan → assist e fora da área no meio
      { name: "Ilkay Gündogan", pos: "MID", specialties: ["assist", "outsideBox", "scorer"], markets: { scorer: 3.50, header: 12.00, outsideBox: 8.00, assist: 2.80, card: 3.00 } },
      // Füllkrug → CABEÇA. Centroavante alto e físico, especialista aéreo
      { name: "Niclas Füllkrug", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.20, header: 3.80, outsideBox: 14.00, assist: 5.00, card: 4.50 } }
    ]
  },

  "Coreia do Sul": {
    type: "national",
    players: [
      // Son → FORA DA ÁREA e gols pelo lado. Chutador forte com o pé esquerdo
      { name: "Son Heung-min", pos: "FWD", specialties: ["scorer", "outsideBox", "assist"], markets: { scorer: 2.10, header: 15.00, outsideBox: 5.00, assist: 2.30, card: 4.50 } },
      // Hwang Hee-Chan → centroavante, gols dentro da área e corridas
      { name: "Hee-Chan Hwang", pos: "FWD", specialties: ["scorer", "assist"], markets: { scorer: 2.80, header: 12.00, outsideBox: 9.00, assist: 3.50, card: 3.80 } },
      // Kang-In Lee → meia técnico, FORA DA ÁREA, assistências, gols bonitos
      { name: "Kang-In Lee", pos: "MID", specialties: ["outsideBox", "assist", "scorer"], markets: { scorer: 3.50, header: 18.00, outsideBox: 5.50, assist: 2.20, card: 3.00 } },
      // Gue-Sung Cho → centroavante ESPECIALISTA EM CABEÇA (ficou famoso no Qatar 2022)
      { name: "Gue-Sung Cho", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.60, header: 4.00, outsideBox: 16.00, assist: 5.50, card: 4.00 } },
      // Min-Jae Kim → zagueiro forte, CABEÇA em bolas paradas
      { name: "Min-Jae Kim", pos: "DEF", specialties: ["header", "card"], markets: { scorer: 8.50, header: 7.50, outsideBox: 30.00, assist: 12.00, card: 2.50 } },
      // Lee Jae-Sung → meia-atacante, gols de fora e assistências
      { name: "Jae-Sung Lee", pos: "MID", specialties: ["outsideBox", "assist"], markets: { scorer: 4.00, header: 16.00, outsideBox: 7.00, assist: 3.20, card: 3.50 } }
    ]
  },

  "Marrocos": {
    type: "national",
    players: [
      // Hakimi → lateral-direito, mais defensivo
      { name: "Achraf Hakimi", pos: "DEF", specialties: ["outsideBox", "card"], markets: { scorer: 7.50, header: 18.00, outsideBox: 12.00, assist: 8.00, card: 3.50 } },
      // Ounahi → meia criativo, ASSISTÊNCIAS
      { name: "Azzedine Ounahi", pos: "MID", specialties: ["assist", "outsideBox"], markets: { scorer: 5.00, header: 16.00, outsideBox: 8.00, assist: 3.00, card: 3.00 } },
      // Brahim Díaz → meia ofensivo, FORA DA ÁREA e assistências. Pequeno, NÃO é de cabeça
      { name: "Brahim Díaz", pos: "MID", specialties: ["outsideBox", "assist", "scorer"], markets: { scorer: 3.50, header: 18.00, outsideBox: 6.00, assist: 2.80, card: 4.00 } },
      // El Kaabi → centroavante, CABEÇA e gols dentro da área
      { name: "Ayoub El Kaabi", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.50, header: 4.50, outsideBox: 12.00, assist: 5.00, card: 4.50 } },
      // Saibari → meia, assistências e fora da área
      { name: "Amine Saibari", pos: "MID", specialties: ["assist", "outsideBox"], markets: { scorer: 4.50, header: 15.00, outsideBox: 7.50, assist: 3.20, card: 3.00 } },
      // En-Nesyri → centroavante, CABEÇA (altíssimo, 1.88m)
      { name: "Youssef En-Nesyri", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.30, header: 4.00, outsideBox: 14.00, assist: 5.50, card: 4.00 } },
      // Ziyech → meia criativo, FORA DA ÁREA e assistências
      { name: "Hakim Ziyech", pos: "MID", specialties: ["outsideBox", "assist"], markets: { scorer: 4.00, header: 16.00, outsideBox: 6.50, assist: 2.50, card: 3.50 } }
    ]
  },

  "Tchéquia": {
    type: "national",
    players: [
      // Patrik Schick → CABEÇA e gols. Ficou famoso pelo gol incrível do meio-campo na Euro 2021
      { name: "Patrik Schick", pos: "FWD", specialties: ["scorer", "header", "outsideBox"], markets: { scorer: 2.20, header: 4.50, outsideBox: 9.00, assist: 4.50, card: 3.80 } },
      // Tomáš Souček → CABEÇA. Meia alto que gosta de subir para a área em bolas paradas
      { name: "Tomas Soucek", pos: "MID", specialties: ["header", "scorer", "card"], markets: { scorer: 3.50, header: 5.00, outsideBox: 10.00, assist: 5.00, card: 2.10 } },
      // Lukáš Provod → meia técnico, criador e chutador de fora
      { name: "Lukas Provod", pos: "MID", specialties: ["assist", "outsideBox"], markets: { scorer: 4.50, header: 16.00, outsideBox: 7.50, assist: 3.00, card: 2.80 } },
      // Pavel Šulc → atacante dinâmico, gols e assistências
      { name: "Pavel Sulc", pos: "MID", specialties: ["scorer", "assist", "outsideBox"], markets: { scorer: 3.80, header: 13.00, outsideBox: 8.00, assist: 3.50, card: 3.20 } },
      // Vladimír Coufal → lateral, mais defensivo
      { name: "Vladimir Coufal", pos: "DEF", specialties: ["card"], markets: { scorer: 9.00, header: 12.00, outsideBox: 25.00, assist: 7.00, card: 2.30 } }
    ]
  },

  "Escócia": {
    type: "national",
    players: [
      // Scott McTominay → CABEÇA e gols de fora. Meia alto goleador
      { name: "Scott McTominay", pos: "MID", specialties: ["scorer", "header", "outsideBox"], markets: { scorer: 3.80, header: 7.50, outsideBox: 8.50, assist: 5.00, card: 2.50 } },
      // Lawrence Shankland → CABEÇA, centroavante físico escocês
      { name: "Lawrence Shankland", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.80, header: 5.50, outsideBox: 13.00, assist: 4.50, card: 4.00 } },
      // John McGinn → combativo, cartões e chutes de longe
      { name: "John McGinn", pos: "MID", specialties: ["card", "outsideBox", "scorer"], markets: { scorer: 4.20, header: 13.00, outsideBox: 9.00, assist: 3.80, card: 2.20 } },
      // Andy Robertson → lateral esquerdo, mais defensivo
      { name: "Andy Robertson", pos: "DEF", specialties: ["card"], markets: { scorer: 9.00, header: 14.00, outsideBox: 22.00, assist: 7.50, card: 2.60 } }
    ]
  },

  "Bolívia": {
    type: "national",
    players: [
      // Ramiro Vaca → meia técnico, chutes de fora da área e assistências
      { name: "Ramiro Vaca", pos: "MID", specialties: ["outsideBox", "assist"], markets: { scorer: 5.00, header: 18.00, outsideBox: 10.00, assist: 4.00, card: 2.60 } },
      // Carmelo Algarañaz → centroavante, gols e cabeceios
      { name: "Carmelo Algarañaz", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 3.80, header: 8.00, outsideBox: 15.00, assist: 6.00, card: 3.00 } },
      // Marcelo Martins → capitão, centroavante de referência, CABEÇA
      { name: "Marcelo Martins", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 3.50, header: 7.00, outsideBox: 16.00, assist: 5.50, card: 3.80 } },
      // Fernando Saucedo → meia atacante criativo
      { name: "Fernando Saucedo", pos: "MID", specialties: ["assist", "outsideBox"], markets: { scorer: 5.50, header: 17.00, outsideBox: 12.00, assist: 4.50, card: 2.80 } }
    ]
  },

  "Panamá": {
    type: "national",
    players: [
      // Fajardo → centroavante goleador da seleção, físico
      { name: "Fajardo", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 4.00, header: 7.50, outsideBox: 16.00, assist: 7.00, card: 3.50 } },
      // Godoy → meia criativo, assistências
      { name: "Adalberto Carrasquilla", pos: "MID", specialties: ["assist", "outsideBox"], markets: { scorer: 5.50, header: 15.00, outsideBox: 11.00, assist: 4.00, card: 2.80 } },
      // Escobar → zagueiro combativo, cartões em bolas paradas
      { name: "F Escobar", pos: "DEF", specialties: ["card", "header"], markets: { scorer: 12.00, header: 11.00, outsideBox: 30.00, assist: 15.00, card: 2.00 } }
    ]
  },

  "Nova Zelândia": {
    type: "national",
    players: [
      // Chris Wood → CABEÇA e gols dentro da área. Centroavante físico
      { name: "Chris Wood", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 3.00, header: 5.00, outsideBox: 15.00, assist: 6.00, card: 4.50 } },
      // Sarpreet Singh → meia técnico, assistências e criação
      { name: "Sarpreet Singh", pos: "MID", specialties: ["assist", "outsideBox"], markets: { scorer: 5.00, header: 18.00, outsideBox: 11.00, assist: 4.00, card: 3.00 } },
      // Liberato Cacace → lateral, mais defensivo
      { name: "Liberato Cacace", pos: "DEF", specialties: ["card"], markets: { scorer: 10.00, header: 15.00, outsideBox: 22.00, assist: 7.00, card: 2.50 } }
    ]
  },

  "Canadá": {
    type: "national",
    players: [
      // Alphonso Davies → lateral esquerdo, mais defensivo
      { name: "Alphonso Davies", pos: "DEF", specialties: ["outsideBox", "card"], markets: { scorer: 8.00, header: 14.00, outsideBox: 10.00, assist: 7.50, card: 3.00 } },
      // Jonathan David → centroavante goleador, fora e dentro da área
      { name: "Jonathan David", pos: "FWD", specialties: ["scorer", "outsideBox", "assist"], markets: { scorer: 2.00, header: 10.00, outsideBox: 6.50, assist: 3.50, card: 4.00 } },
      // Cyle Larin → centroavante físico, CABEÇA
      { name: "Cyle Larin", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 3.20, header: 6.50, outsideBox: 13.00, assist: 5.00, card: 3.80 } },
      // Tajon Buchanan → extremo habilidoso, assist e gols de fora
      { name: "Tajon Buchanan", pos: "FWD", specialties: ["assist", "outsideBox"], markets: { scorer: 4.00, header: 18.00, outsideBox: 9.00, assist: 3.00, card: 4.00 } },
      // Stephen Eustáquio → meia box-to-box, cartões e fora da área
      { name: "Stephen Eustáquio", pos: "MID", specialties: ["card", "outsideBox", "assist"], markets: { scorer: 5.00, header: 14.00, outsideBox: 9.00, assist: 4.00, card: 2.30 } }
    ]
  },

  "México": {
    type: "national",
    players: [
      // Hirving Lozano → FORA DA ÁREA e velocidade, assistências
      { name: "Hirving Lozano", pos: "FWD", specialties: ["scorer", "outsideBox", "assist"], markets: { scorer: 3.00, header: 16.00, outsideBox: 7.00, assist: 2.80, card: 4.00 } },
      // Henry Martín → centroavante goleador, CABEÇA
      { name: "Henry Martín", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.80, header: 6.50, outsideBox: 13.00, assist: 5.50, card: 3.50 } },
      // Edson Álvarez → volante combativo, CARTÕES e cabeceios em bola parada
      { name: "Edson Álvarez", pos: "MID", specialties: ["card", "header"], markets: { scorer: 7.00, header: 9.00, outsideBox: 18.00, assist: 6.00, card: 2.00 } },
      // Alexis Vega → meia atacante, gols e assistências
      { name: "Alexis Vega", pos: "MID", specialties: ["scorer", "assist", "outsideBox"], markets: { scorer: 3.50, header: 14.00, outsideBox: 8.00, assist: 3.00, card: 3.50 } },
      // Chucky Lozano (Santiago Giménez) → centroavante jovem, gols variados
      { name: "Santiago Giménez", pos: "FWD", specialties: ["scorer", "outsideBox", "header"], markets: { scorer: 2.50, header: 7.00, outsideBox: 8.50, assist: 4.50, card: 4.00 } }
    ]
  },

  "África do Sul": {
    type: "national",
    players: [
      // Evidence Makgopa → centroavante goleador, físico e CABEÇA
      { name: "Evidence Makgopa", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 3.50, header: 7.00, outsideBox: 14.00, assist: 6.00, card: 3.50 } },
      // Percy Tau → atacante técnico, assist e gols de fora
      { name: "Percy Tau", pos: "FWD", specialties: ["scorer", "assist", "outsideBox"], markets: { scorer: 3.20, header: 15.00, outsideBox: 8.00, assist: 3.00, card: 4.00 } },
      // Themba Zwane → meia criativo, FORA DA ÁREA
      { name: "Themba Zwane", pos: "MID", specialties: ["outsideBox", "assist"], markets: { scorer: 4.50, header: 17.00, outsideBox: 9.00, assist: 3.50, card: 3.00 } },
      // Ronwen Williams (goleiro, excluído automaticamente)
      // Bongani Zungu → volante, cartões e combativo
      { name: "Bongani Zungu", pos: "MID", specialties: ["card", "outsideBox"], markets: { scorer: 6.00, header: 12.00, outsideBox: 12.00, assist: 5.00, card: 2.20 } }
    ]
  },

  "Uruguai": {
    type: "national",
    players: [
      // Darwin Núñez → centroavante físico e explosivo, CABEÇA e velocidade
      { name: "Darwin Núñez", pos: "FWD", specialties: ["scorer", "header", "card"], markets: { scorer: 2.20, header: 5.50, outsideBox: 11.00, assist: 4.00, card: 2.80 } },
      // Federico Valverde → FORA DA ÁREA, chute potente
      { name: "Federico Valverde", pos: "MID", specialties: ["outsideBox", "scorer", "card"], markets: { scorer: 4.00, header: 16.00, outsideBox: 5.50, assist: 3.50, card: 2.80 } },
      // Rodrigo Bentancur → meia técnico e combativo, cartões e assistências
      { name: "Rodrigo Bentancur", pos: "MID", specialties: ["assist", "card"], markets: { scorer: 5.00, header: 14.00, outsideBox: 11.00, assist: 3.80, card: 2.30 } },
      // Luis Suárez → lendário, gols dentro da área (ainda ativo)
      { name: "Luis Suárez", pos: "FWD", specialties: ["scorer", "assist"], markets: { scorer: 2.80, header: 12.00, outsideBox: 9.00, assist: 3.50, card: 3.50 } }
    ]
  },

  "Itália": {
    type: "national",
    players: [
      // Gianluca Scamacca → centroavante moderno, CABEÇA e gols de fora
      { name: "Gianluca Scamacca", pos: "FWD", specialties: ["scorer", "header", "outsideBox"], markets: { scorer: 2.50, header: 6.00, outsideBox: 9.00, assist: 4.50, card: 3.80 } },
      // Sandro Tonali → meia combativo, inserções na área e cartões
      { name: "Sandro Tonali", pos: "MID", specialties: ["scorer", "outsideBox", "card"], markets: { scorer: 4.50, header: 14.00, outsideBox: 8.50, assist: 4.00, card: 2.30 } },
      // Federico Chiesa → velocidade e gols de fora da área
      { name: "Federico Chiesa", pos: "FWD", specialties: ["outsideBox", "scorer", "assist"], markets: { scorer: 3.20, header: 15.00, outsideBox: 7.00, assist: 3.00, card: 4.00 } },
      // Lorenzo Pellegrini → meia criativo, assistências e fora da área
      { name: "Lorenzo Pellegrini", pos: "MID", specialties: ["assist", "outsideBox"], markets: { scorer: 3.80, header: 15.00, outsideBox: 8.00, assist: 2.80, card: 3.00 } }
    ]
  },

  "Holanda": {
    type: "national",
    players: [
      // Cody Gakpo → CABEÇA e gols variados. Alto, físico
      { name: "Cody Gakpo", pos: "FWD", specialties: ["scorer", "header", "assist"], markets: { scorer: 2.30, header: 6.00, outsideBox: 10.00, assist: 3.20, card: 4.00 } },
      // Virgil van Dijk → zagueiro, CABEÇA em bolas paradas (entra para atacar)
      { name: "Virgil van Dijk", pos: "DEF", specialties: ["header", "card"], markets: { scorer: 7.50, header: 7.50, outsideBox: 25.00, assist: 10.00, card: 3.00 } },
      // Xavi Simons → meia técnico, FORA DA ÁREA
      { name: "Xavi Simons", pos: "MID", specialties: ["outsideBox", "assist", "scorer"], markets: { scorer: 3.50, header: 17.00, outsideBox: 7.00, assist: 2.80, card: 4.00 } },
      // Tijjani Reijnders → meia goleador, inserções pela área
      { name: "Tijjani Reijnders", pos: "MID", specialties: ["scorer", "outsideBox"], markets: { scorer: 4.00, header: 13.00, outsideBox: 8.00, assist: 3.80, card: 3.50 } }
    ]
  },

  "Bélgica": {
    type: "national",
    players: [
      // Romelu Lukaku → CABEÇA e físico. Um dos melhores centroavantes aéreos
      { name: "Romelu Lukaku", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.00, header: 5.00, outsideBox: 15.00, assist: 4.50, card: 4.00 } },
      // Kevin De Bruyne → ASSISTÊNCIAS. Melhor passador do mundo
      { name: "Kevin De Bruyne", pos: "MID", specialties: ["assist", "outsideBox", "scorer"], markets: { scorer: 2.90, header: 19.00, outsideBox: 5.00, assist: 1.90, card: 3.50 } },
      // Doku → extremo veloz, assistências e gols de fora
      { name: "Jérémy Doku", pos: "FWD", specialties: ["assist", "outsideBox", "scorer"], markets: { scorer: 3.50, header: 18.00, outsideBox: 8.00, assist: 2.80, card: 4.00 } },
      // Trossard → polivalente, gols e assistências
      { name: "Leandro Trossard", pos: "FWD", specialties: ["scorer", "outsideBox", "assist"], markets: { scorer: 3.20, header: 16.00, outsideBox: 8.00, assist: 3.00, card: 4.00 } }
    ]
  },

  // ============================================================
  //  CLUBES PRINCIPAIS
  // ============================================================

  "Flamengo": {
    type: "club",
    players: [
      // Pedro → CABEÇA. Centroavante físico, especialista em gols aéreos
      { name: "Pedro", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 1.80, header: 4.50, outsideBox: 12.00, assist: 4.00, card: 5.00 } },
      // De Arrascaeta → FORA DA ÁREA e assistências. Cobrador de falta e chutador de longa distância
      { name: "De Arrascaeta", pos: "MID", specialties: ["outsideBox", "assist", "scorer"], markets: { scorer: 2.80, header: 15.00, outsideBox: 6.50, assist: 2.10, card: 3.50 } },
      // Gerson → meia combativo, assistências e cartões
      { name: "Gerson", pos: "MID", specialties: ["card", "assist", "outsideBox"], markets: { scorer: 4.00, header: 12.00, outsideBox: 8.50, assist: 3.20, card: 2.20 } },
      // Bruno Henrique → extremo físico, CABEÇA e gols pelo lado
      { name: "Bruno Henrique", pos: "FWD", specialties: ["scorer", "header", "assist"], markets: { scorer: 2.50, header: 5.50, outsideBox: 10.00, assist: 3.00, card: 2.60 } },
      // Luiz Araújo → FORA DA ÁREA, extremo driblador
      { name: "Luiz Araújo", pos: "FWD", specialties: ["outsideBox", "assist", "scorer"], markets: { scorer: 3.50, header: 18.00, outsideBox: 7.00, assist: 2.80, card: 3.80 } },
      // Léo Ortiz → zagueiro, CABEÇA em bola parada e combativo
      { name: "Léo Ortiz", pos: "DEF", specialties: ["card", "header"], markets: { scorer: 7.50, header: 8.00, outsideBox: 20.00, assist: 10.00, card: 2.80 } }
    ]
  },

  "Palmeiras": {
    type: "club",
    players: [
      // Flaco López → centroavante, CABEÇA e gols
      { name: "Flaco López", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.10, header: 4.50, outsideBox: 12.00, assist: 4.00, card: 3.50 } },
      // Raphael Veiga → FORA DA ÁREA. Especialista em chutes e cobranças
      { name: "Raphael Veiga", pos: "MID", specialties: ["outsideBox", "assist", "scorer"], markets: { scorer: 2.50, header: 16.00, outsideBox: 5.50, assist: 2.30, card: 3.00 } },
      // Estêvão → jovem talento, driblador, FORA DA ÁREA e assistências
      { name: "Estêvão", pos: "FWD", specialties: ["outsideBox", "assist", "scorer"], markets: { scorer: 2.80, header: 18.00, outsideBox: 6.00, assist: 2.40, card: 4.00 } },
      // Rony → extremo físico, gols e cabeceios
      { name: "Rony", pos: "FWD", specialties: ["scorer", "header", "assist"], markets: { scorer: 3.00, header: 7.50, outsideBox: 11.00, assist: 3.50, card: 3.20 } },
      // Gustavo Gómez → zagueiro capitão, CABEÇA em bola parada
      { name: "Gustavo Gómez", pos: "DEF", specialties: ["header", "card"], markets: { scorer: 6.00, header: 6.50, outsideBox: 25.00, assist: 10.00, card: 2.20 } }
    ]
  },

  "Real Madrid": {
    type: "club",
    players: [
      // Mbappé → gols potentes, FORA DA ÁREA e velocidade
      { name: "Kylian Mbappé", pos: "FWD", specialties: ["scorer", "outsideBox", "assist"], markets: { scorer: 1.65, header: 11.00, outsideBox: 5.00, assist: 2.60, card: 5.00 } },
      // Vinicius Jr. → habilidade e velocidade, FORA DA ÁREA e assistências
      { name: "Vinicius Jr.", pos: "FWD", specialties: ["scorer", "outsideBox", "assist"], markets: { scorer: 1.85, header: 15.00, outsideBox: 7.00, assist: 2.20, card: 4.00 } },
      // Bellingham → inserções e gols variados
      { name: "Jude Bellingham", pos: "MID", specialties: ["scorer", "assist", "outsideBox"], markets: { scorer: 2.40, header: 8.00, outsideBox: 8.00, assist: 2.80, card: 2.50 } },
      // Rodrygo → versátil, assist e gols de fora
      { name: "Rodrygo", pos: "FWD", specialties: ["scorer", "outsideBox", "assist"], markets: { scorer: 2.30, header: 12.00, outsideBox: 7.50, assist: 2.70, card: 4.50 } },
      // Valverde → FORA DA ÁREA, chute forte e combativo
      { name: "Federico Valverde", pos: "MID", specialties: ["outsideBox", "card", "scorer"], markets: { scorer: 4.50, header: 17.00, outsideBox: 5.50, assist: 3.50, card: 2.80 } }
    ]
  },

  "Manchester City": {
    type: "club",
    players: [
      { name: "Erling Haaland", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 1.50, header: 4.00, outsideBox: 12.00, assist: 4.50, card: 5.50 } },
      { name: "Kevin De Bruyne", pos: "MID", specialties: ["assist", "outsideBox"], markets: { scorer: 2.80, header: 19.00, outsideBox: 5.00, assist: 1.90, card: 3.50 } },
      { name: "Phil Foden", pos: "FWD", specialties: ["outsideBox", "assist", "scorer"], markets: { scorer: 2.30, header: 17.00, outsideBox: 5.50, assist: 2.30, card: 4.50 } },
      { name: "Bernardo Silva", pos: "MID", specialties: ["assist", "outsideBox"], markets: { scorer: 3.80, header: 16.00, outsideBox: 8.50, assist: 2.40, card: 3.20 } }
    ]
  },

  "Liverpool": {
    type: "club",
    players: [
      { name: "Mohamed Salah", pos: "FWD", specialties: ["scorer", "assist", "outsideBox"], markets: { scorer: 1.85, header: 14.00, outsideBox: 6.00, assist: 2.50, card: 4.00 } },
      { name: "Darwin Núñez", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.00, header: 5.00, outsideBox: 11.00, assist: 4.50, card: 4.00 } },
      { name: "Luis Díaz", pos: "FWD", specialties: ["scorer", "assist", "outsideBox"], markets: { scorer: 2.80, header: 15.00, outsideBox: 7.50, assist: 3.00, card: 3.50 } },
      { name: "Dominik Szoboszlai", pos: "MID", specialties: ["outsideBox", "assist"], markets: { scorer: 4.50, header: 14.00, outsideBox: 7.00, assist: 3.20, card: 3.00 } },
      { name: "Alexis Mac Allister", pos: "MID", specialties: ["assist", "outsideBox", "card"], markets: { scorer: 5.00, header: 15.00, outsideBox: 8.00, assist: 2.80, card: 2.50 } },
      { name: "Virgil van Dijk", pos: "DEF", specialties: ["header", "card"], markets: { scorer: 7.00, header: 6.50, outsideBox: 25.00, assist: 10.00, card: 3.00 } }
    ]
  },

  "Arsenal": {
    type: "club",
    players: [
      { name: "Bukayo Saka", pos: "FWD", specialties: ["scorer", "assist", "outsideBox"], markets: { scorer: 2.20, header: 16.00, outsideBox: 6.00, assist: 2.30, card: 4.00 } },
      { name: "Kai Havertz", pos: "FWD", specialties: ["scorer", "header", "assist"], markets: { scorer: 2.50, header: 6.00, outsideBox: 10.00, assist: 3.00, card: 3.50 } },
      { name: "Martin Ødegaard", pos: "MID", specialties: ["assist", "outsideBox", "scorer"], markets: { scorer: 3.00, header: 18.00, outsideBox: 5.50, assist: 2.00, card: 3.80 } },
      { name: "Gabriel Jesus", pos: "FWD", specialties: ["scorer", "assist"], markets: { scorer: 2.40, header: 10.00, outsideBox: 8.00, assist: 3.20, card: 4.50 } },
      { name: "Declan Rice", pos: "MID", specialties: ["card", "outsideBox"], markets: { scorer: 6.00, header: 11.00, outsideBox: 9.00, assist: 4.50, card: 2.30 } },
      { name: "William Saliba", pos: "DEF", specialties: ["header", "card"], markets: { scorer: 9.00, header: 8.00, outsideBox: 28.00, assist: 14.00, card: 3.00 } }
    ]
  },

  "Barcelona": {
    type: "club",
    players: [
      { name: "Robert Lewandowski", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 1.60, header: 4.50, outsideBox: 10.00, assist: 4.00, card: 4.50 } },
      { name: "Lamine Yamal", pos: "FWD", specialties: ["outsideBox", "assist", "scorer"], markets: { scorer: 3.00, header: 22.00, outsideBox: 6.50, assist: 2.20, card: 5.00 } },
      { name: "Raphinha", pos: "FWD", specialties: ["scorer", "assist", "outsideBox"], markets: { scorer: 2.50, header: 14.00, outsideBox: 6.00, assist: 2.40, card: 3.50 } },
      { name: "Pedri", pos: "MID", specialties: ["assist", "outsideBox"], markets: { scorer: 4.50, header: 18.00, outsideBox: 8.00, assist: 2.80, card: 3.50 } },
      { name: "Gavi", pos: "MID", specialties: ["assist", "card", "outsideBox"], markets: { scorer: 5.50, header: 16.00, outsideBox: 9.00, assist: 3.00, card: 2.20 } },
      { name: "Pau Cubarsí", pos: "DEF", specialties: ["header", "card"], markets: { scorer: 10.00, header: 7.50, outsideBox: 30.00, assist: 15.00, card: 3.50 } }
    ]
  },

  "Atlético Madrid": {
    type: "club",
    players: [
      { name: "Antoine Griezmann", pos: "FWD", specialties: ["scorer", "assist", "outsideBox"], markets: { scorer: 2.20, header: 12.00, outsideBox: 6.00, assist: 2.30, card: 3.50 } },
      { name: "Álvaro Morata", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.00, header: 5.00, outsideBox: 14.00, assist: 4.50, card: 4.00 } },
      { name: "Marcos Llorente", pos: "MID", specialties: ["outsideBox", "assist", "scorer"], markets: { scorer: 4.00, header: 12.00, outsideBox: 7.00, assist: 3.50, card: 3.00 } },
      { name: "Rodrigo De Paul", pos: "MID", specialties: ["card", "assist"], markets: { scorer: 6.50, header: 16.00, outsideBox: 11.00, assist: 3.80, card: 2.00 } }
    ]
  },

  "Inter Milão": {
    type: "club",
    players: [
      { name: "Lautaro Martínez", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 1.90, header: 5.50, outsideBox: 10.00, assist: 4.00, card: 4.20 } },
      { name: "Marcus Thuram", pos: "FWD", specialties: ["scorer", "assist", "outsideBox"], markets: { scorer: 2.50, header: 9.00, outsideBox: 8.00, assist: 3.00, card: 3.80 } },
      { name: "Nicolò Barella", pos: "MID", specialties: ["outsideBox", "assist", "card"], markets: { scorer: 4.00, header: 13.00, outsideBox: 6.50, assist: 3.20, card: 2.50 } },
      { name: "Hakan Çalhanoğlu", pos: "MID", specialties: ["outsideBox", "assist", "scorer"], markets: { scorer: 3.50, header: 15.00, outsideBox: 5.00, assist: 2.80, card: 3.00 } }
    ]
  },

  "Juventus": {
    type: "club",
    players: [
      { name: "Dušan Vlahović", pos: "FWD", specialties: ["scorer", "header", "outsideBox"], markets: { scorer: 1.95, header: 5.50, outsideBox: 8.00, assist: 4.50, card: 4.00 } },
      { name: "Federico Chiesa", pos: "FWD", specialties: ["scorer", "outsideBox", "assist"], markets: { scorer: 2.80, header: 15.00, outsideBox: 6.50, assist: 3.00, card: 4.00 } },
      { name: "Adrien Rabiot", pos: "MID", specialties: ["card", "outsideBox"], markets: { scorer: 6.00, header: 10.00, outsideBox: 8.50, assist: 5.00, card: 2.20 } },
      { name: "Weston McKennie", pos: "MID", specialties: ["header", "outsideBox", "card"], markets: { scorer: 5.50, header: 7.50, outsideBox: 9.00, assist: 5.50, card: 2.50 } }
    ]
  },

  "Napoli": {
    type: "club",
    players: [
      { name: "Victor Osimhen", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 1.75, header: 4.50, outsideBox: 11.00, assist: 5.00, card: 4.50 } },
      { name: "Khvicha Kvaratskhelia", pos: "FWD", specialties: ["scorer", "assist", "outsideBox"], markets: { scorer: 2.60, header: 18.00, outsideBox: 7.00, assist: 2.50, card: 3.80 } },
      { name: "Stanislav Lobotka", pos: "MID", specialties: ["assist", "card"], markets: { scorer: 8.00, header: 20.00, outsideBox: 12.00, assist: 3.50, card: 2.50 } },
      { name: "Giovanni Di Lorenzo", pos: "DEF", specialties: ["card"], markets: { scorer: 8.50, header: 12.00, outsideBox: 22.00, assist: 7.00, card: 2.80 } }
    ]
  },

  "Bayern Munich": {
    type: "club",
    players: [
      { name: "Harry Kane", pos: "FWD", specialties: ["scorer", "header", "assist"], markets: { scorer: 1.55, header: 4.00, outsideBox: 8.00, assist: 3.00, card: 4.50 } },
      { name: "Jamal Musiala", pos: "MID", specialties: ["scorer", "outsideBox", "assist"], markets: { scorer: 2.80, header: 17.00, outsideBox: 6.00, assist: 2.50, card: 4.00 } },
      { name: "Leroy Sané", pos: "FWD", specialties: ["assist", "outsideBox", "scorer"], markets: { scorer: 3.00, header: 18.00, outsideBox: 6.50, assist: 2.30, card: 3.50 } },
      { name: "Thomas Müller", pos: "FWD", specialties: ["assist", "scorer"], markets: { scorer: 3.50, header: 10.00, outsideBox: 9.00, assist: 2.20, card: 3.00 } },
      { name: "Joshua Kimmich", pos: "MID", specialties: ["assist", "card", "outsideBox"], markets: { scorer: 5.50, header: 12.00, outsideBox: 7.50, assist: 2.50, card: 2.30 } }
    ]
  },

  "Borussia Dortmund": {
    type: "club",
    players: [
      { name: "Donyell Malen", pos: "FWD", specialties: ["scorer", "outsideBox"], markets: { scorer: 2.50, header: 14.00, outsideBox: 7.00, assist: 3.50, card: 4.00 } },
      { name: "Julian Brandt", pos: "MID", specialties: ["assist", "outsideBox", "scorer"], markets: { scorer: 3.50, header: 15.00, outsideBox: 6.50, assist: 2.50, card: 3.00 } },
      { name: "Karim Adeyemi", pos: "FWD", specialties: ["scorer", "assist"], markets: { scorer: 2.80, header: 16.00, outsideBox: 8.00, assist: 3.20, card: 4.50 } },
      { name: "Emre Can", pos: "MID", specialties: ["card", "outsideBox"], markets: { scorer: 7.00, header: 10.00, outsideBox: 9.00, assist: 5.50, card: 2.00 } }
    ]
  },

  "PSG": {
    type: "club",
    players: [
      { name: "Ousmane Dembélé", pos: "FWD", specialties: ["assist", "outsideBox"], markets: { scorer: 3.00, header: 18.00, outsideBox: 7.50, assist: 2.30, card: 4.00 } },
      { name: "Bradley Barcola", pos: "FWD", specialties: ["scorer", "assist", "outsideBox"], markets: { scorer: 2.80, header: 16.00, outsideBox: 8.00, assist: 3.00, card: 4.50 } },
      { name: "Vitinha", pos: "MID", specialties: ["assist", "outsideBox"], markets: { scorer: 5.00, header: 18.00, outsideBox: 7.00, assist: 2.50, card: 3.50 } },
      { name: "Marquinhos", pos: "DEF", specialties: ["header", "card"], markets: { scorer: 8.50, header: 7.50, outsideBox: 25.00, assist: 12.00, card: 3.00 } }
    ]
  },

  "Chelsea": {
    type: "club",
    players: [
      { name: "Cole Palmer", pos: "MID", specialties: ["scorer", "assist", "outsideBox"], markets: { scorer: 2.20, header: 18.00, outsideBox: 5.50, assist: 2.30, card: 4.00 } },
      { name: "Nicolas Jackson", pos: "FWD", specialties: ["scorer", "assist"], markets: { scorer: 2.50, header: 10.00, outsideBox: 9.00, assist: 3.50, card: 4.50 } },
      { name: "Enzo Fernández", pos: "MID", specialties: ["outsideBox", "card", "assist"], markets: { scorer: 5.00, header: 14.00, outsideBox: 7.00, assist: 3.50, card: 2.30 } },
      { name: "Moisés Caicedo", pos: "MID", specialties: ["card", "outsideBox"], markets: { scorer: 7.00, header: 12.00, outsideBox: 10.00, assist: 5.50, card: 2.00 } }
    ]
  },

  "Tottenham": {
    type: "club",
    players: [
      { name: "Son Heung-min", pos: "FWD", specialties: ["scorer", "outsideBox", "assist"], markets: { scorer: 2.00, header: 15.00, outsideBox: 5.00, assist: 2.80, card: 4.00 } },
      { name: "Richarlison", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.50, header: 6.00, outsideBox: 12.00, assist: 4.50, card: 4.50 } },
      { name: "James Maddison", pos: "MID", specialties: ["assist", "outsideBox", "scorer"], markets: { scorer: 3.50, header: 16.00, outsideBox: 5.50, assist: 2.50, card: 3.50 } },
      { name: "Dejan Kulusevski", pos: "MID", specialties: ["assist", "outsideBox"], markets: { scorer: 4.00, header: 14.00, outsideBox: 7.00, assist: 2.80, card: 3.00 } }
    ]
  },

  "Newcastle": {
    type: "club",
    players: [
      { name: "Alexander Isak", pos: "FWD", specialties: ["scorer", "header", "outsideBox"], markets: { scorer: 1.90, header: 5.50, outsideBox: 8.00, assist: 4.00, card: 4.00 } },
      { name: "Anthony Gordon", pos: "FWD", specialties: ["scorer", "assist", "outsideBox"], markets: { scorer: 2.80, header: 16.00, outsideBox: 7.00, assist: 2.80, card: 4.50 } },
      { name: "Bruno Guimarães", pos: "MID", specialties: ["card", "outsideBox", "assist"], markets: { scorer: 5.00, header: 13.00, outsideBox: 8.00, assist: 3.50, card: 2.00 } },
      { name: "Joelinton", pos: "MID", specialties: ["card", "scorer"], markets: { scorer: 5.50, header: 10.00, outsideBox: 11.00, assist: 5.00, card: 2.20 } }
    ]
  },

  "Roma": {
    type: "club",
    players: [
      { name: "Paulo Dybala", pos: "FWD", specialties: ["scorer", "outsideBox", "assist"], markets: { scorer: 2.30, header: 15.00, outsideBox: 5.50, assist: 3.00, card: 3.50 } },
      { name: "Romelu Lukaku", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 1.80, header: 4.50, outsideBox: 14.00, assist: 4.00, card: 4.00 } },
      { name: "Lorenzo Pellegrini", pos: "MID", specialties: ["assist", "outsideBox", "scorer"], markets: { scorer: 3.80, header: 14.00, outsideBox: 7.00, assist: 2.50, card: 3.00 } },
      { name: "Luka Modrić", pos: "MID", specialties: ["assist", "outsideBox"], markets: { scorer: 5.50, header: 18.00, outsideBox: 7.00, assist: 2.50, card: 3.50 } }
    ]
  },

  "Lazio": {
    type: "club",
    players: [
      { name: "Ciro Immobile", pos: "FWD", specialties: ["scorer", "header", "outsideBox"], markets: { scorer: 1.85, header: 4.50, outsideBox: 7.50, assist: 4.50, card: 4.00 } },
      { name: "Mattia Zaccagni", pos: "FWD", specialties: ["assist", "outsideBox", "scorer"], markets: { scorer: 3.00, header: 16.00, outsideBox: 6.50, assist: 2.50, card: 4.00 } },
      { name: "Sergej Milinković-Savić", pos: "MID", specialties: ["header", "outsideBox", "assist"], markets: { scorer: 4.00, header: 6.00, outsideBox: 7.00, assist: 3.00, card: 3.00 } },
      { name: "Luis Alberto", pos: "MID", specialties: ["assist", "outsideBox"], markets: { scorer: 4.50, header: 18.00, outsideBox: 6.00, assist: 2.20, card: 3.50 } }
    ]
  },

  "Atalanta": {
    type: "club",
    players: [
      { name: "Teun Koopmeiners", pos: "MID", specialties: ["scorer", "outsideBox", "assist"], markets: { scorer: 3.00, header: 10.00, outsideBox: 5.50, assist: 3.00, card: 3.00 } },
      { name: "Charles De Ketelaere", pos: "FWD", specialties: ["assist", "outsideBox", "scorer"], markets: { scorer: 3.20, header: 14.00, outsideBox: 7.00, assist: 2.80, card: 3.50 } },
      { name: "Lookman", pos: "FWD", specialties: ["scorer", "assist", "outsideBox"], markets: { scorer: 2.50, header: 15.00, outsideBox: 7.50, assist: 3.20, card: 4.00 } },
      { name: "Ederson", pos: "MID", specialties: ["card", "outsideBox"], markets: { scorer: 6.50, header: 11.00, outsideBox: 8.50, assist: 5.00, card: 2.20 } }
    ]
  },

  "RB Leipzig": {
    type: "club",
    players: [
      { name: "Omar Marmoush", pos: "FWD", specialties: ["scorer", "assist", "outsideBox"], markets: { scorer: 2.30, header: 12.00, outsideBox: 6.50, assist: 3.00, card: 4.00 } },
      { name: "Loïs Openda", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.00, header: 5.00, outsideBox: 10.00, assist: 4.50, card: 4.50 } },
      { name: "Xavi Simons", pos: "MID", specialties: ["outsideBox", "assist", "scorer"], markets: { scorer: 3.50, header: 17.00, outsideBox: 6.00, assist: 2.50, card: 4.00 } },
      { name: "Dani Olmo", pos: "MID", specialties: ["scorer", "outsideBox", "assist"], markets: { scorer: 3.00, header: 15.00, outsideBox: 6.50, assist: 2.80, card: 3.50 } }
    ]
  },

  "Bayer Leverkusen": {
    type: "club",
    players: [
      { name: "Victor Boniface", pos: "FWD", specialties: ["scorer", "header", "assist"], markets: { scorer: 2.00, header: 5.50, outsideBox: 9.00, assist: 3.50, card: 4.00 } },
      { name: "Florian Wirtz", pos: "MID", specialties: ["outsideBox", "assist", "scorer"], markets: { scorer: 2.80, header: 18.00, outsideBox: 5.50, assist: 2.00, card: 4.00 } },
      { name: "Exequiel Palacios", pos: "MID", specialties: ["card", "assist"], markets: { scorer: 6.00, header: 14.00, outsideBox: 10.00, assist: 3.50, card: 2.20 } },
      { name: "Jonathan Tah", pos: "DEF", specialties: ["header", "card"], markets: { scorer: 8.00, header: 7.00, outsideBox: 28.00, assist: 14.00, card: 3.00 } }
    ]
  },

  "Monaco": {
    type: "club",
    players: [
      { name: "Wissam Ben Yedder", pos: "FWD", specialties: ["scorer", "header", "outsideBox"], markets: { scorer: 1.90, header: 5.00, outsideBox: 7.50, assist: 4.50, card: 4.00 } },
      { name: "Breel Embolo", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.50, header: 6.00, outsideBox: 11.00, assist: 4.00, card: 4.50 } },
      { name: "Aleksandr Golovin", pos: "MID", specialties: ["assist", "outsideBox"], markets: { scorer: 4.50, header: 16.00, outsideBox: 7.00, assist: 2.80, card: 3.00 } },
      { name: "Denis Zakaria", pos: "MID", specialties: ["card", "outsideBox"], markets: { scorer: 6.00, header: 10.00, outsideBox: 8.00, assist: 5.50, card: 2.20 } }
    ]
  },

  "Lyon": {
    type: "club",
    players: [
      { name: "Alexandre Lacazette", pos: "FWD", specialties: ["scorer", "header", "assist"], markets: { scorer: 2.00, header: 5.50, outsideBox: 9.00, assist: 3.50, card: 4.00 } },
      { name: "Rayan Cherki", pos: "FWD", specialties: ["assist", "outsideBox", "scorer"], markets: { scorer: 3.50, header: 18.00, outsideBox: 7.00, assist: 2.50, card: 4.50 } },
      { name: "Corentin Tolisso", pos: "MID", specialties: ["outsideBox", "card"], markets: { scorer: 5.00, header: 11.00, outsideBox: 7.50, assist: 4.00, card: 2.50 } },
      { name: "Nemanja Matić", pos: "MID", specialties: ["card", "assist"], markets: { scorer: 7.50, header: 14.00, outsideBox: 12.00, assist: 4.50, card: 2.00 } }
    ]
  },

  "Haiti": {
    type: "national",
    players: [
      { name: "Duckens Nazon", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 3.50, header: 7.00, outsideBox: 12.00, assist: 5.00, card: 4.00 } },
      { name: "Frantzdy Pierrot", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 3.80, header: 6.50, outsideBox: 14.00, assist: 6.00, card: 3.50 } },
      { name: "Steevens Joseph", pos: "MID", specialties: ["assist", "outsideBox"], markets: { scorer: 5.00, header: 16.00, outsideBox: 9.00, assist: 3.50, card: 3.00 } },
      { name: "Carnejy Antoine", pos: "FWD", specialties: ["scorer", "outsideBox"], markets: { scorer: 4.00, header: 11.00, outsideBox: 8.00, assist: 4.50, card: 3.80 } },
      { name: "Jean-Kévin Duverne", pos: "DEF", specialties: ["header", "card"], markets: { scorer: 9.00, header: 8.00, outsideBox: 25.00, assist: 12.00, card: 2.80 } },
      { name: "Alexandre Jeanty", pos: "MID", specialties: ["card", "outsideBox"], markets: { scorer: 6.50, header: 14.00, outsideBox: 10.00, assist: 5.00, card: 2.20 } }
    ]
  },

  "Curaçao": {
    type: "national",
    players: [
      { name: "Leandro Bacuna", pos: "MID", specialties: ["assist", "card"], markets: { scorer: 5.00, header: 12.00, outsideBox: 8.00, assist: 3.50, card: 2.50 } },
      { name: "Juninho Bacuna", pos: "MID", specialties: ["outsideBox", "assist"], markets: { scorer: 4.50, header: 14.00, outsideBox: 7.00, assist: 3.80, card: 3.00 } },
      { name: "Carmelia", pos: "FWD", specialties: ["scorer", "assist"], markets: { scorer: 3.20, header: 10.00, outsideBox: 9.00, assist: 4.00, card: 3.50 } },
      { name: "Rangelo Janga", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.80, header: 5.00, outsideBox: 12.00, assist: 5.50, card: 4.00 } }
    ]
  },

  "Costa do Marfim": {
    type: "national",
    players: [
      { name: "Sébastien Haller", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.20, header: 4.50, outsideBox: 12.00, assist: 5.00, card: 4.00 } },
      { name: "Nicolas Pépé", pos: "FWD", specialties: ["scorer", "outsideBox", "assist"], markets: { scorer: 2.80, header: 14.00, outsideBox: 6.50, assist: 3.00, card: 3.50 } },
      { name: "Jean Michaël Seri", pos: "MID", specialties: ["assist", "outsideBox"], markets: { scorer: 5.00, header: 16.00, outsideBox: 8.00, assist: 2.80, card: 3.00 } },
      { name: "Frank Kessié", pos: "MID", specialties: ["card", "outsideBox", "scorer"], markets: { scorer: 4.00, header: 10.00, outsideBox: 7.50, assist: 4.50, card: 2.20 } },
      { name: "Simon Adingra", pos: "FWD", specialties: ["assist", "scorer"], markets: { scorer: 3.00, header: 12.00, outsideBox: 8.00, assist: 2.50, card: 3.00 } }
    ]
  },

  "Suécia": {
    type: "national",
    players: [
      { name: "Alexander Isak", pos: "FWD", specialties: ["scorer", "assist", "outsideBox"], markets: { scorer: 2.10, header: 8.00, outsideBox: 6.00, assist: 3.50, card: 3.00 } },
      { name: "Dejan Kulusevski", pos: "FWD", specialties: ["assist", "outsideBox", "scorer"], markets: { scorer: 3.00, header: 14.00, outsideBox: 6.50, assist: 2.30, card: 3.50 } },
      { name: "Emil Forsberg", pos: "MID", specialties: ["outsideBox", "assist"], markets: { scorer: 3.50, header: 12.00, outsideBox: 5.50, assist: 2.80, card: 3.00 } },
      { name: "Viktor Gyökeres", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.00, header: 5.00, outsideBox: 8.00, assist: 4.50, card: 3.50 } },
      { name: "Linus Wahlqvist", pos: "DEF", specialties: ["card"], markets: { scorer: 14.00, header: 12.00, outsideBox: 28.00, assist: 8.00, card: 2.50 } }
    ]
  },

  "Tunísia": {
    type: "national",
    players: [
      { name: "Wahbi Khazri", pos: "FWD", specialties: ["scorer", "outsideBox", "assist"], markets: { scorer: 2.50, header: 10.00, outsideBox: 6.00, assist: 3.00, card: 3.50 } },
      { name: "Youssef Msakni", pos: "MID", specialties: ["assist", "outsideBox"], markets: { scorer: 4.00, header: 14.00, outsideBox: 7.00, assist: 2.80, card: 3.00 } },
      { name: "Ellyes Skhiri", pos: "MID", specialties: ["card", "outsideBox"], markets: { scorer: 6.00, header: 12.00, outsideBox: 9.00, assist: 5.00, card: 2.00 } },
      { name: "Naïm Sliti", pos: "FWD", specialties: ["scorer", "assist"], markets: { scorer: 3.20, header: 12.00, outsideBox: 7.50, assist: 3.50, card: 3.00 } }
    ]
  },

  "Austrália": {
    type: "national",
    players: [
      { name: "Mathew Leckie", pos: "FWD", specialties: ["scorer", "assist"], markets: { scorer: 3.00, header: 10.00, outsideBox: 8.00, assist: 3.50, card: 3.00 } },
      { name: "Jamie Maclaren", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.20, header: 5.00, outsideBox: 12.00, assist: 5.00, card: 3.50 } },
      { name: "Craig Goodwin", pos: "MID", specialties: ["assist", "outsideBox"], markets: { scorer: 4.00, header: 14.00, outsideBox: 7.00, assist: 2.80, card: 3.00 } },
      { name: "Aaron Mooy", pos: "MID", specialties: ["outsideBox", "card"], markets: { scorer: 5.50, header: 12.00, outsideBox: 6.50, assist: 4.50, card: 2.50 } },
      { name: "Jackson Irvine", pos: "MID", specialties: ["card", "assist"], markets: { scorer: 6.00, header: 10.00, outsideBox: 9.00, assist: 5.00, card: 2.20 } }
    ]
  },

  "Turquia": {
    type: "national",
    players: [
      { name: "Hakan Çalhanoğlu", pos: "MID", specialties: ["outsideBox", "assist", "scorer"], markets: { scorer: 3.00, header: 12.00, outsideBox: 5.50, assist: 2.50, card: 3.50 } },
      { name: "Kerem Aktürkoğlu", pos: "FWD", specialties: ["assist", "scorer", "outsideBox"], markets: { scorer: 2.80, header: 14.00, outsideBox: 6.00, assist: 2.30, card: 3.00 } },
      { name: "Cenk Tosun", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.50, header: 4.50, outsideBox: 10.00, assist: 5.00, card: 4.00 } },
      { name: "Arda Güler", pos: "MID", specialties: ["assist", "outsideBox"], markets: { scorer: 4.50, header: 16.00, outsideBox: 7.50, assist: 2.80, card: 3.50 } },
      { name: "Okay Yokuşlu", pos: "MID", specialties: ["card"], markets: { scorer: 8.00, header: 12.00, outsideBox: 14.00, assist: 6.00, card: 2.00 } }
    ]
  },

  "Estados Unidos": {
    type: "national",
    players: [
      { name: "Christian Pulisic", pos: "FWD", specialties: ["scorer", "assist", "outsideBox"], markets: { scorer: 2.20, header: 12.00, outsideBox: 6.00, assist: 2.50, card: 3.50 } },
      { name: "Weston McKennie", pos: "MID", specialties: ["card", "header"], markets: { scorer: 5.00, header: 7.00, outsideBox: 10.00, assist: 5.00, card: 2.20 } },
      { name: "Tyler Adams", pos: "MID", specialties: ["card"], markets: { scorer: 8.00, header: 14.00, outsideBox: 12.00, assist: 6.00, card: 2.00 } },
      { name: "Folarin Balogun", pos: "FWD", specialties: ["scorer", "assist"], markets: { scorer: 2.50, header: 9.00, outsideBox: 8.00, assist: 4.00, card: 3.00 } },
      { name: "Giovanni Reyna", pos: "MID", specialties: ["assist", "outsideBox"], markets: { scorer: 4.00, header: 15.00, outsideBox: 7.00, assist: 2.80, card: 3.50 } }
    ]
  },

  "Chile": {
    type: "national",
    players: [
      { name: "Alexis Sánchez", pos: "FWD", specialties: ["scorer", "assist", "outsideBox"], markets: { scorer: 2.50, header: 10.00, outsideBox: 6.50, assist: 3.00, card: 4.00 } },
      { name: "Arturo Vidal", pos: "MID", specialties: ["card", "outsideBox"], markets: { scorer: 5.00, header: 8.00, outsideBox: 7.50, assist: 5.00, card: 2.00 } },
      { name: "Eduardo Vargas", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.30, header: 5.00, outsideBox: 10.00, assist: 5.50, card: 4.00 } },
      { name: "Charles Aránguiz", pos: "MID", specialties: ["assist", "card"], markets: { scorer: 6.00, header: 12.00, outsideBox: 9.00, assist: 3.50, card: 2.50 } }
    ]
  },

  "Equador": {
    type: "national",
    players: [
      { name: "Enner Valencia", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.20, header: 4.50, outsideBox: 10.00, assist: 5.00, card: 3.50 } },
      { name: "Moisés Caicedo", pos: "MID", specialties: ["card", "outsideBox"], markets: { scorer: 6.00, header: 10.00, outsideBox: 8.00, assist: 5.00, card: 2.00 } },
      { name: "Gonzalo Plata", pos: "FWD", specialties: ["assist", "outsideBox"], markets: { scorer: 3.50, header: 14.00, outsideBox: 7.00, assist: 2.80, card: 3.00 } },
      { name: "Michael Estrada", pos: "FWD", specialties: ["scorer", "assist"], markets: { scorer: 2.80, header: 8.00, outsideBox: 9.00, assist: 4.50, card: 3.50 } }
    ]
  },

  "Japão": {
    type: "national",
    players: [
      { name: "Takefusa Kubo", pos: "FWD", specialties: ["assist", "outsideBox", "scorer"], markets: { scorer: 3.00, header: 15.00, outsideBox: 6.00, assist: 2.30, card: 3.00 } },
      { name: "Daichi Kamada", pos: "MID", specialties: ["assist", "scorer"], markets: { scorer: 3.50, header: 12.00, outsideBox: 7.50, assist: 2.50, card: 3.00 } },
      { name: "Takumi Minamino", pos: "FWD", specialties: ["scorer", "assist", "outsideBox"], markets: { scorer: 2.80, header: 12.00, outsideBox: 6.50, assist: 3.00, card: 3.50 } },
      { name: "Ritsu Doan", pos: "FWD", specialties: ["assist", "outsideBox"], markets: { scorer: 3.50, header: 14.00, outsideBox: 7.00, assist: 2.80, card: 3.00 } },
      { name: "Wataru Endo", pos: "MID", specialties: ["card", "outsideBox"], markets: { scorer: 6.00, header: 10.00, outsideBox: 8.00, assist: 5.50, card: 2.00 } }
    ]
  },

  "Nigéria": {
    type: "national",
    players: [
      { name: "Victor Osimhen", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 1.80, header: 4.00, outsideBox: 10.00, assist: 5.00, card: 4.00 } },
      { name: "Samuel Chukwueze", pos: "FWD", specialties: ["assist", "outsideBox", "scorer"], markets: { scorer: 3.00, header: 14.00, outsideBox: 6.50, assist: 2.50, card: 3.00 } },
      { name: "Alex Iwobi", pos: "MID", specialties: ["assist", "outsideBox"], markets: { scorer: 4.50, header: 12.00, outsideBox: 7.00, assist: 2.80, card: 3.00 } },
      { name: "Taiwo Awoniyi", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.50, header: 5.00, outsideBox: 11.00, assist: 5.50, card: 3.50 } }
    ]
  },

  "Senegal": {
    type: "national",
    players: [
      { name: "Sadio Mané", pos: "FWD", specialties: ["scorer", "assist", "outsideBox"], markets: { scorer: 2.00, header: 10.00, outsideBox: 6.00, assist: 2.50, card: 3.50 } },
      { name: "Ismaïla Sarr", pos: "FWD", specialties: ["scorer", "assist"], markets: { scorer: 2.80, header: 12.00, outsideBox: 7.50, assist: 3.00, card: 3.00 } },
      { name: "Habib Diallo", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.30, header: 4.50, outsideBox: 10.00, assist: 5.00, card: 4.00 } },
      { name: "Idrissa Gueye", pos: "MID", specialties: ["card"], markets: { scorer: 8.00, header: 14.00, outsideBox: 12.00, assist: 6.00, card: 2.00 } }
    ]
  },

  "Colômbia": {
    type: "national",
    players: [
      { name: "James Rodríguez", pos: "MID", specialties: ["assist", "outsideBox", "scorer"], markets: { scorer: 3.00, header: 12.00, outsideBox: 5.50, assist: 2.20, card: 3.50 } },
      { name: "Luis Díaz", pos: "FWD", specialties: ["scorer", "assist", "outsideBox"], markets: { scorer: 2.20, header: 10.00, outsideBox: 6.00, assist: 2.80, card: 3.00 } },
      { name: "Juan Cuadrado", pos: "MID", specialties: ["assist", "outsideBox"], markets: { scorer: 5.00, header: 14.00, outsideBox: 7.50, assist: 2.50, card: 3.00 } },
      { name: "Radamel Falcao", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.00, header: 4.50, outsideBox: 10.00, assist: 5.00, card: 4.00 } }
    ]
  },

  "Venezuela": {
    type: "national",
    players: [
      { name: "Salomón Rondón", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.50, header: 4.50, outsideBox: 10.00, assist: 5.00, card: 4.00 } },
      { name: "Jefferson Savarino", pos: "MID", specialties: ["assist", "outsideBox"], markets: { scorer: 4.00, header: 14.00, outsideBox: 7.00, assist: 2.80, card: 3.00 } },
      { name: "Yeferson Soteldo", pos: "FWD", specialties: ["assist", "outsideBox"], markets: { scorer: 3.50, header: 16.00, outsideBox: 6.50, assist: 2.50, card: 3.50 } },
      { name: "Tomás Rincón", pos: "MID", specialties: ["card", "outsideBox"], markets: { scorer: 7.00, header: 12.00, outsideBox: 9.00, assist: 5.50, card: 2.00 } }
    ]
  },

  "Croácia": {
    type: "national",
    players: [
      { name: "Luka Modrić", pos: "MID", specialties: ["assist", "outsideBox", "scorer"], markets: { scorer: 4.00, header: 14.00, outsideBox: 6.00, assist: 2.30, card: 3.00 } },
      { name: "Ivan Perišić", pos: "FWD", specialties: ["assist", "header", "scorer"], markets: { scorer: 3.00, header: 5.00, outsideBox: 8.00, assist: 2.50, card: 3.50 } },
      { name: "Mateo Kovačić", pos: "MID", specialties: ["assist", "outsideBox"], markets: { scorer: 5.00, header: 14.00, outsideBox: 7.50, assist: 2.80, card: 3.00 } },
      { name: "Ante Rebić", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.80, header: 5.00, outsideBox: 9.00, assist: 5.00, card: 4.00 } },
      { name: "Marcelo Brozović", pos: "MID", specialties: ["card", "outsideBox"], markets: { scorer: 6.00, header: 10.00, outsideBox: 8.00, assist: 5.00, card: 2.00 } }
    ]
  },

  "Egito": {
    type: "national",
    players: [
      { name: "Mohamed Salah", pos: "FWD", specialties: ["scorer", "assist", "outsideBox"], markets: { scorer: 1.80, header: 12.00, outsideBox: 5.50, assist: 2.30, card: 3.00 } },
      { name: "Mostafa Mohamed", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.50, header: 4.50, outsideBox: 10.00, assist: 5.00, card: 3.50 } },
      { name: "Trézéguet", pos: "FWD", specialties: ["assist", "outsideBox"], markets: { scorer: 3.50, header: 12.00, outsideBox: 7.00, assist: 3.00, card: 3.00 } },
      { name: "Mohamed Elneny", pos: "MID", specialties: ["card"], markets: { scorer: 7.00, header: 12.00, outsideBox: 10.00, assist: 5.50, card: 2.00 } }
    ]
  },

  "Sérvia": {
    type: "national",
    players: [
      { name: "Dušan Vlahović", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 1.90, header: 4.50, outsideBox: 8.00, assist: 5.00, card: 3.50 } },
      { name: "Aleksandar Mitrović", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.00, header: 4.00, outsideBox: 10.00, assist: 5.50, card: 4.00 } },
      { name: "Dušan Tadić", pos: "MID", specialties: ["assist", "outsideBox", "scorer"], markets: { scorer: 3.50, header: 12.00, outsideBox: 6.50, assist: 2.20, card: 3.00 } },
      { name: "Sergej Milinković-Savić", pos: "MID", specialties: ["header", "outsideBox", "assist"], markets: { scorer: 4.00, header: 6.00, outsideBox: 7.00, assist: 3.50, card: 3.00 } }
    ]
  },

  "Dinamarca": {
    type: "national",
    players: [
      { name: "Christian Eriksen", pos: "MID", specialties: ["assist", "outsideBox", "scorer"], markets: { scorer: 3.50, header: 12.00, outsideBox: 5.50, assist: 2.20, card: 3.00 } },
      { name: "Rasmus Højlund", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.20, header: 5.00, outsideBox: 9.00, assist: 4.50, card: 3.50 } },
      { name: "Kasper Dolberg", pos: "FWD", specialties: ["scorer", "assist"], markets: { scorer: 2.80, header: 8.00, outsideBox: 8.00, assist: 4.00, card: 3.00 } },
      { name: "Pierre-Emile Højbjerg", pos: "MID", specialties: ["card", "outsideBox"], markets: { scorer: 6.00, header: 10.00, outsideBox: 8.00, assist: 5.00, card: 2.00 } }
    ]
  },

  "Camarões": {
    type: "national",
    players: [
      { name: "Vincent Aboubakar", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.20, header: 4.50, outsideBox: 10.00, assist: 5.00, card: 4.00 } },
      { name: "Karl Toko Ekambi", pos: "FWD", specialties: ["scorer", "assist"], markets: { scorer: 2.80, header: 8.00, outsideBox: 8.00, assist: 3.50, card: 3.50 } },
      { name: "Eric Maxim Choupo-Moting", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.50, header: 5.00, outsideBox: 10.00, assist: 5.50, card: 4.00 } },
      { name: "André-Frank Zambo Anguissa", pos: "MID", specialties: ["card", "outsideBox"], markets: { scorer: 6.00, header: 12.00, outsideBox: 9.00, assist: 5.00, card: 2.00 } }
    ]
  },

  "Suíça": {
    type: "national",
    players: [
      { name: "Breel Embolo", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.30, header: 5.00, outsideBox: 10.00, assist: 5.00, card: 3.50 } },
      { name: "Granit Xhaka", pos: "MID", specialties: ["card", "outsideBox", "assist"], markets: { scorer: 5.00, header: 10.00, outsideBox: 7.00, assist: 3.50, card: 2.00 } },
      { name: "Remo Freuler", pos: "MID", specialties: ["assist", "card"], markets: { scorer: 6.00, header: 12.00, outsideBox: 9.00, assist: 3.50, card: 2.50 } }
    ]
  },

  "Arábia Saudita": {
    type: "national",
    players: [
      { name: "Salem Al-Dawsari", pos: "FWD", specialties: ["scorer", "assist", "outsideBox"], markets: { scorer: 2.80, header: 10.00, outsideBox: 6.00, assist: 3.00, card: 3.50 } },
      { name: "Nasser Al-Shamrani", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.50, header: 4.50, outsideBox: 10.00, assist: 5.00, card: 4.00 } },
      { name: "Sami Al-Najei", pos: "MID", specialties: ["assist", "outsideBox"], markets: { scorer: 4.00, header: 14.00, outsideBox: 7.00, assist: 3.00, card: 3.00 } },
      { name: "Abdullah Al-Mayuf", pos: "MID", specialties: ["card"], markets: { scorer: 7.00, header: 12.00, outsideBox: 10.00, assist: 5.50, card: 2.00 } }
    ]
  },

  "Romênia": {
    type: "national",
    players: [
      { name: "Denis Drăguș", pos: "FWD", specialties: ["scorer", "assist"], markets: { scorer: 2.80, header: 8.00, outsideBox: 8.00, assist: 3.50, card: 3.00 } },
      { name: "Alexandru Mitriță", pos: "MID", specialties: ["assist", "outsideBox"], markets: { scorer: 4.00, header: 14.00, outsideBox: 7.00, assist: 2.80, card: 3.00 } },
      { name: "Florinel Coman", pos: "FWD", specialties: ["scorer", "outsideBox"], markets: { scorer: 3.00, header: 12.00, outsideBox: 6.50, assist: 4.00, card: 3.50 } },
      { name: "Nicolae Stanciu", pos: "MID", specialties: ["assist", "outsideBox"], markets: { scorer: 4.50, header: 12.00, outsideBox: 7.50, assist: 2.50, card: 3.00 } }
    ]
  },

  "Polônia": {
    type: "national",
    players: [
      { name: "Robert Lewandowski", pos: "FWD", specialties: ["scorer", "header", "assist"], markets: { scorer: 1.70, header: 4.00, outsideBox: 8.00, assist: 3.50, card: 3.00 } },
      { name: "Piotr Zieliński", pos: "MID", specialties: ["assist", "outsideBox"], markets: { scorer: 4.00, header: 12.00, outsideBox: 6.50, assist: 2.50, card: 3.00 } },
      { name: "Arkadiusz Milik", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.30, header: 5.00, outsideBox: 9.00, assist: 5.00, card: 3.50 } },
      { name: "Kamil Grosicki", pos: "FWD", specialties: ["assist", "outsideBox"], markets: { scorer: 3.50, header: 14.00, outsideBox: 7.00, assist: 2.80, card: 3.00 } }
    ]
  },

  "Gana": {
    type: "national",
    players: [
      { name: "Mohammed Kudus", pos: "MID", specialties: ["scorer", "assist", "outsideBox"], markets: { scorer: 2.80, header: 10.00, outsideBox: 6.00, assist: 3.00, card: 3.00 } },
      { name: "André Ayew", pos: "FWD", specialties: ["scorer", "assist"], markets: { scorer: 2.50, header: 6.00, outsideBox: 8.00, assist: 3.50, card: 4.00 } },
      { name: "Jordan Ayew", pos: "FWD", specialties: ["assist", "scorer"], markets: { scorer: 3.00, header: 8.00, outsideBox: 8.00, assist: 3.00, card: 3.50 } },
      { name: "Thomas Partey", pos: "MID", specialties: ["card", "outsideBox"], markets: { scorer: 6.00, header: 10.00, outsideBox: 7.50, assist: 5.00, card: 2.00 } }
    ]
  },

  "Peru": {
    type: "national",
    players: [
      { name: "Paolo Guerrero", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.30, header: 4.50, outsideBox: 10.00, assist: 5.00, card: 4.00 } },
      { name: "Christian Cueva", pos: "MID", specialties: ["assist", "outsideBox"], markets: { scorer: 4.00, header: 14.00, outsideBox: 7.00, assist: 2.80, card: 3.50 } },
      { name: "Gianluca Lapadula", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.50, header: 5.00, outsideBox: 10.00, assist: 5.50, card: 3.50 } },
      { name: "Renato Tapia", pos: "MID", specialties: ["card"], markets: { scorer: 7.00, header: 12.00, outsideBox: 10.00, assist: 5.50, card: 2.00 } }
    ]
  },

  "Paraguai": {
    type: "national",
    players: [
      { name: "Miguel Almirón", pos: "MID", specialties: ["assist", "outsideBox", "scorer"], markets: { scorer: 3.00, header: 14.00, outsideBox: 6.00, assist: 2.50, card: 3.00 } },
      { name: "Antonio Sanabria", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.50, header: 5.00, outsideBox: 10.00, assist: 5.00, card: 3.50 } },
      { name: "Angel Romero", pos: "FWD", specialties: ["scorer", "assist"], markets: { scorer: 2.80, header: 8.00, outsideBox: 8.00, assist: 3.00, card: 3.50 } },
      { name: "Oscar Romero", pos: "MID", specialties: ["assist", "outsideBox"], markets: { scorer: 4.00, header: 12.00, outsideBox: 7.00, assist: 2.80, card: 3.00 } }
    ]
  },

  "Irã": {
    type: "national",
    players: [
      { name: "Sardar Azmoun", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.20, header: 5.00, outsideBox: 8.00, assist: 5.00, card: 3.50 } },
      { name: "Ali Taremi", pos: "FWD", specialties: ["scorer", "assist"], markets: { scorer: 2.50, header: 6.00, outsideBox: 8.00, assist: 3.50, card: 3.50 } },
      { name: "Mehdi Taremi", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.30, header: 5.00, outsideBox: 9.00, assist: 5.00, card: 4.00 } },
      { name: "Alireza Jahanbakhsh", pos: "FWD", specialties: ["assist", "outsideBox"], markets: { scorer: 3.50, header: 12.00, outsideBox: 6.50, assist: 3.00, card: 3.00 } }
    ]
  },

  "Argélia": {
    type: "national",
    players: [
      { name: "Riyad Mahrez", pos: "FWD", specialties: ["assist", "outsideBox", "scorer"], markets: { scorer: 2.50, header: 12.00, outsideBox: 5.50, assist: 2.20, card: 3.00 } },
      { name: "Islam Slimani", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.30, header: 4.50, outsideBox: 10.00, assist: 5.00, card: 4.00 } },
      { name: "Ismaël Bennacer", pos: "MID", specialties: ["assist", "outsideBox"], markets: { scorer: 5.00, header: 14.00, outsideBox: 7.50, assist: 2.80, card: 3.00 } },
      { name: "Sofiane Feghouli", pos: "MID", specialties: ["assist", "scorer"], markets: { scorer: 3.50, header: 12.00, outsideBox: 7.00, assist: 2.50, card: 3.50 } }
    ]
  },

  "Costa Rica": {
    type: "national",
    players: [
      { name: "Joel Campbell", pos: "FWD", specialties: ["scorer", "assist"], markets: { scorer: 2.80, header: 10.00, outsideBox: 8.00, assist: 3.00, card: 3.50 } },
      { name: "Celso Borges", pos: "MID", specialties: ["assist", "outsideBox"], markets: { scorer: 4.50, header: 12.00, outsideBox: 7.50, assist: 2.80, card: 3.00 } },
      { name: "Anthony Contreras", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.50, header: 5.00, outsideBox: 10.00, assist: 5.00, card: 3.50 } },
      { name: "Bryan Ruiz", pos: "MID", specialties: ["assist", "outsideBox"], markets: { scorer: 4.00, header: 14.00, outsideBox: 7.00, assist: 2.50, card: 3.00 } }
    ]
  },

  "Áustria": {
    type: "national",
    players: [
      { name: "Marko Arnautović", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.30, header: 4.50, outsideBox: 9.00, assist: 5.00, card: 4.00 } },
      { name: "Marcel Sabitzer", pos: "MID", specialties: ["assist", "outsideBox", "scorer"], markets: { scorer: 3.50, header: 10.00, outsideBox: 6.50, assist: 2.80, card: 3.00 } },
      { name: "Michael Gregoritsch", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.80, header: 5.00, outsideBox: 10.00, assist: 5.50, card: 3.50 } },
      { name: "Xaver Schlager", pos: "MID", specialties: ["card", "outsideBox"], markets: { scorer: 6.00, header: 12.00, outsideBox: 8.00, assist: 5.00, card: 2.00 } }
    ]
  },

  "Catar": {
    type: "national",
    players: [
      { name: "Almoez Ali", pos: "FWD", specialties: ["scorer", "header"], markets: { scorer: 2.50, header: 4.50, outsideBox: 10.00, assist: 5.00, card: 4.00 } },
      { name: "Akram Afif", pos: "FWD", specialties: ["assist", "outsideBox", "scorer"], markets: { scorer: 3.00, header: 12.00, outsideBox: 6.00, assist: 2.50, card: 3.00 } },
      { name: "Karim Boudiaf", pos: "MID", specialties: ["card", "outsideBox"], markets: { scorer: 6.00, header: 12.00, outsideBox: 9.00, assist: 5.50, card: 2.00 } },
      { name: "Abdelkarim Hassan", pos: "DEF", specialties: ["card", "header"], markets: { scorer: 9.00, header: 8.00, outsideBox: 18.00, assist: 7.00, card: 2.50 } }
    ]
  }
};

if (typeof module !== 'undefined') {
  module.exports = playersData;
}
