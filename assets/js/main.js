const pokemonList = document.querySelector('#pokemonList');
const loadMoreButton = document.querySelector("#loadMoreButton");
const maxRecords = 151;
const limit = 12;
let offset = 0;

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map((pokemon) =>
            `<a class="pokemon-link" href="details.html?id=${pokemon.number}">
                <li class="pokemon ${pokemon.type}">
                    <span class="number">#${String(pokemon.number).padStart(3, '0')}</span>
                    <span class="name">${pokemon.name}</span>
                
                    <div class="detail">
                        <ol class="types">
                            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                        </ol>
    
                        <img src="${pokemon.photo}" alt="${pokemon.name}">
                    </div>
                </li>
            </a>`
        ).join('')
        pokemonList.innerHTML += newHtml;
    })
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordNexPage = offset + limit;
    if (qtdRecordNexPage >= maxRecords) {
        const newLimit =  maxRecords - offset;
        loadPokemonItens(offset, newLimit);
        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItens(offset, limit)
    }
})