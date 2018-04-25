$(function() {

var now = moment().format('kk:mm');
// $('#eta-today, #current-time, tr:first-child .start').text(now);
$('#eta-today, #current-time').text(now);
$('#start-time').val(now);

// Sort
function fixHelper(e, ui){
  ui.children().each(function(){
    $(this).width($(this).width());
  });
  return ui;
}
$('tbody').sortable({
  helper: fixHelper
}).disableSelection();

function toMomentTime(i) {
  t = moment(i, 'HH:mm');
  return t;
}
function toMomentDuration(i) {
  t = moment.duration(i);
  return t;
}

function calc() {

  for (var i = 1; i < $('tr').length; i++) {

    var reqtime = $('tr:nth-child(' + i + ') .reqtime').val();
    var prevEnd = $('tr:nth-child(' + (i-1) + ') .end').text();
    var prevEnded = $('tr:nth-child(' + (i-1) + ') .ended').val();
    var startTime;
    if (i === 1) { // 1st row
      startTime = $('#start-time').val();
    } else if (prevEnded === "") {
      startTime = prevEnd;
    } else if (prevEnded !== "") {
      startTime = prevEnded;
    } else {
      console.error('startTime error');
    }
    if (reqtime !== "") {

      $('tr:nth-child(' + i + ') .start').text(startTime);
      newETA = toMomentTime(startTime).add( toMomentDuration(reqtime) ).format('HH:mm');
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
  if (end !== "") {
    var diff = (end.diff(start) >= 0) ? toMomentDuration(end.diff(start)) : toMomentDuration(end.diff(start)).add(1, 'd');
    $('tr:nth-child(' + i + ') .took').text(
      diff.format('h:mm', { trim: false })
    );
  }

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
      $('table tbody').append('<tr><td><i class="fas fa-trash fa-fw remove"></i><td><input class="input task"><td><input class="input reqtime"><td class="start"><td class="end"><td class="took"><td><input class="input ended">');
    }
    $(this).parents('tr').next().find('.task').focus();

		return false;
	}
});

// Fix formats
$(document).on('change', '.reqtime', function() {
  var i = $(this).val();
  var t;
  if (0 < i && i < 60) {
    t = toMomentDuration('0:' + i).format('H:mm', { trim : false });
  } else if (i.match(/^\d+h\d*$/)) {
    t = toMomentDuration( i.replace('h', ':00') ).format('H:mm', { trim : false });
  } else {
    t = i;
  }
  $(this).val(t);
});

// Calculate
$(document).on('change', 'td input, #start-time', function() { calc(); });
$('tbody').on('sortupdate', function() { calc(); });

// Remove tasks
$(document).on('click', '.remove', function() {
  var tr = $(this).parents('tr');
  if ($('tr').length !== 2) {
    tr.remove();
    calc();
  } else {
    tr.find('.task, .reqtime, .ended').val('');
    tr.find('.start, .end, .took').text('');
  }
});



}); // $
