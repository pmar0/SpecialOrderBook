import React from "react";
import { useNavigate, useLocation } from "react-router-dom"
import axios from 'axios';

const Navbar = (props) => {
    const navigate = useNavigate();
    const path = useLocation();

    const logout = (e) =>{
        axios.post("http://localhost:8000/api/user/logout",{},{withCredentials: true})
        .then((res) =>{
            navigate("/login")
        })
        .catch((err) =>{
            console.log("failed logout from navbar", err)
        })
    }

    return (
        <nav>
            <div className="nav-center">
                <div className={path.pathname==='/login'||path.pathname==='/register'?"nav-header mx-auto":"nav-header"}>
                    <h2 className="font-bold text-white">Special Order Book</h2>
                </div>
                <div className="links-container">
                    {
                        path.pathname!=="/login"&&path.pathname!=='/register'?
                            <ul className="links">
                                <li>
                                    <span className='fake-nav-link' onClick={e=>{navigate('/dashboard')}}>Dashboard</span>
                                </li>
                                <li>
                                    <span className='fake-nav-link' onClick={e=>{navigate('/special_order/create')}}>Create Order</span>
                                </li>
                                <li>
                                    <span className='fake-nav-link ml-20' onClick={logout}>Logout</span>
                                </li>
                            </ul>
                        :null
                    }
                </div>
            </div>
        </nav>
    )
}

export default Navbar