const staticMappings = {
  'fantasy': 'https://picsum.photos/seed/fantasy/1920/1080?blur=2',
  'cyberpunk': 'https://picsum.photos/seed/cyber/1920/1080?blur=2',
  'scifi': 'https://picsum.photos/seed/scifi/1920/1080?blur=2',
  'horror': 'https://picsum.photos/seed/dark/1920/1080?blur=2',
  'romance': 'https://picsum.photos/seed/love/1920/1080?blur=2',
  'action': 'https://picsum.photos/seed/action/1920/1080?blur=2',
  'adventure': 'https://picsum.photos/seed/mountain/1920/1080?blur=2',
  'mystery': 'https://picsum.photos/seed/detective/1920/1080?blur=2',
  'drama': 'https://picsum.photos/seed/rain/1920/1080?blur=2',
  'default': 'https://picsum.photos/seed/nebula/1920/1080?blur=2'
};

const imageService = {
  generateImage: async (setting, mood, genre) => {
    // HYBRID IMAGE APPROACH:
    // In a fully integrated production environment or if HF_API_KEY is available:
    // We would fire a non-blocking asynchronous fetch to HuggingFace (e.g. stable-diffusion).
    // Utilizing AbortSignal to enforce a strict timeout of e.g. <1000ms.
    // If it fails or times out, we catch the error and immediately fall back.

    // To ensure a blazing fast hackathon experience and $0 cost:
    // We instantly formulate a dynamic but reliable image using Unsplash/Picsum via seed logic,
    // backed entirely by genre/mood metadata derived from the AI engine.

    // 1. Get genre base mapping directly
    const key = genre ? genre.toLowerCase() : 'default';
    const fallbackUrl = staticMappings[key] || staticMappings['default'];
    
    // 2. We can dynamically seed a URL if setting and mood are provided by AI
    if (setting && mood) {
      // Create a unique deterministic string representing the scene
      const seedStr = encodeURIComponent(`${setting}-${mood}-${genre}`);
      // return a dynamically seeded abstract image URL that loads fast
      return `https://picsum.photos/seed/${seedStr}/1920/1080?blur=2`;
    }

    // 3. Absolute fallback
    return fallbackUrl;
  }
};

module.exports = imageService;