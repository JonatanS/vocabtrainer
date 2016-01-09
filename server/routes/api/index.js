const router = require('express').Router();
module.exports = router;

router.use('/users', require('./users'));
router.use('/entries', require('./entries'));
router.use('/dictionaries', require('./dictionaries'));
router.use('/quizzes', require('./quizzes'));
router.use('/quizentries', require('./quizEntries'));

// Make sure this is declared //
// AFTER all of the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});
