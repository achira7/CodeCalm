
import Overlay from "./Overlay"
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function SingleEmployee (props) {

	const [isOpen, setIsOpen] = useState(false)

	const toggleOverlay = () => {
		setIsOpen(!isOpen)
	  }

function editEmployee(){
	window.location.href='/admin/edit'
	editEmployee(props.id)
}

  return (
<tr>
    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <div className="flex items-center">
            <div className="flex-shrink-0 w-10 h-10">
                <img className="w-full h-full rounded-full"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                alt="" />
            </div>
			<div className="ml-3">
				<p className="text-gray-900 whitespace-no-wrap">
					{/*props.employee.EmployeeID*/} 
				</p>
			</div>
		</div>
    </td>
 

	<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
	    <p className="text-gray-900 whitespace-no-wrap">
            {props.employee.first_name} {props.employee.last_name} 
        </p>
	</td>

	<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
		<p className="text-gray-900 whitespace-no-wrap">
            {props.employee.email}
		</p>
	</td>

	<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
		<p className="text-gray-900 whitespace-no-wrap">
            {props.employee.team}
	    </p>
	</td>

	<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">
            {props.employee.employment_type}
        </p>
	</td>

    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
		<p className="text-gray-900 whitespace-no-wrap">
			{props.employee.work_location}
		</p>
	</td>

    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
		<p className="text-gray-900 whitespace-no-wrap flex">
			<button 
				onClick={editEmployee} 
				className='flex w-1/2 justify-center rounded-md bg-green-300 px-1 py-1.5 mx-2 font-google text-sm font-semibold leading-6 text-neutral-950 shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"'>
					Edit
			</button>

            <button className='flex w-1/2 justify-center rounded-md bg-red-300 px-1 py-1.5 mx-2 font-google text-sm font-semibold leading-6 text-neutral-950 shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                Delete
            </button>
		</p>
	</td>
</tr>
  )
}

export default SingleEmployee