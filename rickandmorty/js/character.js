const CHARACTER_API = "https://rickandmortyapi.com/api/character/";
const EPISODE_API = "https://rickandmortyapi.com/api/episode/";

//Busca la información del personaje en la API con el nombre que le esta diciendo que busque
const message = document.querySelector("#message");
const spinner = document.querySelector("#spinner");
const characterBox = document.querySelector("#character");
const episodesSection = document.querySelector("#episodes");
const episodesTitle = document.querySelector("#episodes-title");
const episodesMessage = document.querySelector("#episodes-message");
const episodesList = document.querySelector("#episodes-list");

//Me traduce la información del personaje a español
const STATUS_TEXT = { Alive: "Vivo", Dead: "Muerto", unknown: "Desconocido" };
const GENDER_TEXT = {
  Male: "Masculino",
  Female: "Femenino",
  Genderless: "Sin género",
  unknown: "Desconocido",
};

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
}

function getCharacterId() {
  const id = new URLSearchParams(window.location.search).get("id");
  if (id === null || !/^\d+$/.test(id) || Number(id) < 1) {
    return null;
  }
  return Number(id);
}

function renderCharacter(character) {
  document.title = character.name;
  characterBox.innerHTML = `
    <img src="${character.image}" alt="${character.name}">
    <div class="info">
      <h2>${character.name}</h2>
      <dl>
        <dt>Estado</dt><dd>${STATUS_TEXT[character.status] ?? character.status}</dd>
        <dt>Especie</dt><dd>${character.species}</dd>
        <dt>Género</dt><dd>${GENDER_TEXT[character.gender] ?? character.gender}</dd>
        <dt>Origen</dt><dd>${character.origin.name}</dd>
        <dt>Ubicación</dt><dd>${character.location.name}</dd>
        <dt>Episodios</dt><dd>${character.episode.length}</dd>
      </dl>
    </div>
  `;
  characterBox.hidden = false;
}

function createEpisodeItem(episode) {
  return `
    <li>
      <strong>${episode.episode} · ${episode.name}</strong>
      <span>${episode.air_date}</span>
    </li>
  `;
}

async function loadEpisodes(episodeUrls) {
  episodesTitle.textContent = `Episodios (${episodeUrls.length})`;
  episodesSection.hidden = false;
  episodesList.innerHTML = "";
  episodesMessage.classList.remove("error");

  // =================== //

  if (episodeUrls.length === 0) {
    episodesMessage.textContent = "Este personaje no aparece en episodios.";
    return;
  }

  episodesMessage.textContent = "Cargando episodios...";

  
  try {
    const ids = episodeUrls.map((url) => url.split("/").pop());
    const response = await fetch(`${EPISODE_API}${ids.join(",")}`);

    if (!response.ok) {
      throw new Error(`Status ${response.status}`);
    }

    const data = await response.json();
    const episodes = Array.isArray(data) ? data : [data];

    episodesList.innerHTML = episodes.map(createEpisodeItem).join("");
    episodesMessage.textContent = "";
  } catch (error) {
    episodesMessage.textContent =
      "No se pudieron cargar los episodios, pero la ficha sigue disponible.";
    episodesMessage.classList.add("error");
  }
}

async function loadCharacter() {
  const id = getCharacterId();

  if (id === null) {
    showMessage("Falta el número del personaje, o no es válido.", true);
    return;
  }

  spinner.hidden = false;
  showMessage("Cargando personaje...");

  let character = null;

  try {
    const response = await fetch(`${CHARACTER_API}${id}`);

    if (response.status === 404) {
      showMessage("No se encontró el personaje.", true);
      return;
    }

    if (!response.ok) {
      showMessage(
        `El servidor respondió ${response.status}. No se pudo cargar el personaje.`,
        true,
      );
      return;
    }

    character = await response.json();
    renderCharacter(character);
    showMessage("");
  } catch (error) {
    showMessage(
      "No hay conexión con el servidor. Revise su internet e intente de nuevo.",
      true,
    );
  } finally {
    spinner.hidden = true;
  }

  if (character) {
    loadEpisodes(character.episode);
  }
}

loadCharacter();