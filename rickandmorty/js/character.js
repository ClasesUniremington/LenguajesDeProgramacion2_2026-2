const API = "https://rickandmortyapi.com/api/character";
const EPISODE_API = "https://rickandmortyapi.com/api/episode";
const content = document.querySelector("#content");
const message = document.querySelector("#message");
const spinner = document.querySelector("#spinner");

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
}

function getCharacterId() {
  const params = new URLSearchParams(window.location.search);
  const rawId = params.get("id");

  // El ID debe existir y ser un entero positivo.
  if (!rawId || !/^[1-9]\d*$/.test(rawId)) return null;
  return rawId;
}

function renderCharacter(character) {
  document.title = `${character.name} | Rick and Morty`;

  content.innerHTML = `
    <article class="character-detail">
      <img class="character-image" src="${character.image}" alt="${character.name}">
      <div class="character-info">
        <h2>${character.name}</h2>
        <p><strong>Estado:</strong> ${character.status}</p>
        <p><strong>Especie:</strong> ${character.species}</p>
        <p><strong>Género:</strong> ${character.gender}</p>
        <p><strong>Origen:</strong> ${character.origin?.name || "Desconocido"}</p>
        <p><strong>Ubicación actual:</strong> ${character.location?.name || "Desconocida"}</p>
        <p><strong>Cantidad de episodios:</strong> ${character.episode.length}</p>
        <section class="episodes">
          <h3>Episodios</h3>
          <p id="episode-message">Cargando episodios...</p>
          <ul id="episode-list"></ul>
        </section>
      </div>
    </article>
  `;
}

function getEpisodeIds(episodeUrls) {
  return episodeUrls
    .map((url) => url.split("/").filter(Boolean).pop())
    .filter((id) => /^\d+$/.test(id));
}

async function loadEpisodes(episodeUrls) {
  const episodeList = document.querySelector("#episode-list");
  const episodeMessage = document.querySelector("#episode-message");

  if (!episodeUrls || episodeUrls.length === 0) {
    episodeMessage.textContent = "Este personaje no tiene episodios registrados.";
    return;
  }

  const ids = getEpisodeIds(episodeUrls);

  if (ids.length === 0) {
    episodeMessage.textContent = "No fue posible identificar los episodios.";
    return;
  }

  try {
    // La API permite consultar varios episodios en una sola petición.
    const response = await fetch(`${EPISODE_API}/${ids.join(",")}`);

    if (!response.ok) {
      throw new Error("No se pudieron cargar los episodios.");
    }

    const data = await response.json();
    const episodes = Array.isArray(data) ? data : [data];

    episodeList.innerHTML = episodes.map((episode) => `
      <li>${episode.episode} · ${episode.name}</li>
    `).join("");

    episodeMessage.textContent = "";
  } catch (error) {
    // Un error en episodios no borra los datos principales del personaje.
    episodeMessage.textContent = "No se pudieron cargar los episodios en este momento.";
  }
}

async function loadCharacter() {
  const id = getCharacterId();

  if (!id) {
    showMessage("El identificador del personaje falta o no es válido. Vuelve al listado y selecciona un personaje.", true);
    spinner.hidden = true;
    return; // No se consulta la API si el ID no es válido.
  }

  spinner.hidden = false;
  showMessage("Cargando información del personaje...");

  try {
    const response = await fetch(`${API}/${id}`);

    if (response.status === 404) {
      showMessage("No se encontró un personaje con ese identificador.", true);
      return;
    }

    if (!response.ok) {
      showMessage(`El servidor respondió ${response.status}. No se pudo cargar el personaje.`, true);
      return;
    }

    const character = await response.json();
    renderCharacter(character);
    showMessage("");

    // Se cargan episodios después de mostrar los datos principales.
    await loadEpisodes(character.episode);
  } catch (error) {
    showMessage("No hay conexión con el servidor. Revisa tu internet e inténtalo de nuevo.", true);
  } finally {
    spinner.hidden = true;
  }
}

loadCharacter();
