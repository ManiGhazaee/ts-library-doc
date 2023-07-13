import React, { useEffect } from "react";
import logo from "./logo.svg";
import { getHtmlContent } from "./ts/getMarkdowns";
import { useState, useRef } from "react";
import { MD_FILES } from "./constants/mdFiles";
import { stringify } from "querystring";
import { runInThisContext } from "vm";
import { getNameOfFunction, isVisible } from "./ts/utils";
import { DARK_MODE_COLORS, LIGHT_MODE_COLORS } from "./ts/darkmode";
import DarkmodeButton from "./components/DarkmodeButton";
import GithubIcon from "./components/GithubIcon";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
    const [htmlContent, setHtmlContent] = useState<{ [key: string]: string }>();
    const [htmlContentInHtml, setHtmlContentInHtml] = useState<{
        [key: string]: HTMLDivElement;
    }>();
    const [currentDoc, setCurrentDoc] = useState<string>("Array");
    const [onThisPage, setOnThisPage] = useState<{ [key: string]: string[] }>();
    const [currentSection, setCurrentSection] = useState<string>();
    const docRef = useRef<HTMLDivElement>(null);

    const [darkModeState, setdarkModeState] = useState<string>();

    const darkModeLS = localStorage.getItem("darkMode");

    useEffect(() => {
        setdarkModeState(darkModeLS || "on");
    }, [darkModeLS]);

    const handleDarkModeOnClick = () => {
        if (darkModeState === "on") {
            setdarkModeState("off");
            localStorage.setItem("darkMode", "off");
        } else {
            setdarkModeState("on");
            localStorage.setItem("darkMode", "on");
        }
    };

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
                    // const firstWord = inner?.match(/^\w+/)?.[0];
                    const firstWord = inner ? getNameOfFunction(inner) : "";

                    if (firstWord) {
                        e.id = firstWord;
                        e.classList.add("heading");

                        OTPItems.push(firstWord);
                    }
                });

                OTP[key] = OTPItems;
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

    // if (htmlContent == undefined || Object.keys(htmlContent).length === 0) {
    //     return <div>Loading...</div>;
    // }

    const handleOnClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLDivElement;
        setCurrentDoc(target.id);
    };

    return (
        <>
            <style>
                {darkModeState === "on" ? DARK_MODE_COLORS : LIGHT_MODE_COLORS}
            </style>
            <div className="absolute top-[14px] left-[32px] z-50">
                <span className="text-primary font-extrabold text-[22px]">TS</span>
                <span className="text-text font-extrabold text-[22px]"> Library</span>
            </div>
            <div className="fixed p-[20px] top-0 right-[20px] w-fit h-[20px]">
                <div
                    onClick={handleDarkModeOnClick}
                    className="inline-block w-fit h-fit mr-[16px]"
                >
                    <DarkmodeButton
                        state={darkModeState === "on" ? true : false}
                    />
                </div>
                <div className="inline-block w-fit h-fit">
                    <GithubIcon />
                </div>
            </div>
            {Object.entries(MD_FILES).length !== 0 ? (
                <aside className="block fixed left-0 top-0 bottom-0 h-[100%] w-[200px] px-[32px] py-[64px] bg-bg_2 font-semibold text-text_3 text-[14px] overflow-y-auto">
                    {Object.entries(MD_FILES).map((entry) => (
                        <div
                            className={`mt-[10px] active:text-text ${
                                entry[0] === currentDoc ? "active-topic" : ""
                            } hover:cursor-pointer hover:text-text_2`}
                            id={entry[0]}
                            onClick={handleOnClick}
                        >
                            {entry[0]}
                        </div>
                    ))}
                </aside>
            ) : (
                <div>MD_FILES Not Found</div>
            )}
            {htmlContent !== undefined &&
            Object.keys(htmlContent).length !== 0 ? (
                <div className="doc-wrapper relative w-[calc(100%-560px)] left-[264px] mt-[64px]">
                    <div
                        ref={docRef}
                        dangerouslySetInnerHTML={{
                            __html: htmlContent[currentDoc],
                        }}
                    ></div>
                </div>
            ) : (
                <LoadingSpinner />
            )}
            {onThisPage != undefined && Object.keys(onThisPage).length !== 0 ? (
                <div className="fixed top-[78px] right-0 w-[240px] text-[14px] font-semibold text-text_2">
                    <div className="mb-[20px] font-bold">On this page</div>
                    {onThisPage?.[currentDoc]?.map((elem) => (
                        <a
                            className={`block ${
                                currentSection === elem ? "active-section" : ""
                            } mb-[10px] text-text_3`}
                            href={"#" + elem}
                        >
                            {elem}
                        </a>
                    ))}
                </div>
            ) : (
                <></>
            )}
        </>
    );
}

export default App;
