import { BASE_API_URL } from "./variables.js";
import { getWorksAndReturn, getCategoriesAndReturn } from "./api.js";
import { getToken } from "../pages/ifLogged.js";
import { fetchAndDisplayWorks } from "../pages/index.js";

export {
	initializeModals,
	prepareModalContent,
	createSecondModalContent,
	refreshAllDisplays,
	closeModal,
	closeModal2,
	returnToModal1,
	showModal,
};

/*
 * Initializes modal 1 content by fetching works, setting up the add button,
 * and attaching necessary event listeners. Also prepares modal 2 for later use.
 */
async function prepareModalContent() {
	await fetchAndDisplayWorksInModal();
	await integrateAddWorkButton();

	attachModalListeners("modal-content");
	await createSecondModalContent();
}

/*
 * Sets up the main modal system and adds click event listener to the "modify projects" button.
 * This function serves as the entry point for the modal functionality.
 */
function initializeModals() {
	const modalButton = document.getElementById("modifyProjects");
	if (modalButton) {
		modalButton.addEventListener("click", async () => {
			prepareModalContent();
			showModal("modal-content");
		});
	}
}

/*
 * Refreshes all work displays after modifications (add/delete).
 * Updates both the gallery on the main page and works displayed in the modal.
 */
async function refreshAllDisplays() {
	const allWorks = await getWorksAndReturn();
	await fetchAndDisplayWorksInModal();
	await fetchAndDisplayWorks(allWorks);
	attachModalListeners();
}

/*
 * Fetches all works from the API and renders them in the modal gallery.
 * Each work item includes a delete icon for removal functionality.
 */
async function fetchAndDisplayWorksInModal() {
	const workSectionEl = document.getElementById("api-works");

	if (!workSectionEl) {
		console.error("Element not found");
		return;
	}
	workSectionEl.innerHTML = "";
	const works = await getWorksAndReturn();
	for (const work of works) {
		const figure = document.createElement("figure");
		figure.classList.add("modal-work");
		figure.setAttribute("id", `work-${work.id}`);
		const img = document.createElement("img");
		img.src = work.imageUrl;
		img.alt = work.title;
		const deleteIconDiv = document.createElement("div");
		deleteIconDiv.setAttribute("id", "delete-icon-div");
		const deleteIcon = document.createElement("img");
		deleteIcon.setAttribute("id", `icon-${work.id}`);
		deleteIcon.src = "assets/icons/delete.png";
		deleteIcon.alt = "delete icon";
		deleteIcon.classList.add("delete-icon");

		deleteIconDiv.appendChild(deleteIcon);
		figure.appendChild(deleteIconDiv);
		figure.appendChild(img);
		workSectionEl.appendChild(figure);
	}
}

/*
 * Adds a divider and "Add Work" button to the modal.
 * Creates the UI elements needed for transitioning to modal 2.
 */
async function integrateAddWorkButton() {
	const workSectionEl = document.getElementById("api-works");
	const buttonAddWorkDiv = document.createElement("div");
	buttonAddWorkDiv.setAttribute("id", "button-add-work-div");

	const buttonAddWork = document.createElement("button");
	buttonAddWork.setAttribute("id", "add-new-work");
	buttonAddWork.setAttribute("type", "button");
	buttonAddWork.textContent = "Ajouter une photo";

	const dividerEl = document.createElement("hr");
	dividerEl.classList.add("divider-modal");

	buttonAddWorkDiv.appendChild(dividerEl);
	buttonAddWorkDiv.appendChild(buttonAddWork);
	workSectionEl.insertAdjacentElement("afterend", buttonAddWorkDiv);
}

/*
 * Sets up all event listeners for a specified modal.
 * Handles close button clicks, out-of-modal clicks, and specific actions like delete or add.
 * @param {string} modalId - The ID of the modal to attach listeners to (default: "modal-content")
 */
function attachModalListeners(modalId = "modal-content") {
	const modalAside = document.getElementById(modalId);
	if (!modalAside) return;

	if (modalId === "modal-content") {
		const addNewWorkButton = document.getElementById("add-new-work");
		if (addNewWorkButton) {
			const newAddButton = addNewWorkButton.cloneNode(true);
			addNewWorkButton.parentNode.replaceChild(newAddButton, addNewWorkButton);
			newAddButton.addEventListener("click", () => {
				showModal("modal-2");
				hideModal("modal-content");
			});
		}
		attachDeleteListeners();
	}

	const closeModalButton = document.getElementById(
		modalId === "modal-content" ? "close-mark" : "close-mark2"
	);
	if (closeModalButton) {
		const newCloseButton = closeModalButton.cloneNode(true);
		closeModalButton.parentNode.replaceChild(newCloseButton, closeModalButton);
		newCloseButton.addEventListener("click", () => {
			modalId === "modal-content" ? closeModal() : closeModal2();
		});
	}
	modalAside.addEventListener("click", (event) => {
		const modalWrapper = modalAside.querySelector(".js-modal-stop");
		if (modalWrapper && !modalWrapper.contains(event.target)) {
			modalId === "modal-content" ? closeModal() : closeModal2();
		}
	});
}

