import { useState } from 'react'
import './Login.css'

function Login({ onLogin,onRegisterClick }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      if (!response.ok) {
        setError('Email ou mot de passe incorrect')
        return
      }

      const user = await response.json()

      console.log('Utilisateur connecté :', user)

      onLogin(user)
    } catch (error) {
      console.error('Erreur connexion :', error)
      setError('Impossible de contacter le serveur')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Milkao</h1>

        <p>Connectez-vous à votre exploitation</p>

        <form onSubmit={handleSubmit}>
          <label>
            Adresse e-mail
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
               placeholder="Adresse e-mail"
              required
            />
          </label>

          <div className="password-field">
  <input
    type={showPassword ? 'text' : 'password'}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Mot de passe"
  />

  <button
    type="button"
    className="password-toggle"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? '🙈' : '👁️'}
  </button>
</div>
<button
  type="button"
  className="forgot-password"
  onClick={() => alert('Réinitialisation du mot de passe bientôt disponible')}
>
  Mot de passe oublié ?
</button>
          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <button type="submit">
            Se connecter
          </button>
          <button
  type="button"
  onClick={onRegisterClick}
>
  Créer un compte
</button>
        </form>
      </div>
    </div>
  )
}

export default Login