document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonId = urlParams.get('id');
    if (pokemonId) {
        const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
        const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`;
        Promise.all([
            fetch(pokemonUrl).then(res => res.json()),
            fetch(speciesUrl).then(res => res.json())
        ])
        .then(([pokemonData, speciesData]) => {
            const pokemon = convertApiDataToPokemonModel(pokemonData, speciesData);
            displayPokemonDetails(pokemon);
        })
        .catch(error => console.error('Falha ao buscar dados do Pokémon:', error));
    }
});

function convertApiDataToPokemonModel(pokemonData, speciesData) {
    const pokemon = new Pokemon();
    pokemon.number = pokemonData.id;
    pokemon.name = pokemonData.name;
    const types = pokemonData.types.map((typeSlot) => typeSlot.type.name);
    const [type] = types;
    pokemon.types = types;
    pokemon.type = type;
    pokemon.photo = pokemonData.sprites.other.dream_world.front_default;
    pokemon.species = speciesData.genera.find(genus => genus.language.name === 'en')?.genus
    pokemon.height = pokemonData.height / 10;
    pokemon.weight = pokemonData.weight / 10;
    pokemon.abilities = pokemonData.abilities.map(a => a.ability.name).join(', ');
    pokemon.genderRate = speciesData.gender_rate;
    pokemon.eggGroups = speciesData.egg_groups.map(group => group.name).join(', ');
    pokemon.eggCycle = speciesData.hatch_counter;

    return pokemon;
}

function formatGender(genderRate) {
    if (genderRate === -1) {
        return 'Genderless';
    }
    const femalePercentage = (genderRate / 8) * 100;
    const malePercentage = 100 - femalePercentage;
    return `♀ ${femalePercentage}% / ♂ ${malePercentage}%`;
}

function displayPokemonDetails(pokemon) {
    const detailContainer = document.getElementById('pokemonDetail');
    const body = document.querySelector('body');
    const section = document.querySelector('section')
    section.className = '';
    section.classList.add('details-page', pokemon.type);
    const html = `
        <div class="pokemon-detail-card">
            <div class="header">
                <a href="index.html" class="back-button">←</a>
            </div>
            <div class="name-section">
                <span class="name">${pokemon.name}</span>
                <span class="number">#${String(pokemon.number).padStart(3, '0')}</span>
            </div>
            
            <ol class="types">
                ${pokemon.types.map(type => `<li class="type ${type}">${type}</li>`).join('')}
            </ol>
            
            <div class="pokemon-image">
                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
            
            <div class="info">
                <h2>About</h2>
                <table>
                    <tbody>
                        <tr><td>Species</td><td>${pokemon.species}</td></tr>
                        <tr><td>Height</td><td>${pokemon.height.toFixed(2)} m</td></tr>
                        <tr><td>Weight</td><td>${pokemon.weight.toFixed(1)} kg</td></tr>
                        <tr><td>Abilities</td><td>${pokemon.abilities}</td></tr>
                        <tr class="breeding"><td colspan="2">Breeding</td></tr>
                        <tr><td>Gender</td><td>${formatGender(pokemon.genderRate)}</td></tr>
                        <tr><td>Egg Groups</td><td>${pokemon.eggGroups}</td></tr>
                        <tr><td>Egg Cycle</td><td>${pokemon.eggCycle} (approx. steps)</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    detailContainer.innerHTML = html;
}
