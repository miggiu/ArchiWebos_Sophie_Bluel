import { BASE_API_URL } from "./variables.js";
import { getWorksAndReturn, getCategoriesAndReturn } from "./api.js";
import { getToken } from "../pages/ifLogged.js";
import { fetchAndDisplayWorks } from "../pages/index.js";

export {
	initializeModals,
	prepareModalContent,
	createSecondModalContent,
	refreshAllDisplays,
	transitionFromModal2ToModal1,
	closeModal,
	closeModal2,
	returnToModal1,
};

let originalModalTemplate = null;

async function prepareModalContent() {
	await fetchAndDisplayWorksInModal();
	await integrateAddWorkButton();
	const modalAside = document.getElementById("modal-content");
	if (modalAside && !originalModalTemplate) {
		originalModalTemplate = modalAside.innerHTML;
	}
	attachModalListeners("modal-content");
}

function initializeModals() {
	prepareModalContent();

	const modalButton = document.getElementById("modifyProjects");
	if (modalButton) {
		modalButton.addEventListener("click", async () => {
			const modalAside = document.getElementById("modal-content");
			if (modalAside) {
				if (!modalAside.innerHTML) {
					modalAside.innerHTML = originalModalTemplate;
					await fetchAndDisplayWorksInModal();
					attachModalListeners("modal-content");
				} else {
					prepareModalContent();
				}
			}
			showModal("modal-content");
		});
	}
	attachModalListeners("modal-content");
}

async function refreshAllDisplays() {
	const allWorks = await getWorksAndReturn();
	await fetchAndDisplayWorksInModal();
	await fetchAndDisplayWorks(allWorks);
	attachModalListeners();
}

