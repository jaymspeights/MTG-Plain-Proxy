$(() => {
  $('.mana-cost').each((i, li) => {
    $(li).text($(li).text().replace(/[{]/g, "").replace(/[}]/g, ""));
  });
  var start = new Date().getTime();
  $('.sizeable').each((i, li) => {
    var default_size = $(li).css('font-size');
    var font_size = parseInt(default_size);
    console.log($(li).text(), font_size)
    while (true) {
      var text_height = $(li).height();
      $(li).css('font-size', (font_size))
      var div_height = $(li).parent().height();
      if (parseInt(div_height) >= parseInt(text_height)) break;
      font_size = font_size-1;
      if (font_size <= 0) {
        $(li).css('font-size', default_size);
        break;
      }
    }
  });
});
