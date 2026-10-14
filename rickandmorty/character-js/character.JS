const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// Referencias al DOM
const nameCH = document.getElementById("char-name");
const imgCH = document.getElementById("char-image");
const statusCH = document.getElementById("char-status");
const speciesCH = document.getElementById("char-species");
const genderCH = document.getElementById("char-gender");
const originCH = document.getElementById("char-origin");
const locationCH = document.getElementById("char-location");
const episodesCH = document.getElementById("char-episodes");

// Cargar datos del personaje
async function loadCharacter(id) {
  try {
    const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
    if (!response.ok) throw new Error("Error al cargar personaje");
    
    const character = await response.json();
    
    nameCH.textContent = character.name;
    imgCH.src = character.image;
    statusCH.textContent = character.status;
    speciesCH.textContent = character.species;
    genderCH.textContent = character.gender;
    originCH.textContent = character.origin.name;
    locationCH.textContent = character.location.name;

    // Mostrar episodios (solo los primeros 5 para no saturar)
     episodesCH.innerHTML = "";
    for (const epUrl of character.episode) {
      const epResponse = await fetch(epUrl);
      const epData = await epResponse.json();

      const li = document.createElement("li");
      li.textContent = `${epData.episode} - ${epData.name}`;
      episodesCH.appendChild(li);
    }
  } catch (error) {
    nameCH.textContent = "No se pudo cargar el personaje";
  }
}

loadCharacter(id);
