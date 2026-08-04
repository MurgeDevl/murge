function SplashScreen() {
  return (
    <section className="murge-splash" aria-label="Chargement de Murge">
      <div className="murge-splash-logo-wrap">
        <img
          className="murge-splash-logo"
          src="/icons/icon-512.png"
          alt=""
        />

        <span className="murge-splash-bubble bubble-one" />
        <span className="murge-splash-bubble bubble-two" />
      </div>
    </section>
  );
}

export default SplashScreen;
