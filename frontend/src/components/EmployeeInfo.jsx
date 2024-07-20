import React from "react";
import { Color } from "../theme/Colors";

const EmployeeInfo = ({ name, team, accountType, picture }) => {

   return (
    <div className="flex items-center mt-5">
      <div className="flex px-2 h-24 ">
        <div className="flex-shrink-0 ml-2 items-center flex z-[1]">
          <img
            src={picture}
            alt="Employee"
            className="w-24  h-24 rounded-full border-4 border-sky-500"
          />
        </div>
        <div className={`pl-32 absolute pr-12 h-24 py-2 ${Color.cardBox} rounded-full flex flex-col justify-center items-start shadow-lg`}>
  <h2 className={`text-2xl font-semibold text-sky-700 ${Color.cardBox}`}>{name}</h2>
  <div>
    <p className={`text-lg font-normal text-slate-700 ${Color.cardBox} ${Color.cardBox}`}>Team: {team}</p>
    <p className={`text-lg font-normal text-slate-400 ${Color.cardBox} ${Color.cardBox}`}>{accountType}</p>
  </div>
</div>

      </div>
    </div>
  );

  // return (
  //   <div className="flex items-center ">
  //     <div className="flex px-2">
  //       <div className="flex-shrink-0 z-[1]">
  //         <img
  //           src={picture || noDpImgDefault}
  //           alt="Employee"
  //           className="w-24  h-24 rounded-full border-2 border-gray-200"
  //         />
  //       </div>
  //       <div className={`pl-8 absolute mt-2  ml-16 pr-12 py-2  ${Color.cardBox} rounded-r-full text-sm flex flex-col justify-center items-start`}>
  //         <h2 className="font-bold ">Alex Chen</h2>
  //         <p className="">Team: teams</p>
  //         <p className="">Account Type: NoAccount sdihgcsujhdcgbsdkujhcg </p>
  //       </div>
  //     </div>
  //   </div>
  // );

  // return (
  //     <div className="flex">
  //       <div className="flex-shrink-0  rounded-l-full">
  //         <img
  //           src={picture || noDpImgDefault}
  //           alt="Employee"
  //           className="w-20  h-20 rounded-full border-2 border-gray-200"
  //         />
  //       </div>
  //       <div className={`pl-10 ml-2 pr-10 ${Color.cardBox} text-sm flex flex-col justify-center items-start rounded-full`}>
  //         <h2 className="font-bold ">Alex Chen</h2>
  //         <p className="">Team: teams</p>
  //         <p className="">Account Type: NoAccount g </p>
  //       </div>
  //   </div>
  // );

};

export default EmployeeInfo;
