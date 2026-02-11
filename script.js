const STORAGE_KEY = "biteboard-reviews-v1";

const defaultReviews = [
  {
    id: crypto.randomUUID(),
    reviewer: "Aisha",
    restaurant: "Luna Pasta Lab",
    dish: "Truffle Tagliatelle",
    cuisine: "Italian",
    neighborhood: "SoMa",
    rating: 5,
    comment: "Silky pasta with deep truffle aroma. Rich but balanced and worth every bite.",
    createdAt: "2026-01-14T18:15:00.000Z",
  },
  {
    id: crypto.randomUUID(),
    reviewer: "Marcus",
    restaurant: "Crimson Grill",
    dish: "Smoked Brisket Plate",
    cuisine: "BBQ",
    neighborhood: "Mission",
    rating: 4,
    comment: "Tender brisket and a peppery bark. Cornbread was excellent too.",
    createdAt: "2026-02-01T13:05:00.000Z",
  },
  {
    id: crypto.randomUUID(),
    reviewer: "Jenna",
    restaurant: "Sakura Corner",
    dish: "Spicy Salmon Roll",
    cuisine: "Japanese",
    neighborhood: "Richmond",
    rating: 4,
    comment: "Fresh fish and great texture. Spicy mayo has a nice kick without overpowering.",
    createdAt: "2026-01-28T20:40:00.000Z",
  },
  {
    id: crypto.randomUUID(),
    reviewer: "Noah",
    restaurant: "Taco Orbit",
    dish: "Al Pastor Tacos",
    cuisine: "Mexican",
    neighborhood: "Downtown",
    rating: 5,
    comment: "Perfect char and pineapple sweetness. Probably my favorite taco spot right now.",
    createdAt: "2026-02-04T12:18:00.000Z",
  },
  {
    id: crypto.randomUUID(),
    reviewer: "Leila",
    restaurant: "Garden Bowl",
    dish: "Falafel Mezze",
    cuisine: "Middle Eastern",
    neighborhood: "Sunset",
    rating: 3,
    comment: "Great hummus, but falafel could be crispier. Friendly service though.",
    createdAt: "2026-01-30T19:10:00.000Z",
  },
];

const state = {
  reviews: loadReviews(),
  searchTerm: "",
  selectedCuisine: "all",
  sortBy: "rating-desc",
};

const reviewGrid = document.querySelector("#review-grid");
const template = document.querySelector("#review-card-template");
const cuisineFilter = document.querySelector("#cuisine-filter");
const searchInput = document.querySelector("#search");
const sortSelect = document.querySelector("#sort");
const resultsSummary = document.querySelector("#results-summary");
const heroStats = document.querySelector("#hero-stats");
const reviewForm = document.querySelector("#review-form");

function loadReviews() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return defaultReviews;
    }

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultReviews;
  } catch (error) {
    console.warn("Unable to read reviews from storage.", error);
    return defaultReviews;
  }
}

function saveReviews() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.reviews));
}

function formatDate(isoDate) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(isoDate));
}

function getAverageRating(reviews) {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((total, review) => total + Number(review.rating), 0);
  return (sum / reviews.length).toFixed(1);
}

function normalize(value) {
  return value.toLowerCase().trim();
}

