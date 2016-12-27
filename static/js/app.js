/**********************
CACHED JQUERY SELECTORS
***********************/
// Menu buttons.
var $homeButton = $('#home');
var $projectsButton = $('#projects');
var $contactButton = $('#contact');
var $resumeButton = $('#resume');

// Main content elements.
var $nameBanner = $('#nameBanner');
var $projects = $('.project-content');
var $contactModal = $('#contact-modal');
var $resumeContainer = $('#resume-container');
var $projectImg = $('.project-img');
var $projectClickHere = $('.project-content p');
var $projectClickImage = $('.project-content h6');

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
		'margin-top': '101%'
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

	// tracks which page state is current activated.
	self.currentPage = ko.observable('home');

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
		});
		self.currentPage('home');
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
		self.currentPage('projects');
	}

	// Animates the site to the contact page.
	self.contactPage = function() {
		closeResumeModal();
		lowerMainContent();
		$projectImg.fadeOut();
		$contactModal.animate({
			'width': '80%',
			'height': '80%',
			'padding': '20px'
		});
		self.currentPage('contact');
	}

	// Animates the site to the resume page.
	self.resumePage = function() {
		closeContactModal();
		lowerMainContent();
		$resumeContainer.animate({
			'left': '0px'
		});
		self.currentPage('resume');
	}

	// Processes and sends contact form data to server.
	self.contactFormProcess = function(formElement) {
		var full_name = $('#full_name').value();
		var email = $('#email').value();
		var message = $('#message').value();

		var data = {
			'full_name': full_name,
			'email': email,
			'message': message
		}

		$.ajax({
			url: Flask.url_for('/contact'),
			type: 'POST',
			dataType: 'json',
			data: data,
			success: function(response) {

			},
			error: function() {
				
			}
		});
	}
}
ko.applyBindings(ViewModel);