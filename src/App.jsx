import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './components/Homepage';
import Authentication from './components/Authentication/Authentication';
import Register from './components/Authentication/Register';
import ProtectedRoute from './components/Authentication/ProtectedRoute';
import Profile from './components/Profile';
import MyProfile from './components/MyProfile';
import axios from 'axios';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true) // Add loading state

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/protected', {
          withCredentials: true
        })
        console.log('Protected response:', response.data)

        if (response.data && response.data.user) {
          setIsAuthenticated(true)
          setUserData({
            user: {
              username: response.data.user.username,
              id: response.data.user.id,
              role: response.data.user.role
            }
          })
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setIsAuthenticated(false)
        setUserData(null)
      } finally {
        setLoading(false) // Set loading to false when done
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated
              ? <ProtectedRoute isAuthenticated={isAuthenticated} userData={userData}>
                  <Homepage userData={userData} />
                </ProtectedRoute>
              : <Authentication setAuthenticated={setIsAuthenticated} />
          } 
        />
        <Route
          path="/register"
          element={<Register />} 
        />
        <Route 
          path="/profile/:username" 
          element={
            isAuthenticated
              ? <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Profile userData={userData} />
                </ProtectedRoute>
              : <Authentication setAuthenticated={setIsAuthenticated} />
          }
        />
        <Route 
          path="/profile" 
          element={
            isAuthenticated
              ? <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Profile userData={userData} />
                </ProtectedRoute>
              : <Authentication setAuthenticated={setIsAuthenticated} />
          }
        />
        <Route 
          path="/my-profile" 
          element={
            isAuthenticated
              ? <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <MyProfile userData={userData} />
                </ProtectedRoute>
              : <Authentication setAuthenticated={setIsAuthenticated} />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
