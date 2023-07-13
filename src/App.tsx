import React, { useEffect } from "react";
import logo from "./logo.svg";
import { getHtmlContent } from "./ts/getMarkdowns";
import { useState, useRef } from "react";
import { MD_FILES } from "./constants/mdFiles";
import { stringify } from "querystring";
import { runInThisContext } from "vm";
import { isVisible } from "./ts/utils";

function App() {
    const [htmlContent, setHtmlContent] = useState<{ [key: string]: string }>();
    const [htmlContentInHtml, setHtmlContentInHtml] = useState<{
        [key: string]: HTMLDivElement;
    }>();
    const [currentDoc, setCurrentDoc] = useState<string>("Array");
    const [onThisPage, setOnThisPage] = useState<{ [key: string]: string[] }>();
    const [currentSection, setCurrentSection] = useState<string>();
    const docRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let contentInHtml: { [key: string]: HTMLDivElement } = {};
        async function getHtml() {
            const content = await getHtmlContent();

            for (const key in content) {
                let tempNode = document.createElement("div");
                tempNode.insertAdjacentHTML("afterbegin", content[key]);

                contentInHtml[key] = tempNode;
            }

            const OTP: { [key: string]: string[] } = {};

            for (const key in contentInHtml) {
                const div = contentInHtml[key];
                const h3s = div.querySelectorAll("h3");
                let OTPItems: string[] = [];

                h3s.forEach((e) => {
                    const inner = e.firstElementChild?.innerHTML;
                    const firstWord = inner?.match(/^\w+/)?.[0];

                    if (firstWord) {
                        e.id = firstWord;
                        e.classList.add("heading");

                        OTPItems.push(firstWord);
                    }
                });

                OTP[key] = OTPItems;
                console.log(OTP);
            }

            let contentObject: { [key: string]: string } = {};
            for (const key in contentInHtml) {
                contentObject[key] = contentInHtml[key].innerHTML;
            }

            setHtmlContent(contentObject);
            setHtmlContentInHtml(contentInHtml);
            setOnThisPage(OTP);
        }
        getHtml();
    }, []);

    const handleScroll = () => {
        const sections = document.querySelectorAll(
            ".heading"
        ) as NodeListOf<HTMLElement>;

        const sectionsArray = Array.from(sections);

        for (let i = 0; i < sectionsArray.length; i++) {
            if (isVisible(sectionsArray[i])) {
                setCurrentSection(sectionsArray[i].id);
                return;
            }
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    if (htmlContent == undefined || Object.keys(htmlContent).length === 0) {
        return <div>Loading...</div>;
    }

    const handleOnClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLDivElement;
        setCurrentDoc(target.id);
    };

    return (
        <>
            {Object.entries(MD_FILES).length !== 0 ? (
                <aside className="block fixed left-0 top-0 bottom-0 h-[100%] w-[200px] px-[32px] py-[64px] bg-slate-300 overflow-y-auto">
                    {Object.entries(MD_FILES).map((entry) => (
                        <div className="" id={entry[0]} onClick={handleOnClick}>
                            {entry[0]}
                        </div>
                    ))}
                </aside>
            ) : (
                <div>MD_FILES Not Found</div>
            )}
            {Object.keys(htmlContent).length !== 0 ? (
                <div className="doc-wrapper relative w-[calc(100%-560px)] left-[264px] mt-[64px]">
                    <div
                        ref={docRef}
                        dangerouslySetInnerHTML={{
                            __html: htmlContent[currentDoc],
                        }}
                    ></div>
                </div>
            ) : (
                <div>MD_FILES Not Found</div>
            )}
            {onThisPage != undefined && Object.keys(onThisPage).length !== 0 ? (
                <div className="fixed top-[64px] right-0 w-[240px] text-[14px] bg-slate-400">
                    <div>OnThisPage</div>
                    {onThisPage?.[currentDoc]?.map((elem) => (
                        <a
                            className={`block ${
                                currentSection === elem ? "active" : ""
                            }`}
                            href={"#" + elem}
                        >
                            {elem}
                        </a>
                    ))}
                </div>
            ) : (
                <div>Error</div>
            )}
        </>
    );
}

export default App;
