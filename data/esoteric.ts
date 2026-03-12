import { Theory, Category, CategoryEn, DangerLevel, DangerLevelEn } from '../types';

export const ESOTERIC_THEORIES_DE: Theory[] = [
  {
    id: 't3',
    title: 'Reptiloide',
    shortDescription: 'David Ickes Signaturtheorie: Shapshifting-Reptilien (Draco-Rasse) infiltrieren Elite-Positionen. Fusion aus antisemitischen Tropes (Blutlinien, Kontrolle) mit Sci-Fi-Ästhetik. Psychologisch: Dehumanisierung von Machthabern, Externalisierung von Schuld. Gefährlich durch othering-Dynamik, kulturell absurd.',
    category: Category.ESOTERIC,
    dangerLevel: DangerLevel.MEDIUM,
    popularity: 48,
    originYear: '1998',
    tags: ['Aliens', 'Elite', 'David Icke', 'Shapeshifter', 'Draco', 'Blutlinien', 'Windsor', 'Royals'],
    relatedIds: ['t5', 't10', 't13', 't17', 't19', 't40', 't77']
  },
  {
    id: 't10',
    title: 'Hohle Erde',
    shortDescription: 'Hollow-Earth-Hypothese: Agartha-Zivilisation + innere Sonne + polare Öffnungen. Wurzeln in 17. Jh. (Edmond Halley), popularisiert durch Symmes (1818) und Nazi-Mythen (Admiral Byrd). Seismologie widerlegt (feste Masse). Jules-Verne-Ästhetik, harmlose Phantastik, geografisch absurd.',
    category: Category.ESOTERIC,
    dangerLevel: DangerLevel.LOW,
    popularity: 34,
    originYear: '17. Jh',
    tags: ['Agartha', 'Pole', 'Expeditionen', 'Edmond Halley', 'Admiral Byrd', 'Symmes Holes', 'Shambhala'],
    videoUrl: 'https://www.youtube.com/watch?v=3sxnZc6qfT0',
    relatedIds: ['t1', 't3', 't11', 't39', 't51', 't56']
  },
  {
    id: 't15',
    title: 'Remote Viewing',
    shortDescription: 'CIA/DIA Project Stargate (1975-1995): Psi-Spionage-Programm mit Ingo Swann, Russell Targ. AIR-Review (1995) fand null operativen Nutzen. Legitime Parapsychologie-Forschung, aber kein Nachweis überlichtschneller Information. Kulturell: Netflix-Dokumentationen, RV-Kurse. Harmlose Pseudoskill-Industrie.',
    category: Category.ESOTERIC,
    dangerLevel: DangerLevel.LOW,
    popularity: 60,
    originYear: '1970er',
    tags: ['CIA', 'Psi-Kräfte', 'Spionage', 'Ingo Swann', 'Russell Targ', 'Stargate Project', 'Parapsychologie', 'SRI'],
    videoUrl: 'https://www.youtube.com/watch?v=WkC91tV7oMw',
    relatedIds: ['t13', 't57', 't78', 't22']
  },
  {
    id: 't22',
    title: 'Simulations-Theorie',
    shortDescription: 'Nick Bostrom\'s philosophisches Gedankenexperiment (2003) als spirituelle Erlösungserzählung umgedeutet: Realität = Programm, Bewusstsein = Glitch. Vereint Quantenmechanik-Missverständnisse mit Gnostizismus. Elon Musk vulgarisierte These. Epistemisch unfalsifizierbar, kulturell einflussreich (Matrix-Ikonografie), harmlos.',
    category: Category.ESOTERIC,
    dangerLevel: DangerLevel.LOW,
    popularity: 83,
    originYear: '2003 (Bostrom)',
    tags: ['Matrix', 'Philosophie', 'Technologie', 'KI', 'Nick Bostrom', 'Elon Musk', 'Quantenmechanik', 'Solipsismus'],
    videoUrl: 'https://www.youtube.com/watch?v=tlBKz9e3jXU',
    relatedIds: ['t6', 't47', 't57', 't77', 't62']
  },
  {
    id: 't28',
    title: 'Planet Nibiru (Planet X)',
    shortDescription: 'Zecharia Sitchins Pseudo-Sumerologie: 12. Planet mit 3.600-Jahre-Orbit, Heimat der Anunnaki. Nancy Lieder (ZetaTalk) prophezeite 2003-Kollision, verschob auf 2012. Astronomisch widerlegt (gravitativer Einfluss sichtbar). Apokalypse-Evergreen, regelmäßig recycelt. Harmlose Weltuntergangs-Fantasy.',
    category: Category.ESOTERIC,
    dangerLevel: DangerLevel.LOW,
    popularity: 58,
    originYear: '1995',
    tags: ['Weltraum', 'Weltuntergang', 'NASA', 'Sumerer', 'Zecharia Sitchin', 'Anunnaki', '2012', 'Nancy Lieder'],
    relatedIds: ['t1', 't12', 't56', 't19', 't51']
  },
  {
    id: 't38',
    title: 'Nordics (Plejader)',
    shortDescription: '1950er Contactee-Bewegung: blonde, menschenähnliche „Space Brothers" warnen vor Atomkrieg (George Adamski, Billy Meier). New-Age-Channeling (Barbara Marciniak) spiritualisierte Kontakte. Carl-Jung-Analyse: Projektionen archetypischer Idealfiguren. Harmlose Friedensbotschaft, esoterische Kommerzialisierung.',
    category: Category.ESOTERIC,
    dangerLevel: DangerLevel.LOW,
    popularity: 54,
    originYear: '1950er',
    tags: ['Aliens', 'Spiritualität', 'Channeling', 'Kontaktler', 'George Adamski', 'Billy Meier', 'Barbara Marciniak', 'Plejaden'],
    relatedIds: ['t19', 't3', 't78', 't57', 't15']
  },
  {
    id: 't39',
    title: 'Aldebaran & Vril',
    shortDescription: 'Post-WWII-Mythos: Thule/Vril-Gesellschaften channelten Aldebaran-Aliens für UFO-Technologie (Haunebu, Glocke), flüchteten nach Neuschwabenland. Keine primären NS-Quellen (1990er-Erfindung). Romantisiert Nazi-Okkultismus, verharmlost Kriegsverbrechen durch Alien-Erklärungen. Rechtsextreme Ankerpunkte, gefährlich.',
    category: Category.ESOTERIC,
    dangerLevel: DangerLevel.EXTREME,
    popularity: 64,
    originYear: '1920er',
    tags: ['Nazi-Okkultismus', 'UFO', 'Vril', 'Geschichte', 'Thule-Gesellschaft', 'Haunebu', 'Neuschwabenland', 'Die Glocke'],
    relatedIds: ['t10', 't11', 't50', 't38', 't40']
  },
  {
    id: 't40',
    title: 'Draconier (Draco-Allianz)',
    shortDescription: 'Reptiloid-Militarismus-Trope: Alpha-Draconis-Eroberer als kosmische Antagonisten (vs. wohlwollende Nordics/Plejader). Stewart Swerdlow, Alex Collier populär. Manichäische Alien-Soap-Opera mit Exopolitik-Jargon. Psychologisch: Gut-Böse-Projektion im Kosmos. Gefährlich nur durch Othering-Potenzial.',
    category: Category.ESOTERIC,
    dangerLevel: DangerLevel.MEDIUM,
    popularity: 57,
    originYear: '1990er',
    tags: ['Aliens', 'Krieg', 'Reptiloide', 'Exopolitik', 'Alpha Draconis', 'Stewart Swerdlow', 'Alex Collier'],
    relatedIds: ['t3', 't37', 't5', 't39', 't77']
  },
  {
    id: 't57',
    title: 'Akasha Chronik',
    shortDescription: 'Theosophisches Konzept (Helena Blavatsky, Rudolf Steiner): Äther-„Bibliothek“ aller Ereignisse, zugänglich durch Hellsehen. Verbindet indische Akasha-Philosophie mit viktorianischem Spiritismus. Edgar Cayce popularisierte „Readings“. Epistemisch nicht prüfbar, spirituell funktional (Sinnstiftung). Harmlose Esoterik.',
    category: Category.ESOTERIC,
    dangerLevel: DangerLevel.LOW,
    popularity: 66,
    originYear: '19. Jh (Theosophie)',
    tags: ['Spiritualität', 'Gedächtnis', 'Äther', 'Metaphysik', 'Helena Blavatsky', 'Rudolf Steiner', 'Edgar Cayce', 'Theosophie'],
    relatedIds: ['t15', 't22', 't38', 't78']
  },
  {
    id: 't62',
    title: 'CERN Portale',
    shortDescription: 'LHC als interdimensionales Tor-Experiment: Gotthard-Tunnel-Zeremonie (2016) + Shiva-Statue = „Dämon-Beschwörung“. Technisch: Higgs-Boson-Entdeckung, kein Portal-Mechanismus. Verbindet Physik-Analphabetismus mit christlichem Apokalyptismus. Harmlose Anti-Wissenschaft-Paranoia.',
    category: Category.ESOTERIC,
    dangerLevel: DangerLevel.LOW,
    popularity: 67,
    originYear: '2008',
    tags: ['Physik', 'Dimensionen', 'Dämonen', 'Schweiz', 'Higgs-Boson', 'Strangelets', 'Schwarze Löcher', 'Gotthard-Tunnel'],
    relatedIds: ['t22', 't12', 't77']
  },
  {
    id: 't77',
    title: 'Gefängnisplanet (Prison Planet)',
    shortDescription: 'Gnostisch-inspirierte Dystopie: Erde als Seelen-Batteriefarm für interdimensionale Archonten, Reinkarnation via „Lichttunnel“ = Reset-Mechanismus. Verbindet antike Häresien mit moderner Entfremdung. Wayne Bush, Cameron Day populär. Gefährlich durch Realitätsflucht-Idealisierung (Suizid-Risiko), anti-materialistisch.',
    category: Category.ESOTERIC,
    dangerLevel: DangerLevel.HIGH,
    popularity: 71,
    originYear: 'Gnostizismus',
    tags: ['Gnostik', 'Archonten', 'Reinkarnation', 'Matrix', 'Lichttunnel', 'Demiurg', 'Loosh', 'Robert Monroe'],
    relatedIds: ['t22', 't3', 't57', 't40']
  },
  {
    id: 't78',
    title: 'Starseeds',
    shortDescription: 'New-Age-Identitätskonstrukt: Inkarnierte außerirdische Seelen (Plejaden, Sirius, Arcturus) mit Mission, Erd-Schwingung anzuheben. Bietet Sinnstiftung für Entfremdung („Ich gehöre nicht hierher“). Kommerzialisiert durch Coaching/Channeling-Industrie. Harmlose Selbstmystifizierung, finanziell ausbeutbar.',
    category: Category.ESOTERIC,
    dangerLevel: DangerLevel.LOW,
    popularity: 85,
    originYear: '1970er',
    tags: ['New Age', 'Aliens', 'Aufstieg', 'Spiritualität', 'Channeling', 'Lichtarbeiter', 'Indigo-Kinder', 'Schwingung'],
    relatedIds: ['t38', 't57', 't77', 't15']
  },
  // HEALTH
  {
    id: 't29',
    title: 'Fluorid & Zirbeldrüse',
    shortDescription: 'Kalter-Krieg-Fluoridierungsängste (1950er, John Birch Society) + New-Age-„Drittes Auge"-Mystik: Trinkwasser-Fluorid verkalke die Zirbeldrüse, mache Bevölkerung gefügig/unspirituell. Wissenschaftlich: Fluorid-Kalzifizierung real, aber kein Beleg für kognitive Effekte bei Trinkwasserdosen. Verbindet Anti-Regierungs-Paranoia mit esoterischer Bewusstseinsexpansion. Gefährlich: Kinder-Kariesvermeidung verweigert.',
    category: Category.HEALTH,
    dangerLevel: DangerLevel.MEDIUM,
    popularity: 65,
    originYear: '1950er',
    tags: ['Wasser', 'Gehirn', 'Spiritualität', 'Gift', 'Zirbeldrüse', 'Drittes Auge', 'John Birch Society', 'Kalzifizierung'],
    relatedIds: ['t2', 't6']
  },
  {
    id: 't48',
    title: 'Corona-Plandemie („Scamdemic“)',
    shortDescription: 'Größte Pandemie-Verschwörung der Moderne: COVID-19 als geplantes Instrument für Lockdown-Autoritarismus, mRNA-Zwangsimpfung („Gentherapie“), Great-Reset-Implementierung, 5G-Aktivierung und Depopulation (Bill-Gates-Patent WO2020060606). Event 201 (Johns Hopkins, 10/2019) als angeblicher „Probelauf“. Verschmolz alle bestehenden Verschwörungsstränge in einer Megatheorie. Reale Gesundheitsgefährdung durch Impfverweigerung.',
    category: Category.HEALTH,
    dangerLevel: DangerLevel.EXTREME,
    popularity: 98,
    originYear: '2020',
    tags: ['Virus', 'Impfung', 'Bill Gates', 'Kontrolle', 'Event 201', 'mRNA', 'Lockdown', 'Great Reset'],
    relatedIds: ['t20', 't6', 't5', 't47']
  },
  {
    id: 't68',
    title: 'Insekten-Agenda („Eat ze Bugs“)',
    shortDescription: 'WEF-Empfehlung nachhaltiger Proteinquellen wurde zu dystopischem Fleischverbot umgedeutet: Eliten essen Wagyu, Während Plebs Grillen frisst. Klaus Schwabs Akzent („You will eat ze bugs“) wurde virales Meme. Verbindet Klima-Skepsis, Anti-Veganismus und Klassenressentiment. Reale Basis: EU Novel-Food-Verordnung (2023) für Acheta domesticus. Kulturkampf über Ernährungssouveränität.',
    category: Category.HEALTH,
    dangerLevel: DangerLevel.MEDIUM,
    popularity: 85,
    originYear: '2020',
    tags: ['Ernährung', 'WEF', 'Kulturkampf', 'Gesundheit', 'Klaus Schwab', 'Novel Food', 'Acheta domesticus', 'Proteinwende'],
    relatedIds: ['t20', 't64']
  },
  {
    id: 't70',
    title: 'MedBeds',
    shortDescription: 'QAnon/NESARA-Derivat: Geheime Technologie (angeblich von Tesla/außerirdisch) heilt alle Krankheiten, regeneriert Gliedmaßen, verjuengt um 30 Jahre — aber von Pharma-Industrie unterdrückt. Skye Prince („Real Skye“) popularisierte auf Telegram. Finanziell gefährlich: Vulnerable verzichten auf reale Medizin zugunsten versprochener Quanten-Heilung. Keine einzige verifiable Demonstration existiert.',
    category: Category.HEALTH,
    dangerLevel: DangerLevel.HIGH,
    popularity: 75,
    originYear: '2018',
    tags: ['Technologie', 'Heilung', 'NESARA', 'Betrug', 'Telegram', 'Quantenheilung', 'Pharma-Unterdrückung', 'Skye Prince'],
    relatedIds: ['t75', 't47']
  }
];

