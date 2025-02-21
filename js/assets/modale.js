let modal = null;
/* const focusableSelector = "button, a, input, textarea" */
/* to modify with correct elements */
/* let focusables = []; */
export const openModal = function (e) {
	e.preventDefault();
	const target = document.getElementById(e.target.getElementById("modal-1"));
	target.style.display = null;
	target.removeAttribute("aria-hidden");
	target.setAttribute("aria-modal", "true");
	modal = target;
	modal.addEventListener("click", closeModal);
	modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
	modal.querySelector(".js-modal-stop").addEventListener("click", closeModal);
};
export const closeModal = function (e) {
	if (modal == null) return;
	e.preventDefault();
	modal.style.display = "none";
	modal.setAttribute("aria-hidden", "true");
	modal.removeAttribute("aria-modal");
	modal.removeEventListener("click");
	modal
		.querySelector(".js-modal-close")
		.removeEventListener("click", closeModal);
	modal
		.querySelector(".js-modal-stop")
		.removeEventListener("click", stopPropagation);
	modal = null;
};

document.querySelectorAll(".js-modal").forEach((a) => {
	a.addEventListener("click", openModal);
});

const stopPropagation = function (e) {
	e.stopPropagation();
};

const focusInModal = function (e) {
	e.preventDefault();
};

window.addEventListener("keydown", function (e) {
	if (e.key === "Escape" || e.key === "Esc") {
		closeModal(e);
	}
	if (e.key === "Tab" && modal !== null) {
		focusInModal(e);
	}
});
