import { useState } from 'react'
import './App.css'

import Sidebar from './components/sidebar/Sidebar.jsx'
import Dashboard from './pages/dashboard/Dashboard.jsx'
import Cows from './pages/cow/cows.jsx'
import Alerts from './pages/alert/Alerts.jsx'
import Imports from './pages/import/Imports.jsx'
import Login from './pages/login/Login.jsx'
import Register from './pages/register/Register.jsx'
import CreateFarm from './pages/farm/CreateFarm.jsx'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [user, setUser] = useState(null)
  const [authPage, setAuthPage] = useState('login')
  const [needsFarm, setNeedsFarm] = useState(false)
  const [selectedFarm, setSelectedFarm] = useState(null)
  const [farms, setFarms] = useState([])

 const handleLogin = async (loggedUser) => {
  setUser(loggedUser)

  try {
    const response = await fetch(
      `http://localhost:8080/farms/user/${loggedUser.id}`
    )

    const farms = await response.json()

    setFarms(farms)

    if (farms.length > 0) {
      setSelectedFarm(farms[0])
    } else {
      setNeedsFarm(true)
    }
  } catch (error) {
    console.error('Erreur récupération fermes :', error)
  }
}


  const handleRegister = (registeredUser) => {
    setUser(registeredUser)
    setNeedsFarm(true)
  }

const handleFarmCreated = (farm) => {
  setFarms((previousFarms) => [...previousFarms, farm])
  setSelectedFarm(farm)
  setNeedsFarm(false)
}

  const renderPage = () => {
    switch (currentPage) {
      case 'cows':
        return <Cows />

      case 'alerts':
        return <Alerts />

      case 'imports':
  return <Imports selectedFarm={selectedFarm} />

      default:
        return <Dashboard />
    }
  }

  if (!user) {
    if (authPage === 'register') {
      return (
        <Register
          onRegister={handleRegister}
          onBackToLogin={() => setAuthPage('login')}
        />
      )
    }

    return (
      <Login
        onLogin={handleLogin}
        onRegisterClick={() => setAuthPage('register')}
      />
    )
  }

  if (needsFarm) {
    return (
      <CreateFarm
        user={user}
        onFarmCreated={handleFarmCreated}
      />
    )
  }

  return (
    <div className="app">
      <Sidebar
  currentPage={currentPage}
  setCurrentPage={setCurrentPage}
  farms={farms}
  selectedFarm={selectedFarm}
  setSelectedFarm={setSelectedFarm}
  onAddFarm={() => setNeedsFarm(true)}
/>

      <main className="app-content">
        {renderPage()}
      </main>
    </div>
  )
}

export default App