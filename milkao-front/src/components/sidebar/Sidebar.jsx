import './Sidebar.css'
import logo from '../../assets/milkao-logo.png'

function Sidebar({ currentPage, setCurrentPage }) {
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
              <strong>Ferme Dupont</strong>
              <p>100–150 vaches</p>
            </div>
          </div>

          <button className="farm-switch">
            Changer de ferme
            <span>⌄</span>
          </button>
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