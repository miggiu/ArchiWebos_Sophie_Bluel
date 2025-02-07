export function ifCurrent() {
document.querySelectorAll('a').forEach(link => {
    if (link.href === window.location.href) {
        link.classList.add('current');
    }
})
}


