const API = "https://rickandmortyapi.com/api/character";
const EPISODE_API = "https://rickandmortyapi.com/api/episode";
const characterDetails = document.querySelector("#character-details");
const episodesContainer = document.querySelector("#episodes");
const message = document.querySelector("#message");
const spinner = document.querySelector("#spinner");

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
}

function createCharacterInfo(character) {
  return `
      <img src="${character.image}" alt="${character.name}">
      <div class="info">
        <h2>${character.name}</h2>
        <p><strong>Estado</strong> ${character.status}</p>
        <p><strong>Especie</strong> ${character.species}</p>
        <p><strong>Género</strong> ${character.gender}</p>
        <p><strong>Origen</strong> ${character.origin.name}</p>
        <p><strong>Ubicación</strong> ${character.location.name}</p>
        <p><strong>Episodios</strong> ${character.episode.length}</p>
      </div>
    `;
}

function createEpisode(episode) {
  return `
      <li class="episode">
        <span><strong>${episode.episode}</strong> · ${episode.name}</span>
        <span>${episode.air_date}</span>
      </li>
    `;
}

function showEpisodes(episodes) {
  episodesContainer.innerHTML = `
      <h2>Episodios (${episodes.length})</h2>
      <ul class="episode-list">${episodes.map(createEpisode).join("")}</ul>
    `;
}

async function loadCharacter(id) {
  characterDetails.innerHTML = "";
  episodesContainer.innerHTML = "";
  spinner.hidden = false;
  showMessage("Cargando personaje...");

  try {
    const response = await fetch(`${API}/${id}`);

    if (!response.ok) {
      showMessage(
        `El servidor respondió ${response.status}. No se pudo cargar el personaje.`,
        true,
      );
      return;
    }

    const character = await response.json();
    document.title = character.name;
    characterDetails.innerHTML = createCharacterInfo(character);

    // Pedir episodeos
    showMessage("Cargando episodios...");
    const ids = character.episode
      .map((url) => url.replace(`${EPISODE_API}/`, ""))
      .join(",");
    const episodesResponse = await fetch(`${EPISODE_API}/${ids}`);

    if (!episodesResponse.ok) {
      showMessage(
        `El servidor respondió ${episodesResponse.status}. No se pudieron cargar los episodios.`,
        true,
      );
      return;
    }

    let episodes = await episodesResponse.json();

    // Verificar si solo es un episodeo o varios
    if (!Array.isArray(episodes)) {
      episodes = [episodes];
    }

    showEpisodes(episodes);
    showMessage("");
  } catch (error) {
    showMessage(
      "No hay conexión con el servidor. Revise su internet e intente de nuevo.",
      true,
    );
  } finally {
    spinner.hidden = true;
  }
}

const id = new URL(document.URL).searchParams.get("id");

if (id) {
  loadCharacter(id);
} else {
  showMessage("No se indicó ningún personaje.", true);
}