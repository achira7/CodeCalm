import React, { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const baseUrl = 'http://127.0.0.1:8000/api/employee/'

function EditEmployee(props){

const [Employee, setEmployee] = useState([])

useEffect(() => {
    axios.get(baseUrl + props.match.params.id) 
        .then(response => {
            console.log(response.data);  
            setEmployee(response.data);  
        })
        .catch(error => {
            console.error('Error fetching data:', error)
        });
}, []);

    

  return (
    <div className='items-center'>
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            
            <Link to="/admin/allemployees">
                <div className='flex items-center mx-5 hover: transition-transform duration-300 cursor-pointer'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 text-sky-500">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg> 
                    <p className='text-sky-500 font-semibold font google text-lg mx-3'>
                        Back to All Employees
                    </p>
                </div>
            </Link>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900 font-google">
                    Edit User Details
                </h2>
                <h3 className='font-google text-center text-sky-500'>to CodeCalm</h3>
                
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form method="POST" action="#">
                <div>
                <div class="mb-4 md:flex md:justify-between">
                    

							<div class="mb-4 md:mr-2 md:mb-0">
								<label className="block mb-2 text-sm font-bold text-gray-700 font-google" for="firstName">
                                    First Name
                                </label>
								<input
                                    class="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                    value={Employee.first_name}
                                    name="first_name"
                                    type="text"
                                    placeholder="First Name"
                                    
                                />
							</div>
							<div class="md:ml-2">
								<label className="block mb-2 text-sm font-bold text-gray-700 font-google" for="lastName">
                                    Last Name
                                </label>
								<input
                                    class="w-full px-3 py-2 text-sm leading-tight text-gray-700  border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                    name="last_name"
                                    type="text"
                                    placeholder="Last Name"
                                   
                                />
							</div>
                           
						</div>



                    <label for="email" className="block text-sm font-medium leading-5  text-gray-700">
                        E-mail Address
                    </label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                        <input class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                            id="name" 
                            name="email" 
                             
                            placeholder="User's company email"
                            type="email"
                             />
                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        </div>
                    </div>


                    <div class="mb-4 md:flex md:justify-between">
							<div class="mb-4 md:mr-2 md:mb-0">
								<label class="block mb-2 text-sm font-bold text-gray-700 font-google" for="firstName">
                                    Team
                                </label>
								<input
                                    className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline "
                                    
                                    name="team"
                                    type="text"
                                    placeholder="Team"
                                    
                                />
							</div>
							<div class="md:ml-2">
								<label className="block mb-2 text-sm font-bold text-gray-700 font-google" for="gender">
                                    Gender
                                </label>
                                <select
                                    className="w-full px-3 py-2 text-sm leading-tight text-gray-700  border rounded shadow appearance-none focus:outline-none focus:shadow-outline"                            
                                    name="gender"
                            >
                                        <option value="" selected disabled hidden>Choose Gender</option>
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                        <option value="O">Other</option>
                                </select>
							</div>
						</div>


                </div>

                <div class="mt-6">
                    <label for="email" className="block text-sm font-medium leading-5  text-gray-700">
                        Employement Type
                    </label>
                        <div class="mt-1 relative rounded-md shadow-sm">
                            {/*<input 
                            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                id="email" 
                                name="employment_type"  
                                placeholder="user@example.com" 
                                type="text"  
    onChange={handleChange}/>*/}
                            <select
                                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                name="employment_type"
                                >
                                    <option value="" selected disabled hidden>Choose Here</option>
                                    <option value="full_time">Full Time</option>
                                    <option value="part_time">Part Time</option>
                                    <option value="contract">Contract</option>
                                    <option value="intern">Intern</option>
                            </select>
                        </div>
                </div>



                <div class="mt-6">
                    <label for="email" className="block text-sm font-medium leading-5  text-gray-700">
            Work Location
          </label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                    <select
                            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                            name="work_location">
                                <option value="" selected disabled hidden>Choose Here</option>
                                <option value="onsite">On Site</option>
                                <option value="remote">Remote</option>
                                <option value="hybrid">Hybrid</option>
                        </select>
                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        </div>
                    </div>
                </div>

                

                <div class="mt-6">
                    <label for="password" className="block text-sm font-medium leading-5 text-gray-700">
                Password
            </label>
                    <div class="mt-1 rounded-md shadow-sm">
                        <input 
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                        
                        name="password"
                        type="password"/>
                    </div>
                </div>


                <div class="mt-6">
                    <span class="block w-full rounded-md shadow-sm">
                        <button 
                        class="flex w-full justify-center rounded-md disabled:bg-green-200 disabled:text-gray-400 bg-green-300 px-3 py-1.5 font-google text-sm font-semibold leading-6 text-neutral-950 shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-300"
                        
                        type="button"
                        >
                        Update User
                        </button>
                    </span>
                </div>
            </form>

        </div>
            </div>
        </div>
    </div>
  )
}

export default EditEmployee