$(function() {
    'use strict';

    // Google map object
    var map;

    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 40.730610,
                lng: -73.935242
            },
            zoom: 11
        });
    }

    var ViewModel = function() {
        var self = this;

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
                location: "St. Patrick's Cathedral",
                latLng: {
                    lat: 40.758465,
                    lng: -73.975993
                },
                visible: ko.observable(true)
            }, {
                location: "Brookfield Place",
                latLng: {
                    lat: 40.713192,
                    lng: -74.015913
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

            var infoWindow = new google.maps.InfoWindow({
                content: self.places()[i].location
            });

            self.infoWindows[i] = infoWindow;
        }

        self.bounceMarkerOnce = function(marker) {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                marker.setAnimation(null);
            }, 750);
        }

        // Display info window with wikipedia article
        self.showPlaceInfo = function(index) {
            for (var i = 0; i < self.infoWindows.length; i++) {
                self.infoWindows[i].close();
            }
            console.log(self.infoWindows[index]);
            self.infoWindows[index].open(map, self.markers[index]);
        }

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

    initMap();
    var vm = new ViewModel();
    ko.applyBindings(vm);
});
