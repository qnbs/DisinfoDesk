import { Theory, Category, CategoryEn, DangerLevel, DangerLevelEn } from '../types';

export const MODERN_MYTHS_THEORIES_DE: Theory[] = [
  {
    id: 't8',
    title: 'Bielefeld-Verschwörung',
    shortDescription: 'Achim Helds Usenet-Post (1994): „Bielefeld gibt es nicht“ — Deutschlands erfolgreichstes satirisches Gedankenexperiment. Parodiert Verschwörungslogik durch konsequente Anwendung: Wer Bielefeld kennt, ist eingeweiht; wer es nicht kennt, bestätigt die These. Angela Merkels Augenzwinkern (2012) adelte den Metawitz. Prototyp der Internet-Era-Conspiracy-Satire (Birds Aren\'t Real).',
    category: Category.MODERN_MYTHS,
    dangerLevel: DangerLevel.LOW,
    popularity: 95,
    originYear: '1994',
    tags: ['Satire', 'Deutschland', 'Internet', 'Usenet', 'Achim Held', 'Metawitz', 'Parodie', 'Universitätsstadt'],
    relatedIds: ['t23']
  },
  {
    id: 't13',
    title: 'Majestic 12 (MJ-12)',
    shortDescription: 'Angebliches Geheimkomitee (1947) unter Truman zur UFO-Vertuschung. 1984 von William Moore/Jaime Shandera als „Cutler-Twining-Memo“ publiziert — von FBI/AFOSI als Fälschung identifiziert (Schrifttypen-Analyse). Richard Doty (AFOSI) gestand Desinformation. Trotzdem Stanton Friedmans Lebenswerk. Prototyp des „Geheimkomitee“-Narrativs in der Ufologie.',
    category: Category.MODERN_MYTHS,
    dangerLevel: DangerLevel.MEDIUM,
    popularity: 60,
    originYear: '1984',
    tags: ['UFO', 'Regierung', 'Dokumente', 'Vertuschung', 'Truman', 'Stanton Friedman', 'AFOSI', 'Cutler-Twining-Memo'],
    relatedIds: ['t17', 't3', 't4', 't15', 't19', 't37']
  },
  {
    id: 't17',
    title: 'Roswell-Zwischenfall',
    shortDescription: 'Ikonischster UFO-Fall: 1947 Project-Mogul-Ballon (nuklearer Abhörsensor) stürzt auf Mack Brazels Ranch. Major Jesse Marcel präsentiert Trümmer, USAF dementiert. 30 Jahre Stille, dann 1978er-Revival durch Stanton Friedman. Ray Santillis „Alien Autopsy“ (1995, gestanden 2006) und 2023er Congressional Hearings hielten Mythos lebendig. Gateway-Theorie zur UFO-Welt.',
    category: Category.MODERN_MYTHS,
    dangerLevel: DangerLevel.LOW,
    popularity: 98,
    originYear: '1947',
    tags: ['UFO', 'Aliens', 'Area 51', 'Militär', 'Jesse Marcel', 'Project Mogul', 'Alien Autopsy', 'David Grusch'],
    videoUrl: 'https://www.youtube.com/watch?v=P210Y0d4JXM',
    relatedIds: ['t13', 't3', 't19', 't37', 't42']
  },
  {
    id: 't23',
    title: 'Vögel sind nicht real',
    shortDescription: 'Peter McIndoes Performance-Art-Bewegung (2017): Alle Vögel wurden 1959–2001 durch CIA-Überwachungsdrohnen ersetzt, die auf Stromleitungen „aufladen“. Geniale Satire, die konspiratives Denken durch Überaffirmation entlarvt. Van-Touren, Merch-Shop, Rallies — ironischer Aktivismus als Gen-Z-Medienkunst. Bewies, dass Verschwörungsästhetik selbst ohne Inhalt Anhänger generiert.',
    category: Category.MODERN_MYTHS,
    dangerLevel: DangerLevel.LOW,
    popularity: 80,
    originYear: '2017',
    tags: ['Satire', 'Überwachung', 'Internetkultur', 'Drohnen', 'Peter McIndoe', 'CIA', 'Performance Art', 'Gen Z'],
    relatedIds: ['t8', 't6']
  },
  {
    id: 't25',
    title: 'Denver International Airport',
    shortDescription: 'DIA (1995): Baukosten-Explosion ($2→4,8 Mrd.), freimaurerischer Grundstein, Leo Tangumas apokalyptische Wandgemälde, „Bl ucifer“-Skulptur (deren Schöpfer sie tötete) und unterirdische Tunnelsysteme. Flughafen spielt ironisch mit: Alien-Schilder in Bauabschnitten. Ideale Projektionsfläche — real genug zum Staunen, banal genug zum Debunken.',
    category: Category.MODERN_MYTHS,
    dangerLevel: DangerLevel.MEDIUM,
    popularity: 60,
    originYear: '1994',
    tags: ['Flughafen', 'Freimaurer', 'NWO', 'Bunker', 'Blucifer', 'Leo Tanguma', 'Tunnelsystem', 'Gargoylen'],
    videoUrl: 'https://www.youtube.com/watch?v=833Yi0yvOJI',
    relatedIds: ['t5', 't3', 't34']
  },
  {
    id: 't27',
    title: 'Paul is Dead',
    shortDescription: 'Proto-Internet-Verschwörung (1969): „Paul starb beim Autounfall, Faul ersetzte ihn.“ Russ Gibb (WKNR) + Drake-Universität-Studenten analysierten Abbey-Road-Cover (Paul barfuß = Leichnam), „Turn me on, dead man“ (Revolution 9 rückwärts). Erste crowdsourcete Textanalyse-Verschwörung. Unfalsifizierbar — McCartney selbst kann sich nicht „beweisen“. Archetypische Doppelgänger-Paranoia.',
    category: Category.MODERN_MYTHS,
    dangerLevel: DangerLevel.LOW,
    popularity: 85,
    originYear: '1969',
    tags: ['Musik', 'Beatles', 'Doppelgänger', 'Popkultur', 'Abbey Road', 'Revolution 9', 'William Campbell', 'Russ Gibb'],
    relatedIds: ['t4', 't63']
  },
  {
    id: 't31',
    title: 'Bigfoot (Sasquatch)',
    shortDescription: 'Patterson-Gimlin-Film (1967): 7,5 Sekunden, die eine Industrie begründeten. Kryptozoologischer Superstar — 10.000+ Sichtungen (BFRO-Datenbank), DNA-Analysen (stets Bär/Mensch), Thermalkamera-Expeditions-TV. Biologisch unmöglich: Mindestpopulation für Reproduktion (~500) hinterließe Fossilien. Verbindet Native-American-Sasquatch-Tradition mit Wildnis-Romantik.',
    category: Category.MODERN_MYTHS,
    dangerLevel: DangerLevel.LOW,
    popularity: 90,
    originYear: '1958',
    tags: ['Kryptozoologie', 'USA', 'Hominide', 'Natur', 'Patterson-Gimlin-Film', 'BFRO', 'Pacific Northwest', 'Gigantopithecus'],
    relatedIds: ['t32', 't33']
  },
  {
    id: 't32',
    title: 'Monster von Loch Ness',
    shortDescription: 'Surgeon\'s Photograph (1934, gestanden 1994: Spielzeug-U-Boot + Plastikkopf). Trotzdem: Sonar-Expeditionen (1987 Operation Deepscan, 2023 Largest Loch Ness Search), eDNA-Analyse 2019 (Ergebnis: sehr große Aale möglich). Plesiosaurier-Hypothese biologisch absurd (Kaltblüter in 6°C-See). Schottlands Nr.1-Tourismusmagnet mit £41M/Jahr. Perfekte Symbiose aus Mythos und Ökonomie.',
    category: Category.MODERN_MYTHS,
    dangerLevel: DangerLevel.LOW,
    popularity: 92,
    originYear: '1933',
    tags: ['Kryptozoologie', 'Schottland', 'Plesiosaurier', 'Wasser', 'Surgeon Photo', 'eDNA', 'Operation Deepscan', 'Tourismus'],
    relatedIds: ['t31', 't33']
  },
  {
    id: 't33',
    title: 'Der Yeti',
    shortDescription: 'Himalaya-Kryptide: Tibetisch „Metoh-Kangmi“ (Schneemann), durch Eric Shiptons Fußabdruck-Foto (1951) westlich popularisiert. Reinhold Messner (1986) identifizierte Yeti als Tibetbär (Ursus arctos pruinosus) — 2017er DNA-Studie bestätigte: alle „Yeti-Proben“ = Bären. Kulturell persistent durch Sherpa-Folklore, Mountaineering-Romantik und Hollywood-Verwertung. Matterhorn der Kryptozoologie.',
    category: Category.MODERN_MYTHS,
    dangerLevel: DangerLevel.LOW,
    popularity: 85,
    originYear: '19. Jh',
    tags: ['Kryptozoologie', 'Himalaya', 'Schnee', 'Mythologie', 'Eric Shipton', 'Reinhold Messner', 'Tibetbär', 'Sherpa'],
    relatedIds: ['t31', 't10']
  },
  {
    id: 't37',
    title: 'Die Greys (Zeta Reticuli)',
    shortDescription: 'Archetypische Alien-Morphologie: Betty & Barney Hills Hypnose-Regression (1961) etablierte Ikonografie (klein, grau, große Augen). Budd Hopkins („Missing Time“, 1981) und John Macks Harvard-Studien industrialisierten Entführungsforschung. Skeptiker-Erklärung: Schlafparalyse + kulturelle Kontamination. Dominante Alien-Darstellung in Film/TV/Emoji. Psychologisch: Kontrollverlust-Angst als kosmisches Trauma.',
    category: Category.MODERN_MYTHS,
    dangerLevel: DangerLevel.MEDIUM,
    popularity: 95,
    originYear: '1961 (Hill)',
    tags: ['Aliens', 'Entführung', 'UFO', 'Exobiologie', 'Betty & Barney Hill', 'Budd Hopkins', 'John Mack', 'Schlafparalyse'],
    relatedIds: ['t17', 't13', 't3', 't41', 't40']
  },
  {
    id: 't41',
    title: 'Men In Black (MIB)',
    shortDescription: 'Albert Benders „Space Review“ (1953): Drei Männer in Schwarz bedrohten ihn nach UFO-Recherchen. Gray Barkers „They Knew Too Much About Flying Saucers“ (1956) kodifizierte den Mythos. John Keels „Mothman Prophecies“ erweiterte MIB zu paranormalen Entitäten. Will-Smith-Franchise (1997) entschärfte Horror zu Komödie. Archetypisch: Staatliche Repression als übernatürliche Erfahrung.',
    category: Category.MODERN_MYTHS,
    dangerLevel: DangerLevel.LOW,
    popularity: 92,
    originYear: '1953 (Barker)',
    tags: ['UFO', 'Regierung', 'Geheimagenten', 'Popkultur', 'Albert Bender', 'Gray Barker', 'John Keel', 'Will Smith'],
    relatedIds: ['t13', 't17', 't37']
  },
  {
    id: 't42',
    title: 'Area 51 (Groom Lake)',
    shortDescription: 'Groom Lake, Nevada: Legitime USAF-Testanlage (U-2, SR-71, F-117 — alles ehemals „UFOs“). Bob Lazars S4-Behauptung (1989, Element 115, Sport Model) machte Area 51 zum UFO-Mekka. CIA bestätigte Existenz erst 2013 (FOIA). „Storm Area 51“-Facebook-Event (2019, 2M RSVPs) zeigte Meme-Potenzial. Echte Geheimhaltung nährt Spekulation, die wiederum echte Projekte tarnt.',
    category: Category.MODERN_MYTHS,
    dangerLevel: DangerLevel.LOW,
    popularity: 99,
    originYear: '1955/1989',
    tags: ['Militär', 'Aliens', 'Technologie', 'Geheim', 'Bob Lazar', 'Groom Lake', 'Storm Area 51', 'Element 115'],
    relatedIds: ['t17', 't13', 't4', 'm2']
  },
  {
    id: 't44',
    title: 'Philadelphia Experiment',
    shortDescription: 'Carl Allens paranoide Randnotizen in Morris Jessups „Case for the UFO“ (1955) begründeten den Mythos: USS Eldridge (DE-173) angeblich durch Einheitsfeldtheorie unsichtbar + teleportiert (Philadelphia→Norfolk). Matrosen in Schiffswand verschmolzen. Bordlogbücher widerlegen (Eldridge war in New York). Charles Berlitz-Buch (1979) popularisierte. Prototyp für „Geheime Militär-Physik“-Genre.',
    category: Category.MODERN_MYTHS,
    dangerLevel: DangerLevel.LOW,
    popularity: 80,
    originYear: '1955',
    tags: ['Militär', 'Teleportation', 'Physik', 'Zeitreise', 'USS Eldridge', 'Carl Allen', 'Morris Jessup', 'Einstein'],
    relatedIds: ['t12', 't15', 't52']
  },
  {
    id: 't52',
    title: 'Das Bermuda-Dreieck',
    shortDescription: 'Vincent Gaddis (Argosy Magazine, 1964) taufte das Gebiet Miami–Bermuda–Puerto Rico. Charles Berlitz (1974) machte es zum Bestseller: Flight 19 (1945), USS Cyclops (1918), Star Tiger (1948). Larry Kusche (1975) widerlegte: Verschwundensrate = Normalwert für verkehrsreiches Seegebiet. Lloyd\'s of London bestätigte: keine erhöhten Versicherungsprämien. Trotzdem kulturell unsterblich.',
    category: Category.MODERN_MYTHS,
    dangerLevel: DangerLevel.LOW,
    popularity: 95,
    originYear: '1950',
    tags: ['Ozean', 'Verschwinden', 'Magnetismus', 'Aliens', 'Flight 19', 'Charles Berlitz', 'USS Cyclops', 'Larry Kusche'],
    relatedIds: ['t51', 't44', 't10']
  },
  {
    id: 't55',
    title: 'Tunguska-Ereignis',
    shortDescription: 'Podkamennaya-Tunguska-Fluss, 30. Juni 1908: 12-Megatonnen-Explosion plättete 2.150 km² Taiga, kein Krater. Kulik-Expedition (1927) fand Schmetterlingsmuster umgeknickter Bäume. Konsens: Steinmeteorit/Komet zerbarst in 5–10 km Höhe (Airburst). Alternativ-Erklärungen: Teslas Wardenclyffe-Strahl (zeitlich unmöglich), Miniatur-Schwarzes-Loch, Antimaterie. Apokalypse-Blaupause für Near-Earth-Object-Forschung.',
    category: Category.MODERN_MYTHS,
    dangerLevel: DangerLevel.LOW,
    popularity: 82,
    originYear: '1908',
    tags: ['Russland', 'Explosion', 'Tesla', 'UFO', 'Airburst', 'Kulik-Expedition', 'Taiga', 'Meteorit'],
    relatedIds: ['t11', 't17']
  },
  {
    id: 't61',
    title: 'Dead Internet Theory',
    shortDescription: 'Agora-Forum-These (2021, Wurzeln 2016): Internet sei seit ~2016–17 „gestorben“ — Großteil des Contents AI/Bot-generiert, echte User marginalisiert, Engagement-Metriken gefälscht. Paradoxerweise durch LLM-Explosion (ChatGPT 2022+) teilweise validiert: AI-Spam-Content explodierte. SEO-Farmen, AI-Fashion-Models, Bot-Kommentare machen These zunehmend prophetisch. Epistemische Krise als Meme.',
    category: Category.MODERN_MYTHS,
    dangerLevel: DangerLevel.MEDIUM,
    popularity: 92,
    originYear: '2016',
    tags: ['Internet', 'KI', 'Bots', 'Manipulation', 'Agora Forum', 'SEO', 'ChatGPT', 'Engagement Farming'],
    relatedIds: ['t22', 't6']
  },
  {
    id: 't63',
    title: 'Avril Lavigne Ersetzt',
    shortDescription: 'Brasilianischer Blogpost (2011, Gabriella): Avril starb 2003 nach Let-Go-Erfolg, ersetzt durch Body-Double Melissa Vandella. „Beweise“: Handschriftänderung, Muttermale, Stilwandel. Twitter-Viral 2017. Kulturell: Paul-is-Dead für Millennials, illustriert parasoziale Beziehungen und Celebrity-Ownership-Gefühl. Avril selbst reagierte amüsiert. Harmlose Popkultur-Archäologie.',
    category: Category.MODERN_MYTHS,
    dangerLevel: DangerLevel.LOW,
    popularity: 78,
    originYear: '2011',
    tags: ['Musik', 'Doppelgänger', 'Popkultur', 'Internet', 'Melissa Vandella', 'Brasilien', 'Parasoziale Beziehung', 'Let Go'],
    relatedIds: ['t27']
  },
  {
    id: 't72',
    title: 'Walt Disney Kälteschlaf',
    shortDescription: 'Urbane Legende seit Disneys Tod (15.12.1966): Sein Körper (oder Kopf) liege kryonisch konserviert unter Disneyland, speziell unter „Pirates of the Caribbean“. Tatsächlich: konventionelle Einäscherung, Forest Lawn Memorial. Erste Kryonik-Konservierung (James Bedford) war einen Monat nach Disneys Tod. Persistiert durch Disneys Technologie-Obsession und Unsterblichkeits-Metaphorik.',
    category: Category.MODERN_MYTHS,
    dangerLevel: DangerLevel.LOW,
    popularity: 85,
    originYear: '1966',
    tags: ['Disney', 'Kryonik', 'Hollywood', 'Tod', 'Forest Lawn', 'James Bedford', 'Pirates of the Caribbean', 'Einäscherung'],
    relatedIds: ['t30']
  },
  {
    id: 't73',
    title: 'Polybius (Arcade)',
    shortDescription: 'Coinop.org-Eintrag (2000): Angebliches Arcade-Game (Portland, OR, 1981) verursachte Amnesie, Schlaflosigkeit, Suizidgedanken. „Men in Black“ sammelten Spieldaten. Kein physisches Cabinet je gefunden. Wahrscheinlich Fusion realer Portland-Arcade-FBI-Razzia (1981, Glücksspiel) + Tempest-Epilepsie-Vorfälle. Perfekte Creepypasta: gruselig, unüberprüfbar, videospiel-nostalgisch.',
    category: Category.MODERN_MYTHS,
    dangerLevel: DangerLevel.LOW,
    popularity: 65,
    originYear: '2000',
    tags: ['Videospiele', 'CIA', 'Mind Control', 'Creepypasta', 'Portland', 'Coinop.org', 'Tempest', 'Arcade'],
    relatedIds: ['m10', 't15']
  }
];

