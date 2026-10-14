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

