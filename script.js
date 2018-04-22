$(function() {

// Info Board

$('#eta').text(moment().format('kk:mm'));

setInterval(function(){

  var timeleft = $('#time-left').text();
  if (timeleft !== "0:00:00") {
    $('#time-left').text(
      moment.duration(timeleft).subtract(1, 's').format('h:mm:ss', { trim: false })
    );
  }

},1000);



$(document).on('change', 'td input', function() {

});


$(document).on('keypress', 'table td input', function(e) { // Enter
  if ( e.which == 13 ) {

    if ( $(this).parents('tr').is(':last-child') ) {

      $('table tbody').append('<tr><td><input class="input"><td><input class="input"><td><td><td><td><input class="input">');

      var i = $(this).parents('td').index() + 1;
      $(this).parents('tr').next().find('td:nth-child(' + i + ') input').focus();

    } else {

      var i = $(this).parents('td').index() + 1;
      $(this).parents('tr').next().find('td:nth-child(' + i + ') input').focus();

    }

		return false;
	}
});

}); // $
