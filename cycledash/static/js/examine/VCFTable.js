/** @jsx React.DOM */
"use strict";

var _ = require('underscore'),
    d3 = require('d3'),
    React = require('react/addons'),
    idiogrammatik = require('idiogrammatik.js'),
    types = require('./types.js');


var VCFTable = React.createClass({
  propTypes: {
    // Array of attribute names from the INFO field of the VCF's records
    attrs: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    // Subset of attrs which are currently selected.
    selectedAttrs: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    // Currently selected VCF record.
    selectedRecord: React.PropTypes.object,
    // Function which takes a chart attribute name and propagates the change up
    handleChartChange: React.PropTypes.func.isRequired,
    // List of chromosomes found in the VCF
    chromosomes: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    // The position object, from ExaminePage, denoting the current range selected
    position: types.PositionType,
    // Function which sends the newly-selected chromosome up
    handleChromosomeChange: React.PropTypes.func.isRequired,
    // Function which sends up the new range (from the position fields)
    handleRangeChange: React.PropTypes.func.isRequired,
    // Function which sends up the a newly selected record.
    handleSelectRecord: React.PropTypes.func.isRequired,
    // List of VCF records
    records: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    // The VCF header, used to get information about the INFO fields
    header: React.PropTypes.object.isRequired
  },
  render: function() {
    return (
      <table className="vcf-table" ref="vcfTable">
        <VCFTableHeader attrs={this.props.attrs}
                        selectedAttrs={this.props.selectedAttrs}
                        header={this.props.header}
                        handleChartChange={this.props.handleChartChange} />
        <VCFTableFilter chromosomes={this.props.chromosomes}
                        handleFilterUpdate={this.props.handleFilterUpdate}
                        handleChromosomeChange={this.props.handleChromosomeChange}
                        position={this.props.position}
                        handleRangeChange={this.props.handleRangeChange}
                        attrs={this.props.attrs} />
        <VCFTableBody records={this.props.records}
                      attrs={this.props.attrs}
                      selectedRecord={this.props.selectedRecord}
                      handleSelectRecord={this.props.handleSelectRecord} />
      </table>
    );
  },
  // Call this to scroll a record to somewhere close to the top of the page.
  scrollRecordToTop: function(record) {
    var idx = this.props.records.indexOf(record);
    if (idx >= 0) {
      var row = $(this.refs.vcfTable.getDOMNode()).find('tr').get(idx);
      $('html,body').animate({
        scrollTop: $(row).offset().top - 70
      }, 250 /* ms */);
    }
  }
});

var VCFTableHeader = React.createClass({
  propTypes: {
    // The VCF header, used to get information about the INFO fields
    header: React.PropTypes.object.isRequired,
    // Function which sends all the current filters up when a filter is changed
    handleChartChange: React.PropTypes.func.isRequired,
    // Array of attribute names from the INFO field of the VCF's records
    attrs: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    // Subset of attrs which are currently selected.
    selectedAttrs: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  },
  handleChartToggle: function(e) {
    var attribute = e.currentTarget.attributes.getNamedItem('data-attribute').value;
    this.props.handleChartChange(attribute);
  },
  render: function() {
    var attrs = this.props.attrs.map(function(attr) {
      var info =  _.findWhere(this.props.header.INFO, {ID: attr});
      var isSelected = _.contains(this.props.selectedAttrs, attr);
      return <InfoColumnTh info={info}
                           attr={attr}
                           isSelected={isSelected}
                           key={attr}
                           handleChartToggle={this.handleChartToggle} />;
    }.bind(this));

    return (
      <thead>
        <tr>
          <th>Chromosome</th>
          <th>Position</th>
          <th>REF / ALT</th>
          {attrs}
        </tr>
      </thead>
    );
  }
});

var InfoColumnTh = React.createClass({
  propTypes: {
    attr: React.PropTypes.string.isRequired,
    info: React.PropTypes.object,
    handleChartToggle: React.PropTypes.func.isRequired,
    isSelected: React.PropTypes.bool.isRequired
  },
  render: function() {
    var tooltip;
    if (this.props.info) {
      tooltip = <InfoColumnTooltip info={this.props.info} attr={this.props.attr} />;
    }
    var classes = React.addons.classSet({
      'attr': true,
      'selected': this.props.isSelected
    });
    return (
      <th className={classes} onClick={this.props.handleChartToggle} data-attribute={this.props.attr}>
        <span>{this.props.attr}</span>
        {tooltip}
      </th>
    );
  }
});

var InfoColumnTooltip = React.createClass({
  propTypes: {
    attr: React.PropTypes.string.isRequired,
    info: React.PropTypes.object.isRequired
  },
  render: function() {
    var infoText = this.props.info['Description'],
        infoType = this.props.info['Type'];
    return (
      <div className="tooltip">
        <p className="description">{infoText}</p>
        <p className="type">Type: <strong>{infoType}</strong></p>
      </div>
    );
  }
});

