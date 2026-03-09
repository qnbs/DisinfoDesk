
import { Theory, Category, CategoryEn, DangerLevel, DangerLevelEn } from '../types';

export const GEOPOLITICS_THEORIES_DE: Theory[] = [
  {
    id: 't5',
    title: 'New World Order (NWO)',
    shortDescription: 'Ur-Narrativ globalistischer Verschwörung: Eine schattenhafte Elite orchestriere supranationale Institutionen (UN, WEF, EU) zur Errichtung einer totalitären Weltregierung. Flexible Großerzählung, die als ideologisches Gerüst für zahlreiche Subtheorien dient.',
    category: Category.GEOPOLITICS,
    dangerLevel: DangerLevel.HIGH,
    popularity: 87,
    originYear: '1990er',
    tags: ['Elite', 'Globalisierung', 'Kontrolle', 'Eine-Welt-Regierung', 'George H.W. Bush', 'UN', 'Bilderberg', 'Supranationalismus'],
    relatedIds: ['t7', 't3', 't9', 't14', 't18', 't20', 't25', 't35', 't43', 't64', 't74', 't75']
  },
  {
    id: 't7',
    title: 'QAnon',
    shortDescription: 'Dezentrale Verschwörungsbewegung um einen mysteriösen "Q"-Informanten, die einen globalen Kampf gegen eine satanistische Elite konstruiert. Kulminierte in realer Gewalt (Capitol Riots 2021) und transnationaler Radikalisierung mit anhaltender Demokratiegefährdung.',
    category: Category.GEOPOLITICS,
    dangerLevel: DangerLevel.EXTREME,
    popularity: 72,
    originYear: '2017',
    tags: ['Deep State', 'USA', 'Internetkultur', 'Radikalisierung', 'Capitol Riot', 'Chan-Boards', 'Trumpismus', 'Great Awakening'],
    videoUrl: 'https://www.youtube.com/watch?v=3qJvK8_8_V4', // Generic Deep State ref
    relatedIds: ['t5', 't9', 't16', 't30', 't48', 't65', 't7', 't20', 't75']
  },
  {
    id: 't9',
    title: 'Großer Austausch',
    shortDescription: 'White-Supremacist-Narrativ einer vermeintlich orchestrierten "Bevölkerungsersetzung" durch Migration. Ideologische Grundlage zahlreicher Terroranschläge (Christchurch, El Paso, Halle) und zentrales Element rechtsextremer Mobilisierung weltweit.',
    category: Category.GEOPOLITICS,
    dangerLevel: DangerLevel.EXTREME,
    popularity: 63,
    originYear: '2010er',
    tags: ['Demografie', 'Politik', 'Rechtsradikal', 'White Genocide', 'Renaud Camus', 'Terrorismus', 'Ethno-Nationalismus', 'Identitäre'],
    relatedIds: ['t5', 't7', 't20', 't64', 't74', 't43']
  },
  {
    id: 't14',
    title: 'Project Blue Beam',
    shortDescription: 'NASA würde mittels Satelliten-Hologrammen eine falsche Alien-Invasion oder Messias-Rückkehr inszenieren, um globale Massenpanik und NWO-Akzeptanz zu erzwingen. Technisch absurd, aber langlebiges Motiv in Endzeitszenarien (Serge Monast 1994). Erlebt durch UAP-Diskurs Renaissance.',
    category: Category.GEOPOLITICS,
    dangerLevel: DangerLevel.MEDIUM,
    popularity: 58,
    originYear: '1994',
    tags: ['Hologramme', 'Religion', 'NWO', 'NASA', 'Serge Monast', 'False Messiah', 'HAARP', 'Alien Invasion'],
    videoUrl: 'https://www.youtube.com/watch?v=rK0K9X9_Z9M',
    relatedIds: ['t5', 't2', 't6', 't21', 't39', 't13', 't19']
  },
  {
    id: 't18',
    title: '9/11 Inside Job',
    shortDescription: 'Archetyp der False-Flag-Operation: Behauptet kontrollierte Sprengung statt Flugzeugeinschläge, inszeniert für Kriegslegitimation ("Operation Northwoods"). Obwohl durch Physik-Expertisen widerlegt, bleibt es kulturprägender Einstieg in Verschwörungsdenken ("Jet fuel can\'t melt steel beams").',
    category: Category.GEOPOLITICS,
    dangerLevel: DangerLevel.HIGH,
    popularity: 81,
    originYear: '2001',
    tags: ['Terror', 'False Flag', 'Stahlträger', 'Bush', 'NIST-Report', 'Thermit', 'Building 7', 'PNAC', 'Inside Job'],
    relatedIds: ['t5', 't16', 't7', 't19', 't25', 't43', 't65']
  },
  {
    id: 't20',
    title: 'The Great Reset',
    shortDescription: 'Verzerrung einer WEF-Initiative zur nachhaltigen Wirtschaftsreform: wird als dystopischer Plan zur Abschaffung von Privateigentum ("You will own nothing") und totaler Überwachung fehlinterpretiert. Zentraler Bezugspunkt anti-globalistischer Mobilisierung seit COVID-19.',
    category: Category.GEOPOLITICS,
    dangerLevel: DangerLevel.EXTREME,
    popularity: 93,
    originYear: '2020',
    tags: ['WEF', 'Klaus Schwab', 'Wirtschaft', 'Enteignung', 'ESG', 'Stakeholder-Kapitalismus', 'Build Back Better', '4th Industrial Revolution'],
    relatedIds: ['t5', 't9', 't30', 't47', 't48', 't64', 't74', 't75', 't7']
  },
  {
    id: 't30',
    title: 'Adrenochrome',
    shortDescription: 'Extreme Blutlibel-Variante: Eliten würden Kinder foltern, um oxidiertes Adrenalin (Adrenochrom) zu extrahieren. Wurzeln in mittelalterlichem Antisemitismus, modern popularisiert durch "Fear and Loathing", von QAnon militarisiert. Führte zu Pizzagate-Schießerei und anhaltender Gefährdung realer Personen.',
    category: Category.GEOPOLITICS,
    dangerLevel: DangerLevel.EXTREME,
    popularity: 68,
    originYear: '2016',
    tags: ['QAnon', 'Hollywood', 'Satanism', 'Blut', 'Pizzagate', 'Wayfair', 'Blutlibel', 'Ritualmord', 'Hunter S. Thompson'],
    relatedIds: ['t7', 't5', 't3', 't46', 't65', 't16', 't30']
  },
  {
    id: 't35',
    title: 'Die Illuminaten',
    shortDescription: 'Historischer Aufklärungsbund (Adam Weishaupt, 1776-1785) wird als unsterbliche Schattenregierung mythologisiert. Popkulturell omnipräsent (Jay-Z "Roc"-Zeichen, Dollarnote-Pyramide), funktioniert als universeller Platzhalter für Elite-Macht. Meme-hafte Virulenz bei minimalem Radikalisierungspotential.',
    category: Category.GEOPOLITICS,
    dangerLevel: DangerLevel.LOW,
    popularity: 92,
    originYear: '1776',
    tags: ['Elite', 'Bayern', 'Geheimbund', 'Popkultur', 'Adam Weishaupt', 'All-Seeing Eye', 'Symbolismus', 'Freimaurerei'],
    relatedIds: ['t5', 't34', 't20', 't43', 't45', 't46']
  },
  {
    id: 't43',
    title: 'Die Bilderberger',
    shortDescription: 'Reales informelles Forum transatlantischer Eliten (seit 1954), dessen Geheimhaltung verschwörungstheoretische Projektion begünstigt. Wird als NWO-Kabinett gedeutet, das Regierungschefs und Märkte steuert. Tatsächlich Diskussions-Chatham-House-Konferenz ohne Beschlussfassung.',
    category: Category.GEOPOLITICS,
    dangerLevel: DangerLevel.LOW,
    popularity: 76,
    originYear: '1954',
    tags: ['Elite', 'Konferenz', 'Geheim', 'Politik', 'Chatham House Rules', 'Davos', 'Transatlantiker', 'Council on Foreign Relations'],
    relatedIds: ['t5', 't20', 't35', 't64', 't46']
  },
  {
    id: 't46',
    title: 'Bohemian Grove',
    shortDescription: 'Realer exklusiver Männer-Retreat kalifornischer Eliten (seit 1872) mit theatralischer "Cremation of Care"-Zeremonie. Alex Jones\' illegale Infiltration (2000) mythologisierte das Camp als Moloch-Kult. Faktisch Mischung aus Networking, Natur und Alkohol, symbolisch überinterpretiert.',
    category: Category.GEOPOLITICS,
    dangerLevel: DangerLevel.LOW,
    popularity: 65,
    originYear: '1872',
    tags: ['Elite', 'Okkultismus', 'Rituale', 'Kalifornien', 'Alex Jones', 'Owl', 'Manhattan Project', 'Richard Nixon'],
    videoUrl: 'https://www.youtube.com/watch?v=F2E_HJ9yljk',
    relatedIds: ['t5', 't30', 't34', 't35', 't43']
  },
  {
    id: 't47',
    title: 'Transhumanismus-Agenda',
    shortDescription: 'Philosophische Vision technologischer Menschheitsverbesserung (Bostrom, Kurzweil) wird als dystopisches Cyborg-Versklavungsprogramm fehlgedeutet. Verbindet Ängste vor KI, Chip-Implantaten, mRNA-Technologie und "Seelenverlust". Neuralink und CRISPR als angebliche NWO-Werkzeuge.',
    category: Category.GEOPOLITICS,
    dangerLevel: DangerLevel.MEDIUM,
    popularity: 71,
    originYear: '2000er',
    tags: ['Technologie', 'KI', 'Evolution', 'Kontrolle', 'Ray Kurzweil', 'Neuralink', 'CRISPR', 'Singularity', 'Brain-Computer Interface'],
    relatedIds: ['t6', 't20', 't22', 't48', 't74', 't64']
  },
  {
    id: 't64',
    title: 'Agenda 2030',
    shortDescription: 'UN-Nachhaltigkeitsziele (SDGs) werden als euphemistischer Blueprint für technokratische Kontrolle und Eigentumsenteignung umgedeutet. Verbindet anti-grüne Ressentiments mit Souveränitätsängsten. Fungiert als globalsüdliche Variante der WEF-Skepsis.',
    category: Category.GEOPOLITICS,
    dangerLevel: DangerLevel.HIGH,
    popularity: 85,
    originYear: '2015',
    tags: ['UN', 'NWO', 'Nachhaltigkeit', 'Kontrolle', 'SDGs', 'Agenda 21', 'IPCC', 'Smart Cities', 'Stakeholder', 'Public-Private Partnership'],
    relatedIds: ['t20', 't5', 't74', 't47', 't9']
  },
  {
    id: 't65',
    title: 'The Finders Cult',
    shortDescription: 'Obskurer Kult (1987 in Florida verhaftet), dessen FBI-Akten CIA-Verbindungen suggerierten. Dient als historischer "Beweis"-Ankerpunkt für QAnon-Narrative über institutionalisierten Kindesmissbrauch. Tatsächliche Fakten unklar, FBI-Akten 2019 teilweise freigegeben, aber inkonsistent.',
    category: Category.GEOPOLITICS,
    dangerLevel: DangerLevel.MEDIUM,
    popularity: 52,
    originYear: '1987',
    tags: ['CIA', 'Kult', 'Kinder', 'Deep State', 'FBI', 'Tallahassee', 'FOIA', 'Marion Pettie'],
    relatedIds: ['t7', 't30', 't18', 't5']
  },
  {
    id: 't74',
    title: '15-Minuten-Städte',
    shortDescription: 'Urbanistisches Konzept nachhaltiger Nahversorgung wird als "Open-Air-Gefängnis" umgedeutet. Verbindet Klima-Skepsis, Anti-Lockdown-Ressentiments und NWO-Ängste. Führte 2023-2024 zu Protesten, Vandalismus an Verkehrsinfrastruktur und Bedrohung von Stadtplanern.',
    category: Category.GEOPOLITICS,
    dangerLevel: DangerLevel.EXTREME,
    popularity: 91,
    originYear: '2022',
    tags: ['Klima', 'Lockdown', 'Städtebau', 'WEF', 'ULEZ', 'C40 Cities', 'Smart Cities', 'Verkehrswende', 'Oxford', 'Low Traffic Neighbourhoods'],
    relatedIds: ['t20', 't64', 't5', 't9', 't47']
  },
  {
    id: 't75',
    title: 'NESARA / GESARA',
    shortDescription: 'Millenaristische Fantasie eines geheimen "National Economic Security and Recovery Act", der Schuldenerlasse, UBI und Goldstandard bringt. Von Harvey Barnard (1990er) erfunden, von Shaini Goodwin kultisch ausgebaut, von QAnon als "White Hat"-Operation vereinnahmt. Finanziell gefährdend für vulnerable Gläubige.',
    category: Category.GEOPOLITICS,
    dangerLevel: DangerLevel.MEDIUM,
    popularity: 66,
    originYear: '2000',
    tags: ['Finanzen', 'Schulden', 'Gold', 'Utopie', 'White Hats', 'Debt Jubilee', 'Quantum Financial System', 'BRICS', 'RV/GCR'],
    relatedIds: ['t7', 't5', 't20', 't35']
  }
];

