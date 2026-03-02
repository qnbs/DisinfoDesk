
import { Author } from '../types';

type SeedAuthor = Pick<Author,
  'id' |
  'name' |
  'lifespan' |
  'nationality' |
  'imagePlaceholder' |
  'bioDe' |
  'bioEn' |
  'focusAreas' |
  'keyWorks' |
  'influenceLevel'
>;

const RAW_AUTHORS_DATA: SeedAuthor[] = [
  {
    id: 'a1',
    name: 'Antony C. Sutton',
    lifespan: '1925–2002',
    nationality: 'British-American',
    imagePlaceholder: 'AS',
    bioDe: 'Antony Cyril Sutton war ein Ökonom und Historiker, der vor allem für seine detaillierten Studien über die Unterstützung westlicher Wall-Street-Banken für totalitäre Regime bekannt ist. Er argumentierte, dass westliche Technologie und Finanzierung sowohl den Aufstieg der Sowjetunion als auch Nazi-Deutschlands ermöglichten.',
    bioEn: 'Antony Cyril Sutton was an economist and historian best known for his detailed studies of Western Wall Street banking support for totalitarian regimes. He argued that Western technology and financing enabled the rise of both the Soviet Union and Nazi Germany.',
    focusAreas: ['Economics', 'History', 'Wall Street', 'Secret Societies'],
    keyWorks: [
      'Wall Street and the Bolshevik Revolution (1974)',
      'Wall Street and the Rise of Hitler (1976)',
      'America\'s Secret Establishment: An Introduction to the Order of Skull & Bones (1983)'
    ],
    influenceLevel: 85
  },
  {
    id: 'a2',
    name: 'Gary Allen',
    lifespan: '1936–1986',
    nationality: 'American',
    imagePlaceholder: 'GA',
    bioDe: 'Gary Allen war ein konservativer Journalist und Aktivist der John Birch Society. Sein Buch "Die Insider" verkaufte sich millionenfach und popularisierte die Theorie, dass eine kleine Gruppe internationaler Bankiers (u.a. Rockefeller) die Weltpolitik steuert, um eine sozialistische Weltregierung zu errichten.',
    bioEn: 'Gary Allen was a conservative journalist and activist for the John Birch Society. His book "None Dare Call It Conspiracy" sold millions and popularized the theory that a small group of international bankers (including Rockefeller) control world politics to establish a socialist world government.',
    focusAreas: ['Politics', 'NWO', 'Banking'],
    keyWorks: [
      'None Dare Call It Conspiracy (1971)',
      'The Rockefeller File (1976)'
    ],
    influenceLevel: 80
  },
  {
    id: 'a3',
    name: 'Carroll Quigley',
    lifespan: '1910–1977',
    nationality: 'American',
    imagePlaceholder: 'CQ',
    bioDe: 'Quigley war Historiker an der Georgetown University und Mentor von Bill Clinton. Er ist kein klassischer Verschwörungstheoretiker, aber sein Werk "Tragedy and Hope" wird oft zitiert, da er darin die Existenz eines anglo-amerikanischen Elite-Netzwerks (Round Table Groups) bestätigte, dem er nahestand, dessen Ziele er jedoch nicht als bösartig ansah.',
    bioEn: 'Quigley was a historian at Georgetown University and mentor to Bill Clinton. He is not a classic conspiracy theorist, but his work "Tragedy and Hope" is often cited because he confirmed the existence of an Anglo-American elite network (Round Table Groups), which he was close to, but whose goals he did not view as malicious.',
    focusAreas: ['History', 'Geopolitics', 'Academia'],
    keyWorks: [
      'Tragedy and Hope: A History of the World in Our Time (1966)',
      'The Anglo-American Establishment (1981)'
    ],
    influenceLevel: 90
  },
  {
    id: 'a4',
    name: 'William Cooper',
    lifespan: '1943–2001',
    nationality: 'American',
    imagePlaceholder: 'WC',
    bioDe: 'William "Bill" Cooper war ein ehemaliger Marinegeheimdienstler und Radiomoderator. Sein Buch "Behold a Pale Horse" ist eine Bibel der modernen Verschwörungskultur, die UFOs, JFK und die Neue Weltordnung verbindet. Er sagte angeblich 9/11 voraus (Juni 2001) und starb bei einer Schießerei mit der Polizei.',
    bioEn: 'William "Bill" Cooper was a former Naval Intelligence Briefing Team member and radio host. His book "Behold a Pale Horse" is a bible of modern conspiracy culture, linking UFOs, JFK, and the New World Order. He allegedly predicted 9/11 (June 2001) and died in a shootout with police.',
    focusAreas: ['UFOs', 'NWO', 'Secret Government', 'Milab'],
    keyWorks: [
      'Behold a Pale Horse (1991)'
    ],
    influenceLevel: 95
  },
  {
    id: 'a5',
    name: 'David Icke',
    lifespan: '1952–Present',
    nationality: 'British',
    imagePlaceholder: 'DI',
    bioDe: 'Ehemaliger Fußballprofi und Sportreporter, der zur bekanntesten Figur der modernen Verschwörungsszene wurde. Er ist der Urheber der Theorie, dass reptiloide Wesen (die "Archonten") aus einer anderen Dimension die Weltelite unterwandert haben und sich durch menschliche negative Energie ernähren.',
    bioEn: 'Former professional footballer and sports broadcaster who became the most prominent figure in the modern conspiracy scene. He is the originator of the theory that reptilian beings (the "Archons") from another dimension have infiltrated the global elite and feed off human negative energy.',
    focusAreas: ['Reptilians', 'Spirituality', 'NWO', 'Simulation Theory'],
    keyWorks: [
      'The Biggest Secret (1999)',
      'Children of the Matrix (2001)',
      'Human Race Get Off Your Knees (2010)'
    ],
    influenceLevel: 98
  },
  {
    id: 'a6',
    name: 'Jim Marrs',
    lifespan: '1943–2017',
    nationality: 'American',
    imagePlaceholder: 'JM',
    bioDe: 'Jim Marrs war ein Journalist der New York Times Bestsellerliste. Sein Buch "Crossfire" war eine Hauptquelle für Oliver Stones Film "JFK". Er schrieb umfassend über UFOs, Telepathie, Geheimbünde und Nazi-Technologie.',
    bioEn: 'Jim Marrs was a New York Times bestselling journalist. His book "Crossfire" was a primary source for Oliver Stone\'s film "JFK". He wrote extensively on UFOs, telepathy, secret societies, and Nazi technology.',
    focusAreas: ['JFK', 'UFOs', 'Secret Societies', 'Remote Viewing'],
    keyWorks: [
      'Crossfire: The Plot That Killed Kennedy (1989)',
      'Rule by Secrecy (2000)',
      'Alien Agenda (1997)'
    ],
    influenceLevel: 88
  },
  {
    id: 'a7',
    name: 'G. Edward Griffin',
    lifespan: '1931–Present',
    nationality: 'American',
    imagePlaceholder: 'GG',
    bioDe: 'Filmproduzent und Autor, der sich auf politische und wirtschaftliche Verschwörungen konzentriert. Sein Hauptwerk "The Creature from Jekyll Island" kritisiert die Federal Reserve als privates Bankenkartell, das Inflation erzeugt und Kriege finanziert.',
    bioEn: 'Film producer and author focusing on political and economic conspiracies. His magnum opus "The Creature from Jekyll Island" critiques the Federal Reserve as a private banking cartel that creates inflation and funds wars.',
    focusAreas: ['Federal Reserve', 'Banking', 'Cancer/Health', 'Collectivism'],
    keyWorks: [
      'The Creature from Jekyll Island (1994)',
      'World Without Cancer (1974)'
    ],
    influenceLevel: 85
  },
  {
    id: 'a8',
    name: 'F. William Engdahl',
    lifespan: '1944–Present',
    nationality: 'American/German',
    imagePlaceholder: 'WE',
    bioDe: 'Ein strategischer Risiko-Berater und Autor, der in Deutschland lebt. Er analysiert Geopolitik aus der Perspektive von Öl-Interessen, Nahrungsmittelkontrolle (Gentechnik) und US-Hegemonie.',
    bioEn: 'A strategic risk consultant and author living in Germany. He analyzes geopolitics from the perspective of oil interests, food control (GMOs), and US hegemony.',
    focusAreas: ['Geopolitics', 'Oil', 'GMOs', 'Color Revolutions'],
    keyWorks: [
      'A Century of War: Anglo-American Oil Politics (1992)',
      'Seeds of Destruction (2007)'
    ],
    influenceLevel: 75
  },
  {
    id: 'a9',
    name: 'John Coleman',
    lifespan: '1935–Unknown',
    nationality: 'British',
    imagePlaceholder: 'JC',
    bioDe: 'Angeblicher ehemaliger MI6-Offizier. Er popularisierte den Begriff "Komitee der 300" – eine Gruppe, die über den Bilderbergern stehen soll und die Weltgeschicke lenkt. Er kritisierte auch den Einfluss der Beatles und der Rockmusik als soziale Manipulation.',
    bioEn: 'Alleged former MI6 intelligence officer. He popularized the term "Committee of 300" – a group supposedly ranking above the Bilderbergers controlling world affairs. He also criticized the influence of the Beatles and rock music as social engineering.',
    focusAreas: ['Committee of 300', 'Music Industry', 'Social Engineering'],
    keyWorks: [
      'Conspirators\' Hierarchy: The Story of the Committee of 300 (1992)'
    ],
    influenceLevel: 70
  },
  {
    id: 'a10',
    name: 'Eustace Mullins',
    lifespan: '1923–2010',
    nationality: 'American',
    imagePlaceholder: 'EM',
    bioDe: 'Ein Protegé des Dichters Ezra Pound. Mullins schrieb das erste Buch, das die Federal Reserve als Verschwörung darstellte. Sein Werk ist oft antisemitisch geprägt und konzentriert sich auf die "biologische" Kriegsführung gegen die Menschheit.',
    bioEn: 'A protégé of poet Ezra Pound. Mullins wrote the first book depicting the Federal Reserve as a conspiracy. His work is often antisemitic and focuses on "biological" warfare against humanity.',
    focusAreas: ['Banking', 'Health', 'Federal Reserve'],
    keyWorks: [
      'The Secrets of the Federal Reserve (1952)',
      'Murder by Injection (1988)'
    ],
    influenceLevel: 75
  },
  {
    id: 'a11',
    name: 'Joseph P. Farrell',
    lifespan: '1957–Present',
    nationality: 'American',
    imagePlaceholder: 'JF',
    bioDe: 'Theologe und Forscher, der komplexe Verbindungen zwischen Nazi-Technologie (Die Glocke), alter Physik (Gizeh-Pyramide als Waffe) und moderner Finanzpolitik zieht. Er vertritt die These einer "Breakaway Civilization".',
    bioEn: 'Theologian and researcher drawing complex connections between Nazi technology (The Bell), ancient physics (Giza Pyramid as a weapon), and modern financial politics. He proposes the thesis of a "Breakaway Civilization".',
    focusAreas: ['Nazi Tech', 'Physics', 'Ancient History', 'Finance'],
    keyWorks: [
      'The Giza Death Star (2001)',
      'Reich of the Black Sun (2004)',
      'Babylon\'s Banksters (2010)'
    ],
    influenceLevel: 82
  },
  {
    id: 'a12',
    name: 'Steve Quayle',
    lifespan: 'Unknown',
    nationality: 'American',
    imagePlaceholder: 'SQ',
    bioDe: 'Radiomoderator und Autor mit Fokus auf biblische Prophetie, Riesen (Nephilim) und Transhumanismus. Er warnt vor genetischer Manipulation und dem Ende der Menschheit durch dämonische Kräfte.',
    bioEn: 'Radio host and author focusing on biblical prophecy, giants (Nephilim), and transhumanism. He warns of genetic manipulation and the end of humanity through demonic forces.',
    focusAreas: ['Giants', 'Biblical Prophecy', 'Bio-Warfare'],
    keyWorks: [
      'Genesis 6 Giants (2002)',
      'Xenogenesis (2014)'
    ],
    influenceLevel: 65
  },
  {
    id: 'a13',
    name: 'William Bramley',
    lifespan: 'Unknown',
    nationality: 'American',
    imagePlaceholder: 'WB',
    bioDe: 'Autor von "Die Götter von Eden". Er begann eine Studie über die Ursachen von Kriegen und kam zu dem Schluss, dass die Menschheit von einer außerirdischen Spezies ("Custodians") manipuliert wird, um Konflikte zu erzeugen.',
    bioEn: 'Author of "The Gods of Eden". He began a study on the causes of war and concluded that humanity is manipulated by an extraterrestrial species ("Custodians") to generate conflict.',
    focusAreas: ['Aliens', 'War', 'History'],
    keyWorks: [
      'The Gods of Eden (1989)'
    ],
    influenceLevel: 70
  },
  {
    id: 'a14',
    name: 'Zecharia Sitchin',
    lifespan: '1920–2010',
    nationality: 'Azerbaijani-American',
    imagePlaceholder: 'ZS',
    bioDe: 'Übersetzte sumerische Keilschrifttafeln (umstritten) und behauptete, die Menschheit sei von den Anunnaki vom Planeten Nibiru als Arbeitssklaven gentechnisch erschaffen worden.',
    bioEn: 'Translated Sumerian cuneiform tablets (controversially) and claimed humanity was genetically engineered by the Anunnaki from the planet Nibiru to serve as slave labor.',
    focusAreas: ['Ancient Aliens', 'Sumerian', 'Nibiru', 'Anunnaki'],
    keyWorks: [
      'The 12th Planet (1976)',
      'The Stairway to Heaven (1980)'
    ],
    influenceLevel: 95
  },
  {
    id: 'a15',
    name: 'Jacques Vallée',
    lifespan: '1939–Present',
    nationality: 'French-American',
    imagePlaceholder: 'JV',
    bioDe: 'Informatiker und Astronom. Einer der respektiertesten Ufologen, der jedoch die "extraterrestrische Hypothese" ablehnt und stattdessen eine "interdimensionale" Erklärung vorschlägt (UFOs als Kontrollsystem des Bewusstseins). Vorbild für den Forscher in "Close Encounters".',
    bioEn: 'Computer scientist and astronomer. One of the most respected ufologists, who rejects the "extraterrestrial hypothesis" in favor of an "interdimensional" explanation (UFOs as a consciousness control system). Inspiration for the researcher in "Close Encounters".',
    focusAreas: ['UFOs', 'Consciousness', 'Folklore'],
    keyWorks: [
      'Passport to Magonia (1969)',
      'Messengers of Deception (1979)'
    ],
    influenceLevel: 90
  },
  {
    id: 'a16',
    name: 'John Keel',
    lifespan: '1930–2009',
    nationality: 'American',
    imagePlaceholder: 'JK',
    bioDe: 'Journalist und Forscher des Paranormalen. Er prägte den Begriff "Ultraterrestrials" und untersuchte den Mothman-Mythos. Für Keel sind UFOs, Geister und Monster Manifestationen derselben manipulativen Kraft.',
    bioEn: 'Journalist and researcher of the paranormal. He coined the term "Ultraterrestrials" and investigated the Mothman myth. For Keel, UFOs, ghosts, and monsters are manifestations of the same manipulative force.',
    focusAreas: ['Mothman', 'Ultraterrestrials', 'Fortiana'],
    keyWorks: [
      'The Mothman Prophecies (1975)',
      'Operation Trojan Horse (1970)'
    ],
    influenceLevel: 85
  },
  {
    id: 'a17',
    name: 'John Mack',
    lifespan: '1929–2004',
    nationality: 'American',
    imagePlaceholder: 'JMa',
    bioDe: 'Psychiater an der Harvard Medical School und Pulitzer-Preisträger. Er untersuchte Hunderte Fälle von angeblichen Alien-Entführungen und kam zu dem Schluss, dass das Phänomen real ist und eine spirituelle Transformation darstellt.',
    bioEn: 'Psychiatrist at Harvard Medical School and Pulitzer Prize winner. He investigated hundreds of cases of alleged alien abductions and concluded that the phenomenon is real and represents a spiritual transformation.',
    focusAreas: ['Abductions', 'Psychiatry', 'Spirituality'],
    keyWorks: [
      'Abduction: Human Encounters with Aliens (1994)'
    ],
    influenceLevel: 80
  },
  {
    id: 'a18',
    name: 'Erich von Däniken',
    lifespan: '1935–Present',
    nationality: 'Swiss',
    imagePlaceholder: 'EvD',
    bioDe: 'Der Vater der Prä-Astronautik. Er popularisierte die Idee, dass antike Götter in Wirklichkeit Außerirdische waren, die die frühe Menschheit technologisch beeinflussten (Paläo-SETI).',
    bioEn: 'The father of ancient astronaut theory. He popularized the idea that ancient gods were actually extraterrestrials who influenced early humanity technologically (Paleo-SETI).',
    focusAreas: ['Ancient Aliens', 'Archaeology', 'Mythology'],
    keyWorks: [
      'Chariots of the Gods? (1968)',
      'The Gold of the Gods (1972)'
    ],
    influenceLevel: 99
  },
  {
    id: 'a19',
    name: 'Graham Hancock',
    lifespan: '1950–Present',
    nationality: 'British',
    imagePlaceholder: 'GH',
    bioDe: 'Journalist, der die Existenz einer vergessenen, hochentwickelten Zivilisation postuliert, die vor ca. 12.000 Jahren durch eine Katastrophe unterging. Er verbindet Archäologie mit Bewusstseinsforschung (Ayahuasca).',
    bioEn: 'Journalist who postulates the existence of a forgotten, advanced civilization that was destroyed by a cataclysm approx. 12,000 years ago. He connects archaeology with consciousness research (Ayahuasca).',
    focusAreas: ['Lost Civilizations', 'Ancient Apocalypse', 'Consciousness'],
    keyWorks: [
      'Fingerprints of the Gods (1995)',
      'Supernatural (2005)'
    ],
    influenceLevel: 95
  },
  {
    id: 'a20',
    name: 'Robert Bauval',
    lifespan: '1948–Present',
    nationality: 'Belgian',
    imagePlaceholder: 'RB',
    bioDe: 'Ingenieur und Ägyptologe, bekannt für die "Orion-Korrelationstheorie". Er behauptet, die Pyramiden von Gizeh seien exakt nach dem Gürtel des Orion ausgerichtet, aber zu einem Zeitpunkt (10.500 v. Chr.), der der offiziellen Datierung widerspricht.',
    bioEn: 'Engineer and Egyptologist known for the "Orion Correlation Theory". He claims the Giza pyramids are aligned exactly with Orion\'s Belt, but at a date (10,500 BC) that contradicts official dating.',
    focusAreas: ['Egyptology', 'Astronomy', 'Giza'],
    keyWorks: [
      'The Orion Mystery (1994)'
    ],
    influenceLevel: 80
  },
  {
    id: 'a21',
    name: 'Andrew Collins',
    lifespan: '1957–Present',
    nationality: 'British',
    imagePlaceholder: 'AC',
    bioDe: 'Forscher, der sich auf die Ursprünge der Zivilisation und Schamanismus spezialisiert hat. Er schlug vor, dass die "Watcher" oder "Nephilim" eine hybride Elite aus Göbekli Tepe waren (Denisova-Menschen).',
    bioEn: 'Researcher specializing in the origins of civilization and shamanism. He proposed that the "Watchers" or "Nephilim" were a hybrid elite from Göbekli Tepe (Denisovan humans).',
    focusAreas: ['Göbekli Tepe', 'Nephilim', 'Atlantis'],
    keyWorks: [
      'From the Ashes of Angels (1996)',
      'Gobekli Tepe: Genesis of the Gods (2014)'
    ],
    influenceLevel: 70
  },
  {
    id: 'a22',
    name: 'Giorgio A. Tsoukalos',
    lifespan: '1978–Present',
    nationality: 'Swiss-Greek',
    imagePlaceholder: 'GT',
    bioDe: 'Herausgeber und Fernsehpersönlichkeit ("Ancient Aliens"). Als Schüler von Däniken wurde er durch sein meme-würdiges Aussehen und seine enthusiastische Verteidigung der Prä-Astronautik weltbekannt.',
    bioEn: 'Publisher and TV personality ("Ancient Aliens"). A student of von Däniken, he became world-famous for his meme-worthy appearance and enthusiastic defense of ancient astronaut theory.',
    focusAreas: ['Ancient Aliens', 'TV', 'Pop Culture'],
    keyWorks: [
      'Legendary Times Magazine (Publisher)'
    ],
    influenceLevel: 88
  },
  {
    id: 'a23',
    name: 'Linda Moulton Howe',
    lifespan: '1942–Present',
    nationality: 'American',
    imagePlaceholder: 'LMH',
    bioDe: 'Investigative Journalistin und Filmemacherin, bekannt für ihre Arbeit über Viehverstümmelungen (Cattle Mutilations) und Umweltfragen. Sie berichtet über Whistleblower und exotische Technologien.',
    bioEn: 'Investigative journalist and filmmaker known for her work on cattle mutilations and environmental issues. She reports on whistleblowers and exotic technologies.',
    focusAreas: ['Cattle Mutilations', 'UFOs', 'Environment'],
    keyWorks: [
      'A Strange Harvest (Documentary, 1980)',
      'Glimpses of Other Realities (1993)'
    ],
    influenceLevel: 78
  },
  {
    id: 'a24',
    name: 'Hartwig Hausdorf',
    lifespan: '1955–Present',
    nationality: 'German',
    imagePlaceholder: 'HH',
    bioDe: 'Deutscher Reiseveranstalter und Autor, der die "Weißen Pyramiden" in China im Westen bekannt machte. Er konzentriert sich auf Asien und unerklärliche Artefakte.',
    bioEn: 'German tour operator and author who popularized the "White Pyramids" of China in the West. He focuses on Asia and unexplained artifacts.',
    focusAreas: ['China', 'Pyramids', 'Artifacts'],
    keyWorks: [
      'Die Weisse Pyramide (1994)'
    ],
    influenceLevel: 60
  },
  {
    id: 'a25',
    name: 'Peter Dale Scott',
    lifespan: '1929–Present',
    nationality: 'Canadian',
    imagePlaceholder: 'PDS',
    bioDe: 'Ehemaliger Diplomat und Professor. Er prägte den Begriff "Parapolitik" und "Deep Politics", um kriminelle Netzwerke innerhalb demokratischer Staaten zu beschreiben (JFK, Drogenhandel). Akademisch fundiert.',
    bioEn: 'Former diplomat and professor. He coined the terms "parapolitics" and "deep politics" to describe criminal networks within democratic states (JFK, drug trade). Academically grounded.',
    focusAreas: ['Deep Politics', 'JFK', 'CIA/Drugs'],
    keyWorks: [
      'Deep Politics and the Death of JFK (1993)',
      'American War Machine (2010)'
    ],
    influenceLevel: 85
  },
  {
    id: 'a26',
    name: 'Thierry Meyssan',
    lifespan: '1957–Present',
    nationality: 'French',
    imagePlaceholder: 'TM',
    bioDe: 'Französischer Journalist und politischer Aktivist. Sein Buch "L\'Effroyable Imposture" (2002) war eines der ersten, das behauptete, kein Flugzeug sei in das Pentagon gestürzt. Er vertritt oft pro-russische/syrische Positionen.',
    bioEn: 'French journalist and political activist. His book "9/11: The Big Lie" (2002) was one of the first to claim no plane hit the Pentagon. He often holds pro-Russian/Syrian positions.',
    focusAreas: ['9/11', 'Geopolitics', 'Middle East'],
    keyWorks: [
      '9/11: The Big Lie (2002)'
    ],
    influenceLevel: 75
  },
  {
    id: 'a27',
    name: 'Alex Jones',
    lifespan: '1974–Present',
    nationality: 'American',
    imagePlaceholder: 'AJ',
    bioDe: 'Der Gründer von InfoWars ist bekannt für seinen aggressiven Stil und kontroverse Theorien über die "Globalisten", die das Wasser vergiften ("Gay Frogs") und False-Flag-Operationen durchführen.',
    bioEn: 'The founder of InfoWars is known for his aggressive style and controversial theories about "Globalists" poisoning the water ("Gay Frogs") and conducting false flag operations.',
    focusAreas: ['Globalism', 'NWO', 'Health/Supplements', 'Media'],
    keyWorks: ['Endgame (2007)', 'The Obama Deception (2009)'],
    influenceLevel: 92
  },
  {
    id: 'a28',
    name: 'Bob Lazar',
    lifespan: '1959–Present',
    nationality: 'American',
    imagePlaceholder: 'BL',
    bioDe: 'Behauptete 1989, in einer geheimen Anlage (S-4) nahe Area 51 an außerirdischen Raumschiffen gearbeitet zu haben, die mit Element 115 betrieben wurden. Seine Aussagen prägten das moderne UFO-Bild.',
    bioEn: 'Claimed in 1989 to have worked at a secret facility (S-4) near Area 51 on alien spacecraft powered by Element 115. His statements shaped the modern image of UFOs.',
    focusAreas: ['Area 51', 'Element 115', 'Reverse Engineering'],
    keyWorks: ['Dreamland (Autobiography)', 'Joe Rogan Experience #1315'],
    influenceLevel: 95
  },
  {
    id: 'a29',
    name: 'David Paulides',
    lifespan: '1950s–Present',
    nationality: 'American',
    imagePlaceholder: 'DP',
    bioDe: 'Ein ehemaliger Polizist, der mysteriöse Verschwindensfälle in Nationalparks dokumentiert (Missing 411). Er deutet oft paranormale Ursachen an, ohne sich festzulegen.',
    bioEn: 'A former police officer who documents mysterious disappearances in national parks (Missing 411). He often implies paranormal causes without committing to one.',
    focusAreas: ['Missing 411', 'National Parks', 'Cryptozoology'],
    keyWorks: ['Missing 411 Series', 'Missing 411: The Hunted (2019)'],
    influenceLevel: 80
  },
  {
    id: 'a30',
    name: 'Jordan Maxwell',
    lifespan: '1940–2022',
    nationality: 'American',
    imagePlaceholder: 'JMx',
    bioDe: 'Ein Pionier der Verschwörungsforschung, spezialisiert auf geheime Symbole, Wortursprünge (Etymologie) und das "Maritime Recht". Mentor vieler moderner Autoren.',
    bioEn: 'A pioneer of conspiracy research specializing in secret symbols, etymology, and "Maritime Law". Mentor to many modern authors.',
    focusAreas: ['Occult Symbols', 'Maritime Law', 'Religion'],
    keyWorks: ['Matrix of Power (2000)', 'Zeitgeist (Consultant)'],
    influenceLevel: 85
  },
  {
    id: 'a31',
    name: 'Charles Fort',
    lifespan: '1874–1932',
    nationality: 'American',
    imagePlaceholder: 'CF',
    bioDe: 'Der Urvater der Anomalistik. Fort sammelte Berichte über wissenschaftlich nicht erklärbare Phänomene (Froschregen, Poltergeister) und kritisierte den Dogmatismus der Wissenschaft. Seine Arbeit begründete die "Forteana".',
    bioEn: 'The founding father of anomalistics. Fort compiled records of scientifically unexplained phenomena (rains of frogs, poltergeists) and criticized scientific dogmatism. His work laid the foundation for "Forteana".',
    focusAreas: ['Anomalistics', 'Paranormal', 'Science Critique'],
    keyWorks: ['The Book of the Damned (1919)', 'New Lands (1923)'],
    influenceLevel: 90
  },
  {
    id: 'a32',
    name: 'Philip K. Dick',
    lifespan: '1928–1982',
    nationality: 'American',
    imagePlaceholder: 'PKD',
    bioDe: 'Visionärer Sci-Fi-Autor, dessen Werke (Blade Runner, Minority Report) oft die Realität als Simulation oder Täuschung in Frage stellten. Seine "Exegesis" beschreibt persönliche mystische Erfahrungen einer höheren Intelligenz (VALIS).',
    bioEn: 'Visionary sci-fi author whose works (Blade Runner, Minority Report) often questioned reality as a simulation or deception. His "Exegesis" details personal mystical experiences with a higher intelligence (VALIS).',
    focusAreas: ['Simulation Theory', 'Gnosticism', 'Paranoia', 'AI'],
    keyWorks: ['VALIS (1981)', 'A Scanner Darkly (1977)', 'The Exegesis'],
    influenceLevel: 96
  },
  {
    id: 'a33',
    name: 'Robert Anton Wilson',
    lifespan: '1932–2007',
    nationality: 'American',
    imagePlaceholder: 'RAW',
    bioDe: 'Autor, Futurist und Agnostiker. Mitautor der Illuminatus!-Trilogie. Er propagierte den "Modell-Agnostizismus" – die Idee, dass das Gehirn seine eigene Realität konstruiert (Realitätstunnel) und Verschwörungen oft Projektionen sind.',
    bioEn: 'Author, futurist, and agnostic. Co-author of the Illuminatus! Trilogy. He promoted "model agnosticism" – the idea that the brain constructs its own reality (reality tunnels) and that conspiracies are often projections.',
    focusAreas: ['Discordianism', 'Consciousness', 'Quantum Psychology', 'Illuminati'],
    keyWorks: ['The Illuminatus! Trilogy (1975)', 'Cosmic Trigger (1977)', 'Prometheus Rising (1983)'],
    influenceLevel: 94
  },
  {
    id: 'a34',
    name: 'Aleister Crowley',
    lifespan: '1875–1947',
    nationality: 'British',
    imagePlaceholder: 'ACr',
    bioDe: 'Okkultist und Gründer der Religion Thelema. Er bezeichnete sich selbst als "Das Große Tier 666". Seine Lehren beeinflussten moderne Geheimbünde und die Popkultur massiv, oft fälschlicherweise mit Satanismus gleichgesetzt.',
    bioEn: 'Occultist and founder of the religion Thelema. He referred to himself as "The Great Beast 666". His teachings heavily influenced modern secret societies and pop culture, often mistakenly equated with Satanism.',
    focusAreas: ['Occult', 'Magick', 'Secret Societies', 'Thelema'],
    keyWorks: ['The Book of the Law (1904)', 'Magick in Theory and Practice (1929)'],
    influenceLevel: 93
  },
  {
    id: 'a35',
    name: 'Helena Blavatsky',
    lifespan: '1831–1891',
    nationality: 'Russian-American',
    imagePlaceholder: 'HPB',
    bioDe: 'Mitbegründerin der Theosophischen Gesellschaft. Ihre Lehren über "Wurzelrassen", Atlantis und aufgestiegene Meister (Mahatmas) bildeten die Basis für spätere New-Age-Bewegungen und Ariosophie-Theorien.',
    bioEn: 'Co-founder of the Theosophical Society. Her teachings on "root races", Atlantis, and ascended masters (Mahatmas) formed the basis for later New Age movements and Ariosophy theories.',
    focusAreas: ['Theosophy', 'Esoteric History', 'Atlantis', 'Root Races'],
    keyWorks: ['The Secret Doctrine (1888)', 'Isis Unveiled (1877)'],
    influenceLevel: 89
  },
  {
    id: 'a36',
    name: 'Stanton Friedman',
    lifespan: '1934–2019',
    nationality: 'American-Canadian',
    imagePlaceholder: 'SF',
    bioDe: 'Nuklearphysiker und der erste zivile Forscher, der sich ernsthaft mit dem Roswell-Zwischenfall befasste. Er argumentierte wissenschaftlich für die extraterrestrische Herkunft von UFOs und kritisierte das "Lacher-Curtain" der Regierung.',
    bioEn: 'Nuclear physicist and the first civilian researcher to seriously investigate the Roswell incident. He argued scientifically for the extraterrestrial origin of UFOs and criticized the government\'s "laughter curtain".',
    focusAreas: ['UFOs', 'Roswell', 'MJ-12', 'Physics'],
    keyWorks: ['Crash at Corona (1992)', 'Top Secret/Majic (1996)'],
    influenceLevel: 87
  },
  {
    id: 'a37',
    name: 'Whitley Strieber',
    lifespan: '1945–Present',
    nationality: 'American',
    imagePlaceholder: 'WS',
    bioDe: 'Horror-Autor, der 1987 behauptete, von "Besuchern" (nicht zwingend Aliens) entführt worden zu sein. Sein Buch "Communion" definierte das moderne Bild der "Greys" und brachte das Abduktions-Phänomen in den Mainstream.',
    bioEn: 'Horror author who claimed in 1987 to have been abducted by "Visitors" (not necessarily aliens). His book "Communion" defined the modern image of the "Greys" and brought the abduction phenomenon into the mainstream.',
    focusAreas: ['Abductions', 'The Visitors', 'Consciousness', 'High Strangeness'],
    keyWorks: ['Communion (1987)', 'The Grays (2006)'],
    influenceLevel: 84
  },
  {
    id: 'a38',
    name: 'Fritz Springmeier',
    lifespan: '1955–Present',
    nationality: 'American',
    imagePlaceholder: 'FS',
    bioDe: 'Autor, der sich auf die "Blutlinien der Illuminaten" und Mind-Control-Techniken (Monarch-Programmierung) spezialisiert hat. Er behauptet, satanische Rituale würden zur Erzeugung von gespaltenen Persönlichkeiten genutzt.',
    bioEn: 'Author specializing in the "Bloodlines of the Illuminati" and mind control techniques (Monarch programming). He claims satanic rituals are used to create split personalities.',
    focusAreas: ['Illuminati Bloodlines', 'Mind Control', 'MK-Ultra', 'Satanic Ritual Abuse'],
    keyWorks: ['Bloodlines of the Illuminati (1995)', 'The Illuminati Formula Used to Create an Undetectable Total Mind Controlled Slave (1996)'],
    influenceLevel: 72
  },
  {
    id: 'a39',
    name: 'Serge Monast',
    lifespan: '1945–1996',
    nationality: 'Canadian',
    imagePlaceholder: 'SM',
    bioDe: 'Journalist aus Québec, der die Details des "Project Blue Beam" enthüllte. Er behauptete, die NASA plane eine gefälschte Wiederkunft Christi mittels Hologrammen. Er starb unter mysteriösen Umständen.',
    bioEn: 'Québec journalist who exposed the details of "Project Blue Beam". He claimed NASA plans a faked Second Coming of Christ using holograms. He died under mysterious circumstances.',
    focusAreas: ['Project Blue Beam', 'NWO', 'Masonic Conspiracies'],
    keyWorks: ['Project Blue Beam (NASA) (1994)'],
    influenceLevel: 68
  },
  {
    id: 'a40',
    name: 'Edward Snowden',
    lifespan: '1983–Present',
    nationality: 'American-Russian',
    imagePlaceholder: 'ES',
    bioDe: 'Ehemaliger CIA/NSA-Mitarbeiter, der 2013 das Ausmaß der globalen Massenüberwachung (PRISM, XKeyscore) enthüllte. Er lieferte den Beweis, dass viele "Verschwörungstheorien" über staatliche Überwachung wahr waren.',
    bioEn: 'Former CIA/NSA employee who exposed the extent of global mass surveillance (PRISM, XKeyscore) in 2013. He provided proof that many "conspiracy theories" about state surveillance were true.',
    focusAreas: ['Surveillance', 'Privacy', 'Intelligence Agencies', 'Whistleblowing'],
    keyWorks: ['Permanent Record (2019)'],
    influenceLevel: 98
  },
  {
    id: 'a41',
    name: 'Julian Assange',
    lifespan: '1971–Present',
    nationality: 'Australian',
    imagePlaceholder: 'JA',
    bioDe: 'Gründer von WikiLeaks. Durch die Veröffentlichung geheimer Dokumente (Collateral Murder, Podesta-Mails) deckte er Kriegsverbrechen und Korruption auf und wurde zur Zielscheibe globaler Geheimdienste.',
    bioEn: 'Founder of WikiLeaks. By publishing classified documents (Collateral Murder, Podesta Emails), he exposed war crimes and corruption, becoming a target of global intelligence agencies.',
    focusAreas: ['Transparency', 'War Crimes', 'Cryptography', 'Journalism'],
    keyWorks: ['Cypherpunks (2012)', 'WikiLeaks Files'],
    influenceLevel: 97
  },
  {
    id: 'a42',
    name: 'Aldous Huxley',
    lifespan: '1894–1963',
    nationality: 'British',
    imagePlaceholder: 'AH',
    bioDe: 'Schriftsteller und Philosoph. Sein Roman "Schöne neue Welt" und seine Essays über Psychedelika (Pforten der Wahrnehmung) und Propaganda (Brave New World Revisited) sind Standardwerke der Systemkritik.',
    bioEn: 'Writer and philosopher. His novel "Brave New World" and his essays on psychedelics (The Doors of Perception) and propaganda (Brave New World Revisited) are standard works of system criticism.',
    focusAreas: ['Dystopia', 'Social Engineering', 'Psychedelics', 'Consciousness'],
    keyWorks: ['Brave New World (1932)', 'The Doors of Perception (1954)'],
    influenceLevel: 96
  },
  {
    id: 'a43',
    name: 'George Orwell',
    lifespan: '1903–1950',
    nationality: 'British',
    imagePlaceholder: 'GO',
    bioDe: 'Eigentlich Eric Arthur Blair. Sein Werk "1984" prägte Begriffe wie "Big Brother" und "Gedankenverbrechen". Er warnte vor totalitärer Überwachung und der Manipulation von Sprache und Wahrheit.',
    bioEn: 'Born Eric Arthur Blair. His work "1984" coined terms like "Big Brother" and "Thoughtcrime". He warned of totalitarian surveillance and the manipulation of language and truth.',
    focusAreas: ['Totalitarianism', 'Surveillance', 'Propaganda', 'Language Control'],
    keyWorks: ['1984 (1949)', 'Animal Farm (1945)'],
    influenceLevel: 100
  },
  {
    id: 'a44',
    name: 'Hunter S. Thompson',
    lifespan: '1937–2005',
    nationality: 'American',
    imagePlaceholder: 'HST',
    bioDe: 'Begründer des Gonzo-Journalismus. Seine extremen Reportagen über die amerikanische Politik und Kultur deuteten oft auf tiefere, dunklere Korruption hin (z.B. Andeutungen über Elite-Pädophilie in Washington).',
    bioEn: 'Founder of Gonzo journalism. His extreme reporting on American politics and culture often hinted at deeper, darker corruption (e.g., allusions to elite pedophilia in Washington).',
    focusAreas: ['Politics', 'Drugs', 'Counterculture', 'Corruption'],
    keyWorks: ['Fear and Loathing in Las Vegas (1971)', 'Hell\'s Angels (1966)'],
    influenceLevel: 83
  },
  {
    id: 'a45',
    name: 'Terence McKenna',
    lifespan: '1946–2000',
    nationality: 'American',
    imagePlaceholder: 'TMK',
    bioDe: 'Ethnobotaniker und Mystiker. Er entwickelte die "Timewave Zero"-Theorie (Ende der Zeit 2012) und sprach über den Kontakt mit Maschinen-Elfen durch DMT. Eine Ikone der psychedelischen Gegenkultur.',
    bioEn: 'Ethnobotanist and mystic. He developed the "Timewave Zero" theory (end of time in 2012) and spoke of contact with machine elves via DMT. An icon of the psychedelic counterculture.',
    focusAreas: ['Psychedelics', 'Timewave Zero', 'Consciousness', 'Evolution'],
    keyWorks: ['Food of the Gods (1992)', 'The Archaic Revival (1991)'],
    influenceLevel: 86
  },
  {
    id: 'a46',
    name: 'Nikola Tesla',
    lifespan: '1856–1943',
    nationality: 'Serbian-American',
    imagePlaceholder: 'NT',
    bioDe: 'Erfinder des Wechselstroms. Um ihn ranken sich Mythen über "Freie Energie", Todesstrahlen und die Beschlagnahmung seiner Unterlagen durch das FBI nach seinem Tod (Trump-Verbindung).',
    bioEn: 'Inventor of alternating current. Myths surround him regarding "Free Energy", death rays, and the seizure of his papers by the FBI after his death (Trump connection).',
    focusAreas: ['Free Energy', 'Physics', 'Suppressed Tech', 'Wireless Power'],
    keyWorks: ['My Inventions (Autobiography)'],
    influenceLevel: 94
  },
  {
    id: 'a47',
    name: 'Stanley Kubrick',
    lifespan: '1928–1999',
    nationality: 'American',
    imagePlaceholder: 'SK',
    bioDe: 'Regisseur, dem nachgesagt wird, er habe die Mondlandung inszeniert. Sein letzter Film "Eyes Wide Shut" gilt vielen als Enthüllung echter Elite-Rituale, wofür er angeblich ermordet wurde.',
    bioEn: 'Director rumored to have staged the moon landing. His final film "Eyes Wide Shut" is considered by many as an exposure of real elite rituals, for which he was allegedly murdered.',
    focusAreas: ['Film', 'Symbolism', 'Moon Landing', 'Elite Rituals'],
    keyWorks: ['2001: A Space Odyssey (1968)', 'Eyes Wide Shut (1999)'],
    influenceLevel: 88
  },
  {
    id: 'a48',
    name: 'H.P. Lovecraft',
    lifespan: '1890–1937',
    nationality: 'American',
    imagePlaceholder: 'HPL',
    bioDe: 'Autor von Horror-Fiction. Sein Cthulhu-Mythos über "Große Alte", die vor den Menschen die Erde beherrschten, beeinflusste moderne Theorien über antike Astronauten und okkulte Dimensionen massiv.',
    bioEn: 'Horror fiction author. His Cthulhu Mythos about "Great Old Ones" ruling Earth before humans heavily influenced modern theories about ancient astronauts and occult dimensions.',
    focusAreas: ['Cosmic Horror', 'Ancient Gods', 'Occult', 'Forbidden Knowledge'],
    keyWorks: ['The Call of Cthulhu (1928)', 'The Shadow over Innsmouth (1936)'],
    influenceLevel: 81
  },
  {
    id: 'a49',
    name: 'L. Ron Hubbard',
    lifespan: '1911–1986',
    nationality: 'American',
    imagePlaceholder: 'LRH',
    bioDe: 'Science-Fiction-Autor und Gründer von Scientology. Seine Verbindungen zum Okkultisten Jack Parsons (Babalon Working) und seine Lehren über außerirdische Zivilisationen (Xenu) sind zentral für viele Verschwörungsnarrative.',
    bioEn: 'Science fiction author and founder of Scientology. His connections to occultist Jack Parsons (Babalon Working) and teachings on extraterrestrial civilizations (Xenu) are central to many conspiracy narratives.',
    focusAreas: ['Scientology', 'Occult', 'Mind Control', 'Aliens'],
    keyWorks: ['Dianetics (1950)'],
    influenceLevel: 79
  },
  {
    id: 'a50',
    name: 'Val Valerian',
    lifespan: 'Unknown',
    nationality: 'American',
    imagePlaceholder: 'VV',
    bioDe: 'Pseudonym eines ehemaligen Militärgeheimdienstlers (John Grace). Autor der "Matrix"-Buchreihe (lange vor dem Film), die technologische Gedankenkontrolle, Aliens und Realitätssimulation detailliert beschrieb.',
    bioEn: 'Pseudonym of a former military intelligence officer (John Grace). Author of the "Matrix" book series (long before the movie), detailing technological mind control, aliens, and reality simulation.',
    focusAreas: ['Matrix', 'Mind Control', 'Greys', 'Consciousness'],
    keyWorks: ['The Matrix I-IV (1988-1990s)'],
    influenceLevel: 65
  }
];

