// data.js — fictional game catalog shared across pages (no real titles/IP)

var GAMES = [
  { id:'iron-vanguard',        title:'Iron Vanguard',        genre:'fps',   price:59.99, icon:'🎯', tagline:'Elite squad combat across shattered frontlines.',
    description:'Lead a four-person strike team through a fractured warzone. Iron Vanguard blends tight gunplay with squad tactics — call in air support, breach fortified positions, and adapt your loadout mid-mission.' },
  { id:'wolf-protocol',        title:'Wolf Protocol',        genre:'fps',   price:39.99, icon:'🐺', tagline:'Silent ops. Loud consequences.',
    description:'A stealth-first shooter where every firefight you avoid is a mission well played. Wolf Protocol rewards patience, recon, and precision over spray-and-pray.' },
  { id:'crimson-reckoning',    title:'Crimson Reckoning',    genre:'action',price:49.99, icon:'⚔️', tagline:'A city burns. Only one crew can save it.',
    description:'Fast, brutal, over-the-top combat set in a neon-lit city on the edge of collapse. Chain combos across rooftops, cars, and collapsing buildings.' },
  { id:'nightfall-syndicate',  title:'Nightfall Syndicate',  genre:'action',price:44.99, icon:'🌆', tagline:'Rise through the underworld, one heist at a time.',
    description:'Plan elaborate heists, recruit a crew, and climb the ranks of a criminal syndicate. Every choice ripples into how the next job plays out.' },
  { id:'shadow-warden',        title:'Shadow Warden',        genre:'tpp',   price:54.99, icon:'🗡️', tagline:'Command the blade. Master the shadows.',
    description:'A third-person action-adventure following an exiled warden reclaiming a cursed kingdom. Fluid melee combat meets a branching story shaped by your choices.' },
  { id:'ashen-legacy',         title:'Ashen Legacy',         genre:'tpp',   price:34.99, icon:'🛡️', tagline:'An empire in ruin. A legacy to reclaim.',
    description:'Explore the ashes of a fallen empire as its last heir. Ashen Legacy pairs open-world exploration with grounded, weighty third-person combat.' },
  { id:'void-walker',          title:'Void Walker',          genre:'fpp',   price:29.99, icon:'🌌', tagline:'Step through the void. Nothing is as it seems.',
    description:'A first-person exploration game about walking through impossible spaces. Void Walker is slow, strange, and unforgettable.' },
  { id:'hollow-signal',        title:'Hollow Signal',        genre:'fpp',   price:24.99, icon:'📡', tagline:'Something is transmitting from the depths.',
    description:'A first-person survival-mystery set on an abandoned research vessel. Trace the signal, or turn back — Hollow Signal remembers which you chose.' },
  { id:'echoes-of-aldenmoor',  title:'Echoes of Aldenmoor',  genre:'story', price:19.99, icon:'🍃', tagline:'A quiet village. A story worth remembering.',
    description:'A gentle, narrative-driven game about returning home. Echoes of Aldenmoor is built around conversation, memory, and small, meaningful choices.' },
  { id:'paper-skies',          title:'Paper Skies',          genre:'story', price:14.99, icon:'🕊️', tagline:'A hand-drawn journey about letting go.',
    description:'A short, hand-illustrated story about two siblings and the summer that changed everything. Paper Skies takes about two hours to finish, and stays with you longer.' }
];

var GENRE_LABEL = { fps:'FPS', action:'Action', tpp:'TPP', fpp:'FPP', story:'Story' };
var GENRE_VAR   = { fps:'--genre-fps', action:'--genre-action', tpp:'--genre-tpp', fpp:'--genre-fpp', story:'--genre-story' };

function getGame(id) {
  return GAMES.find(function(g){ return g.id === id; });
}

function genreTagHtml(genre) {
  return '<span class="genre-tag ' + genre + '">' + GENRE_LABEL[genre] + '</span>';
}

function coverStyle(genre) {
  var v = GENRE_VAR[genre];
  return 'background:linear-gradient(135deg, var(' + v + '), #0b0e14);';
}