export const MODERN_MYTHS_THEORIES_EN: Theory[] = [
  {
    id: 't8',
    title: 'Bielefeld Conspiracy',
    shortDescription: 'Achim Held\'s Usenet post (1994): "Bielefeld does not exist" — Germany\'s most successful satirical thought experiment. Parodies conspiracy logic through consistent application: anyone who knows Bielefeld is in on it; anyone who doesn\'t confirms the thesis. Angela Merkel\'s winking reference (2012) elevated the meta-joke. Prototype of internet-era conspiracy satire (Birds Aren\'t Real).',
    category: CategoryEn.MODERN_MYTHS,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 95,
    originYear: '1994',
    tags: ['Satire', 'Germany', 'Internet', 'Usenet', 'Achim Held', 'Meta-Joke', 'Parody', 'University City'],
    relatedIds: ['t23']
  },
  {
    id: 't13',
    title: 'Majestic 12 (MJ-12)',
    shortDescription: 'Alleged secret committee (1947) under Truman for UFO cover-ups. Published 1984 by William Moore/Jaime Shandera as "Cutler-Twining Memo" — identified as forgery by FBI/AFOSI (typeface analysis). Richard Doty (AFOSI) confessed to disinformation. Still Stanton Friedman\'s life\'s work thesis. Prototype of the "secret committee" narrative in ufology.',
    category: CategoryEn.MODERN_MYTHS,
    dangerLevel: DangerLevelEn.MEDIUM,
    popularity: 60,
    originYear: '1984',
    tags: ['UFO', 'Government', 'Documents', 'Cover-up', 'Truman', 'Stanton Friedman', 'AFOSI', 'Cutler-Twining Memo'],
    relatedIds: ['t17', 't3', 't4', 't15', 't19', 't37']
  },
  {
    id: 't17',
    title: 'Roswell Incident',
    shortDescription: 'Most iconic UFO case: 1947 Project Mogul balloon (nuclear listening sensor) crashed on Mack Brazel\'s ranch. Major Jesse Marcel presented debris, USAF denied. 30 years of silence, then 1978 revival by Stanton Friedman. Ray Santilli\'s "Alien Autopsy" (1995, confessed 2006) and 2023 Congressional Hearings kept the myth alive. Gateway theory to UFO world.',
    category: CategoryEn.MODERN_MYTHS,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 98,
    originYear: '1947',
    tags: ['UFO', 'Aliens', 'Area 51', 'Military', 'Jesse Marcel', 'Project Mogul', 'Alien Autopsy', 'David Grusch'],
    videoUrl: 'https://www.youtube.com/watch?v=P210Y0d4JXM',
    relatedIds: ['t13', 't3', 't19', 't37', 't42']
  },
  {
    id: 't23',
    title: 'Birds Aren\'t Real',
    shortDescription: 'Peter McIndoe\'s performance art movement (2017): All birds were replaced 1959–2001 by CIA surveillance drones that "recharge" on power lines. Brilliant satire exposing conspiratorial thinking through over-affirmation. Van tours, merch shop, rallies — ironic activism as Gen-Z media art. Proved that conspiracy aesthetics generate followers even without substance.',
    category: CategoryEn.MODERN_MYTHS,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 80,
    originYear: '2017',
    tags: ['Satire', 'Surveillance', 'Internet Culture', 'Drones', 'Peter McIndoe', 'CIA', 'Performance Art', 'Gen Z'],
    relatedIds: ['t8', 't6']
  },
  {
    id: 't25',
    title: 'Denver International Airport',
    shortDescription: 'DIA (1995): Construction cost explosion ($2→4.8B), Masonic capstone, Leo Tanguma\'s apocalyptic murals, "Blucifer" sculpture (which killed its creator), and underground tunnel systems. Airport plays along ironically: alien signs in construction zones. Ideal projection screen — real enough to marvel at, mundane enough to debunk.',
    category: CategoryEn.MODERN_MYTHS,
    dangerLevel: DangerLevelEn.MEDIUM,
    popularity: 60,
    originYear: '1994',
    tags: ['Airport', 'Freemasons', 'NWO', 'Bunkers', 'Blucifer', 'Leo Tanguma', 'Tunnels', 'Gargoyles'],
    videoUrl: 'https://www.youtube.com/watch?v=833Yi0yvOJI',
    relatedIds: ['t5', 't3', 't34']
  },
  {
    id: 't27',
    title: 'Paul is Dead',
    shortDescription: 'Proto-internet conspiracy (1969): "Paul died in a car crash, Faul replaced him." Russ Gibb (WKNR) + Drake University students analyzed Abbey Road cover (barefoot Paul = corpse), "Turn me on, dead man" (Revolution 9 backwards). First crowdsourced textual analysis conspiracy. Unfalsifiable — McCartney himself can\'t "prove" his identity. Archetypal doppelgänger paranoia.',
    category: CategoryEn.MODERN_MYTHS,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 85,
    originYear: '1969',
    tags: ['Music', 'Beatles', 'Look-alike', 'Pop Culture', 'Abbey Road', 'Revolution 9', 'William Campbell', 'Russ Gibb'],
    relatedIds: ['t4', 't63']
  },
  {
    id: 't31',
    title: 'Bigfoot (Sasquatch)',
    shortDescription: 'Patterson-Gimlin film (1967): 7.5 seconds that founded an industry. Cryptozoological superstar — 10,000+ sightings (BFRO database), DNA analyses (always bear/human), thermal camera expedition TV. Biologically impossible: minimum breeding population (~500) would leave fossils. Combines Native American Sasquatch tradition with wilderness romanticism.',
    category: CategoryEn.MODERN_MYTHS,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 90,
    originYear: '1958',
    tags: ['Cryptozoology', 'USA', 'Hominid', 'Nature', 'Patterson-Gimlin Film', 'BFRO', 'Pacific Northwest', 'Gigantopithecus'],
    relatedIds: ['t32', 't33']
  },
  {
    id: 't32',
    title: 'Loch Ness Monster',
    shortDescription: 'Surgeon\'s Photograph (1934, confessed 1994: toy submarine + plastic head). Despite this: sonar expeditions (1987 Operation Deepscan, 2023 Largest Loch Ness Search), eDNA analysis 2019 (result: very large eels possible). Plesiosaur hypothesis biologically absurd (cold-blooded in 6°C lake). Scotland\'s #1 tourist magnet at £41M/year. Perfect symbiosis of myth and economics.',
    category: CategoryEn.MODERN_MYTHS,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 92,
    originYear: '1933',
    tags: ['Cryptozoology', 'Scotland', 'Plesiosaur', 'Water', 'Surgeon Photo', 'eDNA', 'Operation Deepscan', 'Tourism'],
    relatedIds: ['t31', 't33']
  },
  {
    id: 't33',
    title: 'The Yeti',
    shortDescription: 'Himalayan cryptid: Tibetan "Metoh-Kangmi" (snowman), popularized in the West by Eric Shipton\'s footprint photo (1951). Reinhold Messner (1986) identified the Yeti as Tibetan brown bear (Ursus arctos pruinosus) — 2017 DNA study confirmed: all "Yeti samples" = bears. Culturally persistent through Sherpa folklore, mountaineering romanticism, and Hollywood. The Matterhorn of cryptozoology.',
    category: CategoryEn.MODERN_MYTHS,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 85,
    originYear: '19th C',
    tags: ['Cryptozoology', 'Himalayas', 'Snow', 'Mythology', 'Eric Shipton', 'Reinhold Messner', 'Tibetan Bear', 'Sherpa'],
    relatedIds: ['t31', 't10']
  },
  {
    id: 't37',
    title: 'The Greys (Zeta Reticuli)',
    shortDescription: 'Archetypal alien morphology: Betty & Barney Hill\'s hypnotic regression (1961) established iconography (small, gray, large eyes). Budd Hopkins ("Missing Time", 1981) and John Mack\'s Harvard studies industrialized abduction research. Skeptic explanation: sleep paralysis + cultural contamination. Dominant alien depiction in film/TV/emoji. Psychologically: loss-of-control anxiety as cosmic trauma.',
    category: CategoryEn.MODERN_MYTHS,
    dangerLevel: DangerLevelEn.MEDIUM,
    popularity: 95,
    originYear: '1961 (Hill)',
    tags: ['Aliens', 'Abduction', 'UFO', 'Exobiology', 'Betty & Barney Hill', 'Budd Hopkins', 'John Mack', 'Sleep Paralysis'],
    relatedIds: ['t17', 't13', 't3', 't41', 't40']
  },
  {
    id: 't41',
    title: 'Men In Black (MIB)',
    shortDescription: 'Albert Bender\'s "Space Review" (1953): Three men in black threatened him after UFO research. Gray Barker\'s "They Knew Too Much About Flying Saucers" (1956) codified the myth. John Keel\'s "Mothman Prophecies" expanded MIB to paranormal entities. Will Smith franchise (1997) defused horror into comedy. Archetypally: state repression as supernatural experience.',
    category: CategoryEn.MODERN_MYTHS,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 92,
    originYear: '1953 (Barker)',
    tags: ['UFO', 'Government', 'Secret Agents', 'Pop Culture', 'Albert Bender', 'Gray Barker', 'John Keel', 'Will Smith'],
    relatedIds: ['t13', 't17', 't37']
  },
  {
    id: 't42',
    title: 'Area 51 (Groom Lake)',
    shortDescription: 'Groom Lake, Nevada: Legitimate USAF test facility (U-2, SR-71, F-117 — all former "UFOs"). Bob Lazar\'s S4 claim (1989, Element 115, Sport Model) turned Area 51 into UFO mecca. CIA confirmed existence only in 2013 (FOIA). "Storm Area 51" Facebook event (2019, 2M RSVPs) demonstrated meme potential. Real secrecy feeds speculation, which in turn camouflages real projects.',
    category: CategoryEn.MODERN_MYTHS,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 99,
    originYear: '1955/1989',
    tags: ['Military', 'Aliens', 'Technology', 'Secret', 'Bob Lazar', 'Groom Lake', 'Storm Area 51', 'Element 115'],
    relatedIds: ['t17', 't13', 't4', 'm2']
  },
  {
    id: 't44',
    title: 'Philadelphia Experiment',
    shortDescription: 'Carl Allen\'s paranoid marginal notes in Morris Jessup\'s "Case for the UFO" (1955) founded the myth: USS Eldridge (DE-173) allegedly rendered invisible + teleported (Philadelphia→Norfolk) via unified field theory. Sailors fused into ship hull. Ship logs refute (Eldridge was in New York). Charles Berlitz book (1979) popularized it. Prototype for the "secret military physics" genre.',
    category: CategoryEn.MODERN_MYTHS,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 80,
    originYear: '1955',
    tags: ['Military', 'Teleportation', 'Physics', 'Time Travel', 'USS Eldridge', 'Carl Allen', 'Morris Jessup', 'Einstein'],
    relatedIds: ['t12', 't15', 't52']
  },
  {
    id: 't52',
    title: 'Bermuda Triangle',
    shortDescription: 'Vincent Gaddis (Argosy Magazine, 1964) named the Miami–Bermuda–Puerto Rico area. Charles Berlitz (1974) made it a bestseller: Flight 19 (1945), USS Cyclops (1918), Star Tiger (1948). Larry Kusche (1975) debunked: disappearance rate = normal for heavily trafficked sea area. Lloyd\'s of London confirmed: no elevated insurance premiums. Culturally immortal despite complete debunking.',
    category: CategoryEn.MODERN_MYTHS,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 95,
    originYear: '1950',
    tags: ['Ocean', 'Disappearances', 'Magnetism', 'Aliens', 'Flight 19', 'Charles Berlitz', 'USS Cyclops', 'Larry Kusche'],
    relatedIds: ['t51', 't44', 't10']
  },
  {
    id: 't55',
    title: 'Tunguska Event',
    shortDescription: 'Podkamennaya Tunguska River, June 30, 1908: 12-megaton explosion flattened 2,150 km² of taiga, no crater. Kulik expedition (1927) found butterfly pattern of felled trees. Consensus: stony meteorite/comet burst at 5–10 km altitude (airburst). Alternative explanations: Tesla\'s Wardenclyffe beam (temporally impossible), miniature black hole, antimatter. Apocalypse blueprint for Near-Earth Object research.',
    category: CategoryEn.MODERN_MYTHS,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 82,
    originYear: '1908',
    tags: ['Russia', 'Explosion', 'Tesla', 'UFO', 'Airburst', 'Kulik Expedition', 'Taiga', 'Meteorite'],
    relatedIds: ['t11', 't17']
  },
  {
    id: 't61',
    title: 'Dead Internet Theory',
    shortDescription: 'Agora forum thesis (2021, roots in 2016): Internet allegedly "died" around 2016–17 — most content AI/bot-generated, real users marginalized, engagement metrics faked. Paradoxically partially validated by LLM explosion (ChatGPT 2022+): AI spam content exploded. SEO farms, AI fashion models, bot comments make thesis increasingly prophetic. Epistemic crisis as meme.',
    category: CategoryEn.MODERN_MYTHS,
    dangerLevel: DangerLevelEn.MEDIUM,
    popularity: 92,
    originYear: '2016',
    tags: ['Internet', 'AI', 'Bots', 'Manipulation', 'Agora Forum', 'SEO', 'ChatGPT', 'Engagement Farming'],
    relatedIds: ['t22', 't6']
  },
  {
    id: 't63',
    title: 'Avril Lavigne Replaced',
    shortDescription: 'Brazilian blog post (2011, Gabriella): Avril died in 2003 after Let Go success, replaced by body double Melissa Vandella. "Evidence": handwriting changes, moles, style shift. Twitter viral 2017. Culturally: Paul is Dead for millennials, illustrates parasocial relationships and celebrity ownership psychology. Avril herself responded with amusement. Harmless pop culture archaeology.',
    category: CategoryEn.MODERN_MYTHS,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 78,
    originYear: '2011',
    tags: ['Music', 'Doppelganger', 'Pop Culture', 'Internet', 'Melissa Vandella', 'Brazil', 'Parasocial Relationship', 'Let Go'],
    relatedIds: ['t27']
  },
  {
    id: 't72',
    title: 'Walt Disney Cryogenics',
    shortDescription: 'Urban legend since Disney\'s death (Dec 15, 1966): His body (or head) lies cryonically preserved beneath Disneyland, specifically under "Pirates of the Caribbean." Actually: conventional cremation, Forest Lawn Memorial. First cryonic preservation (James Bedford) occurred one month after Disney\'s death. Persists through Disney\'s technology obsession and immortality metaphor.',
    category: CategoryEn.MODERN_MYTHS,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 85,
    originYear: '1966',
    tags: ['Disney', 'Cryonics', 'Hollywood', 'Death', 'Forest Lawn', 'James Bedford', 'Pirates of the Caribbean', 'Cremation'],
    relatedIds: ['t30']
  },
  {
    id: 't73',
    title: 'Polybius (Arcade Game)',
    shortDescription: 'Coinop.org entry (2000): Alleged arcade game (Portland, OR, 1981) caused amnesia, insomnia, suicidal thoughts. "Men in Black" collected game data. No physical cabinet ever found. Likely fusion of real Portland arcade FBI raid (1981, gambling) + Tempest epilepsy incidents. Perfect creepypasta: eerie, unverifiable, video game nostalgia. Multiple indie recreations.',
    category: CategoryEn.MODERN_MYTHS,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 65,
    originYear: '2000',
    tags: ['Video Games', 'CIA', 'Mind Control', 'Creepypasta', 'Portland', 'Coinop.org', 'Tempest', 'Arcade'],
    relatedIds: ['m10', 't15']
  }
];
