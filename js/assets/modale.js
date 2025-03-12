import { getToken } from "../pages/ifLogged.js";

const workSectionEl = document.getElementById("api-works");
const modalOnClick = document.getElementById("modifyProjects");
console.log("modifyProjects element:", modalOnClick);

export async function showModal1() {
	const tokenFound = await getToken();
	document.addEventListener("DOMContentLoaded", () => {
		const openModalOnClick = document.getElementById("modifyProjects");
		if (tokenFound) {
			console.log("found HELLOOOOO", openModalOnClick);
			observer.disconnect();
		} else {
			console.log("noooooooooooo :(");
		}
	});
	/* if (tokenFound) {
			modalOnClick.addEventListener("click", () => {
				console.log("found:", modalOnClick);
				const modalAside = document.getElementById("modal-1");
				if (modalAside) {
					modalAside.setAttribute("aria-hidden", "false");
					modalAside.setAttribute("aria-modal", "true");
					modalAside.classList.remove("modalInvisible");
					modalAside.classList.add("modalVisible");
				}
			});
		} else {
			console.log("user is not logged in");
		} */
}

export async function displayWorksInModal(Works) {
	workSectionEl.innerHTML = "";

	for (const work of Works) {
		const workData = await getWorksAndReturn(work.id);
		const figure = document.createElement("figure");
		figure.setAttribute("id", `work-${workData.id}`);
		const img = document.createElement("img");
		img.src = workData.imageUrl;
		img.alt = workData.title;
		const figcaption = document.createElement("figcaption");
		figcaption.textContent = workData.title;

		figure.appendChild(img);
		figure.appendChild(figcaption);
		workSectionEl.appendChild(figure);
	}
}
export async function closeModal() {
	const closeModalButton = document.getElementById("js-modal-close");
	if (closeModalButton) {
		closeModalButton.addEventListener("click", () => {
			const modalAside = document.getElementById("modal-1");
			if (modalAside) {
				modalAside.classList.remove("modalVisible");
				modalAside.classList.add("modalInvisible");
				modalAside.setAttribute("aria-hidden", "true");
				modalAside.setAttribute("aria-modal", "false");
			}
		});
	}
}

/* displayWorksInModal(); */
