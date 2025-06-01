module.exports = function organizerOnly(req, res, next) {
  if (!req.user || req.user.role !== 'organizer') {
    return res.status(403).json({ message: 'Solo para organizers' });
  }
  next();
};
