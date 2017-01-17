/**********************
CACHED JQUERY SELECTORS
***********************/
// Menu buttons.
var $homeButton = $('#home');
var $projectsButton = $('#projects');
var $contactButton = $('#contact');
var $resumeButton = $('#resume');

// jQuery selecters.

var $contactModal = $('#contact-modal');
var $contactForm = $('#contact-form');
var $contactFormLoader = $('#loader');
var $contactFormMessage = $('#contact-form-msg');

/***************
GLOBAL VARIABLES
****************/
var currentPage = ko.observable('HOME');
var menuIsOpen = false;

/***************
GLOBAL FUNCTIONS
****************/



/********************
KNOCKOUT.JS VIEWMODEL
*********************/
function ViewModel() {
	var self = this;

	self.Home = function() {
		$('#main-loader').show();
		$.ajax({
			url: Flask.url_for('home'),
			success: function(response) {
				$('#main-loader').hide();
				$('#main-content').html(response);
			},
			error: function() {
				$('#main-loader').hide();
				$('main').html("We're sorry. Our server is currently not responding. Trying again...");
				setTimeout(self.Home(), 3000);
			}
		});
	}

	self.goToLones = function() {
		window.location = "https://jacoblonesofficialsite.appspot.com/";
	}

	self.goToMap = function() {
		window.location = Flask.url_for('MapProject');
	}

	self.goToBlog = function() {
		window.location = "http://www.blogproject-144722.appspot.com/";
	}

	self.openContactModal = function() {
		$('#dimmer').fadeIn();
		$contactModal.animate({
			"top": "20%"
		});
	}

	self.closeContactModal = function() {
		$('#dimmer').fadeOut();
		$contactModal.animate({
			"top": "-100%"
		});
	}

	// Processes and sends contact form data to server.
	self.contactFormProcess = function() {
		// displays the loading bar only.
		$contactForm.hide();
		$contactFormLoader.show();
		$contactFormMessage.text('');

		// retrieves contact form data.
		var full_name = $('#full_name').val();
		var email = $('#email').val();
		var message = $('#message').val();

		// verifies that all fields are filled out.
		// displays error message if not.
		if (full_name && email && message) {
			// pack data into sendable object.
			var data = {
				'full_name': full_name,
				'email': email,
				'message': message
			};

			// attempt to send data to server.
			// If failed, display error message.
			$.ajax({
				url: Flask.url_for('contact'),
				type: 'POST',
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify(data),
				success: function(response) {
					$contactFormLoader.hide();
					if (response.success === 'false') {
						$contactForm.show();
					}
					$contactFormMessage.text(response.message);
				},
				error: function() {
					$contactFormLoader.hide();
					$contactFormMessage.text('An error occurred. Please try again later.')
				}
			});
		} else {
			$contactForm.show();
			$contactFormLoader.hide();
			$contactFormMessage.text('All fields required.');
		}
	}
}
ko.applyBindings(ViewModel);

$(document).ready(function() {
	$.ajax({
		url: Flask.url_for('home'),
		success: function(response) {
			$('#main-loader').hide();
			$('main').html(response);
		},
		error: function() {
			$('#main-loader').hide();
			$('main').html("We're sorry. Our server is currently not responding. Trying again...");
			setTimeout(ViewModel().Home(), 3000);
		}
	});
});
