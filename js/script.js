$(function() {
	'use strict';

	// Google map object
	var map;

	// Initialize the app
	function init() {
		if (typeof google === 'object' && typeof google.maps === 'object') {
			map = new google.maps.Map(document.getElementById('map'), {
				center: {
					lat: 40.730610,
					lng: -73.935242
				},
				zoom: 11
			});
			console.log("Map loaded successfully");
			var vm = new ViewModel();
			ko.applyBindings(vm);
		} else {
			console.log("Could not load map");
			$('#map').text("Could not load google maps API");
		}
	}

	// Knockout ViewModel
	var ViewModel = function() {
		var self = this;

		// Places in New York
		self.places = ko.observableArray(
			[{
				location: "Empire State Building",
				latLng: {
					lat: 40.748441,
					lng: -73.985664
				},
				visible: ko.observable(true)
			}, {
				location: "Madison Square Garden",
				latLng: {
					lat: 40.750201,
					lng: -73.98379
				},
				visible: ko.observable(true)
			}, {
				location: "Chelsea Market",
				latLng: {
					lat: 40.742005,
					lng: -74.004818
				},
				visible: ko.observable(true)
			}, {
				location: "Smalls Jazz Club",
				latLng: {
					lat: 40.734401,
					lng: -74.002645
				},
				visible: ko.observable(true)
			}, {
				location: "Governors Island National Monument",
				latLng: {
					lat: 40.68945,
					lng: -74.016792
				},
				visible: ko.observable(true)
			}]
		);

		// Map markers
		self.markers = [self.places().length];

		// Map marker info windows
		self.infoWindows = [self.places().length];

		// Initialize map markers and info windows
		for (var i = 0; i < self.places().length; i++) {
			var marker = new google.maps.Marker({
				position: self.places()[i].latLng,
				map: map,
				animation: google.maps.Animation.DROP,
				title: self.places()[i].location
			});

			// Add click listener for every marker
			(function(marker, i) {
				marker.addListener('click', function() {
					self.bounceMarkerOnce(marker);
					self.showPlaceInfo(i);
				});
			}(marker, i));
			self.markers[i] = marker;

			// Create empty info windows
			var infoWindow = new google.maps.InfoWindow({
				content: null
			});
			self.infoWindows[i] = infoWindow;
		}

		// Bounce map marker exactly once
		self.bounceMarkerOnce = function(marker) {
			marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function() {
				marker.setAnimation(null);
			}, 750);
		}

		// Request and display wikipedia information about the place at index
		self.wikiApi = function(index) {
			var outer = this;
			var place = self.places()[index];

			var url = "https://en.wikipedia.org/w/api.php";
			url += '?' + $.param({
				'action': "opensearch",
				'search': place.location
			});

			$.ajax({
					url: url,
					dataType: 'jsonp',
					success: function(data) {
						var content = '<h3 class="infoWindowTitle">Wikipedia info:</h3> \
						<p class="infoWindow">' + data[2][0] + '</p>';
						self.infoWindows[index].setContent(content);
					}
				})
				.fail(function() {
					var content = '<h3 class="infoWindowTitle">Could not reach Wikipedia</h3>';
					self.infoWindows[index].setContent(content);
					setTimeout(function() {
						self.infoWindows[index].setContent = null;
						self.infoWindows[index].close();
					}, 3000);
				});
		}

		// Display info window with wikipedia article
		self.showPlaceInfo = function(index) {
			for (var i = 0; i < self.infoWindows.length; i++) {
				self.infoWindows[i].close();
			}
			if (self.infoWindows[index].getContent() == null) {
				self.wikiApi(index);
			}
			self.infoWindows[index].open(map, self.markers[index]);
		}

		// Called when a list item is selected
		self.itemSelected = function(place) {
			var index = self.places().indexOf(place);
			var marker = self.markers[index];
			self.bounceMarkerOnce(marker);
			self.showPlaceInfo(index);
		}

		// Value of the filter input field
		self.filter = ko.observable("");

		// Function filtering the places whenever the filter input changes
		self.filter.subscribe(function(filterValue) {

			filterValue = filterValue.toLowerCase();

			for (var i = 0; i < self.places().length; i++) {
				if (self.places()[i].location.toLowerCase().startsWith(filterValue)) {
					self.places()[i].visible(true);
					self.markers[i].setMap(map);
				} else {
					self.places()[i].visible(false);
					self.markers[i].setMap(null);
				}
			}
		});
	}

	init();
});
