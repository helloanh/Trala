App.Controller = function(){
	this.studioCollectionController = {}
	this.studioController = {}
	this.searchController = {}
}

App.Controller.prototype = {
	loadNewStudio: function(e){
		e.preventDefault()
		
		var studioController = this.studioController.controller
		var studioMethod = studioController[this.studioController.callbackMethod]
		studioMethod.apply( studioController )

		var searchController = this.searchController.controller
		var searchMethod = searchController[this.searchController.callbackMethod]
		searchMethod.apply( searchController )
	},

	loadStudioCollection: function(e){
		e.preventDefault();
		var studioController = this.studioCollectionController.controller
		var studioMethod = studioController[this.studioCollectionController.callbackMethod]
		window.location.hash = "studio-collection"
		studioMethod.apply( studioController )
	},

	registerStudioCollectionController: function( controller, callbackMethod ){
		this.studioCollectionController = { controller: controller, callbackMethod: callbackMethod }
	},

	registerStudioController: function( controller, callbackMethod ){
		this.studioController = {controller: controller, callbackMethod: callbackMethod}
	},

	registerSearchController: function( controller, callbackMethod ){
		this.searchController = { controller: controller, callbackMethod: callbackMethod }
	}
}