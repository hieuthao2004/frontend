import axios from 'axios'
import React, { useState } from 'react'
import styles from './Authentication.module.css'

const Authentication = ({setAuthenticated}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const fetchLogin = async (e) => {
    e.preventDefault();
    console.log(username);
    
    try {
      const response = await axios.post("http://localhost:3001/api/auth", {username, password}, {
        withCredentials: true
      });
      console.log(response.data);
      if (response.data.message === "Logged in") {
        setAuthenticated(true)
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={styles.authContainer}>
      <form className={styles.authForm} onSubmit={fetchLogin}>
        <div className={styles.inputGroup}>
          <input 
            className={styles.input}
            type="text" 
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input 
            className={styles.input}
            type="password" 
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className={styles.button} type="submit">
          Sign In
        </button>
      </form>
    </div>  )
}

export default Authentication