import React, { useState, useEffect } from 'react';
import './Matches.css';

const Matches = () => {
  const [matches, setMatches] = useState(() => {
    const savedMatches = localStorage.getItem('padelMatches');
    return savedMatches ? JSON.parse(savedMatches) : [];
  });
  
  const [teams, setTeams] = useState(() => {
    const savedTeams = localStorage.getItem('padelTeams');
    return savedTeams ? JSON.parse(savedTeams) : [];
  });
  
  const [showForm, setShowForm] = useState(false);
  const [currentMatch, setCurrentMatch] = useState({
    id: null,
    date: '',
    time: '',
    location: '',
    team1Id: '',
    team2Id: '',
    score1: '',
    score2: '',
    status: 'Programmata' // Programmata, In Corso, Completata
  });
  const [isEditing, setIsEditing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, scheduled, ongoing, completed

  useEffect(() => {
    localStorage.setItem('padelMatches', JSON.stringify(matches));
  }, [matches]);

  const handleShowForm = () => {
    setShowForm(true);
    setIsEditing(false);
    setCurrentMatch({
      id: null,
      date: '',
      time: '',
      location: '',
      team1Id: '',
      team2Id: '',
      score1: '',
      score2: '',
      status: 'Programmata'
    });
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentMatch({ ...currentMatch, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (currentMatch.team1Id === currentMatch.team2Id && currentMatch.team1Id !== '') {
      alert('Le due squadre devono essere diverse');
      return;
    }
    
    if (isEditing) {
      setMatches(matches.map(match => 
        match.id === currentMatch.id ? currentMatch : match
      ));
    } else {
      const newMatch = {
        ...currentMatch,
        id: Date.now()
      };
      setMatches([...matches, newMatch]);
    }
    
    setShowForm(false);
  };

  const handleEdit = (match) => {
    setCurrentMatch(match);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questa partita?')) {
      setMatches(matches.filter(match => match.id !== id));
    }
  };

  const handleUpdateStatus = (id, newStatus) => {
    setMatches(matches.map(match => 
      match.id === id ? { ...match, status: newStatus } : match
    ));
  };

  const handleUpdateScore = (id, team, score) => {
    setMatches(matches.map(match => {
      if (match.id === id) {
        const updatedMatch = { ...match };
        if (team === 1) {
          updatedMatch.score1 = score;
        } else {
          updatedMatch.score2 = score;
        }
        return updatedMatch;
      }
      return match;
    }));
  };

  const getTeamById = (id) => {
    return teams.find(team => team.id === parseInt(id) || team.id === id) || { name: 'Squadra non trovata' };
  };

  const getFilteredMatches = () => {
    switch (filter) {
      case 'scheduled':
        return matches.filter(match => match.status === 'Programmata');
      case 'ongoing':
        return matches.filter(match => match.status === 'In Corso');
      case 'completed':
        return matches.filter(match => match.status === 'Completata');
      default:
        return matches;
    }
  };

  const filteredMatches = getFilteredMatches();

  return (
    <div className="container matches-container">
      <div className="page-header">
        <h1 className="page-title">Gestione Partite</h1>
        <p>Organizza e gestisci le partite del tuo torneo di padel</p>
      </div>
      
      {!showForm ? (
        <>
          <div className="matches-actions">
            <div className="filter-controls">
              <label htmlFor="filter">Filtra per stato:</label>
              <select 
                id="filter" 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">Tutte le partite</option>
                <option value="scheduled">Programmate</option>
                <option value="ongoing">In Corso</option>
                <option value="completed">Completate</option>
              </select>
            </div>
            <button className="btn-primary" onClick={handleShowForm}>
              Aggiungi Partita
            </button>
          </div>
          
          {filteredMatches.length === 0 ? (
            <div className="no-matches">
              <p>Non ci sono partite {filter !== 'all' ? 'con questo stato' : ''}. Aggiungi una nuova partita!</p>
            </div>
          ) : (
            <div className="matches-list">
              {filteredMatches.map(match => {
                const team1 = getTeamById(match.team1Id);
                const team2 = getTeamById(match.team2Id);
                
                return (
                  <div className={`match-card status-${match.status.toLowerCase().replace(' ', '-')}`} key={match.id}>
                    <div className="match-header">
                      <div className="match-date-time">
                        <div className="match-date">{match.date}</div>
                        <div className="match-time">{match.time}</div>
                      </div>
                      <div className="match-location">{match.location}</div>
                      <div className={`match-status status-${match.status.toLowerCase().replace(' ', '-')}`}>
                        {match.status}
                      </div>
                    </div>
                    
                    <div className="match-teams">
                      <div className="team team1">
                        <div className="team-logo">
                          {team1.logoPreview ? (
                            <img src={team1.logoPreview} alt={`Logo ${team1.name}`} />
                          ) : (
                            <div className="team-logo-placeholder">{team1.name.charAt(0)}</div>
                          )}
                        </div>
                        <div className="team-name">{team1.name}</div>
                        {match.status !== 'Programmata' && (
                          <div className="team-score">
                            <input 
                              type="number" 
                              min="0"
                              value={match.score1} 
                              onChange={(e) => handleUpdateScore(match.id, 1, e.target.value)}
                              disabled={match.status === 'Completata'}
                            />
                          </div>
                        )}
                      </div>
                      
                      <div className="vs">VS</div>
                      
                      <div className="team team2">
                        <div className="team-logo">
                          {team2.logoPreview ? (
                            <img src={team2.logoPreview} alt={`Logo ${team2.name}`} />
                          ) : (
                            <div className="team-logo-placeholder">{team2.name.charAt(0)}</div>
                          )}
                        </div>
                        <div className="team-name">{team2.name}</div>
                        {match.status !== 'Programmata' && (
                          <div className="team-score">
                            <input 
                              type="number" 
                              min="0"
                              value={match.score2} 
                              onChange={(e) => handleUpdateScore(match.id, 2, e.target.value)}
                              disabled={match.status === 'Completata'}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="match-actions">
                      {match.status === 'Programmata' && (
                        <button 
                          className="btn-start" 
                          onClick={() => handleUpdateStatus(match.id, 'In Corso')}
                        >
                          Inizia Partita
                        </button>
                      )}
                      
                      {match.status === 'In Corso' && (
                        <button 
                          className="btn-complete" 
                          onClick={() => handleUpdateStatus(match.id, 'Completata')}
                        >
                          Completa Partita
                        </button>
                      )}
                      
                      <button 
                        className="btn-secondary" 
                        onClick={() => handleEdit(match)}
                      >
                        Modifica
                      </button>
                      
                      <button 
                        className="btn-danger" 
                        onClick={() => handleDelete(match.id)}
                      >
                        Elimina
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <div className="match-form-container">
          <form className="match-form" onSubmit={handleSubmit}>
            <h2>{isEditing ? 'Modifica Partita' : 'Nuova Partita'}</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Data</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={currentMatch.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="time">Ora</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={currentMatch.time}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="location">Luogo</label>
              <input
                type="text"
                id="location"
                name="location"
                value={currentMatch.location}
                onChange={handleInputChange}
                placeholder="Inserisci il luogo della partita"
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="team1Id">Squadra 1</label>
                <select
                  id="team1Id"
                  name="team1Id"
                  value={currentMatch.team1Id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleziona una squadra</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="team2Id">Squadra 2</label>
                <select
                  id="team2Id"
                  name="team2Id"
                  value={currentMatch.team2Id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleziona una squadra</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {isEditing && (
              <div className="form-group">
                <label htmlFor="status">Stato</label>
                <select
                  id="status"
                  name="status"
                  value={currentMatch.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Programmata">Programmata</option>
                  <option value="In Corso">In Corso</option>
                  <option value="Completata">Completata</option>
                </select>
              </div>
            )}
            
            {isEditing && currentMatch.status !== 'Programmata' && (
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="score1">Punteggio Squadra 1</label>
                  <input
                    type="number"
                    id="score1"
                    name="score1"
                    min="0"
                    value={currentMatch.score1}
                    onChange={handleInputChange}
                    required={currentMatch.status === 'Completata'}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="score2">Punteggio Squadra 2</label>
                  <input
                    type="number"
                    id="score2"
                    name="score2"
                    min="0"
                    value={currentMatch.score2}
                    onChange={handleInputChange}
                    required={currentMatch.status === 'Completata'}
                  />
                </div>
              </div>
            )}
            
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {isEditing ? 'Aggiorna Partita' : 'Crea Partita'}
              </button>
              <button type="button" className="btn-secondary" onClick={handleCloseForm}>
                Annulla
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Matches;