const EXPANDED_AUTHORS_DATA: SeedAuthor[] = [
  {
    id: 'a51',
    name: 'Jim Keith',
    lifespan: '1949–1999',
    nationality: 'American',
    imagePlaceholder: 'JKt',
    bioDe: 'Autor und Herausgeber, der in den 1990ern über Technokratie, Überwachung und soziale Kontrolle publizierte. Seine Arbeiten werden häufig in Debatten über „Silent Weapons“-Narrative zitiert.',
    bioEn: 'Author and editor who published on technocracy, surveillance, and social control in the 1990s. His work is often cited in debates around “Silent Weapons” narratives.',
    focusAreas: ['Technocracy', 'Surveillance', 'Social Engineering'],
    keyWorks: ['Mind Control, World Control (1997)', 'Mass Control: Engineering Human Consciousness (1999)'],
    influenceLevel: 77
  },
  {
    id: 'a52',
    name: 'Mark Dice',
    lifespan: '1977–Present',
    nationality: 'American',
    imagePlaceholder: 'MD',
    bioDe: 'Medienkommentator, der Popkultur, Werbung und Elitenarrative mit satirischem Stil kritisiert. Seine Inhalte zirkulieren stark in Online-Ökosystemen der Gegenöffentlichkeit.',
    bioEn: 'Media commentator who critiques pop culture, advertising, and elite narratives with a satirical style. His content circulates widely in alternative online ecosystems.',
    focusAreas: ['Media Critique', 'Pop Culture', 'Elite Narratives'],
    keyWorks: ['The New World Order: Facts & Fiction (2009)', 'The Resistance Manifesto (2019)'],
    influenceLevel: 73
  },
  {
    id: 'a53',
    name: 'James Corbett',
    lifespan: '1979–Present',
    nationality: 'Canadian',
    imagePlaceholder: 'JCb',
    bioDe: 'Unabhängiger Podcaster und Produzent des „Corbett Report“. Er kuratiert geopolitische und medienkritische Narrativcluster mit Fokus auf Quellenarchivierung.',
    bioEn: 'Independent podcaster and producer of “The Corbett Report”. He curates geopolitical and media-critique narrative clusters with strong source archiving focus.',
    focusAreas: ['Geopolitics', 'Media Literacy', 'OSINT Curation'],
    keyWorks: ['The Corbett Report (Series)', 'How Big Oil Conquered the World (Documentary)'],
    influenceLevel: 79
  },
  {
    id: 'a54',
    name: 'Rosa Koire',
    lifespan: '1966–2021',
    nationality: 'American',
    imagePlaceholder: 'RK',
    bioDe: 'Aktivistin, die „Agenda 21“-Interpretationen in lokale Politikdebatten einbrachte. Ihre Vorträge beeinflussten kommunale Netzwerke und Anti-Planungs-Narrative.',
    bioEn: 'Activist who introduced “Agenda 21” interpretations into local policy debates. Her talks influenced municipal networks and anti-planning narratives.',
    focusAreas: ['Agenda 21', 'Urban Planning', 'Governance Narratives'],
    keyWorks: ['Behind the Green Mask (2011)'],
    influenceLevel: 68
  },
  {
    id: 'a55',
    name: 'Judy Mikovits',
    lifespan: '1958–Present',
    nationality: 'American',
    imagePlaceholder: 'JMv',
    bioDe: 'Biomedizinische Akteurin, deren Aussagen in Pandemie- und Impfdebatten stark polarisierten. Ihre Narrative wurden in vielen Plattform-Fact-Checks als problematisch markiert.',
    bioEn: 'Biomedical figure whose statements became highly polarizing in pandemic and vaccine debates. Her narratives were flagged as problematic across many platform fact-checks.',
    focusAreas: ['Health Claims', 'Pandemic Narratives', 'Vaccine Discourse'],
    keyWorks: ['Plague of Corruption (2020)'],
    influenceLevel: 81
  },
  {
    id: 'a56',
    name: 'Andrew Wakefield',
    lifespan: '1957–Present',
    nationality: 'British',
    imagePlaceholder: 'AW',
    bioDe: 'Ehemaliger Mediziner, zentral in modernen Impf-Fehlinformationsnetzwerken. Sein Fall ist ein Kernbeispiel für wissenschaftsethische Kontroversen und langfristige Narrativwirkung.',
    bioEn: 'Former physician central to modern vaccine misinformation networks. His case is a core example of research ethics controversy and long-term narrative impact.',
    focusAreas: ['Vaccine Narratives', 'Public Health', 'Scientific Controversy'],
    keyWorks: ['Callous Disregard (2010)', 'Vaxxed (2016)'],
    influenceLevel: 90
  },
  {
    id: 'a57',
    name: 'Del Bigtree',
    lifespan: '1970s–Present',
    nationality: 'American',
    imagePlaceholder: 'DB',
    bioDe: 'Produzent und Moderator, der Gesundheitsnarrative über Livestream-Formate verbreitet. Hohe Reichweite über Event- und Campaign-Infrastruktur.',
    bioEn: 'Producer and host who amplifies health narratives via livestream formats. High reach through event and campaign infrastructure.',
    focusAreas: ['Health Media', 'Livestream Activism', 'Campaign Networks'],
    keyWorks: ['The HighWire (Series)', 'Vaxxed (Producer)'],
    influenceLevel: 78
  },
  {
    id: 'a58',
    name: 'Joseph Mercola',
    lifespan: '1954–Present',
    nationality: 'American',
    imagePlaceholder: 'JMe',
    bioDe: 'Unternehmer und Publizist im Health-Wellness-Sektor, häufig in Desinformationsanalysen zu Medizin- und Ernährungsclaims erwähnt.',
    bioEn: 'Entrepreneur and publisher in the health-wellness sector, frequently cited in misinformation analyses around medical and nutrition claims.',
    focusAreas: ['Alternative Health', 'Nutrition Claims', 'Medical Misinformation'],
    keyWorks: ['Mercola.com (Platform)'],
    influenceLevel: 82
  },
  {
    id: 'a59',
    name: 'Mike Adams',
    lifespan: '1967–Present',
    nationality: 'American',
    imagePlaceholder: 'MA',
    bioDe: 'Betreiber eines alternativen Mediennetzwerks mit Fokus auf Krisen-, Gesundheits- und Systemkollaps-Narrative.',
    bioEn: 'Operator of an alternative media network focused on crisis, health, and system-collapse narratives.',
    focusAreas: ['Alternative Media', 'Crisis Narratives', 'Prepper Culture'],
    keyWorks: ['NaturalNews (Platform)'],
    influenceLevel: 76
  },
  {
    id: 'a60',
    name: 'Brigitte Hamann',
    lifespan: '1960s–Present',
    nationality: 'German',
    imagePlaceholder: 'BH',
    bioDe: 'Akteurin in deutschsprachigen Milieus rund um globale Elitenarrative und alternative Finanzdeutungen. Wirksam vor allem über Eventformate.',
    bioEn: 'Figure in German-speaking milieus around global elite narratives and alternative financial framing. Influence is mainly event-driven.',
    focusAreas: ['German Alt-Media', 'Elite Narratives', 'Finance Frames'],
    keyWorks: ['Lecture Circuit Archives'],
    influenceLevel: 63
  },
  {
    id: 'a61',
    name: 'Udo Ulfkotte',
    lifespan: '1960–2017',
    nationality: 'German',
    imagePlaceholder: 'UU',
    bioDe: 'Journalist, dessen Medienkritik-These über Einflussnetzwerke in Nachrichtenredaktionen in vielen alternativen Kanälen verbreitet wurde.',
    bioEn: 'Journalist whose media-critique thesis about influence networks in newsrooms spread widely across alternative channels.',
    focusAreas: ['Media Critique', 'Influence Networks', 'Press Trust'],
    keyWorks: ['Gekaufte Journalisten (2014)'],
    influenceLevel: 74
  },
  {
    id: 'a62',
    name: 'Ken Jebsen',
    lifespan: '1966–Present',
    nationality: 'German',
    imagePlaceholder: 'KJ',
    bioDe: 'Medienakteur mit starkem Fokus auf geopolitische Meta-Erzählungen. Hohe Viralität über Video- und Interviewformate.',
    bioEn: 'Media figure with strong focus on geopolitical meta-narratives. High virality through video and long-form interview formats.',
    focusAreas: ['Geopolitics', 'Longform Interviews', 'Alternative Video Media'],
    keyWorks: ['KenFM / Apolut (Platform Archive)'],
    influenceLevel: 77
  },
  {
    id: 'a63',
    name: 'Daniele Ganser',
    lifespan: '1972–Present',
    nationality: 'Swiss',
    imagePlaceholder: 'DG',
    bioDe: 'Historiker und Referent, bekannt für geopolitische Gegenlesarten und 9/11-bezogene Debatten. Starkes Event-Publikum im DACH-Raum.',
    bioEn: 'Historian and speaker known for geopolitical counter-readings and 9/11-related debate framing. Strong event audience in the DACH region.',
    focusAreas: ['9/11 Debate', 'NATO/Geopolitics', 'Public Lectures'],
    keyWorks: ['NATO’s Secret Armies (2005)', 'Illegale Kriege (2016)'],
    influenceLevel: 84
  },
  {
    id: 'a64',
    name: 'Stefan Lanka',
    lifespan: '1963–Present',
    nationality: 'German',
    imagePlaceholder: 'SL',
    bioDe: 'Akteur in virologiekritischen Netzwerken, häufig zitiert in Debatten über medizinische Grundlagen und Evidenzstandards.',
    bioEn: 'Figure in virology-skeptic networks, frequently cited in debates over medical fundamentals and evidence standards.',
    focusAreas: ['Virology Skepticism', 'Evidence Debate', 'Health Narratives'],
    keyWorks: ['Public Debate Archives'],
    influenceLevel: 69
  },
  {
    id: 'a65',
    name: 'Sherri Tenpenny',
    lifespan: '1950s–Present',
    nationality: 'American',
    imagePlaceholder: 'ST',
    bioDe: 'Ärztliche Akteurin in anti-impfbezogenen Communities, mit starker Event- und Social-Media-Präsenz.',
    bioEn: 'Medical figure in anti-vaccine communities with strong event and social media presence.',
    focusAreas: ['Vaccine Narratives', 'Health Events', 'Social Amplification'],
    keyWorks: ['Public Talks and Webcasts'],
    influenceLevel: 72
  },
  {
    id: 'a66',
    name: 'Stew Peters',
    lifespan: '1980s–Present',
    nationality: 'American',
    imagePlaceholder: 'SP',
    bioDe: 'Host und Multiplikator in digitalen Ökosystemen mit stark polarisierenden Gesundheits- und Politnarrativen.',
    bioEn: 'Host and amplifier in digital ecosystems with highly polarizing health and political narratives.',
    focusAreas: ['Alt-Video Platforms', 'Political Polarization', 'Health Narratives'],
    keyWorks: ['Stew Peters Network (Archive)'],
    influenceLevel: 71
  },
  {
    id: 'a67',
    name: 'Harald Kautz-Vella',
    lifespan: '1970s–Present',
    nationality: 'German',
    imagePlaceholder: 'HKV',
    bioDe: 'Akteur in deutschsprachigen Narrativen zu Geoengineering, Nanotechnologie und Biowaffen-Deutungen.',
    bioEn: 'Figure in German-speaking narratives around geoengineering, nanotechnology, and bioweapon framing.',
    focusAreas: ['Geoengineering', 'Nanotech Narratives', 'Biosecurity Claims'],
    keyWorks: ['Lecture and Interview Archives'],
    influenceLevel: 67
  },
  {
    id: 'a68',
    name: 'Anatoly Fomenko',
    lifespan: '1945–Present',
    nationality: 'Russian',
    imagePlaceholder: 'AF',
    bioDe: 'Mathematiker und Urheber der „Neuen Chronologie“, die große Teile der etablierten Weltgeschichte als Fälschung neu datiert.',
    bioEn: 'Mathematician and author of the “New Chronology”, re-dating large parts of established world history as fabricated.',
    focusAreas: ['Historical Revisionism', 'Chronology Theories', 'Alternative Historiography'],
    keyWorks: ['History: Fiction or Science? (Series)'],
    influenceLevel: 75
  },
  {
    id: 'a69',
    name: 'Annie Jacobsen',
    lifespan: '1967–Present',
    nationality: 'American',
    imagePlaceholder: 'AJa',
    bioDe: 'Journalistin, deren Bücher über geheime Programme (Area 51, DARPA, MKUltra-Kontexte) häufig als Einstieg in Sicherheitsnarrative genutzt werden.',
    bioEn: 'Journalist whose books on classified programs (Area 51, DARPA, MKUltra contexts) are often used as entry points into security narratives.',
    focusAreas: ['Classified Programs', 'Defense History', 'Intelligence Narratives'],
    keyWorks: ['Area 51 (2011)', 'The Pentagon’s Brain (2015)'],
    influenceLevel: 70
  },
  {
    id: 'a70',
    name: 'Laura Knight-Jadczyk',
    lifespan: '1952–Present',
    nationality: 'American',
    imagePlaceholder: 'LKJ',
    bioDe: 'Autorin in esoterisch-politischen Mischmilieus mit narrativen Clustern zu Hyperdimensionen, Geopolitik und Informationskrieg.',
    bioEn: 'Author in esoteric-political hybrid milieus with narrative clusters on hyperdimensions, geopolitics, and information warfare.',
    focusAreas: ['Esoteric Geopolitics', 'Hyperdimensional Narratives', 'Info-Warfare'],
    keyWorks: ['The Wave (Series)', 'Political Ponerology (Promotion)'],
    influenceLevel: 66
  }
];

