/**********************
CACHED JQUERY SELECTORS
***********************/
// Menu buttons.
var $homeButton = $('#home');
var $projectsButton = $('#projects');
var $contactButton = $('#contact');
var $resumeButton = $('#resume');

// jQuery selecters.
var $nameBanner = $('#nameBanner');
var $projects = $('.project-content');
var $contactModal = $('#contact-modal');
var $resumeContainer = $('#resume-container');
var $projectImg = $('.project-img');
var $projectClickHere = $('.project-content p');
var $projectClickImage = $('.project-content h6');
var $contactForm = $('#contact-form');
var $contactFormLoader = $('#loader');
var $contactFormMessage = $('#contact-form-msg');
var $navBar = $('#nav-container');

/***************
GLOBAL VARIABLES
****************/
var currentPage = ko.observable('HOME');
var menuIsOpen = false;

/***************
GLOBAL FUNCTIONS
****************/
function closeContactModal() {
	$contactModal.animate({
		'width': '0px',
		'height': '0px',
		'padding': '0px'
	});	
}

function lowerMainContent() {
	$nameBanner.animate({
		'margin-top': '6000px'
	});
}

function closeResumeModal() {
	$resumeContainer.animate({
		'left': '101%'
	});
}


/********************
KNOCKOUT.JS VIEWMODEL
*********************/
function ViewModel() {
	var self = this;

	self.menuBtn = function() {
		$navBar.css('left', '0px');
	}

	self.closeMenu = function() {
		$navBar.css('left', '-100%');
	}

	// Animates the site to the home page.
	self.homePage = function() {
		closeResumeModal();
		closeContactModal();
		$projectClickHere.show();
		$projectClickImage.hide();
		$projectImg.fadeOut();
		$nameBanner.animate({
			'margin-top': '100px',
			'padding': '50px'
		});
		$projects.animate({
			'height': '120px'
		}, 600);
		self.closeMenu();
		currentPage('home');
	}

	// Animates the site to the projects page.
	self.projectsPage = function() {
		closeResumeModal();
		closeContactModal();
		$projectClickHere.hide();
		$projectClickImage.show();
		$nameBanner.animate({
			'margin-top': '0px',
			'padding': '5px'
		});
		$projects.css('height', 'auto');
		$projectImg.fadeIn();
		self.closeMenu();
		currentPage('projects');
	}

	// Animates the site to the contact page.
	self.contactPage = function() {
		closeResumeModal();
		lowerMainContent();
		$contactModal.animate({
			'width': '80%',
			'height': '80%',
			'padding': '20px'
		});
		self.closeMenu();
		currentPage('contact');
	}

	// Animates the site to the resume page.
	self.resumePage = function() {
		closeContactModal();
		lowerMainContent();
		$resumeContainer.animate({
			'left': '0px'
		});
		self.closeMenu();
		currentPage('resume');
	}

	self.goToLones = function() {
		window.location = "https://jacoblonesofficialsite.appspot.com";
	}

	self.goToMap = function() {
		window.location = Flask.url_for('MapProject');
	}

	self.goToBlog = function() {
		window.location = "http://www.blogproject-144722.appspot.com";
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
