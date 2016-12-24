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
		'height': '0px'
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
	this.homePage = function() {
		closeResumeModal();
		$nameBanner.animate({
			'margin-top': '100px',
			'padding': '50px'
		});
		$projects.animate({
			'height': '150px'
		});
		closeContactModal();
		this.currentPage('home');
	}
	this.projectsPage = function() {
		closeResumeModal();
		$nameBanner.animate({
			'margin-top': '0px',
			'padding': '5px'
		});
		$projects.animate({
			'height': '400px'
		});
		closeContactModal();
		this.currentPage('projects');
	}
	this.contactPage = function() {
		closeResumeModal();
		lowerMainContent();
		$contactModal.animate({
			'width': '80%',
			'height': '80%'
		});
		this.currentPage('contact');

	}
	this.resumePage = function() {
		closeContactModal();
		lowerMainContent();
		$resumeContainer.animate({
			'left': '0px'
		});
		this.currentPage('resume');
	}
}
ko.applyBindings(ViewModel);