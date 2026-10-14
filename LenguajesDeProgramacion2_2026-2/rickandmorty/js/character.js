const API = "https://rickandmortyapi.com/api/character";
const id = new URL(location.href).searchParams.get("id");
const container = document.querySelector("#character");
const message = document.querySelector("#message");

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
}

function showCharacter(character) {
  container.innerHTML = CharacterDetail(character);
}

function CharacterDetail(character) {
    const episodeNumbers = character.episode.map(epUrl => epUrl.split("/").pop());
  const episodesListHTML = episodeNumbers.map(num => `<li>Episodio ${num}</li>`).join('');
  return `
    <article class="detail">
      <img src="${character.image}" alt="${character.name}">
      <div class="detail-body">
        <h2>${character.name}</h2>
        <p>Estado: ${character.status}</p>
        <p>Especie: ${character.species}</p>
        <p>Género: ${character.gender}</p>
        <p>Origen: ${character.origin.name}</p>
        <p>ubicacion: ${character.location.name}</p>
        <p>Episodios: ${character.episode.length}</p>
      </div>
    </article>
    <div class="episodes-dropdown-container">
      <h3>Lista de Episodios (${character.episode.length})</h3>
      <ul class="episodes-dropdown-list">
        ${episodesListHTML}
      </ul>
    </div>
  
  `;
}

async function loadCharacter() {
  showMessage("Cargando personaje...");
  try {
    const response = await fetch(`${API}/${id}`);
    if (!response.ok) {
      showMessage(`${response.status} No se encontró este personaje.`);
      return;
    }

    const character = await response.json();

    showCharacter(character);
    showMessage("");

  } catch (error) {
    showMessage("No se pudo cargar el personaje.");
  }
}

loadCharacter();
