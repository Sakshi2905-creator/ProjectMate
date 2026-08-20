import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import CreateProject from './pages/CreateProject'
import ProjectDetails from './pages/ProjectDetails'
import Discover from './pages/Discover'
import Profile from './pages/Profile'

import './App.css'

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/create-project" element={<CreateProject />}/>
        <Route path="/project/:id" element={<ProjectDetails />}/>
        <Route path="/discover" element={<Discover /> }/>
        <Route path="/profile" element={<Profile />}/>

      </Routes>

    </BrowserRouter>
  )
}

export default App