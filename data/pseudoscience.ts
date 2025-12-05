
import { Theory, Category, CategoryEn, DangerLevel, DangerLevelEn } from '../types';

export const PSEUDOSCIENCE_THEORIES_DE: Theory[] = [
  {
    id: 't1',
    title: 'Die flache Erde',
    shortDescription: 'Die Überzeugung, dass die Erde eine flache Scheibe ist, die von einer Eiswand umgeben wird.',
    category: Category.PSEUDOSCIENCE,
    dangerLevel: DangerLevel.LOW,
    popularity: 65,
    originYear: '19. Jh (Wiederaufleben)',
    tags: ['NASA', 'Eiswand', 'Schwerkraft-Lüge'],
    videoUrl: 'https://www.youtube.com/watch?v=VNqNnUJVcVs',
    relatedIds: ['t4', 't10', 't56']
  },
  {
    id: 't2',
    title: 'Chemtrails',
    shortDescription: 'Kondensstreifen von Flugzeugen enthalten angeblich Chemikalien zur Gedankenkontrolle oder Wettermanipulation.',
    category: Category.PSEUDOSCIENCE,
    dangerLevel: DangerLevel.MEDIUM,
    popularity: 80,
    originYear: '1996',
    tags: ['Geo-Engineering', 'Regierung', 'Gift'],
    videoUrl: 'https://www.youtube.com/watch?v=3qJvK8_8_V4',
    relatedIds: ['t5', 't6', 't14', 't21', 't29']
  },
  {
    id: 't6',
    title: '5G Gedankenkontrolle',
    shortDescription: 'Mobilfunkstrahlung dient angeblich nicht der Kommunikation, sondern der Kontrolle oder Krankheitverbreitung.',
    category: Category.PSEUDOSCIENCE,
    dangerLevel: DangerLevel.MEDIUM,
    popularity: 60,
    originYear: '2019',
    tags: ['Technologie', 'Strahlung', 'Überwachung'],
    relatedIds: ['t2', 't14', 't22']
  },
  {
    id: 't11',
    title: 'Younger Dryas Impakt',
    shortDescription: 'Ein Kometeneinschlag vor ca. 12.800 Jahren löschte angeblich eine hochentwickelte, vergessene Zivilisation aus (Atlantis).',
    category: Category.PSEUDOSCIENCE,
    dangerLevel: DangerLevel.LOW,
    popularity: 75,
    originYear: '2000er (Hancock)',
    tags: ['Archäologie', 'Graham Hancock', 'Atlantis', 'Komet'],
    videoUrl: 'https://www.youtube.com/watch?v=l78s2s7xDwU',
    relatedIds: ['t10', 't12', 't19', 't51', 't56']
  },
  {
    id: 't12',
    title: 'Elektrisches Universum',
    shortDescription: 'Die Theorie, dass Elektrizität und Plasma, nicht Gravitation, die dominierenden Kräfte im Universum sind und Mythen Himmelsereignisse beschreiben.',
    category: Category.PSEUDOSCIENCE,
    dangerLevel: DangerLevel.LOW,
    popularity: 40,
    originYear: '1970er',
    tags: ['Physik', 'Velikovsky', 'Plasma', 'Kosmologie'],
    videoUrl: 'https://www.youtube.com/watch?v=2g3Yc7g7gEw',
    relatedIds: ['t11', 't50']
  },
  {
    id: 't19',
    title: 'Prä-Astronautik (Ancient Aliens)',
    shortDescription: 'Die Pyramiden und andere antike Monumente wurden angeblich von Außerirdischen gebaut, da frühe Menschen dazu nicht fähig waren.',
    category: Category.PSEUDOSCIENCE,
    dangerLevel: DangerLevel.LOW,
    popularity: 92,
    originYear: '1968 (Däniken)',
    tags: ['Aliens', 'Pyramiden', 'Erich von Däniken', 'Geschichte'],
    videoUrl: 'https://www.youtube.com/watch?v=k3t1q6Z7w7o',
    relatedIds: ['t3', 't11', 't17', 't51', 't39']
  },
  {
    id: 't21',
    title: 'HAARP',
    shortDescription: 'Eine Forschungseinrichtung in Alaska kontrolliert angeblich das Wetter, erzeugt Erdbeben oder beeinflusst das menschliche Bewusstsein.',
    category: Category.PSEUDOSCIENCE,
    dangerLevel: DangerLevel.MEDIUM,
    popularity: 70,
    originYear: '1990er',
    tags: ['Wetter', 'Militär', 'Erdbeben', 'Frequenz'],
    videoUrl: 'https://www.youtube.com/watch?v=3qJvK8_8_V4',
    relatedIds: ['t2', 't6', 't14']
  },
  {
    id: 't50',
    title: 'Der Gizeh-Todesstern',
    shortDescription: 'Joseph P. Farrells These: Die Große Pyramide war eine "phasenkonjugierte Haubitze", eine antike Plasma-Waffe, die in einem kosmischen Krieg eingesetzt wurde.',
    category: Category.PSEUDOSCIENCE,
    dangerLevel: DangerLevel.LOW,
    popularity: 55,
    originYear: '2001 (Buch)',
    tags: ['Physik', 'Waffe', 'Antike Technologie', 'Plasma', 'Farrell', 'Tesla'],
    videoUrl: '', 
    relatedIds: ['t19', 't12', 't21', 't11', 't39', 't55']
  },
  {
    id: 't51',
    title: 'Atlantis',
    shortDescription: 'Ein mystischer Kontinent, der laut Platon in einer einzigen Nacht im Meer versank. Oft als Ursprung aller Zivilisationen gedeutet.',
    category: Category.PSEUDOSCIENCE,
    dangerLevel: DangerLevel.LOW,
    popularity: 98,
    originYear: '360 v. Chr.',
    tags: ['Archäologie', 'Platon', 'Zivilisation', 'Meer'],
    relatedIds: ['t11', 't19', 't21', 't10', 't52']
  },
  {
    id: 't56',
    title: 'Polsprung (Erdkrustenverschiebung)',
    shortDescription: 'Die Theorie, dass sich die geografischen Pole der Erde katastrophal schnell verschieben und globale Zerstörung auslösen können.',
    category: Category.PSEUDOSCIENCE,
    dangerLevel: DangerLevel.LOW,
    popularity: 65,
    originYear: '1958 (Hapgood)',
    tags: ['Katastrophe', 'Geologie', 'Klima', 'Weltuntergang'],
    relatedIds: ['t1', 't11', 't28']
  },
  {
    id: 't66',
    title: 'Black Knight Satellit',
    shortDescription: 'Ein mysteriöses Objekt im polaren Orbit, das angeblich seit 13.000 Jahren die Erde überwacht und außerirdischen Ursprungs ist.',
    category: Category.PSEUDOSCIENCE,
    dangerLevel: DangerLevel.LOW,
    popularity: 62,
    originYear: '1950er',
    tags: ['Aliens', 'Weltraum', 'Tesla', 'NASA'],
    relatedIds: ['t17', 't19']
  },
  {
    id: 't69',
    title: 'Ley-Linien',
    shortDescription: 'Hypothetische Ausrichtungen von antiken Monumenten und geografischen Merkmalen, die angeblich Bahnen von Erdenergie darstellen.',
    category: Category.PSEUDOSCIENCE,
    dangerLevel: DangerLevel.LOW,
    popularity: 58,
    originYear: '1921',
    tags: ['Energie', 'Erde', 'Geografie', 'Esoterik'],
    relatedIds: ['t10', 't51']
  },
  {
    id: 't76',
    title: 'Wassergedächtnis',
    shortDescription: 'Die pseudowissenschaftliche Idee, dass Wasser Informationen über Substanzen speichert, mit denen es in Kontakt war (Basis der Homöopathie).',
    category: Category.PSEUDOSCIENCE,
    dangerLevel: DangerLevel.MEDIUM,
    popularity: 72,
    originYear: '1988 (Benveniste)',
    tags: ['Chemie', 'Gesundheit', 'Homöopathie', 'Wasser'],
    relatedIds: ['t29']
  }
];

