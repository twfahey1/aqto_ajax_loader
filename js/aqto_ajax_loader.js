// Updated for Drupal 10 compatibility
(function ($, Drupal) {
  "use strict";
  // Drupal's core beforeSend function
  var beforeSend = Drupal.ajax.prototype.beforeSend;
  console.log("welcome");

  // Add a trigger when beforeSend fires.
  Drupal.Ajax.prototype.beforeSend = function (xmlhttprequest, options) {
    console.log("beforeSend");
    // Only apply our override on specific fields.
    // if (this.element.name == "field_name") {
    if (true) { // Always apply our override for now.
      // Copied and modified from Drupal.ajax.prototype.beforeSend in ajax.js
      $(this.element).addClass("progress-disabled").attr("disabled", true);
      // Modify the actual progress throbber HTML.
      this.progress.element = $(
        '<div class="aqto-ajax-loader flex flex-col items-center space-y-2">' +
          '<div class="throbber flex flex-col items-center space-y-2">' +
            '<div class="w-6 h-6 bg-blue-500"></div>' +
            '<div class="w-6 h-6 bg-blue-600"></div>' +
            '<div class="w-6 h-6 bg-blue-700"></div>' +
          '</div>' +
          '<div class="message">Doing our thing...</div>' +
        '</div>'
      );
      // Add animeJS animations to the throbber.
      var throbber = this.progress.element.find(".throbber div").toArray();

      // Create an anime.js timeline
      anime.timeline({ loop: true })
        .add({
          targets: throbber,
          translateY: [
            { value: '-20px', duration: 300, easing: 'easeInOutQuad' },
            { value: '20px', duration: 300, easing: 'easeInOutQuad' },
            { value: '0px', duration: 300, easing: 'easeInOutQuad' },
          ],
          rotate: {
            value: '1turn',
            duration: 900, // Same as the combined duration of translateY steps
            easing: 'linear'
          },
          delay: anime.stagger(100),
        });

      // Change the position of the throbber.
      $(this.element).parent().parent().after(this.progress.element);
    } else {
      // Send to the default Drupal Ajax function if we're not looking at our specific field.
      beforeSend.call(this, xmlhttprequest, options);
      $(document).trigger("beforeSend");
    }
  };

  Drupal.behaviors.aqtoAjaxLoader = {
    attach: function (context, settings) {
      once('aqtoAjaxLoader', 'body', context).forEach(function (element) {
        // Your existing code here
      });
    }
  };

})(jQuery, Drupal);
