const DATA_URI = 'https://raw.githubusercontent.com/furenberger/pokemon-search/master/pokemon.json';
const SPRITE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

const pokemonArray = [];

const search = document.querySelector('.search');
const suggestions = document.querySelector('.suggestions');

function logger(message) { // eslint-disable-line no-unused-vars
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

function findMatchesByName(wordToMatch, pokemon) {
  return pokemon.filter(name => {
    const regexp = new RegExp(wordToMatch, 'gi');
    return name.Name.match(regexp);
  });
}

function findMatchesByNumber(wordToMatch, pokemon) {
  return pokemon.filter(name => {
    const regexp = new RegExp('^' + wordToMatch + '$'); // eslint-disable-line prefer-template
    return name.Number.match(regexp);
  });
}

function displayMatches() {
  while (suggestions.firstChild) suggestions.removeChild(suggestions.firstChild);

  const matches = findMatchesByName(this.value, pokemonArray);

  if (this.value.length <= 0) {
    suggestions.innerHTML = '<li>Filter for a Pokemon</li>';
    return;
  }

  suggestions.innerHTML = matches.map(matchedPokemon => {
    const pokemonName = matchedPokemon.Name;
    const pokemonNumber = Number(matchedPokemon.Number);
    const pokemonSprite = `${SPRITE_URL}/${pokemonNumber}.png`;

    return `
      <li data-pokemonnumber=${pokemonNumber}>
        <span class="name">${pokemonName}</span>
        <span class="number">${pokemonNumber}</span>
        <span class="sprite"><img src="${pokemonSprite}" alt="${pokemonNumber}" class="sprite-image"></span>
      </li>
    `;
  }).join('');
}


function toggleDetail(e) {
  let node = e.target;
  if (!node.matches('li')) {
    node = node.parentElement;
  }

  if (node.dataset && node.dataset.pokemonnumber) {
    const pokemonStringNumber = node.dataset.pokemonnumber.padStart(3, '0');
    const thisPokemon = findMatchesByNumber(pokemonStringNumber, pokemonArray);
    const detail = document.querySelector('.detail');

    if (thisPokemon && thisPokemon[0]) {
      console.log(thisPokemon[0]);
      const pokemonName = thisPokemon[0].Name;
      const pokemonClass = thisPokemon[0].Classification;
      const pokemonNumber = Number(thisPokemon[0].Number);
      const pokemonSprite = `${SPRITE_URL}/${pokemonNumber}.png`;

      detail.innerHTML = `
        <div class="detail-pokemon">
          <div class="detail-name">${pokemonName}</div>
          <img src="${pokemonSprite}" alt="${pokemonNumber}" class="sprite-image">
          <div class="detail-text">Classification: ${pokemonClass}</div>
        <div>
      `;
    } else {
      detail.innerHTML = '';
    }
  }
}

search.addEventListener('change', displayMatches);
search.addEventListener('keyup', displayMatches);
suggestions.addEventListener('click', toggleDetail, true);
