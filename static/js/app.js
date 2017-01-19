/**********************
CACHED JQUERY SELECTORS
***********************/
// Menu buttons.
var $homeButton = $('#home');
var $projectsButton = $('#projects');
var $contactButton = $('#contact');
var $resumeButton = $('#resume');

// jQuery selecters.
var $parallax = $('.parallax');
var $contactModal = $('#contact-modal');
var $contactForm = $('#contact-form');
var $contactFormLoader = $('#loader');
var $contactFormMessage = $('#contact-form-msg');
var $nameBanner = $('#nameBanner');
var $homeSection = $('#home-section');
var $navContainer = $('#nav-container');
var $techSection = $('#technologies');
var $window = $(window);

/***************
GLOBAL VARIABLES
****************/

/***************
GLOBAL FUNCTIONS
****************/



/********************
KNOCKOUT.JS VIEWMODEL
*********************/
function ViewModel() {
	var self = this;

	self.projectsMenuIsClosed = ko.observable(true);

	self.Home = function() {
		$('html, body').animate({
			"scrollTop": "0px"
		});
	}

	self.Tech = function() {
		if ($(window).width() < 992) {
			$('html, body').animate({
				"scrollTop": "85%"
			});
		} else {
			$techSection.css("background-color", "#039dc7");
			setTimeout(function() {
				$techSection.css("background-color", "white");
			}, 500);
		}
		
	}

	self.projectsMenu = function() {
		if (self.projectsMenuIsClosed()) {
			$('#projects-dropdown-mobile').animate({
				"bottom": $('#mobile-menu').height()
			});
			self.projectsMenuIsClosed(false);
		} else {
			$('#projects-dropdown-mobile').animate({
				"bottom": "-200px"
			});
			self.projectsMenuIsClosed(true);
		}
		
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


// controls parallax on name banner. 
var headerMarginTop = parseFloat($nameBanner.css('margin-top'));
var headerMarginBtm = parseFloat($nameBanner.css('margin-bottom'));
var stopPoint = 2000;

$(document).scroll(function() {
	var scrollPos = $window.scrollTop();
	if (scrollPos % 2 == 0) {
		var newMargin = headerMarginTop - scrollPos/2 + "px";
		if ($homeSection.height() > 220 || scrollPos < stopPoint) {
			$nameBanner.css("margin-top", newMargin);
			$nameBanner.css("margin-bottom", newMargin);
		} else {
			stopPoint = scrollPos;
		}	
	}
	return false;
});
