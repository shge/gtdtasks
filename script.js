$(function() {

var now = moment().format('kk:mm');
$('#eta').text(now);
$('#start-time').val(now);


// Info Board
setInterval(function(){

  var now = moment();

  for (var i = 1; i < $('tr').length; i++) {

    var start = (i === 1) ? moment($('tr:nth-child(1) td:nth-child(3) input').val(), 'HH:mm')
    : moment($('tr:nth-child(' + i + ') td:nth-child(3)').text(), 'HH:mm');
    var end = moment($('tr:nth-child(' + i + ') td:nth-child(4)').text(), 'HH:mm');

    end = (end.diff(start) >= 0) ? end : end.add(1, 'd');

    if (start.isBefore(now) && end.isAfter(now)) {
      $('#current-task').text(
        $('tr:nth-child(' + i + ') td:first-child input').val()
      );
      $('#time-left').text(
        moment.duration(end.diff(now)).format('h:mm:ss', { trim: false })
      );
      return;
    } else {
      $('#current-task').text('実行中のタスクはありません');
      $('#time-left').text('0:00:00');
    }
  } // for

},1000);


// Enter to focus next line
$(document).on('keypress', 'table td input', function(e) {
  if ( e.which == 13 ) {

    var i = $(this).parents('td').index() + 1;

    if ( $(this).parents('tr').is(':last-child') ) {
      $('table tbody').append('<tr><td><input class="input"><td><input class="input"><td><td><td><td><input class="input">');
    }

    $(this).parents('tr').next().find('td:nth-child(' + i + ') input').focus();

		return false;
	}
});


// Calculate
$(document).on('change', 'td input', function() {

  // Top
  var reqtime = $('tr:first-child td:nth-child(2) input').val();
  var newETA = moment( $('#start-time').val(), 'HH:mm').add( moment.duration(reqtime) ).format('HH:mm');
  $('tr:first-child td:nth-child(4)').text(newETA);

  // Others
  for (var i = 2; i < $('tr').length; i++) {

    reqtime = $('tr:nth-child(' + i + ') td:nth-child(2) input').val();
    var prevETA = $('tr:nth-child(' + (i-1) + ') td:nth-child(4)').text();
    var prevEnded = $('tr:nth-child(' + (i-1) + ') td:nth-child(6) input').val();
    if (prevEnded === ""  && reqtime !== "") { // End time null

      $('tr:nth-child(' + i + ') td:nth-child(3)').text(prevETA);
      newETA = moment(prevETA, 'HH:mm').add( moment.duration(reqtime) ).format('HH:mm');
      $('tr:nth-child(' + i + ') td:nth-child(4)').text(newETA);

    } else if (prevEnded !== ""  && reqtime !== "") { // End time manually entered

      $('tr:nth-child(' + i + ') td:nth-child(3)').text(prevEnded);
      newETA = moment(prevEnded, 'HH:mm').add( moment.duration(reqtime) ).format('HH:mm');
      $('tr:nth-child(' + i + ') td:nth-child(4)').text(newETA);

    } else { // reqtime null
      $('tr:nth-child(' + i + ') td:nth-child(3)').text('');
      $('tr:nth-child(' + i + ') td:nth-child(4)').text('');
    } // if


  } // for

  $('#eta').text(newETA);

  for (i = 1; i < $('tr').length; i++) { // 実績時間

    var start = (i === 1) ? moment($('tr:nth-child(1) td:nth-child(3) input').val(), 'HH:mm')
    : moment($('tr:nth-child(' + i + ') td:nth-child(3)').text(), 'HH:mm');
    var end = ( $('tr:nth-child(' + i + ') td:nth-child(6) input').val() === "" ) ? moment($('tr:nth-child(' + i + ') td:nth-child(4)').text(), 'HH:mm')
    : moment($('tr:nth-child(' + i + ') td:nth-child(6) input').val(), 'HH:mm');
    var diff = (end.diff(start) >= 0) ? moment.duration(end.diff(start)) : moment.duration(end.diff(start)).add(1, 'd');
    $('tr:nth-child(' + i + ') td:nth-child(5)').text(
      diff.format('h:mm:ss', { trim: false })
    );
  } // for


}); // on change


}); // $
