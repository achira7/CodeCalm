import React, { useState, useEffect } from 'react'
import axios from 'axios'
import SingleEmployee from './SingleEmployee'
import Overlay from "./Overlay"

const AllEmployees = () => {

    const [Employees, setEmployees] = useState([])
	const [isOpen, setIsOpen] = useState(false)

/*    useEffect(() => {
        fetchData();
    })

    function fetchData (baseurl){
        fetch("http://127.0.0.1:8000/api/employees/")
        .then ((response) => response.json())
        .then((data) =>  setEmployees(data.results));
    }
*/


const addUserButtonClick = () => {
	const addUser = () => {
		window.location.href='/admin/register'
	}

	const toggleOverlay = () => {
		setIsOpen(!isOpen)
	  }
}

const addUser = () => {
	window.location.href='/admin/register'
}

const toggleOverlay = () => {
	setIsOpen(!isOpen)
  }

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/employees') 
            .then(response => {
                console.log(response.data);  
                setEmployees(response.data);  
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

  return (
<div className="bg-white p-8 rounded-md w-full px-10">
	<div className=" flex items-center justify-between pb-6">
		<div>
			<h2 className="text-gray-600 font-bold font-google">All Employees</h2>
			<span className="text-xs">All Employees</span>
		</div>
		<div className="flex items-center justify-between">

			<button 
			onClick={addUser} 
			className='flex w-1/2 px-3 justify-center rounded-md bg-sky-300 py-1.5 mx-2 font-google text-sm font-semibold leading-6 text-neutral-950 shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
				Add a User
            </button>

			<div className="flex bg-gray-50 items-center p-2 rounded-md">
				<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
					fill="currentColor">
					<path fill-rule="evenodd"
						d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
						clip-rule="evenodd" />
				</svg>
				
				<input className="bg-gray-50 outline-none ml-1 block " type="text" name="" id="" placeholder="search..."/>
          </div>
			</div>
		</div>
		<div>
			<div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
				<div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
					<table className="min-w-full leading-normal border-fuchsia-300">
						<thead>
							<tr>
								<th
									className="font-google px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
									
								</th>
                                <th
									className="font-google px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
									Employee Name
								</th>
								<th
									className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
									Email Address
								</th>
								<th
									className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
									Team
								</th>
								<th
									className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
									Employement Type
								</th>
								<th
									className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
									Work Location
								</th>
                                <th
									className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
								</th>
							</tr>
						</thead>
						<tbody>
                            {
                                Employees.map((emp) => 
                                    <SingleEmployee employee={emp}/>
                                )
                            }
 
						</tbody>
					</table>
					<div
						className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between          ">
						<span className="text-xs xs:text-sm text-gray-900">
                            Showing 1 to 4 of 50 Entries
                        </span>
						<div className="inline-flex mt-2 xs:mt-0">
							<button
                                className="text-sm text-indigo-50 transition duration-150 hover:bg-indigo-500 bg-indigo-600 font-semibold py-2 px-4 rounded-l">
                                Prev
                            </button>
							&nbsp; &nbsp;
							<button
                                className="text-sm text-indigo-50 transition duration-150 hover:bg-indigo-500 bg-indigo-600 font-semibold py-2 px-4 rounded-r">
                                Next
                            </button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>





  )
}

export default AllEmployees