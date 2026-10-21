import multer from 'multer';

export const errorHandler = (err, req, res, next) => {
  console.error('[Error Handler]', err);

  // Handle Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File size exceeds 5 MB. Please upload a smaller image.'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        error: `Unexpected field '${err.field}'. Expected form field 'image'.`
      });
    }
    return res.status(400).json({
      error: `Upload error: ${err.message}`
    });
  }

  // Handle custom validation errors
  if (err.code === 'INVALID_FILE_TYPE') {
    return res.status(400).json({
      error: err.message
    });
  }

  // Handle custom or Anthropic API errors
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error occurred while processing your request.';

  res.status(status).json({
    error: message
  });
};
