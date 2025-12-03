
import { Theory, Category, CategoryEn, DangerLevel, DangerLevelEn } from '../types';

export const MODERN_MYTHS_THEORIES_DE: Theory[] = [
  {
    id: 't8',
    title: 'Bielefeld-Verschwörung',
    shortDescription: 'Die satirische Theorie, dass die Stadt Bielefeld gar nicht existiert.',
    category: Category.MODERN_MYTHS,
    dangerLevel: DangerLevel.LOW,
    popularity: 95,
    originYear: '1994',
    tags: ['Satire', 'Deutschland', 'Internet'],
    relatedIds: ['t23']
  },
  {
    id: 't13',
    title: 'Majestic 12 (MJ-12)',
    shortDescription: 'Ein angebliches Geheimkomitee aus Wissenschaftlern und Militärs, gegründet von Harry S. Truman, um UFO-Bergungen zu vertuschen.',
    category: Category.MODERN_MYTHS,
    dangerLevel: DangerLevel.MEDIUM,
    popularity: 60,
    originYear: '1984',
    tags: ['UFO', 'Regierung', 'Dokumente', 'Vertuschung'],
    relatedIds: ['t17', 't3', 't4', 't15', 't19', 't37']
  },
  {
    id: 't17',
    title: 'Roswell-Zwischenfall',
    shortDescription: 'Der Absturz von 1947 war kein Wetterballon, sondern ein außerirdisches Raumschiff, dessen Insassen in Area 51 untersucht wurden.',
    category: Category.MODERN_MYTHS,
    dangerLevel: DangerLevel.LOW,
    popularity: 98,
    originYear: '1947',
    tags: ['UFO', 'Aliens', 'Area 51', 'Militär'],
    videoUrl: 'https://www.youtube.com/watch?v=P210Y0d4JXM',
    relatedIds: ['t13', 't3', 't19', 't37', 't42']
  },
  {
    id: 't23',
    title: 'Vögel sind nicht real',
    shortDescription: 'Eine satirische Bewegung, die behauptet, die US-Regierung habe alle Vögel durch Überwachungsdrohnen ersetzt.',
    category: Category.MODERN_MYTHS,
    dangerLevel: DangerLevel.LOW,
    popularity: 80,
    originYear: '2017',
    tags: ['Satire', 'Überwachung', 'Internetkultur', 'Drohnen'],
    videoUrl: 'https://www.youtube.com/watch?v=3qJvK8_8_V4', 
    relatedIds: ['t8', 't6']
  },
  {
    id: 't25',
    title: 'Denver International Airport',
    shortDescription: 'Der Flughafen Denver ist angeblich ein geheimes Hauptquartier der NWO, voll mit freimaurerischen Symbolen und Bunkern.',
    category: Category.MODERN_MYTHS,
    dangerLevel: DangerLevel.MEDIUM,
    popularity: 60,
    originYear: '1994',
    tags: ['Flughafen', 'Freimaurer', 'NWO', 'Bunker'],
    videoUrl: 'https://www.youtube.com/watch?v=833Yi0yvOJI',
    relatedIds: ['t5', 't3', 't34']
  },
  {
    id: 't27',
    title: 'Paul is Dead',
    shortDescription: 'Paul McCartney starb 1966 bei einem Autounfall und wurde durch einen Doppelgänger ersetzt. Die Beatles versteckten Hinweise.',
    category: Category.MODERN_MYTHS,
    dangerLevel: DangerLevel.LOW,
    popularity: 85,
    originYear: '1969',
    tags: ['Musik', 'Beatles', 'Doppelgänger', 'Popkultur'],
    videoUrl: 'https://www.youtube.com/watch?v=3qJvK8_8_V4',
    relatedIds: ['t4']
  },
  {
    id: 't31',
    title: 'Bigfoot (Sasquatch)',
    shortDescription: 'Ein großer, affenähnlicher Hominide, der angeblich in den Wäldern Nordamerikas lebt und sich der Entdeckung entzieht.',
    category: Category.MODERN_MYTHS,
    dangerLevel: DangerLevel.LOW,
    popularity: 90,
    originYear: '1958',
    tags: ['Kryptozoologie', 'USA', 'Hominide', 'Natur'],
    videoUrl: 'https://www.youtube.com/watch?v=3qJvK8_8_V4',
    relatedIds: ['t32', 't33']
  },
  {
    id: 't32',
    title: 'Monster von Loch Ness',
    shortDescription: 'Nessie, ein überlebender Plesiosaurier oder großes Wassertier, bewohnt angeblich den schottischen Loch Ness.',
    category: Category.MODERN_MYTHS,
    dangerLevel: DangerLevel.LOW,
    popularity: 92,
    originYear: '1933',
    tags: ['Kryptozoologie', 'Schottland', 'Dinosaurier', 'Wasser'],
    videoUrl: 'https://www.youtube.com/watch?v=3qJvK8_8_V4',
    relatedIds: ['t31', 't33']
  },
  {
    id: 't33',
    title: 'Der Yeti',
    shortDescription: 'Der "Schneemensch" ist ein Wesen im Himalaya, das Teil der tibetischen Mythologie und moderner Expeditionen ist.',
    category: Category.MODERN_MYTHS,
    dangerLevel: DangerLevel.LOW,
    popularity: 85,
    originYear: '19. Jh',
    tags: ['Kryptozoologie', 'Himalaya', 'Schnee', 'Mythologie'],
    relatedIds: ['t31', 't10']
  },
  {
    id: 't37',
    title: 'Die Greys (Zeta Reticuli)',
    shortDescription: 'Die archetypischen Aliens (klein, grau, große Augen), bekannt für Entführungen und genetische Experimente.',
    category: Category.MODERN_MYTHS,
    dangerLevel: DangerLevel.MEDIUM,
    popularity: 95,
    originYear: '1961 (Hill)',
    tags: ['Aliens', 'Entführung', 'UFO', 'Exobiologie'],
    relatedIds: ['t17', 't13', 't3', 't41']
  },
  {
    id: 't41',
    title: 'Men In Black (MIB)',
    shortDescription: 'Mysteriöse Regierungsagenten in schwarzen Anzügen, die Zeugen von UFO-Sichtungen einschüchtern oder zum Schweigen bringen.',
    category: Category.MODERN_MYTHS,
    dangerLevel: DangerLevel.LOW,
    popularity: 92,
    originYear: '1953 (Barker)',
    tags: ['UFO', 'Regierung', 'Geheimagenten', 'Popkultur'],
    relatedIds: ['t13', 't17', 't37']
  },
  {
    id: 't42',
    title: 'Area 51 (Groom Lake)',
    shortDescription: 'Eine hochgeheime US-Militärbasis in Nevada, in der angeblich außerirdische Technologie zurückentwickelt (Reverse Engineering) wird.',
    category: Category.MODERN_MYTHS,
    dangerLevel: DangerLevel.LOW,
    popularity: 99,
    originYear: '1955/1989',
    tags: ['Militär', 'Aliens', 'Technologie', 'Geheim'],
    videoUrl: 'https://www.youtube.com/watch?v=3qJvK8_8_V4',
    relatedIds: ['t17', 't13', 't4']
  },
  {
    id: 't44',
    title: 'Philadelphia Experiment',
    shortDescription: 'Ein angebliches Experiment der US Navy (Project Rainbow) 1943, bei dem die USS Eldridge unsichtbar gemacht und teleportiert wurde.',
    category: Category.MODERN_MYTHS,
    dangerLevel: DangerLevel.LOW,
    popularity: 80,
    originYear: '1955',
    tags: ['Militär', 'Teleportation', 'Physik', 'Zeitreise'],
    relatedIds: ['t12', 't15', 't52']
  },
  {
    id: 't52',
    title: 'Das Bermuda-Dreieck',
    shortDescription: 'Eine Region im Atlantik, in der Schiffe und Flugzeuge angeblich unter mysteriösen Umständen verschwinden.',
    category: Category.MODERN_MYTHS,
    dangerLevel: DangerLevel.LOW,
    popularity: 95,
    originYear: '1950',
    tags: ['Ozean', 'Verschwinden', 'Magnetismus', 'Aliens'],
    relatedIds: ['t51', 't44', 't10']
  },
  {
    id: 't55',
    title: 'Tunguska-Ereignis',
    shortDescription: 'Eine massive Explosion 1908 in Sibirien. Theorien reichen von einem Meteoriten bis zu Tesla-Waffen oder einem UFO-Absturz.',
    category: Category.MODERN_MYTHS,
    dangerLevel: DangerLevel.LOW,
    popularity: 82,
    originYear: '1908',
    tags: ['Russland', 'Explosion', 'Tesla', 'UFO'],
    relatedIds: ['t11', 't17']
  }
];

