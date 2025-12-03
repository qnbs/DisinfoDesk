
import { Theory, Category, CategoryEn, DangerLevel, DangerLevelEn } from '../types';

export const ESOTERIC_THEORIES_DE: Theory[] = [
  {
    id: 't3',
    title: 'Reptiloide',
    shortDescription: 'Formwandelnde Reptilienwesen kontrollieren angeblich die Weltregierung in Menschengestalt.',
    category: Category.ESOTERIC,
    dangerLevel: DangerLevel.MEDIUM,
    popularity: 45,
    originYear: '1998',
    tags: ['Aliens', 'Elite', 'David Icke'],
    videoUrl: 'https://www.youtube.com/watch?v=3qJvK8_8_V4', // General WF
    relatedIds: ['t5', 't10', 't13', 't17', 't19', 't40']
  },
  {
    id: 't10',
    title: 'Hohle Erde',
    shortDescription: 'Im Inneren der Erde befinden sich angeblich Zivilisationen (Agartha) und eine innere Sonne.',
    category: Category.ESOTERIC,
    dangerLevel: DangerLevel.LOW,
    popularity: 30,
    originYear: '17. Jh',
    tags: ['Agartha', 'Pole', 'Expeditionen'],
    videoUrl: 'https://www.youtube.com/watch?v=3sxnZc6qfT0',
    relatedIds: ['t1', 't3', 't11', 't39', 't51']
  },
  {
    id: 't15',
    title: 'Remote Viewing',
    shortDescription: 'Das US-Militär (Projekt Stargate) nutzte angeblich Hellseher wie Ingo Swann, um sowjetische Ziele und außerirdische Basen auszuspionieren.',
    category: Category.ESOTERIC,
    dangerLevel: DangerLevel.LOW,
    popularity: 55,
    originYear: '1970er',
    tags: ['CIA', 'Psi-Kräfte', 'Spionage', 'Ingo Swann'],
    videoUrl: 'https://www.youtube.com/watch?v=WkC91tV7oMw',
    relatedIds: ['t13', 't57']
  },
  {
    id: 't22',
    title: 'Simulations-Theorie',
    shortDescription: 'Die Realität ist eigentlich eine Computersimulation einer fortgeschrittenen Zivilisation, und wir sind nur Code.',
    category: Category.ESOTERIC,
    dangerLevel: DangerLevel.LOW,
    popularity: 75,
    originYear: '2003 (Bostrom)',
    tags: ['Matrix', 'Philosophie', 'Technologie', 'KI'],
    videoUrl: 'https://www.youtube.com/watch?v=tlBKz9e3jXU',
    relatedIds: ['t6', 't47', 't57']
  },
  {
    id: 't28',
    title: 'Planet Nibiru (Planet X)',
    shortDescription: 'Ein riesiger Planet nähert sich der Erde und wird eine globale Katastrophe auslösen, was von der NASA vertuscht wird.',
    category: Category.ESOTERIC,
    dangerLevel: DangerLevel.LOW,
    popularity: 55,
    originYear: '1995',
    tags: ['Weltraum', 'Weltuntergang', 'NASA', 'Sumerer'],
    relatedIds: ['t1', 't12', 't56']
  },
  {
    id: 't38',
    title: 'Nordics (Plejader)',
    shortDescription: 'Menschenähnliche, wohlwollende Außerirdische ("Space Brothers"), die vor Atomkraft warnen und spirituellen Aufstieg lehren.',
    category: Category.ESOTERIC,
    dangerLevel: DangerLevel.LOW,
    popularity: 50,
    originYear: '1950er',
    tags: ['Aliens', 'Spiritualität', 'Channeling', 'Kontaktler'],
    relatedIds: ['t19', 't3']
  },
  {
    id: 't39',
    title: 'Aldebaran & Vril',
    shortDescription: 'Esoterische Nazis sollen telepathischen Kontakt zu Aldebaran gehabt haben, um UFO-Technologie (Vril) zu entwickeln.',
    category: Category.ESOTERIC,
    dangerLevel: DangerLevel.HIGH,
    popularity: 60,
    originYear: '1920er',
    tags: ['Nazi-Okkultismus', 'UFO', 'Vril', 'Geschichte'],
    relatedIds: ['t10', 't11', 't50']
  },
  {
    id: 't40',
    title: 'Draconier (Draco-Allianz)',
    shortDescription: 'Eine kriegerische Rasse reptiloider Eroberer aus dem Alpha-Draconis-System, die angeblich die Erde als Kolonie betrachten.',
    category: Category.ESOTERIC,
    dangerLevel: DangerLevel.HIGH,
    popularity: 55,
    originYear: '1990er',
    tags: ['Aliens', 'Krieg', 'Reptiloide', 'Exopolitik'],
    relatedIds: ['t3', 't37', 't5']
  },
  {
    id: 't57',
    title: 'Akasha Chronik',
    shortDescription: 'Ein mystisches "Weltgedächtnis" im Äther, das jedes Ereignis, jeden Gedanken und jede Emotion der Geschichte speichert.',
    category: Category.ESOTERIC,
    dangerLevel: DangerLevel.LOW,
    popularity: 68,
    originYear: '19. Jh (Theosophie)',
    tags: ['Spiritualität', 'Gedächtnis', 'Äther', 'Metaphysik'],
    relatedIds: ['t15', 't22', 't38']
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
    relatedIds: ['t6', 't47', 't57']
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
    relatedIds: ['t19', 't3']
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
  }
];
