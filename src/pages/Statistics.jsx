import React, { useState, useEffect } from 'react';
import './Statistics.css';

const Statistics = () => {
  const [teams, setTeams] = useState(() => {
    const savedTeams = localStorage.getItem('padelTeams');
    return savedTeams ? JSON.parse(savedTeams) : [];
  });
  
  const [matches, setMatches] = useState(() => {
    const savedMatches = localStorage.getItem('padelMatches');
    return savedMatches ? JSON.parse(savedMatches) : [];
  });

  const [activeTab, setActiveTab] = useState('ranking');
  const [teamStats, setTeamStats] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);

  useEffect(() => {
    calculateTeamStats();
    getRecentMatches();
    getUpcomingMatches();
  }, [teams, matches]);

  const calculateTeamStats = () => {
    const stats = teams.map(team => {
      const teamMatches = matches.filter(match => 
        (match.team1Id === team.id || match.team1Id === team.id.toString() || 
         match.team2Id === team.id || match.team2Id === team.id.toString()) && 
        match.status === 'Completata'
      );

      let wins = 0;
      let losses = 0;
      let points = 0;
      let gamesPlayed = teamMatches.length;

      teamMatches.forEach(match => {
        const isTeam1 = match.team1Id === team.id || match.team1Id === team.id.toString();
        const score1 = parseInt(match.score1) || 0;
        const score2 = parseInt(match.score2) || 0;

        if (isTeam1) {
          if (score1 > score2) {
            wins++;
            points += 3;
          } else if (score1 === score2) {
            points += 1;
          } else {
            losses++;
          }
        } else {
          if (score2 > score1) {
            wins++;
            points += 3;
          } else if (score2 === score1) {
            points += 1;
          } else {
            losses++;
          }
        }
      });

      return {
        ...team,
        gamesPlayed,
        wins,
        losses,
        draws: gamesPlayed - wins - losses,
        points
      };
    });

    // Ordina per punti (decrescente)
    stats.sort((a, b) => b.points - a.points);
    setTeamStats(stats);
  };

  const getRecentMatches = () => {
    const completedMatches = matches.filter(match => match.status === 'Completata');
    completedMatches.sort((a, b) => new Date(b.date) - new Date(a.date));
    setRecentMatches(completedMatches.slice(0, 5));
  };

  const getUpcomingMatches = () => {
    const scheduledMatches = matches.filter(match => match.status === 'Programmata');
    scheduledMatches.sort((a, b) => new Date(a.date) - new Date(b.date));
    setUpcomingMatches(scheduledMatches.slice(0, 5));
  };

  const getTeamById = (id) => {
    return teams.find(team => team.id === parseInt(id) || team.id === id) || { name: 'Squadra non trovata' };
  };

  const renderRanking = () => {
    if (teamStats.length === 0) {
      return (
        <div className="no-data">
          <p>Non ci sono ancora dati sulla classifica. Completa alcune partite per vedere le statistiche.</p>
        </div>
      );
    }

    return (
      <div className="ranking-table-container">
        <table className="ranking-table">
          <thead>
            <tr>
              <th>Pos</th>
              <th>Squadra</th>
              <th>P</th>
              <th>G</th>
              <th>V</th>
              <th>N</th>
              <th>S</th>
              <th>Punti</th>
            </tr>
          </thead>
          <tbody>
            {teamStats.map((team, index) => (
              <tr key={team.id}>
                <td className="position">{index + 1}</td>
                <td className="team-info">
                  <div className="team-logo-small">
                    {team.logoPreview ? (
                      <img src={team.logoPreview} alt={`Logo ${team.name}`} />
                    ) : (
                      <div className="team-logo-placeholder-small">{team.name.charAt(0)}</div>
                    )}
                  </div>
                  <span>{team.name}</span>
                </td>
                <td>{team.gamesPlayed}</td>
                <td>{team.wins}</td>
                <td>{team.draws}</td>
                <td>{team.losses}</td>
                <td className="points">{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderRecentMatches = () => {
    if (recentMatches.length === 0) {
      return (
        <div className="no-data">
          <p>Non ci sono partite completate. Completa alcune partite per vedere i risultati recenti.</p>
        </div>
      );
    }

    return (
      <div className="matches-results">
        {recentMatches.map(match => {
          const team1 = getTeamById(match.team1Id);
          const team2 = getTeamById(match.team2Id);
          
          return (
            <div className="match-result-card" key={match.id}>
              <div className="match-result-header">
                <div className="match-date">{match.date}</div>
                <div className="match-location">{match.location}</div>
              </div>
              
              <div className="match-result-teams">
                <div className="result-team">
                  <div className="team-logo-small">
                    {team1.logoPreview ? (
                      <img src={team1.logoPreview} alt={`Logo ${team1.name}`} />
                    ) : (
                      <div className="team-logo-placeholder-small">{team1.name.charAt(0)}</div>
                    )}
                  </div>
                  <div className="team-name">{team1.name}</div>
                </div>
                
                <div className="match-score">
                  <span className="score">{match.score1}</span>
                  <span className="separator">-</span>
                  <span className="score">{match.score2}</span>
                </div>
                
                <div className="result-team">
                  <div className="team-logo-small">
                    {team2.logoPreview ? (
                      <img src={team2.logoPreview} alt={`Logo ${team2.name}`} />
                    ) : (
                      <div className="team-logo-placeholder-small">{team2.name.charAt(0)}</div>
                    )}
                  </div>
                  <div className="team-name">{team2.name}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderUpcomingMatches = () => {
    if (upcomingMatches.length === 0) {
      return (
        <div className="no-data">
          <p>Non ci sono partite programmate. Aggiungi nuove partite per vedere i prossimi incontri.</p>
        </div>
      );
    }

    return (
      <div className="upcoming-matches">
        {upcomingMatches.map(match => {
          const team1 = getTeamById(match.team1Id);
          const team2 = getTeamById(match.team2Id);
          
          return (
            <div className="upcoming-match-card" key={match.id}>
              <div className="upcoming-match-header">
                <div className="match-date-time">
                  <div className="match-date">{match.date}</div>
                  <div className="match-time">{match.time}</div>
                </div>
                <div className="match-location">{match.location}</div>
              </div>
              
              <div className="upcoming-match-teams">
                <div className="result-team">
                  <div className="team-logo-small">
                    {team1.logoPreview ? (
                      <img src={team1.logoPreview} alt={`Logo ${team1.name}`} />
                    ) : (
                      <div className="team-logo-placeholder-small">{team1.name.charAt(0)}</div>
                    )}
                  </div>
                  <div className="team-name">{team1.name}</div>
                </div>
                
                <div className="vs-small">VS</div>
                
                <div className="result-team">
                  <div className="team-logo-small">
                    {team2.logoPreview ? (
                      <img src={team2.logoPreview} alt={`Logo ${team2.name}`} />
                    ) : (
                      <div className="team-logo-placeholder-small">{team2.name.charAt(0)}</div>
                    )}
                  </div>
                  <div className="team-name">{team2.name}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="container statistics-container">
      <div className="page-header">
        <h1 className="page-title">Statistiche</h1>
        <p>Visualizza statistiche e risultati del torneo di padel</p>
      </div>
      
      <div className="stats-tabs">
        <button 
          className={`tab-button ${activeTab === 'ranking' ? 'active' : ''}`}
          onClick={() => setActiveTab('ranking')}
        >
          Classifica
        </button>
        <button 
          className={`tab-button ${activeTab === 'recent' ? 'active' : ''}`}
          onClick={() => setActiveTab('recent')}
        >
          Risultati Recenti
        </button>
        <button 
          className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Prossime Partite
        </button>
      </div>
      
      <div className="stats-content">
        {activeTab === 'ranking' && renderRanking()}
        {activeTab === 'recent' && renderRecentMatches()}
        {activeTab === 'upcoming' && renderUpcomingMatches()}
      </div>
    </div>
  );
};

export default Statistics;