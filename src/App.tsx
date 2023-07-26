import React, { useEffect } from "react";
import { getHtmlContent } from "./ts/getMarkdowns";
import { useState, useRef } from "react";
import { FILES } from "./constants/fileNames";
import { getNameOfFunction, isVisible } from "./ts/utils";
import { DARK_MODE_COLORS, LIGHT_MODE_COLORS } from "./ts/darkmode";
import DarkmodeButton from "./components/DarkmodeButton";
import GithubIcon from "./components/GithubIcon";
import LoadingSpinner from "./components/LoadingSpinner";
import "highlight.js/styles/tokyo-night-dark.css";
import hljs from "highlight.js";
import Logo from "./components/Logo";
import { getSourceContent } from "./ts/getSources";
import { extractFunctionsAndMethods } from "./ts/parseFunctions";
import { getNextElementBy } from "./ts/getNextElementBy";
import { onClickFunction } from "./ts/viewSource";

function App() {
    const [htmlContent, setHtmlContent] = useState<{ [key: string]: string }>();
    const [htmlContentInHtml, setHtmlContentInHtml] = useState<{
        [key: string]: HTMLDivElement;
    }>();
    const [currentDoc, setCurrentDoc] = useState<string>("Array");
    const [onThisPage, setOnThisPage] = useState<{ [key: string]: string[] }>();
    const [currentSection, setCurrentSection] = useState<string>();
    const docRef = useRef<HTMLDivElement>(null);

    const [sourceFiles, setSourceFiles] =
        useState<Record<string, Record<string, string>>>();

    const [loaded, setLoaded] = useState(false);

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
            const [content, sourceContent] = await Promise.all([
                getHtmlContent(),
                getSourceContent(),
            ]);

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

                const aTags = div.querySelectorAll("a");
                aTags.forEach((e) => {
                    e.setAttribute("target", "_blank");
                });
            }

            setOnThisPage(OTP);

            // -------

            const sourceContentSeperated: {
                [key: string]: { [key: string]: string };
            } = {};
            for (const key in sourceContent) {
                sourceContentSeperated[key] = extractFunctionsAndMethods(
                    sourceContent[key]
                );
            }

            console.log(sourceContentSeperated);
            setSourceFiles(sourceContentSeperated);

            for (const key in contentInHtml) {
                const div = contentInHtml[key];
                const h3s = Array.from(div.querySelectorAll("h3"));

                for (let i = 0; i < h3s.length; i++) {
                    if (h3s[i].id in sourceContentSeperated[key]) {
                        const preCont = document.createElement("div");
                        const button = document.createElement("button");
                        button.classList.add("view-code-button");
                        button.textContent = "View source";
                        button.setAttribute("onclick", onClickFunction);

                        const pre = document.createElement("pre");
                        pre.classList.add("src-hidden");

                        const code = document.createElement("code");
                        code.classList.add("language-typescript");
                        code.textContent =
                            sourceContentSeperated[key][h3s[i].id];
                        pre.appendChild(code);

                        preCont.append(button, pre);

                        const nextH1 = getNextElementBy(h3s[i], "tag", "h1");

                        if (nextH1?.parentElement != undefined) {
                            const parent = nextH1?.parentElement;
                            parent.insertBefore(preCont, nextH1);
                        }
                    }
                }
            }

            let contentObject: { [key: string]: string } = {};
            for (const key in contentInHtml) {
                contentObject[key] = contentInHtml[key].innerHTML;
            }

            setHtmlContent(contentObject);
            setHtmlContentInHtml(contentInHtml);
        }
        getHtml();
    }, []);

    useEffect(() => {
        if (!loaded) return;
    }, [loaded]);

    const onLoad = () => {
        hljs.highlightAll();
        setLoaded(() => true);
    };

    useEffect(onLoad, [
        docRef.current?.innerHTML,
        currentDoc,
        docRef,
        htmlContent,
    ]);

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
        document.title = `${target.id} | TS Library`;
    };

    useEffect(() => {
        let otpElem = document.getElementById("on-this-page");
        let activeSec = document.querySelector(
            ".active-section"
        ) as HTMLElement;
        otpElem?.scrollTo({
            top: activeSec?.offsetTop - 50,
            behavior: "smooth",
        });
    }, [currentSection]);

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
            {Object.entries(FILES).length !== 0 ? (
                <aside className="block fixed left-0 top-0 bottom-0 h-[100%] w-[200px] px-[32px] py-[64px] bg-bg_2 font-semibold text-text_3 text-[14px] overflow-y-autoi z-20">
                    {Object.entries(FILES).map((entry) => (
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
                        onLoad={onLoad}
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
                <div
                    id="on-this-page"
                    className="fixed top-[78px] right-0 w-[240px] text-[14px] font-semibold text-text_2 overflow-auto h-[calc(100vh-78px)]"
                >
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
                                            document.getElementById(
                                                `${elem}`
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
