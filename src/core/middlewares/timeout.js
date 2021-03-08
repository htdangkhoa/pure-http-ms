const timeoutMiddleware = (time) => {
  const delay = time;

  return (req, res, next) => {
    const id = setTimeout(() => {
      req.timedout = true;

      req.emit('timeout', delay);
    }, delay);

    req.on('timeout', () => {
      res.status(503);

      const error = new Error('Response timeout.', 'ETIMEDOUT');
      error.code = 'ETIMEDOUT';
      error.timeout = delay;

      return next(error);
    });

    req.clearTimeout = () => {
      clearTimeout(id);
    };

    req.timedout = false;

    res.on('finish', () => clearTimeout(id));

    next();
  };
};

export default timeoutMiddleware;
