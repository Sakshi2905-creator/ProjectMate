import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import CreateProject from './pages/CreateProject'
import ProjectDetails from './pages/ProjectDetails'
import Discover from './pages/Discover'
import Profile from './pages/Profile'
import JoinRequests from './pages/JoinRequests'
import EditProject from './pages/EditProject'
import FindTeammates from './pages/FindTeammates'
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
        <Route path="/join-requests" element={<JoinRequests />}/>
        <Route path="/edit-project/:id" element={<EditProject />}/>
        <Route path="/project/:id/find-teammates" element={<FindTeammates />}/>
        
      </Routes>

    </BrowserRouter>
  )
}

export default App