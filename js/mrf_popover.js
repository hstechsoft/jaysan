$(document).on('mouseenter', '.history_btn', function () {
  const $btn = $(this);

  // Avoid duplicating popover
  if ($btn.data('bs.popover')) return;

  const historyHtml = $btn.attr('data-history');
  const content = "<ul class='list-group small mb-0'>" + historyHtml + "</ul>";

  $btn.popover({
    content: content,
    html: true,
    placement: 'left',
    trigger: 'manual',
    container: 'body'
  }).popover('show');

  // Track if mouse is inside
  $btn.addClass('popover-shown');
});

// Hide popover if mouse leaves button and popover
$(document).on('mouseleave', '.history_btn', function () {
  const $btn = $(this);

  setTimeout(function () {
    if (!$('.popover:hover').length && !$btn.is(':hover')) {
      $btn.popover('hide').removeClass('popover-shown').removeData('bs.popover');
    }
  }, 300); // delay helps handle accidental quick moves
});

// Also remove popover if mouse leaves the popover itself
$(document).on('mouseleave', '.popover', function () {
  const $btn = $('.history_btn.popover-shown');

  setTimeout(function () {
    if (!$('.popover:hover').length && !$btn.is(':hover')) {
      $btn.popover('hide').removeClass('popover-shown').removeData('bs.popover');
    }
  }, 300);
});
