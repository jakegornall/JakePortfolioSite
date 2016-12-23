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

/***************
GLOBAL VARIABLES
****************/


/********************
KNOCKOUT.JS VIEWMODEL
*********************/
function ViewModel() {
	this.currentPage = ko.observable('home');
	this.homePage = function() {
		$nameBanner.animate({
			'margin-top': '100px',
			'padding': '50px'
		});
		$projects.animate({
			'height': '150px'
		});
		this.currentPage('home');
	}
	this.projectsPage = function() {
		$nameBanner.animate({
			'margin-top': '0px',
			'padding': '5px'
		});
		$projects.animate({
			'height': '400px'
		});
		this.currentPage('projects');
	}
	this.contactPage = function() {

	}
	this.resumePage = function() {

	}
}
ko.applyBindings(ViewModel);