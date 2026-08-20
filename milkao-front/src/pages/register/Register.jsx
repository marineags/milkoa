import { useState } from 'react'
import './Register.css'

function Register({ onRegister, onBackToLogin }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      })

      if (!response.ok) {
        const message = await response.text()
        setError(message || "Erreur pendant l'inscription")
        return
      }

      const user = await response.json()

      onRegister(user)
    } catch (error) {
      console.error("Erreur inscription :", error)
      setError('Impossible de contacter le serveur')
    }
  }

  return (
  <div className="register-page">
  <div className="register-card">
        <h1>Créer un compte</h1>

        <p>Commencez à gérer votre exploitation avec Milkao</p>

        <form onSubmit={handleSubmit}>
          <label>
            Prénom
            <input
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </label>

          <label>
            Nom
            <input
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </label>

          <label>
            Adresse e-mail
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Mot de passe
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error && (
            <p className="register-error">
              {error}
            </p>
          )}

          <button type="submit">
            Créer mon compte
          </button>

          <button
            type="button"
            onClick={onBackToLogin}
          >
            Retour à la connexion
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register