const dishGrid = document.querySelector("#dish-grid");
const cardTemplate = document.querySelector("#dish-card-template");
const searchInput = document.querySelector("#search");
const resultCount = document.querySelector("#result-count");

let dishes = [];

function decodeBase64Image(base64, mimeType = "image/svg+xml") {
  try {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: mimeType });
    return URL.createObjectURL(blob);
  } catch {
    return "";
  }
}

function stars(rating) {
  const rounded = Math.round(Number(rating) || 0);
  return `${"★".repeat(rounded)}${"☆".repeat(Math.max(0, 5 - rounded))} ${Number(rating).toFixed(1)}/5`;
}

function mapEmbedUrl(dish) {
  const addresses = (dish.restaurants || []).map((place) => place.address).join(" | ");
  const query = addresses || dish.name;
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

function renderDishList(items) {
  dishGrid.innerHTML = "";

  if (items.length === 0) {
    dishGrid.innerHTML = '<p class="empty">No dishes found for that search.</p>';
    resultCount.textContent = "0 dishes";
    return;
  }

  items.forEach((dish) => {
    const node = cardTemplate.content.cloneNode(true);

    const image = node.querySelector(".dish-image");
    const imageUrl = decodeBase64Image(dish.image);
    image.src = imageUrl;
    image.alt = `${dish.name} photo`;

    node.querySelector(".dish-name").textContent = dish.name;
    node.querySelector(".dish-rating").textContent = stars(dish.rating);
    node.querySelector(".dish-description").textContent = dish.description;

    const list = node.querySelector(".location-list");
    (dish.restaurants || []).forEach((place) => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${place.mapUrl}" target="_blank" rel="noopener noreferrer">${place.name}</a> — ${place.address}`;
      list.append(li);
    });

    const iframe = node.querySelector(".dish-map");
    iframe.src = mapEmbedUrl(dish);
    iframe.title = `${dish.name} map`;

    dishGrid.append(node);
  });

  resultCount.textContent = `${items.length} dish${items.length === 1 ? "" : "es"}`;
}

function applySearch() {
  const term = searchInput.value.toLowerCase().trim();

  const filtered = dishes.filter((dish) => {
    if (!term) return true;

    const restaurantText = (dish.restaurants || [])
      .map((place) => `${place.name} ${place.address}`)
      .join(" ");

    const searchable = `${dish.name} ${dish.description} ${restaurantText}`.toLowerCase();
    return searchable.includes(term);
  });

  renderDishList(filtered);
}

async function init() {
  const response = await fetch("./dishes.json");
  dishes = await response.json();
  renderDishList(dishes);
  searchInput.addEventListener("input", applySearch);
}

init().catch(() => {
  dishGrid.innerHTML = '<p class="empty">Unable to load dishes.json.</p>';
  resultCount.textContent = "0 dishes";
});
