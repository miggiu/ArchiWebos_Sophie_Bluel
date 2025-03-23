import { BASE_API_URL } from "./variables.js";
import { getWorksAndReturn, getCategoriesAndReturn } from "./api.js";
import { getToken } from "../pages/ifLogged.js";

let originalModalTemplate = null;

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
			const categoryDropdown = document.createElement("select");
			categoryDropdown.setAttribute("id", "category-dropdown");
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

			/* input integr new work  */
			modalDiv2.appendChild(sectionFormAddWork);
			sectionFormAddWork.appendChild(divAddWork);
			divAddWork.appendChild(divPhotoIcon);
			divPhotoIcon.appendChild(photoIcon);
			divAddWork.appendChild(inputLabel);
			inputLabel.appendChild(inputFile);
			divAddWork.appendChild(labelP);

			/* form dropdown categories */
			formAddWork.appendChild(inputTitleLabel);
			formAddWork.appendChild(inputTitle);
			formAddWork.appendChild(categoryLabel);
			formAddWork.appendChild(categoryDropdown);
			formAddWork.appendChild(submitAddWork);
			sectionAddWork.appendChild(formAddWork);

			modalDiv2.appendChild(sectionAddWork);

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
	works.forEach((work) => {
		const deleteIcon = document.getElementById(`icon-${work.id}`);
		if (deleteIcon) {
			deleteIcon.addEventListener("click", () => {
				console.log(deleteIcon);

				const url = `${BASE_API_URL}works/${work.id}`;
				const options = {
					method: "DELETE",
					headers: {
						/* prettier-ignore */
						"Authorization": `Bearer ${tokenFound}`,
						"Content-Type": "application/json",
					},
				};
				fetch(url, options)
					.then((response) => {
						if (response.status === 200 || response.status === 204) {
							console.log("work deleted successfully", work.id);
							const deletedWork = document.getElementById(`work-${work.id}`);
							deletedWork.remove();
							fetchAndDisplayWorksInModal();
							fetchAndDisplayWorks();
						} else {
							console.log("delete not permitted - status", response.status);
							throw new Error("delete not permitted");
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