export const MODERN_MYTHS_THEORIES_EN: Theory[] = [
  {
    id: 't8',
    title: 'Bielefeld Conspiracy',
    shortDescription: 'The satirical theory that the German city of Bielefeld does not actually exist.',
    category: CategoryEn.MODERN_MYTHS,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 95,
    originYear: '1994',
    tags: ['Satire', 'Germany', 'Internet'],
    relatedIds: ['t23']
  },
  {
    id: 't13',
    title: 'Majestic 12 (MJ-12)',
    shortDescription: 'An alleged secret committee of scientists and military officials formed by Harry S. Truman to cover up UFO recoveries.',
    category: CategoryEn.MODERN_MYTHS,
    dangerLevel: DangerLevelEn.MEDIUM,
    popularity: 60,
    originYear: '1984',
    tags: ['UFO', 'Government', 'Documents', 'Cover-up'],
    relatedIds: ['t17', 't3', 't4', 't15', 't19', 't37']
  },
  {
    id: 't17',
    title: 'Roswell Incident',
    shortDescription: 'The 1947 crash was not a weather balloon, but an extraterrestrial spacecraft whose occupants were studied at Area 51.',
    category: CategoryEn.MODERN_MYTHS,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 98,
    originYear: '1947',
    tags: ['UFO', 'Aliens', 'Area 51', 'Military'],
    videoUrl: 'https://www.youtube.com/watch?v=P210Y0d4JXM',
    relatedIds: ['t13', 't3', 't19', 't37', 't42']
  },
  {
    id: 't23',
    title: 'Birds Aren\'t Real',
    shortDescription: 'A satirical movement claiming the US government replaced all birds with surveillance drones.',
    category: CategoryEn.MODERN_MYTHS,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 80,
    originYear: '2017',
    tags: ['Satire', 'Surveillance', 'Internet Culture', 'Drones'],
    relatedIds: ['t8', 't6']
  },
  {
    id: 't25',
    title: 'Denver International Airport',
    shortDescription: 'Denver Airport is allegedly a secret headquarters of the NWO, filled with Masonic symbols and bunkers.',
    category: CategoryEn.MODERN_MYTHS,
    dangerLevel: DangerLevelEn.MEDIUM,
    popularity: 60,
    originYear: '1994',
    tags: ['Airport', 'Freemasons', 'NWO', 'Bunkers'],
    videoUrl: 'https://www.youtube.com/watch?v=833Yi0yvOJI',
    relatedIds: ['t5', 't3', 't34']
  },
  {
    id: 't27',
    title: 'Paul is Dead',
    shortDescription: 'Paul McCartney died in a car crash in 1966 and was replaced by a look-alike. The Beatles hid clues in songs.',
    category: CategoryEn.MODERN_MYTHS,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 85,
    originYear: '1969',
    tags: ['Music', 'Beatles', 'Look-alike', 'Pop Culture'],
    relatedIds: ['t4']
  },
  {
    id: 't31',
    title: 'Bigfoot (Sasquatch)',
    shortDescription: 'A large, ape-like hominid allegedly living in the forests of North America, evading discovery.',
    category: CategoryEn.MODERN_MYTHS,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 90,
    originYear: '1958',
    tags: ['Cryptozoology', 'USA', 'Hominid', 'Nature'],
    relatedIds: ['t32', 't33']
  },
  {
    id: 't32',
    title: 'Loch Ness Monster',
    shortDescription: 'Nessie, a surviving plesiosaur or large aquatic animal, allegedly inhabits Loch Ness in Scotland.',
    category: CategoryEn.MODERN_MYTHS,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 92,
    originYear: '1933',
    tags: ['Cryptozoology', 'Scotland', 'Dinosaur', 'Water'],
    relatedIds: ['t31', 't33']
  },
  {
    id: 't33',
    title: 'The Yeti',
    shortDescription: 'The "Abominable Snowman" is an entity in the Himalayas, part of Tibetan mythology and modern expeditions.',
    category: CategoryEn.MODERN_MYTHS,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 85,
    originYear: '19th C',
    tags: ['Cryptozoology', 'Himalayas', 'Snow', 'Mythology'],
    relatedIds: ['t31', 't10']
  },
  {
    id: 't37',
    title: 'The Greys (Zeta Reticuli)',
    shortDescription: 'The archetypal aliens (small, gray, big eyes), known for abductions and genetic experiments.',
    category: CategoryEn.MODERN_MYTHS,
    dangerLevel: DangerLevelEn.MEDIUM,
    popularity: 95,
    originYear: '1961 (Hill)',
    tags: ['Aliens', 'Abduction', 'UFO', 'Exobiology'],
    relatedIds: ['t17', 't13', 't3', 't41']
  },
  {
    id: 't41',
    title: 'Men In Black (MIB)',
    shortDescription: 'Mysterious government agents in black suits who intimidate or silence witnesses of UFO sightings.',
    category: CategoryEn.MODERN_MYTHS,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 92,
    originYear: '1953 (Barker)',
    tags: ['UFO', 'Government', 'Secret Agents', 'Pop Culture'],
    relatedIds: ['t13', 't17', 't37']
  },
  {
    id: 't42',
    title: 'Area 51 (Groom Lake)',
    shortDescription: 'A highly classified US military base in Nevada where alien technology is allegedly being reverse-engineered.',
    category: CategoryEn.MODERN_MYTHS,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 99,
    originYear: '1955/1989',
    tags: ['Military', 'Aliens', 'Technology', 'Secret'],
    videoUrl: 'https://www.youtube.com/watch?v=3qJvK8_8_V4',
    relatedIds: ['t17', 't13', 't4']
  },
  {
    id: 't44',
    title: 'Philadelphia Experiment',
    shortDescription: 'An alleged US Navy experiment (Project Rainbow) in 1943 in which the USS Eldridge was rendered invisible and teleported.',
    category: CategoryEn.MODERN_MYTHS,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 80,
    originYear: '1955',
    tags: ['Military', 'Teleportation', 'Physics', 'Time Travel'],
    relatedIds: ['t12', 't15', 't52']
  },
  {
    id: 't52',
    title: 'Bermuda Triangle',
    shortDescription: 'A region in the Atlantic where ships and planes allegedly disappear under mysterious circumstances.',
    category: CategoryEn.MODERN_MYTHS,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 95,
    originYear: '1950',
    tags: ['Ocean', 'Disappearances', 'Magnetism', 'Aliens'],
    relatedIds: ['t51', 't44', 't10']
  },
  {
    id: 't55',
    title: 'Tunguska Event',
    shortDescription: 'A massive explosion in Siberia in 1908. Theories range from a meteorite to Tesla weapons or a UFO crash.',
    category: CategoryEn.MODERN_MYTHS,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 82,
    originYear: '1908',
    tags: ['Russia', 'Explosion', 'Tesla', 'UFO'],
    relatedIds: ['t11', 't17']
  }
];
