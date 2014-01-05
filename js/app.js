$(function() {
    var getFileHash = function(file, iter, cb) {
	var reader = new FileReader();
	reader.onload = function() {
	    var md5 = binl_md5(
		reader.result,
		reader.result.length
	    );
	    cb(null, md5);
	}; // end onload
	reader.onerror = function(err) {
	    console.error('Could not read file:', err);
	    cb(err, null);
	}; // end onerror
	reader.readAsBinaryString(file);
    }; // end getFileHash()

    var Item = Backbone.Model.extend({
	defaults: function() {
	    return {
		file: null,
		hash: null,
		iterations: 0
	    };
	}
    }); // end Item

    var ItemList = Backbone.Collection.extend({
	model: Item,
	localStorage: new Backbone.LocalStorage("megahash")
    }); // end ItemList
    var Items = new ItemList;

    var ItemView = Backbone.View.extend({
	template: _.template(
	    $('#item-template').html()
	), // end template

	initialize: function() {
	    this.listenTo(
		this.model,
		'change',
		this.render
	    );
	}, // end initialize

	render: function() {
	    this.$el.html(
		this.template(
		    this.model.toJSON()));
	    return this;
	}
    }); // end ItemView

    var AppView = Backbone.View.extend({

	el: $('#megahash-app'),

	initialize: function() {
	    this.listenTo(
		Items,
		'add',
		this.onAddItem
	    );
	},
 
	events: {
	    'click #add-item' : 'addItem',
	    'change #choose-file': 'uploadFile',
	    'click #remove-item' : 'removeItem',
	    'click #cancel-hash' : 'cancelHash'
	},

	render: function() {
	    console.log('Rendering view');
	},

	addItem: function(e) {
	    console.log('Choosing file');
	    $('#choose-file').click();
	}, // end addItem

	uploadFile: function(e) {
	    var files = e.target.files;
	    if(!files || files.length === 0) {
		return;
	    }
	    Items.create({
		file: files[0]
	    });
	}, // end uploadFile

	onAddItem: function(item) {
	    var view = new ItemView({ 
		model:item
	    });
	    console.log('Added item on collection', view.render().el);
	    this.$('#all-items').append(
		view.render().el
	    );
	} // end onAddItem

    }); // end AppView

    var App = new AppView;
});
