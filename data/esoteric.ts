
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
    videoUrl: 'https://www.youtube.com/watch?v=3qJvK8_8_V4', // General WF
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
    shortDescription: 'Theosophisches Konzept (Helena Blavatsky, Rudolf Steiner): Äther-"Bibliothek" aller Ereignisse, zugänglich durch Hellsehen. Verbindet indische Akasha-Philosophie mit viktorianischem Spiritismus. Edgar Cayce popularisierte „Readings". Epistemisch nicht prüfbar, spirituell funktional (Sinnstiftung). Harmlose Esoterik.',
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
    shortDescription: 'LHC als interdimensionales Tor-Experiment: Gotthard-Tunnel-Zeremonie (2016) + Shiva-Statue = „Dämon-Beschwörung". Technisch: Higgs-Boson-Entdeckung, kein Portal-Mechanismus. Verbindet Physik-Analphabetismus mit christlichem Apokalyptismus. Harmlose Anti-Wissenschaft-Paranoia.',
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
    shortDescription: 'Gnostisch-inspirierte Dystopie: Erde als Seelen-Batteriefarm für interdimensionale Archonten, Reinkarnation via „Lichttunnel" = Reset-Mechanismus. Verbindet antike Häresien mit moderner Entfremdung. Wayne Bush, Cameron Day populär. Gefährlich durch Realitätsflucht-Idealisierung (Suizid-Risiko), anti-materialistisch.',
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
    shortDescription: 'New-Age-Identitätskonstrukt: Inkarnierte außerirdische Seelen (Plejaden, Sirius, Arcturus) mit Mission, Erd-Schwingung anzuheben. Bietet Sinnstiftung für Entfremdung („Ich gehöre nicht hierher"). Kommerzialisiert durch Coaching/Channeling-Industrie. Harmlose Selbstmystifizierung, finanziell ausbeutbar.',
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
    shortDescription: 'Trinkwasserfluoridierung dient angeblich dazu, die Zirbeldrüse ("Drittes Auge") zu verkalken und die Bevölkerung gefügig zu machen.',
    category: Category.HEALTH,
    dangerLevel: DangerLevel.MEDIUM,
    popularity: 65,
    originYear: '1950er',
    tags: ['Wasser', 'Gehirn', 'Spiritualität', 'Gift'],
    relatedIds: ['t2', 't6']
  },
  {
    id: 't48',
    title: 'Corona-Plandemie ("Scamdemic")',
    shortDescription: 'Die COVID-19-Pandemie sei geplant gewesen, um Bürgerrechte einzuschränken, Zwangsimpfungen durchzuführen oder die Wirtschaft zu zerstören.',
    category: Category.HEALTH,
    dangerLevel: DangerLevel.EXTREME,
    popularity: 98,
    originYear: '2020',
    tags: ['Virus', 'Impfung', 'Bill Gates', 'Kontrolle'],
    relatedIds: ['t20', 't6', 't5', 't47']
  },
  {
    id: 't68',
    title: 'Insekten-Agenda ("Eat ze Bugs")',
    shortDescription: 'Die Elite will Fleisch verbieten und die Bevölkerung zwingen, Insekten zu essen, um sie zu schwächen oder zu entmenschlichen.',
    category: Category.HEALTH,
    dangerLevel: DangerLevel.MEDIUM,
    popularity: 85,
    originYear: '2020',
    tags: ['Ernährung', 'WEF', 'Kulturkampf', 'Gesundheit'],
    relatedIds: ['t20', 't64']
  },
  {
    id: 't70',
    title: 'MedBeds',
    shortDescription: 'Geheime, holografische Betten, die angeblich alle Krankheiten heilen, Gliedmaßen nachwachsen lassen und das Alter umkehren können, aber zurückgehalten werden.',
    category: Category.HEALTH,
    dangerLevel: DangerLevel.HIGH,
    popularity: 75,
    originYear: '2018',
    tags: ['Technologie', 'Heilung', 'NESARA', 'Betrug'],
    relatedIds: ['t75', 't47']
  }
];

