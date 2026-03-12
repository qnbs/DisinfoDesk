
import { Theory, Category, CategoryEn, DangerLevel, DangerLevelEn } from '../types';

export const PSEUDOSCIENCE_THEORIES_DE: Theory[] = [
  {
    id: 't1',
    title: 'Die flache Erde',
    shortDescription: 'Revival eines mittelalterlichen Missverständnisses: Erde als flache Scheibe mit Antarktis-Eiswand-„Rand". Trotz überwältigender Evidenz (Satellitendaten, Physik, Navigation) kulturell virulent durch YouTube-Algorithmen. Klassischer Dunning-Kruger-Fall mit naiver Empirismus-Ideologie.',
    category: Category.PSEUDOSCIENCE,
    dangerLevel: DangerLevel.LOW,
    popularity: 58,
    originYear: '19. Jh (Wiederaufleben)',
    tags: ['NASA', 'Eiswand', 'Schwerkraft-Lüge', 'Perspektive', 'Bedford Level', 'Eratosthenes', 'CGI', 'Firmament'],
    videoUrl: 'https://www.youtube.com/watch?v=VNqNnUJVcVs',
    relatedIds: ['t4', 't10', 't56', 't21', 't14', 't19']
  },
  {
    id: 't2',
    title: 'Chemtrails',
    shortDescription: 'Kondensstreifen als vermeintliches Geo-Engineering-Programm zur Bevölkerungsreduktion oder Gedankenkontrolle. Verwechselt Kondensation mit chemischer Dispersion. Trotz meteorologischer Aufklärung persistent durch visuelle Plausibilität („Himmel sieht komisch aus"). Mäßige Radikalisierung (Anti-Flugzeug-Aktivismus).',
    category: Category.PSEUDOSCIENCE,
    dangerLevel: DangerLevel.MEDIUM,
    popularity: 77,
    originYear: '1996',
    tags: ['Geo-Engineering', 'Regierung', 'Gift', 'Aluminium', 'Barium', 'Contrails', 'Wetterkontrolle', 'Operation Cloverleaf'],
    relatedIds: ['t5', 't6', 't14', 't21', 't29', 't64']
  },
  {
    id: 't6',
    title: '5G Gedankenkontrolle',
    shortDescription: '5G-Mobilfunk als Gedankenkontrolle-Vektor oder COVID-Auslöser. Technisch absurd (Mikrowellen ≠ Gedankenübertragung), aber kulturell mächtig (200+ UK-Sendemasten 2020 angezündet). Peaked 2019-2020, seit 2024 rückläufig durch normalisierte 5G-Allgegenwart. Verbindet Technophobie mit NWO-Ängsten.',
    category: Category.PSEUDOSCIENCE,
    dangerLevel: DangerLevel.LOW,
    popularity: 52,
    originYear: '2019',
    tags: ['Technologie', 'Strahlung', 'Überwachung', 'COVID-19', 'Mikrowellen', 'Frequenz', 'Wuhan', 'Sendemasten'],
    relatedIds: ['t2', 't14', 't22', 't47', 't20']
  },
  {
    id: 't11',
    title: 'Younger Dryas Impakt',
    shortDescription: 'Graham Hancocks Hypothese einer Komet-zerstörten Hochzivilisation (12.800 BP) zur Erklärung megalithischer Architektur. Enthält legitime Debatte (YD-Boundary-Layer), aber spekuliert weit über Datenlage (keine Zivilisations-Fossilien). Netflix-Mainstream via „Ancient Apocalypse". Wissenschaftlich dubios, kulturell einflussreich.',
    category: Category.PSEUDOSCIENCE,
    dangerLevel: DangerLevel.LOW,
    popularity: 79,
    originYear: '2000er (Hancock)',
    tags: ['Archäologie', 'Graham Hancock', 'Atlantis', 'Komet', 'Göbekli Tepe', 'Younger Dryas', 'Randall Carlson', 'Black Mat'],
    videoUrl: 'https://www.youtube.com/watch?v=l78s2s7xDwU',
    relatedIds: ['t10', 't12', 't19', 't51', 't56', 't50', 't39']
  },
  {
    id: 't12',
    title: 'Elektrisches Universum',
    shortDescription: 'Velikovsky-inspirierte Kosmologie: Elektromagnetismus statt Gravitation als dominierende kosmische Kraft, erklärt Mythen als Plasma-Ereignisse. Widerspricht fundamentaler Physik (keine Peer-Review-Akzeptanz seit 50 Jahren). Faszination durch alternative Erklärungen für Sonnenprozesse. Nischenpublikum, wissenschaftlich irrelevant.',
    category: Category.PSEUDOSCIENCE,
    dangerLevel: DangerLevel.LOW,
    popularity: 38,
    originYear: '1970er',
    tags: ['Physik', 'Velikovsky', 'Plasma', 'Kosmologie', 'Immanuel Velikovsky', 'Thunderbolts Project', 'Z-Pinch'],
    videoUrl: 'https://www.youtube.com/watch?v=2g3Yc7g7gEw',
    relatedIds: ['t11', 't50', 't56']
  },
  {
    id: 't19',
    title: 'Prä-Astronautik (Ancient Aliens)',
    shortDescription: 'Erich von Dänikens postkoloniale Denkfaulheit: Nicht-europäische Megalithen (Pyramiden, Nazca, Moai) „müssen" von Aliens stammen, da indigene Völker „zu primitiv" waren. Ignoriert archäologische Arbeitsnachweise. Netflix-Serie fixierte Pop-Kultur-Ikonografie („Aliens-Guy"-Meme). Intellektuell harmlos, kulturell herablassend.',
    category: Category.PSEUDOSCIENCE,
    dangerLevel: DangerLevel.LOW,
    popularity: 88,
    originYear: '1968 (Däniken)',
    tags: ['Aliens', 'Pyramiden', 'Erich von Däniken', 'Geschichte', 'Nazca', 'Moai', 'Baalbek', 'Göbekli Tepe', 'Giorgio Tsoukalos'],
    videoUrl: 'https://www.youtube.com/watch?v=k3t1q6Z7w7o',
    relatedIds: ['t3', 't11', 't17', 't51', 't39', 't50', 't66']
  },
  {
    id: 't21',
    title: 'HAARP',
    shortDescription: 'Ionosphären-Forschungsanlage in Alaska als Superwaffe umgedeutet: angeblich Wetter-/Erdbebenkontrolle, Gedankenmanipulation. Technisch übertrieben (3,6 MW Leistung ≈ Radiosender), symbolisch mächtig (sichtbare Antennen-Arrays). Prototyp der Geo-Engineering-Angst, Vorbild für 5G/Chemtrails-Narrative.',
    category: Category.PSEUDOSCIENCE,
    dangerLevel: DangerLevel.MEDIUM,
    popularity: 68,
    originYear: '1990er',
    tags: ['Wetter', 'Militär', 'Erdbeben', 'Frequenz', 'Ionosphäre', 'ELF', 'Tesla', 'Nick Begich', 'Geo-Engineering'],
    relatedIds: ['t2', 't6', 't14', 't22', 't47']
  },
  {
    id: 't50',
    title: 'Der Gizeh-Todesstern',
    shortDescription: 'Joseph P. Farrells techno-mystische These: Große Pyramide als „phasenkonjugierte Haubitze" – antike Plasmawaffe für kosmische Kriege. Mischt Festkörperphysik-Jargon mit Däniken-Spekulation. Null archäologische Evidenz für Waffensysteme. Prototyp für „Antike Hochtechnologie"-Genre. Nischenpublikum, Fringe-Physik.',
    category: Category.PSEUDOSCIENCE,
    dangerLevel: DangerLevel.LOW,
    popularity: 52,
    originYear: '2001 (Buch)',
    tags: ['Physik', 'Waffe', 'Antike Technologie', 'Plasma', 'Farrell', 'Tesla', 'Pyramide', 'Phase-Conjugation'],
    videoUrl: '', 
    relatedIds: ['t19', 't12', 't21', 't11', 't39', 't55', 't69']
  },
  {
    id: 't51',
    title: 'Atlantis',
    shortDescription: 'Platons politische Allegorie (Timaios/Kritias 360 v.Chr.) über Hybris, als reale Zivilisation fehlinterpretiert. Pseudoarchäologen lokalisieren es beliebig (Santorini, Antarktis, Bahamas), ignorieren null archäologische Evidenz. Theosophie (Blavatsky) mystifizierte Atlantis als „Wurzelrasse". #1 Gateway-Theorie: harmlos, populär, romantisch.',
    category: Category.PSEUDOSCIENCE,
    dangerLevel: DangerLevel.LOW,
    popularity: 95,
    originYear: '360 v. Chr.',
    tags: ['Archäologie', 'Platon', 'Zivilisation', 'Meer', 'Santorini', 'Bimini Road', 'Helena Blavatsky', 'Ignatius Donnelly', 'Edgar Cayce'],
    relatedIds: ['t11', 't19', 't21', 't10', 't52', 't56', 't39', 't69']
  },
  {
    id: 't56',
    title: 'Polsprung (Erdkrustenverschiebung)',
    shortDescription: 'Charles Hapgoods Hypothese (1958, Einstein-endorsed) einer rapiden Lithosphären-Rotation über Asthenosphäre. Erklärt angeblich Mammut-Funde in Permafrost und Polwanderung. Geologisch widerlegt (Plattentektonik erklärt langsame Drift). 2012-Weltuntergangswelle reaktivierte Interesse. Apokalyptisches Potenzial, wissenschaftlich obsolet.',
    category: Category.PSEUDOSCIENCE,
    dangerLevel: DangerLevel.LOW,
    popularity: 63,
    originYear: '1958 (Hapgood)',
    tags: ['Katastrophe', 'Geologie', 'Klima', 'Weltuntergang', 'Charles Hapgood', 'Albert Einstein', 'Plattentektonik', '2012'],
    relatedIds: ['t1', 't11', 't28', 't51', 't12']
  },
  {
    id: 't66',
    title: 'Black Knight Satellit',
    shortDescription: 'NASA-Weltraumschrott-Foto (1998, STS-88-Hitzeschild-Decke) als  alien-Überwachungssatellit (13.000 Jahre alt!) umgedeutet. Vereint Tesla-Radiowellen-Beobachtungen (1899), unidentifizierte Orbit-Objekte (1950er) und Paranoia. Visuelle Fehlinterpretation + mythologische Rückprojektion. Harmlose Sci-Fi-Ästhetik.',
    category: Category.PSEUDOSCIENCE,
    dangerLevel: DangerLevel.LOW,
    popularity: 59,
    originYear: '1950er',
    tags: ['Aliens', 'Weltraum', 'Tesla', 'NASA', 'STS-88', 'Polar Orbit', 'Thermal Blanket', 'Nikola Tesla'],
    relatedIds: ['t17', 't19', 't13', 't51']
  },
  {
    id: 't69',
    title: 'Ley-Linien',
    shortDescription: 'Alfred Watkins\' (1921) Beobachtung gerader Landschafts-Alignments von Menhiren, Kirchen, Hügeln. Archäologisch Zufall + Bestätigungsfehler (unendlich viele Linien durch beliebige Punkte ziehbar). New-Age-Bewegung deutete Linien als „Erdenergie-Kanäle". Harmlose Geomantie, nährt „Sacred Geometry"-Ästhetik.',
    category: Category.PSEUDOSCIENCE,
    dangerLevel: DangerLevel.LOW,
    popularity: 55,
    originYear: '1921',
    tags: ['Energie', 'Erde', 'Geografie', 'Esoterik', 'Alfred Watkins', 'Geomantie', 'Sacred Geometry', 'Dragon Lines'],
    relatedIds: ['t10', 't51', 't76', 't50']
  },
  {
    id: 't76',
    title: 'Wassergedächtnis',
    shortDescription: 'Jacques Benvenistes diskreditierte Nature-Studie (1988): Wasser speichere Molekül-„Informationen" trotz Verdünnung unter Avogadro-Konstante. Immunologe Basis für Homöopathie-Apologetik. Von James Randi/Nature investigativ widerlegt. Kulturelle Resilienz durch esoterische Wellness-Industrie. Finanziell schädlich (verzögerte Medizin).',
    category: Category.PSEUDOSCIENCE,
    dangerLevel: DangerLevel.MEDIUM,
    popularity: 69,
    originYear: '1988 (Benveniste)',
    tags: ['Chemie', 'Gesundheit', 'Homöopathie', 'Wasser', 'Jacques Benveniste', 'Avogadro', 'James Randi', 'Masaru Emoto'],
    relatedIds: ['t29', 't69']
  }
];

