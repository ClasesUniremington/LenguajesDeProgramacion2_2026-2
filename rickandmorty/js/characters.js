const API_BASE = "https://rickandmortyapi.com/api";

const pageTitle = document.querySelector("#page-title");
const message = document.querySelector("#message");
const spinner = document.querySelector("#spinner");
const characterDetail = document.querySelector("#character-detail");
const episodesSection = document.querySelector("#episodes-section");
const episodesContainer = document.querySelector("#episodes-container");

function showMessage(text, isError = false) {
    message.textContent = text;
    message.classList.toggle("error", isError);
}

function renderCharacter(character) {
    // Ajuste de clase según estado (Alive, Dead, unknown)
    const statusClass = `status-${character.status.toLowerCase()}`;

    characterDetail.innerHTML = `
    <img class="character-poster" src="${character.image}" alt="${character.name}">
    <div class="character-info">
      <h2>${character.name}</h2>
      <div>
        <span class="status-badge ${statusClass}">${character.status}</span>
      </div>
      <p class="info-item"><span class="info-label">Especie:</span> ${character.species}</p>
      <p class="info-item"><span class="info-label">Género:</span> ${character.gender}</p>
      <p class="info-item"><span class="info-label">Origen:</span> ${character.origin.name}</p>
      <p class="info-item"><span class="info-label">Ubicación actual:</span> ${character.location.name}</p>
      <p class="info-item"><span class="info-label">Total de apariciones:</span> ${character.episode.length} episodios</p>
    </div>
  `;
    characterDetail.hidden = false;
}

function renderEpisodes(episodes) {
    if (!episodes || episodes.length === 0) {
        episodesContainer.innerHTML = "<p>No hay información de episodios disponible.</p>";
        episodesSection.hidden = false;
        return;
    }

    // Si es un solo episodio la API devuelve un objeto, si son varios devuelve un array
    const episodeList = Array.isArray(episodes) ? episodes : [episodes];

    const episodesTitle = document.querySelector("#episodes-title");
    if (episodesTitle) {
        episodesTitle.textContent = `Episodios (${episodeList.length})`;
    }

    episodesContainer.innerHTML = episodeList
        .map(
            (ep) => `
        <article class="episode-card">
          <h3 class="episode-title">${ep.name}</h3>
          <p class="episode-info">Episodio: ${ep.episode}</p>
          <p class="episode-info">Fecha: ${ep.air_date}</p>
        </article>
      `
        )
        .join("");

    episodesSection.hidden = false;
}

async function loadCharacterDetail() {
    // 1. Obtener el ID del personaje desde la URL (?id=...)
    const params = new URLSearchParams(window.location.search);
    const characterId = params.get("id");

    if (!characterId) {
        showMessage("No se proporcionó ningún ID de personaje en la URL.", true);
        return;
    }

    spinner.hidden = false;
    showMessage("Cargando información del personaje...");

    try {
        // 2. Consultar los datos del personaje
        const response = await fetch(`${API_BASE}/character/${characterId}`);
        if (!response.ok) {
            showMessage(`error del servidor no se pudo cargar el personaje: ${response.status}`, true);
            return;
        }

        const character = await response.json();
        pageTitle.textContent = character.name;
        renderCharacter(character);

        // 3. Consultar los episodios en los que aparece
        if (character.episode && character.episode.length > 0) {
            showMessage("Cargando lista de episodios...");
            // Extraer los IDs de cada URL (ej: ['1', '2', '3'])
            const episodeIds = character.episode.map((url) => url.split("/").pop());

            // Petición por lotes aprovechando la API (ej: /api/episode/1,2,3)
            const episodesResponse = await fetch(`${API_BASE}/episode/${episodeIds.join(",")}`);
            if (episodesResponse.ok) {
                const episodesData = await episodesResponse.json();
                renderEpisodes(episodesData);
            }
        }

        showMessage(""); // Limpiar mensaje de estado al terminar con éxito
    } catch (error) {
        showMessage("Ocurrió un error al conectar con el servidor. Revisa tu conexión a internet.", true);
    } finally {
        spinner.hidden = true;
    }
}

// Iniciar la carga
loadCharacterDetail();