const DEFAULT_DISCLAIMER_DE = 'Nur für Bildungszwecke – keine medizinische, rechtliche oder psychologische Beratung. Immer eigenständig verifizieren.';
const DEFAULT_DISCLAIMER_EN = 'Educational simulation tool only – not medical, legal or psychological advice. Always verify independently.';

const ALL_AUTHORS = [...RAW_AUTHORS_DATA, ...EXPANDED_AUTHORS_DATA];

const inferBirthYear = (lifespan: string): number | undefined => {
  const start = lifespan.split('–')[0]?.trim();
  if (!start) return undefined;
  const year = Number.parseInt(start, 10);
  return Number.isFinite(year) ? year : undefined;
};

const inferOccupations = (focusAreas: string[]): string[] => {
  const occupationMap: Record<string, string> = {
    history: 'Historian / Public Commentator',
    journalism: 'Journalist / Broadcaster',
    geopolitics: 'Geopolitical Analyst',
    politics: 'Political Commentator',
    economics: 'Economic Commentator',
    spirituality: 'Spiritual Author / Lecturer',
    ufos: 'Paranormal Research Author',
    archaeology: 'Popular History Author',
    media: 'Media Personality',
    health: 'Health Narrative Commentator'
  };

  const inferred = focusAreas
    .map((area) => {
      const key = area.toLowerCase();
      return Object.entries(occupationMap).find(([match]) => key.includes(match))?.[1];
    })
    .filter((value): value is string => Boolean(value));

  return Array.from(new Set(inferred.length ? inferred : ['Author / Public Speaker']));
};

