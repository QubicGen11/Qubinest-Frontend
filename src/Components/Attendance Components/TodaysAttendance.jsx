import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Header from '../Homepage Components/Header';
import Sidemenu from '../Homepage Components/Sidemenu';
import Footer from '../Homepage Components/Footer';
import { FiClock, FiCalendar, FiUsers, FiAlertCircle } from 'react-icons/fi';
import LoadingSkeleton from './LoadingSkeleton';
import config from '../config';
import Cookies from 'js-cookie';

const TodaysAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    lateToday: 0,
    absentToday: 0
  });

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
    const threshold = new Date(checkin);
    threshold.setHours(9, 30, 0); // 9:30 AM threshold
    
    return checkin > threshold ? 'late' : 'ontime';
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
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Header />
      <Sidemenu />
      <div className="content-wrapper p-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Today's Attendance</h1>
            <p className="text-gray-600 mt-2">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={<FiUsers />}
              title="Total Employees"
              value={stats.totalEmployees}
              color="bg-blue-500"
            />
            <StatCard
              icon={<FiClock />}
              title="Present Today"
              value={stats.presentToday}
              color="bg-green-500"
            />
            <StatCard
              icon={<FiAlertCircle />}
              title="Late Today"
              value={stats.lateToday}
              color="bg-yellow-500"
            />
            <StatCard
              icon={<FiCalendar />}
              title="Absent Today"
              value={stats.absentToday}
              color="bg-red-500"
            />
          </div>

          {/* Attendance Table */}
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
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendance.map((record) => (
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
                            <div className="text-sm font-medium text-gray-900">
                              {record.employeeName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {record.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-sm rounded-full bg-purple-100 text-purple-800">
                          {record.department}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.formattedCheckin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.formattedCheckout}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.checkinStatus)}`}>
                          {record.checkinStatus.toUpperCase()}
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