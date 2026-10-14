const API = "https://rickandmortyapi.com/api/character";

const characterContainer = document.querySelector("#character");
const message = document.querySelector("#message");
const spinner = document.querySelector("#spinner");
const episodesSection = document.querySelector("#episodes-section");
const episodesList = document.querySelector("#episodes");
const episodesMessage = document.querySelector("#episodes-message");

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
}

function showCharacter(character) {
  document.title = character.name;

  characterContainer.innerHTML = `
    <div class="character-card">
      <img src="${character.image}" alt="${character.name}">

      <div class="character-info">
        <h2>${character.name}</h2>

        <p><strong>Estado</strong><span>${character.status}</span></p>
        <p><strong>Especie</strong><span>${character.species}</span></p>
        <p><strong>Género</strong><span>${character.gender}</span></p>
        <p><strong>Origen</strong><span>${character.origin.name}</span></p>
        <p><strong>Ubicación</strong><span>${character.location.name}</span></p>
        <p><strong>Episodios</strong><span>${character.episode.length}</span></p>
      </div>
    </div>
  `;
}

async function loadEpisodes(episodeUrls) {
  episodesSection.hidden = false;
  episodesList.innerHTML = "";
  episodesMessage.textContent = "Cargando episodios...";

  try {
    if (episodeUrls.length === 0) {
      episodesMessage.textContent = "Este personaje no tiene episodios.";
      return;
    }

    const episodeIds = episodeUrls.map(function (url) {
      return url.split("/").pop();
    });

    const url =
      "https://rickandmortyapi.com/api/episode/" + episodeIds.join(",");

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("No se pudieron cargar los episodios");
    }

    const data = await response.json();

    const episodes = Array.isArray(data) ? data : [data];

    episodesMessage.textContent = "";

    episodes.forEach(function (episode) {
      const item = document.createElement("li");

      item.innerHTML = `
    <span class="episode-name">
      <strong>${episode.episode}</strong> · ${episode.name}
    </span>

    <span class="episode-date">${episode.air_date}</span>
  `;

      episodesList.appendChild(item);
    });
  } catch (error) {
    episodesMessage.textContent = "No se pudieron cargar los episodios.";
  }
}

async function loadCharacter() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  showMessage("Cargando personaje...");
  spinner.hidden = false;

  if (!id || !/^[1-9]\d*$/.test(id)) {
    showMessage("Falta el número del personaje, o no es válido.", true);
    spinner.hidden = true;
    return;
  }

  try {
    const response = await fetch(`${API}/${id}`);

    if (response.status === 404) {
      showMessage("No se encontró el personaje.", true);
      return;
    }

    if (!response.ok) {
      showMessage("No se pudo cargar el personaje.", true);
      return;
    }

    const character = await response.json();

    showCharacter(character);
    showMessage("");

    spinner.hidden = true;

    await loadEpisodes(character.episode);
  } catch (error) {
    showMessage("No hay conexión con el servidor.", true);
  } finally {
    spinner.hidden = true;
  }
}

loadCharacter();