export const GEOPOLITICS_THEORIES_EN: Theory[] = [
  {
    id: 't5',
    title: 'New World Order (NWO)',
    shortDescription: 'Ur-narrative of globalist conspiracy: A shadowy elite orchestrates supranational institutions (UN, WEF, EU) to establish a totalitarian world government. Flexible master narrative serving as ideological scaffolding for numerous sub-theories.',
    category: CategoryEn.GEOPOLITICS,
    dangerLevel: DangerLevelEn.HIGH,
    popularity: 87,
    originYear: '1990s',
    tags: ['Elite', 'Globalization', 'Control', 'One World Government', 'George H.W. Bush', 'UN', 'Bilderberg', ' Supranationalism'],
    relatedIds: ['t7', 't3', 't9', 't14', 't18', 't20', 't25', 't35', 't43', 't64', 't74', 't75']
  },
  {
    id: 't7',
    title: 'QAnon',
    shortDescription: 'Decentralized conspiracy movement around a mysterious "Q" informant, constructing a global battle against a satanic elite. Culminated in real-world violence (Capitol Riots 2021) and transnational radicalization with ongoing threat to democracy.',
    category: CategoryEn.GEOPOLITICS,
    dangerLevel: DangerLevelEn.EXTREME,
    popularity: 72,
    originYear: '2017',
    tags: ['Deep State', 'USA', 'Internet Culture', 'Radicalization', 'Capitol Riot', 'Chan Boards', 'Trumpism', 'Great Awakening'],
    videoUrl: 'https://www.youtube.com/watch?v=3qJvK8_8_V4',
    relatedIds: ['t5', 't9', 't16', 't30', 't48', 't65', 't7', 't20', 't75']
  },
  {
    id: 't9',
    title: 'Great Replacement',
    shortDescription: 'White supremacist narrative of allegedly orchestrated "population replacement" through migration. Ideological foundation of numerous terrorist attacks (Christchurch, El Paso, Halle) and central element of far-right mobilization worldwide.',
    category: CategoryEn.GEOPOLITICS,
    dangerLevel: DangerLevelEn.EXTREME,
    popularity: 63,
    originYear: '2010s',
    tags: ['Demography', 'Politics', 'Far-right', 'White Genocide', 'Renaud Camus', 'Terrorism', 'Ethno-Nationalism', 'Identitarian'],
    relatedIds: ['t5', 't7', 't20', 't64', 't74', 't43']
  },
  {
    id: 't14',
    title: 'Project Blue Beam',
    shortDescription: 'NASA would use satellite holograms to stage a fake alien invasion or messiah return, forcing global mass panic and NWO acceptance. Technically absurd but long-lived motif in apocalyptic scenarios (Serge Monast 1994). Experiencing renaissance through UAP discourse.',
    category: CategoryEn.GEOPOLITICS,
    dangerLevel: DangerLevelEn.MEDIUM,
    popularity: 58,
    originYear: '1994',
    tags: ['Holograms', 'Religion', 'NWO', 'NASA', 'Serge Monast', 'False Messiah', 'HAARP', 'Alien Invasion'],
    videoUrl: 'https://www.youtube.com/watch?v=rK0K9X9_Z9M',
    relatedIds: ['t5', 't2', 't6', 't21', 't39', 't13', 't19']
  },
  {
    id: 't18',
    title: '9/11 Inside Job',
    shortDescription: 'Archetype of false-flag operation: Claims controlled demolition instead of plane impacts, orchestrated for war legitimation ("Operation Northwoods"). Despite refutation by physics experts, remains culturally formative gateway into conspiratorial thinking ("Jet fuel can\'t melt steel beams").',
    category: CategoryEn.GEOPOLITICS,
    dangerLevel: DangerLevelEn.HIGH,
    popularity: 81,
    originYear: '2001',
    tags: ['Terror', 'False Flag', 'Steel Beams', 'Bush', 'NIST Report', 'Thermite', 'Building 7', 'PNAC', 'Inside Job'],
    relatedIds: ['t5', 't16', 't7', 't19', 't25', 't43', 't65']
  },
  {
    id: 't20',
    title: 'The Great Reset',
    shortDescription: 'Distortion of a WEF initiative for sustainable economic reform: misinterpreted as dystopian plan to abolish private property ("You will own nothing") and establish total surveillance. Central reference point of anti-globalist mobilization since COVID-19.',
    category: CategoryEn.GEOPOLITICS,
    dangerLevel: DangerLevelEn.EXTREME,
    popularity: 93,
    originYear: '2020',
    tags: ['WEF', 'Klaus Schwab', 'Economy', 'Expropriation', 'ESG', 'Stakeholder Capitalism', 'Build Back Better', '4th Industrial Revolution'],
    relatedIds: ['t5', 't9', 't30', 't47', 't48', 't64', 't74', 't75', 't7']
  },
  {
    id: 't30',
    title: 'Adrenochrome',
    shortDescription: 'Extreme blood libel variant: Elites torture children to extract oxidized adrenaline (adrenochrome). Roots in medieval antisemitism, modernly popularized by "Fear and Loathing", weaponized by QAnon. Led to Pizzagate shooting and ongoing endangerment of real persons.',
    category: CategoryEn.GEOPOLITICS,
    dangerLevel: DangerLevelEn.EXTREME,
    popularity: 68,
    originYear: '2016',
    tags: ['QAnon', 'Hollywood', 'Satanism', 'Blood', 'Pizzagate', 'Wayfair', 'Blood Libel', 'Ritual Murder', 'Hunter S. Thompson'],
    relatedIds: ['t7', 't5', 't3', 't46', 't65', 't16', 't30']
  },
  {
    id: 't35',
    title: 'The Illuminati',
    shortDescription: 'Historical Enlightenment society (Adam Weishaupt, 1776-1785) mythologized as immortal shadow government. Ubiquitous in pop culture (Jay-Z "Roc" sign, dollar pyramid), functions as universal placeholder for elite power. Meme-like virality with minimal radicalization potential.',
    category: CategoryEn.GEOPOLITICS,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 92,
    originYear: '1776',
    tags: ['Elite', 'Bavaria', 'Secret Society', 'Pop Culture', 'Adam Weishaupt', 'All-Seeing Eye', 'Symbolism', 'Freemasonry'],
    relatedIds: ['t5', 't34', 't20', 't43', 't45', 't46']
  },
  {
    id: 't43',
    title: 'The Bilderberg Group',
    shortDescription: 'Real informal forum of transatlantic elites (since 1954) whose secrecy facilitates conspiratorial projection. Interpreted as NWO cabinet steering heads of state and markets. Actually discussion-based Chatham House conference without binding resolutions.',
    category: CategoryEn.GEOPOLITICS,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 76,
    originYear: '1954',
    tags: ['Elite', 'Conference', 'Secret', 'Politics', 'Chatham House Rules', 'Davos', 'Transatlantic', 'Council on Foreign Relations'],
    relatedIds: ['t5', 't20', 't35', 't64', 't46']
  },
  {
    id: 't46',
    title: 'Bohemian Grove',
    shortDescription: 'Real exclusive men\'s retreat of Californian elites (since 1872) with theatrical "Cremation of Care" ceremony. Alex Jones\' illegal infiltration (2000) mythologized the camp as Moloch cult. Factually mix of networking, nature, and alcohol, symbolically over-interpreted.',
    category: CategoryEn.GEOPOLITICS,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 65,
    originYear: '1872',
    tags: ['Elite', 'Occultism', 'Rituals', 'California', 'Alex Jones', 'Owl', 'Manhattan Project', 'Richard Nixon'],
    videoUrl: 'https://www.youtube.com/watch?v=F2E_HJ9yljk',
    relatedIds: ['t5', 't30', 't34', 't35', 't43']
  },
  {
    id: 't47',
    title: 'Transhumanism Agenda',
    shortDescription: 'Philosophical vision of technological human enhancement (Bostrom, Kurzweil) misinterpreted as dystopian cyborg enslavement program. Combines fears of AI, chip implants, mRNA technology, and "soul loss". Neuralink and CRISPR as alleged NWO tools.',
    category: CategoryEn.GEOPOLITICS,
    dangerLevel: DangerLevelEn.MEDIUM,
    popularity: 71,
    originYear: '2000s',
    tags: ['Technology', 'AI', 'Evolution', 'Control', 'Ray Kurzweil', 'Neuralink', 'CRISPR', 'Singularity', 'Brain-Computer Interface'],
    relatedIds: ['t6', 't20', 't22', 't48', 't74', 't64']
  },
  {
    id: 't64',
    title: 'Agenda 2030',
    shortDescription: 'UN Sustainable Development Goals (SDGs) reinterpreted as euphemistic blueprint for technocratic control and property expropriation. Combines anti-green resentments with sovereignty anxieties. Functions as Global South variant of WEF skepticism.',
    category: CategoryEn.GEOPOLITICS,
    dangerLevel: DangerLevelEn.HIGH,
    popularity: 85,
    originYear: '2015',
    tags: ['UN', 'NWO', 'Sustainability', 'Control', 'SDGs', 'Agenda 21', 'IPCC', 'Smart Cities', 'Stakeholder', 'Public-Private Partnership'],
    relatedIds: ['t20', 't5', 't74', 't47', 't9']
  },
  {
    id: 't65',
    title: 'The Finders Cult',
    shortDescription: 'Obscure cult (arrested 1987 in Florida) whose FBI files suggested CIA connections. Serves as historical "proof" anchor point for QAnon narratives about institutionalized child abuse. Actual facts unclear, FBI files partially released 2019 but inconsistent.',
    category: CategoryEn.GEOPOLITICS,
    dangerLevel: DangerLevelEn.MEDIUM,
    popularity: 52,
    originYear: '1987',
    tags: ['CIA', 'Cult', 'Children', 'Deep State', 'FBI', 'Tallahassee', 'FOIA', 'Marion Pettie'],
    relatedIds: ['t7', 't30', 't18', 't5']
  },
  {
    id: 't74',
    title: '15-Minute Cities',
    shortDescription: 'Urban planning concept of sustainable local amenities reinterpreted as "open-air prison". Combines climate skepticism, anti-lockdown resentments, and NWO fears. Led to 2023-2024 protests, vandalism of traffic infrastructure, and threats against urban planners.',
    category: CategoryEn.GEOPOLITICS,
    dangerLevel: DangerLevelEn.EXTREME,
    popularity: 91,
    originYear: '2022',
    tags: ['Climate', 'Lockdown', 'Urban Planning', 'WEF', 'ULEZ', 'C40 Cities', 'Smart Cities', 'Transport', 'Oxford', 'Low Traffic Neighbourhoods'],
    relatedIds: ['t20', 't64', 't5', 't9', 't47']
  },
  {
    id: 't75',
    title: 'NESARA / GESARA',
    shortDescription: 'Millenarian fantasy of a secret "National Economic Security and Recovery Act" bringing debt forgiveness, UBI, and gold standard. Invented by Harvey Barnard (1990s), cultically expanded by Shaini Goodwin, appropriated by QAnon as "White Hat" operation. Financially endangering vulnerable believers.',
    category: CategoryEn.GEOPOLITICS,
    dangerLevel: DangerLevelEn.MEDIUM,
    popularity: 66,
    originYear: '2000',
    tags: ['Finance', 'Debt', 'Gold', 'Utopia', 'White Hats', 'Debt Jubilee', 'Quantum Financial System', 'BRICS', 'RV/GCR'],
    relatedIds: ['t7', 't5', 't20', 't35']
  }
];