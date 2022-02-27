import React, {useEffect, useState, useRef} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Verify = (props) => {
    const {userId, verifyCode} = useParams();
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState("")
    const verifyInput = useRef();
    const [verificationCode, setVerificationCode] = useState("");
    const [error, setError] = useState("");


    useEffect(() =>{
        if (verifyCode){
            axios.get(`http://localhost:8000/api/user/verify/${userId}/${verifyCode}`,{withCredentials:true})
            .then((res) =>{
                setError("")
                setVerificationCode("")
                navigate(`/login`,{state: {message:res.data.message,good:true}})
            })
            .catch((err) =>{
                setError(err.response.data.message)
            })
        }
    },[userId,verifyCode,navigate])

    const handleChange = (e) =>{
        setVerificationCode(e.target.value)
        setError("");
    }

    const verify = (e) =>{
        e.preventDefault();

        if(verificationCode){
            axios.get(`http://localhost:8000/api/user/verify/${userId}/${verificationCode}`,{withCredentials:true})
            .then((res) =>{
                setError("")
                setVerificationCode("")
                navigate(`/login`,{state: {message:res.data.message,good:true}})
            })
            .catch((err) =>{
                setError(err.response.data.message)
                verifyInput.current.focus()
            })
        }
        else{
            setError("Please input a verification code.")
        }
    }

    const resendCode = () =>{
        axios.get(`http://localhost:8000/api/user/resendCode/${userId}`)
        .then((res) =>{
            setSuccessMessage(res.data.message)
            verifyInput.current.focus()
        })
        .catch((err) =>{
            if(!err.response.data.verified){
                setError(err.response.data.message)
                verifyInput.current.focus()
            }
            else{
                navigate(`/login`,{state: {message:err.response.data.message,good:false}})
            }
        })
    }

    return(
        <>
            <form onSubmit={verify} id="loginReg" className="shadow-md rounded-2xl mx-auto mt-20 w-1/4 p-6 flex-col text-center">
                <h3 className="mx-auto font-bold text-4xl">Verify</h3>
                {
                    successMessage?
                    <p className="m-2 alertGood">{successMessage}</p>
                    :null
                }
                <div className={error?"mt-6 mb-2":"mt-6 mb-5"}>
                    <input ref={verifyInput} autoFocus onChange={handleChange} name="verificationCode" value={verificationCode} className="w-4/6 p-2 rounded-md border-2" placeholder="Verification Code" type="text" />
                </div>
                {
                    error?
                    <p className="m-2 alertBad">{error}</p>
                    :null
                }
                <button className="btn-primary block mx-auto p-2 rounded-lg w-2/6 text-lg">Verify</button>
            </form>
            <p className="text-center mt-2">Didn't receive a code? <span onClick={resendCode} className="underline fake-link">Resend Code</span></p>
        </>
    );
};

export default Verify;