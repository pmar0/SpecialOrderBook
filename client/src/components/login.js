import React, {useState, useEffect, useRef} from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Login = (props) => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const passwordField = useRef();
    const [initialLoad, setInitialLoad] = useState(true)
    const [user, setUser] = useState({
        email:"",
        password:""
    })
    const [showPass, setShowPass] = useState(false)
    const [capsCheck, setCapsCheck] = useState(false)
    const [error, setError] = useState("")

    const showPassToggle = () =>{
        setShowPass(!showPass);
    }

    useEffect(() => {
        if(!initialLoad){
            passwordField.current.focus();
            passwordField.current.setSelectionRange(passwordField.current.value.length,passwordField.current.value.length)
        }
        else{
            setInitialLoad(false);
        }
    }, [showPass]);

    const capsLockCheck = (e) =>{
        setCapsCheck(e.getModifierState('CapsLock'));
    }

    const handleChange = (e) =>{
        setUser({
            ...user,
            [e.target.name]:e.target.value
        })
    }

    const login = (e) =>{
        e.preventDefault();
        
        axios.post('http://localhost:8000/api/user/login',user,{withCredentials:true})
        .then((res) =>{
            setUser({
                email:"",
                password:""
            })
            setError("")
            setShowPass(false)
            if(res.data.verified){
                navigate(state?.prevLocation?state.prevLocation:"/dashboard")
            }
            else{
                navigate(`/verify/${res.data.userId}`)
            }
        })
        .catch((err) =>{
            setError(err.response.data.message)
        })
    }

    return(
        <>
            <form onSubmit={login} id="loginReg" className="shadow-md rounded-2xl mx-auto mt-20 w-1/4 p-6 flex-col text-center">
                <h3 className="mx-auto font-bold text-4xl">Login</h3>
                {
                    state?.good?
                    <p className="m-2 alertGood">{state.message}</p>
                    :null
                }
                {
                    state?.good !== undefined && !state?.good?
                    <p className="m-2 alertBad">{state.message}</p>
                    :null
                }
                <div style={{position:"relative"}}>
                    <input autoFocus onKeyUp={capsLockCheck} onChange={handleChange} name="email" value={user.email} className="w-4/6 mt-3 mb-5 p-2 rounded-md border-2" placeholder="Email" type="text" />
                    <input ref={passwordField} onKeyUp={capsLockCheck} onChange={handleChange} name="password" value={user.password} className="w-4/6 p-2 rounded-md border-2" placeholder="Password" type={showPass?"text":"password"} />
                    <img onClick={showPassToggle} alt="showPassButton" id="showPassSVG" src={showPass?"/closeEye.png":"/openEye.png"}/>
                    <img src="/capsArrow.png" style={capsCheck?{display:"inline"}:{display:"none"}} alt="capsCheckImg" id="capsCheck" />
                </div>
                {
                    error?
                    <p className="m-2 alertBad">{error}</p>
                    :null
                }
                <button className="btn-primary btn-shadow block mx-auto mt-4 p-2 rounded-lg w-2/6 text-lg">Login</button>
            </form>
            <p className="text-center mt-2">Don't have an account? <Link className="underline" to="/register">Register Here</Link></p>
        </>
    );
};

export default Login;