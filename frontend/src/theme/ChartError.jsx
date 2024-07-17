import React from "react";
import { BiError } from "react-icons/bi";
import { BiErrorAlt } from "react-icons/bi";

export const NoData = ({ type }) => {
  return (
    <div className="flex flex-col items-center text-center p-4">
      <BiError className="text-4xl text-yellow-500 mb-2" />
      <span className="text-lg font-semibold">No {type} Data Recorded</span>
    </div>
  );
};

export const RetrieveError = ({ type }) => {
    return (
      <div className="flex flex-col items-center text-center p-4">
        <BiErrorAlt className="text-4xl text-red-500 mb-2" />
        <span className="text-lg font-semibold">Error Retrieving {type} Data</span>
      </div>
    );
  };

