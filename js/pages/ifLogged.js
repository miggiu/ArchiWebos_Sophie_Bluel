import { HOMEPAGE } from "../assets/variables.js";

const logoutEl = document.getElementById("logout");
const loggedBannerEl = document.getElementById("loggedBanner");
const projetsEl = document.getElementById("projets");
const sectionAside = document.getElementById("portfolio");
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
		const editTextProjets = document.createElement("button");
		editTextProjets.setAttribute("type", "button");
		editTextProjets.setAttribute("id", "modifyProjects");
		const editIconProjets = document.createElement("i");
		editIconProjets.classList.add("fa-regular", "fa-pen-to-square");
		const projetsText = document.createTextNode("modifier");
		const modalAside = document.createElement("aside");
		modalAside.setAttribute("id", "modal-1");
		modalAside.classList.add("modalTemplate");
		modalAside.setAttribute("aria-hidden", "false");
		modalAside.setAttribute("aria-modal", "true");
		modalAside.setAttribute("aria-labelledby", "modalTitle");
		modalAside.setAttribute("role", "alertdialog");
		modalAside.classList.add("modalVisible");
		const modalDiv = document.createElement("div");
		modalDiv.classList.add("js-modal-stop");
		modalDiv.classList.add("modal-wrapper");
		const closeModalDiv = document.createElement("div");
		closeModalDiv.classList.add("close-modal-div");
		const modalTitle = document.createElement("h1");
		modalTitle.setAttribute("id", "modalTitle");
		modalTitle.textContent = "Galerie photo";
		const closeModalButton = document.createElement("button");
		closeModalButton.setAttribute("id", "js-modal-close");
		const closeModalIcon = document.createElement("i");
		closeModalIcon.setAttribute("id", "close-mark");
		closeModalIcon.classList.add("fa-solid");
		closeModalIcon.classList.add("fa-xmark");
		const workSection = document.createElement("section");
		workSection.setAttribute("id", "api-works");

		editDisplay.appendChild(editIconBanner);
		editDisplay.appendChild(pText);
		loggedBannerEl.appendChild(editDisplay);
		editTextProjets.appendChild(editIconProjets);
		editTextProjets.appendChild(projetsText);
		sectionAside.insertAdjacentElement("afterend", modalAside);

		modalAside.appendChild(modalDiv);
		modalDiv.appendChild(closeModalDiv);
		closeModalDiv.appendChild(closeModalButton);
		modalDiv.appendChild(modalTitle);
		closeModalButton.appendChild(closeModalIcon);
		modalDiv.appendChild(workSection);

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
