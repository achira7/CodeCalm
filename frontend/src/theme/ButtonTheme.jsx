import React from "react";

import { PrimColor } from "./Colors";

export const BtnColor = {
    primary :  "bg-sky-400 hover:bg-sky-600 transition duration-200 rounded-lg",
    dashBoardBtnSelected : "bg-sky-600 text-white hover:bg-sky-600 hover:text-white rounded-lg transition duration-300",
    dashBoardBtnIdel : "bg-sky-300 text-gray-800 hover:bg-sky-600 hover:text-white rounded-lg transition duration-300"

}

export const BtnClose = {
    base: "text-3xl flex items-center justify-center rounded-md text-black",
    hover: `hover:bg-${PrimColor.red} hover:text-white transition duration-300`,
    //rotate: "transition-transform transform hover:rotate-180 duration-500",
  };

  export const CompareIconColor = {
    base: "relative flex items-center justify-center w-8 h-8",
    hover: `hover:text-${PrimColor.green} transition duration-300`,
    rotate: "transition-transform transform hover:rotate-180 duration-500",
  };

  export const DateSelector = {
    base: "relative flex items-center",
    hover: `hover:shadow-md hover:shadow-${PrimColor.green} transition duration-300`,

  }
  