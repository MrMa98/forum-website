const fadeColor = [
    {
        code: 200,
        start: '#ff626e',
        end: '#ffbe71',
    },
    {
        code: 201,
        start: '#eec9a3',
        end: '#ef629f',
    },
    {
        code: 202,
        start: '#bb5571',
        end: '#f0c6b5',
    },
    {
        code: 203,
        start: '#bc95c6',
        end: '#7dc4cc',
    },
    {
        code: 204,
        start: '#b2b9be',
        end: '#2f4052',
    },
    {
        code: 205,
        start: '#d66d75',
        end: '#f2aa9d',
    },
    {
        code: 206,
        start: '#6190e8',
        end: '#a7bfe8',
    },
    {
        code: 207,
        start: '#4da2cb',
        end: '#67b26f',
    },
    {
        code: 208,
        start: '#d9a7c7',
        end: '#fffcdc',
    },
    {
        code: 209,
        start: '#06beb6',
        end: '#028ea1',
    },
    {
        code: 210,
        start: '#67f9d4',
        end: '#ff9554',
    },
    {
        code: 211,
        start: '#f9957e',
        end: '#f3f5d0',
    },
    {
        code: 212,
        start: '#fdd819',
        end: '#e04c4c',
    },
    {
        code: 213,
        start: '#fff886',
        end: '#f072b6',
    },
    {
        code: 214,
        start: '#bb73df',
        end: '#ff8ddb',
    },
    {
        code: 215,
        start: '#0dcda4',
        end: '#c2fcd4',
    },
    {
        code: 216,
        start: '#e0b9ff',
        end: '#ff9a9e',
    },
    {
        code: 217,
        start: '#efbd8a',
        end: '#d343ba',
    },
    {
        code: 218,
        start: '#9600ff',
        end: '#e1e1e1',
    },
    {
        code: 219,
        start: '#ff9a9e',
        end: '#f6e745',
    },
    {
        code: 220,
        start: '#18545a',
        end: '#f1f2b5',
    },
    {
        code: 221,
        start: '#d39340',
        end: '#ffd194',
    },
    {
        code: 222,
        start: '#dd8dd8',
        end: '#f5bda1',
    },
    {
        code: 223,
        start: '#4ca1af',
        end: '#c4e0e5',
    },
    {
        code: 224,
        start: '#f902ff',
        end: '#00dbde',
    },
    {
        code: 225,
        start: '#ee9ca7',
        end: '#ffdde1',
    },
];

export const fadeColorMap = fadeColor.reduce((map, color) => {
    map.set(color.code, { start: color.start, end: color.end });
    return map;
}, new Map());

