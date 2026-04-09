/**
 * SUPABASE DATABASE SERVICE
 * 
 * Functions to implement:
 * - createStory(genre) - Insert new story record, return session_id
 * - saveTurn(storyId, turnNumber, sceneText, choices, userChoice, imageUrl) - Save story turn
 * - getStoryHistory(sessionId) - Fetch story + all turns ordered by turn_number
 * - finalizeStory(sessionId, summary, characterIdentity) - Update story status to completed
 * - getStoryBySession(sessionId) - Get story metadata by session_id
 * 
 * All functions use async/await and proper error handling
 * 
 * Imports needed:
 * // const supabase = require('../config/supabase');
 */