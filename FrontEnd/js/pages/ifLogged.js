import { HOMEPAGE } from "../assets/variables.js";

const logoutEl = document.getElementById("logout");
const loggedBannerEl = document.getElementById("loggedBanner");
const projetsEl = document.getElementById("projets");

export async function ifLoggedIn() {
	const token = localStorage.getItem("user_token");
	if (token) {
		console.log("Token found:", token);

		document.getElementById("showAll").className = "not-displayed";
		document.getElementById("category-1").className = "not-displayed";
		document.getElementById("category-2").className = "not-displayed";
		document.getElementById("category-3").className = "not-displayed";
		logoutEl.textContent = "logout";

		loggedBannerEl.classList.add("logged-banner");
		const editDisplay = document.createElement("p");
		const editIconBanner = document.createElement("i");
		editIconBanner.classList.add("fa-regular", "fa-pen-to-square");
		const pText = document.createTextNode("Mode édition");
		const editTextProjets = document.createElement("p");
		editTextProjets.setAttribute("id", "modifyProjects");
		const modalTemplateA = document.createElement("a");
		modalTemplateA.setAttribute("href", "modal1");
		modalTemplateA.setAttribute("id", "openModal");
		const editIconProjets = document.createElement("i");
		editIconProjets.classList.add("fa-regular", "fa-pen-to-square");
		const projetsText = document.createTextNode("modifier");
		const modalAside = document.createElement("aside");
		modalAside.setAttribute("id", "modal-1");
		modalAside.classList.add("modalTemplate");
		modalAside.setAttribute("aria-hidden", "true");
		modalAside.setAttribute("aria-modal", "false");
		modalAside.setAttribute("aria-labelledby", "modalTitle");
		modalAside.setAttribute("role", "dialog");
		modalAside.setAttribute("style", "display:none");
		const modalDiv = document.createElement("div");
		modalDiv.classList.add("js-modal-stop");
		modalDiv.classList.add("modal-wrapper");
		const modalTitle = document.createElement("h1");
		modalTitle.setAttribute("id", "modalTitle");
		modalTitle.textContent = "Galerie photo";
		const closeModalButton = document.createElement("button");
		closeModalButton.classList.add("js-modal-close");
		const closeModalIcon = document.createElement("i");
		closeModalIcon.classList.add("fa-solid");
		closeModalIcon.classList.add("fa-xmark");

		editDisplay.appendChild(editIconBanner);
		editDisplay.appendChild(pText);
		loggedBannerEl.appendChild(editDisplay);
		editTextProjets.appendChild(modalTemplateA);
		editTextProjets.appendChild(modalAside);
		modalTemplateA.appendChild(editIconProjets);
		modalTemplateA.appendChild(projetsText);
		modalAside.appendChild(modalDiv);
		modalDiv.appendChild(modalTitle);
		modalDiv.appendChild(closeModalButton);
		closeModalButton.appendChild(closeModalIcon);

		projetsEl.appendChild(editTextProjets);
	} else {
		console.log("no token found");
	}
}

export function logOut() {
	logoutEl.addEventListener("click", () => {
		localStorage.removeItem("user_token");

		window.location.href = HOMEPAGE;
	});
}
