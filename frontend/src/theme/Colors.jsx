export const ColorSet01 = {
    primary :  "bg-sky-400",
    navBar: "bg-sky-400",
    main100 : "bg-sky-100",
    main200 : "bg-sky-200",
    main300 : "bg-sky-300",
    main400 : "bg-sky-400",
    main500 : "bg-black",

    textColor : "text-black",

    outSideCard : "bg-gray-200",
    cardBGText : "bg-white text-black",
    chartsBGText : "bg-white text-black",
    background : "bg-white",

    LoginleftSideBg: 'bg-gray-100',
    LoginrightSideBg: 'bg-sky-300',
    chartText : 'black',
    chartGrids : 'rgba(0, 161, 201, 0.404)'
}

export const ColorSet02 = {
    primary :  "bg-sky-400",
    navBar: "bg-sky-500/90",

    outSideCard : "bg-gray-700/30",
    cardBGText : "bg-gray-700 text-white",
    chartsBGText : "bg-gray-700 text-white",

    textColor : "text-white",

    background : "bg-gray-800",
    LoginleftSideBg: 'bg-gray-500',
    LoginrightSideBg: 'bg-gray-800',
    chartText : 'white',
    chartGrids : 'rgba(7, 142, 196, 0.507)'
}

export const getColorSet = () => {
    const themeMode = localStorage.getItem('darkMode');
    return themeMode === 'true' ? ColorSet02 : ColorSet01;
};

export const Color = getColorSet();


// export const Color = ColorSet01
