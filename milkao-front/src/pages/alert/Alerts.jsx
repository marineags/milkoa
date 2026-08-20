import { useEffect, useState } from 'react'
import './Alerts.css'
import Header from '../../components/header/Header.jsx'

function Alerts() {
  const [cows, setCows] = useState([])
  const [summaries, setSummaries] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:8080/cows')
      .then((response) => response.json())
      .then(async (data) => {
        setCows(data)

        const summariesData = {}

        await Promise.all(
          data.map(async (cow) => {
            const response = await fetch(
              `http://localhost:8080/cows/${cow.id}/production-summary`
            )

            const summary = await response.json()
            summariesData[cow.id] = summary
          })
        )

        setSummaries(summariesData)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Erreur :', error)
        setLoading(false)
      })
  }, [])

  const cowsWithAlerts = cows.filter((cow) => {
    const summary = summaries[cow.id]
    return summary?.alert === true
  })

  return (
    <section className="alerts-page">
      <Header />

      <div className="alerts-title">
        <div>
          <h2>Alertes</h2>
          <p>
            {cowsWithAlerts.length} vache
            {cowsWithAlerts.length > 1 ? 's' : ''} à surveiller
          </p>
        </div>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : cowsWithAlerts.length === 0 ? (
        <div className="no-alerts">
          <span>✅</span>
          <h3>Aucune alerte</h3>
          <p>Tout va bien dans le troupeau aujourd'hui.</p>
        </div>
      ) : (
        <div className="alerts-list">
          {cowsWithAlerts.map((cow) => {
            const summary = summaries[cow.id]

            return (
              <article className="alert-card" key={cow.id}>
                <div className="alert-card-left">
                  <div className="alert-icon">
                    🔔
                  </div>

                  <div>
                    <div className="alert-name">
                      <h3>{cow.name}</h3>

                      <span className="alert-badge">
                        À surveiller
                      </span>
                    </div>

                    <p className="cow-identifier">
                      {cow.identifier}
                    </p>

                    <p className="alert-message">
                      Baisse de production détectée.
                    </p>
                  </div>
                </div>

                <div className="alert-data">
                  <div>
                    <span>Dernière production</span>
                    <strong>{summary.latestLiters} L</strong>
                  </div>

                  <div>
                    <span>Moyenne</span>
                    <strong>{summary.averageLiters} L</strong>
                  </div>

                  <div>
                    <span>Baisse</span>
                    <strong className="drop-value">
                      ↓ {summary.dropPercentage} %
                    </strong>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default Alerts