export function html(htmlString: string) {
    const fragment = document.createDocumentFragment();
    const container = document.createElement("div");
    container.innerHTML = htmlString;
    while (container.firstChild) {
        fragment.appendChild(container.firstChild);
    }
    return fragment;
}
