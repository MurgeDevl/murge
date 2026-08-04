function AboutPage({ onBack }) {
  return (
    <section className="about-page">
      <button className="back-link" type="button" onClick={onBack}>
        ← Paramètres
      </button>

      <div className="about-card">
        <div className="about-logo">Murge</div>

        <p>
          Une application simple et rapide pour prendre les commandes
          de boissons pendant les soirées, événements et buvettes.
        </p>

        <div className="about-meta">
          <span>Version 1.0.0</span>
          <span>© 2026 Murge</span>
        </div>

        <a
          className="about-mail-address"
          href="mailto:infomurge@gmail.com"
        >
          infomurge@gmail.com
        </a>
      </div>
    </section>
  );
}

export default AboutPage;
