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
    episodesContainer.innerHTML =
      "<li>No hay información de episodios disponible.</li>";
    episodesSection.hidden = false;
    return;
  }

  const episodeList = Array.isArray(episodes) ? episodes : [episodes];

  const episodesTitle = document.querySelector("#episodes-title");
  if (episodesTitle) {
    episodesTitle.textContent = `Episodios (${episodeList.length})`;
  }

  episodesContainer.innerHTML = episodeList
    .map(
      (ep) => `
        <li class="episode-line">
          <span>${ep.episode} · ${ep.name}</span>
          <span class="episode-date">${ep.air_date}</span>
        </li>
      `,
    )
    .join("");

  episodesSection.hidden = false;
}

async function loadCharacterDetail() {
  const params = new URLSearchParams(window.location.search);
  const characterId = params.get("id");

  if (!characterId || isNaN(characterId)) {
    showMessage("Falta el número del personaje, o no es válido.", true);
    return;
  }

  spinner.hidden = false;
  showMessage("Cargando información del personaje...");

  try {
    const response = await fetch(`${API_BASE}/character/${characterId}`);
    if (response.status === 404) {
      showMessage("No se encontró el personaje.", true);
      return;
    }

    if (!response.ok) {
      showMessage(
        `No se pudo cargar el personaje. Error del servidor: ${response.status}`,
        true,
      );
      return;
    }

    const character = await response.json();
    pageTitle.textContent = character.name;
    document.title = character.name;
    renderCharacter(character);

    if (character.episode && character.episode.length > 0) {
      showMessage("Cargando lista de episodios...");

      const episodeIds = character.episode.map((url) => url.split("/").pop());

      const episodesResponse = await fetch(
        `${API_BASE}/episode/${episodeIds.join(",")}`,
      );
      if (episodesResponse.ok) {
        const episodesData = await episodesResponse.json();
        renderEpisodes(episodesData);
      } else {
        showMessage("No se pudieron cargar los episodios.", true);
        return;
      }
    }

    showMessage("");
  } catch (error) {
    showMessage(
      "Ocurrió un error al conectar con el servidor. Revisa tu conexión a internet.",
      true,
    );
  } finally {
    spinner.hidden = true;
  }
}

loadCharacterDetail();