/*
 * Adds click event listeners to all delete icons in the modal gallery.
 * Each listener shows a confirmation dialog and triggers the delete API call if confirmed.
 */
async function attachDeleteListeners() {
	const works = await getWorksAndReturn();
	works.forEach((work) => {
		const deleteIcon = document.getElementById(`icon-${work.id}`);
		if (deleteIcon) {
			const newDeleteIcon = deleteIcon.cloneNode(true);
			deleteIcon.parentNode.replaceChild(newDeleteIcon, deleteIcon);
			newDeleteIcon.addEventListener("click", async () => {
				if (confirm(`Êtes-vous sûr de vouloir supprimer ${work.title} ?`)) {
					await deleteWorkById(work.id);
				}
			});
		}
	});
}

/*
 * Dynamically creates the content for modal 2 (add work form).
 * Builds all form elements, preview container, and sets up category dropdown options from the API.
 */
async function createSecondModalContent() {
	const modalAside = document.createElement("dialog");
	const firstDialog = document.getElementById("modal-content");
	/* base structure */
	modalAside.setAttribute("id", "modal-2");
	modalAside.setAttribute("aria-modal", "false");
	modalAside.inert = true;
	modalAside.setAttribute("aria-labelledby", "modalTitleAddPhoto");
	modalAside.setAttribute("role", "alertdialog");
	modalAside.classList.add("modalTemplate");
	modalAside.classList.add("modalInvisible");
	const modalDiv2 = document.createElement("div");
	modalDiv2.classList.add("js-modal-stop");
	modalDiv2.classList.add("modal-wrapper");
	/* icons */
	const divIconsModal2 = document.createElement("div");
	divIconsModal2.classList.add("icons-modal-div");
	const closeIconDiv2 = document.createElement("div");
	closeIconDiv2.setAttribute("id", "delete-icon-div");
	const closeIcon2 = document.createElement("i");
	closeIcon2.setAttribute("id", "close-mark2");
	closeIcon2.classList.add("fa-solid");
	closeIcon2.classList.add("fa-xmark");
	closeIcon2.classList.add("fa-lg");

	const returnIconDiv = document.createElement("div");
	returnIconDiv.setAttribute("id", "return-icon-div");
	const returnIcon = document.createElement("i");
	returnIcon.setAttribute("id", "return-icon");
	returnIcon.classList.add("fa-solid");
	returnIcon.classList.add("fa-arrow-left");
	returnIcon.classList.add("fa-lg");
	returnIcon.addEventListener("click", () => {
		returnToModal1();
	});
	/* title */
	const modalTitle2 = document.createElement("h1");
	modalTitle2.setAttribute("id", "modalTitleAddPhoto");
	modalTitle2.textContent = "Ajout photo";
	/* add work form */
	const sectionFormAddWork = document.createElement("section");
	sectionFormAddWork.setAttribute("id", "section-form-add-work");
	const divAddWork = document.createElement("div");
	divAddWork.setAttribute("id", "input-add-work");
	const divPhotoIcon = document.createElement("div");
	divPhotoIcon.setAttribute("id", "photo-icon-div");
	const photoIcon = document.createElement("i");
	photoIcon.classList.add("fa-regular");
	photoIcon.classList.add("fa-image");
	photoIcon.classList.add("fa-6x");
	/* preview container */
	const previewContainer = document.createElement("div");
	previewContainer.setAttribute("id", "preview-container");
	const previewImage = document.createElement("img");
	previewImage.setAttribute("id", "preview-image");
	previewImage.setAttribute("alt", "preview image");
	const removePreviewIcon = document.createElement("i");
	removePreviewIcon.setAttribute("id", "remove-preview-icon");
	removePreviewIcon.setAttribute("type", "button");
	removePreviewIcon.classList.add("fa-regular");
	removePreviewIcon.classList.add("fa-circle-xmark");
	/* form label & input */
	const inputLabel = document.createElement("label");
	inputLabel.setAttribute("for", "add-file");
	inputLabel.setAttribute("id", "add-file-label");
	inputLabel.textContent = "+ Ajouter photo";
	const inputFile = document.createElement("input");
	inputFile.setAttribute("type", "file");
	inputFile.setAttribute("id", "add-file");
	inputFile.setAttribute("name", "add-new-file");
	const labelP = document.createElement("p");
	labelP.setAttribute("id", "label-p");
	labelP.textContent = "jpg, png : 4mo max";
	/* dropdowns */
	const sectionAddWork = document.createElement("section");
	sectionAddWork.setAttribute("id", "section-add-work");
	const formAddWork = document.createElement("form");
	formAddWork.setAttribute("id", "form-addWork");
	const inputTitleLabel = document.createElement("label");
	inputTitleLabel.setAttribute("for", "input-title");
	inputTitleLabel.setAttribute("id", "input-title-label");
	inputTitleLabel.textContent = "Titre";
	const inputTitle = document.createElement("input");
	inputTitle.setAttribute("type", "text");
	inputTitle.setAttribute("id", "input-title");
	inputTitle.setAttribute("name", "title");
	const dropdownContainer = document.createElement("div");
	dropdownContainer.setAttribute("id", "dropdown-container");
	const categoryDropdown = document.createElement("select");
	categoryDropdown.setAttribute("id", "category-dropdown");
	const chevronDown = document.createElement("i");
	chevronDown.classList.add("fa-solid");
	chevronDown.classList.add("fa-chevron-down");
	chevronDown.setAttribute("id", "select-chevron-down");
	const removeOptionIcon = document.createElement("i");
	removeOptionIcon.classList.add("fa-regular");
	removeOptionIcon.classList.add("fa-circle-xmark");
	removeOptionIcon.setAttribute("id", "remove-option-icon");
	removeOptionIcon.style.display = "none";
	const defaultOption = document.createElement("option");
	defaultOption.setAttribute("value", "default");
	defaultOption.value = "";
	defaultOption.selected = true;
	defaultOption.disabled = true;
	const categoryLabel = document.createElement("label");
	categoryLabel.setAttribute("for", "category-dropdown");
	categoryLabel.setAttribute("id", "category-dropdown-label");
	categoryLabel.textContent = "Catégorie";
	categoryDropdown.appendChild(defaultOption);
	try {
		const categories = await getCategoriesAndReturn();
		categories.forEach((category) => {
			const option = document.createElement("option");
			option.value = category.id;
			option.textContent = category.name;
			categoryDropdown.appendChild(option);
		});
	} catch (error) {
		console.error("Error loading categories", error.message);
	}

	const dividerButtonContainer = document.createElement("div");
	dividerButtonContainer.setAttribute("id", "divider-button-container");

	/* divider */
	const dividerEl = document.createElement("hr");
	dividerEl.classList.add("divider-modal-2");

	/* submit button */
	const submitAddWork = document.createElement("button");
	submitAddWork.setAttribute("type", "submit");
	submitAddWork.setAttribute("id", "submit-add-work");
	submitAddWork.textContent = "Valider";
	/* base structure */
	modalAside.appendChild(modalDiv2);
	modalDiv2.appendChild(divIconsModal2);

	/* icons */
	divIconsModal2.appendChild(returnIconDiv);
	returnIconDiv.appendChild(returnIcon);
	divIconsModal2.appendChild(closeIconDiv2);
	closeIconDiv2.appendChild(closeIcon2);

	/* title */
	modalDiv2.appendChild(modalTitle2);

	/* preview container */
	previewContainer.appendChild(removePreviewIcon);
	previewContainer.appendChild(previewImage);

	/* input integr new work  */
	modalDiv2.appendChild(sectionFormAddWork);
	sectionFormAddWork.appendChild(divAddWork);
	sectionFormAddWork.appendChild(previewContainer);
	divAddWork.appendChild(divPhotoIcon);
	divPhotoIcon.appendChild(photoIcon);
	divAddWork.appendChild(inputLabel);
	inputLabel.appendChild(inputFile);
	divAddWork.appendChild(labelP);

	/* form dropdown categories */

	formAddWork.appendChild(inputTitleLabel);
	formAddWork.appendChild(inputTitle);
	formAddWork.appendChild(dropdownContainer);

	dropdownContainer.appendChild(categoryLabel);
	dropdownContainer.appendChild(categoryDropdown);
	dropdownContainer.appendChild(chevronDown);
	dropdownContainer.appendChild(removeOptionIcon);

	dividerButtonContainer.appendChild(dividerEl);
	dividerButtonContainer.appendChild(submitAddWork);

	formAddWork.appendChild(dividerButtonContainer);
	sectionAddWork.appendChild(formAddWork);

	modalDiv2.appendChild(sectionAddWork);
	firstDialog.insertAdjacentElement("afterend", modalAside);

	/* event listeners */

	categoryDropdown.addEventListener("change", () => {
		if (categoryDropdown.value !== "" && categoryDropdown.value !== "default") {
			removeOptionIcon.style.display = "flex";
		} else {
			removeOptionIcon.style.display = "none";
		}
	});
	removeOptionIcon.addEventListener("click", () => {
		categoryDropdown.selectedIndex = 0;
		removeOptionIcon.style.display = "none";
		checkFormValidity();
	});
	attachModalListeners("modal-2");
	await addWork();
}

