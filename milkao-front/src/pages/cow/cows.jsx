import { useEffect, useState } from 'react'
import './Cows.css'
import Header from '../../components/header/Header.jsx'

function Cows() {
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

  return (
    <section className="cows-page">
      <Header />

      <div className="cows-title">
        <div>
          <h2>Mes vaches</h2>
          <p>{cows.length} vache{cows.length > 1 ? 's' : ''} enregistrée{cows.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="cows-grid">
          {cows.map((cow) => {
            const summary = summaries[cow.id]

            return (
              <article className="cow-card" key={cow.id}>
                <div className="cow-card-top">
                  <div className="cow-avatar">
                    🐄
                  </div>

                  <div>
                    <h3>{cow.name}</h3>
                    <p>{cow.identifier}</p>
                  </div>

                  <span
                    className={
                      summary?.alert
                        ? 'cow-status alert'
                        : 'cow-status ok'
                    }
                  >
                    {summary?.alert ? 'À surveiller' : 'OK'}
                  </span>
                </div>

                <div className="cow-info">
                  <div>
                    <span>Statut</span>
                    <strong>{cow.status}</strong>
                  </div>

                  <div>
                    <span>Lactation</span>
                    <strong>N° {cow.lactationNumber}</strong>
                  </div>

                  <div>
                    <span>Jours de lactation</span>
                    <strong>{cow.lactationDays}</strong>
                  </div>
                </div>

                {summary && (
                  <div className="cow-production">
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
                      <strong
                        className={
                          summary.alert ? 'production-danger' : ''
                        }
                      >
                        {summary.dropPercentage} %
                      </strong>
                    </div>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default Cows