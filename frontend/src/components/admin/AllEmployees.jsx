import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SingleEmployee from './SingleEmployee';
import { useNavigate } from 'react-router-dom';

const AllEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [activeTab, setActiveTab] = useState('Employees');
    const navigate = useNavigate();

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = () => {
        axios.get('http://127.0.0.1:8000/api/employeelist')
            .then(response => {
                setEmployees(response.data);
            })
            .catch(error => {
                console.error('Error fetching employees:', error);
            });
    };

    const addUser = () => {
        if (activeTab === 'Employees') {
            navigate('/admin/register_employee');
        } else if (activeTab === 'Supervisors') {
            navigate('/admin/register_supervisor');
        } else if (activeTab === 'Admins') {
            navigate('/admin/register_admin');
        }
    };

    const renderTableContent = () => {
        let filteredEmployees = [];

        if (activeTab === 'Employees') {
            filteredEmployees = employees.filter(emp => !emp.is_superuser && !emp.is_staff);
        } else if (activeTab === 'Supervisors') {
            filteredEmployees = employees.filter(emp => emp.is_staff && !emp.is_superuser);
        } else if (activeTab === 'Admins') {
            filteredEmployees = employees.filter(emp => emp.is_superuser);
        }

        return filteredEmployees.map(emp => <SingleEmployee key={emp.id} employee={emp} />);
    };

    const renderTableHeaders = () => {
        if (activeTab === 'Employees') {
            return (
                <>
                    <th className="font-google px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
                    <th className="font-google px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Employee Name
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Email Address
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Team
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Employment Type
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Work Location
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
                </>
            );
        } else if (activeTab === 'Supervisors') {
            return (
                <>
                    <th className="font-google px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
                    <th className="font-google px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Supervisor Name
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Email Address
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Overseeing Team
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
                </>
            );
        } else if (activeTab === 'Admins') {
            return (
                <>
                    <th className="font-google px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
                    <th className="font-google px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Admin Name
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Email Address
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
                </>
            );
        }
    };

    return (
        <div className="bg-white p-8 rounded-md w-full px-10">
            <div className="flex items-center justify-between pb-6">
                <div>
                    <h2 className="text-gray-600 font-bold font-google">{activeTab}</h2>
                    <span className="text-xs">All {activeTab}</span>
                </div>
                <div className="flex items-center justify-between">
                    <button 
                        onClick={addUser} 
                        className='flex w-1/2 px-3 justify-center rounded-md bg-sky-300 py-1.5 mx-2 font-google text-sm font-semibold leading-6 text-neutral-950 shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                        Add a {activeTab.slice(0, -1)}
                    </button>
                    <div className="flex bg-gray-50 items-center p-2 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                        <input className="bg-gray-50 outline-none ml-1 block" type="text" name="" id="" placeholder="search..." />
                    </div>
                </div>
            </div>
            <div className="flex items-center mb-4">
                <button onClick={() => setActiveTab('Employees')} className={`px-4 py-2 ${activeTab === 'Employees' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-l`}>
                    Employees
                </button>
                <button onClick={() => setActiveTab('Supervisors')} className={`px-4 py-2 ${activeTab === 'Supervisors' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                    Supervisors
                </button>
                <button onClick={() => setActiveTab('Admins')} className={`px-4 py-2 ${activeTab === 'Admins' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-r`}>
                    Admins
                </button>
            </div>
            <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                    <table className="min-w-full leading-normal border-fuchsia-300">
                        <thead>
                            <tr>
                                {renderTableHeaders()}
                            </tr>
                        </thead>
                        <tbody>
                            {renderTableContent()}
                        </tbody>
                    </table>
                    <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
                        <span className="text-xs xs:text-sm text-gray-900">Showing 1 to 4 of 50 Entries</span>
                        <div className="inline-flex mt-2 xs:mt-0">
                            <button className="text-sm text-indigo-50 transition duration-150 hover:bg-indigo-500 bg-indigo-600 font-semibold py-2 px-4 rounded-l">Prev</button>
                            &nbsp; &nbsp;
                            <button className="text-sm text-indigo-50 transition duration-150 hover:bg-indigo-500 bg-indigo-600 font-semibold py-2 px-4 rounded-r">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllEmployees;
