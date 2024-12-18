import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Header from '../Homepage Components/Header';
import Sidemenu from '../Homepage Components/Sidemenu';
import Footer from '../Homepage Components/Footer';
import { FiClock, FiCalendar, FiUsers, FiAlertCircle } from 'react-icons/fi';
import LoadingSkeleton from './LoadingSkeleton';
import config from '../config';
import Cookies from 'js-cookie';
import * as XLSX from 'xlsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';

const TodaysAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    lateToday: 0,
    absentToday: 0
  });
  const [filters, setFilters] = useState({
    employeeId: '',
    email: '',
    department: '',
    status: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchTodaysAttendance();
  }, []);

  const fetchTodaysAttendance = async () => {
    try {
      setLoading(true);
      console.log('Fetching attendance data...');
      
      const response = await axios.get(`${config.apiUrl}/qubinest/todaysAttendance`, {
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response received:', response.data);

      if (!response.data) {
        throw new Error('No data received from server');
      }

      const processedData = response.data.map(record => ({
        ...record,
        checkinStatus: getCheckinStatus(record.checkin_Time),
        formattedCheckin: formatTime(record.checkin_Time),
        formattedCheckout: formatTime(record.checkout_Time),
        email: record.employeeId || record.employeeId || 'N/A'
      }));

      console.log('Processed data:', processedData);

      // Calculate statistics
      const stats = {
        totalEmployees: processedData.length,
        presentToday: processedData.filter(r => r.checkin_Time).length,
        lateToday: processedData.filter(r => 
          r.checkin_Time && getCheckinStatus(r.checkin_Time) === 'late'
        ).length,
        absentToday: processedData.filter(r => !r.checkin_Time).length
      };

      setStats(stats);
      setAttendance(processedData);

    } catch (error) {
      console.error('Error fetching today\'s attendance:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      toast.error(
        error.response?.data?.details || 
        'Failed to load today\'s attendance. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getCheckinStatus = (checkinTime) => {
    if (!checkinTime) return 'absent';
    
    const checkin = new Date(checkinTime);
    const targetTime = new Date(checkin);
    targetTime.setHours(10, 30, 0); // Set target time to 10:30 AM
    
    return checkin > targetTime ? 'late' : 'ontime';
  };

  const getCheckoutStatus = (checkoutTime) => {
    if (!checkoutTime) return 'pending';
    
    const checkout = new Date(checkoutTime);
    const targetTime = new Date(checkout);
    targetTime.setHours(17, 0, 0); // Set target time to 5:00 PM
    
    return checkout < targetTime ? 'early' : 'complete';
  };

  const formatTime = (time) => {
    if (!time) return '---';
    return new Date(time).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ontime': return 'bg-green-100 text-green-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'early': return 'bg-orange-100 text-orange-800';
      case 'complete': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Add this helper function to calculate working hours
  const calculateWorkingHours = (checkinTime, checkoutTime) => {
    if (!checkinTime || !checkoutTime) return '---';
    
    const checkin = new Date(checkinTime);
    const checkout = new Date(checkoutTime);
    
    // Calculate difference in milliseconds
    const diff = checkout - checkin;
    
    // Convert to hours and minutes
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    // Format the output
    if (hours < 0 || minutes < 0) return '---';
    return `${hours}h ${minutes}m`;
  };

  // Add export to Excel function
  const exportToExcel = () => {
    const dataToExport = attendance.map(record => ({
      'Employee ID': record.employeeId,
      'Email': record.email,
      'Department': record.department || 'N/A',
      'Check-in Time': record.formattedCheckin,
      'Check-out Time': record.formattedCheckout,
      'Status': record.checkinStatus
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    XLSX.writeFile(wb, 'todays_attendance.xlsx');
  };

  // Enhanced filter function
  const filteredAttendance = useMemo(() => {
    return attendance.filter(record => {
      const matchesEmployeeId = record.employeeId?.toString().toLowerCase().includes(filters.employeeId.toLowerCase());
      const matchesEmail = record.email?.toLowerCase().includes(filters.email.toLowerCase());
      const matchesDepartment = !filters.department || record.department === filters.department;
      const matchesStatus = filters.status === 'all' || record.checkinStatus === filters.status;

      return matchesEmployeeId && matchesEmail && matchesDepartment && matchesStatus;
    });
  }, [attendance, filters]);

  return (
    <>
      <Header />
      <Sidemenu />
      <div className="content-wrapper p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Today's Attendance</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faFilter} />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            <button
              onClick={exportToExcel}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faFileExcel} />
              Export to Excel
            </button>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Employee ID Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee ID
                </label>
                <input
                  type="text"
                  name="employeeId"
                  value={filters.employeeId}
                  onChange={(e) => setFilters({ ...filters, employeeId: e.target.value })}
                  placeholder="Search by ID"
                  className="w-full p-2 border rounded-md"
                />
              </div>

              {/* Email Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="text"
                  name="email"
                  value={filters.email}
                  onChange={(e) => setFilters({ ...filters, email: e.target.value })}
                  placeholder="Search by email"
                  className="w-full p-2 border rounded-md"
                />
              </div>

              {/* Department Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={filters.department}
                  onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                  placeholder="Search by department"
                  className="w-full p-2 border rounded-md"
                />
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="all">All Status</option>
                  <option value="ontime">On Time</option>
                  <option value="late">Late</option>
                  <option value="absent">Absent</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setFilters({ employeeId: '', email: '', department: '', status: 'all' })}
                className="bg-gray-100 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-200 flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faTimes} />
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Attendance Table */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check-in Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check-out Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Working Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check-in Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check-out Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAttendance.map((record) => (
                    <tr key={record.employeeId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {record.profileImage ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={record.profileImage}
                                alt=""
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                                {record.employeeName?.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
                            <div className="text-sm text-gray-500">{record.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{record.department || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{record.formattedCheckin}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{record.formattedCheckout}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{calculateWorkingHours(record.checkin_Time, record.checkout_Time)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.checkinStatus)}`}>
                          {record.checkinStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(getCheckoutStatus(record.checkout_Time))}`}>
                          {getCheckoutStatus(record.checkout_Time)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

// Stat Card Component
const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-white rounded-lg shadow p-6 flex items-center">
    <div className={`${color} text-white p-3 rounded-lg mr-4`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

export default TodaysAttendance;