function getFilteredReviews() {
  const term = normalize(state.searchTerm);

  const filtered = state.reviews.filter((review) => {
    const cuisineMatch =
      state.selectedCuisine === "all" || normalize(review.cuisine) === normalize(state.selectedCuisine);

    if (!cuisineMatch) return false;

    if (!term) return true;

    const fullText = `${review.restaurant} ${review.dish} ${review.neighborhood} ${review.comment} ${review.cuisine}`;
    return normalize(fullText).includes(term);
  });

  return filtered.sort((a, b) => {
    if (state.sortBy === "rating-desc") return Number(b.rating) - Number(a.rating);
    if (state.sortBy === "rating-asc") return Number(a.rating) - Number(b.rating);
    if (state.sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    return new Date(a.createdAt) - new Date(b.createdAt);
  });
}

function renderCuisineOptions() {
  const cuisineSet = new Set(state.reviews.map((review) => review.cuisine).filter(Boolean));
  const cuisines = [...cuisineSet].sort((a, b) => a.localeCompare(b));

  cuisineFilter.innerHTML = '<option value="all">All cuisines</option>';
  cuisines.forEach((cuisine) => {
    const option = document.createElement("option");
    option.value = cuisine;
    option.textContent = cuisine;
    cuisineFilter.append(option);
  });

  cuisineFilter.value = state.selectedCuisine;
}

function renderHeroStats() {
  const topCuisine =
    Object.entries(
      state.reviews.reduce((acc, review) => {
        acc[review.cuisine] = (acc[review.cuisine] || 0) + 1;
        return acc;
      }, {})
    ).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  heroStats.innerHTML = "";

  const stats = [
    { label: "Total reviews", value: state.reviews.length },
    { label: "Average rating", value: `⭐ ${getAverageRating(state.reviews)}` },
    { label: "Top cuisine", value: topCuisine },
  ];

  stats.forEach((stat) => {
    const item = document.createElement("article");
    item.className = "hero-stat";
    item.innerHTML = `<strong>${stat.value}</strong><span>${stat.label}</span>`;
    heroStats.append(item);
  });
}

function renderReviews() {
  const filtered = getFilteredReviews();
  reviewGrid.innerHTML = "";

  if (filtered.length === 0) {
    reviewGrid.innerHTML =
      '<p class="empty-state card">No matching reviews yet. Try changing filters or add your own review.</p>';
  } else {
    filtered.forEach((review) => {
      const node = template.content.cloneNode(true);
      node.querySelector(".restaurant").textContent = review.restaurant;
      node.querySelector(".dish").textContent = review.dish;
      node.querySelector(".rating-badge").textContent = `⭐ ${review.rating}/5`;
      node.querySelector(".meta").textContent = `${review.cuisine} • ${review.neighborhood} • ${formatDate(
        review.createdAt
      )}`;
      node.querySelector(".comment").textContent = review.comment;
      node.querySelector(".author").textContent = `Reviewed by ${review.reviewer}`;
      reviewGrid.append(node);
    });
  }

  resultsSummary.textContent = `${filtered.length} result${filtered.length === 1 ? "" : "s"}`;
}

function handleFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(reviewForm);

  const nextReview = {
    id: crypto.randomUUID(),
    reviewer: formData.get("reviewer")?.toString().trim() || "Anonymous",
    restaurant: formData.get("restaurant")?.toString().trim() || "",
    dish: formData.get("dish")?.toString().trim() || "",
    cuisine: formData.get("cuisine")?.toString().trim() || "",
    neighborhood: formData.get("neighborhood")?.toString().trim() || "",
    rating: Number(formData.get("rating")),
    comment: formData.get("comment")?.toString().trim() || "",
    createdAt: new Date().toISOString(),
  };

  if (
    !nextReview.restaurant ||
    !nextReview.dish ||
    !nextReview.cuisine ||
    !nextReview.neighborhood ||
    !nextReview.comment ||
    !nextReview.rating
  ) {
    return;
  }

  state.reviews = [nextReview, ...state.reviews];
  saveReviews();
  renderCuisineOptions();
  renderHeroStats();
  renderReviews();
  reviewForm.reset();
}

function initFilters() {
  searchInput.addEventListener("input", (event) => {
    state.searchTerm = event.target.value;
    renderReviews();
  });

  cuisineFilter.addEventListener("change", (event) => {
    state.selectedCuisine = event.target.value;
    renderReviews();
  });

  sortSelect.addEventListener("change", (event) => {
    state.sortBy = event.target.value;
    renderReviews();
  });
}

function initForm() {
  ["reviewer", "restaurant", "dish", "cuisine", "neighborhood", "rating", "comment"].forEach((id) => {
    const element = document.querySelector(`#${id}`);
    element.name = id;
  });

  reviewForm.addEventListener("submit", handleFormSubmit);
}

function init() {
  renderCuisineOptions();
  renderHeroStats();
  renderReviews();
  initFilters();
  initForm();
}

init();
