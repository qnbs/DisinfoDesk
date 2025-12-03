
import { Theory, Category, CategoryEn, DangerLevel, DangerLevelEn } from '../types';

export const HISTORICAL_THEORIES_DE: Theory[] = [
  {
    id: 't4',
    title: 'Mondlandung Fake',
    shortDescription: 'Die Apollo-Mondlandungen wurden angeblich in einem Studio von Stanley Kubrick inszeniert.',
    category: Category.HISTORICAL,
    dangerLevel: DangerLevel.LOW,
    popularity: 70,
    originYear: '1974',
    tags: ['NASA', 'Kalter Krieg', 'Filmstudio'],
    videoUrl: 'https://www.youtube.com/watch?v=KpuKuqc_DNc',
    relatedIds: ['t1', 't16']
  },
  {
    id: 't16',
    title: 'JFK Attentat',
    shortDescription: 'Lee Harvey Oswald war nicht der Einzeltäter; CIA, Mafia oder Lyndon B. Johnson planten den Mord an John F. Kennedy.',
    category: Category.HISTORICAL,
    dangerLevel: DangerLevel.MEDIUM,
    popularity: 95,
    originYear: '1963',
    tags: ['CIA', 'Deep State', 'Kalter Krieg', 'Grassy Knoll'],
    videoUrl: 'https://www.youtube.com/watch?v=hZ0XJ_V-gDw',
    relatedIds: ['t5', 't7', 't18']
  },
  {
    id: 't24',
    title: 'Titanic-Versicherungsbetrug',
    shortDescription: 'Nicht die Titanic sank, sondern ihr beschädigtes Schwesterschiff Olympic. Es war ein geplanter Versicherungsbetrug.',
    category: Category.HISTORICAL,
    dangerLevel: DangerLevel.LOW,
    popularity: 65,
    originYear: '1912/1990er',
    tags: ['Schifffahrt', 'Betrug', 'JP Morgan', 'Unglück'],
    relatedIds: ['t16']
  },
  {
    id: 't26',
    title: 'Erfundene Zeit (Phantomzeit)',
    shortDescription: 'Das frühe Mittelalter (614–911 n. Chr.) hat nie stattgefunden; Karl der Große ist eine Erfindung.',
    category: Category.HISTORICAL,
    dangerLevel: DangerLevel.LOW,
    popularity: 45,
    originYear: '1996 (Illig)',
    tags: ['Geschichte', 'Kalender', 'Mittelalter', 'Zeit'],
    relatedIds: ['t11']
  },
  {
    id: 't34',
    title: 'Die Freimaurer',
    shortDescription: 'Ein diskreter Bund, dem vorgeworfen wird, durch geheime Riten und Netzwerke die Weltpolitik und Architektur (DC) zu steuern.',
    category: Category.HISTORICAL,
    dangerLevel: DangerLevel.LOW,
    popularity: 88,
    originYear: '1717',
    tags: ['Geheimbund', 'Architektur', 'Rituale', 'Geschichte'],
    relatedIds: ['t5', 't35', 't25', 't45', 't54']
  },
  {
    id: 't36',
    title: 'Die Jesuiten-Verschwörung',
    shortDescription: 'Der katholische Orden und sein "Schwarzer Papst" werden verdächtigt, Kriege anzuzetteln und Regierungen zu unterwandern.',
    category: Category.HISTORICAL,
    dangerLevel: DangerLevel.LOW,
    popularity: 40,
    originYear: '16. Jh',
    tags: ['Religion', 'Kirche', 'Vatikan', 'Macht'],
    relatedIds: ['t34', 't5']
  },
  {
    id: 't45',
    title: 'Skull & Bones',
    shortDescription: 'Eine elitäre Studentenverbindung in Yale (Orden 322), aus der viele US-Präsidenten und CIA-Chefs hervorgingen.',
    category: Category.HISTORICAL,
    dangerLevel: DangerLevel.LOW,
    popularity: 75,
    originYear: '1832',
    tags: ['Geheimbund', 'Yale', 'Elite', 'Politik'],
    relatedIds: ['t34', 't35', 't16']
  },
  {
    id: 't49',
    title: 'Tartaria (Mudflood)',
    shortDescription: 'Ein vergessenes, hochentwickeltes Weltreich (Tartaria), dessen Gebäude durch eine Schlammflut (Mudflood) teilweise begraben wurden.',
    category: Category.HISTORICAL,
    dangerLevel: DangerLevel.LOW,
    popularity: 60,
    originYear: '2016 (Revival)',
    tags: ['Architektur', 'Revisionismus', 'Geschichte', 'Internet'],
    relatedIds: ['t26', 't11']
  },
  {
    id: 't53',
    title: 'Karte des Piri Reis',
    shortDescription: 'Eine osmanische Weltkarte von 1513, die angeblich die Küstenlinie der Antarktis eisfrei und präzise darstellt, Jahrhunderte vor ihrer Entdeckung.',
    category: Category.HISTORICAL,
    dangerLevel: DangerLevel.LOW,
    popularity: 72,
    originYear: '1513',
    tags: ['Kartografie', 'Antarktis', 'OOPART', 'Geschichte'],
    relatedIds: ['t11', 't56', 't19']
  },
  {
    id: 't54',
    title: 'Die Tempelritter',
    shortDescription: 'Der christliche Ritterorden wurde 1312 aufgelöst, soll aber im Untergrund weiterbestehen und Schätze wie den Heiligen Gral hüten.',
    category: Category.HISTORICAL,
    dangerLevel: DangerLevel.LOW,
    popularity: 89,
    originYear: '1312',
    tags: ['Geheimbund', 'Religion', 'Mittelalter', 'Schatz'],
    relatedIds: ['t34', 't35', 't11']
  }
];

