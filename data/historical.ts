import { Theory, Category, CategoryEn, DangerLevel, DangerLevelEn } from '../types';

export const HISTORICAL_THEORIES_DE: Theory[] = [
  {
    id: 't4',
    title: 'Mondlandung Fake',
    shortDescription: 'Bill Kaysings „We Never Went to the Moon“ (1974) begründete den Mythos: Studio-Inszenierung durch Stanley Kubrick für den Kalten-Krieg-Prestigesieg. „Beweise“: wehende Flagge (Torsionspendel), fehlende Sterne (Belichtungszeit), identische Hügel (begrenzte Mondtopografie). 382 kg Mondgestein, Laserreflektoren und unabhängige Sowjet-Bestätigung widerlegen. Trotzdem persistent: 6% der Amerikaner glauben es (Gallup 2019).',
    category: Category.HISTORICAL,
    dangerLevel: DangerLevel.LOW,
    popularity: 70,
    originYear: '1974',
    tags: ['NASA', 'Kalter Krieg', 'Filmstudio', 'Stanley Kubrick', 'Bill Kaysing', 'Apollo 11', 'Mondgestein', 'Van-Allen-Gürtel'],
    videoUrl: 'https://www.youtube.com/watch?v=KpuKuqc_DNc',
    relatedIds: ['t1', 't16', 'm7']
  },
  {
    id: 't16',
    title: 'JFK Attentat',
    shortDescription: 'Zapruder-Film Frame 313: Der Kopfschuss, der eine Nation traumatisierte. Warren Commission (1964): Oswald allein. House Select Committee (1979): „wahrscheinlich Verschwörung“. CIA-Mafia-Nexus (Operation Mongoose), Jack Rubys Live-TV-Mord, „Grassy Knoll“-Zeugen, „Magic Bullet“-Theorie (CE 399). Oliver Stones Film (1991) prägte öffentliche Wahrnehmung stärker als Fakten. Ur-Trauma des institutionellen Vertrauensverlusts.',
    category: Category.HISTORICAL,
    dangerLevel: DangerLevel.MEDIUM,
    popularity: 95,
    originYear: '1963',
    tags: ['CIA', 'Deep State', 'Kalter Krieg', 'Grassy Knoll', 'Warren Commission', 'Zapruder', 'Magic Bullet', 'Oliver Stone'],
    videoUrl: 'https://www.youtube.com/watch?v=hZ0XJ_V-gDw',
    relatedIds: ['t5', 't7', 't18', 'm6']
  },
  {
    id: 't24',
    title: 'Titanic-Versicherungsbetrug',
    shortDescription: 'Robin Gardiners These (1998): Nicht die Titanic sank, sondern ihr beschädigtes Schwesterschiff Olympic (nach HMS-Hawke-Kollision 1911), heimlich ausgetauscht für einen £10M-Versicherungsbetrug durch J.P. Morgan (der seine Buchung stornierte). Forensik widerlegt: Wrack-Seriennummern = Titanic. Faszination durch plausible Prämisse + reale Morgan-Stornierung + tragische Unterversicherung der Opfer.',
    category: Category.HISTORICAL,
    dangerLevel: DangerLevel.LOW,
    popularity: 65,
    originYear: '1912/1990er',
    tags: ['Schifffahrt', 'Betrug', 'JP Morgan', 'Unglück', 'Olympic', 'White Star Line', 'Robin Gardiner', 'Versicherung'],
    relatedIds: ['t16']
  },
  {
    id: 't26',
    title: 'Erfundene Zeit (Phantomzeit)',
    shortDescription: 'Heribert Illigs Hypothese (1991): 297 Jahre (614–911 n. Chr.) wurden erfunden — Karl der Große ist fiktiv, eingefügt durch Kalenderfälschung (Gregorianische Reform). Ignoriert: arabische/byzantinische/chinesische Parallelchronologien, Dendrochronologie, Eiskernbohrungen, astronomische Rückrechnungen (Sonnenfinsternisse). Faszinierendes Gedankenexperiment, historisch unhaltbar.',
    category: Category.HISTORICAL,
    dangerLevel: DangerLevel.LOW,
    popularity: 45,
    originYear: '1996 (Illig)',
    tags: ['Geschichte', 'Kalender', 'Mittelalter', 'Zeit', 'Heribert Illig', 'Karl der Große', 'Dendrochronologie', 'Gregorianische Reform'],
    relatedIds: ['t11', 't49']
  },
  {
    id: 't34',
    title: 'Die Freimaurer',
    shortDescription: 'Operative Steinmetz-Zünfte → spekulative Logen (1717, Grand Lodge of England). Tatsächlich: Aufklärungs-Netzwerk mit Ritual-Theater (Hiram-Legende, 33 Grade). Prominente Mitglieder (Washington, Mozart, Göthe) nähren Elite-Narrativ. Dollar-Pyramide („Annuit Coeptis“) und Washington D.C.-Stadtplan als angeblicher Freimaurer-Bauplan. Real: Philantropie-Clubs mit abnehmendem Einfluss.',
    category: Category.HISTORICAL,
    dangerLevel: DangerLevel.LOW,
    popularity: 88,
    originYear: '1717',
    tags: ['Geheimbund', 'Architektur', 'Rituale', 'Geschichte', 'Grand Lodge', 'Hiram Abiff', 'Dollar-Pyramide', 'Washington D.C.'],
    relatedIds: ['t5', 't35', 't25', 't45', 't54']
  },
  {
    id: 't36',
    title: 'Die Jesuiten-Verschwörung',
    shortDescription: 'Societas Jesu (1540, Ignatius von Loyola): Mächtigster katholischer Orden wird als päpstlicher Geheimdienst gedeutet. „Schwarzer Papst“ (Generaloberer) als angeblicher Schattenherrscher über den Vatikan. Historisch: Jesuiten leiteten Gegenreformation, unterwanderten Monarchien (Confessores), wurden 1773–1814 selbst verboten. Heute: Papst Franziskus ist erster Jesuiten-Papst — nährt Narrativ.',
    category: Category.HISTORICAL,
    dangerLevel: DangerLevel.LOW,
    popularity: 40,
    originYear: '16. Jh',
    tags: ['Religion', 'Kirche', 'Vatikan', 'Macht', 'Schwarzer Papst', 'Ignatius von Loyola', 'Gegenreformation', 'Papst Franziskus'],
    relatedIds: ['t34', 't5', 'm18']
  },
  {
    id: 't45',
    title: 'Skull & Bones',
    shortDescription: 'Studentenverbindung „Orden 322“ (Yale, 1832, gegründet von William Huntington Russell). 15 Neuzugänge pro Jahr, lebenslange Mitgliedschaft. Alumni: George H.W. Bush, George W. Bush, John Kerry (2004er Präsidentschaftswahl = Bones vs. Bones). „Tomb“-Hauptquartier auf dem Campus. Tatsächlich: Elite-Nepotismus-Netzwerk — verschworen weniger als privilegiert. Transparenter als behauptet (IRS-Steuerdaten öffentlich).',
    category: Category.HISTORICAL,
    dangerLevel: DangerLevel.LOW,
    popularity: 75,
    originYear: '1832',
    tags: ['Geheimbund', 'Yale', 'Elite', 'Politik', 'Orden 322', 'Bush-Familie', 'John Kerry', 'The Tomb'],
    relatedIds: ['t34', 't35', 't16']
  },
  {
    id: 't49',
    title: 'Tartaria (Mudflood)',
    shortDescription: 'TikTok/Reddit-Phänomen (2016+): Ein vergessenes, hochentwickeltes Weltreich („Groß-Tartarien“, bis 19. Jh.) beherrschte Eurasien mit freier Energie und ätherischer Architektur. „Mudflood“ begrub dessen Gebäude (erklärt halb-unterirdische Fenster alter Gebäude). Missdeutet: Kartografiegeschichte, Architektur-Stile, natürliche Bodensenkung. Gen-Z-Gateway-Verschwörung mit starker Ästhetik-Komponente.',
    category: Category.HISTORICAL,
    dangerLevel: DangerLevel.LOW,
    popularity: 60,
    originYear: '2016 (Revival)',
    tags: ['Architektur', 'Revisionismus', 'Geschichte', 'Internet', 'Freie Energie', 'TikTok', 'Alte Karten', 'Star Forts'],
    relatedIds: ['t26', 't11', 't69']
  },
  {
    id: 't53',
    title: 'Karte des Piri Reis',
    shortDescription: 'Osmanischer Admiral Piri Reis kompilierte 1513 eine Weltkarte aus älteren Quellen (behauptete: Kolumbus-Karten). Charles Hapgood (1966) interpretierte Südrand als eisfreie Antarktis-Küste — impliziert Kartografie-Wissen einer verlorenen Zivilisation. Tatsächlich: Südamerika-Küste nach Süden gebogen (große Pergamente = verzerrte Projektion). Faszinierendes Artefakt, spekulative Überinterpretation.',
    category: Category.HISTORICAL,
    dangerLevel: DangerLevel.LOW,
    popularity: 72,
    originYear: '1513',
    tags: ['Kartografie', 'Antarktis', 'OOPART', 'Geschichte', 'Piri Reis', 'Charles Hapgood', 'Osmanisches Reich', 'Verlorene Zivilisation'],
    relatedIds: ['t11', 't56', 't19']
  },
  {
    id: 't54',
    title: 'Die Tempelritter',
    shortDescription: 'Pauperes commilitones Christi (1119–1312): Militärischer Mönchsorden, der zum ersten multinationalen Bankhaus wurde. Freitag der 13. (1307): Philipp IV. vernichtete den Orden, um Schulden zu tilgen. Legendenbildung: Heiliger Gral, Bundeslade, Baphomet-Kult, Überleben in Schottland (Rosslyn Chapel), Freimaurerei als Nachfolge. Dan Browns Milliardenfranchise profitierte direkt.',
    category: Category.HISTORICAL,
    dangerLevel: DangerLevel.LOW,
    popularity: 89,
    originYear: '1312',
    tags: ['Geheimbund', 'Religion', 'Mittelalter', 'Schatz', 'Heiliger Gral', 'Baphomet', 'Rosslyn Chapel', 'Freitag der 13.'],
    relatedIds: ['t34', 't35', 't11', 'm17']
  },
  {
    id: 't60',
    title: 'Shakespeare-Autorschaft',
    shortDescription: 'Anti-Stratfordianismus (seit 1857, Delia Bacon): Ein Handschuhmachers Sohn aus Stratford konnte unmöglich so gelehrt schreiben. Kandidaten: Francis Bacon (Akrostichon-„Beweise“), Edward de Vere (17. Earl of Oxford, Biografie-Parallelen), Christopher Marlowe (angeblich Fake-Tod). Ignoriert: Elisabethanische Grammar Schools waren exzellent, Ben Jonson bezeugte Shakespeare persönlich. Akademischer Snobismus als Theorie.',
    category: Category.HISTORICAL,
    dangerLevel: DangerLevel.LOW,
    popularity: 55,
    originYear: '19. Jh',
    tags: ['Literatur', 'Bacon', 'Geschichte', 'Code', 'Edward de Vere', 'Christopher Marlowe', 'Anti-Stratfordianismus', 'Delia Bacon'],
    relatedIds: ['t34']
  },
  {
    id: 't67',
    title: 'Lost Cosmonauts',
    shortDescription: 'Judica-Cordiglia-Brüder (Turin, 1960er): Behaupteten, Funkrufe sterbender sowjetischer Kosmonauten vor Gagarin empfangen zu haben. UdSSR-Geheimhaltung (Nedelin-Katastrophe 1960 tatsächlich vertuscht) machte These plausibel. Keine unabhängige Bestätigung, Audio-Analyse zeigt Inkonsistenzen. Fasziniert durch Kalten-Krieg-Paranoia und reale sowjetische Intransparenz.',
    category: Category.HISTORICAL,
    dangerLevel: DangerLevel.LOW,
    popularity: 65,
    originYear: '1960er',
    tags: ['Raumfahrt', 'Sowjetunion', 'Kalter Krieg', 'Funk', 'Judica-Cordiglia', 'Gagarin', 'Nedelin-Katastrophe', 'Turin'],
    relatedIds: ['t4', 't13']
  },
  {
    id: 't71',
    title: 'Pearl Harbor Vorwissen',
    shortDescription: 'Stinnett-These („Day of Deceit“, 2000): FDR kannte den japanischen Angriff (7.12.1941) durch entschlüsselte „Purple“-Kommunikation und ließ ihn zu, um Isolationismus zu überwinden. McCollum-Memo (1940) als angeblicher 8-Punkte-Provokationsplan. Historiker-Konsens: Nachrichtendienst-Versagen, nicht Verschwörung — MAGIC-Entschlüsselung lieferte taktische, nicht strategische Details. Prototyp der „Let-it-happen“-Theorie.',
    category: Category.HISTORICAL,
    dangerLevel: DangerLevel.MEDIUM,
    popularity: 78,
    originYear: '1941',
    tags: ['Krieg', 'False Flag', 'USA', 'Militär', 'McCollum-Memo', 'MAGIC', 'Robert Stinnett', 'Isolationismus'],
    relatedIds: ['t18', 't16']
  }
];

