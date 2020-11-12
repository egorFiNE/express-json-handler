module.exports = (fn) => {
  return async (req, res) => {
    let result = null;
    try {
      result = await fn(req, res);
    } catch (e) {
      if (!process.env.SILENCE_JSONHANDLER_ERROR) {
        console.error(e);
      }
      res.set(module.exports.DEFAULT_HEADERS).status(500).json(module.exports.DEFAULT_FAIL_RESPONSE);
      return;
    }

    if (result) {
      res.set(module.exports.DEFAULT_HEADERS).json(result);
    }
  };
};

module.exports.DEFAULT_HEADERS = {
  'Cache-Control': 'private, max-age=0, no-cache, must-revalidate',
  'Pragma': 'no-cache'
};

module.exports.DEFAULT_FAIL_RESPONSE = {
  success: false
};