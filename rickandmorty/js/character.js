const API_BASE = "https://rickandmortyapi.com/api";

const message = document.querySelector("#message");
const spinner = document.querySelector("#spinner");
const detail = document.querySelector("#detail");
const episodesSection = document.querySelector("#episodes-section");
const episodesTitle = document.querySelector("#episodes-title");
const episodesList = document.querySelector("#episodes");

const characterId = new URLSearchParams(location.search).get("id");

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
}

function showError(error, what) {
  if (error.status === 404) {
    showMessage(`No se encontró ${what}.`, true);
  } else if (error.status) {
    showMessage(`El servidor respondió ${error.status}. No se pudo cargar ${what}.`, true);
  } else {
    showMessage("No hay conexión con el servidor. Revise su internet e intente de nuevo.", true);
  }
}

// fetch does not fail on a 404: we have to check response.ok ourselves.
async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

function createDetail(character) {
  return `
    <img src="${character.image}" alt="${character.name}" />
    <div class="detail-info">
      <h2>${character.name}</h2>
      <dl>
        <dt>Estado</dt><dd>${character.status}</dd>
        <dt>Especie</dt><dd>${character.species}</dd>
        <dt>Género</dt><dd>${character.gender}</dd>
        <dt>Origen</dt><dd>${character.origin.name}</dd>
        <dt>Ubicación</dt><dd>${character.location.name}</dd>
        <dt>Episodios</dt><dd>${character.episode.length}</dd>
      </dl>
    </div>`;
}

function createEpisodeItem(episode) {
  return `
    <li>
      <b>${episode.episode}</b> · ${episode.name}
      <span>${episode.air_date}</span>
    </li>`;
}

async function loadEpisodes(character) {
  if (character.episode.length === 0) return;

  try {
    // One request for all the episodes: /episode/1,2,3
    const ids = character.episode.map((url) => url.split("/").pop());
    const data = await getJson(`${API_BASE}/episode/${ids.join(",")}`);
    const episodes = Array.isArray(data) ? data : [data]; // one id answers an object, not a list

    episodesTitle.textContent = `Episodios (${episodes.length})`;
    episodesList.innerHTML = episodes.map(createEpisodeItem).join("");
    episodesSection.hidden = false;
  } catch (error) {
    // The character is already on screen: only the episodes are reported as failed.
    showError(error, "los episodios");
  }
}

async function loadCharacter() {
  if (!/^\d+$/.test(characterId ?? "")) {
    showMessage("Falta el número del personaje, o no es válido, en la dirección.", true);
    return;
  }

  const id = Number(characterId);
  spinner.hidden = false;
  showMessage("Cargando personaje...");
  let character;

  try {
    character = await getJson(`${API_BASE}/character/${id}`);

    document.title = character.name;
    detail.innerHTML = createDetail(character);
    detail.hidden = false;
    showMessage("");
  } catch (error) {
    showError(error, "el personaje");
    return;
  } finally {
    spinner.hidden = true;
  }

  await loadEpisodes(character);
}

loadCharacter();
