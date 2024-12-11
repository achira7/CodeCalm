import React, { useEffect, useState } from "react";
import { Color } from "../../theme/Colors";
import { BtnColor, BtnClose, ReportButton } from "../../theme/ButtonTheme";
import { Navigate, useNavigate } from "react-router-dom";

import { BsSoundwave } from "react-icons/bs";
import { GiMeditation } from "react-icons/gi";
import { GrDocumentPerformance } from "react-icons/gr";
import { MdGroups } from "react-icons/md";

const AdminSettings = () => {
  const navigate = useNavigate();

  const goToAddListening = () => {
    navigate("/admin/track");
  };

  const goToAddBreathing = () => {
    navigate("/admin/breathing");
  };

  const goToAddStressQuestion = () => {
    navigate("/admin/addquestion");
  };

  const goToAddTeam = () => {
    navigate("/admin/addteam");
  };

  return (
    <div className={`min-h-screen ${Color.background}`}>
      <div className="container mx-auto py-2 px-4 md:px-20 lg:px-12 xl:px-48 m-7 flex items-center justify-between">
        <div className="flex flex-col justify-center">
          <div
            className={`flex items-center ${Color.chartsBGText} rounded-lg p-6 mb-4 bg-slate-300 `}
          >
            <button
              onClick={goToAddListening}
              className="flex items-center w-full"
            >
              <BsSoundwave size={30} className="mr-4" />
              <span>Manage Audio Therapy</span>
            </button>
          </div>

          <div
            className={`flex items-center ${Color.chartsBGText} rounded-lg p-6 mb-4 bg-slate-300 `}
          >
            <button
              onClick={goToAddBreathing}
              className="flex items-center w-full"
            >
              <GiMeditation size={30} className="mr-4" />
              <span>Manage Breathing Exercise</span>
            </button>
          </div>

          <div
            className={`flex items-center ${Color.chartsBGText} bg-slate-300 rounded-lg p-6 mb-4`}
          >
            <button
              onClick={goToAddStressQuestion}
              className="flex items-center w-full"
            >
              <GrDocumentPerformance size={30} className="mr-4" />
              <span>Manage Self Stress Questions</span>
            </button>
          </div>

          <div
            className={`flex items-center ${Color.chartsBGText} rounded-lg p-6 bg-slate-300 `}
          >
            <button onClick={goToAddTeam} className="flex items-center w-full">
              <MdGroups size={30} className="mr-4" />
              <span>Add a Team</span>
            </button>
          </div>
        </div>

        <div className="mr-36">
          <img
            src="http://127.0.0.1:8000/media/settings/settings.png"
            className="w-96"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
