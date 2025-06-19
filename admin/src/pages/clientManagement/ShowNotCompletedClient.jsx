import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../../images/logo.png';
import backgroundImage from '../../images/main.jpeg';

const ShowNotCompletedEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentEmployeeId, setCurrentEmployeeId] = useState('');
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const fetchNotCompletedEmployees = async () => {
      try {
        const response = await axios.get('/api/employee?status=Not Completed');
        setEmployees(response.data);
      } catch (error) {
        console.error('Failed to fetch not completed employees:', error);
      }
    };

    fetchNotCompletedEmployees();
  }, []);

  const handleAddTask = async () => {
    if (newTask) {
      try {
        await axios.put(`/api/employee/${currentEmployeeId}/tasks`, { task: newTask });
        setNewTask('');
        setModalOpen(false);

        const response = await axios.get('/api/employee?status=Not Completed');
        setEmployees(response.data);
      } catch (error) {
        console.error('Failed to add task:', error);
      }
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearchTerm = employee.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment ? employee.department === selectedDepartment : true;
    return matchesSearchTerm && matchesDepartment;
  });

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.addImage(logo, 'PNG', 160, 10, 40, 30);

    doc.setFontSize(18);
    doc.text('Not Completed Employee Tasks Report', 14, 25);

    doc.setFontSize(12);
    doc.text('Mobile: +1 234 567 890', 14, 35);
    doc.text('Email: info@company.com', 14, 42);

    doc.setDrawColor(0, 102, 204);
    doc.line(14, 50, 196, 50);

    doc.autoTable({
      startY: 60,
      headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      tableLineColor: [0, 102, 204],
      tableLineWidth: 0.1,
      head: [['Name', 'Department', 'Position', 'Pending Tasks']],
      body: filteredEmployees.map(employee => [
        employee.name,
        employee.department,
        employee.position,
        employee.tasks.join(', ') || 'No tasks assigned',
      ]),
    });

    doc.save('not_completed_employee_tasks_report.pdf');
  };

  return (
    <div className="flex min-h-screen relative">
      <img src={backgroundImage} alt="Background" className="absolute inset-0 object-cover w-full h-full z-0" />
      <nav className="w-64 bg-purple-300 text-white h-screen p-6 z-10">
        <h1 className="text-3xl font-semibold mb-6">Admin Panel</h1>
        <ul>
          <li className="mb-4">
            <a href="/main-admin-dashboard" className="block py-2 px-4 rounded-lg hover:bg-purple-400">Main Dashboard</a>
          </li>
          <li className="mb-4">
            <a href="/employee-manage" className="block py-2 px-4 rounded-lg hover:bg-purple-400">Manage Employees</a>
          </li>
          <li className="mb-4">
            <a href="/add-employee" className="block py-2 px-4 rounded-lg hover:bg-purple-400">Add Employee</a>
          </li>
          <li className="mb-4">
            <a href="/show-notCompleted" className="block py-2 px-4 rounded-lg hover:bg-purple-400">Pending Tasks</a>
          </li>
        </ul>
      </nav>

      <div className="flex-1 z-10">
        <div className="flex flex-col items-center min-h-screen pt-20">
          <div className="bg-purple-200 p-8 rounded-lg shadow-lg w-full max-w-6xl">
            <h1 className="text-3xl font-semibold text-center text-purple-600 mb-6">Not Completed Employee Tasks</h1>
            <div className="mb-10 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <input
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={handleSearchChange}
                className="px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <select
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                className="px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Department</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
              </select>
              <button
                onClick={generatePDF}
                className="bg-purple-400 text-white px-4 py-2 rounded hover:bg-purple-500"
              >
                Generate Report
              </button>
            </div>
            <div className="overflow-x-visible">
              <table className="w-full border border-purple-300">
                <thead className="bg-purple-600 text-white">
                  <tr>
                    <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                    <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">Department</th>
                    <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">Position</th>
                    <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">Pending Tasks</th>
                    <th className="border p-2 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map(employee => (
                    <tr key={employee._id} className="border-t">
                      <td className="border p-2">{employee.name}</td>
                      <td className="border p-2">{employee.department}</td>
                      <td className="border p-2">{employee.position}</td>
                      <td className="border p-2">
                        <ul>
                          {employee.tasks.length > 0 ? (
                            employee.tasks.map((task, index) => <li key={index}>{task}</li>)
                          ) : (
                            <li>No tasks assigned</li>
                          )}
                        </ul>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            setCurrentEmployeeId(employee._id);
                            setModalOpen(true);
                          }}
                          className="bg-purple-400 text-white px-4 py-1 rounded-lg hover:bg-purple-500"
                        >
                          Add Task
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredEmployees.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-4 text-center text-gray-500">No employees found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4">Add Task</h2>
            <input
              type="text"
              placeholder="Enter task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="border border-purple-300 p-2 rounded-lg w-full"
            />
            <div className="flex justify-between mt-4">
              <button onClick={handleAddTask} className="bg-purple-400 text-white px-4 py-2 rounded hover:bg-purple-500">
                Add
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowNotCompletedEmployee;
