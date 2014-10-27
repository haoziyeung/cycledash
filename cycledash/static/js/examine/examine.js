/** @jsx React.DOM */
"use strict";

var React = require('react'),
    ExaminePage = require('./components/ExaminePage'),
    Dispatcher = require('./Dispatcher'),
    RecordStore = require('./RecordStore'),
    RecordActions = require('./RecordActions').RecordActions;


window.renderExaminePage = function(el, run, igvHttpfsUrl) {
  var dispatcher = new Dispatcher();
  var recordActions = RecordActions(dispatcher);
  var recordStore = RecordStore(run.vcfPath, run.truthVcfPath, dispatcher);

  React.renderComponent(<ExaminePage recordStore={recordStore}
                                     recordActions={recordActions}
                                     vcfPath={run.vcfPath}
                                     truthVcfPath={run.truthVcfPath}
                                     normalBamPath={run.normalPath}
                                     tumorBamPath={run.tumorPath}
                                     igvHttpfsUrl={igvHttpfsUrl} />, el);
};
