Data.SongManager = function() {
    this.clientId = "d74d7683ae187691bec3da7a1798abce"
    this.soundcloud = {}
    this.soundcloudUrl = "http://api.soundcloud.com/tracks/"
}

Data.SongManager.prototype = {
    init: function() {
        this.soundcloud = SC.initialize({
            client_id: this.clientId
        })
    },

  searchSongs: function(query, callback) {
    this.soundcloud.get(this.soundcloudUrl, 
      {
        q: query,
        streamable: true
      },
      function(tracks) {
        tracks = this.appendClientIdToTracks(tracks)
        callback(tracks)
    	}.bind(this))
  },

  appendClientIdToTracks: function(tracks) {
    for (var i = 0; i < tracks.length; i++ ) {
      tracks[i].client_id = this.clientId
    }
    return tracks
  }
}

