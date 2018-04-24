$(function() {

var now = moment().format('kk:mm');
$('#eta-today, #current-time, tr:first-child .start').text(now);
$('#start-time').val(now);

$('tbody').sortable();
$('tbody').disableSelection();

function toMomentTime(i) {
  t = moment(i, 'HH:mm');
  return t;
}
function toMomentDuration(i) {
  t = moment.duration(i);
  return t;
}

function calc() {

  var start = $('#start-time').val();
  $('tr:first-child .start').text(start);

  // Top
  var reqtime = moment.duration( $('tr:first-child .reqtime').val() );
  var newETA = moment( toMomentTime(start).add(reqtime) ).format('HH:mm');
  $('tr:first-child .end').text(newETA);
  console.log(reqtime);
  calcTook(1);

  // Others
  for (var i = 2; i < $('tr').length; i++) {

    reqtime = $('tr:nth-child(' + i + ') .reqtime').val();
    var prevEnd = $('tr:nth-child(' + (i-1) + ') .end').text();
    var prevEnded = $('tr:nth-child(' + (i-1) + ') .ended').val();
    prevEnded = (prevEnded === "") ? prevEnd : prevEnded;

    if (reqtime !== "") {

      $('tr:nth-child(' + i + ') .start').text(prevEnded);
      newETA = toMomentTime(prevEnded).add( toMomentDuration(reqtime) ).format('HH:mm');
      $('tr:nth-child(' + i + ') .end').text(newETA);

      // 実績
      calcTook(i);


    } else { // reqtime null
      $('tr:nth-child(' + i + ') .start').text('');
      $('tr:nth-child(' + i + ') .end').text('');
      $('tr:nth-child(' + i + ') .took').text('');
    } // if


  } // for

  $('#eta-today').text(newETA);

} // function calc

function calcTook(i) {  // 実績

  var start = toMomentTime( $('tr:nth-child(' + i + ') .start').text() );
  var end = ( $('tr:nth-child(' + i + ') .ended').val() === "" ) ? toMomentTime( $('tr:nth-child(' + i + ') .end').text() )
                                                                 : toMomentTime( $('tr:nth-child(' + i + ') .ended').val() );
  var diff = (end.diff(start) >= 0) ? moment.duration(end.diff(start)) : moment.duration(end.diff(start)).add(1, 'd');
  $('tr:nth-child(' + i + ') .took').text(
    diff.format('h:mm', { trim: false })
  );

}


// Info Board
setInterval(function(){

  var now = moment();
  $('#current-time').text(now.format('kk:mm'));
  for (var i = 1; i < $('tr').length; i++) {
    var start = (i === 1) ? moment($('#start-time').val(), 'HH:mm')
                          : moment($('tr:nth-child(' + i + ') .start').text(), 'HH:mm');
    var end = moment($('tr:nth-child(' + i + ') .end').text(), 'HH:mm');

    end = (end.diff(start) >= 0) ? end : end.add(1, 'd');

    if (start.isBefore(now) && end.isAfter(now)) {
      $('#current-task').text(
        $('tr:nth-child(' + i + ') .task').val()
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

// Click Set current time
$('#set-current').on('click', function() {
  $('#start-time').val( moment().format('kk:mm') );
  calc();
});


// Enter to focus next line
$(document).on('keypress', 'table td input', function(e) {
  if ( e.which == 13 ) {

    // var i = $(this).parents('td').index() + 1;
    if ( $(this).parents('tr').is(':last-child') ) {
      $('table tbody').append('<tr><td><input class="input task"><td><input class="input reqtime"><td class="start"><td class="end"><td class="took"><td><input class="input ended">');
    }
    $(this).parents('tr').next().find('td:first-child input').focus();

		return false;
	}
});


// Calculate
$(document).on('change', 'td input, #start-time', function() { calc(); });
$('tbody').on('sortupdate', function() { calc(); });


}); // $
