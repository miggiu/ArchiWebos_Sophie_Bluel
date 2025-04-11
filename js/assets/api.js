/**
 * Fetches all available categories from the API.
 * Used to populate category filters and dropdown menus.
 * @returns {Promise<Array>} A promise that resolves to an array of category objects
 */
export async function getCategoriesAndReturn() {
	const response = await fetch("http://localhost:5678/api/categories");
	const data = await response.json();
	return data;
}

/**
 * Fetches all works/projects from the API.
 * Used to display projects in the gallery and modals.
 * @returns {Promise<Array>} A promise that resolves to an array of work objects
 */
export async function getWorksAndReturn() {
	const response = await fetch("http://localhost:5678/api/works");
	const data = await response.json();
	return data;
}
