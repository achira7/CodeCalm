import Dashboard from "./Dashboard";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../index.css";


export const individualData = [
  {
      id: new Date().getMilliseconds().toString(),
      imagePath: "url..."
  },
];


const Test = () => {
  
const [userData, setUserData] = useState({});


  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/getuser/", {
        withCredentials: true,
      });
      const user = response.data;
      setUserData(user);
    } catch (e) {
      console.error(e);
      setNavigate(true);
    }
  };

  const id = userData.id

  


  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div name="Test" className='flex'>
      <div>
        <p> {userData.id}</p>
      </div>

      <div>

      <a href={`/employee/dashboard/${userData.id}`}> Click Me </a>
      {/*<Dashboard key={userData.id} employee={userData} /> */}
      </div>
    </div>
  )
}

export default Test