import React, { useState, useEffect } from "react";
import Header from "../Homepage Components/Header";
import Sidemenu from "../Homepage Components/Sidemenu";
import Footer from "../Homepage Components/Footer";
import axios from "axios";
import { RiDeleteBinLine } from "react-icons/ri";
import { BiPencil } from "react-icons/bi";
import imgConfig from "../imgConfig"; // Ensure this is correctly configured
import { CiMenuKebab } from "react-icons/ci";
import { Link } from "react-router-dom";
import config from "../config";
import { ThreeDots } from 'react-loader-spinner';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { FiFilter } from 'react-icons/fi';
import { HiDownload } from 'react-icons/hi';

const getInitials = (name) => {
  if (!name) return '';
  const names = name.split(' ');
  if (names.length >= 2) {
    return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
  }
  return name.charAt(0).toUpperCase();
};

const colors = [
  'bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500', 
  'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
  'bg-orange-500', 'bg-cyan-500', 'bg-rose-500', 'bg-emerald-500',
  'bg-violet-500', 'bg-fuchsia-500', 'bg-lime-500', 'bg-amber-500'
];

const getRandomColor = (email) => {
  // Use email as a seed to always get the same color for the same user
  const index = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

const gradientColors = [
  'bg-gradient-to-r from-blue-500 to-blue-600',
  'bg-gradient-to-r from-red-500 to-red-600',
  'bg-gradient-to-r from-green-500 to-green-600',
  'bg-gradient-to-r from-yellow-500 to-yellow-600',
  'bg-gradient-to-r from-purple-500 to-purple-600',
  'bg-gradient-to-r from-pink-500 to-pink-600',
  'bg-gradient-to-r from-indigo-500 to-indigo-600',
  'bg-gradient-to-r from-teal-500 to-teal-600',
  'bg-gradient-to-r from-orange-500 to-orange-600',
  'bg-gradient-to-r from-cyan-500 to-cyan-600',
  'bg-gradient-to-r from-rose-500 to-rose-600',
  'bg-gradient-to-r from-emerald-500 to-emerald-600',
  'bg-gradient-to-r from-violet-500 to-violet-600',
  'bg-gradient-to-r from-fuchsia-500 to-fuchsia-600',
  'bg-gradient-to-r from-lime-500 to-lime-600',
  'bg-gradient-to-r from-amber-500 to-amber-600'
];

const getRandomGradient = (email) => {
  const index = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return gradientColors[index % gradientColors.length];
};

const AllEmployeeAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const getStatusClasses = (status) => {
    switch (status) {
      case "Active":
        return " text-green-800";
      case "Decline":
        return " text-red-800";
      case "Pending":
        return " text-yellow-800";
      default:
        return " text-gray-800";
    }
  };

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${config.apiUrl}/qubinest/allusers`);
      
      // Filter users with valid employeeId and remove duplicates
      const filteredUsers = response.data
        .filter(user => user.employeeId && user.employeeId.startsWith('QG'))
        .reduce((acc, current) => {
          const x = acc.find(item => item.email === current.email);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);

      setEmployees(filteredUsers);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to load employees data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  
  

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee);
    setModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:3000/qubinest/employees/${selectedEmployee.employee_id}`);
      setEmployees(employees.filter(emp => emp.employee_id !== selectedEmployee.employee_id));
      setModalOpen(false);
      setSelectedEmployee(null);
    } catch (error) {
      console.error("Failed to delete the employee", error);
    }
  };

  const uniqueRoles = [...new Set(employees.map(emp => emp.role))].filter(Boolean);

  const filteredEmployees = employees.filter(user => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = (
      user.username?.toLowerCase().includes(searchString) ||
      user.email?.toLowerCase().includes(searchString) ||
      user.employeeId?.toLowerCase().includes(searchString) ||
      user.mainPosition?.toLowerCase().includes(searchString)
    );
    
    const matchesRole = !roleFilter || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const exportToExcel = () => {
    const dataToExport = filteredEmployees.map(user => ({
      'Employee Name': user.username,
      'Employee ID': user.employeeId,
      'Email': user.email,
      'Role': user.role,
      'Position': user.mainPosition,
      'Status': user.status,
      'Salary': user.salary
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employees");
    
    // Generate & Download Excel file
    XLSX.writeFile(wb, "Employees_List.xlsx");
    toast.success('Successfully exported to Excel!');
  };

  return (
    <>
      <div>
        <Header />
        <Sidemenu />
        <div className="content-wrapper">
          <section className="container px-4 mx-auto">
            <div className="flex items-center gap-x-3">
              <h2 className="text-lg font-medium text-gray-800 text-black:text-white">
                All Employees
              </h2>
              <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full text-black:bg-gray-800 text-black:text-blue-400">
                {employees.length} users
              </span>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-[50vh]">
                <ThreeDots
                  height="80"
                  width="80"
                  radius="9"
                  color="#4338ca"
                  ariaLabel="loading"
                />
              </div>
            ) : (
              <div className="flex flex-col mt-6">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden border border-gray-200 text-black:border-gray-700 md:rounded-lg">
                      <div className="mt-4 mb-6">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                          <div className="relative w-full md:w-64">
                            <input
                              type="text"
                              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                              placeholder="Search by name, email, ID..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <span className="absolute right-3 top-2.5 text-gray-400">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                              </svg>
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <select
                                className="appearance-none px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 pr-8"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                              >
                                <option value="">All Roles</option>
                                {uniqueRoles.map(role => (
                                  <option key={role} value={role}>{role}</option>
                                ))}
                              </select>
                              <FiFilter className="absolute right-2 top-3 text-gray-400" />
                            </div>
                            <button
                              onClick={exportToExcel}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <HiDownload className="text-lg" />
                              Export to Excel
                            </button>
                            <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full">
                              {filteredEmployees.length} users
                            </span>
                          </div>
                        </div>
                      </div>
                      {filteredEmployees.length === 0 ? (
                        <div className="text-center py-4">
                          <p className="text-gray-500">No employees found</p>
                        </div>
                      ) : (
                        <table className="min-w-full divide-y divide-gray-200 text-black:divide-gray-700">
                          <thead className="bg-gray-50 text-black:bg-gray-800">
                            <tr>
                              <th className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 text-black:text-gray-400">
                                <div className="flex items-center gap-x-3">
                                  <input
                                    type="checkbox"
                                    className="text-blue-500 border-gray-300 rounded text-black:bg-gray-900 text-black:ring-offset-gray-900 text-black:border-gray-700"
                                  />
                                  <span>Name</span>
                                </div>
                              </th>
                              <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 text-black:text-gray-400">
                                Employee ID
                              </th>
                              <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 text-black:text-gray-400">
                                Status
                              </th>
                              <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 text-black:text-gray-400">
                                Email address
                              </th>
                              <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 text-black:text-gray-400">
                                Role
                              </th>
                              <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 text-black:text-gray-400">
                                Salary
                              </th>
                              <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 text-black:text-gray-400">
                                Position
                              </th>
                              <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 text-black:text-gray-400">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200 text-black:divide-gray-700 text-black:bg-gray-900">
                            {filteredEmployees.map((user) => (
                              <tr key={user.id || user.email}>
                                <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                  <div className="inline-flex items-center gap-x-3">
                                    <input
                                      type="checkbox"
                                      className="text-blue-500 border-gray-300 rounded text-black:bg-gray-900 text-black:ring-offset-gray-900 text-black:border-gray-700"
                                    />
                                    <div className="flex items-center gap-x-2">
                                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium shadow-lg transform transition-all duration-300 hover:scale-110 ${getRandomGradient(user.email)}`}>
                                        {getInitials(user.username)}
                                      </div>
                                      <div>
                                        <h2 className="font-medium text-gray-800 text-black:text-white">
                                          {user.username}
                                        </h2>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-500 text-black:text-gray-300 whitespace-nowrap">
                                  {user.employeeId}
                                </td>
                                <td className={`relative px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap ${getStatusClasses(user.status)}`}>
                                  {user.status}
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-500 text-black:text-gray-300 whitespace-nowrap">
                                  {user.email}
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-500 text-black:text-gray-300 whitespace-nowrap">
                                  {user.role}
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-500 text-black:text-gray-300 whitespace-nowrap">
                                  {user.salary}
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-500 text-black:text-gray-300 whitespace-nowrap">
                                  {user.mainPosition}
                                </td>
                                <td className="px-4 py-4 text-sm whitespace-nowrap">
                                  <div className="flex items-center gap-x-6">
                                    <Link to={`/singleemployeeattendance/:${user.employeeId}`} 
                                      className="text-gray-500 transition-colors duration-200 text-black:hover:text-yellow-500 text-black:text-gray-300 text-xs hover:text-red-500 focus:outline-none">
                                      View Attendance
                                    </Link>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-6">
              <a
                href="#"
                className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 text-black:bg-gray-900 text-black:text-gray-200 text-black:border-gray-700 text-black:hover:bg-gray-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 rtl:-scale-x-100"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                  />
                </svg>
                <span>Previous</span>
              </a>
              <div className="items-center hidden lg:flex gap-x-3">
                <a
                  href="#"
                  className="px-2 py-1 text-sm text-blue-500 rounded-md text-black:bg-gray-800 bg-blue-100/60"
                >
                  1
                </a>
                <a
                  href="#"
                  className="px-2 py-1 text-sm text-gray-500 rounded-md text-black:hover:bg-gray-800 text-black:text-gray-300 hover:bg-gray-100"
                >
                  2
                </a>
                <a
                  href="#"
                  className="px-2 py-1 text-sm text-gray-500 rounded-md text-black:hover:bg-gray-800 text-black:text-gray-300 hover:bg-gray-100"
                >
                  3
                </a>
                <a
                  href="#"
                  className="px-2 py-1 text-sm text-gray-500 rounded-md text-black:hover:bg-gray-800 text-black:text-gray-300 hover:bg-gray-100"
                >
                  ...
                </a>
                <a
                  href="#"
                  className="px-2 py-1 text-sm text-gray-500 rounded-md text-black:hover:bg-gray-800 text-black:text-gray-300 hover:bg-gray-100"
                >
                  12
                </a>
                <a
                  href="#"
                  className="px-2 py-1 text-sm text-gray-500 rounded-md text-black:hover:bg-gray-800 text-black:text-gray-300 hover:bg-gray-100"
                >
                  13
                </a>
                <a
                  href="#"
                  className="px-2 py-1 text-sm text-gray-500 rounded-md text-black:hover:bg-gray-800 text-black:text-gray-300 hover:bg-gray-100"
                >
                  14
                </a>
              </div>
              <a
                href="#"
                className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 text-black:bg-gray-900 text-black:text-gray-200 text-black:border-gray-700 text-black:hover:bg-gray-800"
              >
                <span>Next</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 rtl:-scale-x-100"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  />
                </svg>
              </a>
            </div>
          </section>
        </div>
        <Footer />
      </div>
      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Background overlay */}
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setModalOpen(false)}></div>
          {/* Modal */}
          <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              {/* Modal content */}
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <RiDeleteBinLine className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                    Delete Employee
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete <span className="font-bold">{selectedEmployee?.username}</span>? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 gap-3 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                onClick={handleDeleteConfirm}
                type="button"
                className="p-2 bg-red-500 text-white rounded-xl"
              >
                Delete
              </button>
              <button
                onClick={() => setModalOpen(false)}
                type="button" 
                className="p-2 bg-gray-200 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllEmployeeAttendance;
