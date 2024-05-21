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
      // Modify the actualy progress throbber HTML.
      this.progress.element = $(
        '<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div><div class="message">Doing our thing...</div></div>'
      );
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
