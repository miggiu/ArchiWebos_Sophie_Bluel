import { ifCurrent } from "./shared.js";

const connectEl = document.getElementById("connect");
const errorEl = document.getElementById("errorMsg");

export async function submitLogIn() {
	connectEl.addEventListener("submit", (event) => {
		event.preventDefault();

		const formData = new FormData(connectEl);
		const data = Object.fromEntries(formData.entries());
		console.log(data);

		fetch("http://localhost:5678/api/users/login", {
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
					window.location.href = "/FrontEnd/index.html";
				} else {
					errorEl.textContent =
						"Veuillez vérifier l'E-mail et le Mot de passe.";
				}
			});
	});
}

async function init() {
	ifCurrent();
	await submitLogIn();
}

init();
