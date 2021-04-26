const { Track } = require('../../Track')

module.exports = Track.extend({
  setInterface: function () {
    this.base();

    this._interface.isLocal   = 'model';
    this._interface.dataFile  = 'model';
    this._interface.indexFile = 'model';
    this._interface.largeFile = 'model';
  }
});
