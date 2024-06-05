// Updated for Drupal 10 compatibility
(function ($, Drupal) {
  "use strict";
  // Drupal's core beforeSend function
  var beforeSend = Drupal.ajax.prototype.beforeSend;
  console.log("welcome");

  // Add a trigger when beforeSend fires.
  Drupal.Ajax.prototype.beforeSend = function (xmlhttprequest, options) {
    console.log("beforeSend");
    // Only apply our override on specific fields. Leaving for reference.
    // if (this.element.name == "field_name") {
    if (true) { // Always apply our override for now.
      // Copied and modified from Drupal.ajax.prototype.beforeSend in ajax.js
      $(this.element).addClass("progress-disabled").attr("disabled", true);
      // Modify the actual progress throbber HTML.
      this.progress.element = $(
        '<div class="aqto-ajax-loader flex flex-col items-center space-y-2">' +
          '<div class="throbber-container">' +
            '<div class="throbber flex flex-col items-center space-y-2">' +
              '<div class="w-2 h-2 bg-blue-500"></div>' +
              '<div class="w-2 h-2 bg-blue-600"></div>' +
              '<div class="w-2 h-2 bg-blue-700"></div>' +
            '</div>' +
          '</div>' +
          '<div class="message">Loading<span class="dots-container"></span></div>' +
        '</div>'
      );
      // Add animeJS animations to the throbber.
      var throbber = this.progress.element.find(".throbber div").toArray();
      var throbberContainer = this.progress.element.find(".throbber-container")[0];
      var dotsContainer = this.progress.element.find(".dots-container")[0];

      // Create an anime.js timeline for the squares
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

      // Create an anime.js animation for the container rotation
      anime({
        targets: throbberContainer,
        rotate: '1turn',
        duration: 2000,
        easing: 'linear',
        loop: true
      });

      // Create dots for animation
      for (let i = 0; i < 3; i++) {
        var dot = document.createElement('span');
        dot.innerHTML = '.';
        dot.classList.add('dot', 'inline-block');
        dotsContainer.appendChild(dot);
      }
      
      var dots = dotsContainer.querySelectorAll('.dot');

      // Animate the dots with anime.js
      anime.timeline({ loop: true })
        .add({
          targets: dots,
          translateX: [
            { value: 10, duration: 500 },
            { value: 0, duration: 500 }
          ],
          opacity: [
            { value: 1, duration: 500 },
            { value: 0.2, duration: 500 }
          ],
          easing: 'easeInOutSine',
          delay: anime.stagger(250, {start: 0})
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
