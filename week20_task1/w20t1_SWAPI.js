const SWAPIcontentType = document.getElementById("SWAPIcontentType");
const SWAPIid = document.getElementById("SWAPIid");
const searchButton = document.getElementById("SWAPIsearch");

const responseBlock = document.querySelector(".SWAPI-response");
const responseElement = document.createElement("div");
const finallyElement = document.createElement("div");

searchButton.addEventListener("click", getData);

function checkISWAPIid() {
  if (!/^\d+$/.test(SWAPIid.value.trim())) {
    throw new Error("ID must contain a number");
  }
  if (SWAPIcontentType.value === "Select Type") {
    throw new Error("Choose content type");
  }
}

async function getData() {
  responseElement.classList.remove("response-output");
  responseElement.classList.remove("error-output");
  responseElement.innerHTML = "<div>Loading...</div>";
  finallyElement.textContent = "";

  try {
    checkISWAPIid();

    const response = await fetch(
      "https://swapi.py4e.com/api/" +
        SWAPIcontentType.value +
        "/" +
        SWAPIid.value.trim() +
        "/"
    );

    if (!response.ok) {
      if (response.status == "404") {
        throw new Error("Page not found. Try different ID#");
      }
      if (response.status == "500") {
        throw new Error("Internal server error. Try again later");
      } else {
        throw new Error("HTTP error: " + response.status);
      }
    }

    const data = await response.json();
    const info =
      SWAPIcontentType.value === "people"
        ? `<div>Name: ${data.name}
          </div>
          <div>Birth date: ${data.birth_year}
          </div>
          <div>Gender: ${data.gender}
          </div>
          `
        : SWAPIcontentType.value === "planets"
        ? `<div>Name: ${data.name}
          </div>
          <div>Diameter: ${data.diameter} km
          </div>
          <div>Terrain: ${data.terrain}
          </div>
          `
        : SWAPIcontentType.value === "species"
        ? `<div>Name: ${data.name}
          </div>
          <div>Classification: ${data.classification}
          </div>
          <div>Language: ${data.language}
          </div>
          `
        : SWAPIcontentType.value === "starships"
        ? `<div>Name: ${data.name}
          </div>
          <div>Max atmosphering speed: ${data.max_atmosphering_speed} km/s
          </div>
          <div>Cargo capacity: ${data.cargo_capacity} kg
          </div>
          `
        : "Not defined";

    responseElement.classList.add("response-output");
    responseElement.innerHTML = info;
    responseBlock.append(responseElement);

    SWAPIcontentType.selectedIndex = 0;
    SWAPIid.value = "";
  } catch (error) {
    responseElement.classList.add("error-output");
    responseElement.innerHTML = `<div>Error: ${error.message}</div>`;
    responseBlock.append(responseElement);
    console.error("Произошла ошибка:", error);
  } finally {
    finallyElement.classList.add("finally-output");
    finallyElement.textContent = "May the forth be with you!";
    responseBlock.append(finallyElement);
  }
}
