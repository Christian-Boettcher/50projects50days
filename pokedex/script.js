// const pokemon_count = 905
const pokemon_count = 12 //DEBUG
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

const poke_container = document.getElementById('poke-container')
const cards = document.getElementsByClassName("card")
const main_types = Object.keys(colors)

/*SEARCH BAR */
const poke_search = document.getElementById('searchbar')
poke_search.addEventListener('input', (event)=>{search(event.target.value)},false)

/*POKEBALL TOGGLE SWITCH */
const checkboxLabel = document.querySelector('label[for="pokeToggle"]')
const pokeToggle = document.getElementById("pokeToggle")
// pokeToggle.addEventListener('change', (event)=>toggleViewStyle(event.target))
pokeToggle.addEventListener('keydown', (event)=>
    {if (event.key === 'Enter')
        {
            event.target.checked = !event.target.checked
            // toggleViewStyle(event.target)
            pokeToggle.onchange()
        }
    },false)

/*RANGE SLIDER*/
const slidercontainer = document.getElementById("slidecontainer")
const slider = document.getElementById("pokeRange")
const sliderText = document.getElementById("sliderInputText")
slider.setAttribute('min',1)
slider.setAttribute('max',pokemon_count)

sliderText.setAttribute('min',1)
sliderText.setAttribute('max',pokemon_count)
sliderText.setAttribute('value',slider.value)
// sliderText.innerText = slider.value

const fetchPokemons = async () => 
{
    for(let i = 1; i <= pokemon_count; i++) 
    {
        await getPokemon(i)
    }
}

const getPokemon = async (id) => 
{
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`
    const res = await fetch(url)
    const data = await res.json()
    createPokemonCard(data, getEntry(data.species.url))
}

//https://pokeapi.co/api/v2/evolution-chain/${id}/
const getEntry = async (url) =>
{
    const res = await fetch(url)
    let data = res.json()
    return data;
}

const createPokemonCard = (pokemon, dataEntry) => 
{
    const pokemonElement = document.createElement('div')
    pokemonElement.classList.add('pokemon')
    pokemonElement.setAttribute('type', 'button');
    pokemonElement.setAttribute('tabindex', pokemon.id + 4);

    const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1)
    const id = pokemon.id.toString().padStart(3, '0')
    const poke_types = pokemon.types.map(type => type.type.name)
    const type = main_types.find(type => poke_types[0].indexOf(type) > -1)
    const color = colors[type]
    let type2 = ""
    let color2 = "transparent"
    if(poke_types[1]!==undefined)
    {
        type2 = main_types.find(type => poke_types[1].indexOf(type) > -1)
        color2 = colors[type2]
    }
    const weight = pokemon.weight/10
    const height = pokemon.height/10

    dataEntry.then((value) => 
    {
        let entry="";
        for (let index = 0; index < value.flavor_text_entries.length; index++)
        {
            const element = value.flavor_text_entries[index];
            if(element.language.name === 'en')
            {
                entry = value.flavor_text_entries[index].flavor_text.replace("\f", " ");
                break;
            }
        }
        const pokemonInnerHTML = `
        <div class="card expanded" id="card">
            <div class="front face">
                <div class="img-container">
                    <div class="type-bg">
                        <img class="type-bg" src="./images/${type}.svg"/>
                    </div>
                    <div class="poke-img">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png" alt="${name}">
                    </div>
                </div>
        
                <div class="info">
                    <span class="number">#${id}</span>
                    <h3 class="name">${name}</h3>
                </div>
            </div>
        
            <div class="back face">
                <div class="entry">
                    <p>${entry}</p>
                    <p class="type">Type:</p>
                        
                        <div class="typeContainer">
                            <span class="typeOne" style="background-color:${color}"> ${type} </span>
                            ${type2?`<span class="typeTwo"style="background-color:${color2}"> ${type2} </span>`:`<span></span>`}
                            
                        </div>
                    
                    <p class="weight">Weight: <span>${weight}kgs</span> </p>
                    <p class="height">Height: <span>${height}m</span> </p>
                </div>
            </div>
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
        
        pokemonElement.innerHTML = pokemonInnerHTML

        pokemonElement.firstElementChild.style.backgroundColor = color

        pokemonElement.addEventListener('click', ()=>{pokemonElement.firstElementChild.classList.toggle('flipped')},false)
        pokemonElement.addEventListener('blur', ()=>{if (pokemonElement.firstElementChild.classList.contains('flipped')){pokemonElement.firstElementChild.classList.toggle('flipped')}},false)
        pokemonElement.addEventListener('keydown', (event)=>{if (event.key === 'Enter'){event.target.firstElementChild.classList.toggle('flipped')}},false)
        pokemonElement.addEventListener('mouseleave', ()=>{pokemonElement.blur()},false)
    })
    
    poke_container.appendChild(pokemonElement)

    const pokemon_list = document.querySelectorAll('div.pokemon')

    if(Array.from(pokemon_list).indexOf(pokemonElement) >= slider.value)
    {
        pokemonElement.style.display = 'none'
    }
    else
    {
        pokemonElement.style.display = 'block'
    }
}

