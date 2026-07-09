export type Episode = {
  number: number;
  title: string;
  duration: number; // minutes
  description: string;
};

export type Anime = {
  id: string;
  title: string;
  romaji?: string;
  tagline: string;
  synopsis: string;
  genres: string[];
  year: number;
  studio: string;
  rating: number; // 0-10
  maturity: 'PG' | '13+' | '16+' | '18+';
  status: 'Ongoing' | 'Completed' | 'Upcoming';
  episodesTotal: number;
  seasons: number;
  featured: boolean;
  trendingRank?: number;
  isNew?: boolean;
  // Visual assets from Pexels (atmospheric / neon photography used as key art)
  banner: string;
  poster: string;
  accent: string; // hex used for gradients/glows
  episodes: Episode[];
};

// Pexels image IDs chosen for cinematic, neon-noir atmosphere.
const px = (id: number, w = 800, h = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;

const banner = (id: number, w = 1600, h = 900) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;

const ep = (number: number, title: string, duration: number, description: string): Episode => ({
  number,
  title,
  duration,
  description,
});

export const CATALOG: Anime[] = [
  {
    id: 'neon-requiem',
    title: 'Neon Requiem',
    romaji: 'Neon Requiem',
    tagline: 'In a city that never sleeps, a ghost hunts the ones who built it.',
    synopsis:
      'In 2099 Neo-Kyoto, a renegade netrunner awakens with no memory and a price on her head. As she pieces together her past, she discovers a conspiracy that links the city\u2019s elite to a forbidden AI. A pulse-pounding cyberpunk thriller about identity, memory, and the ghosts we become.',
    genres: ['Cyberpunk', 'Action', 'Thriller', 'Sci-Fi'],
    year: 2024,
    studio: 'Studio Aurora',
    rating: 9.2,
    maturity: '16+',
    status: 'Ongoing',
    episodesTotal: 12,
    seasons: 1,
    featured: true,
    trendingRank: 1,
    accent: '#ff2d55',
    banner: banner(32670989),
    poster: px(32670989),
    episodes: [
      ep(1, 'Ghost in the Rain', 24, 'A netrunner wakes in a rain-soaked alley with no memory and a synaptic kill-switch ticking down.'),
      ep(2, 'Black Ice', 24, 'Her first dive into the dataline reveals a name she shouldn\u2019t know and an AI that knows hers.'),
      ep(3, 'Chrome Hearts', 24, 'A deal with a fixer goes sideways when the corporate hit squad arrives early.'),
      ep(4, 'Static', 24, 'A fragment of memory surfaces: a rooftop, a promise, and a face she can\u2019t place.'),
      ep(5, 'Overclock', 24, 'To survive a citywide manhunt she overclocks her implants past the point of no return.'),
      ep(6, 'The Long Goodnight', 24, 'An old ally resurfaces with a warning and a map to the vault under the Spire.'),
      ep(7, 'Daemon', 24, 'The forbidden AI speaks, and what it offers changes everything.'),
      ep(8, 'Red Line', 24, 'The kill-switch reaches its final countdown as the conspiracy closes in.'),
    ],
  },
  {
    id: 'sakura-no-yuki',
    title: 'Sakura no Yuki',
    romaji: '\u685c\u306e\u96ea',
    tagline: 'A swordsman, a promise, and the winter that won\u2019t end.',
    synopsis:
      'During the final years of the Edo period, a wandering swordsman carrying a cursed blade seeks the man who destroyed his clan. As the last snow falls, he meets a blind shrine maiden who can see the memories his sword has stolen. A lyrical, sword-and-sorcery historical drama.',
    genres: ['Historical', 'Drama', 'Action', 'Supernatural'],
    year: 2023,
    studio: 'Hanami Works',
    rating: 8.9,
    maturity: '16+',
    status: 'Completed',
    episodesTotal: 24,
    seasons: 2,
    featured: true,
    trendingRank: 4,
    accent: '#00e5c7',
    banner: banner(31002085),
    poster: px(31002085),
    episodes: [
      ep(1, 'The First Snow', 24, 'A swordsman arrives at a frozen village and meets a maiden who hears what his blade has done.'),
      ep(2, 'Crimson Petals', 24, 'A duel on the bridge forces him to confront the first of his clan\u2019s killers.'),
      ep(3, 'The Blind Eye', 24, 'The shrine maiden reveals what she sees when she touches his cursed steel.'),
      ep(4, 'Embers', 24, 'An old sensei offers to break the curse, for a price the swordsman refuses to pay.'),
    ],
  },
  {
    id: 'starlight-oracle',
    title: 'Starlight Oracle',
    romaji: '\u661f\u5149\u306e\u4e88\u8a00\u8005',
    tagline: 'The stars chose her. The kingdom wants her silenced.',
    synopsis:
      'In a floating city above the clouds, a young oracle foresees a catastrophe the ruling council is desperate to hide. Hunted by inquisitors and protected by a disgraced knight, she must reach the Starwell before the next eclipse. A sweeping fantasy adventure.',
    genres: ['Fantasy', 'Adventure', 'Magic'],
    year: 2024,
    studio: 'Lumen Pictures',
    rating: 8.6,
    maturity: '13+',
    status: 'Ongoing',
    episodesTotal: 13,
    seasons: 1,
    featured: false,
    trendingRank: 2,
    isNew: true,
    accent: '#ffd56b',
    banner: banner(30975079),
    poster: px(30975079),
    episodes: [
      ep(1, 'The Oracle Wakes', 24, 'A vision of fire and falling stone pulls a girl out of her quiet life.'),
      ep(2, 'The Disgraced Knight', 24, 'A knight with a broken oath becomes her only ally.'),
      ep(3, 'Cloud Sea', 24, 'The path to the Starwell lies across a sea of clouds and the beasts within it.'),
      ep(4, 'Eclipse', 24, 'The council\u2019s inquisitors close in as the eclipse draws near.'),
    ],
  },
  {
    id: 'mecha-paradox',
    title: 'Mecha Paradox',
    romaji: '\u30e1\u30ab\u30d1\u30e9\u30c9\u30c3\u30af\u30b9',
    tagline: 'To win the war, she must become the weapon she fears.',
    synopsis:
      'A teenage pilot discovers her mech is piloted by a future version of herself, sent back to prevent a defeat that hasn\u2019t happened yet. As timelines collide, she must decide which version of her own story to believe. A mind-bending mecha epic.',
    genres: ['Mecha', 'Sci-Fi', 'Action', 'Drama'],
    year: 2024,
    studio: 'Ironframe',
    rating: 8.8,
    maturity: '13+',
    status: 'Ongoing',
    episodesTotal: 24,
    seasons: 2,
    featured: false,
    trendingRank: 3,
    isNew: true,
    accent: '#7c5cff',
    banner: banner(34958805),
    poster: px(34958805),
    episodes: [
      ep(1, 'Echo Pilot', 24, 'In the cockpit of her father\u2019s mech, a girl hears a voice that calls her by name.'),
      ep(2, 'Two of Me', 24, 'The future pilot refuses to explain the war she came back to prevent.'),
      ep(3, 'Divergence', 24, 'A skirmish that should have been a victory becomes something neither of them remembers.'),
      ep(4, 'The Loop', 24, 'A single decision rewrites the battlefield and breaks the loop.'),
    ],
  },
  {
    id: 'caf\u00e9-lumiere',
    title: 'Caf\u00e9 Lumi\u00e8re',
    romaji: '\u30ab\u30d5\u30a7\u30fb\u30eb\u30df\u30a8\u30fc\u30eb',
    tagline: 'Every cup holds a memory. Some are better left steeped.',
    synopsis:
      'A tiny caf\u00e9 in old Kyoto serves coffee that lets its customers relive a single memory. The barista, a quiet woman with a past of her own, learns that some guests come not to remember, but to forget. A cozy, bittersweet slice-of-life romance.',
    genres: ['Slice of Life', 'Romance', 'Drama', 'Supernatural'],
    year: 2023,
    studio: 'Pastel Studio',
    rating: 8.4,
    maturity: 'PG',
    status: 'Completed',
    episodesTotal: 12,
    seasons: 1,
    featured: false,
    accent: '#f5b13d',
    banner: banner(31001252),
    poster: px(31001252),
    episodes: [
      ep(1, 'The First Cup', 24, 'A stranger orders a memory and leaves a tear in the saucer.'),
      ep(2, 'Rainy Day Blend', 24, 'A regular returns every storm, ordering the same girl he lost.'),
      ep(3, 'Bittersweet', 24, 'The barista\u2019s own memory threatens to steep its way back.'),
      ep(4, 'Last Pour', 24, 'The caf\u00e9 closes for a day, and the town shows up to say goodbye.'),
    ],
  },
  {
    id: 'demon-hunter-saga',
    title: 'Demon Hunter Saga',
    romaji: '\u9b54\u795e\u30cf\u30f3\u30bf\u30fc\u4f1d',
    tagline: 'Eight blades. One mountain. A hundred thousand demons.',
    synopsis:
      'After his village is swallowed by a demon horde, a boy trains under eight legendary swordsmen to wield the blades that can kill immortals. A blistering shounen battle epic with breathtaking animation.',
    genres: ['Action', 'Supernatural', 'Adventure', 'Shounen'],
    year: 2024,
    studio: 'Bladeworks',
    rating: 9.0,
    maturity: '16+',
    status: 'Ongoing',
    episodesTotal: 26,
    seasons: 3,
    featured: false,
    trendingRank: 5,
    isNew: true,
    accent: '#ff2d55',
    banner: banner(32549998),
    poster: px(32549998),
    episodes: [
      ep(1, 'The Mountain Swallows', 24, 'A boy survives the night his village is erased and is found by the eight.'),
      ep(2, 'First Blade', 24, 'The first swordsman teaches him that a blade is only as good as the breath behind it.'),
      ep(3, 'Eight Paths', 24, 'He must choose which of the eight styles will become his own.'),
      ep(4, 'The Demon General', 24, 'A demon who speaks his dead mother\u2019s voice tests his resolve.'),
    ],
  },
  {
    id: 'hollow-frequency',
    title: 'Hollow Frequency',
    romaji: '\u30db\u30ed\u30fc\u30fb\u30d5\u30ec\u30af\u30a8\u30f3\u30b7\u30fc',
    tagline: 'The radio plays a song that no one recorded.',
    synopsis:
      'A college DJ discovers a pirate frequency that broadcasts songs from a station that burned down forty years ago. As the music pulls listeners into a shared dream of the night of the fire, she races to find the voice behind the static. A slow-burn psychological horror.',
    genres: ['Horror', 'Mystery', 'Psychological', 'Supernatural'],
    year: 2023,
    studio: 'Nightshift',
    rating: 8.3,
    maturity: '16+',
    status: 'Completed',
    episodesTotal: 12,
    seasons: 1,
    featured: false,
    accent: '#00e5c7',
    banner: banner(32670989),
    poster: px(32670989),
    episodes: [
      ep(1, 'Static', 24, 'A late-night scan of the dial lands on a song that shouldn\u2019t exist.'),
      ep(2, 'The Night of the Fire', 24, 'Listeners share the same dream and wake with ash on their hands.'),
      ep(3, 'The Voice', 24, 'She tracks the signal to a ruin and a voice that knows her name.'),
      ep(4, 'Final Broadcast', 24, 'To end the loop she must play the last song the station never aired.'),
    ],
  },
  {
    id: 'skybound-pirates',
    title: 'Skybound Pirates',
    romaji: '\u5929\u9a79\u306e\u6d77\u8cca',
    tagline: 'The sky is an ocean. The ocean has teeth.',
    synopsis:
      'A young navigator joins a crew of sky-pirates hunting the floating ruins of a lost empire. Between rival fleets, sky-krakens, and a stolen map that changes on its own, the real treasure might be the family she finds along the way. A grand adventure.',
    genres: ['Adventure', 'Action', 'Comedy', 'Fantasy'],
    year: 2024,
    studio: 'Cloudbreak',
    rating: 8.7,
    maturity: '13+',
    status: 'Ongoing',
    episodesTotal: 24,
    seasons: 2,
    featured: false,
    trendingRank: 6,
    accent: '#00e5c7',
    banner: banner(30975079),
    poster: px(30975079),
    episodes: [
      ep(1, 'All Hands', 24, 'A stowaway becomes a navigator when the crew needs one by sundown.'),
      ep(2, 'The Living Map', 24, 'The stolen chart redraws itself every night to dodge them.'),
      ep(3, 'Sky-Kraken', 24, 'A storm reveals something far larger nesting in the clouds.'),
      ep(4, 'Rival Tides', 24, 'A rival captain offers a deal that\u2019s too clean to trust.'),
    ],
  },
  {
    id: 'midnight-classroom',
    title: 'Midnight Classroom',
    romaji: '\u6df1\u591c\u306e\u6559\u5ba4',
    tagline: 'Seven students. One rule. Don\u2019t answer when it calls the roll.',
    synopsis:
      'A transfer student arrives at a school where, every night at 12:07, the classroom fills with students who died decades ago. When the roll is called, you must answer. Answer wrong, and you stay forever. A sharp, scary school horror.',
    genres: ['Horror', 'Mystery', 'School', 'Supernatural'],
    year: 2023,
    studio: 'Nightshift',
    rating: 8.1,
    maturity: '16+',
    status: 'Completed',
    episodesTotal: 12,
    seasons: 1,
    featured: false,
    accent: '#ff2d55',
    banner: banner(31001252),
    poster: px(31001252),
    episodes: [
      ep(1, '12:07', 24, 'The new kid learns the rule the hard way on his first night.'),
      ep(2, 'The Roll', 24, 'A student who answered wrong begins to fade by day.'),
      ep(3, 'The Empty Desk', 24, 'They trace the curse to a teacher who never left.'),
      ep(4, 'Last Bell', 24, 'To break the cycle they must be present when the bell rings for the last time.'),
    ],
  },
  {
    id: 'garden-of-ash',
    title: 'Garden of Ash',
    romaji: '\u7070\u306e\u5ead',
    tagline: 'She grows flowers from the bones of gods.',
    synopsis:
      'In a world where the old gods were buried to end a war, a girl discovers she can make flowers bloom from their remains \u2014 flowers that grant one wish and take one memory. A quiet, devastating post-apocalyptic drama about what we choose to forget.',
    genres: ['Drama', 'Post-Apocalyptic', 'Supernatural', 'Slice of Life'],
    year: 2024,
    studio: 'Studio Aurora',
    rating: 8.9,
    maturity: '13+',
    status: 'Ongoing',
    episodesTotal: 12,
    seasons: 1,
    featured: false,
    isNew: true,
    accent: '#ffd56b',
    banner: banner(34958805),
    poster: px(34958805),
    episodes: [
      ep(1, 'First Bloom', 24, 'A girl plants a seed in god-bone soil and a stranger comes to collect the wish.'),
      ep(2, 'The Price', 24, 'She learns what a single flower costs the one who plucks it.'),
      ep(3, 'The Gardener', 24, 'A man offers to protect her garden from those who would harvest it.'),
      ep(4, 'Wither', 24, 'The first flower dies and the memory it took comes due.'),
    ],
  },
  {
    id: 'tideborn',
    title: 'Tideborn',
    romaji: '\u6f6e\u751f\u308c',
    tagline: 'The sea remembers everyone it takes.',
    synopsis:
      'A coastal town where, every generation, the sea returns one person it swallowed. This year it returns a girl who drowned a hundred years ago \u2014 and she remembers everything. A haunting, romantic mystery.',
    genres: ['Mystery', 'Romance', 'Supernatural', 'Drama'],
    year: 2023,
    studio: 'Hanami Works',
    rating: 8.5,
    maturity: '13+',
    status: 'Completed',
    episodesTotal: 12,
    seasons: 1,
    featured: false,
    accent: '#00e5c7',
    banner: banner(31002085),
    poster: px(31002085),
    episodes: [
      ep(1, 'The Return', 24, 'The tide leaves a girl on the rocks who has been dead for a century.'),
      ep(2, 'Salt and Memory', 24, 'A boy who lost his brother to the same sea befriends her.'),
      ep(3, 'The Lighthouse', 24, 'The keeper knows why the sea gives back, and why it always takes again.'),
      ep(4, 'Low Tide', 24, 'She has until the next full moon to decide whether to stay.'),
    ],
  },
  {
    id: 'ironchef-academy',
    title: 'Iron Chef Academy',
    romaji: '\u9244\u306e\u6599\u7406\u4eba',
    tagline: 'Only one knife. Only one apron. Only one winner.',
    synopsis:
      'The most elite culinary school in the world accepts twelve students a year and graduates one. Between impossible ingredients, sabotage, and a headmaster with a legend\u2019s palate, friendship is the first thing on the menu. A high-energy cooking competition anime.',
    genres: ['Comedy', 'Drama', 'School', 'Sports'],
    year: 2024,
    studio: 'Pastel Studio',
    rating: 8.2,
    maturity: 'PG',
    status: 'Ongoing',
    episodesTotal: 24,
    seasons: 2,
    featured: false,
    accent: '#f5b13d',
    banner: banner(32549998),
    poster: px(32549998),
    episodes: [
      ep(1, 'Twelve Seats', 24, 'The new class learns the only rule: cook, or go home.'),
      ep(2, 'The Blind Palate', 24, 'The headmaster tastes their dishes blind and eliminates the first.'),
      ep(3, 'Sabotage', 24, 'Someone swapped the salt for sugar, and everyone is a suspect.'),
      ep(4, 'The Impossible Ingredient', 24, 'A box from the deep sea tests every technique they know.'),
    ],
  },
];

export const ALL_GENRES = Array.from(
  new Set(CATALOG.flatMap((a) => a.genres))
).sort();

export const featuredTitles = CATALOG.filter((a) => a.featured);
export const trendingTitles = [...CATALOG]
  .filter((a) => a.trendingRank)
  .sort((a, b) => (a.trendingRank! - b.trendingRank!));
export const newReleases = CATALOG.filter((a) => a.isNew);
export const ongoingSeries = CATALOG.filter((a) => a.status === 'Ongoing');

export function byGenre(genre: string): Anime[] {
  return CATALOG.filter((a) => a.genres.includes(genre));
}

export function searchCatalog(query: string): Anime[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return CATALOG.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.romaji?.toLowerCase().includes(q) ||
      a.studio.toLowerCase().includes(q) ||
      a.genres.some((g) => g.toLowerCase().includes(q)) ||
      a.tagline.toLowerCase().includes(q)
  );
}

export function getAnime(id: string): Anime | undefined {
  return CATALOG.find((a) => a.id === id);
}
