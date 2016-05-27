$(function() {
    'use strict';

    var ViewModel = function() {
        var self = this;

        self.places = ko.observableArray(
            [
                {
                    location: "Hamburg",
                    visible: ko.observable(true),
                },
                {
                    location: "Hannover",
                    visible: ko.observable(true),
                },
                {
                    location: "Hammberbrook",
                    visible: ko.observable(true),
                },
                {
                    location: "Berlin",
                    visible: ko.observable(true),
                }
            ]
        );

        self.filter = ko.observable("");

        self.filter.subscribe(function(filterValue) {

            filterValue = filterValue.toLowerCase();

            ko.utils.arrayFilter(self.places(), function(place) {
                var visibility = place.location.toLowerCase().startsWith(filterValue) ? true : false;
                place.visible(visibility);
            });
        });
    }

    var vm = new ViewModel();
    ko.applyBindings(vm);
});