async function fetchAndDisplayWorksInModal() {
	const workSectionEl = document.getElementById("api-works");

	if (!workSectionEl) {
		console.error("Element with ID api-works not found");
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

function attachModalListeners(modalId = "modal-content") {
	const modalAside = document.getElementById(modalId);
	if (!modalAside) return;

	if (modalId === "modal-content") {
		const addNewWorkButton = document.getElementById("add-new-work");
		if (addNewWorkButton) {
			const newAddButton = addNewWorkButton.cloneNode(true);
			addNewWorkButton.parentNode.replaceChild(newAddButton, addNewWorkButton);
			newAddButton.addEventListener("click", async () => {
				await createSecondModalContent();
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

async function createSecondModalContent() {
	const modalAside = document.getElementById("modal-content");
	if (modalAside) {
		modalAside.innerHTML = "";
		/* base structure */
		modalAside.setAttribute("id", "modal-2");
		modalAside.setAttribute("aria-hidden", "false");
		modalAside.setAttribute("aria-modal", "true");
		modalAside.setAttribute("aria-labelledby", "modalTitleAddPhoto");
		modalAside.setAttribute("role", "alertdialog");
		modalAside.classList.add("modalTemplate");
		modalAside.classList.add("modalVisible");
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
			console.log("category loaded", categories.length);
		} catch (error) {
			console.error("error loading categories", error.message);
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

		categoryDropdown.addEventListener("change", () => {
			if (
				categoryDropdown.value !== "" &&
				categoryDropdown.value !== "default"
			) {
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
	} else {
		console.log("the clicked element was not found");
	}
}

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

		console.log("delete response:", response);
		if (response.ok) {
			console.log("work deleted successfully", workId);
			await refreshAllDisplays();

			console.log("delete status:", response.status);
		} else {
			const errorText = await response.text();
			throw new Error(`Erreur serveur (${response.status}): ${errorText}`);
		}
	} catch (error) {
		console.error("there was an issue with the delete request:", error.message);
	}
}

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

	let isSubmitting = false;
	formAddWorkEl.addEventListener("submit", async (event) => {
		event.preventDefault();

		const formData = new FormData();
		formData.append("image", addWorkImg.files[0]);
		formData.append("title", workTitle.value);
		formData.append("category", categoryDropdown.value);

		console.log("Form data contains:");
		for (const [key, value] of formData.entries()) {
			console.log(`${key}: ${value instanceof File ? value.name : value}`);
		}

		if (isSubmitting) return;
		isSubmitting = true;

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

			const responseData = await response.json();
			console.log("Work added successfully:", responseData);

			const successMessage = document.createElement("p");
			successMessage.setAttribute("id", "success-message");
			successMessage.textContent = "Projet ajouté avec succès";
			successMessage.style.color = "green";
			formAddWorkEl.insertAdjacentElement("afterend", successMessage);
			setTimeout(() => {
				successMessage.remove();
			}, 2000);
			await refreshAllDisplays();

			const modalAside = document.getElementById("modal-2");
			const clearCategoryButton = document.getElementById("remove-option-icon");
			if (modalAside) {
				addWorkImg.value = "";
				formAddWorkEl.reset();
				categoryDropdown.selectedIndex = 0;
				clearCategoryButton.style.display = "none";

				const existingErrors = document.querySelectorAll("[id$='-error']");
				existingErrors.forEach((error) => error.remove());

				if (previewContainer && divAddWork) {
					previewContainer.style.display = "none";
					divAddWork.style.display = "flex";
				}
			}
		} catch (error) {
			console.error("Error adding work:", error);
		}
	});
}

function hideModal(modalId = "modal-content") {
	const modalAside = document.getElementById(modalId);
	if (modalAside) {
		if (!modalAside.classList.contains("modalInvisible")) {
			modalAside.classList.remove("modalVisible");
			modalAside.classList.add("modalInvisible");
			modalAside.setAttribute("aria-hidden", "true");
			modalAside.setAttribute("aria-modal", "false");
		}
	}
}

function showModal(modalId = "modal-content") {
	const modalAside = document.getElementById(modalId);
	if (modalAside) {
		modalAside.classList.remove("modalInvisible");
		modalAside.classList.add("modalVisible");
		modalAside.setAttribute("aria-hidden", "false");
		modalAside.setAttribute("aria-modal", "true");
	}
}

async function transitionFromModal2ToModal1(shouldHideModal) {
	const modalAside = document.getElementById("modal-2");
	/* if (modalAside) {
		if (shouldHideModal) {
			hideModal("modal-2");
		}
		modalAside.setAttribute("id", "modal-content");

		if (originalModalTemplate) {
			modalAside.innerHTML = originalModalTemplate;
			await fetchAndDisplayWorksInModal();
			attachModalListeners("modal-content");
		} else {
			modalAside.innerHTML = "";
			prepareModalContent();
		}
		if (!shouldHideModal) {
			const modal = document.getElementById("modal-content");
			if (modal) {
				modal.classList.remove("modalInvisible");
				modal.classList.add("modalVisible");
				modal.setAttribute("aria-hidden", "false");
				modal.setAttribute("aria-modal", "true");
			}
		}
	} */
	if (!modalAside) return;
	if (shouldHideModal) {
		hideModal("modal-2");

		await new Promise((resolve) => setTimeout(resolve, 300));
	}
	modalAside.setAttribute("id", "modal-content");

	if (originalModalTemplate) {
		modalAside.innerHTML = originalModalTemplate;
		await fetchAndDisplayWorksInModal();
		attachModalListeners("modal-content");
	} else {
		modalAside.innerHTML = "";
		await fetchAndDisplayWorksInModal();
		await integrateAddWorkButton();
		attachModalListeners("modal-content");

		originalModalTemplate = modalAside.innerHTML;
	}

	if (!shouldHideModal) {
		showModal("modal-content");
	}
}

async function returnToModal1() {
	await transitionFromModal2ToModal1(false);
}

async function closeModal() {
	/* const modalAside = document.getElementById("modal-content");
	if (modalAside) {
		hideModal("modal-content");
		setTimeout(() => {
			if (originalModalTemplate && !modalAside.innerHTML) {
				modalAside.innerHTML = originalModalTemplate;
				fetchAndDisplayWorksInModal();
				attachModalListeners();
			}
		}, 300);
	} */
	hideModal("modal-content");
}

async function closeModal2() {
	await transitionFromModal2ToModal1(true);
}
