var express = require('express');
var router = express.Router();
var card_engine = require('../card_engine');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', {'cards_proxied': card_engine.cards_proxied});
});

router.post('/proxy', (req, res) => {
  card_engine.getCards(JSON.parse(req.body.cards), (cards, err) => {
    if (err) {
      res.status(400).send(err);
      return;
    }
    res.render('result', {'cards':cards});
  });
});

module.exports = router;
