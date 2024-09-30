import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Components/Login.css'
export default function Login() {
    
    const [raqam, setRaqam]=useState()
    const [parol, setParol]=useState()
    const navigate = useNavigate()

    const loginSubmit = (event)=>{
      event.preventDefault()
      fetch("https://autoapi.dezinfeksiyatashkent.uz/api/auth/signin",{
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            phone_number: raqam,
            password: parol
        })
      }).then((res)=> res.json())
      .then((element)=> {
        if(element?.success===true){
            localStorage.setItem("tokenchik", element?.data?.tokens?.accessToken?.token)
            toast.success(element?.message)
            navigate("/home")
        }
        else{
            toast.error(element?.message)
        }     
      })
     
        
    }

    return (
        <div>
            <h1>Login kirish</h1>
            <form className='login'>
                <input className='login__input' onChange={(e)=> setRaqam(e?.target?.value)} type="text" placeholder='number' required minLength={3} />
                <input className='login__input' onChange={(e)=> setParol(e?.target?.value)} type="text" placeholder='password' required minLength={3} />
                <button onClick={loginSubmit}>kirish</button>
            </form>
              <ToastContainer/>
        </div>
    )
}
