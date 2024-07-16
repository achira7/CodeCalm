import React from 'react';

const EmployeeInfo = ({ name, team, accountType, picture }) => {
  return (
    <div className="flex items-center">
      <img
        src={picture}
        alt="Employee"
        className="w-20 h-20 rounded-full border-2 border-sky-500"
      />
      <div className="ml-4">
        <div className="text-xl font-bold font-google">{name}</div>
        <div className="text-md font-google">Team {team}</div>
        <div className="text-sm text-gray-500 font-google">{accountType} account</div>
      </div>
    </div>
  );
};

export default EmployeeInfo;
