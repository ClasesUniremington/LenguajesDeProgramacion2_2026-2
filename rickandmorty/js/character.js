const API = "https://rickandmortyapi.com/api/character";
const id = new URL(location.href).searchParams.get("id");

const container = document.querySelector("#character");
const message = document.querySelector("#message");

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
}

async function episodes(character) {
  return Promise.all(
    character.episode.map(async (url) => {
      const response = await fetch(url);
      return response.json();
    }),
  );
}

function showCharacter(character, episodes) {
  container.innerHTML = CharacterDetail(character, episodes);
}

function CharacterDetail(character, episodes) {
  return `
    <article class="detail">
      <img src="${character.image}" alt="${character.name}">
      
      <div class="detail-body">
        <h2>${character.name}</h2>

        <span class="estado ${character.status}">
          ${character.status}
        </span>

        <p>Especie: ${character.species}</p>
        <p>Género: ${character.gender}</p>
        <p>Origen: ${character.origin.name}</p>
        <p>Ubicación: ${character.location.name}</p>
        <div class="detail-episodes">
          <h3>Episodios (${character.episode.length}) </h3>
          <ul>
            ${episodes
              .map((ep) => `<li>${ep.episode} - ${ep.name}</li>`)
              .join("")}
          </ul>
        </div>
      </div>
    </article>
  `;
}

async function loadCharacter() {
  showMessage("Cargando personaje...");

  try {
    const response = await fetch(`${API}/${id}`);

    if (!response.ok) {
      showMessage(`${response.status} No se encontró este personaje.`, true);
      return;
    }

    const character = await response.json();

    const characterEpisodes = await episodes(character);
    showCharacter(character, characterEpisodes);
    showMessage("");
  } catch (error) {
    showMessage("No se pudo cargar el personaje.", true);
    console.error(error);
  }
}

loadCharacter();
