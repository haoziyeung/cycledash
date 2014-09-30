/** @jsx React.DOM */
"use strict";

var React = require('react'),
    $ = require('jquery');

require('jquery-mousewheel')($);


var BioDalliance = React.createClass({
  propTypes: {
    // Currently selected variant, or null for no selection.
    selectedRecord: React.PropTypes.object,
    vcfPath: React.PropTypes.string.isRequired,
    // Truth VCF should become optional once /examine no longer requires it.
    truthVcfPath: React.PropTypes.string,
    normalBamPath:  React.PropTypes.string,
    tumorBamPath:  React.PropTypes.string,
    // Event handlers
    handleClose: React.PropTypes.func.isRequired,
    handlePreviousRecord: React.PropTypes.func.isRequired,
    handleNextRecord: React.PropTypes.func.isRequired,
    // Configuration
    igvHttpfsUrl: React.PropTypes.string.isRequired
  },
  render: function() {
    var style = {};
    if (this.props.selectedRecord == null) {
      style = {display: 'none'};
    }

    return (
      <div className="variant-inspector" ref="inspector" style={style}>
        <a href='#' className="close-button" onClick={this.handleClose}>✕</a>
        <a href='#' className="left-button" onClick={this.handleLeft}>←</a>
        <a href='#' className="right-button" onClick={this.handleRight}>→</a>
        <div id="svgHolder" />
      </div>
    );
  },
  // Convert an HDFS path to a browser-accessible URL via igv-httpfs.
  hdfsUrl: function(path) {
    return this.props.igvHttpfsUrl + path;
  },
  handleClose: function(e) {
    e.preventDefault();
    this.props.handleClose();
  },
  handleLeft: function(e) {
    e.preventDefault();
    this.props.handlePreviousRecord();
  },
  handleRight: function(e) {
    e.preventDefault();
    this.props.handleNextRecord();
  },
  browser: null,
  lazilyCreateDalliance: function() {
    if (this.browser) return;

    var sources = [
          {
            name: 'Genome',
            twoBitURI: 'http://www.biodalliance.org/datasets/hg19.2bit',
            tier_type: 'sequence'
          },
          {
            name: 'Run VCF',
            uri: this.hdfsUrl(this.props.vcfPath),
            tier_type: 'memstore',
            payload: 'vcf'
          }
    ];
    if (this.props.truthVcfPath) {
      sources.push({
          name: 'Truth VCF',
          uri: this.hdfsUrl(this.props.truthVcfPath),
          tier_type: 'memstore',
          payload: 'vcf'
      });
    }
    if (this.props.normalBamPath) {
      sources.push({
          name: 'Normal',
          bamURI: this.hdfsUrl(this.props.normalBamPath),
          tier_type: 'bam',
          style: bamStyle,
          className: 'pileup'
      });
    }
    if (this.props.tumorBamPath) {
      sources.push({
            name: 'Tumor',
            bamURI: this.hdfsUrl(this.props.tumorBamPath),
            tier_type: 'bam',
            style: bamStyle,
            className: 'pileup'
      });
    }

    // BioDalliance steals these events. We just want default browser behavior.
    var guardian = new EventGuardian(HTMLDivElement, ['mousewheel', 'MozMousePixelScroll']);

    this.browser = new Browser({
        chr:       '20',  // random position -- it will be changed.
        viewStart: 2684736 - 50,
        viewEnd:   2684736 + 50,

        noSourceCSS: true,
        uiPrefix: document.location.protocol + '//' + document.location.host + '/static/dalliance/',
        noPersist: true,

        coordSystem: {
          speciesName: 'Human',
          taxon: 9606,
          auth: 'NCBI',
          version: '37',
          ucscName: 'hg19'
        },

        sources: sources,

        initListeners: function() {
          guardian.destroy();
        }
      });
  },
  panToSelection: function() {
    var rec = this.props.selectedRecord;
    this.browser.setLocation(rec.CHROM, rec.POS - 25, rec.POS + 25);
  },
  update: function() {
    if (this.props.selectedRecord) {
      this.lazilyCreateDalliance();
      this.panToSelection();
    }
  },
  componentDidMount: function() {
    this.update();

    $(this.refs.inspector.getDOMNode()).on('mousewheel.biodalliance', (e) => {
      var $target = $(e.target);
      var $tiers = $target.parents('.tier.pileup');
      if ($tiers.length == 0) {
        e.preventDefault();
      }
    }).on('mousewheel.biodalliance', '.tier.pileup', (e, d) => {
      // See http://stackoverflow.com/q/5802467/388951
      var t = $(e.currentTarget);
      if (d > 0 && t.scrollTop() === 0) {
        e.preventDefault();
      } else {
        if (d < 0 && (t.scrollTop() == t.get(0).scrollHeight - t.innerHeight())) {
          e.preventDefault();
        }
      }
    });

    $(window).on('keydown', (e) => {
      if (e.which == 27 /* esc */ && this.props.selectedRecord) {
        e.preventDefault();
        this.props.handleClose();
      } else if (e.which == 37 /* left arrow */) {
        this.handleLeft(e);
      } else if (e.which == 39 /* right arrow */) {
        this.handleRight(e);
      }
    });
  },
  componentDidUpdate: function() {
    this.update();
  },
  componentWillUnmount: function() {
    $(this.props.inspector.getDOMNode()).off('mousewheel.biodalliance');
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return (nextProps.selectedRecord != this.props.selectedRecord);
  },
});


