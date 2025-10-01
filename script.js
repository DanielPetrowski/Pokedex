let allPokemonList = [];
let currentIndex = 0;
let isLoading = false;
let filteredMode = false;
let filteredList = [];
let currentDetailRef = null;

async function init() {
    toggleLoading(true);

    let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0");
    let data = await response.json();
    allPokemonList = data.results;

    filteredMode = false;
    currentIndex = 0;
    clearCards();
    isLoading = false;

    await loadMorePokemon();
    toggleLoading(false);
}

async function loadPokemonDetails(url) {
    let response = await fetch(url);
    return await response.json();
}

async function loadMorePokemon() {
    if (isLoading || filteredMode) return;

    toggleLoading(true);

    let nextPokemons = [];
    for (let i = currentIndex; i < currentIndex + 20 && i < allPokemonList.length; i++) {
        nextPokemons.push(allPokemonList[i]);
    }

    await loadAndRenderPokemons(nextPokemons);
    currentIndex += nextPokemons.length;
    toggleLoading(false);
}

async function loadAndRenderPokemons(pokemonList) {
    for (let i = 0; i < pokemonList.length; i++) {
        let pokemon = pokemonList[i];
        let data = await loadPokemonDetails(pokemon.url);
        renderPokemonCard(data, pokemon);
    }
}

function renderPokemonCard(dataDetails, pokeRef) {
    let container = document.getElementById("poke-name");
    if (!container) return;

    let types = getTypesAsText(dataDetails);
    let firstType = dataDetails.types[0].type.name;
    let bgColor = getTypeColor(firstType);

    container.innerHTML += getPokemonCardTemplate(dataDetails, pokeRef, bgColor, types);
}

function toggleLoading(show) {
    let loading = document.getElementById("loadingScreen");
    if (loading) {
        loading.style.display = show ? "flex" : "none";
    }

    isLoading = show;
    setLoadMoreButtonState(!show && !filteredMode);
}

function setLoadMoreButtonState(enabled) {
    let btn = document.getElementById("loadMoreBtn");
    if (btn) {
        btn.disabled = !enabled;
    }
}

function getTypesAsText(pokemonData) {
    let result = "";
    for (let i = 0; i < pokemonData.types.length; i++) {
        if (i > 0) result += ", ";
        result += pokemonData.types[i].type.name;
    }
    return result;
}

function getTypeColor(type) {
    let typeColors = {
        normal: "#A8A77A", fire: "#EE8130", water: "#6390F0", electric: "#F7D02C",
        grass: "#7AC74C", ice: "#96D9D6", fighting: "#C22E28", poison: "#A33EA1",
        ground: "#E2BF65", flying: "#A98FF3", psychic: "#F95587", bug: "#A6B91A",
        rock: "#B6A136", ghost: "#735797", dragon: "#6F35FC", dark: "#705746",
        steel: "#B7B7CE", fairy: "#D685AD"
    };

    return typeColors[type] || "#777";
}

function clearCards() {
    let cont = document.getElementById("poke-name");
    if (cont) cont.innerHTML = "";
}

async function onFilterInput() {
    let inputElem = document.getElementById("searchInput");
    if (!inputElem) return;

    let input = inputElem.value.trim().toLowerCase();

    if (input.length < 3) {
        filteredMode = false;
        clearCards();
        currentIndex = 0;
        await loadMorePokemon();
        return;
    }

    filteredMode = true;
    clearCards();
    toggleLoading(true);
    filteredList = [];

    for (let i = 0; i < allPokemonList.length; i++) {
        let name = allPokemonList[i].name.toLowerCase();
        let match = name.includes(input);
        if (match) filteredList.push(allPokemonList[i]);
    }

    await loadAndRenderPokemons(filteredList);
    setLoadMoreButtonState(false);
    toggleLoading(false);
}

function findPokemonByUrl(list, url) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].url === url) {
            return list[i];
        }
    }
    return null;
}

async function openDetailView(pokeUrl) {
    toggleLoading(true);

    let list = filteredMode ? filteredList : allPokemonList;
    let ref = findPokemonByUrl(list, pokeUrl);
    if (!ref) {
        toggleLoading(false);
        return;
    }

    let data = await loadPokemonDetails(ref.url);
    currentDetailRef = ref;

    toggleLoading(false);
    showDetailOverlay(data);
}

function showDetailOverlay(data) {
    document.body.style.overflow = "hidden";

    let types = getTypesAsText(data);
    let hp = data.stats[0].base_stat;
    let attack = data.stats[1].base_stat;
    let defense = data.stats[2].base_stat;

    let overlay = document.getElementById("detail-overlay");
    if (!overlay) return;

    overlay.style.display = "flex";
    overlay.innerHTML = getDetailOverlayTemplate(data);
}

function closeDetailOverlay() {
    let overlay = document.getElementById("detail-overlay");
    if (overlay) {
        overlay.style.display = "none";
        overlay.innerHTML = "";
    }
    document.body.style.overflow = "auto";
}

async function navigateDetail(direction) {
    let list = filteredMode ? filteredList : allPokemonList;
    if (!currentDetailRef) return;

    let currentIndexInList = -1;
    for (let i = 0; i < list.length; i++) {
        if (list[i].url === currentDetailRef.url) {
            currentIndexInList = i;
            break;
        }
    }

    let newIndex = currentIndexInList + direction;
    if (newIndex < 0 || newIndex >= list.length) return;

    let newRef = list[newIndex];
    currentDetailRef = newRef;

    let data = await loadPokemonDetails(newRef.url);
    showDetailOverlay(data);
}
