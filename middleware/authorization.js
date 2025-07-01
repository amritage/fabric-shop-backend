module.exports = (...role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'fail',
        error: 'Unauthorized: No user found',
      });
    }
    const userRole = req.user.role;
    if (!role.includes(userRole)) {
      return res.status(403).json({
        status: 'fail',
        error: 'You are not authorized to access this',
      });
    }
    next();
  };
};
