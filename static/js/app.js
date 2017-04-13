/*********************
HTTP TO HTTPS REDIRECT
**********************/
if (location.protocol != 'https:')
{
	location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
}


/**********************
CACHED JQUERY SELECTORS
***********************/
var $homePage = $("#home");
var $projectsPage = $("#projects");
var $contactPage = $("#contact");
var $homeNav = $("#home-nav");
var $projectsNav = $("#projects-nav");
var $contactNav = $("#contact-nav");
var $homePage_h2 = $("#home h2");
var $homePage_p = $("#home p");
var $contactForm = $("#contact-form");
var $contactFormLoader = $("#contact-loader");
var $contactFormMessage = $("#contact-msg");
var $logo = $(".logo");

/***************
GLOBAL VARIABLES
****************/

/***************
GLOBAL FUNCTIONS
****************/
function pageSelect(selectedNav) {
	$homeNav.css("border-bottom", "0px solid red");
	$projectsNav.css("border-bottom", "0px solid red");
	$contactNav.css("border-bottom", "0px solid red");
	selectedNav.css("border-bottom", "5px solid red");
}


/********************
KNOCKOUT.JS VIEWMODEL
*********************/
function ViewModel() {
	var self = this;

	self.currentPage = ko.observable(1);

	self.goToHome = function() {
		pageSelect($homeNav);
		$homePage.css("left", "0px");
		$homePage.css("opacity", "1");
		$projectsPage.css("left", "50%");
		$projectsPage.css("opacity", "0");
		$contactPage.css("left", "50%");
		$contactPage.css("opacity", "0");
		$contactPage.css("z-index", "9996");
		setTimeout(function() {
			$homePage_h2.css("opacity", "1");
		}, 400);
		setTimeout(function() {
			$homePage_p.css("opacity", "1");
		}, 600);
		setTimeout(function() {
			$logo.css("opacity", "1");
		}, 800);
		self.currentPage(1);
	}

	self.goToProjects = function() {
		pageSelect($projectsNav);
		if (self.currentPage() == 2) {
			return -1;
		} else if (self.currentPage() == 1) {
			$homePage.css("left", "-50%");
			$homePage.css("opacity", "0");
			$logo.css("opacity", "0");
			$homePage_h2.css("opacity", "0");
			$homePage_p.css("opacity", "0");
			$projectsPage.css("left", "0px");
			$projectsPage.css("opacity", "1");
		} else if (self.currentPage() == 3) {
			$projectsPage.css("left", "0px");
			$projectsPage.css("opacity", "1");
			$contactPage.css("left", "50%");
			$contactPage.css("opacity", "0");
		}
		$contactPage.css("z-index", "0");
		self.currentPage(2);
	}

	self.goToContact = function() {
		pageSelect($contactNav);
		$homePage.css("left", "-50%");
		$homePage.css("opacity", "0");
		$homePage_h2.css("opacity", "0");
		$homePage_p.css("opacity", "0");
		$logo.css("opacity", "0");
		$projectsPage.css("left", "-50%");
		$projectsPage.css("opacity", "0");
		$contactPage.css("left", "0px");
		$contactPage.css("opacity", "1");
		$contactPage.css("z-index", "9996");
		self.currentPage(3);	
	}

	self.goToLones = function() {
		window.open("https://jacoblonesofficialsite.appspot.com/");
	}

	self.goToMap = function() {
		window.open(Flask.url_for('MapProject'));
	}

	self.goToBlog = function() {
		window.open("http://www.blogproject-144722.appspot.com/");
	}

	self.openInvoiceModal = function() {
		$('#inv-modal').fadeIn();
		$('#dimmer').css("z-index", "9998");
	}

	self.closeInvModal = function() {
		$('#inv-modal').fadeOut();
		$('#dimmer').css("z-index", "50");
	}

	self.goToInvoice = function() {
		$('#inv-error').text("");
		var invNum = $('#inv-num').val();
		if (invNum) {
			window.open("https://www.paypal.com?cmd=_pay-inv&id=" + invNum.toString());
		} else {
			$('#inv-error').text("Invoice number required");
		}
	}

	// Processes and sends contact form data to server.
	self.contactFormProcess = function() {
		// displays the loading bar only.
		$contactForm.hide();
		$contactFormLoader.show();
		$contactFormMessage.text('');

		// retrieves contact form data.
		var full_name = $('#full-name').val();
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
					if (response.success == 'false') {
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
