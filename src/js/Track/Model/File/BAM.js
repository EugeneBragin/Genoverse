import Model                           from 'js/Track/Model/File';
import makeBam                         from 'js/lib/dalliance/bam';
import { URLFetchable, BlobFetchable } from 'js/lib/dalliance/bin';

export default Model.extend({
  getData: function (chr, start, end) {
    const deferred = $.Deferred();

    if (!this.bamFile) {
      if (this.url) {
        this.bamFile = new URLFetchable(this.url);
        this.baiFile = new URLFetchable(this.url + this.prop('indexExt'));
      } else if (this.dataFile && this.indexFile) {
        this.bamFile = new BlobFetchable(this.dataFile);
        this.baiFile = new BlobFetchable(this.indexFile);
      } else {
        return deferred.rejectWith(this, [ 'BAM files must be accompanied by a .bai index file' ]);
      }
    }

    makeBam(this.bamFile, this.baiFile, null, (bam, makeBamError) => {
      if (makeBamError) {
        console.error(makeBamError); // eslint-disable-line no-console
      } else {
        bam.fetch(chr, start, end, (features, fetchBamError) => {
          if (fetchBamError) {
            console.error(fetchBamError); // eslint-disable-line no-console
          } else {
            this.receiveData(features, chr, start, end);
            deferred.resolveWith(this);
          }
        });
      }
    });

    return deferred;
  },

  insertFeature: function (feature) {
    feature.id       = `${feature.chr}:${feature.readName}:${feature.pos}`;
    feature.start    = feature.pos + 1;
    feature.end      = feature.start + feature.seq.length;
    feature.sequence = feature.seq;

    return this.base(feature);
  },
});
