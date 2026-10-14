const URL_API = "https://rickandmortyapi.com/api/character";
const URL_EPISODES = "https://rickandmortyapi.com/api/episode";
const characterDetails = document.querySelector("#character-details");
const episodesBox = document.querySelector("#episodes");
const message = document.querySelector("#message");
const spinner = document.querySelector("#spinner");

function showMessage(text, isError = false) {
    message.textContent = text;
    message.classList.toggle("error", isError);
}

function createDetailCard(character) {
    return `
      <article class="card">
        <img src="${character.image}" alt="${character.name}">
        <div class="container">
          <h2>${character.name}</h2>
          <dl>
            <dt>Estado</dt>    <dd>${character.status}</dd>
            <dt>Especie</dt>   <dd>${character.species}</dd>
            <dt>Género</dt>    <dd>${character.gender}</dd>
            <dt>Origen</dt>    <dd>${character.origin.name}</dd>
            <dt>Ubicación</dt> <dd>${character.location.name}</dd>
            <dt>Episodios</dt> <dd>${character.episode.length}</dd>
          </dl>
        </div>
      </article>
    `;
}

async function loadEpisodes(character) {
    const ids = character.episode.map((url) => url.split("/").pop());

    episodesBox.innerHTML = `<h3>Episodios (${ids.length})</h3>`;

    if (ids.length === 0) return;

    try {
        const response = await fetch(`${URL_EPISODES}/${ids.join(",")}`);

        if (!response.ok) {
            episodesBox.innerHTML += "<p>No se pudieron cargar los episodios.</p>";
            return;
        }

        let episodes = await response.json();

        // Con un solo episodio la API devuelve un objeto, no un arreglo
        if (!Array.isArray(episodes)) episodes = [episodes];

        episodes.forEach((ep) => {
            const row = document.createElement("div");
            row.className = "episode";
            row.innerHTML = `
                <span class="ep-title">${ep.episode} · ${ep.name}</span>
                <span class="ep-date">${ep.air_date}</span>
            `;
            episodesBox.appendChild(row);
        });
    } catch (error) {
        episodesBox.innerHTML += "<p>No se pudieron cargar los episodios.</p>";
    }
}

async function loadCharacter(id) {
    characterDetails.innerHTML = "";
    episodesBox.innerHTML = "";
    spinner.hidden = false;
    showMessage("Cargando personaje...");

    try {
        const response = await fetch(`${URL_API}/${id}`);

        if (!response.ok) {
            showMessage(
                `El servidor respondió ${response.status}. No se pudo cargar el personaje.`,
                true,
            );
            return;
        }

        const character = await response.json();
        characterDetails.innerHTML = createDetailCard(character);
        showMessage("");

        await loadEpisodes(character);
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