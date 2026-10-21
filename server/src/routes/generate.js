import { Router } from 'express';
import { upload } from '../middlewares/upload.js';
import { generateRateLimiter } from '../middlewares/rateLimiter.js';
import { generateCaptionsAndSongs } from '../services/anthropicService.js';

const router = Router();

const VALID_VIBES = ['any', 'funny', 'aesthetic', 'romantic', 'motivational'];

router.post('/generate', generateRateLimiter, upload.single('image'), async (req, res, next) => {
  try {
    // Validate image presence
    if (!req.file) {
      return res.status(400).json({
        error: 'No image uploaded. Please provide an image file under the form field "image".'
      });
    }

    // Validate vibe
    let vibe = (req.body.vibe || 'any').toLowerCase().trim();
    if (!VALID_VIBES.includes(vibe)) {
      return res.status(400).json({
        error: `Invalid vibe "${vibe}". Allowed values are: ${VALID_VIBES.join(', ')}.`
      });
    }

    const result = await generateCaptionsAndSongs(
      req.file.buffer,
      req.file.mimetype,
      vibe
    );

    return res.json({
      mood: result.mood,
      captions: result.captions,
      songs: result.songs,
      ...(result._isMock ? { note: 'Demo mode active. Set ANTHROPIC_API_KEY in server/.env for live Claude Sonnet generation.' } : {})
    });
  } catch (error) {
    next(error);
  }
});

export default router;
