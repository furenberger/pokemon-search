const DATA_URI = 'https://raw.githubusercontent.com/furenberger/pokemon-search/master/pokemon.json';
const SPRITE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

const pokemonArray = [];

const search = document.querySelector('.search');
const suggestions = document.querySelector('.suggestions');

search.addEventListener('change', displayMatches);
search.addEventListener('keyup', displayMatches);

function logger(message) {
  return (chainData) => {
    console.log(message, chainData);
    return chainData;
  };
}

fetch(DATA_URI)
  .then(response => response.json())
  // .then(logger('response'))
  .then(json => pokemonArray.push(...json));
// .then(logger('pokemon'));

function findMatches(wordToMatch, pokemon) {
  return pokemon.filter(name => {
    const regexp = new RegExp(wordToMatch, 'gi');
    return name.Name.match(regexp);
  });
}

function displayMatches() {
  const matches = findMatches(this.value, pokemonArray);
  console.log(matches);

  const html = matches.map(matchedPokemon => {
    // const regexp = new RegExp(this.value, 'gi');

    const pokemonName = matchedPokemon.Name;
    const pokemonNumber = Number(matchedPokemon.Number);
    const pokemonSprite = `${SPRITE_URL}/${pokemonNumber}.png`;

    return `
    <li>
      <span class="name">${pokemonName}</span>
      <span class="number">${pokemonNumber}</span>
      <span class="sprite"><img src="${pokemonSprite}" alt="${pokemonNumber}" class="sprite-image"></span>
    </li>`;
  }).join('');
  suggestions.innerHTML = html;
}
