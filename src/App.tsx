import React, { useEffect } from "react";
import { getHtmlContent } from "./ts/getMarkdowns";
import { useState, useRef } from "react";
import { MD_FILES } from "./constants/mdFiles";
import { getNameOfFunction, isVisible } from "./ts/utils";
import { DARK_MODE_COLORS, LIGHT_MODE_COLORS } from "./ts/darkmode";
import DarkmodeButton from "./components/DarkmodeButton";
import GithubIcon from "./components/GithubIcon";
import LoadingSpinner from "./components/LoadingSpinner";
import "highlight.js/styles/tokyo-night-dark.css";
import hljs from "highlight.js";
import Logo from "./components/Logo";

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

    const hl = () => {
        hljs.highlightAll();
    };

    useEffect(hl, [docRef.current?.innerHTML, currentDoc, docRef, htmlContent]);

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

    const handleOnClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLDivElement;
        setCurrentDoc(target.id);
        window.scrollTo(0, 0);
        setCurrentSection("");
        document.title = `${target.id} | TS Library`
    };

    return (
        <>
            <style>
                {darkModeState === "on" ? DARK_MODE_COLORS : LIGHT_MODE_COLORS}
            </style>
            <Logo />
            <div className="top-bg"></div>
            <div className="fixed p-[20px] top-0 right-[20px] w-fit h-[20px] z-20">
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
                <aside className="block fixed left-0 top-0 bottom-0 h-[100%] w-[200px] px-[32px] py-[64px] bg-bg_2 font-semibold text-text_3 text-[14px] overflow-y-autoi z-20">
                    {Object.entries(MD_FILES).map((entry) => (
                        <div
                            className={`mt-[10px] active:text-primary ${
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
                        onLoad={hl}
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
                        <div
                            className={`block ${
                                currentSection === elem ? "active-section" : ""
                            } mb-[10px] text-text_3 cursor-pointer`}
                            // href={"#" + elem}
                            onClick={() => {
                                window.scrollTo({
                                    top:
                                        (
                                            document.querySelector(
                                                `#${elem}`
                                            ) as HTMLElement
                                        ).offsetTop + 16,
                                    behavior: "smooth",
                                });
                            }}
                        >
                            {elem}
                        </div>
                    ))}
                </div>
            ) : (
                <></>
            )}
        </>
    );
}

export default App;
