import Anthropic from '@anthropic-ai/sdk';
import crypto from 'crypto';
import { ANTHROPIC_API_KEY, ANTHROPIC_MODEL } from '../config/env.js';

// Expanded creative library for dynamic, varied fallback results in demo/offline mode
const VIBE_LIBRARIES = {
  aesthetic: {
    moods: [
      'Dreamy Golden Hour & Ethereal Hues',
      'Velvet Twilight & Minimalist Solitude',
      'Sun-Drenched Nostalgia & Soft Shadows',
      'Vintage Grain & Pastel Horizons'
    ],
    captions: [
      { tone: 'Poetic', text: 'Soft light catching quiet moments that feel like poetry.' },
      { tone: 'Minimalist', text: 'Living in the palette of sunlit memories.' },
      { tone: 'Artistic', text: 'Where whispers of color meet the calm of the day.' },
      { tone: 'Atmospheric', text: 'Chasing the kind of light that makes the world pause.' },
      { tone: 'Dreamy', text: 'Framed in golden warmth and fleeting seconds.' },
      { tone: 'Cinematic', text: 'Every shadow tells a secret the sun left behind.' }
    ],
    songs: [
      { title: 'Golden Hour', artist: 'JVKE' },
      { title: 'Mystery of Love', artist: 'Sufjan Stevens' },
      { title: 'Apocalypse', artist: 'Cigarettes After Sex' },
      { title: 'Coffee', artist: 'beabadoobee' },
      { title: 'Fade Into You', artist: 'Mazzy Star' },
      { title: 'Space Song', artist: 'Beach House' },
      { title: 'Resonance', artist: 'HOME' },
      { title: 'Chamber of Reflection', artist: 'Mac DeMarco' }
    ]
  },
  funny: {
    moods: [
      'Playful Chaos & Unfiltered Smiles',
      'Accidental Masterpiece & High Drama',
      'Zero Regrets & Maximum Sarcasm',
      'Candid Blooper Energy'
    ],
    captions: [
      { tone: 'Sarcastic', text: 'Proof that I can occasionally look like I have my life together.' },
      { tone: 'Witty', text: 'My camera roll is 99% deleted blurry shots and this masterpiece.' },
      { tone: 'Relatable', text: '10/10 would recommend doing absolutely nothing in style.' },
      { tone: 'Playful', text: 'I woke up like this... after 3 alarms and 2 coffees.' },
      { tone: 'Self-Deprecating', text: 'May look like peace, but chaos is calculating inside.' },
      { tone: 'Cheeky', text: 'Professional overthinker posing casually.' }
    ],
    songs: [
      { title: 'Good as Hell', artist: 'Lizzo' },
      { title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars' },
      { title: 'Levitating', artist: 'Dua Lipa' },
      { title: 'I Love It', artist: 'Icona Pop ft. Charli XCX' },
      { title: 'Blinding Lights', artist: 'The Weeknd' },
      { title: 'About Damn Time', artist: 'Lizzo' },
      { title: 'Shut Up and Dance', artist: 'WALK THE MOON' }
    ]
  },
  romantic: {
    moods: [
      'Tender Warmth & Timeless Romance',
      'Electric Chemistry & Starlit Whispers',
      'Pure Serenade & Velvet Heartbeats',
      'Cinematic Love Story In Real Time'
    ],
    captions: [
      { tone: 'Heartfelt', text: 'Every love story is beautiful, but ours is my favorite chapter.' },
      { tone: 'Sweet', text: 'With you, even ordinary days feel like a cinematic daydream.' },
      { tone: 'Soulful', text: 'Two souls, one rhythm, infinite memories.' },
      { tone: 'Passionate', text: 'Finding forever in the spaces between your smiles.' },
      { tone: 'Tender', text: 'You are the calm in my storm and the song in my heart.' },
      { tone: 'Poetic', text: 'If home is a feeling, then I found mine right here.' }
    ],
    songs: [
      { title: 'Lover', artist: 'Taylor Swift' },
      { title: 'Until I Found You', artist: 'Stephen Sanchez' },
      { title: 'Perfect', artist: 'Ed Sheeran' },
      { title: 'Adore You', artist: 'Harry Styles' },
      { title: 'Fly Me to the Moon', artist: 'Frank Sinatra' },
      { title: 'La Vie En Rose', artist: 'Daniela Andrade' },
      { title: 'Say You Won\'t Let Go', artist: 'James Arthur' }
    ]
  },
  motivational: {
    moods: [
      'Bold Ambition & Relentless Drive',
      'Unyielding Focus & Victorious Energy',
      'Summit Mindset & Fearless Momentum',
      'Hustle in Silence & Shine in Light'
    ],
    captions: [
      { tone: 'Inspiring', text: 'Small steps every day pave the road to monumental victories.' },
      { tone: 'Empowering', text: 'Doubt whispers fear, but courage defines destiny.' },
      { tone: 'Unstoppable', text: 'Building the future one focused hour at a time.' },
      { tone: 'Bold', text: 'Turn your scars into stars and keep climbing.' },
      { tone: 'Grit', text: 'The secret to getting ahead is simply getting started.' },
      { tone: 'Visionary', text: 'Don\'t wait for opportunity. Create the blueprint yourself.' }
    ],
    songs: [
      { title: 'Lose Yourself', artist: 'Eminem' },
      { title: 'Eye of the Tiger', artist: 'Survivor' },
      { title: 'Stronger', artist: 'Kanye West' },
      { title: 'Believer', artist: 'Imagine Dragons' },
      { title: 'Hall of Fame', artist: 'The Script ft. will.i.am' },
      { title: 'Can\'t Hold Us', artist: 'Macklemore & Ryan Lewis' },
      { title: 'Remember The Name', artist: 'Fort Minor' }
    ]
  },
  any: {
    moods: [
      'Vibrant Atmosphere & Modern Beats',
      'Eclectic Pulse & Urban Aura',
      'Free Spirit & Ambient Frequency',
      'Chameleon Vibe with High Voltage'
    ],
    captions: [
      { tone: 'Effortless', text: 'Capturing moments that speak louder than words.' },
      { tone: 'Candid', text: 'Chasing the light, living in the present pulse.' },
      { tone: 'Reflective', text: 'A snapshot of today that tomorrow will reminisce.' },
      { tone: 'Cool', text: 'No filter needed when the frequency is right.' },
      { tone: 'Bold', text: 'Life moves fast—make sure you like the soundtrack.' },
      { tone: 'Electric', text: 'Vibrating on a wavelength made of pure good energy.' }
    ],
    songs: [
      { title: 'Midnight City', artist: 'M83' },
      { title: 'Electric Feel', artist: 'MGMT' },
      { title: 'Heat Waves', artist: 'Glass Animals' },
      { title: 'As It Was', artist: 'Harry Styles' },
      { title: 'Stargazing', artist: 'Kygo' },
      { title: 'Tongue Tied', artist: 'GROUPLOVE' },
      { title: 'Walking On A Dream', artist: 'Empire of the Sun' }
    ]
  }
};

/**
 * Helper to pick randomized unique items
 */
function shufflePick(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Generate Captions and Songs using Anthropic API (model claude-sonnet-4-6)
 */
export async function generateCaptionsAndSongs(imageBuffer, mimeType, vibe = 'any') {
  const normalizedVibe = vibe?.toLowerCase().trim() || 'any';
  const library = VIBE_LIBRARIES[normalizedVibe] || VIBE_LIBRARIES.any;

  // If no API key configured or placeholder, return dynamic demo data
  if (!ANTHROPIC_API_KEY || ANTHROPIC_API_KEY === 'your_anthropic_api_key_here') {
    console.log(`[Anthropic Service] Running in high-performance demo mode for vibe: ${normalizedVibe}`);
    
    // Pick random mood from library
    const randomMood = library.moods[Math.floor(Math.random() * library.moods.length)];
    const captions = shufflePick(library.captions, 3);
    const songs = shufflePick(library.songs, 5);

    return {
      mood: randomMood,
      captions,
      songs,
      _isMock: true
    };
  }

  const anthropic = new Anthropic({
    apiKey: ANTHROPIC_API_KEY
  });

  const base64Image = imageBuffer.toString('base64');

  const systemPrompt = `You are Captune, an elite AI creative director specializing in social media curation, aesthetics, and music pairing.
Analyze the provided image and the requested vibe to craft evocative captions and curated song pairings.
Respond ONLY with a valid, raw JSON object (no markdown, no backticks, no explanatory text).

JSON format strictly required:
{
  "mood": "string - vivid 3 to 6 word description of visual tone and energy",
  "captions": [
    { "tone": "Short tone label (e.g. Poetic, Witty, Aesthetic, Deep, Minimalist)", "text": "The caption text with relevant emojis" },
    { "tone": "...", "text": "..." },
    { "tone": "...", "text": "..." }
  ],
  "songs": [
    { "title": "Song Title", "artist": "Artist Name" },
    { "title": "Song Title", "artist": "Artist Name" },
    { "title": "Song Title", "artist": "Artist Name" },
    { "title": "Song Title", "artist": "Artist Name" },
    { "title": "Song Title", "artist": "Artist Name" }
  ]
}`;

  const userPrompt = `Target Vibe: "${normalizedVibe}".
Analyze the lighting, subject, mood, color palette, and setting in this photo.
Produce exactly 3 tailored captions and 5 perfect song recommendations matching the vibe.`;

  // Fallback chain for Anthropic models
  const modelsToTry = [
    ANTHROPIC_MODEL,
    'claude-3-7-sonnet-20250219',
    'claude-3-5-sonnet-20241022',
    'claude-3-5-haiku-20241022'
  ];
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`[Anthropic Service] Requesting analysis using model: ${modelName}`);
      const response = await anthropic.messages.create({
        model: modelName,
        max_tokens: 1200,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mimeType,
                  data: base64Image
                }
              },
              {
                type: 'text',
                text: userPrompt
              }
            ]
          }
        ]
      });

      let responseText = response.content?.[0]?.text;
      if (!responseText) {
        throw new Error('Received empty response from Anthropic API');
      }

      // Remove thinking tags if present
      responseText = responseText.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '');

      // Extract JSON using regex boundary
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not find JSON structure in Anthropic response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // Validate required schema
      if (!parsed.mood || !Array.isArray(parsed.captions) || !Array.isArray(parsed.songs)) {
        throw new Error('Anthropic response did not match required format');
      }

      return {
        mood: String(parsed.mood),
        captions: parsed.captions.slice(0, 3).map(c => ({
          tone: String(c.tone || 'General'),
          text: String(c.text || '')
        })),
        songs: parsed.songs.slice(0, 5).map(s => ({
          title: String(s.title || 'Untitled'),
          artist: String(s.artist || 'Unknown Artist')
        }))
      };
    } catch (err) {
      console.warn(`[Anthropic Service] Attempt with model ${modelName} failed:`, err.message);
      lastError = err;
      if (err.status === 404 || err.message?.includes('not_found')) {
        continue;
      }
      if (err.status === 401 || err.status === 400 || err.status === 429) {
        throw err;
      }
    }
  }

  throw lastError || new Error('Failed to generate analysis from Anthropic API');
}
