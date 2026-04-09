const Groq = require('groq-sdk');

// Instantiate Groq. Handle missing API key gracefully for local dev.
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'dummy_key' });

const systemPrompt = `You are the StoryForge Engine, a master AI storyteller. 
Your goal is to progress a dynamic narrative based on the user's chosen genre and previous choices.
Write compelling, highly engaging, and non-repetitive prose. Drive the plot forward dramatically with each step.
You MUST output your response in STRICT JSON format, exactly matching this schema:
{
  "text": "The next 4-6 lines of the narrative scenario progressing the story. Do NOT repeat previous text. Make it gripping.",
  "setting": "Brief 1-2 words setting for image generation (e.g., 'dark forest', 'neon city')",
  "mood": "Brief 1 word mood (e.g., 'tense', 'calm', 'chaotic')",
  "isTerminal": boolean, // Set to true ONLY if the story is concluding or the player reaches an end.
  "choices": [ // If isTerminal is true, this array MUST be empty [].
    { "text": "Choice 1 text...", "score": 20 },
    { "text": "Choice 2 text...", "score": 40 },
    { "text": "Choice 3 text...", "score": 60 }
  ]
}
Do not include any reasoning, markdown formatting, or text outside the JSON object. Keep choices distinct and under 15 words.`;

const fallbackPayload = {
  text: "The fabric of this realm seems temporally unstable right now. You must carefully navigate the distortion.",
  setting: "void",
  mood: "unstable",
  choices: [
    { text: "Try to recalibrate your neural link.", score: 10 },
    { text: "Push forward blindly through the static.", score: 20 },
    { text: "Wait for the system to stabilize.", score: 5 }
  ]
};

const aiService = {
  generateStorySegment: async (context, genre, previousChoice = null, isEnding = false, startPrompt = null) => {
    // If no real API key is set, instantly return the fallback payload to allow the UI to function.
    if (!process.env.GROQ_API_KEY) {
      console.warn("WARNING: No GROQ_API_KEY detected. Returning fallback mock data.");
      return new Promise(resolve => setTimeout(() => resolve(fallbackPayload), 500)); // 500ms delay to simulate network
    }

    const promptContext = context ? JSON.stringify(context.map(c => c.node ? c.node.text : c.choice)) : 'None. Begin the epic story.';
    const phaseInstructions = isEnding 
      ? `This is the epic conclusion! Wrap up the story spectacularly based on the user's final choice. Set 'isTerminal' to true and leave the 'choices' array empty.`
      : startPrompt ? `Generate the start of the story using exactly this premise/scenario: "${startPrompt}"` 
      : `Generate the next segment of the story.`;

    const prompt = `Genre: ${genre}\nPrevious Context: ${promptContext}\nUser chose: ${previousChoice || 'N/A: This is the start of the story.'}\n${phaseInstructions}`;
    
    try {
      const response = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        model: 'llama-3.3-70b-versatile',
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const jsonStr = response.choices[0].message.content;
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error("AI Generation Error from Groq:", error.message);
      return fallbackPayload;
    }
  }
};

module.exports = aiService;