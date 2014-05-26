StudioCollection.Controller = function(args) {
  this.studioView = args.studioView
  this.studioCollectionModel = args.studioCollectionModel
  this.studioCollectionView = args.studioCollectionView
  this.geoLocation = args.geoLocation
  this.currentUserState = ""
  Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
  }

  this.tempPlaylist = []

}

StudioCollection.Controller.prototype = {
  createStudio: function(studioData) {
    this.studioCollectionModel.createNewStudio(studioData)
  },

  destroyStudio: function(studioData) {
    this.studioCollectionModel.removeStudio(studioData)
  },

  constructStudio: function(studioData) {
    if (this.currentUserState === "collectionPage") {
      this.renderStudioCollection()
      // this.studioCollectionView.appendStudio(studioData)
    }
  },

  destructStudio: function(studioData) {
    if (this.currentUserState === "collectionPage") {
      this.studioCollectionView.removeStudio(studioData)
    }
  },

  modifyRenderedStudio: function(studioData) {
    if (this.currentUserState === "collectionPage") {
      this.studioCollectionView.modifyStudio(studioData)
    }
  },

  initUserStudioState: function(studioName) {
    this.loadStudioWithPlayer(this.studioCollectionModel.fetchStudio(studioName).studio.playlist[0]) 
    if (this.studioCollectionModel.currentStudio === studioName) {
      this.playTrack()
    }     
      this.studioCollectionModel.addListenerToStudio(studioName) 
   },

  renderStudioCollection: function() {
    this.currentUserState = "collectionPage"
    var studioCollection = { studio: this.fetchStudioCollection() }
    var studioCollectionTemplate = this.buildStudioCollectionTemplate(studioCollection)
    this.studioCollectionView.draw(studioCollectionTemplate)
  },

  playTrack: function() {
    document.getElementById('audio_player').addEventListener('canplay', function() {
      document.getElementById('audio_player').play()
    })
  },

  fetchTrackState: function() {
    var trackData = this.fetchCurrentTrackStatus()
    this.studioCollectionModel.updateStudioTrack(trackData)
  },

  updateTrackState: function(trackData) {
    document.getElementById('audio_player').addEventListener('canplay', function(){ 
      var newTime = ((Date.now() - trackData.timeStamp) / 1000) + trackData.trackTime
      this.studioCollectionView.updateTrackState(newTime)
      this.playTrack()
    }.bind(this, trackData))  
   // this.playTrack()
  },

  fetchCurrentTrackStatus: function() {
    var trackData = document.getElementById('audio_player').currentTime
    return trackData
  },

  fetchStudioCollection: function() {
    return this.studioCollectionModel.state
  },

  buildStudioCollectionTemplate: function(studioCollection) {
    return HandlebarsTemplates['list_room'](studioCollection)
  },

  renderCollection: function() {
    this.currentUserState = "collectionPage"
    var tempCollection = this.fetchStudioCollection()
    $('.container ul').empty()
    for (var i = 0; i < tempCollection.length; i++) {
        this.studioCollectionView.renderStudioCollection(tempCollection[i])
    }
  },


  initStudio: function() {
    // this.songManager.searchSongs('2pac', function(tracks) {
    //  this.testSliceFirstSong(tracks)
    // }.bind(this))
    this.loadInitial();
  },

  loadInitialStudioCollection: function(){
    // console.log("loadInitial for StudioCollection controller")
  },

  // loadInitialStudioCollection: function(){
  //   console.log("loadInitial for StudioCollection controller")
  // },

  // initStudio: function() {
  //   this.loadInitial();
  // },


  buildPlayer: function(song) { // will take songData array
    return HandlebarsTemplates['player'](song)
  },

  buildPlaylist: function(playlist) {
    playlist = { songs: playlist }
    return HandlebarsTemplates['song_basket_item'](playlist)
  },

  addSong: function(song) {

    // this.studioModel.addSong(song);
    // this.loadInitial();

    this.tempPlaylist.push(song)
    playlist = this.buildPlaylist(this.tempPlaylist)
    this.studioView.redrawPlaylist(playlist)
    if (this.tempPlaylist.length > 2) {
      var name = String(Math.floor(Math.random() * 1000))
      this.createStudio({name: name, data: { playlist: this.tempPlaylist }})
      this.tempPlaylist = []
      // this.loadStudioWithPlayer(this.studioCollectionModel.fetchStudio(name).studio.playlist[0])
      this.initUserStudioState(name)
    }
  },

  loadStudioWithPlayer: function(song) {
    // song = {} //GET SONG FROM BACKEND
    player = this.buildPlayer(song)
    this.studioView.draw(player);
  },

  //!!Currently not called
  loadInitialStudio: function() {
  //   console.log("loadInitial for studio controller")
    // playerTemplate = this.buildPlayer(this.model.getCurrentSong()[0]);
  }
}