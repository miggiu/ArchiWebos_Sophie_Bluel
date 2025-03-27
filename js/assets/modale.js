import { BASE_API_URL } from "./variables.js";
import { getWorksAndReturn, getCategoriesAndReturn } from "./api.js";
import { getToken } from "../pages/ifLogged.js";
import { fetchAndDisplayWorks } from "../pages/index.js";

let originalModalTemplate = null;

async function refreshAllDisplays() {
	const allWorks = await getWorksAndReturn();
	await fetchAndDisplayWorksInModal();
	await fetchAndDisplayWorks(allWorks);
}

export async function showModal() {
	const modalOnClick = document.getElementById("modifyProjects");
	modalOnClick.addEventListener("click", () => {
		const modalAside = document.getElementById("modal-content");
		if (modalAside) {
			modalAside.setAttribute("aria-hidden", "false");
			modalAside.setAttribute("aria-modal", "true");
			modalAside.classList.remove("modalInvisible");
			modalAside.classList.add("modalVisible");
		} else {
			console.log("clicked element not found");
		}
	});
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

export async function displayFirstModalContent() {
	fetchAndDisplayWorksInModal();
	integrateAddWorkButton();
	if (!originalModalTemplate) {
		const modalAside = document.getElementById("modal-content");
		if (modalAside) {
			originalModalTemplate = modalAside.innerHTML;
		}
	}
}

export async function showModal2() {
	const displayModal2 = document.getElementById("add-new-work");
	displayModal2.addEventListener("click", async () => {
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
			const deleteIconDiv2 = document.createElement("div");
			deleteIconDiv2.setAttribute("id", "delete-icon-div");
			const deleteIcon2 = document.createElement("i");
			deleteIcon2.setAttribute("id", "close-mark2");
			deleteIcon2.classList.add("fa-solid");
			deleteIcon2.classList.add("fa-xmark");
			deleteIcon2.classList.add("fa-lg");
			const returnIconDiv = document.createElement("div");
			returnIconDiv.setAttribute("id", "return-icon-div");
			const returnIcon = document.createElement("i");
			returnIcon.setAttribute("id", "return-icon");
			returnIcon.classList.add("fa-solid");
			returnIcon.classList.add("fa-arrow-left");
			returnIcon.classList.add("fa-lg");
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
			divIconsModal2.appendChild(deleteIconDiv2);
			deleteIconDiv2.appendChild(deleteIcon2);

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
			});
			await addWork();
			returnToModal1();
			closeModal2();
		} else {
			console.log("the clicked element was not found");
		}
	});
}

export async function displaySecondModalContent() {
	await showModal2();
}

