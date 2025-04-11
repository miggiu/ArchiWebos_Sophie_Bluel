/**
 * Highlights the current page in the navigation menu.
 * Adds the 'current' class to any navigation link that matches the current URL.
 * Used across pages to provide visual feedback about the active page.
 */
export function ifCurrent() {
	document.querySelectorAll("a").forEach((link) => {
		if (link.href === window.location.href) {
			link.classList.add("current");
		}
	});
}
