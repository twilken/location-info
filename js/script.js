// Setup hamburger menu using the slideout library
var slideout = new Slideout({
	'panel': document.getElementById('map'),
	'menu': document.getElementById('sidebar'),
	'padding': 256,
	'tolerance': 70
});

// Register hamburger icon toggle event listener
document.querySelector('#hamburger').addEventListener('click', function() {
    slideout.toggle();
});
