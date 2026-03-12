import { MediaItem } from '../types';
import { generateArt } from '../utils/artEngine';

const RAW_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'm1',
    title: 'The Matrix',
    type: 'MOVIE',
    year: 1999,
    creator: 'Wachowskis',
    descriptionDe: 'Ein Hacker entdeckt, dass die Realität eine Maschinen-Simulation ist — und wird zum Erlöser der freien Menschheit. Wachowskis verschmolzen Baudrillards Simulacra-Philosophie, gnostische Erlösungsmythen und Hongkong-Martial-Arts zu einem kulturellen Wendepunkt. „Red Pill“ wurde Universalmetapher für Erwachungserlebnisse jeder Art.',
    descriptionEn: 'A hacker discovers reality is a machine simulation — and becomes humanity\'s savior. The Wachowskis fused Baudrillard\'s simulacra philosophy, Gnostic salvation myths, and Hong Kong martial arts into a cultural turning point. "Red Pill" became a universal metaphor for awakening experiences of every kind.',
    tags: ['Simulation', 'AI', 'Control', 'Gnosticism', 'Red Pill', 'Cyberpunk', 'Baudrillard', 'Martial Arts'],
    realityScore: 40,
    complexity: 'MINDBENDING',
    relatedTheoryTags: ['Simulation Theory', 'AI', 'Control', 'Prison Planet', 'Archons']
  },
  {
    id: 'm2',
    title: 'The X-Files',
    type: 'SERIES',
    year: 1993,
    creator: 'Chris Carter',
    descriptionDe: 'Mulders „I want to believe“-Poster wurde Ikone einer Generation. 11 Staffeln lang definierten FBI-Agenten Mulder & Scully den Goldstandard für Regierungs-Cover-up-Narrative: Syndikat, schwarzes Öl, Hybridisierung. Etablierte den „Trust no one“-Zeitgeist der 1990er.',
    descriptionEn: 'Mulder\'s "I want to believe" poster became a generational icon. Across 11 seasons, FBI agents Mulder & Scully defined the gold standard for government cover-up narratives: the Syndicate, black oil, hybridization. Established the "Trust no one" zeitgeist of the 1990s.',
    tags: ['UFO', 'Government', 'Aliens', 'Deep State', 'FBI', 'Syndicate', 'Black Oil', 'Monster of the Week'],
    realityScore: 60,
    complexity: 'HIGH',
    relatedTheoryTags: ['UFO', 'Area 51', 'Men in Black', 'Majestic 12', 'Greys']
  },
  {
    id: 'm3',
    title: 'Deus Ex',
    type: 'GAME',
    year: 2000,
    creator: 'Ion Storm',
    descriptionDe: 'Warren Spectors Cyberpunk-Meisterwerk webt Illuminaten, MJ-12, FEMA-Lager, Area 51 und Graue Aliens in eine kohärente Handlung um Nano-Augmentierung und globale Verschwörung. Legendaer: Die Twin Towers fehlen in der NYC-Skyline — ein Jahr vor 9/11. Spielerisches Entscheidungssystem erlaubt drei ideologische Enden.',
    descriptionEn: 'Warren Spector\'s cyberpunk masterpiece weaves Illuminati, MJ-12, FEMA camps, Area 51, and Grey Aliens into a coherent narrative about nano-augmentation and global conspiracy. Legendary: the Twin Towers are missing from the NYC skyline — one year before 9/11. Player choice system allows three ideological endings.',
    tags: ['Cyberpunk', 'Illuminati', 'AI', 'NWO', 'FEMA', 'Nano-Augmentation', 'Warren Spector', 'Immersive Sim'],
    realityScore: 75,
    complexity: 'HIGH',
    relatedTheoryTags: ['NWO', 'Illuminati', 'AI', 'Majestic 12', 'Transhumanism']
  },
  {
    id: 'm4',
    title: 'They Live',
    type: 'MOVIE',
    year: 1988,
    creator: 'John Carpenter',
    descriptionDe: 'John Carpenters Reagan-Ära-Satire: Ein Bauarbeiter (Roddy Piper) findet eine Sonnenbrille, die Aliens als Oberschicht und Werbung als subliminale Befehle („OBEY“, „CONSUME“) entlarvt. Berühmte 6-minütige Kampfszene. Shepard Faireys OBEY-Streetart stammt direkt hierher. Konsumkritik als Sci-Fi-Horror.',
    descriptionEn: 'John Carpenter\'s Reagan-era satire: a construction worker (Roddy Piper) finds sunglasses revealing aliens as the upper class and ads as subliminal commands ("OBEY," "CONSUME"). Famous 6-minute fight scene. Shepard Fairey\'s OBEY street art originates directly from this. Consumer critique as sci-fi horror.',
    tags: ['Aliens', 'Control', 'Media', 'Subliminal', 'Reagan Era', 'OBEY', 'Roddy Piper', 'Kapitalismuskritik'],
    realityScore: 50,
    complexity: 'MEDIUM',
    relatedTheoryTags: ['Reptilians', 'NWO', 'Mind Control', 'Subliminal Messages']
  },
  {
    id: 'm5',
    title: 'Illuminatus! Trilogy',
    type: 'BOOK',
    year: 1975,
    creator: 'Robert Shea & Robert Anton Wilson',
    descriptionDe: 'Playboy-Leserbriefredakteure Shea & Wilson destillierten jeden Irren-Brief in einen 800-Seiten-Trip: Diskordianismus, goldene Unterbote, sprechende Delphine, die Illuminaten von Weishaupt. Erfand „Fnord“ und „Operation Mindfuck“. Kein anderes Buch vermischte Satire und Paranoia so untrennbar — Leser wissen nie, was ernst gemeint ist.',
    descriptionEn: 'Playboy letter-column editors Shea & Wilson distilled every crank letter into an 800-page trip: Discordianism, golden submarines, talking dolphins, Weishaupt\'s Illuminati. Invented "Fnord" and "Operation Mindfuck." No other book merged satire and paranoia so inseparably — readers never know what\'s serious.',
    tags: ['Illuminati', 'Satire', 'Discordianism', 'Fnord', 'Robert Anton Wilson', 'Counterculture', 'Operation Mindfuck', 'Postmodern'],
    realityScore: 30,
    complexity: 'MINDBENDING',
    relatedTheoryTags: ['Illuminati', 'Atlantis', 'JFK', 'Freemasons']
  },
  {
    id: 'm25',
    title: 'Inside Job',
    type: 'SERIES',
    year: 2021,
    creator: 'Shion Takeuchi',
    descriptionDe: 'Für die Mitarbeiter von Cognito Inc. sind Verschwörungstheorien Tagesgeschäft: Reptilien-Präsident, Mondlandungs-Fälschung, Chemtrails-Logistik, Hohle-Erde-Management. Brillante Netflix-Satire, die jede Theorie als bürokratischen Albtraum darstellt. Reagan als Roboter. Flache-Erde-Abteilung als Strafversetzung.',
    descriptionEn: 'For Cognito Inc. employees, conspiracy theories are daily business: reptilian president, moon landing staging, chemtrails logistics, Hollow Earth management. Brilliant Netflix satire portraying every theory as bureaucratic nightmare. Reagan as robot. Flat Earth department as disciplinary transfer.',
    tags: ['Deep State', 'Animation', 'Satire', 'Workplace', 'Netflix', 'Cognito Inc', 'Reptilians', 'Bureaucracy'],
    realityScore: 90,
    complexity: 'HIGH',
    relatedTheoryTags: ['Deep State', 'Reptilians', 'Hollow Earth', 'Moon Landing', 'Chemtrails']
  },
  // --- MOVIES ---
  {
    id: 'm6',
    title: 'JFK',
    type: 'MOVIE',
    year: 1991,
    creator: 'Oliver Stone',
    descriptionDe: 'Oliver Stones 3-Stunden-Epos über Jim Garrisons Ermittlungen (einzige Anklage im JFK-Fall). Verwebt Zapruder-Film, Magic-Bullet-Theorie, CIA-Kuba-Operationen und militaerisch-industriellen Komplex zu einem paranoiden Meisterwerk. Änderte US-Recht: JFK Records Act (1992) erzwang Aktenfreigabe.',
    descriptionEn: 'Oliver Stone\'s 3-hour epic about Jim Garrison\'s investigation (only prosecution in the JFK case). Weaves Zapruder Film, Magic Bullet theory, CIA Cuba operations, and military-industrial complex into a paranoid masterpiece. Changed US law: JFK Records Act (1992) forced document release.',
    tags: ['Assassination', 'CIA', 'Politics', 'Cold War', 'Jim Garrison', 'Zapruder', 'Military-Industrial Complex', 'PNAC'],
    realityScore: 85,
    complexity: 'HIGH',
    relatedTheoryTags: ['JFK Assassination', 'Deep State', 'CIA', 'False Flag']
  },
  {
    id: 'm7',
    title: 'Capricorn One',
    type: 'MOVIE',
    year: 1977,
    creator: 'Peter Hyams',
    descriptionDe: 'NASA fälscht eine Marslandung im TV-Studio, weil das Lebenserhaltungssystem versagt. Die drei Astronauten müssen fliehen, als sie realisieren, dass sie als Zeugen beseitigt werden sollen. Kam 8 Jahre nach Apollo 11 — perfektes Timing, um Moon-Hoax-Theorien zu befeuern. O.J. Simpson als Astronaut.',
    descriptionEn: 'NASA fakes a Mars landing in a TV studio because the life support system failed. The three astronauts must flee when they realize they\'ll be eliminated as witnesses. Released 8 years after Apollo 11 — perfect timing to fuel Moon Hoax theories. O.J. Simpson as astronaut.',
    tags: ['Space', 'Hoax', 'NASA', 'Government', 'Mars', 'Studio', 'Peter Hyams', 'Whistleblower'],
    realityScore: 60,
    complexity: 'MEDIUM',
    relatedTheoryTags: ['Moon Landing Fake', 'NASA', 'Cover-up', 'False Flag']
  },
  {
    id: 'm8',
    title: 'Eyes Wide Shut',
    type: 'MOVIE',
    year: 1999,
    creator: 'Stanley Kubrick',
    descriptionDe: 'Kubricks letzter Film: Dr. Bill Harford (Tom Cruise) gerät in ein maskiertes Elite-Ritual in einem Landhaus — und wird gewarnt, zu vergessen, was er sah. Oft als Enthüllung realer okkulter Praktiken der Oberschicht gelesen (Parallelen zu Epstein/Bohemian Grove). Kubricks Tod 6 Tage nach Schnittabnahme nährt „Er wusste zu viel“-Narrativ.',
    descriptionEn: 'Kubrick\'s final film: Dr. Bill Harford (Tom Cruise) stumbles into a masked elite ritual at a country mansion — and is warned to forget what he saw. Often read as exposure of real occult upper-class practices (Epstein/Bohemian Grove parallels). Kubrick\'s death 6 days after final cut feeds "he knew too much" narrative.',
    tags: ['Occult', 'Elite', 'Secret Society', 'Rituals', 'Kubrick', 'Masquerade', 'Epstein', 'Bohemian Grove'],
    realityScore: 70,
    complexity: 'HIGH',
    relatedTheoryTags: ['Illuminati', 'Bohemian Grove', 'Elite', 'Adrenochrome']
  },
  {
    id: 'm9',
    title: 'The Truman Show',
    type: 'MOVIE',
    year: 1998,
    creator: 'Peter Weir',
    descriptionDe: 'Truman Burbank (Jim Carrey) lebt sein gesamtes Leben in einer gigantischen Studiokuppel, beobachtet von Milliarden — ohne es zu wissen. Peter Weirs prophetischer Film präfigurierte Reality-TV, Überwachungskapitalismus und das „Truman-Syndrom“ (klinisch dokumentierte Wahnstörung). Flache-Erde-Bewegung adoptierte die Kuppel-Ästhetik.',
    descriptionEn: 'Truman Burbank (Jim Carrey) lives his entire life in a giant studio dome, watched by billions — without knowing. Peter Weir\'s prophetic film prefigured reality TV, surveillance capitalism, and the "Truman Syndrome" (clinically documented delusion). Flat Earth movement adopted the dome aesthetic.',
    tags: ['Simulation', 'Media', 'Surveillance', 'Control', 'Jim Carrey', 'Reality TV', 'Truman Syndrome', 'Dome'],
    realityScore: 45,
    complexity: 'MEDIUM',
    relatedTheoryTags: ['Simulation Theory', 'Flat Earth', 'Surveillance', 'Dead Internet']
  },
  {
    id: 'm10',
    title: 'Videodrome',
    type: 'MOVIE',
    year: 1983,
    creator: 'David Cronenberg',
    descriptionDe: 'Max Renn (James Woods) entdeckt einen Piratensender, dessen Signal Halluzinationen und physische Mutationen erzeugt: Der Fernseher wird zum lebenden Organ, der Bauch zum Videokassetten-Schlitz. Cronenbergs „New Flesh“-Philosophie prophezeite die Verschmelzung von Mensch und Medium. McLuhans „The medium is the message“ als Body-Horror.',
    descriptionEn: 'Max Renn (James Woods) discovers a pirate broadcast whose signal produces hallucinations and physical mutations: the TV becomes a living organ, the abdomen a videocassette slot. Cronenberg\'s "New Flesh" philosophy prophesied the fusion of human and medium. McLuhan\'s "the medium is the message" as body horror.',
    tags: ['Body Horror', 'Media', 'Mind Control', 'Signal', 'Cronenberg', 'New Flesh', 'McLuhan', 'VHS'],
    realityScore: 20,
    complexity: 'MINDBENDING',
    relatedTheoryTags: ['Mind Control', 'Subliminal Messages', 'Transhumanism', 'MK-Ultra']
  },
  
  // --- SERIES ---
  {
    id: 'm11',
    title: 'Mr. Robot',
    type: 'SERIES',
    year: 2015,
    creator: 'Sam Esmail',
    descriptionDe: 'Elliot Alderson (Rami Malek), paranoid-schizophrener Hacker, plant mit fsociety den Sturz von E Corp („Evil Corp“). Sam Esmails technisch präzises Hacking, DID-Darstellung und die „Deus Group“-Oligarchie machten die Serie zum Goldstandard realistischer Cyber-Verschwörung. 5/9-Hack als fiktiver 9/11 der Finanzwelt.',
    descriptionEn: 'Elliot Alderson (Rami Malek), a paranoid schizophrenic hacker, plots with fsociety to topple E Corp ("Evil Corp"). Sam Esmail\'s technically precise hacking, DID portrayal, and the "Deus Group" oligarchy made the series the gold standard of realistic cyber-conspiracy. The 5/9 hack as fictional 9/11 of finance.',
    tags: ['Hacking', 'Economy', 'Elite', 'Anarchy', 'Rami Malek', 'fsociety', 'Deus Group', 'Cybersecurity'],
    realityScore: 88,
    complexity: 'HIGH',
    relatedTheoryTags: ['The Great Reset', 'NWO', 'Banking', 'Deep State']
  },
  {
    id: 'm12',
    title: 'Utopia (UK)',
    type: 'SERIES',
    year: 2013,
    creator: 'Dennis Kelly',
    descriptionDe: 'Fans eines Graphic Novels („The Utopia Experiments“) entdecken „The Network“ — eine Kabale, die eine globale Pandemie plant, um via Impfstoff die Weltbevölkerung zu sterilisieren. 7 Jahre vor COVID-19 ausgestrahlt. Dennis Kellys neonfarbone Ästhetik und amoralische Protagonisten schufen ein ungewöhnlich brutales Fernseherlebnis.',
    descriptionEn: 'Fans of a graphic novel ("The Utopia Experiments") discover "The Network" — a cabal planning a global pandemic to sterilize the world population via vaccine. Aired 7 years before COVID-19. Dennis Kelly\'s neon-colored aesthetics and amoral protagonists created an unusually brutal TV experience.',
    tags: ['Pandemic', 'Depopulation', 'Deep State', 'Comics', 'Dennis Kelly', 'The Network', 'Vaccine', 'Channel 4'],
    realityScore: 65,
    complexity: 'HIGH',
    relatedTheoryTags: ['Corona Plandemic', 'The Great Reset', 'Depopulation', 'Vaccine']
  },
  {
    id: 'm13',
    title: 'Black Mirror',
    type: 'SERIES',
    year: 2011,
    creator: 'Charlie Brooker',
    descriptionDe: 'Charlie Brookers Anthologie-Serie über Technologie-Dystopien: „Nosedive“ (Social Credit), „White Bear“ (Bestrafungs-Entertainment), „15 Million Merits“ (Gamifizierte Ausbeutung), „Playtest“ (AR-Horror). Jede Episode ist ein eigenständiges Gedankenexperiment über technokratische Kontrollsysteme, die teilweise bereits Realität sind.',
    descriptionEn: 'Charlie Brooker\'s anthology series on technology dystopias: "Nosedive" (social credit), "White Bear" (punishment entertainment), "15 Million Merits" (gamified exploitation), "Playtest" (AR horror). Each episode is a standalone thought experiment on technocratic control systems, some already reality.',
    tags: ['Technology', 'Dystopia', 'AI', 'Surveillance', 'Charlie Brooker', 'Social Credit', 'Anthology', 'Netflix'],
    realityScore: 80,
    complexity: 'MEDIUM',
    relatedTheoryTags: ['Transhumanism', '5G Mind Control', 'Simulation Theory', 'Social Credit']
  },
  {
    id: 'm14',
    title: 'Severance',
    type: 'SERIES',
    year: 2022,
    creator: 'Dan Erickson',
    descriptionDe: 'Lumon-Industries-Mitarbeiter unterziehen sich einer Gehirn-OP („Severance“), die Arbeits- und Privat-Erinnerungen trennt. Dan Ericksons Apple-TV-Serie ist eine kafkaeske Parabel auf Corporate Cults, MK-Ultra-Gedankenkontrolle und die Kompartimentalisierung moderner Arbeit. Kier Egan als L. Ron Hubbard des Büroalltags.',
    descriptionEn: 'Lumon Industries employees undergo brain surgery ("severance") separating work and personal memories. Dan Erickson\'s Apple TV series is a Kafkaesque parable on corporate cults, MK-Ultra mind control, and the compartmentalization of modern work. Kier Egan as L. Ron Hubbard of office life.',
    tags: ['Corporate', 'Mind Control', 'Mystery', 'Psychology', 'Apple TV', 'Lumon', 'MK-Ultra', 'Kafkaesque'],
    realityScore: 55,
    complexity: 'HIGH',
    relatedTheoryTags: ['MK-Ultra', 'Mind Control', 'Corporate Control', 'Transhumanism']
  },

  // --- BOOKS ---
  {
    id: 'm15',
    title: '1984',
    type: 'BOOK',
    year: 1949,
    creator: 'George Orwell',
    descriptionDe: 'Die Mutter aller Dystopien: Ozeanien unter Big Brothers Teleskreens, Gedankenpolizei, Doppeldenk und Neusprech. Orwells „Wahrheitsministerium“, „Krieg ist Frieden“ und „2+2=5“ sind heute die Standardreferenzen jeder Überwachungs- und Propagandadebatte. Meistverkauftes Buch nach Trumps Amtsantritt 2017.',
    descriptionEn: 'The mother of all dystopias: Oceania under Big Brother\'s telescreens, Thought Police, doublethink, and Newspeak. Orwell\'s "Ministry of Truth," "War is Peace," and "2+2=5" are now standard references in every surveillance and propaganda debate. Bestselling book after Trump\'s inauguration 2017.',
    tags: ['Dystopia', 'Surveillance', 'Totalitarianism', 'Propaganda', 'Big Brother', 'Newspeak', 'Thought Police', 'Doublethink'],
    realityScore: 95,
    complexity: 'MEDIUM',
    relatedTheoryTags: ['NWO', 'Surveillance', 'Police State', 'Agenda 2030']
  },
  {
    id: 'm16',
    title: 'Brave New World',
    type: 'BOOK',
    year: 1932,
    creator: 'Aldous Huxley',
    descriptionDe: 'Huxleys Gegenentwurf zu Orwell: Kontrolle nicht durch Schmerz, sondern durch Vergnügen. Soma-Droge, Bokanovsky-Eizellen-Klonierung, Konditionierung durch Schlaf-Hypnopädie, Promiskuität als Pflicht. Neil Postmans „Wir amüsieren uns zu Tode“ (1985) argumentierte: Huxley, nicht Orwell, hatte recht. Social-Media-Dopamin-Ökonomie bestätigt.',
    descriptionEn: 'Huxley\'s counterpart to Orwell: control not through pain but pleasure. Soma drug, Bokanovsky egg cloning, conditioning via sleep-hypnopaedia, promiscuity as duty. Neil Postman\'s "Amusing Ourselves to Death" (1985) argued: Huxley, not Orwell, was right. Social media dopamine economy confirms.',
    tags: ['Eugenics', 'Control', 'Drugs', 'Engineering', 'Soma', 'Conditioning', 'Neil Postman', 'Hedonism'],
    realityScore: 92,
    complexity: 'MEDIUM',
    relatedTheoryTags: ['Transhumanism', 'Fluoride', 'Social Engineering', 'Depopulation']
  },
  {
    id: 'm17',
    title: 'Foucault\'s Pendulum',
    type: 'BOOK',
    year: 1988,
    creator: 'Umberto Eco',
    descriptionDe: 'Drei Verlagsmitarbeiter (Casaubon, Belbo, Diotallevi) erfinden zum Spaß den „Plan“: Tempelritter kontrollierten Erdenergie-Ströme seit dem 12. Jahrhundert. Die Fiktion wird zur Besessenheit, Geheimlogen nehmen den Plan ernst. Ecos intellektuelles Antidot gegen Verschwörungsdenken — und gleichzeitig dessen brillanteste Darstellung.',
    descriptionEn: 'Three editors (Casaubon, Belbo, Diotallevi) invent "the Plan" for fun: Templars controlled Earth energy currents since the 12th century. Fiction becomes obsession, secret lodges take the Plan seriously. Eco\'s intellectual antidote to conspiracy thinking — and simultaneously its most brilliant portrayal.',
    tags: ['History', 'Occult', 'Templars', 'Satire', 'Umberto Eco', 'Kabbalah', 'Rosicrucians', 'Semiotics'],
    realityScore: 80,
    complexity: 'MINDBENDING',
    relatedTheoryTags: ['Knights Templar', 'Illuminati', 'Rosicrucians', 'Ley Lines']
  },
  {
    id: 'm18',
    title: 'The Da Vinci Code',
    type: 'BOOK',
    year: 2003,
    creator: 'Dan Brown',
    descriptionDe: 'Robert Langdon jagt durch Louvre, Westminster Abbey und Rosslyn Chapel: Jesus heiratete Maria Magdalena, die Merowinger sind deren Nachkommen, die Prieuré de Sion schützt das Geheimnis. 80M+ verkaufte Exemplare. Vatikan bezeichnete es als „voller Fehler“. Machte Symbologie-Paranoia zum Massenphänomen.',
    descriptionEn: 'Robert Langdon races through the Louvre, Westminster Abbey, and Rosslyn Chapel: Jesus married Mary Magdalene, the Merovingians are their descendants, the Priory of Sion guards the secret. 80M+ copies sold. Vatican called it "full of errors." Made symbology paranoia a mass phenomenon.',
    tags: ['Religion', 'History', 'Vatican', 'Symbols', 'Dan Brown', 'Priory of Sion', 'Merovingians', 'Holy Grail'],
    realityScore: 40,
    complexity: 'LOW',
    relatedTheoryTags: ['Jesuits', 'Knights Templar', 'Vatican', 'Freemasons']
  },
  {
    id: 'm19',
    title: 'A Scanner Darkly',
    type: 'BOOK',
    year: 1977,
    creator: 'Philip K. Dick',
    descriptionDe: 'Undercover-Agent Bob Arctor wird süchtig nach Substanz D und muss sich schließlich selbst überwachen — ohne sich zu erkennen (Split-Brain-Anzug). Dicks autobiografische Drogenparanoia, gewidmet seinen „verlorenen Freunden“. Linklaters Rotoskopie-Verfilmung (2006) verstärkte die Identitätsauflösungs-Ästhetik.',
    descriptionEn: 'Undercover agent Bob Arctor becomes addicted to Substance D and must eventually surveil himself — without recognizing himself (scramble suit). Dick\'s autobiographical drug paranoia, dedicated to his "lost friends." Linklater\'s rotoscope film (2006) amplified the identity dissolution aesthetic.',
    tags: ['Drugs', 'Paranoia', 'Surveillance', 'Identity', 'Philip K. Dick', 'Rotoscope', 'Linklater', 'Split Brain'],
    realityScore: 60,
    complexity: 'HIGH',
    relatedTheoryTags: ['Surveillance', 'CIA', 'Mind Control', 'MK-Ultra']
  },
  {
    id: 'm20',
    title: 'Gravity\'s Rainbow',
    type: 'BOOK',
    year: 1973,
    creator: 'Thomas Pynchon',
    descriptionDe: 'Tyrone Slotherops Erektionen sagen V2-Einschläge in London voraus — Auftakt für Pynchons 800-Seiten-Epos über IG Farben, okkulte Nazis (SS-Ahnenerbe), Pavlov-Konditionierung, Raketentechnik und die Paranoia industrieller Systeme. Pulitzer-Jury nominierte es, Kuratorium lehnte als „obszön“ ab. Unlesbar und unverzichtbar.',
    descriptionEn: 'Tyrone Slothrop\'s erections predict V2 impacts in London — opener for Pynchon\'s 800-page epic about IG Farben, occult Nazis (SS Ahnenerbe), Pavlovian conditioning, rocketry, and the paranoia of industrial systems. Pulitzer jury nominated it, board rejected as "obscene." Unreadable and indispensable.',
    tags: ['WWII', 'Military', 'Occult', 'Paranoia', 'Thomas Pynchon', 'IG Farben', 'V2 Rocket', 'Pavlov'],
    realityScore: 70,
    complexity: 'MINDBENDING',
    relatedTheoryTags: ['Nazi Occultism', 'Vril', 'Operation Paperclip', 'IG Farben']
  }
];

// Enrich with generated art
export const MEDIA_ITEMS: MediaItem[] = RAW_MEDIA_ITEMS.map(item => ({
    ...item,
    imageUrl: generateArt(item.id, item.type, item.title)
}));
