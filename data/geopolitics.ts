
import { Theory, Category, CategoryEn, DangerLevel, DangerLevelEn } from '../types';

export const GEOPOLITICS_THEORIES_DE: Theory[] = [
  {
    id: 't5',
    title: 'New World Order (NWO)',
    shortDescription: 'Eine geheime Elite plant eine autoritäre Weltregierung, um die Menschheit zu versklaven.',
    category: Category.GEOPOLITICS,
    dangerLevel: DangerLevel.HIGH,
    popularity: 90,
    originYear: '1990er',
    tags: ['Elite', 'Globalisierung', 'Kontrolle'],
    relatedIds: ['t7', 't3', 't9', 't14', 't18', 't20', 't25', 't35', 't43', 't64']
  },
  {
    id: 't7',
    title: 'QAnon',
    shortDescription: 'Ein komplexes Geflecht aus Behauptungen über einen "Deep State" und geheime Eliten-Ringe.',
    category: Category.GEOPOLITICS,
    dangerLevel: DangerLevel.EXTREME,
    popularity: 85,
    originYear: '2017',
    tags: ['Deep State', 'USA', 'Internetkultur'],
    videoUrl: 'https://www.youtube.com/watch?v=3qJvK8_8_V4', // Generic Deep State ref
    relatedIds: ['t5', 't9', 't16', 't30', 't48', 't65']
  },
  {
    id: 't9',
    title: 'Großer Austausch',
    shortDescription: 'Rassistische Theorie über den angeblich gezielten Austausch der Bevölkerung.',
    category: Category.GEOPOLITICS,
    dangerLevel: DangerLevel.EXTREME,
    popularity: 55,
    originYear: '2010er',
    tags: ['Demografie', 'Politik', 'Rechtsradikal'],
    relatedIds: ['t5', 't7', 't20']
  },
  {
    id: 't14',
    title: 'Project Blue Beam',
    shortDescription: 'Ein angeblicher Plan der NASA, mittels riesiger Hologramme am Himmel eine religiöse Wiederkunft zu inszenieren und die NWO einzuleiten.',
    category: Category.GEOPOLITICS,
    dangerLevel: DangerLevel.HIGH,
    popularity: 50,
    originYear: '1994',
    tags: ['Hologramme', 'Religion', 'NWO', 'NASA'],
    videoUrl: 'https://www.youtube.com/watch?v=rK0K9X9_Z9M',
    relatedIds: ['t5', 't2', 't6', 't21', 't39']
  },
  {
    id: 't18',
    title: '9/11 Inside Job',
    shortDescription: 'Die Terroranschläge vom 11. September 2001 wurden angeblich von der US-Regierung inszeniert (Sprengung, nicht Flugzeuge), um Kriege zu rechtfertigen.',
    category: Category.GEOPOLITICS,
    dangerLevel: DangerLevel.HIGH,
    popularity: 88,
    originYear: '2001',
    tags: ['Terror', 'False Flag', 'Stahlträger', 'Bush'],
    relatedIds: ['t5', 't16', 't7', 't19', 't25']
  },
  {
    id: 't20',
    title: 'The Great Reset',
    shortDescription: 'Das Weltwirtschaftsforum (WEF) nutzte angeblich die Pandemie, um Privateigentum abzuschaffen und eine totalitäre Kontrolle einzuführen.',
    category: Category.GEOPOLITICS,
    dangerLevel: DangerLevel.HIGH,
    popularity: 85,
    originYear: '2020',
    tags: ['WEF', 'Klaus Schwab', 'Wirtschaft', 'Enteignung'],
    relatedIds: ['t5', 't9', 't30', 't47', 't48', 't64']
  },
  {
    id: 't30',
    title: 'Adrenochrome',
    shortDescription: 'Hollywood-Eliten sollen angeblich Kinderblut trinken, um die Droge Adrenochrom zur Verjüngung zu gewinnen.',
    category: Category.GEOPOLITICS,
    dangerLevel: DangerLevel.EXTREME,
    popularity: 80,
    originYear: '2016',
    tags: ['QAnon', 'Hollywood', 'Satanism', 'Blut'],
    relatedIds: ['t7', 't5', 't3', 't46', 't65']
  },
  {
    id: 't35',
    title: 'Die Illuminaten',
    shortDescription: 'Der bayerische Geheimorden (1776) existiert angeblich weiter und kontrolliert Banken, Regierungen und die Unterhaltungsindustrie.',
    category: Category.GEOPOLITICS,
    dangerLevel: DangerLevel.MEDIUM,
    popularity: 95,
    originYear: '1776',
    tags: ['Elite', 'Bayern', 'Geheimbund', 'Popkultur'],
    relatedIds: ['t5', 't34', 't20', 't43', 't45']
  },
  {
    id: 't43',
    title: 'Die Bilderberger',
    shortDescription: 'Jährliche, informelle Treffen einflussreicher Personen aus Politik und Wirtschaft, denen die Bildung einer geheimen Weltregierung nachgesagt wird.',
    category: Category.GEOPOLITICS,
    dangerLevel: DangerLevel.MEDIUM,
    popularity: 82,
    originYear: '1954',
    tags: ['Elite', 'Konferenz', 'Geheim', 'Politik'],
    relatedIds: ['t5', 't20', 't35']
  },
  {
    id: 't46',
    title: 'Bohemian Grove',
    shortDescription: 'Ein jährliches Treffen der amerikanischen Machtelite in Kalifornien, bei dem angeblich okkulte Rituale vor einer Eulenstatue (Moloch) abgehalten werden.',
    category: Category.GEOPOLITICS,
    dangerLevel: DangerLevel.MEDIUM,
    popularity: 70,
    originYear: '1872',
    tags: ['Elite', 'Okkultismus', 'Rituale', 'Kalifornien'],
    videoUrl: 'https://www.youtube.com/watch?v=F2E_HJ9yljk',
    relatedIds: ['t5', 't30', 't34']
  },
  {
    id: 't47',
    title: 'Transhumanismus-Agenda',
    shortDescription: 'Die Verschmelzung von Mensch und Maschine wird angeblich vorangetrieben, um die Menschheit zu kontrollieren oder "Seelenlos" zu machen.',
    category: Category.GEOPOLITICS,
    dangerLevel: DangerLevel.MEDIUM,
    popularity: 65,
    originYear: '2000er',
    tags: ['Technologie', 'KI', 'Evolution', 'Kontrolle'],
    relatedIds: ['t6', 't20', 't22', 't48']
  },
  {
    id: 't64',
    title: 'Agenda 2030',
    shortDescription: 'Die UN-Ziele für nachhaltige Entwicklung werden als Deckmantel für eine globale totalitäre Überwachung und Enteignung interpretiert.',
    category: Category.GEOPOLITICS,
    dangerLevel: DangerLevel.HIGH,
    popularity: 82,
    originYear: '2015',
    tags: ['UN', 'NWO', 'Nachhaltigkeit', 'Kontrolle'],
    relatedIds: ['t20', 't5', 't74']
  },
  {
    id: 't65',
    title: 'The Finders Cult',
    shortDescription: 'Ein mysteriöser Kult, der 1987 in eine CIA-Untersuchung verwickelt war. Oft als Vorläufer der QAnon/Pizzagate-Erzählungen über Elite-Kinderhandel zitiert.',
    category: Category.GEOPOLITICS,
    dangerLevel: DangerLevel.HIGH,
    popularity: 55,
    originYear: '1987',
    tags: ['CIA', 'Kult', 'Kinder', 'Deep State'],
    relatedIds: ['t7', 't30']
  },
  {
    id: 't74',
    title: '15-Minuten-Städte',
    shortDescription: 'Stadtplanungskonzepte für bessere Erreichbarkeit werden als Versuch gedeutet, Bürger in "Klima-Ghettos" einzusperren und Bewegungsfreiheit einzuschränken.',
    category: Category.GEOPOLITICS,
    dangerLevel: DangerLevel.HIGH,
    popularity: 88,
    originYear: '2022',
    tags: ['Klima', 'Lockdown', 'Städtebau', 'WEF'],
    relatedIds: ['t20', 't64']
  },
  {
    id: 't75',
    title: 'NESARA / GESARA',
    shortDescription: 'Die Hoffnung auf ein geheimes Gesetz, das alle Schulden erlässt und ein neues Finanzsystem (oft mit BRICS/Goldstandard) einführt.',
    category: Category.GEOPOLITICS,
    dangerLevel: DangerLevel.MEDIUM,
    popularity: 70,
    originYear: '2000',
    tags: ['Finanzen', 'Schulden', 'Gold', 'Utopie'],
    relatedIds: ['t7', 't5']
  }
];

