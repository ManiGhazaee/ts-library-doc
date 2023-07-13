export const DARK_MODE_COLORS: string = `
:root {
    --bg-color: #1E1E20;
    --bg-2-color: #0f0f0f;
    --text-color: #d3d3d3;
    --text-2-color: #bebebe;
    --text-3-color: #919191;
    --borders-color: #414141;
    --primary-color: #6b3ac7;
}

.inverted {
    filter: invert(0);
}
`;
export const LIGHT_MODE_COLORS: string = `
:root {
    --bg-color: #ffffff;
    --bg-2-color: #d1d1d1;
    --text-color: #000000;
    --text-2-color: #252525;
    --text-3-color: #3b3b3b;
    --borders-color: #cfcfcf;
    --primary-color: #6b3ac7;
}

.inverted {
    filter: invert(1);
}
`;
