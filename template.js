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

function getDetailOverlayTemplate(data, abilitiesText, movesListHTML) {
    let types = getTypesAsText(data);
    let hp = data.stats[0].base_stat;
    let attack = data.stats[1].base_stat;
    let defense = data.stats[2].base_stat;

    return `
        <div class="detail-card" onclick="event.stopPropagation()"> 
            <span class="close-btn" onclick="closeDetailOverlay()">×</span>

            <div class="header">
                <h2>${data.name.toUpperCase()} <span class="poke-id">#${data.id}</span></h2>
                <div class="types">${types}</div>
                <img src="${data.sprites.front_default}" alt="${data.name}" />
            </div>

            <div class="tabs">
                <button class="tab-btn active" onclick="switchTab('about')">About</button>
                <button class="tab-btn" onclick="switchTab('stats')">Base Stats</button>
                <button class="tab-btn" onclick="switchTab('evolution')">Evolution</button>
                <button class="tab-btn" onclick="switchTab('moves')">Moves</button>
            </div>

            <div class="tab-content" id="tab-about">
                <p><strong>Height:</strong> ${(data.height / 10).toFixed(1)} m</p>
                <p><strong>Weight:</strong> ${(data.weight / 10).toFixed(1)} kg</p>
                <p><strong>Abilities:</strong> ${abilitiesText}</p>
            </div>

            <div class="tab-content" id="tab-stats" style="display: none;">
                <p><strong>HP:</strong> ${hp}</p>
                <p><strong>Attack:</strong> ${attack}</p>
                <p><strong>Defense:</strong> ${defense}</p>
                <p><strong>Speed:</strong> ${data.stats[5].base_stat}</p>
                <p><strong>Sp. Atk:</strong> ${data.stats[3].base_stat}</p>
                <p><strong>Sp. Def:</strong> ${data.stats[4].base_stat}</p>
            </div>

            <div class="tab-content" id="tab-evolution" style="display: none;">
                <p>Loading evolution...</p>
            </div>

            <div class="tab-content" id="tab-moves" style="display: none;">
                <ul>
                    ${movesListHTML}
                </ul>
            </div>

            <div class="arrow-btns">
                <span onclick="navigateDetail(-1)">←</span>
                <span onclick="navigateDetail(1)">→</span>
            </div>
        </div>
    `;
}
// onclick="event.stopPropagation() wird benutzt um am element zu bleiben 
// lt Google  wenn: Du ein Popup, Modal oder Overlay hast. Du willst, dass ein Klick im inneren Bereich (z. B. auf der Karte) nicht das Schließen des Popups auslöst.
// Du aber trotzdem erlauben willst, dass ein Klick außerhalb das Popup schließt.




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