export const HISTORICAL_THEORIES_EN: Theory[] = [
  {
    id: 't4',
    title: 'Moon Landing Fake',
    shortDescription: 'Bill Kaysing\'s "We Never Went to the Moon" (1974) founded the myth: studio staging by Stanley Kubrick for Cold War prestige. "Evidence": waving flag (torsion pendulum), missing stars (exposure time), identical hills (limited lunar topography). 382 kg of moon rocks, laser reflectors, and independent Soviet confirmation refute it. Still persistent: 6% of Americans believe it (Gallup 2019).',
    category: CategoryEn.HISTORICAL,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 70,
    originYear: '1974',
    tags: ['NASA', 'Cold War', 'Studio', 'Stanley Kubrick', 'Bill Kaysing', 'Apollo 11', 'Moon Rocks', 'Van Allen Belt'],
    videoUrl: 'https://www.youtube.com/watch?v=KpuKuqc_DNc',
    relatedIds: ['t1', 't16', 'm7']
  },
  {
    id: 't16',
    title: 'JFK Assassination',
    shortDescription: 'Zapruder Film Frame 313: The headshot that traumatized a nation. Warren Commission (1964): Oswald alone. House Select Committee (1979): "probably conspiracy." CIA-Mafia nexus (Operation Mongoose), Jack Ruby\'s live TV murder, "Grassy Knoll" witnesses, "Magic Bullet" theory (CE 399). Oliver Stone\'s film (1991) shaped public perception more than facts. Ur-trauma of institutional trust collapse.',
    category: CategoryEn.HISTORICAL,
    dangerLevel: DangerLevelEn.MEDIUM,
    popularity: 95,
    originYear: '1963',
    tags: ['CIA', 'Deep State', 'Cold War', 'Grassy Knoll', 'Warren Commission', 'Zapruder', 'Magic Bullet', 'Oliver Stone'],
    videoUrl: 'https://www.youtube.com/watch?v=hZ0XJ_V-gDw',
    relatedIds: ['t5', 't7', 't18', 'm6']
  },
  {
    id: 't24',
    title: 'Titanic Switch',
    shortDescription: 'Robin Gardiner\'s thesis (1998): Not the Titanic but her damaged sister ship Olympic (after HMS Hawke collision 1911) sank, secretly swapped for a £10M insurance fraud by J.P. Morgan (who cancelled his booking). Forensics refute: wreck serial numbers = Titanic. Fascination through plausible premise + real Morgan cancellation + tragically underinsured victims.',
    category: CategoryEn.HISTORICAL,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 65,
    originYear: '1912/1990s',
    tags: ['Maritime', 'Fraud', 'JP Morgan', 'Disaster', 'Olympic', 'White Star Line', 'Robin Gardiner', 'Insurance'],
    relatedIds: ['t16']
  },
  {
    id: 't26',
    title: 'Phantom Time Hypothesis',
    shortDescription: 'Heribert Illig\'s hypothesis (1991): 297 years (614–911 AD) were fabricated — Charlemagne is fictional, inserted through calendar forgery (Gregorian Reform). Ignores: Arabic/Byzantine/Chinese parallel chronologies, dendrochronology, ice core samples, astronomical back-calculations (solar eclipses). Fascinating thought experiment, historically untenable.',
    category: CategoryEn.HISTORICAL,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 45,
    originYear: '1996 (Illig)',
    tags: ['History', 'Calendar', 'Middle Ages', 'Time', 'Heribert Illig', 'Charlemagne', 'Dendrochronology', 'Gregorian Reform'],
    relatedIds: ['t11', 't49']
  },
  {
    id: 't34',
    title: 'The Freemasons',
    shortDescription: 'Operative stonemason guilds → speculative lodges (1717, Grand Lodge of England). Actually: Enlightenment network with ritual theater (Hiram legend, 33 degrees). Prominent members (Washington, Mozart, Goethe) nourish elite narrative. Dollar pyramid ("Annuit Coeptis") and Washington D.C. city plan as alleged Masonic blueprint. Reality: philanthropy clubs with declining influence.',
    category: CategoryEn.HISTORICAL,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 88,
    originYear: '1717',
    tags: ['Secret Society', 'Architecture', 'Rituals', 'History', 'Grand Lodge', 'Hiram Abiff', 'Dollar Pyramid', 'Washington D.C.'],
    relatedIds: ['t5', 't35', 't25', 't45', 't54']
  },
  {
    id: 't36',
    title: 'The Jesuit Conspiracy',
    shortDescription: 'Societas Jesu (1540, Ignatius of Loyola): Most powerful Catholic order interpreted as papal intelligence service. "Black Pope" (Superior General) as alleged shadow ruler over the Vatican. Historically: Jesuits led Counter-Reformation, infiltrated monarchies (confessors), were themselves banned 1773–1814. Today: Pope Francis is first Jesuit pope — nourishes narrative.',
    category: CategoryEn.HISTORICAL,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 40,
    originYear: '16th C',
    tags: ['Religion', 'Church', 'Vatican', 'Power', 'Black Pope', 'Ignatius of Loyola', 'Counter-Reformation', 'Pope Francis'],
    relatedIds: ['t34', 't5', 'm18']
  },
  {
    id: 't45',
    title: 'Skull & Bones',
    shortDescription: 'Student society "Order 322" (Yale, 1832, founded by William Huntington Russell). 15 new members per year, lifelong membership. Alumni: George H.W. Bush, George W. Bush, John Kerry (2004 presidential race = Bones vs. Bones). "Tomb" headquarters on campus. Actually: elite nepotism network — less conspired than privileged. More transparent than claimed (IRS tax data public).',
    category: CategoryEn.HISTORICAL,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 75,
    originYear: '1832',
    tags: ['Secret Society', 'Yale', 'Elite', 'Politics', 'Order 322', 'Bush Family', 'John Kerry', 'The Tomb'],
    relatedIds: ['t34', 't35', 't16']
  },
  {
    id: 't49',
    title: 'Tartaria (Mudflood)',
    shortDescription: 'TikTok/Reddit phenomenon (2016+): A forgotten, technologically advanced empire ("Grand Tartaria," until 19th century) ruled Eurasia with free energy and ethereal architecture. "Mudflood" buried its buildings (explains half-underground windows of old buildings). Misinterprets: cartographic history, architectural styles, natural ground subsidence. Gen-Z gateway conspiracy with strong aesthetics component.',
    category: CategoryEn.HISTORICAL,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 60,
    originYear: '2016 (Revival)',
    tags: ['Architecture', 'Revisionism', 'History', 'Internet', 'Free Energy', 'TikTok', 'Old Maps', 'Star Forts'],
    relatedIds: ['t26', 't11', 't69']
  },
  {
    id: 't53',
    title: 'Piri Reis Map',
    shortDescription: 'Ottoman Admiral Piri Reis compiled a 1513 world map from older sources (claimed: Columbus maps). Charles Hapgood (1966) interpreted the southern edge as ice-free Antarctic coastline — implying cartographic knowledge of a lost civilization. Actually: South American coast bent southward (large parchments = distorted projection). Fascinating artifact, speculative overinterpretation.',
    category: CategoryEn.HISTORICAL,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 72,
    originYear: '1513',
    tags: ['Cartography', 'Antarctica', 'OOPART', 'History', 'Piri Reis', 'Charles Hapgood', 'Ottoman Empire', 'Lost Civilization'],
    relatedIds: ['t11', 't56', 't19']
  },
  {
    id: 't54',
    title: 'Knights Templar',
    shortDescription: 'Pauperes commilitones Christi (1119–1312): Military monastic order that became the first multinational bank. Friday the 13th (1307): Philip IV destroyed the order to cancel debts. Legend-building: Holy Grail, Ark of the Covenant, Baphomet cult, survival in Scotland (Rosslyn Chapel), Freemasonry as succession. Dan Brown\'s billion-dollar franchise profited directly.',
    category: CategoryEn.HISTORICAL,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 89,
    originYear: '1312',
    tags: ['Secret Society', 'Religion', 'Middle Ages', 'Treasure', 'Holy Grail', 'Baphomet', 'Rosslyn Chapel', 'Friday the 13th'],
    relatedIds: ['t34', 't35', 't11', 'm17']
  },
  {
    id: 't60',
    title: 'Shakespeare Authorship',
    shortDescription: 'Anti-Stratfordianism (since 1857, Delia Bacon): A glovemaker\'s son from Stratford couldn\'t possibly write so learnedly. Candidates: Francis Bacon (acrostic "evidence"), Edward de Vere (17th Earl of Oxford, biography parallels), Christopher Marlowe (alleged faked death). Ignores: Elizabethan grammar schools were excellent, Ben Jonson personally attested Shakespeare. Academic snobbery as theory.',
    category: CategoryEn.HISTORICAL,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 55,
    originYear: '19th C',
    tags: ['Literature', 'Bacon', 'History', 'Code', 'Edward de Vere', 'Christopher Marlowe', 'Anti-Stratfordianism', 'Delia Bacon'],
    relatedIds: ['t34']
  },
  {
    id: 't67',
    title: 'Lost Cosmonauts',
    shortDescription: 'Judica-Cordiglia brothers (Turin, 1960s): Claimed to have received radio calls from dying Soviet cosmonauts before Gagarin. USSR secrecy (Nedelin catastrophe 1960 actually covered up) made thesis plausible. No independent confirmation, audio analysis shows inconsistencies. Fascinating through Cold War paranoia and real Soviet opacity.',
    category: CategoryEn.HISTORICAL,
    dangerLevel: DangerLevelEn.LOW,
    popularity: 65,
    originYear: '1960s',
    tags: ['Space', 'USSR', 'Cold War', 'Radio', 'Judica-Cordiglia', 'Gagarin', 'Nedelin Catastrophe', 'Turin'],
    relatedIds: ['t4', 't13']
  },
  {
    id: 't71',
    title: 'Pearl Harbor Advance Knowledge',
    shortDescription: 'Stinnett thesis ("Day of Deceit," 2000): FDR knew about the Japanese attack (Dec 7, 1941) through decrypted "Purple" communications and allowed it to overcome isolationism. McCollum Memo (1940) as alleged 8-point provocation plan. Historian consensus: intelligence failure, not conspiracy — MAGIC decryption provided tactical, not strategic details. Prototype of the "let-it-happen" theory.',
    category: CategoryEn.HISTORICAL,
    dangerLevel: DangerLevelEn.MEDIUM,
    popularity: 78,
    originYear: '1941',
    tags: ['War', 'False Flag', 'USA', 'Military', 'McCollum Memo', 'MAGIC', 'Robert Stinnett', 'Isolationism'],
    relatedIds: ['t18', 't16']
  }
];