const createTimeline = (author: SeedAuthor): Author['timeline'] => {
  const birth = inferBirthYear(author.lifespan);
  const firstWorkYear = author.keyWorks
    .map((work) => Number.parseInt((work.match(/\((\d{4})\)/)?.[1] || ''), 10))
    .find((year) => Number.isFinite(year));
  const peakYear = (firstWorkYear || (birth ? birth + 40 : 2005)) + 8;

  return [
    {
      year: birth ? `${birth}` : 'Early Career',
      event: `Early formation phase of ${author.name}`,
      significance: 'Background context is useful for understanding later framing strategies and audience fit.'
    },
    {
      year: firstWorkYear ? `${firstWorkYear}` : 'Publication Era',
      event: `Breakthrough publication cycle begins (${author.keyWorks[0] || 'major public work'})`,
      significance: 'Marks transition from niche commentary to broader narrative circulation and citation.'
    },
    {
      year: `${peakYear}`,
      event: 'Cross-platform amplification and remixing by adjacent communities',
      significance: 'Claims become detached from original context and spread through clips, reposts, and derivative commentary.'
    },
    {
      year: 'Recent',
      event: 'Ongoing fact-checking, contextualization, and archival debate',
      significance: 'Demonstrates how narratives persist even when specific claims are revised, challenged, or debunked.'
    }
  ];
};

