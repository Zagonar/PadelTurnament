import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="container">
      <div className="home-container">
        <div className="hero-section">
          <h1 className="hero-title">Benvenuto nell'App Torneo di Padel</h1>
          <p className="hero-subtitle">
            Gestisci squadre, partite e statistiche del tuo torneo di padel in modo semplice ed efficace
          </p>
          <div className="hero-buttons">
            <Link to="/teams" className="btn-primary hero-btn">Gestisci Squadre</Link>
            <Link to="/matches" className="btn-secondary hero-btn">Visualizza Partite</Link>
          </div>
        </div>

        <div className="features-section">
          <h2 className="section-title">Funzionalità</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon team-icon"></div>
              <h3>Gestione Squadre</h3>
              <p>Crea e gestisci le squadre del torneo, aggiungendo giocatori e personalizzando i loghi.</p>
              <Link to="/teams" className="feature-link">Vai alle Squadre</Link>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon match-icon"></div>
              <h3>Gestione Partite</h3>
              <p>Organizza le partite, assegna le squadre e registra i risultati in tempo reale.</p>
              <Link to="/matches" className="feature-link">Vai alle Partite</Link>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon stats-icon"></div>
              <h3>Statistiche</h3>
              <p>Visualizza statistiche dettagliate sulle prestazioni delle squadre e dei giocatori.</p>
              <Link to="/statistics" className="feature-link">Vai alle Statistiche</Link>
            </div>
          </div>
        </div>

        <div className="additional-features-section">
          <h2 className="section-title">Nuove Funzionalità</h2>
          <div className="additional-features-grid">
            <div className="feature-card">
              <div className="feature-icon booking-icon"></div>
              <h3>Prenotazione Campi</h3>
              <p>Prenota facilmente i campi da padel con un calendario integrato e visualizza la disponibilità in tempo reale.</p>
              <a href="#" className="feature-link">Prossimamente</a>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon ranking-icon"></div>
              <h3>Classifica Giocatori</h3>
              <p>Visualizza la classifica dei giocatori basata su punteggi, vittorie e prestazioni nelle partite.</p>
              <a href="#" className="feature-link">Prossimamente</a>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon notification-icon"></div>
              <h3>Sistema di Notifiche</h3>
              <p>Ricevi notifiche per partite imminenti, aggiornamenti del torneo e inviti da altri giocatori.</p>
              <a href="#" className="feature-link">Prossimamente</a>
            </div>

            <div className="feature-card">
              <div className="feature-icon tournament-icon"></div>
              <h3>Gestione Tornei</h3>
              <p>Crea e gestisci tornei con tabelloni ad eliminazione diretta, gironi e classifiche automatiche.</p>
              <a href="#" className="feature-link">Prossimamente</a>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon advanced-stats-icon"></div>
              <h3>Statistiche Avanzate</h3>
              <p>Analizza le tue prestazioni con statistiche dettagliate come percentuale di vittorie, punteggi medi e molto altro.</p>
              <a href="#" className="feature-link">Prossimamente</a>
            </div>
          </div>
        </div>

        <div className="quick-start-section">
          <h2 className="section-title">Inizia Subito</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Crea le Squadre</h3>
                <p>Aggiungi le squadre che parteciperanno al torneo e inserisci i giocatori</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Organizza le Partite</h3>
                <p>Crea il calendario delle partite e assegna le squadre</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Registra i Risultati</h3>
                <p>Inserisci i punteggi delle partite e tieni traccia dei risultati</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;