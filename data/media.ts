
import { MediaItem } from '../types';
import { generateArt } from '../utils/artEngine';

const RAW_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'm1',
    title: 'The Matrix',
    type: 'MOVIE',
    year: 1999,
    creator: 'Wachowskis',
    descriptionDe: 'Ein Hacker entdeckt, dass die Welt eine Simulation ist, die von Maschinen geschaffen wurde, um die Menschheit zu versklaven. Ein Paradebeispiel für die Simulations-Theorie und gnostische Motive.',
    descriptionEn: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers. A prime example of simulation theory.',
    tags: ['Simulation', 'AI', 'Control', 'Gnosticism'],
    realityScore: 40,
    complexity: 'MINDBENDING',
    relatedTheoryTags: ['Simulation Theory', 'AI', 'Control']
  },
  {
    id: 'm2',
    title: 'The X-Files',
    type: 'SERIES',
    year: 1993,
    creator: 'Chris Carter',
    descriptionDe: 'Zwei FBI-Agenten untersuchen das Paranormale. Die Serie etablierte das moderne Bild der Regierungsverschwörung zur Vertuschung extraterrestrischen Lebens (Syndikat).',
    descriptionEn: 'Two FBI agents investigate the paranormal. The series established the modern trope of a government conspiracy covering up extraterrestrial life.',
    tags: ['UFO', 'Government', 'Aliens', 'Deep State'],
    realityScore: 60,
    complexity: 'HIGH',
    relatedTheoryTags: ['UFO', 'Area 51', 'Men in Black']
  },
  {
    id: 'm3',
    title: 'Deus Ex',
    type: 'GAME',
    year: 2000,
    creator: 'Ion Storm',
    descriptionDe: 'Ein Cyberpunk-Spiel, das fast jede moderne Verschwörungstheorie (Illuminaten, FEMA, Area 51, Graue Aliens) in eine kohärente Handlung webt. Legendär für seine Vorhersage des Falls der Twin Towers.',
    descriptionEn: 'A cyberpunk game that weaves almost every modern conspiracy theory (Illuminati, FEMA, Area 51, Grey Aliens) into a coherent plot. Legendary for predicting the fall of the Twin Towers.',
    tags: ['Cyberpunk', 'Illuminati', 'AI', 'NWO'],
    realityScore: 75,
    complexity: 'HIGH',
    relatedTheoryTags: ['NWO', 'Illuminati', 'AI']
  },
  {
    id: 'm4',
    title: 'They Live',
    type: 'MOVIE',
    year: 1988,
    creator: 'John Carpenter',
    descriptionDe: 'Ein Bauarbeiter findet eine Sonnenbrille, die enthüllt, dass die herrschende Klasse in Wirklichkeit Aliens sind, die uns durch subliminale Botschaften kontrollieren.',
    descriptionEn: 'A construction worker discovers sunglasses that reveal the ruling class are actually aliens controlling us through subliminal messages.',
    tags: ['Aliens', 'Control', 'Media', 'Subliminal'],
    realityScore: 50,
    complexity: 'MEDIUM',
    relatedTheoryTags: ['Reptilians', 'NWO', 'Mind Control']
  },
  {
    id: 'm5',
    title: 'Illuminatus! Trilogy',
    type: 'BOOK',
    year: 1975,
    creator: 'Robert Shea & Robert Anton Wilson',
    descriptionDe: 'Ein satirischer, postmoderner Roman, der den Diskordianismus und die Illuminaten-Verschwörung popularisierte. Ein psychedelischer Trip durch die Gegenkultur.',
    descriptionEn: 'A satirical, postmodern novel that popularized Discordianism and the Illuminati conspiracy. A psychedelic trip through counterculture.',
    tags: ['Illuminati', 'Satire', 'Discordianism', 'Fnord'],
    realityScore: 30,
    complexity: 'MINDBENDING',
    relatedTheoryTags: ['Illuminati', 'Atlantis', 'JFK']
  },
  {
    id: 'm25',
    title: 'Inside Job',
    type: 'SERIES',
    year: 2021,
    creator: 'Shion Takeuchi',
    descriptionDe: 'Für die Mitarbeiter von Cognito Inc. sind Verschwörungstheorien keine Fiktion, sondern Fakten. Eine brillante Satire über den "Deep State", die Echsenmenschen, Chemtrails und den Mandela-Effekt als bürokratischen Albtraum darstellt.',
    descriptionEn: 'For the employees of Cognito Inc., conspiracy theories aren\'t fiction, they\'re facts. A brilliant satire on the "Deep State", portraying lizard people, chemtrails, and the Mandela Effect as a bureaucratic nightmare.',
    tags: ['Deep State', 'Animation', 'Satire', 'Workplace'],
    realityScore: 90,
    complexity: 'HIGH',
    relatedTheoryTags: ['Deep State', 'Reptiloide', 'Hohle Erde', 'Mondlandung']
  },
];

// Enrich with generated art
export const MEDIA_ITEMS: MediaItem[] = RAW_MEDIA_ITEMS.map(item => ({
    ...item,
    imageUrl: generateArt(item.id, item.type, item.title)
}));
