var re = /^(\d+)[x]?\s+(.+?)\s*$/;
var blank = /^\s*$/;
$("#create_button").click(()=>{
  var val = $("#cards_area").val().split('\n');
  data = [];
  for (var i = 0; i < val.length; i++){
    if (blank.test(val[i])) continue;
    var line = re.exec(val[i]);
    if (line == null || line.length < 3){
      alert('Error parsing input ' + val[i] + '.\nPlease use the format: \n(Amount) (Name)')
      return;
    }
    data.push({'amount':parseInt(line[1]), 'name':line[2]});
  }
  $.post('/PlainProxy/proxy', {'cards':JSON.stringify(data)})
      .done((res) => {
        window.history.pushState({'name': 'Poor Proxy'}, 'index', '/');
        $('body').html(res);
      })
      .fail((xhr, status, err) => {
        alert(xhr.responseText);
      });
});
