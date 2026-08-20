function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        Project<span>Mate</span>
      </div>

      <div className="nav-links">
        <a href="#projects">Projects</a>
        <a href="#how-it-works">How It Works</a>
        <a href="#about">About</a>
      </div>

      <div className="nav-buttons">
        <button className="login-btn">Login</button>
        <button className="signup-btn">Get Started</button>
      </div>

    </nav>
  )
}

export default Navbar