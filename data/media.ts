
import { MediaItem } from '../types';
import { generateArt } from '../utils/artEngine';

const RAW_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'm1',
    title: 'The Matrix',
    type: 'MOVIE',
    year: 1999,
    creator: 'Wachowskis',
    descriptionDe: 'Ein Hacker entdeckt, dass die Welt eine Simulation ist, die von Maschinen geschaffen wurde, um die Menschheit zu versklaven. Ein Paradebeispiel für die Simulations-Theorie und gnostische Motive.',
    descriptionEn: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers. A prime example of simulation theory.',
    tags: ['Simulation', 'AI', 'Control', 'Gnosticism'],
    realityScore: 40,
    complexity: 'MINDBENDING',
    relatedTheoryTags: ['Simulation Theory', 'AI', 'Control']
  },
  {
    id: 'm2',
    title: 'The X-Files',
    type: 'SERIES',
    year: 1993,
    creator: 'Chris Carter',
    descriptionDe: 'Zwei FBI-Agenten untersuchen das Paranormale. Die Serie etablierte das moderne Bild der Regierungsverschwörung zur Vertuschung extraterrestrischen Lebens (Syndikat).',
    descriptionEn: 'Two FBI agents investigate the paranormal. The series established the modern trope of a government conspiracy covering up extraterrestrial life.',
    tags: ['UFO', 'Government', 'Aliens', 'Deep State'],
    realityScore: 60,
    complexity: 'HIGH',
    relatedTheoryTags: ['UFO', 'Area 51', 'Men in Black']
  },
  {
    id: 'm3',
    title: 'Deus Ex',
    type: 'GAME',
    year: 2000,
    creator: 'Ion Storm',
    descriptionDe: 'Ein Cyberpunk-Spiel, das fast jede moderne Verschwörungstheorie (Illuminaten, FEMA, Area 51, Graue Aliens) in eine kohärente Handlung webt. Legendär für seine Vorhersage des Falls der Twin Towers.',
    descriptionEn: 'A cyberpunk game that weaves almost every modern conspiracy theory (Illuminati, FEMA, Area 51, Grey Aliens) into a coherent plot. Legendary for predicting the fall of the Twin Towers.',
    tags: ['Cyberpunk', 'Illuminati', 'AI', 'NWO'],
    realityScore: 75,
    complexity: 'HIGH',
    relatedTheoryTags: ['NWO', 'Illuminati', 'AI']
  },
  {
    id: 'm4',
    title: 'They Live',
    type: 'MOVIE',
    year: 1988,
    creator: 'John Carpenter',
    descriptionDe: 'Ein Bauarbeiter findet eine Sonnenbrille, die enthüllt, dass die herrschende Klasse in Wirklichkeit Aliens sind, die uns durch subliminale Botschaften kontrollieren.',
    descriptionEn: 'A construction worker discovers sunglasses that reveal the ruling class are actually aliens controlling us through subliminal messages.',
    tags: ['Aliens', 'Control', 'Media', 'Subliminal'],
    realityScore: 50,
    complexity: 'MEDIUM',
    relatedTheoryTags: ['Reptilians', 'NWO', 'Mind Control']
  },
  {
    id: 'm5',
    title: 'Illuminatus! Trilogy',
    type: 'BOOK',
    year: 1975,
    creator: 'Robert Shea & Robert Anton Wilson',
    descriptionDe: 'Ein satirischer, postmoderner Roman, der den Diskordianismus und die Illuminaten-Verschwörung popularisierte. Ein psychedelischer Trip durch die Gegenkultur.',
    descriptionEn: 'A satirical, postmodern novel that popularized Discordianism and the Illuminati conspiracy. A psychedelic trip through counterculture.',
    tags: ['Illuminati', 'Satire', 'Discordianism', 'Fnord'],
    realityScore: 30,
    complexity: 'MINDBENDING',
    relatedTheoryTags: ['Illuminati', 'Atlantis', 'JFK']
  },
  {
    id: 'm25',
    title: 'Inside Job',
    type: 'SERIES',
    year: 2021,
    creator: 'Shion Takeuchi',
    descriptionDe: 'Für die Mitarbeiter von Cognito Inc. sind Verschwörungstheorien keine Fiktion, sondern Fakten. Eine brillante Satire über den "Deep State", die Echsenmenschen, Chemtrails und den Mandela-Effekt als bürokratischen Albtraum darstellt.',
    descriptionEn: 'For the employees of Cognito Inc., conspiracy theories aren\'t fiction, they\'re facts. A brilliant satire on the "Deep State", portraying lizard people, chemtrails, and the Mandela Effect as a bureaucratic nightmare.',
    tags: ['Deep State', 'Animation', 'Satire', 'Workplace'],
    realityScore: 90,
    complexity: 'HIGH',
    relatedTheoryTags: ['Deep State', 'Reptiloide', 'Hohle Erde', 'Mondlandung']
  },
  // --- NEW MOVIES ---
  {
    id: 'm6',
    title: 'JFK',
    type: 'MOVIE',
    year: 1991,
    creator: 'Oliver Stone',
    descriptionDe: 'Oliver Stones Meisterwerk über die Ermittlungen von Jim Garrison. Der Film verwebt Fakten und Spekulationen zu einer massiven Verschwörung des militärisch-industriellen Komplexes zur Ermordung Kennedys.',
    descriptionEn: 'Oliver Stone\'s masterpiece about Jim Garrison\'s investigation. The film weaves fact and speculation into a massive conspiracy by the military-industrial complex to assassinate Kennedy.',
    tags: ['Assassination', 'CIA', 'Politics', 'Cold War'],
    realityScore: 85,
    complexity: 'HIGH',
    relatedTheoryTags: ['JFK Assassination', 'Deep State', 'CIA']
  },
  {
    id: 'm7',
    title: 'Capricorn One',
    type: 'MOVIE',
    year: 1977,
    creator: 'Peter Hyams',
    descriptionDe: 'Ein Film über eine gefälschte Marslandung, die in einem TV-Studio inszeniert wird, weil die NASA einen Fehlschlag fürchtet. Dieser Film befeuerte massiv die "Mondlandung war Fake"-Theorien.',
    descriptionEn: 'A movie about a faked Mars landing staged in a TV studio because NASA fears failure. This film massively fueled the "Moon Landing Hoax" theories.',
    tags: ['Space', 'Hoax', 'NASA', 'Government'],
    realityScore: 60,
    complexity: 'MEDIUM',
    relatedTheoryTags: ['Moon Landing Fake', 'NASA', 'Cover-up']
  },
  {
    id: 'm8',
    title: 'Eyes Wide Shut',
    type: 'MOVIE',
    year: 1999,
    creator: 'Stanley Kubrick',
    descriptionDe: 'Kubricks letzter Film über geheime, maskierte Elite-Rituale in New York. Oft zitiert als Enthüllung echter okkulter Praktiken der Oberschicht (Illuminaten/Epstein-Parallelen).',
    descriptionEn: 'Kubrick\'s final film about secret, masked elite rituals in New York. Often cited as an exposure of real occult practices of the upper class (Illuminati/Epstein parallels).',
    tags: ['Occult', 'Elite', 'Secret Society', 'Rituals'],
    realityScore: 70,
    complexity: 'HIGH',
    relatedTheoryTags: ['Illuminati', 'Bohemian Grove', 'Elite']
  },
  {
    id: 'm9',
    title: 'The Truman Show',
    type: 'MOVIE',
    year: 1998,
    creator: 'Peter Weir',
    descriptionDe: 'Ein Mann entdeckt, dass sein gesamtes Leben eine Reality-TV-Show ist. Eine Metapher für die "Simulierte Realität" und totale Überwachung (Gang Stalking).',
    descriptionEn: 'A man discovers his entire life is a reality TV show. A metaphor for "Simulated Reality" and total surveillance (Gang Stalking).',
    tags: ['Simulation', 'Media', 'Surveillance', 'Control'],
    realityScore: 45,
    complexity: 'MEDIUM',
    relatedTheoryTags: ['Simulation Theory', 'Gang Stalking', 'Flat Earth']
  },
  {
    id: 'm10',
    title: 'Videodrome',
    type: 'MOVIE',
    year: 1983,
    creator: 'David Cronenberg',
    descriptionDe: 'Ein piratensender strahlt ein Signal aus, das Halluzinationen und physische Mutationen verursacht. Ein Klassiker über Gedankenkontrolle durch Medien.',
    descriptionEn: 'A pirate signal broadcasts a transmission that causes hallucinations and physical mutations. A classic about mind control through media.',
    tags: ['Body Horror', 'Media', 'Mind Control', 'Signal'],
    realityScore: 20,
    complexity: 'MINDBENDING',
    relatedTheoryTags: ['Mind Control', 'Subliminal', 'Transhumanism']
  },
  
  // --- NEW SERIES ---
  {
    id: 'm11',
    title: 'Mr. Robot',
    type: 'SERIES',
    year: 2015,
    creator: 'Sam Esmail',
    descriptionDe: 'Eine Hackergruppe (fsociety) plant den Sturz des globalen Finanzkonglomerats "E Corp". Behandelt Themen wie Schuldenversklavung, Cyber-Warfare und die Elite (Deus Group).',
    descriptionEn: 'A hacker group (fsociety) plots to take down the global financial conglomerate "E Corp". Covers themes of debt slavery, cyber warfare, and the elite (Deus Group).',
    tags: ['Hacking', 'Economy', 'Elite', 'Anarchy'],
    realityScore: 88,
    complexity: 'HIGH',
    relatedTheoryTags: ['The Great Reset', 'NWO', 'Banking']
  },
  {
    id: 'm12',
    title: 'Utopia (UK)',
    type: 'SERIES',
    year: 2013,
    creator: 'Dennis Kelly',
    descriptionDe: 'Fans eines Graphic Novels entdecken eine Verschwörung ("The Network"), die eine globale Pandemie plant, um die Weltbevölkerung durch Impfstoffe zu sterilisieren. Unheimlich prophetisch.',
    descriptionEn: 'Fans of a graphic novel discover a conspiracy ("The Network") planning a global pandemic to sterilize the world population via vaccines. Eerily prophetic.',
    tags: ['Pandemic', 'Depopulation', 'Deep State', 'Comics'],
    realityScore: 65,
    complexity: 'HIGH',
    relatedTheoryTags: ['Corona Plandemic', 'The Great Reset', 'Big Pharma']
  },
  {
    id: 'm13',
    title: 'Black Mirror',
    type: 'SERIES',
    year: 2011,
    creator: 'Charlie Brooker',
    descriptionDe: 'Eine Anthologie-Serie über die dunklen Seiten der Technologie. Episoden wie "Nosedive" (Social Credit) oder "Playtest" (AR-Horror) greifen reale technokratische Ängste auf.',
    descriptionEn: 'An anthology series about the dark side of technology. Episodes like "Nosedive" (Social Credit) or "Playtest" (AR Horror) tap into real technocratic fears.',
    tags: ['Technology', 'Dystopia', 'AI', 'Surveillance'],
    realityScore: 80,
    complexity: 'MEDIUM',
    relatedTheoryTags: ['Transhumanism', '5G Mind Control', 'Simulation Theory']
  },
  {
    id: 'm14',
    title: 'Severance',
    type: 'SERIES',
    year: 2022,
    creator: 'Dan Erickson',
    descriptionDe: 'Mitarbeiter unterziehen sich einer Gehirn-OP, um ihre Arbeits-Erinnerungen vom Privatleben zu trennen. Eine Parabel auf Konzern-Kulte, Gedankenkontrolle und MK-Ultra.',
    descriptionEn: 'Employees undergo brain surgery to separate their work memories from their personal lives. A parable on corporate cults, mind control, and MK-Ultra.',
    tags: ['Corporate', 'Mind Control', 'Mystery', 'Psychology'],
    realityScore: 55,
    complexity: 'HIGH',
    relatedTheoryTags: ['MK-Ultra', 'Mind Control', 'Corporate Control']
  },

  // --- NEW BOOKS ---
  {
    id: 'm15',
    title: '1984',
    type: 'BOOK',
    year: 1949,
    creator: 'George Orwell',
    descriptionDe: 'Der ultimative dystopische Roman. "Big Brother", "Neusprech" und das "Wahrheitsministerium" sind heute die Standardbegriffe jeder Verschwörungsdiskussion über Überwachung.',
    descriptionEn: 'The ultimate dystopian novel. "Big Brother", "Newspeak", and the "Ministry of Truth" are now standard terms in any conspiracy discussion about surveillance.',
    tags: ['Dystopia', 'Surveillance', 'Totalitarianism', 'Propaganda'],
    realityScore: 95,
    complexity: 'MEDIUM',
    relatedTheoryTags: ['NWO', 'Surveillance', 'Police State']
  },
  {
    id: 'm16',
    title: 'Brave New World',
    type: 'BOOK',
    year: 1932,
    creator: 'Aldous Huxley',
    descriptionDe: 'Eine Gesellschaft, die durch Drogen (Soma), Gentechnik und Konditionierung kontrolliert wird – nicht durch Schmerz (wie bei Orwell), sondern durch Vergnügen.',
    descriptionEn: 'A society controlled by drugs (Soma), genetic engineering, and conditioning – not through pain (like Orwell), but through pleasure.',
    tags: ['Eugenics', 'Control', 'Drugs', 'Engineering'],
    realityScore: 92,
    complexity: 'MEDIUM',
    relatedTheoryTags: ['Transhumanism', 'Fluoride', 'Social Engineering']
  },
  {
    id: 'm17',
    title: 'Foucault\'s Pendulum',
    type: 'BOOK',
    year: 1988,
    creator: 'Umberto Eco',
    descriptionDe: 'Drei Verlagsmitarbeiter erfinden zum Spaß einen "Plan" der Tempelritter zur Weltherrschaft – bis Geheimbünde anfangen, den Plan ernst zu nehmen. Die Dekonstruktion des Verschwörungsdenkens.',
    descriptionEn: 'Three editors invent a "Plan" of the Knights Templar for world domination as a joke – untill secret societies start taking the plan seriously. The deconstruction of conspiracy thinking.',
    tags: ['History', 'Occult', 'Templars', 'Satire'],
    realityScore: 80,
    complexity: 'MINDBENDING',
    relatedTheoryTags: ['Knights Templar', 'Illuminati', 'Rosicrucians']
  },
  {
    id: 'm18',
    title: 'The Da Vinci Code',
    type: 'BOOK',
    year: 2003,
    creator: 'Dan Brown',
    descriptionDe: 'Ein Thriller, der behauptet, die katholische Kirche vertusche die wahre Blutlinie Jesu (Merowinger). Machte die Prieuré de Sion und den Heiligen Gral zum Mainstream-Thema.',
    descriptionEn: 'A thriller claiming the Catholic Church is covering up the true bloodline of Jesus (Merovingians). Mainstreamed the Priory of Sion and the Holy Grail.',
    tags: ['Religion', 'History', 'Vatican', 'Symbols'],
    realityScore: 40,
    complexity: 'LOW',
    relatedTheoryTags: ['Jesuits', 'Knights Templar', 'Vatican']
  },
  {
    id: 'm19',
    title: 'A Scanner Darkly',
    type: 'BOOK',
    year: 1977,
    creator: 'Philip K. Dick',
    descriptionDe: 'Ein Undercover-Drogenfahnder wird süchtig nach der Substanz D und muss sich schließlich selbst überwachen. Eine paranoide Vision über Identitätsverlust und Überwachungsstaat.',
    descriptionEn: 'An undercover narcotics agent becomes addicted to Substance D and is eventually ordered to spy on himself. A paranoid vision of identity loss and the surveillance state.',
    tags: ['Drugs', 'Paranoia', 'Surveillance', 'Identity'],
    realityScore: 60,
    complexity: 'HIGH',
    relatedTheoryTags: ['Gang Stalking', 'CIA', 'Mind Control']
  },
  {
    id: 'm20',
    title: 'Gravity\'s Rainbow',
    type: 'BOOK',
    year: 1973,
    creator: 'Thomas Pynchon',
    descriptionDe: 'Ein komplexes Epos über das Ende des 2. Weltkriegs, V2-Raketen, okkulte Nazis, Kartelle (IG Farben) und Paranoia. Gilt als eines der schwierigsten Werke der Postmoderne.',
    descriptionEn: 'A complex epic set at the end of WWII involving V2 rockets, occult Nazis, cartels (IG Farben), and paranoia. Considered one of the most difficult works of postmodernism.',
    tags: ['WWII', 'Military', 'Occult', 'Paranoia'],
    realityScore: 70,
    complexity: 'MINDBENDING',
    relatedTheoryTags: ['Nazi Occultism', 'Vril', 'Paperclip']
  }
];

// Enrich with generated art
export const MEDIA_ITEMS: MediaItem[] = RAW_MEDIA_ITEMS.map(item => ({
    ...item,
    imageUrl: generateArt(item.id, item.type, item.title)
}));
