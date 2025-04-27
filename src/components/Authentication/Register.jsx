import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [userRegister, setUserRegister] = useState({username: "", password: "", cfPassword: ""});
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    const handleInput =  (e) => {
        const { name, value } = e.target;
        setUserRegister((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const fetchRegister = async (e) => {
        e.preventDefault();
        if (userRegister.password !== userRegister.cfPassword) {
            setMsg("Password and CFPassword are not the same");
            return;
        }
        try {
            const response = await axios.post("/register", { username: userRegister.username, password: userRegister.password });
            if (response.status === 200) {
                setMsg("Account created!");
                navigate("/");
            }
        } catch (error) {
            console.error(error);
        }
    };
  return (
    <div>
        <form>
            <label htmlFor="">Username</label>
            <input type="text" name='username' value={userRegister.username} onChange={handleInput} />
            <label htmlFor="">Password</label>
            <input type="text" name='password' value={userRegister.password} onChange={handleInput} />   
            <label htmlFor="">Confirm password</label> 
            <input type="text" name="cfPassword" value={userRegister.cfPassword} onChange={handleInput} />
            <button onClick={fetchRegister}>Sign Up</button>
            {msg && <div>msg</div>}
        </form>
    </div>
  )
}

export default Register