export const GEOPOLITICS_THEORIES_EN: Theory[] = [
  {
    id: 't5',
    title: 'New World Order (NWO)',
    shortDescription: 'A secret elite plans an authoritarian world government to enslave humanity.',
    category: CategoryEn.GEOPOLITICS,
    dangerLevel: DangerLevelEn.HIGH,
    popularity: 90,
    originYear: '1990s',
    tags: ['Elite', 'Globalization', 'Control'],
    relatedIds: ['t7', 't3', 't9', 't14', 't18', 't20', 't25', 't35', 't43', 't64']
  },
  {
    id: 't7',
    title: 'QAnon',
    shortDescription: 'A complex web of claims about a "Deep State" and secret elite rings.',
    category: CategoryEn.GEOPOLITICS,
    dangerLevel: DangerLevelEn.EXTREME,
    popularity: 85,
    originYear: '2017',
    tags: ['Deep State', 'USA', 'Internet Culture'],
    videoUrl: 'https://www.youtube.com/watch?v=3qJvK8_8_V4',
    relatedIds: ['t5', 't9', 't16', 't30', 't48', 't65']
  },
  {
    id: 't9',
    title: 'Great Replacement',
    shortDescription: 'Racist theory about the allegedly targeted replacement of the population.',
    category: CategoryEn.GEOPOLITICS,
    dangerLevel: DangerLevelEn.EXTREME,
    popularity: 55,
    originYear: '2010s',
    tags: ['Demography', 'Politics', 'Far-right'],
    relatedIds: ['t5', 't7', 't20']
  },
  {
    id: 't14',
    title: 'Project Blue Beam',
    shortDescription: 'An alleged NASA plan to stage a religious second coming using giant holograms in the sky to initiate the NWO.',
    category: CategoryEn.GEOPOLITICS,
    dangerLevel: DangerLevelEn.HIGH,
    popularity: 50,
    originYear: '1994',
    tags: ['Holograms', 'Religion', 'NWO', 'NASA'],
    videoUrl: 'https://www.youtube.com/watch?v=rK0K9X9_Z9M',
    relatedIds: ['t5', 't2', 't6', 't21', 't39']
  },
  {
    id: 't18',
    title: '9/11 Inside Job',
    shortDescription: 'The September 11, 2001 terrorist attacks were allegedly orchestrated by the US government (controlled demolition) to justify wars.',
    category: CategoryEn.GEOPOLITICS,
    dangerLevel: DangerLevelEn.HIGH,
    popularity: 88,
    originYear: '2001',
    tags: ['Terror', 'False Flag', 'Steel Beams', 'Bush'],
    relatedIds: ['t5', 't16', 't7', 't19', 't25']
  },
  {
    id: 't20',
    title: 'The Great Reset',
    shortDescription: 'The World Economic Forum (WEF) allegedly used the pandemic to abolish private property and establish totalitarian control.',
    category: CategoryEn.GEOPOLITICS,
    dangerLevel: DangerLevelEn.HIGH,
    popularity: 85,
    originYear: '2020',
    tags: ['WEF', 'Klaus Schwab', 'Economy', 'Expropriation'],
    relatedIds: ['t5', 't9', 't30', 't47', 't48', 't64']
  },
  {
    id: 't30',
    title: 'Adrenochrome',
    shortDescription: 'Hollywood elites allegedly drink children\'s blood to harvest the drug adrenochrome for rejuvenation.',
    category: CategoryEn.GEOPOLITICS,
    dangerLevel: DangerLevelEn.EXTREME,
    popularity: 80,
    originYear: '2016',
    tags: ['QAnon', 'Hollywood', 'Satanism', 'Blood'],
    relatedIds: ['t7', 't5', 't3', 't46', 't65']
  },
  {
    id: 't35',
    title: 'The Illuminati',
    shortDescription: 'The Bavarian secret order (1776) allegedly continues to exist, controlling banks, governments, and the entertainment industry.',
    category: CategoryEn.GEOPOLITICS,
    dangerLevel: DangerLevelEn.MEDIUM,
    popularity: 95,
    originYear: '1776',
    tags: ['Elite', 'Bavaria', 'Secret Society', 'Pop Culture'],
    relatedIds: ['t5', 't34', 't20', 't43', 't45']
  },
  {
    id: 't43',
    title: 'The Bilderberg Group',
    shortDescription: 'Annual informal meetings of influential people from politics and business, rumored to be establishing a secret world government.',
    category: CategoryEn.GEOPOLITICS,
    dangerLevel: DangerLevelEn.MEDIUM,
    popularity: 82,
    originYear: '1954',
    tags: ['Elite', 'Conference', 'Secret', 'Politics'],
    relatedIds: ['t5', 't20', 't35']
  },
  {
    id: 't46',
    title: 'Bohemian Grove',
    shortDescription: 'An annual gathering of the American power elite in California, where occult rituals are allegedly performed before an owl statue (Moloch).',
    category: CategoryEn.GEOPOLITICS,
    dangerLevel: DangerLevelEn.MEDIUM,
    popularity: 70,
    originYear: '1872',
    tags: ['Elite', 'Occultism', 'Rituals', 'California'],
    videoUrl: 'https://www.youtube.com/watch?v=F2E_HJ9yljk',
    relatedIds: ['t5', 't30', 't34']
  },
  {
    id: 't47',
    title: 'Transhumanism Agenda',
    shortDescription: 'The merging of humans and machines is allegedly being pushed to control humanity or remove its "soul".',
    category: CategoryEn.GEOPOLITICS,
    dangerLevel: DangerLevelEn.MEDIUM,
    popularity: 65,
    originYear: '2000s',
    tags: ['Technology', 'AI', 'Evolution', 'Control'],
    relatedIds: ['t6', 't20', 't22', 't48']
  },
  {
    id: 't64',
    title: 'Agenda 2030',
    shortDescription: 'UN sustainable development goals are interpreted as a cover for global totalitarian surveillance, depopulation, and expropriation.',
    category: CategoryEn.GEOPOLITICS,
    dangerLevel: DangerLevelEn.HIGH,
    popularity: 82,
    originYear: '2015',
    tags: ['UN', 'NWO', 'Sustainability', 'Control'],
    relatedIds: ['t20', 't5', 't74']
  },
  {
    id: 't65',
    title: 'The Finders Cult',
    shortDescription: 'A mysterious cult implicated in a 1987 CIA investigation. Often cited as a precursor to QAnon/Pizzagate narratives about elite child trafficking.',
    category: CategoryEn.GEOPOLITICS,
    dangerLevel: DangerLevelEn.HIGH,
    popularity: 55,
    originYear: '1987',
    tags: ['CIA', 'Cult', 'Children', 'Deep State'],
    relatedIds: ['t7', 't30']
  },
  {
    id: 't74',
    title: '15-Minute Cities',
    shortDescription: 'Urban planning concepts for better accessibility are interpreted as an attempt to lock citizens in "climate ghettos" and restrict movement.',
    category: CategoryEn.GEOPOLITICS,
    dangerLevel: DangerLevelEn.HIGH,
    popularity: 88,
    originYear: '2022',
    tags: ['Climate', 'Lockdown', 'Urban Planning', 'WEF'],
    relatedIds: ['t20', 't64']
  },
  {
    id: 't75',
    title: 'NESARA / GESARA',
    shortDescription: 'The hope for a secret law that forgives all debts and introduces a new financial system (often linked to BRICS/Gold Standard).',
    category: CategoryEn.GEOPOLITICS,
    dangerLevel: DangerLevelEn.MEDIUM,
    popularity: 70,
    originYear: '2000',
    tags: ['Finance', 'Debt', 'Gold', 'Utopia'],
    relatedIds: ['t7', 't5']
  }
];