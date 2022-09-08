const poke_container = document.getElementById('poke-container')
const poke_search = document.getElementById('searchbar')
poke_search.addEventListener('input', (event)=>{search(event.target.value)},false)
const pokemon_count = 151
const colors ={
    fire: '#ff983f',
    grass: '#35c04a',
	electric: '#fbd200',
	water: '#3393dd',
	ground: '#e97333',
	rock: '#c9b787',
	fairy: '#fb8aec',
	poison: '#b667cf',
	bug: '#84c400',
	dragon: '#006fca',
	psychic: '#ff6676',
	flying: '#8aace4',
	fighting: '#e12c6a',
	normal: '#929ba3',
    dark: '#5b5366',
    ghost: '#4b6ab3',
    ice: '#4bd2c1',
    steel: '#5a8fa3'
}

const main_types = Object.keys(colors)

const fetchPokemons = async () => {
    for(let i = 1; i <= pokemon_count; i++) {
        await getPokemon(i)
    }
}

const getPokemon = async (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`
    const res = await fetch(url)
    const data = await res.json()
    createPokemonCard(data)
}

const createPokemonCard = (pokemon) => {
    const pokemonEl = document.createElement('div')
    pokemonEl.classList.add('pokemon')

    pokemonEl.addEventListener('click', ()=>{flipCard(pokemonEl)},false)

    const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1)
    const id = pokemon.id.toString().padStart(3, '0')

    const poke_types = pokemon.types.map(type => type.type.name)
    const type = main_types.find(type => poke_types.indexOf(type) > -1)
    const color = colors[type]

    //pokemonEl.style.backgroundColor = color

    const pokemonInnerHTML = `
    <div class="card">
        <div class="front face">
            <div class="img-container">
                    <span>
                        <div class="type-bg">
                            <img src="./images/${type}.svg"/>
                        </div>
                        <img class="poke-img" 
                        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png" alt="${name}">
                    </span>
                </div>

                <div class="info">
                    <span class="number">#${id}</span>
                    <h3 class="name">${name}</h3>
                </div>
        </div>
            <div class="back face"><p class="type">Type: <span>${type}</span> </p></div>
    </div>
    `
    /**
    animated gifs as images

        const pokemonInnerHTML = `
        <div class="img-container">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemon.id}.gif" alt="${name}">
        </div>
        <div class="info">
            <span class="number">#${id}</span>
            <h3 class="name">${name}</h3>
            <small class="type">Type: <span>${type}</span> </small>
        </div>
        `
    */

    pokemonEl.innerHTML = pokemonInnerHTML

    pokemonEl.firstElementChild.style.backgroundColor = color

    poke_container.appendChild(pokemonEl)
}


function search(value)
{
    const pokemon_list = document.querySelectorAll('div.pokemon')
    const pokemon_names = document.querySelectorAll('div.pokemon .info .name')
    const option_list = document.getElementById('poke-name-list')
    
    if(option_list.hasChildNodes)
    {
        while (option_list.firstChild)
        {
            option_list.removeChild(option_list.firstChild);
        }
    }

    for(let index in pokemon_names)
    {
        const option = document.createElement('option')
        option.value = pokemon_names[index].innerText
        option_list.appendChild(option)

        !String(pokemon_names[index].innerText).toLowerCase().includes(value.toLowerCase())
        ?
            pokemon_list[index].style.display = "none"
        :
            pokemon_list[index].style.display = "block"
    }
}

function flipCard(value)
{
    value.firstElementChild.classList.contains('flipped') ? value.firstElementChild.classList.remove('flipped') : value.firstElementChild.classList.add('flipped')

}

fetchPokemons()