// Block any attempt to listen to a set of events on a type of element.
// This is a hack to tame badly-behaved libraries.
var EventGuardian = function(elementClass, inputEvents) {
  var events = JSON.parse(JSON.stringify(inputEvents));

  this.elementClass_ = elementClass;
  var realListener = this.elementClass_.prototype.addEventListener;
  console.log('Guarding against', this.elementClass_, events);
  this.elementClass_.prototype.addEventListener = function(name, meth, useCapture) {
    if (events.indexOf(name) >= 0) {
      console.log('Blocking attempt to listen to', name);
      return;
    }
    return realListener.call(this, name, meth, useCapture);
  };

  this.realListener = realListener;
};

EventGuardian.prototype.destroy = function() {
  this.elementClass_.prototype.addEventListener = this.realListener_;
};


// Style for visualizing BAM reads.
var bamStyle = [
  {
    "zoom": "low",
    "style": {
      "glyph": "__NONE",
    }
  },
  {
    "zoom": "medium",
    "style": {
      "glyph": "__NONE",
    },
  },
  {
    "type": "bam",
    "zoom": "high",
    "style": {
      "glyph": "__SEQUENCE",
      "_minusColor": "lightgray",
      "_plusColor": "lightgray",
      "HEIGHT": 8,
      "BUMP": true,
      "LABEL": false,
      "ZINDEX": 20,
      "__INSERTIONS": "no",
      "__SEQCOLOR": "mismatch"  // "mismatch-all" will label all bases
    },
    "_typeRE": {},
    "_labelRE": {},
    "_methodRE": {}
  }
];


// Style for visualizing BAM coverage.
var coverageStyle = [
  {
    "type": "density",
    "zoom": "low",
    "style": {
      "glyph": "HISTOGRAM",
      "COLOR1": "gray",
      "HEIGHT": 30
    }
  },
  {
    "type": "density",
    "zoom": "medium",
    "style": {
      "glyph": "HISTOGRAM",
      "COLOR1": "gray",
      "HEIGHT": 30
    }
  },
  {
    "type": "base-coverage",
    "zoom": "high",
    "style": {
      "glyph": "HISTOGRAM",
      "COLOR1": "lightgray",
      "BGITEM": true,
      "HEIGHT": 30
    }
  }
];


module.exports = BioDalliance;
