import { getWorksAndReturn, getCategoriesAndReturn } from "../assets/api.js";
import { ifCurrent } from "./shared.js";
import { getToken, modifyInterface, logOut } from "./ifLogged.js";
import {
	showModal1,
	displayFirstModalContent,
	deleteWork,
	closeModal,
} from "../assets/modale.js";

const galleryEl = document.querySelector(".gallery");
const filtersEl = document.querySelector(".filters");
const showAllEl = document.getElementById("showAll");

let currentCategoryId = null;

async function filterWorksByCategory(categoryId) {
	const works = await getWorksAndReturn();
	const filteredWorks = works.filter((work) => work.category.id === categoryId);
	fetchAndDisplayWorks(filteredWorks);
}

async function fetchAndDisplayWorks(filteredWorks) {
	galleryEl.innerHTML = "";

	for (const work of filteredWorks) {
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
}

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

async function init() {
	ifCurrent();
	const allWorks = await getWorksAndReturn();
	fetchAndDisplayWorks(allWorks);
	await fetchAndDisplayCategories();
	getToken();
	modifyInterface();
	showModal1();
	displayFirstModalContent();
	deleteWork();
	closeModal();
	logOut();
}

init();
