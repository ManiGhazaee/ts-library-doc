import MarkdownIt from "markdown-it";
import { FILES } from "../constants/fileNames";

async function fetchMarkdownFileContent(
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

function convertMarkdownToHtml(markdownContent: string): string {
    const md = new MarkdownIt();
    return md.render(markdownContent);
}

export async function getHtmlContent() {
    let HTML_CONTENTS: { [key: string]: string } = {};
    let promises: Promise<void>[] = [];

    for (let key in FILES) {
        promises.push(
            fetchMarkdownFileContent(
                "ManiGhazaee",
                "ts-library",
                `docs/${FILES[key][0]}`
            )
                .then((markdownContent) => {
                    const htmlContent = convertMarkdownToHtml(markdownContent);
                    HTML_CONTENTS[key] = htmlContent;
                })
                .catch((error) => {
                    console.error(error);
                })
        );
    }

    await Promise.all(promises);

    return HTML_CONTENTS;
}
