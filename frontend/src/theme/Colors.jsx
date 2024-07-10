export const ColorSet01 = {
    primary :  "bg-sky-400",
    navBar: "bg-sky-400",
    navBarMob : "bg-sky-200 text-black",
    main100 : "bg-sky-100",
    main200 : "bg-sky-200",
    main300 : "bg-sky-300",
    main400 : "bg-sky-400",
    main500 : "bg-black",
    breathTitle : 'text-sky-500',

    breathBox : "bg-white border-white",
    textFeild : "bg-white text-black",
    textColor : "text-black",

    breathingEx : "bg-sky-200",
    outSideCard : "bg-gray-200",
    cardBox: "bg-gray-200 text-black",
    cardBGText : "bg-white text-black",
    breathInfo : "bg-gray-100 text-black",
    chartsBGText : "bg-white text-black",
    background : "bg-white",

    LoginleftSideBg: 'bg-gray-100',
    LoginrightSideBg: 'bg-sky-300',
    chartText : 'black',
    chartGrids : 'rgba(0, 161, 201, 0.404)',

    playerBG : "bg-gray-500 text-black",
}

export const ColorSet02 = {
    primary :  "bg-sky-400",
    navBar: "bg-sky-500/90",
    navBarMob : "bg-gray-800 text-white",
    outSideCard : "bg-gray-700/30",
    cardBGText : "bg-gray-700 text-white",
    chartsBGText : "bg-gray-700 text-white",
    breathingEx : "bg-sky-900",
    textColor : "text-white",

    breathTitle : 'text-white',
    cardBox: "bg-gray-700 text-white",
    textFeild : "bg-gray-600 text-white",
    breathBox : "bg-gray-700 border-gray-700",

    background : "bg-gray-800",
    LoginleftSideBg: 'bg-gray-500',
    breathInfo : "bg-gray-700 text-white",
    LoginrightSideBg: 'bg-gray-800',
    chartText : 'white',
    chartGrids : 'rgba(7, 142, 196, 0.507)',
    playerBG : "bg-gray-500 text-white",
}

export const getColorSet = () => {
    const themeMode = localStorage.getItem('darkMode');
    return themeMode === 'true' ? ColorSet02 : ColorSet01;
};

export const Color = getColorSet();


// export const Color = ColorSet01
