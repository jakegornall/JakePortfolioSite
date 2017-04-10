/**********************
CACHED JQUERY SELECTORS
***********************/
var $homePage = $("#home");
var $projectsPage = $("#projects");
var $contactPage = $("#contact");

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

	self.currentPage = ko.observable(1);

	self.goToHome = function() {
		$homePage.css("left", "0px");
		$homePage.css("opacity", "1");
		$projectsPage.css("left", "50%");
		$projectsPage.css("opacity", "0");
		$contactPage.css("left", "50%");
		$contactPage.css("opacity", "0");
		self.currentPage(1);
	}

	self.goToProjects = function() {
		if (self.currentPage() == 2) {
			return -1;
		} else if (self.currentPage() == 1) {
			$homePage.css("left", "-50%");
			$homePage.css("opacity", "0");
			$projectsPage.css("left", "0px");
			$projectsPage.css("opacity", "1");
		} else if (self.currentPage() == 3) {
			$projectsPage.css("left", "0px");
			$projectsPage.css("opacity", "1");
			$contactPage.css("left", "50%");
			$contactPage.css("opacity", "0");
		}
		self.currentPage(2);
	}

	self.goToContact = function() {
		$homePage.css("left", "-50%");
		$homePage.css("opacity", "0");
		$projectsPage.css("left", "-50%");
		$projectsPage.css("opacity", "0");
		$contactPage.css("left", "0px");
		$contactPage.css("opacity", "1");
		self.currentPage(3);	
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
