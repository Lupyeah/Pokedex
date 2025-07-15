const pokeApi = {}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then((pokemonData) => {
            const pokemonObject = new Pokemon()
            pokemonObject.number = pokemonData.id
            pokemonObject.name = pokemonData.name
            const types = pokemonData.types.map((t) => t.type.name)
            const [type] = types
            pokemonObject.types = types
            pokemonObject.type = type
            pokemonObject.photo = pokemonData.sprites.other.dream_world.front_default

            return pokemonObject
        })
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailsRequests) => Promise.all(detailsRequests))
}