var VCFTableFilter = React.createClass({
   propTypes: {
     // List of chromosomes found in the VCF
     chromosomes: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
     // The position object, from ExaminePage, denoting the current range selected
     position: types.PositionType,
     // Function which sends the newly-selected chromosome up
     handleChromosomeChange: React.PropTypes.func.isRequired,
     // Function which sends up the new range (from the position fields)
     handleRangeChange: React.PropTypes.func.isRequired,
     // Array of attribute names from the INFO field of the VCF's records
     attrs: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
   },
   handleChromosomeChange: function(e) {
     var chromosome = this.refs.chromosome.getDOMNode().value;
     this.props.handleChromosomeChange(chromosome);
   },
   handleRangeChange: function(e) {
     var start = this.refs.startPos.getDOMNode().value,
         end = this.refs.endPos.getDOMNode().value,
         chromosome = this.props.position.chromosome;
     this.props.handleRangeChange(chromosome, Number(start) || null, Number(end) || null);
   },
   handleFilterUpdate: function(e) {
     // Array.slice converts the returned node list into an array so that we can
     // map over it.
     var filters = Array.prototype.slice.call(document.querySelectorAll('input.infoFilter'));
     // Return an object mapping filter names to filter values to be processed
     // when filtering records.
     filters = _.object(filters.map(function(f) {
       return [f.name, f.value];
     }));
     this.props.handleFilterUpdate(filters);
   },
   render: function() {
     var {position, kgram} = this.props,
         {start, end} = position;

     var chromosomeOptions = this.props.chromosomes.map(function(chromosome) {
       return (
         <option name="chromosome" key={chromosome} value={chromosome}>{chromosome}</option>
       );
     }.bind(this));
     var attrThs = this.props.attrs.map(function(attr) {
       return (
         <th key={attr}>
           <input name={attr} className="infoFilter" type="text"
                  onChange={this.handleFilterUpdate} />
         </th>
       );
     }.bind(this));
     return (
       <thead>
         <tr>
           <th>
             <select onChange={this.handleChromosomeChange}
                     ref="chromosome" value={this.props.position.chromosome || 'all'}>
               <option name="chromosome" key="all" value="all">&lt;all&gt;</option>
               {chromosomeOptions}
             </select>
           </th>
           <th id="position">
             <input name="start" type="text" placeholder="start"
                    disabled={!this.props.position.chromosome}
                    ref="startPos" value={start || ''} onChange={this.handleRangeChange} />
             <input name="end" type="text" placeholder="end"
                    disabled={!this.props.position.chromosome}
                    ref="endPos" value={end || ''} onChange={this.handleRangeChange} />
           </th>
           <th>
             <input name="refAlt" className="infoFilter" type="text"
                    onChange={this.handleFilterUpdate} />
           </th>
           {attrThs}
         </tr>
       </thead>
     );
   }
});

// As an optimization, this component only displays rows as they get close to
// the screen. The number of rows shown only increases over time.
var VCFTableBody = React.createClass({
  BOTTOM_BUFFER: 500,  // show more data when user is within 500px of bottom.
  propTypes: {
    // List of VCF records
    records: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    // Array of attribute names from the INFO field of the VCF's records
    attrs: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    // Currently selected VCF record (null = no selection)
    selectedRecord: React.PropTypes.object,
    // Function which sends up the a newly selected record.
    handleSelectRecord: React.PropTypes.func.isRequired
  },
  getInitialState: function() {
    return {numRowsToShow: 100};
  },
  render: function() {
    var selectedRecord = this.props.selectedRecord;
    var selKey = selectedRecord ? selectedRecord.__KEY__ : null;
    var rows = _.first(this.props.records, this.state.numRowsToShow)
        .map((record, idx) => <VCFRecord record={record}
                                         key={record.__KEY__}
                                         attrs={this.props.attrs}
                                         isSelected={record.__KEY__ == selKey} />);
    return (
      <tbody ref="lazyload">
        {rows}
      </tbody>
    );
  },
  componentDidMount: function() {
    $(window).on('scroll.vcftable', () => {
      // Show more rows if the browser viewport is close to the bottom and
      // there are more rows to be shown.
      if (this.state.numRowsToShow >= this.props.records.length) return;

      var $table = $(this.refs.lazyload.getDOMNode()),
          tableBottom = $table.position().top + $table.height(),
          windowBottom = $(window).scrollTop() + $(window).height();
      if (tableBottom < windowBottom + this.BOTTOM_BUFFER) {
        this.setState({numRowsToShow: this.state.numRowsToShow + 100});
      }
    });

    var component = this;
    $(this.refs.lazyload.getDOMNode()).on('click', 'tr', function(e) {
      component.props.handleSelectRecord(
          component.props.records[$(this).index()]);
    });
  },
  componentWillUnmount: function() {
    $(window).off('scroll.vcftable');
    $(this.refs.lazyload.getDOMNode()).off('click');
  }
});

var VCFRecord = React.createClass({
   propTypes: {
     // A VCF record
     record: React.PropTypes.object.isRequired,
     // Array of attribute names from the INFO field of the VCF's records
     attrs: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
     // Whether this variant is currently selected.
     isSelected: React.PropTypes.bool.isRequired
   },
   render: function() {
     var attrs = this.props.attrs.map(function(attr) {
       var val = this.props.record.INFO[attr];
       return <td key={attr}>{String(val)}</td>;
     }.bind(this));
     var classes = React.addons.classSet({selected: this.props.isSelected});
     return (
       <tr className={classes}>
         <td>{this.props.record.CHROM}</td>
         <td className="pos">{this.props.record.POS}</td>
         <td>{this.props.record.REF}/{this.props.record.ALT}</td>
         {attrs}
       </tr>
     );
   }
});


module.exports = VCFTable;
