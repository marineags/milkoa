import { useEffect, useState } from 'react'
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

  // On récupère la dernière page visitée
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('currentPage') || 'dashboard'
  })

  // On récupère l'utilisateur connecté
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')

    return savedUser ? JSON.parse(savedUser) : null
  })

  const [authPage, setAuthPage] = useState('login')

  const [needsFarm, setNeedsFarm] = useState(false)

  // On récupère la dernière ferme sélectionnée
  const [selectedFarm, setSelectedFarm] = useState(() => {
    const savedFarm = localStorage.getItem('selectedFarm')

    return savedFarm ? JSON.parse(savedFarm) : null
  })

  const [farms, setFarms] = useState([])

  const handleLogout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('selectedFarm')
  localStorage.removeItem('currentPage')

  setUser(null)
  setSelectedFarm(null)
  setFarms([])
  setCurrentPage('dashboard')
}

  // ==========================================
  // SAUVEGARDE DE LA PAGE ACTUELLE
  // ==========================================

  useEffect(() => {
    localStorage.setItem('currentPage', currentPage)
  }, [currentPage])


  // ==========================================
  // SAUVEGARDE DE LA FERME SÉLECTIONNÉE
  // ==========================================

  useEffect(() => {
    if (selectedFarm) {
      localStorage.setItem(
        'selectedFarm',
        JSON.stringify(selectedFarm)
      )
    }
  }, [selectedFarm])


  // ==========================================
  // RÉCUPÉRATION DES FERMES
  // ==========================================

  useEffect(() => {

    if (!user) return

    const loadFarms = async () => {

      try {

        const response = await fetch(
          `http://localhost:8080/farms/user/${user.id}`
        )

        const farmsData = await response.json()

        setFarms(farmsData)

        if (farmsData.length > 0) {

          setNeedsFarm(false)

          // Si une ferme était déjà sélectionnée,
          // on essaie de la conserver
          const savedFarm = localStorage.getItem('selectedFarm')

          if (savedFarm) {

            const parsedFarm = JSON.parse(savedFarm)

            const existingFarm = farmsData.find(
              (farm) => farm.id === parsedFarm.id
            )

            if (existingFarm) {
              setSelectedFarm(existingFarm)
              return
            }
          }

          // Sinon on sélectionne la première ferme
          setSelectedFarm(farmsData[0])

        } else {

          setSelectedFarm(null)
          localStorage.removeItem('selectedFarm')
          setNeedsFarm(true)

        }

      } catch (error) {
        console.error('Erreur récupération fermes :', error)
      }
    }

    loadFarms()

  }, [user])


  // ==========================================
  // CONNEXION
  // ==========================================

  const handleLogin = (loggedUser) => {

    setUser(loggedUser)

    localStorage.setItem(
      'user',
      JSON.stringify(loggedUser)
    )
  }


  // ==========================================
  // INSCRIPTION
  // ==========================================

  const handleRegister = (registeredUser) => {

    setUser(registeredUser)

    localStorage.setItem(
      'user',
      JSON.stringify(registeredUser)
    )

    setNeedsFarm(true)
  }


  // ==========================================
  // CRÉATION FERME
  // ==========================================

  const handleFarmCreated = (farm) => {

    setFarms((previousFarms) => [
      ...previousFarms,
      farm
    ])

    setSelectedFarm(farm)

    localStorage.setItem(
      'selectedFarm',
      JSON.stringify(farm)
    )

    setNeedsFarm(false)
  }


  // ==========================================
  // AFFICHAGE DES PAGES
  // ==========================================

  const renderPage = () => {

    switch (currentPage) {

      case 'cows':
        return <Cows />

      case 'alerts':
        return <Alerts />

      case 'imports':
        return (
          <Imports
            selectedFarm={selectedFarm}
          />
        )

      default:
        return <Dashboard />
    }
  }


  // ==========================================
  // LOGIN / REGISTER
  // ==========================================

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


  // ==========================================
  // CRÉATION PREMIÈRE FERME
  // ==========================================

  if (needsFarm) {

    return (
      <CreateFarm
        user={user}
        onFarmCreated={handleFarmCreated}
      />
    )
  }


  // ==========================================
  // APPLICATION
  // ==========================================

  return (

    <div className="app">

      <Sidebar
  currentPage={currentPage}
  setCurrentPage={setCurrentPage}
  farms={farms}
  selectedFarm={selectedFarm}
  setSelectedFarm={setSelectedFarm}
  onAddFarm={() => setNeedsFarm(true)}
  onLogout={handleLogout}
/>

      <main className="app-content">
        {renderPage()}
      </main>

    </div>
  )
}

export default App