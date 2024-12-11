import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, Link } from "react-router-dom";
import DoughnutChart from "./charts/DoughnutChart";
import LineChart from "./charts/LineChart";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "../index.css";
import { useParams } from "react-router-dom";
import TestComponent from "./EmployeeComponent";
import TeamComponent from "./TeamComponent";

const pfp = "http://127.0.0.1:8000/media/profilePictures/default.jpg";
const icons = "http://127.0.0.1:8000/media/icons";

//<TestDashboard data={userData}/>

const TestDashboard = (id) => {


  return (
    <div className="container mx-auto py-6">
        <TestComponent id={ id } />
        {/*<TeamComponent team={ 'Test' }/>*/}
    </div>
   
  );
};

export default TestDashboard;