/*
 * Sends a DELETE request to the API to remove a specific work.
 * @param {number} workId - The ID of the work to delete
 */
async function deleteWorkById(workId) {
	const token = await getToken();
	const url = `${BASE_API_URL}works/${workId}`;

	try {
		const response = await fetch(url, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		if (response.ok) {
			await refreshAllDisplays();
		} else {
			const errorText = await response.text();
			throw new Error(`Erreur serveur (${response.status}): ${errorText}`);
		}
	} catch (error) {
		console.error("Error deleting work:", error.message);
	}
}

/*
 * Validates form inputs and displays appropriate error messages.
 * Checks file type (jpg/png) and size (max 4MB).
 * @returns {boolean} True if no errors found, false otherwise
 */
function formErrors() {
	const addWorkImg = document.getElementById("add-file");
	const divAddWork = document.getElementById("input-add-work");

	const existingErrors = document.querySelectorAll("[id$='-error']");
	existingErrors.forEach((error) => error.remove());

	if (addWorkImg && addWorkImg.files[0] && addWorkImg.files) {
		const fileType = addWorkImg.files[0].type;
		if (
			fileType !== "image/jpeg" &&
			fileType !== "image/png" &&
			fileType !== "image/jpg"
		) {
			const imgError = document.createElement("p");
			imgError.setAttribute("id", "img-error");
			imgError.textContent =
				"Veuillez sélectionner une image au format jpg, jpeg ou png";
			divAddWork.appendChild(imgError);
			return false;
		}

		const maxSize = 4 * 1024 * 1024; // 4MB
		if (addWorkImg.files[0].size > maxSize) {
			const imgError = document.createElement("p");
			imgError.setAttribute("id", "img-error");
			imgError.textContent = "Veuillez sélectionner une image de moins de 4MB";
			divAddWork.appendChild(imgError);
			return false;
		}
	}
	return true;
}

/*
 * Checks if all required form fields are filled correctly and enables/disables submit button accordingly.
 * Validates image file, title, and category selection.
 */
async function checkFormValidity() {
	const addWorkImg = document.getElementById("add-file");
	const workTitle = document.getElementById("input-title");
	const categoryDropdown = document.getElementById("category-dropdown");
	const submitWorkButton = document.getElementById("submit-add-work");

	if (
		!addWorkImg.files[0] ||
		!workTitle ||
		workTitle.value === "" ||
		!categoryDropdown.value ||
		categoryDropdown.value === "default"
	) {
		submitWorkButton.disabled = true;
	} else {
		submitWorkButton.disabled = false;
	}
	formErrors();
}

/*
 * Sets up the form submission for adding a new work.
 * Handles file preview, form validation, and API request to create a new work.
 * Shows success/error messages and refreshes displays after successful addition.
 */
export async function addWork() {
	const token = await getToken();
	const addWorkImg = document.getElementById("add-file");
	const workTitle = document.getElementById("input-title");
	const categoryDropdown = document.getElementById("category-dropdown");
	const formAddWorkEl = document.getElementById("form-addWork");
	const divAddWork = document.getElementById("input-add-work");

	const previewContainer = document.getElementById("preview-container");
	const previewImage = document.getElementById("preview-image");

	checkFormValidity();

	addWorkImg.addEventListener("change", (event) => {
		event.preventDefault();

		if (addWorkImg.files[0] && addWorkImg.files) {
			if (!formErrors()) {
				return;
			}

			const imgError = document.getElementById("img-error");
			if (imgError) {
				imgError.remove();
			}

			const reader = new FileReader();
			reader.onload = function (e) {
				previewImage.src = e.target.result;
				previewContainer.style.display = "flex";
				divAddWork.style.display = "none";
			};

			reader.readAsDataURL(addWorkImg.files[0]);
		} else {
			formErrors();
		}
		setTimeout(() => {
			checkFormValidity();
		}, 100);
	});

	const removePreviewIcon = document.getElementById("remove-preview-icon");
	if (removePreviewIcon) {
		removePreviewIcon.addEventListener("click", (event) => {
			event.preventDefault();
			addWorkImg.value = "";
			previewImage.src = "";
			previewContainer.style.display = "none";
			divAddWork.style.display = "flex";
			checkFormValidity();
		});
	}

	workTitle.addEventListener("input", () => {
		checkFormValidity();
	});

	categoryDropdown.addEventListener("change", () => {
		checkFormValidity();
	});

	formAddWorkEl.addEventListener("submit", async (event) => {
		event.preventDefault();

		const formData = new FormData();
		formData.append("image", addWorkImg.files[0]);
		formData.append("title", workTitle.value);
		formData.append("category", categoryDropdown.value);

		try {
			const response = await fetch(`${BASE_API_URL}works/`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},

				body: formData,
			});
			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Erreur serveur (${response.status}): ${errorText}`);
			}

			const successMessage = document.createElement("p");
			successMessage.setAttribute("id", "success-message");
			successMessage.textContent = "Projet ajouté avec succès";
			successMessage.style.color = "green";
			formAddWorkEl.insertAdjacentElement("afterend", successMessage);
			setTimeout(() => {
				successMessage.remove();
			}, 2000);
			await refreshAllDisplays();

			clearAddWorkForm();
		} catch (error) {
			console.error("Error adding work:", error);
		}
	});
}

/*
 * Resets the add work form to its initial state.
 * Clears all inputs, resets dropdowns, hides preview, and removes error messages.
 */
function clearAddWorkForm() {
	const secondDialog = document.getElementById("modal-2");
	const submitWorkButton = document.getElementById("submit-add-work");
	const clearCategoryButton = document.getElementById("remove-option-icon");
	const addWorkImg = document.getElementById("add-file");
	const formAddWorkEl = document.getElementById("form-addWork");
	const categoryDropdown = document.getElementById("category-dropdown");
	const previewContainer = document.getElementById("preview-container");
	const previewImage = document.getElementById("preview-image");
	const divAddWork = document.getElementById("input-add-work");
	if (secondDialog) {
		submitWorkButton.disabled = true;
		addWorkImg.value = "";
		formAddWorkEl.reset();
		categoryDropdown.selectedIndex = 0;
		clearCategoryButton.style.display = "none";

		const existingErrors = document.querySelectorAll("[id$='-error']");
		existingErrors.forEach((error) => error.remove());

		if (previewContainer && divAddWork) {
			previewImage.src = "";
			previewContainer.style.display = "none";
			divAddWork.style.display = "flex";
		}
	}
}

/*
 * Hides a modal by adding the appropriate CSS class and updating ARIA attributes.
 * @param {string} modalId - The ID of the modal to hide (default: "modal-content")
 */
function hideModal(modalId = "modal-content") {
	const modalAside = document.getElementById(modalId);
	if (modalAside) {
		if (!modalAside.classList.contains("modalInvisible")) {
			modalAside.classList.remove("modalVisible");
			modalAside.classList.add("modalInvisible");
			modalAside.setAttribute("aria-modal", "false");
			modalAside.inert = true;
		}
	}
}

/*
 * Shows a modal by removing the invisible class and updating ARIA attributes for accessibility.
 * @param {string} modalId - The ID of the modal to show (default: "modal-content")
 */
function showModal(modalId = "modal-content") {
	const modalAside = document.getElementById(modalId);
	if (modalAside) {
		modalAside.classList.remove("modalInvisible");
		modalAside.classList.add("modalVisible");
		modalAside.setAttribute("aria-modal", "true");
		modalAside.inert = false;
	}
}

/*
 * Handles transition from modal 2 back to modal 1.
 * Clears form inputs, updates modal visibility, and reattaches event listeners.
 */
async function returnToModal1() {
	clearAddWorkForm();
	hideModal("modal-2");
	showModal("modal-content");
	attachModalListeners("modal-content");
}

/*
 * Closes modal 1 by hiding it and updating its ARIA attributes.
 */
async function closeModal() {
	hideModal("modal-content");
}

/*
 * Closes modal 2, clears the form inputs, and updates ARIA attributes.
 */
async function closeModal2() {
	clearAddWorkForm();
	hideModal("modal-2");
}
