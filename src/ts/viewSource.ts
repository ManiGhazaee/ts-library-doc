export const onClickFunction: string = `(function onClick(elem) {
    const nextElem = elem.nextElementSibling;
    if (nextElem.classList.contains("src-hidden")) {
        nextElem.classList.remove("src-hidden");
        nextElem.classList.add("src-visible");
    } else {
        nextElem.classList.remove("src-visible");
        nextElem.classList.add("src-hidden");
    }
})(this)`;
