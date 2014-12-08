// TODO: do some sorting and filtering.
'use strict';

require('./testdom')('<html><body></body></html>');
var React = require('react/addons'),
    assert = require('assert'),
    _ = require('underscore'),
    sinon = require('sinon');

global.reactModulesToStub = [
  'components/BioDalliance.js'
];

var ExaminePage = require('../../cycledash/static/js/examine/components/ExaminePage'),
    QueryBox = require('../../cycledash/static/js/examine/components/QueryBox'),
    createRecordStore = require('../../cycledash/static/js/examine/RecordStore'),
    RecordActions = require('../../cycledash/static/js/examine/RecordActions'),
    Dispatcher = require('../../cycledash/static/js/examine/Dispatcher'),
    TestUtils = React.addons.TestUtils,
    Utils = require('./Utils'),
    dataUtils = require('./DataUtils');


describe('ExaminePage', function() {
  var fakeServer, records, displayedQuery, stub;

  before(function() {
    global.XMLHttpRequest = function() {};
    fakeServer = dataUtils.makeFakeServer('tests/data/snv.vcf');
    records = fakeServer.records;
    stub = Utils.stubReactMethod(QueryBox, 'setDisplayedQuery', function(str) {
      displayedQuery = str;
    });
  });

  after(function() {
    stub.restore();
  });

  it('should display and select records', function() {
    var run = {
      id: 1,
      spec: fakeServer.spec,
      contigs: fakeServer.contigs,
      caller_name: 'test',
      dataset_name: 'test',
      created_at: '',
      uri: '/tests/data/snv.vcf'
    };

    var dispatcher = new Dispatcher();
    var recordActions = RecordActions.getRecordActions(dispatcher);
    var recordStore = createRecordStore(run, dispatcher, fakeServer);
    var examine = TestUtils.renderIntoDocument(
      <ExaminePage recordStore={recordStore}
                   recordActions={recordActions}
                   igvHttpfsUrl=""
                   run={run} />);

    assert.ok(examine.state.hasLoaded);

    // The default query should be filled into CQL box.
    assert.equal('ORDER BY contig, position', displayedQuery);

    // One row for each record x sample
    assert.equal(20, Utils.findInComponent('.vcf-table tbody tr', examine).length);

    function selectedPos() {
      var selectedPos =
          Utils.findInComponent('.vcf-table tr.selected td.pos', examine);
      assert.ok(selectedPos.length <= 1);
      return selectedPos.length == 1 ? selectedPos[0].textContent : null;
    }
    assert.equal(null, selectedPos());

    examine.handleSelectRecord(records[0]);
    assert.equal('20:61795', selectedPos());

    examine.handleSelectRecord(records[19]);
    assert.equal('20:75254', selectedPos());

    examine.handleSelectRecord(null);
    assert.equal(null, selectedPos());
  });
});
