const aiService = require('../services/aiService');
const imageService = require('../services/imageService');
const sessionService = require('../services/sessionService');

const startStory = async (req, res, next) => {
  try {
    const { genre } = req.body;
    if (!genre) return res.status(400).json({ success: false, error: "Genre is required." });

    const session = sessionService.createSession(genre);
    
    // Generate initial segment (blocking, but fast via Groq)
    const storySegment = await aiService.generateStorySegment(null, genre, null);
    
    // Fetch image (non-blocking from UI perspective, rapid fallback logic inside)
    const imageUrl = await imageService.generateImage(storySegment.setting, storySegment.mood, genre);
    
    const node = { ...storySegment, image: imageUrl };
    
    // Save system output to history
    session.history.push({ role: 'system', node });
    sessionService.updateSession(session.id, { history: session.history });

    res.json({
      success: true,
      sessionId: session.id,
      node
    });
  } catch (err) {
    next(err);
  }
};

const nextStory = async (req, res, next) => {
  try {
    const { sessionId, choiceText, choiceScore } = req.body;
    
    if (!sessionId || !choiceText) {
      return res.status(400).json({ success: false, error: "sessionId and choiceText are required." });
    }

    const session = sessionService.getSession(sessionId);
    if (!session) return res.status(404).json({ success: false, error: "Session not found or expired." });

    // 1. Update score
    const scoreVal = parseInt(choiceScore, 10);
    const updatedScore = session.score + (isNaN(scoreVal) ? 0 : scoreVal);
    
    // 2. Record user choice
    session.history.push({ role: 'user', choice: choiceText, score: choiceScore });
    
    // 3. Generate next segment using history array for context continuity
    // Prevent context window overload by slicing last 4 interactions
    const recentContext = session.history.slice(-4);
    
    // Conclude story after ~4 turns (start + 3 choices). History length will be 7 or more.
    const isEnding = session.history.length >= 7; 
    
    const storySegment = await aiService.generateStorySegment(recentContext, session.genre, choiceText, isEnding);
    
    // 4. Generate next image
    const imageUrl = await imageService.generateImage(storySegment.setting, storySegment.mood, session.genre);
    
    const node = { ...storySegment, image: imageUrl };

    // 5. Record system response
    session.history.push({ role: 'system', node });
    sessionService.updateSession(session.id, { history: session.history, score: updatedScore });

    res.json({
      success: true,
      sessionId: session.id,
      score: updatedScore,
      node
    });
  } catch (err) {
    next(err);
  }
};

const getSession = (req, res) => {
  const { sessionId } = req.params;
  const session = sessionService.getSession(sessionId);
  if (!session) return res.status(404).json({ success: false, error: "Session not found." });
  res.json({ success: true, session });
};

module.exports = {
  startStory,
  nextStory,
  getSession
};