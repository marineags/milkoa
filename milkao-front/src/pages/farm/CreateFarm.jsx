import { useState } from 'react'
import './CreateFarm.css'

function CreateFarm({ user, onFarmCreated }) {
  const [name, setName] = useState('')
  const [milkPricePerLiter, setMilkPricePerLiter] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      const response = await fetch('http://localhost:8080/farms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          milkPricePerLiter: Number(milkPricePerLiter),
          userId: user.id,
        }),
      })

      if (!response.ok) {
        setError('Impossible de créer la ferme')
        return
      }

      const farm = await response.json()
      onFarmCreated(farm)
    } catch (error) {
      console.error('Erreur création ferme :', error)
      setError('Impossible de contacter le serveur')
    }
  }

  return (
    <div className="create-farm-page">
      <div className="create-farm-card">
        <h1>Créez votre ferme</h1>
        <p>
          Renseignez quelques informations pour commencer à utiliser Milkao.
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            Nom de la ferme
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex : Ferme des Prés"
              required
            />
          </label>

          <label>
            Prix du lait par litre
            <input
              type="number"
              step="0.01"
              min="0"
              value={milkPricePerLiter}
              onChange={(event) => setMilkPricePerLiter(event.target.value)}
              placeholder="0.48"
              required
            />
          </label>

          {error && <p className="create-farm-error">{error}</p>}

          <button type="submit">
            Créer ma ferme
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateFarm