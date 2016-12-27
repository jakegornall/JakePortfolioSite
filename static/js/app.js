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
	// tracks which page state is current activated.
	this.currentPage = ko.observable('home');

	// Animates the site to the home page.
	this.homePage = function() {
		closeResumeModal();
		closeContactModal();
		$nameBanner.animate({
			'margin-top': '100px',
			'padding': '50px'
		});
		$projects.animate({
			'height': '150px'
		});
		this.currentPage('home');
	}

	// Animates the site to the projects page.
	this.projectsPage = function() {
		closeResumeModal();
		closeContactModal();
		$nameBanner.animate({
			'margin-top': '0px',
			'padding': '5px'
		});
		$projects.animate({
			'height': '500px'
		});
		this.currentPage('projects');
	}

	// Animates the site to the contact page.
	this.contactPage = function() {
		closeResumeModal();
		lowerMainContent();
		$contactModal.animate({
			'width': '80%',
			'height': '80%',
			'padding': '20px'
		});
		this.currentPage('contact');
	}

	// Animates the site to the resume page.
	this.resumePage = function() {
		closeContactModal();
		lowerMainContent();
		$resumeContainer.animate({
			'left': '0px'
		});
		this.currentPage('resume');
	}

	// Processes and sends contact form data to server.
	this.contactFormProcess = function(formElement) {
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