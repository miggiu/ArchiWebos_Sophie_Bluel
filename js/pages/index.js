import { getWorksAndReturn, getCategoriesAndReturn } from "../assets/api.js";
import { ifCurrent } from "./shared.js";
import { getToken, modifyInterface, logOut } from "./ifLogged.js";
import {
	showModal,
	displayFirstModalContent,
	displaySecondModalContent,
	deleteWork,
	closeModal,
	closeModal2,
	returnToModal1,
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
	await getToken();

	await modifyInterface();

	/* first modal */
	showModal();
	await displayFirstModalContent();
	deleteWork();
	closeModal();

	/* second modal */
	displaySecondModalContent();
	closeModal2();
	returnToModal1();

	logOut();
}

init();
