import React, { useState, useEffect } from 'react';
import './Teams.css';

const Teams = () => {
  const [teams, setTeams] = useState(() => {
    const savedTeams = localStorage.getItem('padelTeams');
    return savedTeams ? JSON.parse(savedTeams) : [];
  });
  
  const [showForm, setShowForm] = useState(false);
  const [currentTeam, setCurrentTeam] = useState({
    id: null,
    name: '',
    logo: null,
    logoPreview: '',
    players: [
      { id: 1, name: '', level: 'Principiante', photo: null, photoPreview: '' },
      { id: 2, name: '', level: 'Principiante', photo: null, photoPreview: '' }
    ]
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    localStorage.setItem('padelTeams', JSON.stringify(teams));
  }, [teams]);

  const handleShowForm = () => {
    setShowForm(true);
    setIsEditing(false);
    setCurrentTeam({
      id: null,
      name: '',
      logo: null,
      logoPreview: '',
      players: [
        { id: 1, name: '', level: 'Principiante', photo: null, photoPreview: '' },
        { id: 2, name: '', level: 'Principiante', photo: null, photoPreview: '' }
      ]
    });
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleTeamNameChange = (e) => {
    setCurrentTeam({ ...currentTeam, name: e.target.value });
  };

  const handlePlayerChange = (id, field, value) => {
    setCurrentTeam({
      ...currentTeam,
      players: currentTeam.players.map(player =>
        player.id === id ? { ...player, [field]: value } : player
      )
    });
  };

  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setCurrentTeam({
          ...currentTeam,
          logo: file,
          logoPreview: reader.result
        });
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handlePlayerPhotoChange = (playerId, e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setCurrentTeam({
          ...currentTeam,
          players: currentTeam.players.map(player =>
            player.id === playerId ? 
            { ...player, photo: file, photoPreview: reader.result } : 
            player
          )
        });
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!currentTeam.name.trim()) {
      alert('Inserisci il nome della squadra');
      return;
    }
    
    if (currentTeam.players.some(player => !player.name.trim())) {
      alert('Inserisci i nomi di tutti i giocatori');
      return;
    }
    
    if (isEditing) {
      setTeams(teams.map(team => 
        team.id === currentTeam.id ? currentTeam : team
      ));
    } else {
      const newTeam = {
        ...currentTeam,
        id: Date.now()
      };
      setTeams([...teams, newTeam]);
    }
    
    setShowForm(false);
  };

  const handleEdit = (team) => {
    setCurrentTeam(team);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questa squadra?')) {
      setTeams(teams.filter(team => team.id !== id));
    }
  };

  return (
    <div className="container teams-container">
      <div className="page-header">
        <h1 className="page-title">Gestione Squadre</h1>
        <p>Crea e gestisci le squadre per il tuo torneo di padel</p>
      </div>
      
      {!showForm ? (
        <>
          <div className="teams-actions">
            <button className="btn-primary" onClick={handleShowForm}>
              Aggiungi Squadra
            </button>
          </div>
          
          {teams.length === 0 ? (
            <div className="no-teams">
              <p>Non ci sono squadre. Aggiungi la tua prima squadra!</p>
            </div>
          ) : (
            <div className="teams-grid">
              {teams.map(team => (
                <div className="team-card" key={team.id}>
                  <div className="team-header">
                    {team.logoPreview ? (
                      <div className="team-logo">
                        <img src={team.logoPreview} alt={`Logo ${team.name}`} />
                      </div>
                    ) : (
                      <div className="team-logo team-logo-placeholder">
                        {team.name.charAt(0)}
                      </div>
                    )}
                    <h2 className="team-name">{team.name}</h2>
                  </div>
                  
                  <div className="team-players">
                    <h3>Giocatori</h3>
                    <ul>
                      {team.players.map(player => (
                        <li key={player.id}>
                          <div className="player-info">
                            {player.photoPreview ? (
                              <div className="player-photo">
                                <img src={player.photoPreview} alt={`Foto ${player.name}`} />
                              </div>
                            ) : (
                              <div className="player-photo player-photo-placeholder">
                                {player.name.charAt(0)}
                              </div>
                            )}
                            <span className="player-name">{player.name}</span>
                          </div>
                          <span className={`player-level level-${player.level.toLowerCase()}`}>
                            {player.level}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="team-actions">
                    <button 
                      className="btn-secondary" 
                      onClick={() => handleEdit(team)}
                    >
                      Modifica
                    </button>
                    <button 
                      className="btn-danger" 
                      onClick={() => handleDelete(team.id)}
                    >
                      Elimina
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="team-form-container">
          <form className="team-form" onSubmit={handleSubmit}>
            <h2>{isEditing ? 'Modifica Squadra' : 'Nuova Squadra'}</h2>
            
            <div className="form-group">
              <label htmlFor="teamName">Nome Squadra</label>
              <input
                type="text"
                id="teamName"
                value={currentTeam.name}
                onChange={handleTeamNameChange}
                placeholder="Inserisci il nome della squadra"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="teamLogo">Logo Squadra</label>
              <input
                type="file"
                id="teamLogo"
                onChange={handleLogoChange}
                accept="image/*"
              />
              {currentTeam.logoPreview && (
                <div className="logo-preview">
                  <img src={currentTeam.logoPreview} alt="Logo Preview" />
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label>Giocatori</label>
              {currentTeam.players.map(player => (
                <div className="player-form-group" key={player.id}>
                  <div className="player-inputs">
                    <input
                      type="text"
                      value={player.name}
                      onChange={(e) => handlePlayerChange(player.id, 'name', e.target.value)}
                      placeholder={`Nome Giocatore ${player.id}`}
                      required
                    />
                    <select
                      value={player.level}
                      onChange={(e) => handlePlayerChange(player.id, 'level', e.target.value)}
                    >
                      <option value="Principiante">Principiante</option>
                      <option value="Intermedio">Intermedio</option>
                      <option value="Avanzato">Avanzato</option>
                      <option value="Professionista">Professionista</option>
                    </select>
                  </div>
                  <div className="player-photo-input">
                    <label htmlFor={`playerPhoto${player.id}`}>Foto Giocatore</label>
                    <input
                      type="file"
                      id={`playerPhoto${player.id}`}
                      onChange={(e) => handlePlayerPhotoChange(player.id, e)}
                      accept="image/*"
                    />
                    {player.photoPreview && (
                      <div className="player-photo-preview">
                        <img src={player.photoPreview} alt={`Foto ${player.name}`} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {isEditing ? 'Aggiorna Squadra' : 'Crea Squadra'}
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

export default Teams;