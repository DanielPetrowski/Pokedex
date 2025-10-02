function getPokemonCardTemplate(dataDetails, pokeRef, bgColor) {
    return `
        <div class="card" style="background-color: ${bgColor};" onclick="openDetailView('${pokeRef.url}')">
            <p><strong>${dataDetails.name.toUpperCase()}</strong></p>
            <img src="${dataDetails.sprites.front_default || ''}" alt="${dataDetails.name}" />
            <p>${getTypesAsText(dataDetails)}</p>
            <p>ID: ${dataDetails.id}</p>
        </div>
    `;
}

function getDetailOverlayTemplate(data) {
    let types = getTypesAsText(data);
    let hp = data.stats[0].base_stat;
    let attack = data.stats[1].base_stat;
    let defense = data.stats[2].base_stat;

    return `
        <div class="detail-card" onclick="event.stopPropagation()">
            <span class="close-btn" onclick="closeDetailOverlay()">×</span>
            <h2>${data.name.toUpperCase()} (#${data.id})</h2>
            <img src="${data.sprites.front_default}" alt="${data.name}" />
            <p><strong>Typ:</strong> ${types}</p>
            <p><strong>HP:</strong> ${hp}</p>
            <p><strong>Attack:</strong> ${attack}</p>
            <p><strong>Defense:</strong> ${defense}</p>
            <div class="arrow-btns">
                <span onclick="navigateDetail(-1)">←</span>
                <span onclick="navigateDetail(1)">→</span>
            </div>
        </div>
    `;
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


