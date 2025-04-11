import { HOMEPAGE } from "../assets/variables.js";

const logoutEl = document.getElementById("logout");
const loggedBannerEl = document.getElementById("loggedBanner");
const projetsEl = document.getElementById("projets");
const sectionAside = document.getElementById("portfolio");

/*
 * Retrieves the authentication token from local storage.
 * Used to verify user authentication status throughout the application.
 * @returns {string|null} The stored authentication token or null if not present
 */
export async function getToken() {
	let token = localStorage.getItem("user_token");
	return token;
}

/*
 * Updates the interface to display admin features when user is logged in.
 * Hides category filters, displays edit mode banner and buttons,
 * and adds modification controls to the projects section.
 */
export async function updatePage() {
	const tokenFound = await getToken();
	if (tokenFound) {
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

		editDisplay.appendChild(editIconBanner);
		editDisplay.appendChild(pText);
		loggedBannerEl.appendChild(editDisplay);
		editTextProjets.appendChild(editIconProjets);
		editTextProjets.appendChild(projetsText);

		projetsEl.appendChild(editTextProjets);
	}
}

/*
 * Creates the modal template structure for the gallery management.
 * Builds the modal container, header, close button, and work section
 * where project thumbnails will be displayed for editing.
 */
export async function createModalTemplate() {
	const tokenFound = await getToken();
	if (tokenFound) {
		const modalAside = document.createElement("dialog");
		modalAside.setAttribute("id", "modal-content");
		modalAside.classList.add("modalTemplate");
		modalAside.setAttribute("aria-modal", "true");
		modalAside.inert = true;
		modalAside.setAttribute("aria-labelledby", "modalTitle");
		modalAside.setAttribute("role", "alertdialog");
		modalAside.classList.add("modalInvisible");
		const modalDiv = document.createElement("div");
		modalDiv.classList.add("js-modal-stop");
		modalDiv.classList.add("modal-wrapper");
		const closeModalDiv = document.createElement("div");
		closeModalDiv.classList.add("close-modal-div");
		const modalTitle = document.createElement("h1");
		modalTitle.setAttribute("id", "modalTitle");
		modalTitle.textContent = "Galerie photo";
		const closeModalIcon = document.createElement("i");
		closeModalIcon.setAttribute("id", "close-mark");
		closeModalIcon.classList.add("fa-solid");
		closeModalIcon.classList.add("fa-xmark");
		closeModalIcon.classList.add("fa-lg");
		const workSection = document.createElement("section");
		workSection.setAttribute("id", "api-works");

		sectionAside.insertAdjacentElement("afterend", modalAside);

		modalAside.appendChild(modalDiv);
		modalDiv.appendChild(closeModalDiv);
		closeModalDiv.appendChild(closeModalIcon);
		modalDiv.appendChild(modalTitle);

		modalDiv.appendChild(workSection);
	}
}

/*
 * Initializes the admin interface if the user is authenticated.
 * Orchestrates the sequence of UI updates by calling updatePage() and createModalTemplate().
 * Acts as the main entry point for admin functionality setup.
 */
export async function modifyInterface() {
	if (await getToken()) {
		updatePage();
		createModalTemplate();
	} else {
		return;
	}
}

/*
 * Sets up the logout functionality by attaching an event listener to the logout element.
 * Removes the authentication token from local storage and redirects to the homepage.
 */
export function logOut() {
	logoutEl.addEventListener("click", () => {
		localStorage.removeItem("user_token");

		window.location.href = HOMEPAGE;
	});
}
