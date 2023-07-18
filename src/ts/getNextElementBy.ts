export function getNextElementBy(
    element: HTMLElement,
    by: "tag" | "id" | "class",
    target: string
) {
    let tempElem = element;
    if (by === "tag") {
        for (let i = 0; i < 1000; i++) {
            if (tempElem.nextElementSibling !== null) {
                tempElem = tempElem.nextElementSibling as HTMLElement;
                if (tempElem.tagName === target.toUpperCase()) {
                    return tempElem;
                } else {
                    continue;
                }
            } else {
                return undefined;
            }
        }
    } else if (by === "id") {
        for (let i = 0; i < 1000; i++) {
            if (tempElem.nextElementSibling !== null) {
                tempElem = tempElem.nextElementSibling as HTMLElement;
                if (tempElem.id === target) {
                    return tempElem;
                } else {
                    continue;
                }
            } else {
                return undefined;
            }
        }
    } else if (by === "class") {
        for (let i = 0; i < 1000; i++) {
            if (tempElem.nextElementSibling !== null) {
                tempElem = tempElem.nextElementSibling as HTMLElement;
                if (tempElem.classList.contains(target)) {
                    return tempElem;
                } else {
                    continue;
                }
            } else {
                return undefined;
            }
        }
    }
}
