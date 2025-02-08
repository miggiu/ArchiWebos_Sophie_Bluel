const logoutEl = document.getElementById("logout");
const loggedBannerEl = document.getElementById("loggedBanner");
const projetsEl = document.getElementById("projets");

let loggedIn = false;
export async function ifLoggedIn() {
	if (loggedIn) return;
	const token = localStorage.getItem("user_token");
	if (token) {
		console.log("found token:", token);
		loggedIn = true;

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
		const editIconProjets = document.createElement("i");
		editIconProjets.classList.add("fa-regular", "fa-pen-to-square");
		const projetsText = document.createTextNode("modifier");

		editDisplay.appendChild(editIconBanner);
		editDisplay.appendChild(pText);
		loggedBannerEl.appendChild(editDisplay);
		editTextProjets.appendChild(editIconProjets);
		editTextProjets.appendChild(projetsText);
		projetsEl.appendChild(editTextProjets);
	} else {
		console.log("no token found");
		loggedIn = false;
	}
}

export function logOut() {
	logoutEl.addEventListener("click", () => {
		localStorage.removeItem("user_token");
		console.log("logged out ok:", localStorage);

		loggedIn = false;
		window.location.href = "/FrontEnd/index.html";
	});
}