/*SEARCH BAR */
function search(value)
{
    const pokemon_list = document.querySelectorAll('div.pokemon')
    const pokemon_names = document.querySelectorAll('div.pokemon .card .front .info .name')
    const pokemon_types = document.querySelectorAll('div.pokemon .back .entry .typeContainer .typeOne')
    const option_list = document.getElementById('poke-name-list')
    
    if(option_list.hasChildNodes)
    {
        while (option_list.firstChild)
        {
            option_list.removeChild(option_list.firstChild);
        }
    }

    for (let index = 0; index < pokemon_names.length; index++) 
    {
        const option = document.createElement('option')
        option.value = pokemon_names[index].innerText
        option_list.appendChild(option)
        let type2 = pokemon_list[index].querySelector('.back .entry .typeContainer .typeTwo')

        if(String(pokemon_names[index].innerText).toLowerCase().includes(value.toLowerCase()) || String(pokemon_types[index].innerText).toLowerCase().includes(value.toLowerCase()))
        {
            pokemon_list[index].style.display = "block"
        }
        else
        {
            if(!type2 || !String(type2.innerText).toLowerCase().includes(value.toLowerCase()))
            {
                pokemon_list[index].style.display = "none"
            }
            else
            {
                console.log(String(pokemon_names[index].innerText),String(type2.innerText))
            }
        }
    }
}

/*POKEBALL TOGGLE SWITCH */
// function toggleViewStyle(){pokeToggle.onchange()}

pokeToggle.onchange = function() //function toggleViewStyle(target)
{
  this.checked ? checkboxLabel.innerText = "Compact" : checkboxLabel.innerText = "Comfortable"

  for (let index = 0; index < cards.length; index++) 
  {
    cards[index].addEventListener('transitionend', (event) => 
    {
        toggleFlex(event.target, this);
    });

    cards[index].firstElementChild.style.opacity = "0"
    setTimeout(()=>{cards[index].classList.toggle("expanded"),cards[index].classList.toggle("compact")}, 200);
  }
}

function toggleFlex(cards,target)
{
    target.checked ? 
        cards.firstElementChild.style.flexDirection = "column"
    :
        cards.firstElementChild.style.flexDirection = "row-reverse"
    
    cards.firstElementChild.style.opacity = "1"
}

/*RANGE SLIDER*/

function setPokeRange(element)
{
    const pokemon_list = document.querySelectorAll('div.pokemon')
    slider.value = element.value
    sliderText.value = element.value

    for (let index = poke_container.childElementCount; index--;) 
    {
        element.value-1 >= index
        ?
            pokemon_list[index].style.display = 'block'
        :
            pokemon_list[index].style.display = 'none'
    }
}

fetchPokemons()