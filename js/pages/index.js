import { getWorksAndReturn, getCategoriesAndReturn } from "../assets/api.js";
import { ifCurrent } from "./shared.js";
import { getToken, modifyInterface, logOut } from "./ifLogged.js";
import { initializeModals } from "../assets/modal.js";

const galleryEl = document.querySelector(".gallery");
const filtersEl = document.querySelector(".filters");
const showAllEl = document.getElementById("showAll");

let currentCategoryId = null;

/**
 * Filters works based on category ID and updates the gallery display.
 * Fetches all works and applies the category filter before displaying.
 * @param {number} categoryId - The ID of the category to filter by
 */
async function filterWorksByCategory(categoryId) {
	const works = await getWorksAndReturn();
	const filteredWorks = works.filter((work) => work.category.id === categoryId);
	fetchAndDisplayWorks(filteredWorks);
}

/**
 * Renders works in the gallery section of the page.
 * Creates figure elements with images and captions for each work.
 * @param {Array} filteredWorks - Optional array of pre-filtered works to display
 * If not provided, fetches and displays all works
 */
export async function fetchAndDisplayWorks(filteredWorks) {
	galleryEl.innerHTML = "";

	try {
		const worksToDisplay =
			filteredWorks && filteredWorks.length > 0
				? filteredWorks
				: await getWorksAndReturn();
		for (const work of worksToDisplay) {
			const figure = document.createElement("figure");
			figure.setAttribute("id", `work-${work.id}`);
			const img = document.createElement("img");
			img.src = work.imageUrl;
			img.alt = work.title;
			const figcaption = document.createElement("figcaption");
			figcaption.textContent = work.title;

			figure.appendChild(img);
			figure.appendChild(figcaption);
			galleryEl.appendChild(figure);
		}
	} catch (error) {
		console.error("Error fetching works:", error);
	}
}

/**
 * Fetches categories from the API and creates filter buttons.
 * Adds event listeners to each button to enable filtering by category.
 * Also sets up the "Show All" button functionality.
 */
async function fetchAndDisplayCategories() {
	const categories = await getCategoriesAndReturn();

	for (const category of categories) {
		const button = document.createElement("button");
		button.setAttribute("id", `category-${category.id}`);
		button.setAttribute("type", "button");
		button.textContent = category.name;

		button.addEventListener("click", () => {
			if (category.id !== currentCategoryId) {
				currentCategoryId = `${category.id}`;
				filterWorksByCategory(category.id);
			}
		});
		filtersEl.appendChild(button);
	}
	if (showAllEl) {
		showAllEl.addEventListener("click", async () => {
			const allWorks = await getWorksAndReturn();
			fetchAndDisplayWorks(allWorks);
		});
	}
}

/**
 * Initializes the application by setting up the page content and functionality.
 * Loads works, categories, checks authentication, and sets up interactive elements.
 * Acts as the main entry point for the application's frontend functionality.
 */
async function init() {
	ifCurrent();
	const allWorks = await getWorksAndReturn();
	fetchAndDisplayWorks(allWorks);

	await fetchAndDisplayCategories();
	await getToken();

	await modifyInterface();

	initializeModals();

	if (typeof logOut === "function") {
		logOut();
	}
}

document.addEventListener("DOMContentLoaded", init());
