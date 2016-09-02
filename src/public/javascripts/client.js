$(function() {
  $('.checkbox-link, .button-link').on('click', function(event) {
    event.preventDefault();
    window.location = $(this).data('href')
  })
})
