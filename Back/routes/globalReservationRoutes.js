const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const organizerOnly = require('../middlewares/organizerOnly');
const globalCtrl = require('../controllers/globalReservationController');

router.use(auth, organizerOnly);
router.get('/', globalCtrl.listAll);
router.get('/export', globalCtrl.exportCSV); 


module.exports = router;
