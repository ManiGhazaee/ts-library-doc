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

export function getNameOfFunction(string: string) {
    let hasThreeDot: boolean = /(...)/.test(string) ? true : false;
    if (hasThreeDot) {
        string = string.split("...")[0];
    }
    let hasDot: boolean = /./.test(string) ? true : false;
    if (hasDot) {
        let splited = string.split(".");
        let lastSplitedElem = splited[splited.length - 1];
        for (let i = 0; i < lastSplitedElem.length; i++) {
            if (!/^[a-z0-9]+$/i.test(lastSplitedElem[i])) {
                return lastSplitedElem.slice(0, i);
            }
        }
    } else {
        for (let i = 0; i < string.length; i++) {
            if (!/^[a-z0-9]+$/i.test(string[i])) {
                return string.slice(0, i);
            }
        }
    }
}
