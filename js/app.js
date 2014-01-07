$(function() {

    var Item = Backbone.Model.extend({
	defaults: function() {
	    return {
		file: null,
		hash: null,
		iterations: 0
	    };
	},

	generateHash: function() {
	    var that = this;
	    var file = that.get('file');
	    var reader = new FileReader();

	    console.log('Hashing file:', file);
	    
	    reader.onloadend = function() {
		console.log('Result:', reader.result);
		/*
		that.set({
			hash: binl_md5(
			    reader.result,
			    reader.result.length
			)
		    });
		    console.log('hash:',
				that.get('hash'));
		*/
	    };
	    
	    reader.readAsDataURL(file);
	    console.log('reader:', reader);

	} // end generateHash()

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

	    // check for file api support
	    if (!window.File || 
		!window.FileReader) {
		alert('File APIs are not fully supported in this browser. Please use latest Mozilla Firefox or Google Chrome.');
		throw new Error('File API not supported');
		return;
	    }

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

	addItem: function(e) {
	    console.log('Choosing file');
	    $('#choose-file').click();
	}, // end addItem

	uploadFile: function(e) {
	    console.log('event:', 
			e.target.files[0]);
	    if(!e.target.files || 
	       e.target.files.length === 0) {
		return;
	    }
	    var file = e.target.files[0];

	    var item = Items.create({
		file: file
	    });
	    var reader = new FileReader();
	    
	    reader.onloadend = function() {
		console.log('Result:', reader.result);
		var hash = binl_md5(
		    reader.result,
		    reader.result.length
		);
		console.log('Got hash:', hash);
		item.set('hash', hash);
	    };
	    
	    reader.readAsBinaryString(file);

	    
	}, // end uploadFile

	onAddItem: function(item) {
	    var view = new ItemView({ 
		model:item
	    });

	    this.$('#all-items').append(
		view.render().el
	    );
	} // end onAddItem

    }); // end AppView

    var App = new AppView;
});