export async function deleteWork() {
	const works = await getWorksAndReturn();
	const token = await getToken();
	works.forEach((work) => {
		const deleteIcon = document.getElementById(`icon-${work.id}`);
		if (deleteIcon) {
			deleteIcon.addEventListener("click", (event) => {
				event.preventDefault();
				const url = `${BASE_API_URL}works/${work.id}`;

				const options = {
					method: "DELETE",
					headers: {
						/* prettier-ignore */
						"Authorization": `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				};
				fetch(url, options)
					.then(async (response) => {
						if (response.ok) {
							console.log("work deleted successfully", work.id);

							await refreshAllDisplays();

							console.log("delete status:", response.status);
						}
					})
					.catch((error) => {
						console.error(
							"there was an issue with the delete request:",
							error.message
						);
					});
			});
		} else {
			console.error(`Element with ID icon-${work.id} not found`);
		}
	});
}

export async function addWork() {
	const token = await getToken();
	const addWorkImg = document.getElementById("add-file");
	const categoryDropdown = document.getElementById("category-dropdown");
	const formAddWorkEl = document.getElementById("form-addWork");
	const previewContainer = document.getElementById("preview-container");
	const divAddWork = document.getElementById("input-add-work");
	const previewImage = document.getElementById("preview-image");

	if (
		!addWorkImg ||
		!formAddWorkEl ||
		!categoryDropdown ||
		!formAddWorkEl ||
		!previewContainer ||
		!divAddWork ||
		!previewImage ||
		!token
	) {
		console.error("One or more elements not found");
		console.log(
			"addWorkImg:",
			addWorkImg,
			"formAddWorkEl:",
			formAddWorkEl,
			"categoryDropdown:",
			categoryDropdown,
			"previewContainer:",
			previewContainer,
			"divAddWork:",
			divAddWork,
			"previewImage:",
			previewImage,
			"token:",
			token
		);
		return;
	}

	addWorkImg.addEventListener("change", (event) => {
		event.preventDefault();
		const existingImgError = document.getElementById("img-error");
		if (existingImgError) {
			existingImgError.remove();
		}
		if (addWorkImg.files && addWorkImg.files[0]) {
			const fileType = addWorkImg.files[0].type;
			if (
				fileType !== "image/jpeg" &&
				fileType !== "image/png" &&
				fileType !== "image/jpg"
			) {
				console.error("Invalid file type");
				const imgError = document.createElement("p");
				imgError.setAttribute("id", "img-error");
				imgError.textContent = "Veuillez sélectionner une image valide";
				imgError.style.color = "red";
				divAddWork.appendChild(imgError);
				return;
			}

			const maxSize = 4 * 1024 * 1024; // 4MB
			if (addWorkImg.files[0].size > maxSize) {
				console.error("File size exceeds 4MB");
				const imgError = document.createElement("p");
				imgError.setAttribute("id", "img-error");
				imgError.textContent =
					"Veuillez sélectionner une image de moins de 4Mo";
				imgError.style.color = "red";
				divAddWork.appendChild(imgError);
				return;
			}

			const reader = new FileReader();

			reader.onload = function (e) {
				previewImage.src = e.target.result;
				previewContainer.style.display = "flex";
				divAddWork.style.display = "none";
			};

			reader.readAsDataURL(addWorkImg.files[0]);
		} else {
			console.error("No file selected");
			const imgError = document.createElement("p");
			imgError.setAttribute("id", "img-error");
			imgError.textContent = "Veuillez sélectionner une image";
			imgError.style.color = "red";
			divAddWork.appendChild(imgError);
		}
	});
	const removePreviewIcon = document.getElementById("remove-preview-icon");
	if (removePreviewIcon) {
		removePreviewIcon.addEventListener("click", (event) => {
			event.preventDefault();
			addWorkImg.value = "";
			previewImage.src = "";
			previewContainer.style.display = "none";
			divAddWork.style.display = "flex";
		});
	}

	formAddWorkEl.addEventListener("submit", async (event) => {
		event.preventDefault();

		const existingImgError = document.getElementById("img-error");
		const existingCategoryError = document.getElementById("category-error");
		if (existingImgError) existingImgError.remove();
		if (existingCategoryError) existingCategoryError.remove();

		if (!addWorkImg.files || !addWorkImg.files[0]) {
			console.error("No file selected");
			const imgError = document.createElement("p");
			imgError.setAttribute("id", "img-error");
			imgError.textContent = "Veuillez sélectionner une image";
			imgError.style.color = "red";
			divAddWork.appendChild(imgError);
			return;
		}

		const workTitle = document.getElementById("input-title");
		if (workTitle === "") {
			console.error("No category selected");
			const workTitleError = document.createElement("p");
			workTitleError.setAttribute("id", "work-title-error");
			workTitleError.textContent = "Veuillez choisir un titre";
			workTitle.appendChild(workTitleError);
			return;
		}

		if (!categoryDropdown.value || categoryDropdown.value === "default") {
			console.error("No category selected");
			const categoryError = document.createElement("p");
			categoryError.setAttribute("id", "category-error");
			categoryError.textContent = "Veuillez sélectionner une catégorie";

			categoryDropdown.insertAdjacentElement("afterend", categoryError);
			return;
		}

		const formData = new FormData(formAddWorkEl);
		formData.append("image", addWorkImg.files[0]);

		console.log("Form data:", formData);
		console.log("Title:", formData.get("title"));
		console.log("Category ID:", categoryDropdown.value);
		console.log("File:", formData.get("image"));

		try {
			const response = await fetch(`${BASE_API_URL}works/`, {
				method: "POST",
				headers: {
					/* prettier-ignore */
					"Authorization": `Bearer ${token}`,
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
			successMessage.textContent = "Photo ajoutée avec succès";
			successMessage.style.color = "green";
			formAddWorkEl.insertAdjacentElement("afterend", successMessage);
			setTimeout(() => {
				successMessage.remove();
			}, 2000);
			await refreshAllDisplays();

			const modalAside = document.getElementById("modal-2");
			if (modalAside) {
				addWorkImg.value = "";
				formAddWorkEl.reset();
				categoryDropdown.selectedIndex = 0;

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

export async function closeModal() {
	const closeModalButton = document.getElementById("close-mark");
	if (closeModalButton) {
		closeModalButton.addEventListener("click", () => {
			const modalAside = document.getElementById("modal-content");
			if (modalAside) {
				modalAside.classList.remove("modalVisible");
				modalAside.classList.add("modalInvisible");
				modalAside.setAttribute("aria-hidden", "true");
				modalAside.setAttribute("aria-modal", "false");
			}
		});
	}
}

export async function returnToModal1() {
	const returnIcon = document.getElementById("return-icon");
	if (returnIcon) {
		returnIcon.addEventListener("click", async () => {
			const modalAside = document.getElementById("modal-2");
			if (modalAside) {
				modalAside.setAttribute("id", "modal-content");
				if (originalModalTemplate) {
					modalAside.innerHTML = originalModalTemplate;
					await fetchAndDisplayWorksInModal();
					await deleteWork();
				} else {
					modalAside.innerHTML = "";
					await displayFirstModalContent();
				}
				closeModal();
				showModal2();
			} else {
				console.log("error on returning to modal 1");
			}
		});
	}
}

export async function closeModal2() {
	const closeModalButton2 = document.getElementById("close-mark2");
	if (closeModalButton2) {
		closeModalButton2.addEventListener("click", async () => {
			const modalAside = document.getElementById("modal-2");
			if (modalAside) {
				modalAside.setAttribute("id", "modal-content");
				if (originalModalTemplate) {
					modalAside.innerHTML = originalModalTemplate;
					fetchAndDisplayWorksInModal();
					deleteWork();
				} else {
					modalAside.innerHTML = "";
					displayFirstModalContent();
				}
				modalAside.classList.remove("modalVisible");
				modalAside.classList.add("modalInvisible");
				modalAside.setAttribute("aria-hidden", "true");
				modalAside.setAttribute("aria-modal", "false");

				/* reattach event listeners on modal 1 */
				await closeModal();
				await showModal2();
			}
		});
	}
}
