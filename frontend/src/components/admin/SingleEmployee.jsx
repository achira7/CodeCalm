import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SingleEmployee(props) {
    const [isOpen, setIsOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [formData, setFormData] = useState({
        firstName: props.employee.first_name,
        lastName: props.employee.last_name,
        email: props.employee.email,
        team: props.employee.team,
        employmentType: props.employee.employment_type,
        workLocation: props.employee.work_location,
    });

    const toggleOverlay = () => {
        setIsOpen(!isOpen);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Data Submitted:', formData); // Log formData for debugging
        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/employee/${props.employee.id}/`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                toast.success('Employee updated successfully');
                toggleOverlay();
            } else {
                toast.error('Failed to update employee');
            }
        } catch (error) {
            if (error.response) {
                console.error('Error:', error.response.data); // Log error details for debugging
                toast.error('Error updating employee: ' + error.response.data);
            } else {
                console.error('Error:', error.message);
                toast.error('Error updating employee');
            }
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/api/employee/${props.employee.id}/`);
            if (response.status === 204) {
                toast.success('Employee deleted successfully');
                // Optionally remove the employee from the list in the parent component
            } else {
                toast.error('Failed to delete employee');
            }
        } catch (error) {
            if (error.response) {
                console.error('Error:', error.response.data); // Log error details for debugging
                toast.error('Error deleting employee: ' + error.response.data);
            } else {
                console.error('Error:', error.message);
                toast.error('Error deleting employee');
            }
        }
    };

    const openConfirmBox = (type) => {
        setIsConfirmOpen(true);
    };

    const closeConfirmBox = () => {
        setIsConfirmOpen(false);
    };

    const confirmAction = () => {
        handleDelete();
        closeConfirmBox();
    };

    return (
        <>
            <tr>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10">
                            <img className="w-full h-full rounded-full"
                                src={props.employee.profile_picture ? props.employee.profile_picture : "http://127.0.0.1:8000/media/profilePictures/default.jpg"}
                                alt={`${props.employee.first_name}'s Photo`} />
                        </div>
                        <div className="ml-3">
                            <p className="text-gray-900 whitespace-no-wrap">
                                {props.employee.EmployeeID}
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

                {!props.employee.is_superuser && (
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap flex">
                            <button
                                onClick={toggleOverlay}
                                className='flex w-1/2 justify-center rounded-md bg-green-300 px-1 py-1.5 mx-2 font-google text-sm font-semibold leading-6 text-neutral-950 shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                                Edit
                            </button>
                            <button
                                onClick={() => openConfirmBox('delete')}
                                className='flex w-1/2 justify-center rounded-md bg-red-300 px-1 py-1.5 mx-2 font-google text-sm font-semibold leading-6 text-neutral-950 shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                                Delete
                            </button>
                        </p>
                    </td>
                )}
            </tr>

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
                    <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                        <h2 className="text-xl mb-4">Edit Employee</h2>
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Team</label>
                                <input
                                    type="text"
                                    name="team"
                                    value={formData.team}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Employment Type</label>
                                <input
                                    type="text"
                                    name="employmentType"
                                    value={formData.employmentType}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Work Location</label>
                                <input
                                    type="text"
                                    name="workLocation"
                                    value={formData.workLocation}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={toggleOverlay}
                                    className="bg-gray-300 text-gray-700 px-3 py-2 rounded mr-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-3 py-2 rounded"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isConfirmOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
                    <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                        <h2 className="text-xl mb-4">{`Are you sure you want to delete this user?`}</h2>
                        <div className="flex justify-end">
                            <button
                                onClick={closeConfirmBox}
                                className="bg-gray-300 text-gray-700 px-3 py-2 rounded mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmAction}
                                className="bg-red-500 text-white px-3 py-2 rounded"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </>
    );
}

export default SingleEmployee;