export const ESOTERIC_THEORIES_EN: Theory[] = [
  {
    id: 't3',
    title: 'Reptilians',
    shortDescription: 'David Icke\'s signature theory: shape-shifting reptilians (Draco race) infiltrate elite positions. Fusion of antisemitic tropes (bloodlines, control) with sci-fi aesthetics. Psychologically: dehumanization of power holders, externalization of blame. Dangerous through othering dynamics, culturally absurd.',
    category: CategoryEn.ESOTERIC,
    dangerLevel: DangerLevelEn.MEDIUM,
    popularity: 48,
    originYear: '1998',
    tags: ['Aliens', 'Elite', 'David Icke', 'Shapeshifter', 'Draco', 'Bloodlines', 'Windsor', 'Royals'],
    relatedIds: ['t5', 't10', 't13', 't17', 't19', 't40', 't77']
  },
  {
    id: 't10',
    title: 'Hollow Earth',
    shortDescription: 'Hollow Earth hypothesis: Agartha civilization + inner sun + polar openings. Roots in 17th century (Edmond Halley), popularized by Symmes (1818) and Nazi myths (Admiral Byrd). Seismology refutes (solid mass). Jules Verne aesthetics, harmless fantasy, geographically absurd.',
    category: CategoryEn.ESOTERIC,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 34,
    originYear: '17th C',
    tags: ['Agartha', 'Poles', 'Expeditions', 'Edmond Halley', 'Admiral Byrd', 'Symmes Holes', 'Shambhala'],
    videoUrl: 'https://www.youtube.com/watch?v=3sxnZc6qfT0',
    relatedIds: ['t1', 't3', 't11', 't39', 't51', 't56']
  },
  {
    id: 't15',
    title: 'Remote Viewing',
    shortDescription: 'CIA/DIA Project Stargate (1975–1995): Psi espionage program with Ingo Swann, Russell Targ. AIR review (1995) found zero operational value. Legitimate parapsychology research but no evidence of superluminal information. Culturally: Netflix documentaries, RV courses. Harmless pseudo-skill industry.',
    category: CategoryEn.ESOTERIC,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 60,
    originYear: '1970s',
    tags: ['CIA', 'Psi Powers', 'Espionage', 'Ingo Swann', 'Russell Targ', 'Stargate Project', 'Parapsychology', 'SRI'],
    videoUrl: 'https://www.youtube.com/watch?v=WkC91tV7oMw',
    relatedIds: ['t13', 't57', 't78', 't22']
  },
  {
    id: 't22',
    title: 'Simulation Theory',
    shortDescription: 'Nick Bostrom\'s philosophical thought experiment (2003) reinterpreted as spiritual salvation narrative: reality = program, consciousness = glitch. Combines quantum mechanics misunderstandings with Gnosticism. Elon Musk vulgarized the thesis. Epistemically unfalsifiable, culturally influential (Matrix iconography), harmless.',
    category: CategoryEn.ESOTERIC,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 83,
    originYear: '2003 (Bostrom)',
    tags: ['Matrix', 'Philosophy', 'Technology', 'AI', 'Nick Bostrom', 'Elon Musk', 'Quantum Mechanics', 'Solipsism'],
    videoUrl: 'https://www.youtube.com/watch?v=tlBKz9e3jXU',
    relatedIds: ['t6', 't47', 't57', 't77', 't62']
  },
  {
    id: 't28',
    title: 'Planet Nibiru (Planet X)',
    shortDescription: 'Zecharia Sitchin\'s pseudo-Sumerology: 12th planet with 3,600-year orbit, home of the Anunnaki. Nancy Lieder (ZetaTalk) prophesied 2003 collision, rescheduled to 2012. Astronomically refuted (gravitational influence would be visible). Apocalypse evergreen, regularly recycled. Harmless doomsday fantasy.',
    category: CategoryEn.ESOTERIC,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 58,
    originYear: '1995',
    tags: ['Space', 'Doomsday', 'NASA', 'Sumerian', 'Zecharia Sitchin', 'Anunnaki', '2012', 'Nancy Lieder'],
    relatedIds: ['t1', 't12', 't56', 't19', 't51']
  },
  {
    id: 't38',
    title: 'Nordics (Pleiadians)',
    shortDescription: '1950s contactee movement: blonde, human-like "Space Brothers" warning against nuclear war (George Adamski, Billy Meier). New Age channeling (Barbara Marciniak) spiritualized contacts. Carl Jung analysis: projections of archetypal ideal figures. Harmless peace message, esoteric commercialization.',
    category: CategoryEn.ESOTERIC,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 54,
    originYear: '1950s',
    tags: ['Aliens', 'Spirituality', 'Channeling', 'Contactee', 'George Adamski', 'Billy Meier', 'Barbara Marciniak', 'Pleiades'],
    relatedIds: ['t19', 't3', 't78', 't57', 't15']
  },
  {
    id: 't39',
    title: 'Aldebaran & Vril',
    shortDescription: 'Post-WWII myth: Thule/Vril societies channeled Aldebaran aliens for UFO technology (Haunebu, Die Glocke), fled to Neuschwabenland. No primary Nazi sources (1990s invention). Romanticizes Nazi occultism, trivializes war crimes through alien explanations. Far-right anchor points, dangerous.',
    category: CategoryEn.ESOTERIC,
    dangerLevel: DangerLevelEn.EXTREME,
    popularity: 64,
    originYear: '1920s',
    tags: ['Nazi Occultism', 'UFO', 'Vril', 'History', 'Thule Society', 'Haunebu', 'Neuschwabenland', 'Die Glocke'],
    relatedIds: ['t10', 't11', 't50', 't38', 't40']
  },
  {
    id: 't40',
    title: 'Draconians (Draco Alliance)',
    shortDescription: 'Reptilian militarism trope: Alpha Draconis conquerors as cosmic antagonists (vs. benevolent Nordics/Pleiadians). Stewart Swerdlow, Alex Collier popularized. Manichaean alien soap opera with exopolitics jargon. Psychologically: good-evil projection into the cosmos. Dangerous only through othering potential.',
    category: CategoryEn.ESOTERIC,
    dangerLevel: DangerLevelEn.MEDIUM,
    popularity: 57,
    originYear: '1990s',
    tags: ['Aliens', 'War', 'Reptilians', 'Exopolitics', 'Alpha Draconis', 'Stewart Swerdlow', 'Alex Collier'],
    relatedIds: ['t3', 't37', 't5', 't39', 't77']
  },
  {
    id: 't57',
    title: 'Akashic Records',
    shortDescription: 'Theosophical concept (Helena Blavatsky, Rudolf Steiner): etheric "library" of all events, accessible through clairvoyance. Connects Indian Akasha philosophy with Victorian spiritualism. Edgar Cayce popularized "readings." Epistemically untestable, spiritually functional (meaning-making). Harmless esotericism.',
    category: CategoryEn.ESOTERIC,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 66,
    originYear: '19th C (Theosophy)',
    tags: ['Spirituality', 'Memory', 'Ether', 'Metaphysics', 'Helena Blavatsky', 'Rudolf Steiner', 'Edgar Cayce', 'Theosophy'],
    relatedIds: ['t15', 't22', 't38', 't78']
  },
  {
    id: 't62',
    title: 'CERN Portals',
    shortDescription: 'LHC as interdimensional gate experiment: Gotthard Tunnel ceremony (2016) + Shiva statue = "demon summoning." Technically: Higgs boson discovery, no portal mechanism. Combines physics illiteracy with Christian apocalypticism. Harmless anti-science paranoia.',
    category: CategoryEn.ESOTERIC,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 67,
    originYear: '2008',
    tags: ['Physics', 'Dimensions', 'Demons', 'Switzerland', 'Higgs Boson', 'Strangelets', 'Black Holes', 'Gotthard Tunnel'],
    relatedIds: ['t22', 't12', 't77']
  },
  {
    id: 't77',
    title: 'Prison Planet',
    shortDescription: 'Gnostic-inspired dystopia: Earth as soul battery farm for interdimensional Archons, reincarnation via "light tunnel" = reset mechanism. Connects ancient heresies with modern alienation. Wayne Bush, Cameron Day popularized. Dangerous through reality-escape idealization (suicide risk), anti-materialist.',
    category: CategoryEn.ESOTERIC,
    dangerLevel: DangerLevelEn.HIGH,
    popularity: 71,
    originYear: 'Gnosticism',
    tags: ['Gnostic', 'Archons', 'Reincarnation', 'Matrix', 'Light Tunnel', 'Demiurge', 'Loosh', 'Robert Monroe'],
    relatedIds: ['t22', 't3', 't57', 't40']
  },
  {
    id: 't78',
    title: 'Starseeds',
    shortDescription: 'New Age identity construct: incarnated extraterrestrial souls (Pleiades, Sirius, Arcturus) with mission to raise Earth\'s vibration. Provides meaning for alienation ("I don\'t belong here"). Commercialized through coaching/channeling industry. Harmless self-mystification, financially exploitable.',
    category: CategoryEn.ESOTERIC,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 85,
    originYear: '1970s',
    tags: ['New Age', 'Aliens', 'Ascension', 'Spirituality', 'Channeling', 'Lightworkers', 'Indigo Children', 'Vibration'],
    relatedIds: ['t38', 't57', 't77', 't15']
  },
  // HEALTH
  {
    id: 't29',
    title: 'Fluoride & Pineal Gland',
    shortDescription: 'Cold War fluoridation anxieties (1950s, John Birch Society) + New Age "Third Eye" mysticism: drinking water fluoride allegedly calcifies the pineal gland, making the population docile/unspiritual. Scientifically: fluoride calcification is real but no evidence for cognitive effects at drinking water doses. Combines anti-government paranoia with esoteric consciousness expansion. Dangerous: children denied dental caries prevention.',
    category: CategoryEn.HEALTH,
    dangerLevel: DangerLevelEn.MEDIUM,
    popularity: 65,
    originYear: '1950s',
    tags: ['Water', 'Brain', 'Spirituality', 'Poison', 'Pineal Gland', 'Third Eye', 'John Birch Society', 'Calcification'],
    relatedIds: ['t2', 't6']
  },
  {
    id: 't48',
    title: 'Corona Plandemic (“Scamdemic”)',
    shortDescription: 'Largest pandemic conspiracy of modernity: COVID-19 as planned instrument for lockdown authoritarianism, forced mRNA vaccination ("gene therapy"), Great Reset implementation, 5G activation, and depopulation (Bill Gates patent WO2020060606). Event 201 (Johns Hopkins, 10/2019) as alleged "trial run." Fused all existing conspiracy strands into one mega-theory. Real health danger through vaccine refusal.',
    category: CategoryEn.HEALTH,
    dangerLevel: DangerLevelEn.EXTREME,
    popularity: 98,
    originYear: '2020',
    tags: ['Virus', 'Vaccine', 'Bill Gates', 'Control', 'Event 201', 'mRNA', 'Lockdown', 'Great Reset'],
    relatedIds: ['t20', 't6', 't5', 't47']
  },
  {
    id: 't68',
    title: 'Insect Agenda (“Eat ze Bugs”)',
    shortDescription: 'WEF recommendation for sustainable protein sources reinterpreted as dystopian meat ban: elites eat Wagyu while plebs eat crickets. Klaus Schwab\'s accent ("You will eat ze bugs") became viral meme. Combines climate skepticism, anti-veganism, and class resentment. Real basis: EU Novel Food Regulation (2023) for Acheta domesticus. Culture war over food sovereignty.',
    category: CategoryEn.HEALTH,
    dangerLevel: DangerLevelEn.MEDIUM,
    popularity: 85,
    originYear: '2020',
    tags: ['Diet', 'WEF', 'Culture War', 'Health', 'Klaus Schwab', 'Novel Food', 'Acheta domesticus', 'Protein Transition'],
    relatedIds: ['t20', 't64']
  },
  {
    id: 't70',
    title: 'MedBeds',
    shortDescription: 'QAnon/NESARA derivative: Secret technology (allegedly Tesla/extraterrestrial) cures all diseases, regenerates limbs, rejuvenates by 30 years — but suppressed by pharma industry. Skye Prince ("Real Skye") popularized on Telegram. Financially dangerous: vulnerable people forgo real medicine for promised quantum healing. No single verifiable demonstration exists.',
    category: CategoryEn.HEALTH,
    dangerLevel: DangerLevelEn.HIGH,
    popularity: 75,
    originYear: '2018',
    tags: ['Technology', 'Healing', 'NESARA', 'Scam', 'Telegram', 'Quantum Healing', 'Pharma Suppression', 'Skye Prince'],
    relatedIds: ['t75', 't47']
  }
];
