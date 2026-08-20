import { useState } from 'react'
import './Sidebar.css'
import logo from '../../assets/milkao-logo.png'

function Sidebar({
  currentPage,
  setCurrentPage,
  farms,
  selectedFarm,
  setSelectedFarm,
  onAddFarm
}) {
  const [farmMenuOpen, setFarmMenuOpen] = useState(false)

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="Logo Milkao" />
      </div>

      <nav className="sidebar-nav">
        <button
          className={currentPage === 'dashboard' ? 'active' : ''}
          onClick={() => setCurrentPage('dashboard')}
        >
          <span className="nav-icon">⌂</span>
          <span>Dashboard</span>
        </button>

        <button
          className={currentPage === 'cows' ? 'active' : ''}
          onClick={() => setCurrentPage('cows')}
        >
          <span className="nav-icon">🐄</span>
          <span>Vaches</span>
        </button>

        <button
          className={currentPage === 'alerts' ? 'active' : ''}
          onClick={() => setCurrentPage('alerts')}
        >
          <span className="nav-icon">🔔</span>
          <span>Alertes</span>
          <span className="alert-count">8</span>
        </button>

        <button
          className={currentPage === 'imports' ? 'active' : ''}
          onClick={() => setCurrentPage('imports')}
        >
          <span className="nav-icon">☁</span>
          <span>Imports</span>
        </button>
      </nav>

      <div className="sidebar-bottom">
        <div className="farm-card">
          <div className="farm-title">
            <span className="farm-emoji">🌾</span>

            <div>
              <strong>
                {selectedFarm ? selectedFarm.name : 'Aucune ferme'}
              </strong>

              <p>
                {farms.length} ferme{farms.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <button
            className="farm-switch"
            onClick={() => setFarmMenuOpen(!farmMenuOpen)}
          >
            Changer de ferme
            <span>{farmMenuOpen ? '⌃' : '⌄'}</span>
          </button>

          {farmMenuOpen && (
            <div className="farm-menu">
              {farms.map((farm) => (
                <button
                  key={farm.id}
                  className={
                    selectedFarm?.id === farm.id
                      ? 'farm-option active-farm'
                      : 'farm-option'
                  }
                  onClick={() => {
                    setSelectedFarm(farm)
                    setFarmMenuOpen(false)
                  }}
                >
                  <span>🌾</span>
                  <span>{farm.name}</span>

                  {selectedFarm?.id === farm.id && (
                    <span className="farm-check">✓</span>
                  )}
                </button>
              ))}

              <button
                className="add-farm-button"
                onClick={() => {
                  setFarmMenuOpen(false)
                  onAddFarm()
                }}
              >
                <span>＋</span>
                Ajouter une ferme
              </button>
            </div>
          )}
        </div>

        <div className="plan-card">
          <strong>👑 Plan Milkao Pro</strong>

          <p>Renouvellement le 18/09/2026</p>

          <button>Gérer mon abonnement</button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar