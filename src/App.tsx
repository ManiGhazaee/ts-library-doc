import React, { useEffect } from "react";
import logo from "./logo.svg";
import { getHtmlContent } from "./ts/getMarkdowns";
import { useState } from "react";

function App() {
    const [htmlContent, setHtmlContent] = useState<string>();
    useEffect(() => {
        async function getHtml() {
            const content = await getHtmlContent();
            setHtmlContent(content[0].toString());
        }
        getHtml();
    }, []);

    if (!htmlContent) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div
                id="test"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            ></div>
        </>
    );
}

export default App;
