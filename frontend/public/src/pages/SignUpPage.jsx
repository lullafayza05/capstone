import { useState } from 'react'
import landingIllustration from '../assets/logo.png'

function SignupPage({ onSubmit, onLogin }) {
  const [username, setUsername] = useState('')
  const [emailName, setEmailName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const showError = (message) => {
    setErrorMessage(message)

    setTimeout(() => {
      setErrorMessage('')
    }, 3000)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    /* VALIDASI USERNAME */
    if (!username.trim()) {
      showError('Nama pengguna wajib diisi')
      return
    }

    /* VALIDASI EMAIL */
    if (!emailName.trim()) {
      showError('Email wajib diisi')
      return
    }

    /* VALIDASI PASSWORD */
    if (!password) {
      showError('Kata sandi wajib diisi')
      return
    }

    if (password.length < 6) {
      showError('Kata sandi minimal 6 karakter')
      return
    }

    /* VALIDASI KONFIRMASI */
    if (!confirmPassword) {
      showError('Konfirmasi kata sandi wajib diisi')
      return
    }

    if (password !== confirmPassword) {
      showError('Konfirmasi kata sandi tidak cocok')
      return
    }

    /* KIRIM DATA KE APP.JSX */
    onSubmit({
      fullName: username.trim(),
      username: username.trim(),
      email: emailName.trim(),
      password,
    })

    /* RESET FORM SETELAH BERHASIL */
    setUsername('')
    setEmailName('')
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <section className="public-screen public-screen--center">
      <form className="public-auth-container" onSubmit={handleSubmit}>
        {/* LOGO */}
        <img
          className="public-landing__art"
          src={landingIllustration}
          alt="Ilustrasi pengaduan masyarakat"
        />

        <div className="aduin-logo aduin-logo--large">ADUIN</div>

        {/* POPUP ERROR */}
        {errorMessage && (
          <div className="popup-error">
            {errorMessage}
          </div>
        )}

        <div className="public-auth-form">
          {/* USERNAME */}
          <input
            className="field"
            type="text"
            placeholder="Masukkan nama pengguna"
            value={username}
            onChange={(event) => {
              let value = event.target.value

              /* HAPUS SPASI */
              value = value.replace(/\s/g, '')

              setUsername(value)
            }}
            required
          />

          {/* EMAIL */}
          <div className="email-group">
            <input
              className="field email-input"
              type="text"
              placeholder="Masukkan email"
              value={emailName}
              onChange={(event) => {
                let value = event.target.value

                /* HAPUS @ */
                value = value.replace(/@/g, '')

                /* HAPUS gmail.com */
                value = value.replace(/gmail\.com/gi, '')

                /* HAPUS SPASI */
                value = value.replace(/\s/g, '')

                setEmailName(value)
              }}
              required
            />

            <span className="email-suffix">
              @gmail.com
            </span>
          </div>

          {/* PASSWORD */}
          <input
            className="field"
            type="password"
            placeholder="Masukkan kata sandi (min. 6 karakter)"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />

          {/* KONFIRMASI PASSWORD */}
          <input
            className="field"
            type="password"
            placeholder="Konfirmasi kata sandi"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            required
          />

          {/* TOMBOL DAFTAR */}
          <button
            className="btn primary full"
            type="submit"
          >
            Daftar
          </button>

          {/* PINDAH LOGIN */}
          <button
            type="button"
            className="link-btn"
            onClick={onLogin}
          >
            Sudah punya akun? Masuk
          </button>
        </div>
      </form>
    </section>
  )
}

export default SignupPage