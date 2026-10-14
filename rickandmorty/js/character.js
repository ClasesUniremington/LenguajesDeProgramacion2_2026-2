const API = "https://rickandmortyapi.com/api/character";
const APIEpisodes = "https://rickandmortyapi.com/api/episode";
const error = document.querySelector("#mostrarError");
const cardContent = document.querySelector("#content");
const message = document.querySelector("#message");
const link = window.location.search;

// Recibe el personaje y la lista de episodios donde aparece
function createCard(character, episodes) {
  return `
    <article class="card">
      <img src="${character.image}" alt="${character.name}">

      <div class="info">
        <h2>${character.name}</h2>
        <dl>
          <dt>Estado</dt>    <dd>${character.status}</dd>
          <dt>Especie</dt>   <dd>${character.species}</dd>
          <dt>Género</dt>    <dd>${character.gender}</dd>
          <dt>Origen</dt>    <dd>${character.origin.name}</dd>
          <dt>Ubicación</dt> <dd>${character.location.name}</dd>
          <dt>Episodios</dt> <dd>${episodes.length}</dd>
        </dl>
      </div>

      <section class="episodes">
        <h3>Episodios (${episodes.length})</h3>
        <ul>
          ${episodes
            .map((ep) => `<li><strong>${ep.episode} · ${ep.name}</strong></li>`)
            .join("")}
        </ul>
      </section>
    </article>
  `;
}


function showContent(character, episodes) {
  cardContent.innerHTML = createCard(character, episodes);
}

function errorR(descripcionError) {
  error.innerHTML = descripcionError;
}

function loading(descripcion) {
  message.innerHTML = descripcion;
}

// url: endpoint de episodios | id: id del personaje
// Devuelve una lista de objetos: [{ episode: "S01E01", name: "Pilot" }, ...]
async function loadEpisodes(url, id) {
  const episodiosDelPersonaje = [];

  try {
    let siguiente = url;

    // La API entrega los episodios por páginas, así que repetimos
    // mientras exista una página siguiente
    while (siguiente) {
      const response = await fetch(siguiente);

      if (!response.ok) {
        errorR(
          `No se pudo completar la solicitud, por el error ${response.status}`,
        );
        return [];
      }

      const data = await response.json();

      data.results.forEach((ep) => {
        // ep.characters son URLs; el último pedazo de cada una es el id
        const apareceEnEpisodio = ep.characters.some(
          (urlPersonaje) => urlPersonaje.split("/").pop() === String(id),
        );

        if (apareceEnEpisodio) {
          episodiosDelPersonaje.push({
            episode: ep.episode,
            name: ep.name,
          });
        }
      });

      siguiente = data.info.next; // null en la última página
    }

    return episodiosDelPersonaje;
  } catch (e) {
    errorR(`No se pudieron cargar los episodios por error de red o ${e}`);
    return [];
  }
}