export const PSEUDOSCIENCE_THEORIES_EN: Theory[] = [
  {
    id: 't1',
    title: 'Flat Earth',
    shortDescription: 'Revival of a medieval misunderstanding: Earth as flat disk with Antarctic ice wall "edge". Despite overwhelming evidence (satellite data, physics, navigation), culturally virulent through YouTube algorithms. Classic Dunning-Kruger case with naive empiricism ideology.',
    category: CategoryEn.PSEUDOSCIENCE,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 58,
    originYear: '19th C (Revival)',
    tags: ['NASA', 'Ice Wall', 'Gravity Lie', 'Perspective', 'Bedford Level', 'Eratosthenes', 'CGI', 'Firmament'],
    videoUrl: 'https://www.youtube.com/watch?v=VNqNnUJVcVs',
    relatedIds: ['t4', 't10', 't56', 't21', 't14', 't19']
  },
  {
    id: 't2',
    title: 'Chemtrails',
    shortDescription: 'Contrails as alleged geoengineering program for population reduction or mind control. Confuses condensation with chemical dispersion. Despite meteorological clarification, persistent through visual plausibility ("sky looks weird"). Moderate radicalization (anti-aircraft activism).',
    category: CategoryEn.PSEUDOSCIENCE,
    dangerLevel: DangerLevelEn.MEDIUM,
    popularity: 77,
    originYear: '1996',
    tags: ['Geo-Engineering', 'Government', 'Poison', 'Aluminum', 'Barium', 'Contrails', 'Weather Control', 'Operation Cloverleaf'],
    relatedIds: ['t5', 't6', 't14', 't21', 't29', 't64']
  },
  {
    id: 't6',
    title: '5G Mind Control',
    shortDescription: '5G mobile network as mind control vector or COVID trigger. Technically absurd (microwaves ≠ thought transmission), but culturally powerful (200+ UK cell towers torched 2020). Peaked 2019-2020, declining since 2024 through normalized 5G ubiquity. Combines technophobia with NWO fears.',
    category: CategoryEn.PSEUDOSCIENCE,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 52,
    originYear: '2019',
    tags: ['Technology', 'Radiation', 'Surveillance', 'COVID-19', 'Microwaves', 'Frequency', 'Wuhan', 'Cell Towers'],
    relatedIds: ['t2', 't14', 't22', 't47', 't20']
  },
  {
    id: 't11',
    title: 'Younger Dryas Impact',
    shortDescription: 'Graham Hancock\'s hypothesis of a comet-destroyed advanced civilization (12,800 BP) explaining megalithic architecture. Contains legitimate debate (YD Boundary Layer) but speculates far beyond data (no civilization fossils). Netflix mainstream via "Ancient Apocalypse". Scientifically dubious, culturally influential.',
    category: CategoryEn.PSEUDOSCIENCE,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 79,
    originYear: '2000s (Hancock)',
    tags: ['Archaeology', 'Graham Hancock', 'Atlantis', 'Comet', 'Göbekli Tepe', 'Younger Dryas', 'Randall Carlson', 'Black Mat'],
    videoUrl: 'https://www.youtube.com/watch?v=l78s2s7xDwU',
    relatedIds: ['t10', 't12', 't19', 't51', 't56', 't50', 't39']
  },
  {
    id: 't12',
    title: 'Electric Universe',
    shortDescription: 'Velikovsky-inspired cosmology: electromagnetism instead of gravity as dominant cosmic force, explains myths as plasma events. Contradicts fundamental physics (no peer-review acceptance for 50 years). Fascination through alternative solar process explanations. Niche audience, scientifically irrelevant.',
    category: CategoryEn.PSEUDOSCIENCE,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 38,
    originYear: '1970s',
    tags: ['Physics', 'Velikovsky', 'Plasma', 'Cosmology', 'Immanuel Velikovsky', 'Thunderbolts Project', 'Z-Pinch'],
    videoUrl: 'https://www.youtube.com/watch?v=2g3Yc7g7gEw',
    relatedIds: ['t11', 't50', 't56']
  },
  {
    id: 't19',
    title: 'Ancient Astronauts',
    shortDescription: 'Erich von Däniken\'s postcolonial intellectual laziness: non-European megaliths (pyramids, Nazca, Moai) "must" be alien-made because indigenous peoples were "too primitive". Ignores archaeological labor evidence. Netflix series solidified pop-culture iconography ("Aliens Guy" meme). Intellectually harmless, culturally condescending.',
    category: CategoryEn.PSEUDOSCIENCE,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 88,
    originYear: '1968 (Däniken)',
    tags: ['Aliens', 'Pyramids', 'Erich von Däniken', ' History', 'Nazca', 'Moai', 'Baalbek', 'Göbekli Tepe', 'Giorgio Tsoukalos'],
    videoUrl: 'https://www.youtube.com/watch?v=k3t1q6Z7w7o',
    relatedIds: ['t3', 't11', 't17', 't51', 't39', 't50', 't66']
  },
  {
    id: 't21',
    title: 'HAARP',
    shortDescription: 'Ionosphere research facility in Alaska reinterpreted as superweapon: allegedly weather/earthquake control, mind manipulation. Technically exaggerated (3.6 MW power ≈ radio station), symbolically powerful (visible antenna arrays). Prototype of geoengineering fear, template for 5G/chemtrails narratives.',
    category: CategoryEn.PSEUDOSCIENCE,
    dangerLevel: DangerLevelEn.MEDIUM,
    popularity: 68,
    originYear: '1990s',
    tags: ['Weather', 'Military', 'Earthquake', 'Frequency', 'Ionosphere', 'ELF', 'Tesla', 'Nick Begich', 'Geo-Engineering'],
    relatedIds: ['t2', 't6', 't14', 't22', 't47']
  },
  {
    id: 't50',
    title: 'Giza Death Star',
    shortDescription: 'Joseph P. Farrell\'s techno-mystical thesis: Great Pyramid as "phase-conjugate howitzer" – ancient plasma weapon for cosmic wars. Mixes solid-state physics jargon with Däniken speculation. Zero archaeological evidence for weapon systems. Prototype for "Ancient High-Tech" genre. Niche audience, fringe physics.',
    category: CategoryEn.PSEUDOSCIENCE,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 52,
    originYear: '2001 (Book)',
    tags: ['Physics', 'Weapon', 'Ancient Tech', 'Plasma', 'Farrell', 'Tesla', 'Pyramid', 'Phase-Conjugation'],
    videoUrl: '', 
    relatedIds: ['t19', 't12', 't21', 't11', 't39', 't55', 't69']
  },
  {
    id: 't51',
    title: 'Atlantis',
    shortDescription: 'Plato\'s political allegory (Timaeus/Critias 360 BCE) about hubris, misinterpreted as real civilization. Pseudo-archaeologists localize it arbitrarily (Santorini, Antarctica, Bahamas), ignore zero archaeological evidence. Theosophy (Blavatsky) mystified Atlantis as "Root Race". #1 gateway theory: harmless, popular, romantic.',
    category: CategoryEn.PSEUDOSCIENCE,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 95,
    originYear: '360 BC',
    tags: ['Archaeology', 'Plato', 'Civilization', 'Ocean', 'Santorini', 'Bimini Road', 'Helena Blavatsky', 'Ignatius Donnelly', 'Edgar Cayce'],
    relatedIds: ['t11', 't19', 't21', 't10', 't52', 't56', 't39', 't69']
  },
  {
    id: 't56',
    title: 'Pole Shift (Crustal Displacement)',
    shortDescription: 'Charles Hapgood\'s hypothesis (1958, Einstein-endorsed) of rapid lithosphere rotation over asthenosphere. Allegedly explains mammoth permafrost finds and polar wandering. Geologically refuted (plate tectonics explains slow drift). 2012 doomsday wave reactivated interest. Apocalyptic potential, scientifically obsolete.',
    category: CategoryEn.PSEUDOSCIENCE,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 63,
    originYear: '1958 (Hapgood)',
    tags: ['Cataclysm', 'Geology', 'Climate', 'Doomsday', 'Charles Hapgood', 'Albert Einstein', 'Plate Tectonics', '2012'],
    relatedIds: ['t1', 't11', 't28', 't51', 't12']
  },
  {
    id: 't66',
    title: 'Black Knight Satellite',
    shortDescription: 'NASA space debris photo (1998, STS-88 heat shield blanket) reinterpreted as alien surveillance satellite (13,000 years old!). Combines Tesla radio wave observations (1899), unidentified orbit objects (1950s), and paranoia. Visual misinterpretation + mythological back-projection. Harmless sci-fi aesthetics.',
    category: CategoryEn.PSEUDOSCIENCE,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 59,
    originYear: '1950s',
    tags: ['Aliens', 'Space', 'Tesla', 'NASA', 'STS-88', 'Polar Orbit', 'Thermal Blanket', 'Nikola Tesla'],
    relatedIds: ['t17', 't19', 't13', 't51']
  },
  {
    id: 't69',
    title: 'Ley Lines',
    shortDescription: 'Alfred Watkins\' (1921) observation of straight landscape alignments of menhirs, churches, hills. Archaeologically coincidence + confirmation bias (infinitely many lines drawable through arbitrary points). New Age movement interpreted lines as "earth energy channels". Harmless geomancy, nourishes "Sacred Geometry" aesthetics.',
    category: CategoryEn.PSEUDOSCIENCE,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 55,
    originYear: '1921',
    tags: ['Energy', 'Earth', 'Geography', 'Esoteric', 'Alfred Watkins', 'Geomancy', 'Sacred Geometry', 'Dragon Lines'],
    relatedIds: ['t10', 't51', 't76', 't50']
  },
  {
    id: 't76',
    title: 'Water Memory',
    shortDescription: 'Jacques Benveniste\'s discredited Nature study (1988): water stores molecular "information" despite dilution below Avogadro constant. Immunologist basis for homeopathy apologetics. Investigatively refuted by James Randi/Nature. Cultural resilience through esoteric wellness industry. Financially harmful (delayed medicine).',
    category: CategoryEn.PSEUDOSCIENCE,
    dangerLevel: DangerLevelEn.MEDIUM,
    popularity: 69,
    originYear: '1988 (Benveniste)',
    tags: ['Chemistry', 'Health', 'Homeopathy', 'Water', 'Jacques Benveniste', 'Avogadro', 'James Randi', 'Masaru Emoto'],
    relatedIds: ['t29', 't69']
  }
];