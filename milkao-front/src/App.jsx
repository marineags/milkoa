import { useState } from 'react'
import './App.css'

import Sidebar from './components/sidebar/Sidebar.jsx'
import Dashboard from './pages/dashboard/Dashboard.jsx'
import Cows from './pages/cow/cows.jsx'
import Alerts from './pages/alert/Alerts.jsx'
import Imports from './pages/import/Imports.jsx'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderPage = () => {
    switch (currentPage) {
      case 'cows':
        return <Cows />

      case 'alerts':
        return <Alerts />

      case 'imports':
        return <Imports />

      default:
        return <Dashboard />
    }
  }

  return (
    <div className="app">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <main className="app-content">
        {renderPage()}
      </main>
    </div>
  )
}

export default App