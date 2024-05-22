import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Header = () => {
    const navigate=useNavigate()
    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:9988/qubinest/logout');
            toast.success('Logout successful');
            navigate('/')
        } catch (error) {
            console.error(error);
            toast.error('Logout not possible');
        }
    };
    return (
        <>
            <nav className="main-header navbar navbar-expand navbar-dark navbar-dark ">
                <ul className="navbar-nav w-auto">
                    <li className="nav-item">
                        <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars" /></a>
                    </li>
                    {/* <li className="nav-item d-none d-sm-inline-block">
                        <a href="index3.html" className="nav-link">Home</a>
                    </li>
                    <li className="nav-item d-none d-sm-inline-block">
                        <a href="#" className="nav-link">Contact</a>
                    </li> */}
                </ul>
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item hidden ">
                        <a className="nav-link" data-widget="navbar-search" href="#" role="button">
                            <i className="fas fa-search" />
                        </a>
                        <div className="navbar-search-block sm:hi">
                            <form className="form-inline">
                                <div className="input-group input-group-sm">
                                    <input className="form-control form-control-navbar" type="search" placeholder="Search" aria-label="Search" />
                                    <div className="input-group-append">
                                        <button className="btn btn-navbar" type="submit">
                                            <i className="fas fa-search" />
                                        </button>
                                        <button className="btn btn-navbar" type="button" data-widget="navbar-search">
                                            <i className="fas fa-times" />
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </li>

                    {/* <li className="nav-item dropdown">
                        <a className="nav-link" data-toggle="dropdown" href="#">
                            <i className="far fa-comments" />
                            <span className="badge badge-danger navbar-badge">3</span>
                        </a>
                        <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                            <a href="#" className="dropdown-item">
                                <div className="media">
                                    <img src="dist/img/user1-128x128.jpg" alt="User Avatar" className="img-size-50 mr-3 img-circle" />
                                    <div className="media-body">
                                        <h3 className="dropdown-item-title">
                                            Brad Diesel
                                            <span className="float-right text-sm text-danger"><i className="fas fa-star" /></span>
                                        </h3>
                                        <p className="text-sm">Call me whenever you can...</p>
                                        <p className="text-sm text-muted"><i className="far fa-clock mr-1" /> 4 Hours Ago</p>
                                    </div>
                                </div>
                            </a>
                            <div className="dropdown-divider" />
                            <a href="#" className="dropdown-item">
                                <div className="media">
                                    <img src="dist/img/user8-128x128.jpg" alt="User Avatar" className="img-size-50 img-circle mr-3" />
                                    <div className="media-body">
                                        <h3 className="dropdown-item-title">
                                            John Pierce
                                            <span className="float-right text-sm text-muted"><i className="fas fa-star" /></span>
                                        </h3>
                                        <p className="text-sm">I got your message bro</p>
                                        <p className="text-sm text-muted"><i className="far fa-clock mr-1" /> 4 Hours Ago</p>
                                    </div>
                                </div>
                            </a>
                            <div className="dropdown-divider" />
                            <a href="#" className="dropdown-item">
                                <div className="media">
                                    <img src="dist/img/user3-128x128.jpg" alt="User Avatar" className="img-size-50 img-circle mr-3" />
                                    <div className="media-body">
                                        <h3 className="dropdown-item-title">
                                            Nora Silvester
                                            <span className="float-right text-sm text-warning"><i className="fas fa-star" /></span>
                                        </h3>
                                        <p className="text-sm">The subject goes here</p>
                                        <p className="text-sm text-muted"><i className="far fa-clock mr-1" /> 4 Hours Ago</p>
                                    </div>
                                </div>
                            </a>
                            <div className="dropdown-divider" />
                            <a href="#" className="dropdown-item dropdown-footer">See All Messages</a>
                        </div>


                    </li> */}
                    <li className="nav-item dropdown">
                        <a className="nav-link" data-toggle="dropdown" href="#">
                            <li class="nav-item">

                                <div className=" inset-x-0 z-20 w-full px-6  transition-all duration-300 ease-in-out   md:mt-0 md:p-0 md:top-0 md:relative md:bg-transparent md:w-auto md:opacity-100 md:translate-x-0 md:flex md:items-center">
                                    <div className="flex flex-col md:flex-row md:mx-6">

                                        {/* <a className="relative top-2 mx-2 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-yellow-500 dark:hover:text-yellow-400 md:mx-4 md:my-0" href="#">About</a> */}
                                        <a href="#" className="flex items-center px-4 -mx-2">
                                            <img
                                                className="object-cover mx-2 rounded-full h-9 w-9"
                                                src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
                                                alt="avatar"
                                            />
                                            <button className="w-auto z-10 flex flex-wrap items-center p-2 text-sm ml-auto text-gray-600 bg-white border border-transparent rounded-md focus:border-blue-500 focus:ring-opacity-40 dark:focus:ring-opacity-40 focus:ring-blue-300 dark:focus:ring-blue-400 focus:ring dark:text-white dark:bg-gray-800 focus:outline-none">
                                                <span className="mx-1 hover:text-yellow-500 dark:hover:text-yellow-400 text-xs">Shaik Sajid Hussain</span>
                                                <svg
                                                    className="w-5 h-5 mx-1"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"



                                                >
                                                    <path
                                                        d="M12 15.713L18.01 9.70299L16.597 8.28799L12 12.888L7.40399 8.28799L5.98999 9.70199L12 15.713Z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                            </button>
                                        </a>



                                    </div>




                                </div>
                            </li>                        </a>
                        <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right bg-gray-600 transition-all duration-300 ease-in-out">

                            <div



                                className=" bg-gray-800 rounded-md shadow-xl dark:bg-gray-800"
                            >
                                <a
                                    href="#"
                                    className="flex items-center p-3 -mt-2 text-sm text-gray-600 transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                                >
                                    <img
                                        className="flex-shrink-0 object-cover mx-1 rounded-full w-9 h-9"
                                        src="https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8d29tYW4lMjBibHVlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=face&w=500&q=200"
                                        alt="jane avatar"
                                    />
                                    <div className="mx-1">
                                        <h1 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                            Sajid Hussain
                                        </h1>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            SajidHussain@exampl.com
                                        </p>
                                    </div>
                                </a>
                                <hr className="border-gray-200 dark:border-gray-700 " />
                                <a
                                    href="#"
                                    className="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                                >
                                    view profile
                                </a>
                                <a
                                    href="#"
                                    className="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                                >
                                    Settings
                                </a>



                                <hr className="border-gray-200 dark:border-gray-700 " />

                                <button onClick={handleLogout}
                                    href="/"
                                    className="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </li>

                    {/* This is my name drop down */}


                    {/* This is shaiksajidhussain hover */}



                </ul>
            </nav>


        </>
    )
}

export default Header