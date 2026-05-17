import { useState } from 'react'
import landingIllustration from '../assets/logo.png'

function LoginPage({ onSubmit, onSignup }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const showError = (message) => {
    setErrorMessage(message)

    setTimeout(() => {
      setErrorMessage('')
    }, 3000)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!username.trim()) {
      showError('Nama pengguna wajib diisi')
      return
    }

    if (!password) {
      showError('Kata sandi wajib diisi')
      return
    }

    if (password.length < 6) {
      showError('Kata sandi minimal 6 karakter')
      return
    }

    onSubmit({
      username: username.trim(),
      password,
    })
  }

  return (
    <section className="public-screen public-screen--center">
      <form className="public-auth-container" onSubmit={handleSubmit}>
        <img
          className="public-landing__art"
          src={landingIllustration}
          alt="Ilustrasi pengaduan masyarakat"
        />

        <div className="aduin-logo aduin-logo--large">ADUIN</div>

        {errorMessage && (
          <div className="popup-error">
            {errorMessage}
          </div>
        )}

        <div className="public-auth-form">
          {/* Username */}
          <input
            className="field"
            type="text"
            placeholder="Masukkan nama pengguna"
            value={username}
            onChange={(event) => {
              let value = event.target.value
              value = value.replace(/\s/g, '')
              setUsername(value)
            }}
            required
          />

          {/* Password */}
          <input
            className="field"
            type="password"
            placeholder="Masukkan kata sandi"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button className="btn primary full" type="submit">
            Masuk
          </button>

          <button
            type="button"
            className="link-btn"
            onClick={onSignup}
          >
            Belum punya akun? Buat Akun
          </button>
        </div>

        <p className="public-landing__footer">@aduin2026</p>
      </form>
    </section>
  )
}

export default LoginPage