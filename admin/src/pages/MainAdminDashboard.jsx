import React from 'react'
import { Link } from "react-router-dom";

import events from "./../images/events.png";
import stock from "./../images/inventory.png";
import employee from "./../images/crm.png";
import order from "./../images/order-fulfillment.png";
import product from "./../images/product-management.png";
import salary from "./../images/salary.png";
import supply from "./../images/supply-chain.png";

import backgroundImage from "../images/mainback.jpeg";

export default function MainAdminDashboard() {
  return (
    <div className="flex justify-center flex-row max-w-full mx-auto h-screen relative">
      {/* Background Image */}
      <img src={backgroundImage} alt="Background" className="absolute inset-0 object-cover w-full h-full z-0" />
        

        <div className="flex flex-col gap-10 mt-36 z-10">
          <div className="flex flex-row justify-center items-center gap-7">
            <Link to="/employee-manage">
              <div className="flex flex-col justify-center items-center bg-sectionBackground w-48 h-40 rounded-2xl border-2 border-purple-900">
                <img
                  src={employee}
                  alt="Customer and Employee management"
                  className="w-16 h-15 mx-4 my-2"
                />
                <hr className="mt-3 mb-2 w-40 h-px bg-sectionhr border-0 " />
                <p className="text-sectiontext text-center">Admin Details</p>
              </div>
            </Link>
            <Link to="/employee-manage">
              <div className="flex flex-col justify-center items-center bg-sectionBackground w-48 h-40 rounded-2xl border-2 border-purple-900">
                <img
                  src={salary}
                  alt="Employee Leave and Payroll management"
                  className="w-16 h-15 mx-4 my-2"
                />
                <hr className="mt-3 mb-2 w-40 h-px bg-sectionhr border-0 " />
                <p className="text-sectiontext text-center">Employee Leave and Payroll management</p>
              </div>
            </Link>
            <Link to="/event-manage">
              <div className="flex flex-col justify-center items-center bg-sectionBackground w-48 h-40 rounded-2xl border-2 border-purple-900">
                <img
                  src={events}
                  alt="Event Management"
                  className="w-16 h-15 mx-4 my-2"
                />
                <hr className="mt-3 mb-2 w-40 h-px bg-sectionhr border-0 " />
                <p className="text-sectiontext text-center">Event Management</p>
              </div>
            </Link>
            <Link to="/package-manage">
              <div className="flex flex-col justify-center items-center bg-sectionBackground w-48 h-40 rounded-2xl border-2 border-purple-900">
                <img
                  src={product}
                  alt="Packages Management"
                  className="w-16 h-15 mx-4 my-2"
                />
                <hr className="mt-3 mb-2 w-40 h-px bg-sectionhr border-0 " />
                <p className="text-sectiontext text-center">Packages Management</p>
              </div>
            </Link>
          </div>
        
          <div className="flex flex-row justify-center items-center gap-7">
            <Link to="/view-stock">
              <div className="flex flex-col justify-center items-center bg-sectionBackground w-48 h-40 rounded-2xl border-2 border-purple-900">
                <img
                  src={stock}
                  alt="Stock management"
                  className="w-16 h-15 mx-4 my-2"
                />
                <hr className="mt-3 mb-2 w-40 h-px bg-sectionhr border-0 " />
                <p className="text-sectiontext text-center">
                Stock management
                </p>
              </div>
            </Link>
            <Link to="/view-supplier">
              <div className="flex flex-col justify-center items-center bg-sectionBackground w-48 h-40 rounded-2xl border-2 border-purple-900">
                <img
                  src={supply}
                  alt="Supplier management"
                  className="w-16 h-15 mx-4 my-2"
                />
                <hr className="mt-3 mb-2 w-40 h-px bg-sectionhr border-0 " />
                <p className="text-sectiontext text-center">Supplier management</p>
              </div>
            </Link>
            <Link to="/orderhome">
              <div className="flex flex-col justify-center items-center bg-sectionBackground w-48 h-40 rounded-2xl border-2 border-purple-900">
                <img
                  src={order}
                  alt="Orders and payments management"
                  className="w-16 h-15 mx-4 my-2"
                />
                <hr className="mt-3 mb-2 w-40 h-px bg-sectionhr border-0 " />
                <p className="text-sectiontext text-center">Orders and payments management</p>
              </div>
            </Link>
            <Link to="/client/add">
              <div className="flex flex-col justify-center items-center bg-sectionBackground w-48 h-40 rounded-2xl border-2 border-purple-900">
                <img
                  src={supply}
                  alt="Client management"
                  className="w-16 h-15 mx-4 my-2"
                />
                <hr className="mt-3 mb-2 w-40 h-px bg-sectionhr border-0 " />
                <p className="text-sectiontext text-center">Client management</p>
              </div>
            </Link>
            <Link to="/customer/manage">
              <div className="flex flex-col justify-center items-center bg-sectionBackground w-48 h-40 rounded-2xl border-2 border-purple-900">
                  <img
                    src={product} // Make sure to replace `product` with the actual image source for Customer Management
                    alt="Customer Management"
                    className="w-16 h-15 mx-4 my-2"
                  />
                  <hr className="mt-3 mb-2 w-40 h-px bg-sectionhr border-0" />
                  <p className="text-sectiontext text-center">Customer Management</p>
                </div>
              </Link>

            
 
          </div>
        </div>
      </div>
  );
}


function NavLink({ icon, text, to }) {
  return (
    <Link to={to} className='flex items-center text-white py-2 px-4 rounded-md  bg-sideNavButton hover:bg-sideNavButtonhover '>
      
      <span className='text-lg font-semibold'>{text}</span>
    </Link>
  );
}