export function html(htmlString: string) {
    const fragment = document.createDocumentFragment();
    const container = document.createElement("div");
    container.innerHTML = htmlString;
    while (container.firstChild) {
        fragment.appendChild(container.firstChild);
    }
    return fragment;
}

export function isVisible(elem: HTMLElement) {
    const rect = elem.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.bottom <=
            (window.innerHeight || document.documentElement.clientHeight)
    );
}
