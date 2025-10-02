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

function toggleLoading(show) {
    let loading = document.getElementById("loadingScreen");
    if (loading) {
        loading.style.display = show ? "flex" : "none";
    }

    isLoading = show;
    setLoadMoreButtonState(!show && !filteredMode);
}

function clearCards() {
    let cont = document.getElementById("poke-name");
    if (cont) cont.innerHTML = "";
}

function setLoadMoreButtonState(enabled) {
    let btn = document.getElementById("loadMoreBtn");
    if (btn) {
        btn.disabled = !enabled;
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

function getTypesAsText(pokemonData) {
    let result = "";
    for (let i = 0; i < pokemonData.types.length; i++) {
        if (i > 0) result += ", ";
        result += pokemonData.types[i].type.name;
    }
    return result;
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

    let overlay = document.getElementById("detail-overlay");
    if (!overlay) return;

    // --- Logik: Abilities als Text
    let abilitiesText = '';
    for (let i = 0; i < data.abilities.length; i++) {
        if (i > 0) abilitiesText += ', ';
        abilitiesText += data.abilities[i].ability.name;
    }

    // --- Logik: Moves als <li>
    let movesListHTML = '';
    let count = 0;
    for (let i = 0; i < data.moves.length; i++) {
        if (count >= 5) break;
        movesListHTML += '<li>' + data.moves[i].move.name + '</li>';
        count++;
    }

    overlay.style.display = "flex";
    overlay.innerHTML = getDetailOverlayTemplate(data, abilitiesText, movesListHTML);
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

// Tab-Funktion sichtbar machen
function switchTab(tabId) {
    let tabs = document.querySelectorAll('.tab-content');
    let buttons = document.querySelectorAll('.tab-btn');

    for (let i = 0; i < tabs.length; i++) {
        tabs[i].style.display = 'none';
    }
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }

    let activeTab = document.getElementById('tab-' + tabId);
    if (activeTab) {
        activeTab.style.display = 'block';
    }

    let tabButtons = document.querySelectorAll('.tab-btn');
    for (let i = 0; i < tabButtons.length; i++) {
        if (tabButtons[i].textContent.toLowerCase().includes(tabId)) {
            tabButtons[i].classList.add('active');
        }
    }
}
