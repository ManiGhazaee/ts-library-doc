import { FILES } from "../constants/fileNames";

async function fetchFiles(
    username: string,
    repo: string,
    path: string
): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        try {
            const url = `https://api.github.com/repos/${username}/${repo}/contents/${path}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch content from ${url}: ${response.status} - ${response.statusText}`
                );
            }

            const data = await response.json();
            const content = atob(data.content);
            resolve(content);
        } catch (error) {
            reject(error);
        }
    });
}

export async function getSourceContent() {
    let CONTENTS: { [key: string]: string } = {};
    let promises: Promise<void>[] = [];

    for (let key in FILES) {
        promises.push(
            fetchFiles("ManiGhazaee", "ts-library", `src/ts/${FILES[key][1]}`)
                .then((content) => {
                    CONTENTS[key] = content;
                })
                .catch((error) => {
                    console.error(error);
                })
        );
    }

    await Promise.all(promises);

    return CONTENTS;
}