export const ESOTERIC_THEORIES_EN: Theory[] = [
  {
    id: 't3',
    title: 'Reptilians',
    shortDescription: 'Shape-shifting reptilian humanoids allegedly control the world government in human guise.',
    category: CategoryEn.ESOTERIC,
    dangerLevel: DangerLevelEn.MEDIUM,
    popularity: 45,
    originYear: '1998',
    tags: ['Aliens', 'Elite', 'David Icke'],
    videoUrl: 'https://www.youtube.com/watch?v=3qJvK8_8_V4',
    relatedIds: ['t5', 't10', 't13', 't17', 't19', 't40']
  },
  {
    id: 't10',
    title: 'Hollow Earth',
    shortDescription: 'Civilizations (Agartha) and an inner sun allegedly exist inside the Earth.',
    category: CategoryEn.ESOTERIC,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 30,
    originYear: '17th C',
    tags: ['Agartha', 'Poles', 'Expeditions'],
    videoUrl: 'https://www.youtube.com/watch?v=3sxnZc6qfT0',
    relatedIds: ['t1', 't3', 't11', 't39', 't51']
  },
  {
    id: 't15',
    title: 'Remote Viewing',
    shortDescription: 'The US military (Project Stargate) allegedly used psychics like Ingo Swann to spy on Soviet targets and alien bases.',
    category: CategoryEn.ESOTERIC,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 55,
    originYear: '1970s',
    tags: ['CIA', 'Psi Powers', 'Espionage', 'Ingo Swann'],
    videoUrl: 'https://www.youtube.com/watch?v=WkC91tV7oMw',
    relatedIds: ['t13', 't57']
  },
  {
    id: 't22',
    title: 'Simulation Theory',
    shortDescription: 'Reality is actually a computer simulation by an advanced civilization, and we are just code.',
    category: CategoryEn.ESOTERIC,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 75,
    originYear: '2003 (Bostrom)',
    tags: ['Matrix', 'Philosophy', 'Technology', 'AI'],
    videoUrl: 'https://www.youtube.com/watch?v=tlBKz9e3jXU',
    relatedIds: ['t6', 't47', 't57', 't77']
  },
  {
    id: 't28',
    title: 'Planet Nibiru (Planet X)',
    shortDescription: 'A giant planet is approaching Earth and will cause a global cataclysm, a fact covered up by NASA.',
    category: CategoryEn.ESOTERIC,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 55,
    originYear: '1995',
    tags: ['Space', 'Doomsday', 'NASA', 'Sumerian'],
    relatedIds: ['t1', 't12', 't56']
  },
  {
    id: 't38',
    title: 'Nordics (Pleiadians)',
    shortDescription: 'Human-like, benevolent extraterrestrials ("Space Brothers") who warn against nuclear power and teach spiritual ascension.',
    category: CategoryEn.ESOTERIC,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 50,
    originYear: '1950s',
    tags: ['Aliens', 'Spirituality', 'Channeling', 'Contactee'],
    relatedIds: ['t19', 't3', 't78']
  },
  {
    id: 't39',
    title: 'Aldebaran & Vril',
    shortDescription: 'Esoterische Nazis allegedly had telepathic contact with Aldebaran to develop UFO technology (Vril).',
    category: CategoryEn.ESOTERIC,
    dangerLevel: DangerLevelEn.HIGH,
    popularity: 60,
    originYear: '1920s',
    tags: ['Nazi Occultism', 'UFO', 'Vril', 'History'],
    relatedIds: ['t10', 't11', 't50']
  },
  {
    id: 't40',
    title: 'Draconians (Draco Alliance)',
    shortDescription: 'A warlike race of reptilian conquerors from the Alpha Draconis system, allegedly viewing Earth as a colony.',
    category: CategoryEn.ESOTERIC,
    dangerLevel: DangerLevelEn.HIGH,
    popularity: 55,
    originYear: '1990s',
    tags: ['Aliens', 'War', 'Reptilians', 'Exopolitics'],
    relatedIds: ['t3', 't37', 't5']
  },
  {
    id: 't57',
    title: 'Akashic Records',
    shortDescription: 'A mystical "world memory" in the ether that stores every event, thought, and emotion in history.',
    category: CategoryEn.ESOTERIC,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 68,
    originYear: '19th C (Theosophy)',
    tags: ['Spirituality', 'Memory', 'Ether', 'Metaphysics'],
    relatedIds: ['t15', 't22', 't38']
  },
  {
    id: 't62',
    title: 'CERN Portals',
    shortDescription: 'The Large Hadron Collider (LHC) is suspected of opening portals to other dimensions or hell (Shiva statue, Gotthard Tunnel ritual).',
    category: CategoryEn.ESOTERIC,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 70,
    originYear: '2008',
    tags: ['Physics', 'Dimensions', 'Demons', 'Switzerland'],
    relatedIds: ['t22', 't12']
  },
  {
    id: 't77',
    title: 'Prison Planet',
    shortDescription: 'The theory that Earth is a spiritual trap where souls are recycled through reincarnation (the "light tunnel") to feed Archons.',
    category: CategoryEn.ESOTERIC,
    dangerLevel: DangerLevelEn.MEDIUM,
    popularity: 65,
    originYear: 'Gnosticism',
    tags: ['Gnostic', 'Archons', 'Reincarnation', 'Matrix'],
    relatedIds: ['t22', 't3']
  },
  {
    id: 't78',
    title: 'Starseeds',
    shortDescription: 'Humans who believe their souls originated from other star systems (Pleiades, Sirius) to raise Earth\'s vibration.',
    category: CategoryEn.ESOTERIC,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 80,
    originYear: '1970s',
    tags: ['New Age', 'Aliens', 'Ascension', 'Spirituality'],
    relatedIds: ['t38']
  },
  // HEALTH
  {
    id: 't29',
    title: 'Fluoride & Pineal Gland',
    shortDescription: 'Drinking water fluoridation supposedly serves to calcify the pineal gland ("Third Eye") and make the population docile.',
    category: CategoryEn.HEALTH,
    dangerLevel: DangerLevelEn.MEDIUM,
    popularity: 65,
    originYear: '1950s',
    tags: ['Water', 'Brain', 'Spirituality', 'Poison'],
    relatedIds: ['t2', 't6']
  },
  {
    id: 't48',
    title: 'Corona Plandemic ("Scamdemic")',
    shortDescription: 'The COVID-19 pandemic was allegedly planned to restrict civil rights, enforce vaccinations, or destroy the economy.',
    category: CategoryEn.HEALTH,
    dangerLevel: DangerLevelEn.EXTREME,
    popularity: 98,
    originYear: '2020',
    tags: ['Virus', 'Vaccine', 'Bill Gates', 'Control'],
    relatedIds: ['t20', 't6', 't5', 't47']
  },
  {
    id: 't68',
    title: 'Insect Agenda ("Eat ze Bugs")',
    shortDescription: 'The elite supposedly wants to ban meat and force the population to eat insects to weaken or dehumanize them.',
    category: CategoryEn.HEALTH,
    dangerLevel: DangerLevelEn.MEDIUM,
    popularity: 85,
    originYear: '2020',
    tags: ['Diet', 'WEF', 'Culture War', 'Health'],
    relatedIds: ['t20', 't64']
  },
  {
    id: 't70',
    title: 'MedBeds',
    shortDescription: 'Secret holographic beds that can supposedly cure all diseases, regrow limbs, and reverse aging, but are being withheld.',
    category: CategoryEn.HEALTH,
    dangerLevel: DangerLevelEn.HIGH,
    popularity: 75,
    originYear: '2018',
    tags: ['Technology', 'Healing', 'NESARA', 'Scam'],
    relatedIds: ['t75', 't47']
  }
];