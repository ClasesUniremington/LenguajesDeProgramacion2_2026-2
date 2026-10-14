const detailContainer = document.querySelector("#character-detail");
const episodeList = document.querySelector("#episode-list");
const message = document.querySelector("#message");

const API = "https://rickandmortyapi.com/api/character/";
const EPISODE_API = "https://rickandmortyapi.com/api/episode/";

const params = new URLSearchParams(window.location.search);
const characterId = params.get("id");

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
}

function showCharacter(character) {
  detailContainer.innerHTML = `
    <img
      class="character-image"
      src="${character.image}"
      alt="Imagen de ${character.name}"
    >

    <section class="character-info">
      <h2>${character.name}</h2>
      <p>Estado: ${character.status}</p>
      <p>Especie: ${character.species}</p>
      <p>Género: ${character.gender}</p>
      <p>Origen: ${character.origin.name}</p>
      <p>Ubicación: ${character.location.name}</p>
      <p>Episodios: ${character.episode.length}</p>
    </section>
  `;

  document.title = character.name;
}

async function loadEpisodes(episodeUrls) {
  const episodeIds = episodeUrls.map((url) => url.split("/").pop()).join(",");

  showMessage("Cargando episodios...");

  try {
    const response = await fetch(`${EPISODE_API}${episodeIds}`);

    if (!response.ok) {
      showMessage("No se pudieron cargar los episodios.", true);
      return;
    }

    const episodes = await response.json();
    let episodeArray;

    if (Array.isArray(episodes)) {
      episodeArray = episodes;
    } else {
      episodeArray = [episodes];
    }

    episodeList.innerHTML = episodeArray
      .map(
        (episode) => `
      <li>
        <span>${episode.episode} · ${episode.name}</span>
        <span class="episode-date">${episode.air_date}</span>
      </li>
    `,
      )
      .join("");

    showMessage("");
  } catch (error) {
    showMessage(
      "No se pudieron cargar los episodios. La ficha sigue disponible.",
      true,
    );
  }
}

async function loadCharacter() {
  if (!characterId || isNaN(characterId)) {
    showMessage("Falta el número del personaje o no es válido.", true);
    return;
  }

  showMessage("Cargando personaje...");

  try {
    const response = await fetch(`${API}${characterId}`);

    if (!response.ok) {
      showMessage("No se encontró el personaje.", true);
      return;
    }

    const character = await response.json();

    showCharacter(character);
    await loadEpisodes(character.episode);
  } catch (error) {
    showMessage("No hay conexión con el servidor.", true);
  }
}

loadCharacter();