const createRichBio = (author: SeedAuthor, lang: 'de' | 'en'): string => {
  const baseBio = lang === 'de' ? author.bioDe : author.bioEn;
  const works = author.keyWorks.slice(0, 3).join('; ');
  const focus = author.focusAreas.join(', ');
  const opening = lang === 'de'
    ? `Frühes Leben: ${author.name} wird in Quellen häufig in Verbindung mit den Themenfeldern ${focus} genannt. Die frühe Karrierephase ist für die Einordnung entscheidend, weil biografische Übergänge (Beruf, Milieu, Publikationszugang) oft direkt mit der späteren Erzählstrategie verknüpft sind. ${baseBio}`
    : `Early Life: ${author.name} is frequently discussed in relation to ${focus}. The early-career phase matters for analysis because biographical transitions (profession, milieu, publishing access) often shape later narrative strategy. ${baseBio}`;

  const rise = lang === 'de'
    ? `Aufstieg zur Prominenz: Sichtbarkeit entstand typischerweise über Buchpublikationen, Vortragskreise und später über digitale Distribution. Wiederkehrende Trigger waren Krisenkommunikation, institutionelles Misstrauen und vereinfachende Deutungsrahmen. Relevante Veröffentlichungsphase: ${works}.`
    : `Rise to Prominence: Visibility typically scaled through books, lecture circuits, and later digital distribution. Recurring triggers were crisis communication cycles, institutional distrust, and simplification frames. Notable release cycle: ${works}.`;

  const claims = lang === 'de'
    ? `Kern-Claims: Im Diskurs werden Kernthesen häufig als evidenzgestufte Behauptungen bewertet (Strong/Limited/Weak/Debunked). Für didaktische Zwecke ist wichtig, einzelne Claims zu trennen, Primärquellen zu prüfen und zwischen belegten Fakten, plausiblen Hypothesen und spekulativen Schlüssen zu unterscheiden.`
    : `Core Claims: In public discourse, core propositions are often best handled with evidence tiers (Strong/Limited/Weak/Debunked). For educational use, separate each claim, verify primary sources, and distinguish confirmed facts from plausible hypotheses and speculative inference.`;

  const methods = lang === 'de'
    ? `Einflussmethoden: Typische Mechanismen sind narrative Verdichtung, selektive Quellenwahl, rhetorische Fragen, moralische Dringlichkeit und die Verknüpfung heterogener Ereignisse zu einem kohärent wirkenden Gesamtbild. Plattformdynamik verstärkt diese Muster durch Wiederholung, visuelle Kurzformate und Community-Bestätigung.`
    : `Methods of Influence: Typical mechanisms include narrative compression, selective sourcing, rhetorical questioning, moral urgency, and linking heterogeneous events into a coherent master frame. Platform dynamics amplify these patterns through repetition, visual short formats, and community reinforcement.`;

  const impact = lang === 'de'
    ? `Wirkung & Kontroversen: Wirkung zeigt sich in Reichweite, Wiederverwendung durch Drittakteure und langfristiger Anschlussfähigkeit an neue Ereignisse. Kontroversen entstehen oft dort, wo kausale Behauptungen die verfügbare Evidenz übersteigen. Debunkings adressieren dann Datenlücken, Fehlzitate, Kontextverlust oder methodische Fehlschlüsse.`
    : `Impact & Controversies: Impact appears in audience reach, downstream reuse by third parties, and long-term adaptability to new events. Controversies often emerge where causal claims exceed available evidence. Debunking work then targets data gaps, quotation errors, context loss, or methodological overreach.`;

  const legacy = lang === 'de'
    ? `Vermächtnis: Das Profil ist nicht als Bewertung der Person gedacht, sondern als Lernmaterial zur Analyse moderner Informationsökologien. Relevanz entsteht aus der Rolle im Netzwerk: Wer zitiert wen, in welchem Kontext, mit welcher Evidenzqualität und über welche Kanäle?`
    : `Legacy: This profile is not intended as personal judgment; it is educational material for analyzing modern information ecosystems. Relevance comes from network position: who cites whom, in what context, with what evidence quality, and through which channels?`;

  const insights = lang === 'de'
    ? `Lern-Insights: Medienkompetenz steigt, wenn Nutzer:innen Behauptungen in überprüfbare Teilfragen zerlegen, Primärquellen vor Sekundärkommentaren priorisieren, Datums-/Kontextbrüche markieren und emotionale Trigger erkennen. Fact-Checking-Hinweis: Einzelne zutreffende Beobachtungen validieren nicht automatisch den gesamten Deutungsrahmen.`
    : `Educational Insights: Media literacy improves when users decompose claims into verifiable sub-questions, prioritize primary sources over commentary, track date/context shifts, and detect emotional triggers. Fact-checking note: isolated accurate observations do not automatically validate the broader framework.`;

  return [opening, rise, claims, methods, impact, legacy, insights].join('\n\n');
};

