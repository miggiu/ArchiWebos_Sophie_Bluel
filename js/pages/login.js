import { ifCurrent } from "./shared.js";
import { BASE_API_URL, HOMEPAGE } from "../assets/variables.js";

const connectEl = document.getElementById("connect");
const errorEl = document.getElementById("errorMsg");
const inputPassword = document.getElementById("password");
const passwordVisible = document.getElementById("showPassword");

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

export async function submitLogIn() {
	connectEl.addEventListener("submit", (event) => {
		event.preventDefault();

		const formData = new FormData(connectEl);
		const data = Object.fromEntries(formData.entries());
		console.log(data);

		fetch(`${BASE_API_URL}users/login/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
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

function hidePassword() {
	if (inputPassword.type === "password") {
		inputPassword.type = "text";
	} else {
		inputPassword.type = "password";
		passwordVisible.style.display = "none";
	}
}

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

async function init() {
	ifCurrent();
	submitLogIn();
	hidePassword();
	showPassword();
}

init();
