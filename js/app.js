$(function() {

    var Item = Backbone.Model.extend({
	defaults: function() {
	    return {
		file: null,
		hash: null,
		iterations: 0
	    };
	},

	initialize: function() {
	    this.on(
		'change:file', 
		this.generateHash
	    );
	},

	generateHash: function() {
	    var that = this;
	    var file = that.get('file');
	    var reader = new FileReader();

	    console.log('Generating hash');
	    if(!file) return;

	    reader.onload = (function(myFile, that) {
		return function(e) {
		    that.set({
			hash: binl_md5(
			    reader.result,
			    reader.result.length
			)
		    });
		};
	    })(file, this);

	    reader.onerror = function(err) {
		console.error('Could not read file:', err);
	    }; // end onerror

	    reader.readAsBinaryString(file);

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
	    
	},

	addItem: function(e) {
	    console.log('Choosing file');
	    $('#choose-file').click();
	}, // end addItem

	uploadFile: function(e) {
	    var files = e.target.files;
	    var file;
	    if(!files || files.length === 0) {
		return;
	    }
	    file = files[0];
	    console.log('Got file:', files);
	    Items.create({
		file: file
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
