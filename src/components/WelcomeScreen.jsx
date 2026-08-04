function WelcomeScreen({ onStart }) {
  return (
    <main className="murge-welcome">
      <section className="murge-welcome-card">
        <img
          className="murge-welcome-logo"
          src="/icons/icon-192.png"
          alt="Logo Murge"
        />

        <div className="murge-welcome-heading">
          <h1>Bienvenue sur Murge</h1>
          <p>
            Murge simplifie la prise de commandes de boissons lors
            des soirées, événements et buvettes.
          </p>
        </div>

        <div className="murge-install-guide">
          <h2>Installation en 10 secondes</h2>

          <article className="murge-install-card">
            <strong>🍎 iPhone</strong>
            <p>
              Ouvrez Murge avec <b>Safari</b>, puis :
            </p>
            <span>Partager → Ajouter à l’écran d’accueil</span>
          </article>

          <article className="murge-install-card">
            <strong>🤖 Android</strong>
            <p>
              Ouvrez Murge avec <b>Chrome</b>, puis :
            </p>
            <span>⋮ → Installer l’application</span>
          </article>
        </div>

        <button
          className="murge-welcome-start"
          type="button"
          onClick={onStart}
        >
          Commencer
        </button>

        <small>
          Ces instructions ne seront affichées qu’une seule fois.
        </small>
      </section>
    </main>
  );
}

export default WelcomeScreen;
