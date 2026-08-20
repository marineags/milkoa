import './Header.css'

function Header() {
  const formattedDate = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <header className="header">
      <div>
        <h1>Bonjour, Ferme Dupont 👋</h1>
       
      </div>

      <div className="header-date">
        📅 {formattedDate}
      </div>
    </header>
  )
}

export default Header