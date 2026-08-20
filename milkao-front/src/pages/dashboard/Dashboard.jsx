import { useEffect, useState } from 'react'
import './Dashboard.css'
import Header from '../../components/header/Header.jsx'

function Dashboard() {
  const [cows, setCows] = useState([])
  const [summaries, setSummaries] = useState({})
  const [loading, setLoading] = useState(true)
  const [feedCosts, setFeedCosts] = useState([])

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

  useEffect(() => {
    fetch('http://localhost:8080/feed-costs')
      .then((response) => response.json())
      .then((data) => {
        setFeedCosts(data)
      })
      .catch((error) => {
        console.error('Erreur feed costs :', error)
      })
  }, [])

  const cowsWithAlerts = cows.filter((cow) => {
    const summary = summaries[cow.id]

    return summary?.alert === true
  })

  const summariesList = Object.values(summaries)

  const validProductions = summariesList.filter(
    (summary) => summary?.latestLiters != null
  )

  const totalProduction = validProductions.reduce(
    (total, summary) => total + Number(summary.latestLiters || 0),
    0
  )

  const averageProduction =
    validProductions.length > 0
      ? totalProduction / validProductions.length
      : 0

  const today = new Date().toLocaleDateString('en-CA')

  const todayFeedCosts = feedCosts.filter(
    (cost) => cost.costDate === today
  )

  const totalFeedCostToday = todayFeedCosts.reduce(
    (total, cost) => total + Number(cost.amount),
    0
  )

  return (
    <section className="dashboard-page">
      <Header />

      <div className="dashboard-stats">
        <article className="dashboard-card">
          <span className="card-icon">✅</span>

          <div>
            <p>Vaches sans alerte</p>

            <h2>
              {loading
                ? '...'
                : cows.length - cowsWithAlerts.length}
            </h2>

            <span>État normal</span>
          </div>
        </article>

        <article className="dashboard-card">
          <span className="card-icon">🥛</span>

          <div>
            <p>Production actuelle</p>

            <h2>
              {loading
                ? '...'
                : `${totalProduction.toFixed(1)} L`}
            </h2>

            <span>
              Moyenne : {averageProduction.toFixed(1)} L / vache
            </span>
          </div>
        </article>

        <article className="dashboard-card">
          <span className="card-icon">🌾</span>

          <div>
            <p>Coût alimentation</p>

            <h2>
              {totalFeedCostToday.toFixed(2)} €
            </h2>

            <span>Aujourd'hui</span>
          </div>
        </article>

        <article className="dashboard-card">
          <span className="card-icon">🔔</span>

          <div>
            <p>Alertes</p>

            <h2>
              {loading
                ? '...'
                : `${cowsWithAlerts.length} vache${
                    cowsWithAlerts.length > 1 ? 's' : ''
                  }`}
            </h2>

            <span>À surveiller</span>
          </div>
        </article>
      </div>

      <div className="dashboard-grid">
        <article className="panel briefing">
          <div className="panel-title">
            <h2>Briefing du jour</h2>
          </div>

          {loading ? (
            <p>Chargement des données...</p>
          ) : (
            <ul>
              <li>🐄 {cows.length} vaches enregistrées</li>

              <li>
                🔔 {cowsWithAlerts.length} vache
                {cowsWithAlerts.length > 1 ? 's' : ''} à surveiller
              </li>
            </ul>
          )}
        </article>

        <article className="panel">
          <div className="panel-title">
            <h2>À surveiller aujourd'hui</h2>
          </div>

          <div className="cow-list">
            {loading && <p>Chargement...</p>}

            {!loading && cowsWithAlerts.length === 0 && (
              <p>Aucune alerte aujourd'hui ✅</p>
            )}

            {cowsWithAlerts.map((cow) => {
              const summary = summaries[cow.id]

              return (
                <div className="cow-row" key={cow.id}>
                  <div>
                    <strong>{cow.name}</strong>

                    <p>
                      Dernière production : {summary.latestLiters} L
                    </p>

                    <p>
                      Moyenne : {summary.averageLiters} L
                    </p>
                  </div>

                  <span className="badge danger">
                    ↓ {summary.dropPercentage} %
                  </span>
                </div>
              )
            })}
          </div>
        </article>

        <article className="panel">
          <div className="panel-title">
            <h2>État du troupeau</h2>
          </div>

          <div className="import-list">
            <div className="import-row">
              <span>Total</span>
              <strong>{loading ? '...' : cows.length}</strong>
            </div>

            <div className="import-row">
              <span>Avec alerte</span>

              <strong className="status-error">
                {loading ? '...' : cowsWithAlerts.length}
              </strong>
            </div>

            <div className="import-row">
              <span>Sans alerte</span>

              <strong className="status-ok">
                {loading
                  ? '...'
                  : cows.length - cowsWithAlerts.length}
              </strong>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}

export default Dashboard