export interface ITeamColors {
  full: string;
  crest: string;
  text: string;
  stroke: string;
}

export const TEAMS_DATA: Record<string, ITeamColors> = {
  BRA: { full: 'Brasil',          crest: '#00A550', text: '#FFE61F', stroke: '#FFE61F' },
  ARG: { full: 'Argentina',       crest: '#75AADB', text: '#0E2D55', stroke: '#fff' },
  FRA: { full: 'França',          crest: '#1F3A8B', text: '#fff',    stroke: '#E63946' },
  ALE: { full: 'Alemanha',        crest: '#1A1A1A', text: '#FFD700', stroke: '#E63946' },
  GER: { full: 'Alemanha',        crest: '#1A1A1A', text: '#FFD700', stroke: '#E63946' },
  POR: { full: 'Portugal',        crest: '#C8102E', text: '#FFD700', stroke: '#0B6E4F' },
  ESP: { full: 'Espanha',         crest: '#AA151B', text: '#FFD700', stroke: '#FFD700' },
  ENG: { full: 'Inglaterra',      crest: '#E8E8EE', text: '#C8102E', stroke: '#1E3A8B' },
  ING: { full: 'Inglaterra',      crest: '#E8E8EE', text: '#C8102E', stroke: '#1E3A8B' },
  ITA: { full: 'Itália',          crest: '#0066B3', text: '#fff',    stroke: '#fff' },
  MEX: { full: 'México',          crest: '#006847', text: '#fff',    stroke: '#CE1126' },
  USA: { full: 'Estados Unidos',  crest: '#3C3B6E', text: '#fff',    stroke: '#B22234' },
  CAN: { full: 'Canadá',          crest: '#D52B1E', text: '#fff',    stroke: '#fff' },
  JPN: { full: 'Japão',           crest: '#fff',    text: '#BC002D', stroke: '#BC002D' },
  CRO: { full: 'Croácia',         crest: '#E8112D', text: '#fff',    stroke: '#fff' },
  BEL: { full: 'Bélgica',         crest: '#0A0A0A', text: '#FAE042', stroke: '#FAE042' },
  NED: { full: 'Holanda',         crest: '#FF6B1A', text: '#fff',    stroke: '#fff' },
  HOL: { full: 'Holanda',         crest: '#FF6B1A', text: '#fff',    stroke: '#fff' },
  URU: { full: 'Uruguai',         crest: '#5DA9E9', text: '#fff',    stroke: '#fff' },
  COL: { full: 'Colômbia',        crest: '#FCD116', text: '#0033A0', stroke: '#0033A0' },
  CHI: { full: 'Chile',           crest: '#D52B1E', text: '#fff',    stroke: '#fff' },
  SUI: { full: 'Suíça',           crest: '#D52B1E', text: '#fff',    stroke: '#fff' },
  SEN: { full: 'Senegal',         crest: '#00853F', text: '#FDEF42', stroke: '#FDEF42' },
  MAR: { full: 'Marrocos',        crest: '#C1272D', text: '#006233', stroke: '#006233' },
  ECU: { full: 'Equador',         crest: '#FFD100', text: '#003893', stroke: '#003893' },
  GHA: { full: 'Gana',            crest: '#006B3F', text: '#FCD116', stroke: '#FCD116' },
  KOR: { full: 'Coreia do Sul',   crest: '#fff',    text: '#C60C30', stroke: '#C60C30' },
  POL: { full: 'Polônia',         crest: '#DC143C', text: '#fff',    stroke: '#fff' },
  AUS: { full: 'Austrália',       crest: '#00843D', text: '#FFCD00', stroke: '#FFCD00' },
  DEN: { full: 'Dinamarca',       crest: '#C60C30', text: '#fff',    stroke: '#fff' },
  TUN: { full: 'Tunísia',         crest: '#E70013', text: '#fff',    stroke: '#fff' },
  CMR: { full: 'Camarões',        crest: '#007A5E', text: '#CE1126', stroke: '#FCD116' },
  SRB: { full: 'Sérvia',          crest: '#C6363C', text: '#fff',    stroke: '#0C4076' },
  QAT: { full: 'Qatar',           crest: '#8D1B3D', text: '#fff',    stroke: '#fff' },
};

export const DEFAULT_TEAM_COLORS: ITeamColors = {
  full: 'Seleção',
  crest: '#334155',
  text: '#94A3B8',
  stroke: '#475569',
};

// ── TLA → ISO 3166-1 alpha-2 (flagcdn.com) ────────────────────────────
export const TLA_TO_ISO2: Record<string, string> = {
  // América do Sul
  BRA: 'br', ARG: 'ar', URU: 'uy', COL: 'co', ECU: 'ec',
  PAR: 'py', VEN: 've', BOL: 'bo', PER: 'pe', CHI: 'cl',
  // América do Norte / Central / Caribe
  USA: 'us', MEX: 'mx', CAN: 'ca', PAN: 'pa', JAM: 'jm',
  CRC: 'cr', HON: 'hn', SLV: 'sv', GTM: 'gt', TRI: 'tt',
  HAI: 'ht', CUB: 'cu',
  // Europa
  FRA: 'fr', GER: 'de', ALE: 'de', ESP: 'es', POR: 'pt',
  ENG: 'gb-eng', ING: 'gb-eng', ITA: 'it', NED: 'nl', HOL: 'nl',
  BEL: 'be', SUI: 'ch', CRO: 'hr', SRB: 'rs', POL: 'pl',
  DEN: 'dk', NOR: 'no', SWE: 'se', AUT: 'at', UKR: 'ua',
  TUR: 'tr', HUN: 'hu', GRE: 'gr', SVK: 'sk', SVN: 'si',
  ROU: 'ro', CZE: 'cz', SCO: 'gb-sct', WAL: 'gb-wls',
  IRL: 'ie', ISL: 'is', FIN: 'fi', ALB: 'al', MNE: 'me',
  BIH: 'ba', MKD: 'mk', GEO: 'ge', ARM: 'am', AZE: 'az',
  // África
  MAR: 'ma', SEN: 'sn', NGA: 'ng', CMR: 'cm', EGY: 'eg',
  GHA: 'gh', TUN: 'tn', CIV: 'ci', GIN: 'gn', ALG: 'dz',
  ZAF: 'za', TZA: 'tz', EQG: 'gq', MOZ: 'mz', ANG: 'ao',
  ETH: 'et', UGA: 'ug', ZAM: 'zm', KEN: 'ke', MLI: 'ml',
  // Ásia
  JPN: 'jp', KOR: 'kr', AUS: 'au', IRN: 'ir', KSA: 'sa',
  QAT: 'qa', IDN: 'id', JOR: 'jo', IRQ: 'iq', UZB: 'uz',
  CHN: 'cn', IND: 'in', KUW: 'kw', UAE: 'ae', OMA: 'om',
  // Oceania
  NZL: 'nz',
};

export function getTlaIso2(tla: string | null | undefined): string | null {
  if (!tla) return null;
  return TLA_TO_ISO2[tla.toUpperCase()] ?? null;
}

export function getTeamColors(tla: string | null | undefined): ITeamColors {
  if (!tla) return DEFAULT_TEAM_COLORS;
  return TEAMS_DATA[tla.toUpperCase()] ?? DEFAULT_TEAM_COLORS;
}
