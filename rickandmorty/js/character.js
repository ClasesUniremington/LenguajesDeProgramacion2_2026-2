const detailContainer = document.querySelector("#character-detail");
const message = document.querySelector("#message");
const episodeList = document.querySelector("#episode-list");
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
  <img src="${character.image}" alt="${character.name}">
  <section>
    <h2>${character.name}</h2>
    <p>Estado: ${character.status}</p>
    <p>Especie: ${character.species}</p>
    <p>Género: ${character.gender}</p>
      <p>Origen: ${character.origin.name}</p>
      <p>Ubicación: ${character.location.name}</p>
      <p>Episodios: ${character.episode.length}</p>
  </section>
`;
}

async function loadEpisodes(episodeUrls) {
    const episodeIds = episodeUrls.map((url) => url.split("/").pop()).join(",");
    try {
  const response = await fetch(`${EPISODE_API}${episodeIds}`);
  if (!response.ok) {
    const episodes = await response.json();
    let episodeArray;

if (Array.isArray(episodes)) {
  episodeArray = episodes;
} else {
  episodeArray = [episodes];
}
episodeList.innerHTML = episodeArray
  .map((episode) => `<li>${episode.episode} · ${episode.name}</li>`)
  .join("");
  
  showMessage("No se pudieron cargar los episodios.", true);
  return;
}
} catch (error) {
  showMessage("No se pudieron cargar los episodios.", true);
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
      const character = await response.json();
      showMessage("No se encontró el personaje.", true);
      return;
    }
  } catch (error) {
    showMessage("No hay conexión con el servidor.", true);
  }
}

loadCharacter();