export const AUTHORS_DATA: Author[] = ALL_AUTHORS.map((author, index) => {
  const relatedMediaIds = [`m${(index % 30) + 1}`, `m${400 + (index % 30)}`];
  const birthYear = inferBirthYear(author.lifespan);
  const fullBioDe = createRichBio(author, 'de');
  const fullBioEn = createRichBio(author, 'en');
  const peakYear = birthYear ? birthYear + 45 : 2012;

  return {
    ...author,
    birthYear,
    fullBio: fullBioEn,
    fullBioDe,
    fullBioEn,
    occupation: inferOccupations(author.focusAreas),
    notableWorks: author.keyWorks,
    influenceScore: author.influenceLevel,
    affiliations: [
      `${author.nationality} media ecosystem`,
      'Lecture circuits / alternative publishing'
    ],
    keyClaims: [
      `${author.name} is frequently cited in narratives around ${author.focusAreas[0] ?? 'system control'}.`,
      `Recurring claim cluster: ${author.focusAreas.slice(0, 2).join(' + ')}.`
    ],
    affiliatedMedia: relatedMediaIds,
    relatedMediaIds,
    timeline: createTimeline(author),
    influenceMetrics: {
      mainPlatforms: ['Books', 'Long-form Interviews', 'Social Media Clips'],
      peakReach: `${Math.max(20, Math.round(author.influenceLevel * 0.85))}% cross-platform visibility index`,
      estimatedAudience: `${Math.max(1, Math.round(author.influenceLevel / 8))}M cumulative exposures (estimated)`,
      peakYear
    },
    rhetoricalStyle: `Analytical-assertive framing with recurring emphasis on ${author.focusAreas.slice(0, 2).join(' and ')}; relies on pattern linkage, source reinterpretation, and high-certainty language in controversial domains.`,
    controversiesAndDebunkings: [
      'Core claims have been repeatedly reviewed by fact-checking and academic commentary with mixed to critical assessments depending on claim scope.',
      'Frequent critique points include selective source use, causality leaps, and low evidentiary thresholds in high-impact claims.',
      'Educational recommendation: verify timeline consistency, primary documents, and independent corroboration before accepting synthesis claims.'
    ],
    educationalInsights: 'Influence typically rises when uncertainty, identity pressure, and platform virality converge. High-engagement narratives often simplify complexity and reward certainty. Media-literacy practice: separate facts from interpretation, compare independent sources, and actively test falsifiable parts of each claim.',
    sources: [
      'Primary publications and interviews by the author',
      'Independent fact-check organizations (methodology + verdict archives)',
      'Peer-reviewed or institutional background references where available',
      'Media-literacy frameworks on misinformation spread and cognitive bias'
    ],
    debunkingTimeline: [
      {
        year: '1990s',
        eventDe: 'Frühe Gegenanalysen in Fachmedien markieren zentrale Behauptungen als unbelegt oder verkürzt.',
        eventEn: 'Early counter-analysis in specialist media marks key claims as unverified or oversimplified.',
        source: 'Media literacy archives'
      },
      {
        year: '2010s',
        eventDe: 'Fact-Checking-Plattformen ordnen Kernthesen in Kategorien wie „unbelegt“, „irreführend“ oder „Satire“ ein.',
        eventEn: 'Fact-check platforms classify core claims as unverified, misleading, or satire.',
        source: 'Public fact-check portals'
      }
    ],
    factCheckNoteDe: 'Hinweis: Dieses Profil dokumentiert Erzählmuster, nicht deren Wahrheitsgehalt.',
    factCheckNoteEn: 'Note: This profile documents narrative patterns, not factual validity.',
    whyItSpreadsDe: 'Die Erzählung kombiniert Identität, Kontrollverlust und einfache Erklärungen für komplexe Ereignisse.',
    whyItSpreadsEn: 'The narrative combines identity, loss-of-control framing, and simple explanations for complex events.',
    learningPromptDe: 'Welche Primärquelle würdest du zuerst prüfen, und warum?',
    learningPromptEn: 'Which primary source would you verify first, and why?',
    disclaimerDe: DEFAULT_DISCLAIMER_DE,
    disclaimerEn: DEFAULT_DISCLAIMER_EN,
  };
});