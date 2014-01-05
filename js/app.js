$(function() {
    var megahash = function(file, iterations) {
	
    }; // end megahash()

    var Item = Backbone.Model.extend({
	defaults: function() {
	    return {
		filename: null,
		hash: null,
		iterations: 0
	    };
	}
    }); // end Item

    var ItemList = Backbone.Collection.extend({
	model: Item,
	
    }); // end ItemList
    var Items = new ItemList;

    var AppView = Backbone.View.extend({

	el: $('#megahash-app'),
	initialize: function() {
	    console.log('Starting app');
	},
	events: {
	    'click #add-item' : 'addItem',
	    'click #remove-item' : 'removeItem',
	    'click #cancel-hash' : 'cancelHash'
	},
	initialize: function() {
	},
	render: function() {
	    console.log('Rendering view');
	},
	addItem: function(e) {
	    console.log('Choosing file');
	    $('#choose-file').click();
	}
    }); // end AppView

    var App = new AppView;
});
