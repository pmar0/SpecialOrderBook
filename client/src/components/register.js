import React, {useRef, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = (props) => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        email:"",
        password:"",
        confirmPassword:""
    })
    const [showPass, setShowPass] = useState(false)
    const [errors, setErrors] = useState({
        email:"",
        password:"",
        confirmPassword:""
    })
    const emailInput = useRef()

    const showPassToggle = () =>{
        setShowPass(!showPass)
    }

    const handleChange = (e) =>{
        setUser({
            ...user,
            [e.target.name]:e.target.value
        })
        setErrors({
            ...errors,
            [e.target.name]:""
        })
    }

    const register = (e) =>{
        e.preventDefault();
        
        axios.post('http://localhost:8000/api/user/register',user)
        .then((res) =>{
            console.log(res.data)
            setUser({
                email:"",
                password:"",
                confirmPassword:""
            })
            setErrors({
                email:"",
                password:"",
                confirmPassword:""
            })
            setShowPass(false)
            navigate(`/login`,{state: {message:res.data.message,good:true}})
        })
        .catch((err) =>{
            setErrors({
                ...errors,
                ...err.response.data.errors
            })
            emailInput.current.focus()
        })
    }

    return(
        <>
            <form onSubmit={register} id="loginReg" className="shadow-md rounded-2xl mx-auto mt-20 w-1/4 p-6 flex-col text-center">
                <h3 className="mx-auto font-bold text-4xl">Register</h3>
                <div className={errors.email?"mt-6 mb-2":"mt-6 mb-5"}>
                    <input autoFocus ref={emailInput} onChange={handleChange} name="email" value={user.email} className="w-4/6 p-2 rounded-md border-2" placeholder="Email" type="text" />
                    {
                        errors.email?
                        <p className="m-2 alertBad">{errors.email.message}</p>
                        :null
                    }
                </div>
                <div className={errors.password?"mt-3 mb-2":"mt-3 mb-5"}>
                    <input onChange={handleChange} name="password" value={user.password} className="w-4/6 p-2 rounded-md border-2" placeholder="Password" type={showPass?"text":"password"}/>
                    {
                        errors.password?
                        <p className="m-2 alertBad">{errors.password.message}</p>
                        :null
                    }
                </div>
                <div style={{position:"relative"}}>
                    <img onClick={showPassToggle} style={{bottom:"20%"}} alt="showPassButton" id="showPassSVG" src={!showPass?"/closeEye.png":"/openEye.png"}/>
                    <input onChange={handleChange} name="confirmPassword" value={user.confirmPassword} className="w-4/6 p-2 rounded-md border-2" placeholder="Confirm Password" type={showPass?"text":"password"}/>
                </div>
                {
                    errors.confirmPassword?
                    <p className="m-2 alertBad">{errors.confirmPassword.message}</p>
                    :null
                }
                <button className="btn-primary btn-shadow block mx-auto mt-4 p-2 rounded-lg w-2/6 text-lg">Register</button>
            </form>
            <p className="text-center mt-2">Already a user? <Link className="underline" to="/login">Login Here</Link></p>
        </>
    );
};

export default Register;