export const HISTORICAL_THEORIES_EN: Theory[] = [
  {
    id: 't4',
    title: 'Moon Landing Fake',
    shortDescription: 'The Apollo moon landings were allegedly staged in a studio by Stanley Kubrick.',
    category: CategoryEn.HISTORICAL,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 70,
    originYear: '1974',
    tags: ['NASA', 'Cold War', 'Studio'],
    videoUrl: 'https://www.youtube.com/watch?v=KpuKuqc_DNc',
    relatedIds: ['t1', 't16']
  },
  {
    id: 't16',
    title: 'JFK Assassination',
    shortDescription: 'Lee Harvey Oswald was not the lone gunman; CIA, Mafia, or Lyndon B. Johnson plotted the murder of John F. Kennedy.',
    category: CategoryEn.HISTORICAL,
    dangerLevel: DangerLevelEn.MEDIUM,
    popularity: 95,
    originYear: '1963',
    tags: ['CIA', 'Deep State', 'Cold War', 'Grassy Knoll'],
    videoUrl: 'https://www.youtube.com/watch?v=hZ0XJ_V-gDw',
    relatedIds: ['t5', 't7', 't18']
  },
  {
    id: 't24',
    title: 'Titanic Switch',
    shortDescription: 'The Titanic did not sink, but its damaged sister ship the Olympic did. It was a planned insurance fraud.',
    category: CategoryEn.HISTORICAL,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 65,
    originYear: '1912/1990s',
    tags: ['Maritime', 'Fraud', 'JP Morgan', 'Disaster'],
    relatedIds: ['t16']
  },
  {
    id: 't26',
    title: 'Phantom Time Hypothesis',
    shortDescription: 'The early Middle Ages (614–911 AD) never happened; Charlemagne is an invention.',
    category: CategoryEn.HISTORICAL,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 45,
    originYear: '1996 (Illig)',
    tags: ['History', 'Calendar', 'Middle Ages', 'Time'],
    relatedIds: ['t11']
  },
  {
    id: 't34',
    title: 'The Freemasons',
    shortDescription: 'A discreet fraternity accused of controlling world politics and architecture (DC) through secret rites and networks.',
    category: CategoryEn.HISTORICAL,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 88,
    originYear: '1717',
    tags: ['Secret Society', 'Architecture', 'Rituals', 'History'],
    relatedIds: ['t5', 't35', 't25', 't45', 't54']
  },
  {
    id: 't36',
    title: 'The Jesuit Conspiracy',
    shortDescription: 'The Catholic order and its "Black Pope" are suspected of instigating wars and infiltrating governments.',
    category: CategoryEn.HISTORICAL,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 40,
    originYear: '16th C',
    tags: ['Religion', 'Church', 'Vatican', 'Power'],
    relatedIds: ['t34', 't5']
  },
  {
    id: 't45',
    title: 'Skull & Bones',
    shortDescription: 'An elite student society at Yale (Order 322) from which many US presidents and CIA directors have emerged.',
    category: CategoryEn.HISTORICAL,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 75,
    originYear: '1832',
    tags: ['Secret Society', 'Yale', 'Elite', 'Politics'],
    relatedIds: ['t34', 't35', 't16']
  },
  {
    id: 't49',
    title: 'Tartaria (Mudflood)',
    shortDescription: 'A forgotten, technologically advanced empire (Tartaria) whose buildings were partially buried by a cataclysmic mudflood.',
    category: CategoryEn.HISTORICAL,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 60,
    originYear: '2016 (Revival)',
    tags: ['Architecture', 'Revisionism', 'History', 'Internet'],
    relatedIds: ['t26', 't11']
  },
  {
    id: 't53',
    title: 'Piri Reis Map',
    shortDescription: 'An Ottoman world map from 1513 that allegedly depicts the coastline of Antarctica ice-free and precise, centuries before its discovery.',
    category: CategoryEn.HISTORICAL,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 72,
    originYear: '1513',
    tags: ['Cartography', 'Antarctica', 'OOPART', 'History'],
    relatedIds: ['t11', 't56', 't19']
  },
  {
    id: 't54',
    title: 'Knights Templar',
    shortDescription: 'The Christian military order was disbanded in 1312 but allegedly continues underground, guarding treasures like the Holy Grail.',
    category: CategoryEn.HISTORICAL,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 89,
    originYear: '1312',
    tags: ['Secret Society', 'Religion', 'Middle Ages', 'Treasure'],
    relatedIds: ['t34', 't35', 't11']
  }
];
