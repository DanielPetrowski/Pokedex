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
