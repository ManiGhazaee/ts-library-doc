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
            if (!/^[a-z0-9$_]+$/i.test(lastSplitedElem[i])) {
                return lastSplitedElem.slice(0, i);
            }
        }
    } else {
        for (let i = 0; i < string.length; i++) {
            if (!/^[a-z0-9$_]+$/i.test(string[i])) {
                return string.slice(0, i);
            }
        }
    }
}

/**
 * Removes one or more classes from one or more elements in the DOM.
 *
 * @example
 *
 * // Remove class "example" from all elements with class "container"
 * const containers = document.querySelectorAll('.container');
 * rmClasses(containers, 'example');
 *
 * // Remove classes "class1" and "class2" from a single element
 * const elem = document.querySelector('#my-element');
 * rmClasses(elem, ['class1', 'class2']);
 */
export function rmClasses(
    elements: Array<Element> | Element,
    classesToRemove: string | string[]
): void {
    const classes = Array.isArray(classesToRemove)
        ? classesToRemove
        : [classesToRemove];
    const elems = Array.isArray(elements) ? elements : [elements];

    for (let i = 0; i < elems.length; i++) {
        for (let j = 0; j < classes.length; j++) {
            if (elems[i].classList.contains(classes[j])) {
                elems[i].classList.remove(classes[j]);
            }
        }
    }
}

/**
 * Adds one or more classes to one or more elements in the DOM.
 *
 * @example
 *
 * // Add class "example" to all elements with class "container"
 * const containers = document.querySelectorAll('.container');
 * addClasses(containers, 'example');
 *
 * // Add classes "class1" and "class2" to a single element
 * const elem = document.querySelector('#my-element');
 * addClasses(elem, ['class1', 'class2']);
 */
export function addClasses(
    elements: Array<Element> | Element,
    classesToAdd: string | string[]
) {
    const classes = Array.isArray(classesToAdd) ? classesToAdd : [classesToAdd];
    const elems = Array.isArray(elements) ? elements : [elements];

    for (let i = 0; i < elems.length; i++) {
        for (let j = 0; j < classes.length; j++) {
            elems[i].classList.add(classes[j]);
        }
    }
}

/**
 * removes class of a given array of HTMLElements or one HTMLElement.
 * and adds class to every HTMLElement.
 */
export function switchClass(
    elements: Array<HTMLElement> | HTMLElement,
    classToRemove: string,
    classToAdd: string
): void {
    const elems = Array.isArray(elements) ? elements : [elements];

    for (let i = 0; i < elems.length; i++) {
        if (elems[i].classList.contains(classToRemove)) {
            elems[i].classList.remove(classToRemove);
        }
        elems[i].classList.add(classToAdd);
    }
}

/**
 * checks if an element has a class.
 */
export function hasClass(elements: HTMLElement, classNmaes: string): boolean;
export function hasClass(
    elements: HTMLElement[],
    classNmaes: string
): boolean[];
export function hasClass(
    elements: HTMLElement,
    classNmaes: string[]
): boolean[];
export function hasClass(
    elements: HTMLElement[],
    classNmaes: string[]
): boolean[][];
export function hasClass(
    elements: HTMLElement[] | HTMLElement,
    classNames: string[] | string
): boolean | boolean[] | boolean[][] {
    const elems = Array.isArray(elements) ? elements : [elements];
    const classNameArr = Array.isArray(classNames) ? classNames : [classNames];

    let result: boolean[][] = [];

    for (let i = 0; i < elems.length; i++) {
        let arr = [];
        for (let j = 0; j < classNameArr.length; j++) {
            let bool: boolean;
            if (elems[i].classList)
                bool = elems[i].classList.contains(classNameArr[j]);
            else
                bool = new RegExp(
                    "(^| )" + classNameArr[j] + "( |$)",
                    "gi"
                ).test(elems[i].className);

            arr.push(bool);
        }
        result.push(arr);
    }
    if (result.length === 1) {
        return result[0];
    } else if (result[0].length === 1) {
        return result.flat();
    } else return result;
}
