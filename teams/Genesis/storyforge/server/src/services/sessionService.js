const { v4: uuidv4 } = require('uuid');

const sessions = new Map();

const sessionService = {
  createSession: (genre) => {
    const sessionId = uuidv4();
    const session = {
      id: sessionId,
      genre,
      history: [],
      score: 0,
      createdAt: Date.now()
    };
    sessions.set(sessionId, session);
    return session;
  },

  getSession: (sessionId) => {
    return sessions.get(sessionId);
  },

  updateSession: (sessionId, updates) => {
    const session = sessions.get(sessionId);
    if (!session) return null;
    
    const updated = { ...session, ...updates };
    sessions.set(sessionId, updated);
    return updated;
  },

  deleteSession: (sessionId) => {
    return sessions.delete(sessionId);
  }
};

module.exports = sessionService;
