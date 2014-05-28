StudioCollection.Model = function() {
  this.state = []
  this.currentStudioState
  this.synced = false
}

StudioCollection.Model.prototype = {

  createNewStudio: function(newStudioData) {
    console.log("New Studio Created on SCM")
    var newStudio = new Studio.Model(newStudioData)
    this.state.push(newStudio)
    this.notifyStudioCollectionStateUpdate()
    //this.currentStudioState = jQuery.extend({}, newStudio)
    //this.addStudioToSubscriber(this.currentStudioState)
  },

  removeStudio: function(studioData) {
    console.log("Removing Studio from SCM")
    var studioToRemove = this.fetchStudioData(studioData.name)
    this.state.remove(studioToRemove.index)
    this.notifyStudioCollectionStateUpdate()
  },

  updateStudioState: function(newStudioData) {
    console.log("SCM - updating studio state")
    if (newStudioData.name === this.currentStudioState.name) {
      this.currentStudioState = newStudioData
      var studioIndexToUpdate = this.fetchStudioData(newStudioData.name)
      this.state[studioIndexToUpdate] = new Studio.Model(newStudioData)
      this.studioStateChecksumUpdate()
    }
    else {
      var studioIndexToUpdate = this.fetchStudioData(newStudioData.name)
      this.state[studioIndexToUpdate] = new Studio.Model(newStudioData)
      this.notifyStudioCollectionStateUpdate()
    }
  },
  
  studioStateChecksumUpdate: function() {
    if (this.synced) {
      this.notifyCurrentStudioStateUpdate()  
    }
    else if (!this.synced) {
      this.syncTrackTime()
      this.synced = true
      this.notifyCorrectStudioState()
    }
  },

  // New user joins studio
  initStudioState: function(studioName) {
    var notSyncedData = this.fetchStudioData(studioName).studioData
    this.currentStudioState = notSyncedData
    this.requestSyncedData(studioData)
  },

  requestSyncedData: function(studioData) {
    this.subscriber.setStudioToSync
  },

  syncTrackTime: function() {
    var timeDifference = ((Date.now() - this.currentStudioState.data.syncTimeStamp) / 1000 ) 
    var newTrackTime = timeDifference + this.currentStudioState.data.currentTrackTime
    this.currentStudioState.data.currentTrackTime = newTrackTime
  },

 // Notify
  notifyCorrectStudioState: function() {
    this.controller.updatePlayerState()
  },

  notifyStudioCollectionStateUpdate: function() {
    console.log("Notify Controller of studio state update")
    this.controller.collectionStateUpdate()
  },

  notifyCurrentStudioStateUpdate: function() {
    console.log("Notifying Controller of current studio state change")
    this.controller.currentStudioStateUpdate(this.currentStudioState)
  },

  // New listener joins studio

  addListenerToStudio: function(studioName) {
    var studioData = this.fetchStudioData(studioName).latestStudioData
    if (this.currentStudioState.name !== studioName) {
      this.currentStudioState = studioData
      this.requestSyncedData()
      this.requestMonitorActivation()
    } 
  },

  // Fetch latest studio state data
  fetchCurrentStudioData: function() {
    console.log("SCM - Fetching latest studio data")
    var currentTrackData = this.controller.fetchCurrentTrackStatus()
    var currentStudioData = this.currentStudioState
    currentStudioData.data.currentTrack = latestTrackData.currentTrack
    currentStudioData.data.currentTrackTime = latestTrackData.currentTrackTime
    return currentStudioData
  },
    

  packageLatestStudioData: function() {
    var newTrackData = this.controller.fetchCurrentTrackStatus()
    var dataToPackage = this.currentStudioState
    var newListenerCount = dataToPackage.data.listeners + 1
    dataToPackage.data.currentTrack = newTrackData.currentTrack
    dataToPackage.data.currentTrackTime = newTrackData.currentTrackTime
    dataToPackage.data.status = "syncToMe"
    dataToPackage.data.listeners = newListenerCount
    dataToPackage.data.sentTimeStamp = Date.now()
    return dataToPackage
  },

  fetchStudioData: function(studioName) {
    for (var i = 0; i < this.state.length; i++) {
      if (studioName === this.state[i].name) {      
        return { studioData: jQuery.extend({},this.state[i]), index: i }
      }
    }
    return false
  },

  registerStudioCollectionSubscriber: function(subscriber) {
    this.subscriber = subscriber
  },

  registerController: function(controller) {
    this.controller = controller
  }
  // requestListenerCountIncrease: function() {
  //   this.updateStudioState({name: this.currentStudioState.name, data: { status: "addListener"}})
  // },

  // requestSyncedTrackData: function() {
  //   var newTrackData = this.controller.fetchCurrentTrackStatus()
  //   this.updateStudioState({
  //                                             name: this.currentStudioState.name, 
  //                                             data: { status: "syncToMe", currentTrack: newTrackData.currentTrack, 
  //                                             currentTrackTime: newTrackData.currentTrackTime 
  //                                           }})
  // },

  // requestSyncedData: function() {

  //   this.updateStudioState({name: this.currentStudioState.name, data: { status: "needSync"})
  // },

  // updateCollectionState: function(studioData) {
  //  var tempStudio = this.fetchStudio(studioData.name)
  //   if ((tempStudio === false) && (this.cleanStudio(studioData))) {
  //     var newStudio = new Studio.Model(studioData)
  //     this.state.push(newStudio)
  //     this.controller.constructStudio(studioData)   
  //   }
  //   else {
  //     this.controller.constructStudio(studioData)
  //   }
  // },

  // cleanStudio: function(studioData) {
  //   if (studioData.data.removelistener) {
  //     var newListenerCount = studioData.data.listeners - 1
  //     if (newListenerCount > 0) {
  //       studioData.data.listeners = newListenerCount
  //       studioData.data.removelistener = false
  //       this.updateStudioState(studioData)
  //     }
  //   }
  //   if ((newListenerCount === 0) || (studioData.data.listeners === 0)) {
  //     this.removeStudio(studioData)
  //     return false
  //   }
  //   else {
  //     return true
  //   }
  // },

  // // toggleListenerCount: function(studio) {
  // //   studio.data.listeners--
  // //   var studioData = this.packageStudioData(studio)
  // //   this.updateStudioState(studioData)
  // // },

  // subscriberStateReactor: function(studioData, action) {
  //   if (action === "add") { 
  //     this.updateCollectionState(studioData)
  //   }
  //   else if (action === "destroy") {
  //     this.removeStudio(studioData)
  //   }
  // },
  
  // subscriberStudioStateReactor: function(studio) {
  //   if ((studio.data.flagtype === "getTimes") && (this.currentStudioState.name === studio.name) && (this.currentStudioState.synced)) {
  //     this.controller.fetchTrackState()
  //     console.log('fetching data' + Date.now())
  //   }
  //   else if ((studio.data.flagtype === "setTimes") && (this.currentStudioState.name === studio.name) && (this.currentStudioState.synced === false)) {
  //    this.currentStudioState.currentTrack = studio.data.currentTrack
  //    this.currentStudioState.currentTrackTime = studio.data.currentTrackTime
  //    this.syncSentTime = studio.data.timeStamp
  //    console.log("inside settime " + Date.now() )
  //   }
  //   if (this.cleanStudio(studio)) {
  //     var studioToModify = this.fetchStudio(studio.name).studio
  //     for (var attribute in studio.data) {
  //       if (attribute !== "playlist") { 
  //         if (studioToModify[attribute] !== studio.data[attribute]) {
  //           studioToModify[attribute] = studio.data[attribute]
  //         }      
  //       }
  //     }
  //     this.controller.modifyRenderedStudio(studio)
  //   }
  // },

  // updateStudioTrack: function(trackData) {
  //   console.log(Date.now())
  //   var updateTimeStamp = Date.now()
  //   var studioData = jQuery.extend({},{ name: this.currentStudioState.name, data: { flagtype: "setTimes", currentTrack: trackData.currentTrack, currentTrackTime: trackData.currentTrackTime, timeStamp: updateTimeStamp   } })
  //   this.updateStudioState(studioData)
  // },

  // // packageStudioData: function(studio) {
  // //   var studioData = jQuery.extend({},{ name: studio.name, data: { flagtype: null, listeners: studio.listeners, removelistener: studio.removelistener, playlist: studio.playlist, currentTrack: studio.currentTrack, currentTrackTime: studio.currentTrackTime } })
  // //   return studioData
  // // },



  // removeStudio: function(studioData) {
  //   var studioToRemove = this.fetchStudio(studioData.name)
  //   if (studioToRemove === false) {  
  //     this.controller.destructStudio(studioData)
  //     this.subscriber.destroyStudio(studioData.name)  
  //   }
  //   else { 
  //     this.state.remove(studioToRemove.index)
  //     this.controller.destructStudio(studioData)
  //     this.subscriber.destroyStudio(studioData.name) 
  //   }
  // },

 



}

