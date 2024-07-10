import React, { useState } from 'react'
import axios from 'axios'

function Loginpanel(props){
  const baseUrl = 'http://127.0.0.1:8000' 
  const [formError, setFormError] = useState(false)
  const [errorMsg, seterrorMsg] = useState('')
  const [loginFormData, setLoginFormData] = useState({
    "email":'',
    "password": ''
  })

const inputHandler = (event) => {
  setLoginFormData({
    ...loginFormData,
    [event.target.name]:[event.target.value],
  })
  
};

const submitHandler = (event) => {
  const formData = new FormData()
  formData.append('email', loginFormData.EmployeeID)
  formData.append('password', loginFormData.Password)

  console.log(loginFormData.email, loginFormData.password)

  axios.post(baseUrl + '/api/', formData)
  .then (function (response){
    if (response.data.bool == false){
      setFormError(true);
      seterrorMsg(response.data.msg)
      console.log(response)
    }
    else{
      localStorage.setItem('Employee_Login', true)
      localStorage.setItem('email', response.data.email)
      setFormError(false)
      seterrorMsg('')
    }
  })
  .catch(function (error){
    console.log(error)
  })
}

const checkEmployee = (localStorage.getItem('Employee_Login'));
if (checkEmployee){
  window.location.href='/employee/dashboard'
}

const buttonEnable = (loginFormData.EmployeeID != '') && (loginFormData.Password != '')

  return (
<div class="flex min-h-full flex-col justify-center">
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <h2 class="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 font-google">Account Login</h2>
  </div>

  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form class="space-y-6" action="#" method="POST">
      <div>
      {formError &&
        <p className="text-center text-2xl font-bold leading-9 tracking-tight text-red-700 font-google">{errorMsg}</p>
      }
        <label for="EmployeeID" className="block text-sm font-semibold leading-6 text-gray-600 font-google">Organization Email Address</label>
        <div class="mt-2">
          <input id="EmployeeID" name="EmployeeID" value={loginFormData.email} onChange={inputHandler} type="email" autocomplete="email" required className="block w-full rounded-md border-0 py-1.5 px-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2  focus:ring-sky-400 sm:text-sm sm:leading-6" />
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between">
          <label for="Password" className="block text-sm font-semibold leading-6 text-gray-600 font-google">Password</label>
        </div>
        <div class="mt-2">
          <input id="Password" name="Password" value={loginFormData.password} type="text" onChange={inputHandler} autocomplete="current-password" required class="block w-full rounded-md border-0 py-1.5 px-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2  focus:ring-sky-400 sm:text-sm sm:leading-6" />
        </div>
      </div>

      <div>
        <button type="button" onClick={submitHandler} disabled={!buttonEnable} className="flex w-full justify-center rounded-md disabled:bg-green-200 disabled:text-gray-400 bg-green-300 px-3 py-1.5 font-google text-sm font-semibold leading-6 text-neutral-950 shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-300">
            Log into Codecalm
        </button>
      </div>
      
    </form>
  </div>
</div>
  )
}

export default Loginpanel