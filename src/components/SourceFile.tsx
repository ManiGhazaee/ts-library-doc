import React from "react";
import { useState } from "react";

const SourceFile = ({ source }: { source: string }) => {
    const [viewSource, setViewSource] = useState<Boolean>();

    const handleOnClick = () => {
        setViewSource(!viewSource);
    };

    return (
        <div>
            <strong>Source:</strong>
            <div onClick={handleOnClick}>View Source</div>
            <pre>
                <code className="language-typescript hljs"></code>
            </pre>
        </div>
    );
};

export default SourceFile;
