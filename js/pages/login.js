import { ifCurrent } from "./shared.js";
import { BASE_API_URL, HOMEPAGE } from "../assets/variables.js";

const connectEl = document.getElementById("connect");
const errorEl = document.getElementById("errorMsg");
const inputPassword = document.getElementById("password");
const passwordVisible = document.getElementById("showPassword");

/**
 * Controls the visibility of the show password icon.
 * Shows the icon only when the password field contains text.
 * Attaches input event listener to password field to dynamically update icon visibility.
 */
document.addEventListener("DOMContentLoaded", function () {
	function checkPasswordInput() {
		if (inputPassword.value.length > 0) {
			passwordVisible.style.display = "flex";
		} else {
			passwordVisible.style.display = "none";
		}
	}
	inputPassword.addEventListener("input", checkPasswordInput);
	checkPasswordInput();
});

/**
 * Handles login form submission.
 * Sends credentials to the API, stores authentication token in local storage,
 * and redirects to homepage on success or displays error message on failure.
 */
export async function submitLogIn() {
	connectEl.addEventListener("submit", (event) => {
		event.preventDefault();

		const formData = new FormData(connectEl);
		const data = Object.fromEntries(formData.entries());

		fetch(`${BASE_API_URL}users/login/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.userId && data.token) {
					localStorage.setItem("user_token", data.token);
					window.location.href = HOMEPAGE;
				} else {
					errorEl.textContent =
						"Veuillez vérifier l'E-mail et le Mot de passe.";
				}
			});
	});
}

/**
 * Toggles password visibility between text and password.
 * Used as part of the password visibility control functionality.
 */
function hidePassword() {
	if (inputPassword.type === "password") {
		inputPassword.type = "text";
	} else {
		inputPassword.type = "password";
		passwordVisible.style.display = "none";
	}
}

/**
 * Attaches click event listener to the password visibility toggle icon.
 * Switches between showing and hiding the password text.
 */
async function showPassword() {
	passwordVisible.addEventListener("click", () => {
		let x = document.getElementById("password");
		if (x.type === "text") {
			x.type = "password";
		} else {
			x.type = "text";
		}
	});
}

/**
 * Initializes the login page functionality.
 * Sets up current page indicator, login submission handler,
 * and password visibility toggle features.
 */
async function init() {
	ifCurrent();
	submitLogIn();
	hidePassword();
	showPassword();
}

init();
