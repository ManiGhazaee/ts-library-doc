import MarkdownIt from "markdown-it";
import { MD_FILES } from "../constants/mdFiles";

async function fetchMarkdownFileContent(
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

function convertMarkdownToHtml(markdownContent: string): string {
    const md = new MarkdownIt();
    return md.render(markdownContent);
}

export async function getHtmlContent() {
    let HTML_CONTENTS: string[] = [];

    for (let i = 0; i < MD_FILES.length; i++) {
        const markdownContent = await fetchMarkdownFileContent(
            "ManiGhazaee",
            "ts-library",
            `docs/${MD_FILES[i]}`
        );
        const htmlContent = convertMarkdownToHtml(markdownContent);
        HTML_CONTENTS.push(htmlContent);
    }

    return HTML_CONTENTS;

    // write HTML content to a file
    // fs.writeFileSync('path/to/output.html', htmlContent);

    // or send HTML content to your other site using HTTP request
    // ...
}