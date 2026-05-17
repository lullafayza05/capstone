import landingIllustration from '../assets/logo.png'

function LandingPage({ onLogin, onSignup }) {
  return (
    <section className="public-screen public-landing">
      <img
        className="public-landing__art"
        src={landingIllustration}
        alt="Ilustrasi pengaduan masyarakat"
      />
      <div className="aduin-logo aduin-logo--large">ADUIN</div>
      <p className="public-landing__tagline">Pusat Pengaduan Masyarakat Desa Canden</p>
      <div className="public-landing__actions">
        <button type="button" className="btn primary full" onClick={onLogin}>
          Masuk
        </button>
        <button type="button" className="btn primary full" onClick={onSignup}>
          Buat Akun
        </button>
      </div>
    </section>
  )
}

export default LandingPage
