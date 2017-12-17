const mtg = require('mtgsdk');
var cards_col;
var engine = {};

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017';
MongoClient.connect(url, (err, client) => {
  if (err)  throw err;
  cards_col = client.db('MTG-Proxy').collection('cards');
});

function getCardData(name, callback) {
  cards_col.findOne({'name':name}, (err, result) => {
    if (err) throw err;
    if (result == null) {
      mtg.card.where({'name': '"'+name+'"'})
      .then(results => {
        if (results.length == 0) {
          callback(null, name + ' not found.')
          return;
        }
        cards_col.findOne({'name':name}, (err, result) => {
          if (result==null)
            cards_col.insertOne({'name':name, 'data':results[0]});
        });
        callback(results[0]);
      });
    }
    else {
      callback(result.data);
    }
  });
}

engine.getCards = function (data, callback) {
  var cards = [];
  var num = 0;
  for (var i = 0; i < data.length; i++) {
    if (data[i].amount < 1){
      data.splice(i, 1);
      i -= 1;
      continue;
    }
    num+=data[i].amount;
  }
  for (var i = 0; i < data.length; i++) {
    var name = data[i].name.toLowerCase();
    getCardData(name, buildCallback(data[i].amount));
  }

  function buildCallback(amt) {
     return function (data, err) {
      if (err) {
        callback(null, err);
        return;
      }
      var card = {'name': data.name, 'power':data.power, 'toughness':data.toughness,
          'type':data.type, 'manaCost':data.manaCost, 'text':data.text}
      for (var i = 0; i < data.types.length; i++)
        if (data.types[i] == "Land")
          card.land = true;
      for (var j = 0; j < amt; j++) {
        cards.push(card);
      }
      if (cards.length >= num) {
        callback(cards);
      }
    }
  }
}

module.exports = engine;
