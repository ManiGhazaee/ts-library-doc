import { FILES } from "../constants/fileNames";

async function fetchFiles(
    username: string,
    repo: string,
    path: string
): Promise<string> {
    const url = `https://api.github.com/repos/${username}/${repo}/contents/${path}`;
    const response = await fetch(url);
    const data = await response.json();
    const content = atob(data.content);
    return content;
}

export async function getSourceContent() {
    let CONTENTS: { [key: string]: string } = {};

    for (let key in FILES) {
        const content = await fetchFiles(
            "ManiGhazaee",
            "ts-library",
            `src/ts/${FILES[key][1]}`
        );
        CONTENTS[key] = content;
    }

    return CONTENTS;
}