export const PSEUDOSCIENCE_THEORIES_EN: Theory[] = [
  {
    id: 't1',
    title: 'Flat Earth',
    shortDescription: 'The belief that the Earth is a flat disk surrounded by an ice wall.',
    category: CategoryEn.PSEUDOSCIENCE,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 65,
    originYear: '19th C (Revival)',
    tags: ['NASA', 'Ice Wall', 'Gravity Lie'],
    videoUrl: 'https://www.youtube.com/watch?v=VNqNnUJVcVs',
    relatedIds: ['t4', 't10', 't56']
  },
  {
    id: 't2',
    title: 'Chemtrails',
    shortDescription: 'Aircraft contrails allegedly contain chemicals for mind control or weather manipulation.',
    category: CategoryEn.PSEUDOSCIENCE,
    dangerLevel: DangerLevelEn.MEDIUM,
    popularity: 80,
    originYear: '1996',
    tags: ['Geo-Engineering', 'Government', 'Poison'],
    videoUrl: 'https://www.youtube.com/watch?v=3qJvK8_8_V4',
    relatedIds: ['t5', 't6', 't14', 't21', 't29']
  },
  {
    id: 't6',
    title: '5G Mind Control',
    shortDescription: 'Mobile radiation is allegedly used for control or spreading disease rather than communication.',
    category: CategoryEn.PSEUDOSCIENCE,
    dangerLevel: DangerLevelEn.MEDIUM,
    popularity: 60,
    originYear: '2019',
    tags: ['Technology', 'Radiation', 'Surveillance'],
    relatedIds: ['t2', 't14', 't22']
  },
  {
    id: 't11',
    title: 'Younger Dryas Impact',
    shortDescription: 'A comet impact approx. 12,800 years ago allegedly wiped out an advanced, forgotten civilization (Atlantis).',
    category: CategoryEn.PSEUDOSCIENCE,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 75,
    originYear: '2000s (Hancock)',
    tags: ['Archaeology', 'Graham Hancock', 'Atlantis', 'Comet'],
    videoUrl: 'https://www.youtube.com/watch?v=l78s2s7xDwU',
    relatedIds: ['t10', 't12', 't19', 't51', 't56']
  },
  {
    id: 't12',
    title: 'Electric Universe',
    shortDescription: 'The theory that electricity and plasma, not gravity, are the dominant forces in the universe and myths describe celestial events.',
    category: CategoryEn.PSEUDOSCIENCE,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 40,
    originYear: '1970s',
    tags: ['Physics', 'Velikovsky', 'Plasma', 'Cosmology'],
    videoUrl: 'https://www.youtube.com/watch?v=2g3Yc7g7gEw',
    relatedIds: ['t11', 't50']
  },
  {
    id: 't19',
    title: 'Ancient Astronauts',
    shortDescription: 'Pyramids and other ancient monuments were allegedly built by extraterrestrials because early humans were incapable of doing so.',
    category: CategoryEn.PSEUDOSCIENCE,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 92,
    originYear: '1968 (Däniken)',
    tags: ['Aliens', 'Pyramids', 'Erich von Däniken', 'History'],
    videoUrl: 'https://www.youtube.com/watch?v=k3t1q6Z7w7o',
    relatedIds: ['t3', 't11', 't17', 't51', 't39']
  },
  {
    id: 't21',
    title: 'HAARP',
    shortDescription: 'A research facility in Alaska allegedly controls the weather, causes earthquakes, or influences human consciousness.',
    category: CategoryEn.PSEUDOSCIENCE,
    dangerLevel: DangerLevelEn.MEDIUM,
    popularity: 70,
    originYear: '1990s',
    tags: ['Weather', 'Military', 'Earthquake', 'Frequency'],
    videoUrl: 'https://www.youtube.com/watch?v=3qJvK8_8_V4',
    relatedIds: ['t2', 't6', 't14']
  },
  {
    id: 't50',
    title: 'Giza Death Star',
    shortDescription: 'Joseph P. Farrell\'s theory that the Great Pyramid was a "phase conjugate howitzer", an ancient plasma weapon used in a cosmic war.',
    category: CategoryEn.PSEUDOSCIENCE,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 55,
    originYear: '2001 (Book)',
    tags: ['Physics', 'Weapon', 'Ancient Tech', 'Plasma', 'Farrell'],
    videoUrl: '', 
    relatedIds: ['t19', 't12', 't21', 't11', 't39', 't55']
  },
  {
    id: 't51',
    title: 'Atlantis',
    shortDescription: 'A mythical continent that allegedly sank into the ocean in a single night. Often viewed as the progenitor of all civilizations.',
    category: CategoryEn.PSEUDOSCIENCE,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 98,
    originYear: '360 BC',
    tags: ['Archaeology', 'Plato', 'Civilization', 'Ocean'],
    relatedIds: ['t11', 't19', 't21', 't10', 't52']
  },
  {
    id: 't56',
    title: 'Pole Shift (Crustal Displacement)',
    shortDescription: 'The theory that the Earth\'s geographic poles can shift catastrophically fast, causing global destruction.',
    category: CategoryEn.PSEUDOSCIENCE,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 65,
    originYear: '1958 (Hapgood)',
    tags: ['Cataclysm', 'Geology', 'Climate', 'Doomsday'],
    relatedIds: ['t1', 't11', 't28']
  },
  {
    id: 't66',
    title: 'Black Knight Satellite',
    shortDescription: 'A mysterious object in polar orbit allegedly monitoring Earth for 13,000 years, claimed to be of extraterrestrial origin.',
    category: CategoryEn.PSEUDOSCIENCE,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 62,
    originYear: '1950s',
    tags: ['Aliens', 'Space', 'Tesla', 'NASA'],
    relatedIds: ['t17', 't19']
  },
  {
    id: 't69',
    title: 'Ley Lines',
    shortDescription: 'Hypothetical alignments of ancient monuments and geographical features believed to represent paths of earth energy.',
    category: CategoryEn.PSEUDOSCIENCE,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 58,
    originYear: '1921',
    tags: ['Energy', 'Earth', 'Geography', 'Esoteric'],
    relatedIds: ['t10', 't51']
  },
  {
    id: 't76',
    title: 'Water Memory',
    shortDescription: 'The pseudoscience idea that water retains a "memory" of substances previously dissolved in it (basis of homeopathy).',
    category: CategoryEn.PSEUDOSCIENCE,
    dangerLevel: DangerLevelEn.MEDIUM,
    popularity: 72,
    originYear: '1988 (Benveniste)',
    tags: ['Chemistry', 'Health', 'Homeopathy', 'Water'],
    relatedIds: ['t29']
  }
];