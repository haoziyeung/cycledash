(function() {
"use strict";

function passes(record) {
  if (!record.FILTER || _.contains(record.FILTER, 'PASS')) return true;
  return false;
}

function recordKey(record) {
  // Returns a string that uniquely identifies a record in a VCF.
  //
  // Used to test for record equality.
  return String(record.CHROM) + '-' + String(record.POS) + ':' + String(record.REF) + ':' + String(record.ALT);
}

function recordComparitor(a,b) {
  var aKey = recordKey(a),
      bKey = recordKey(b);
  if (aKey < bKey) {
    return -1;
  } else if (aKey > bKey) {
    return 1;
  } else {
    return 0;
  }
}

function recordsIn(records, range) {
  if (range)
    return _.filter(records, _.partial(within, range));
  else
    return records;
}

function within(range, record) {
  // Returns true if the record is within the range.
  //
  // Range is object with either a stand and end
  // a chromosome number or M, or an empty object signifying that the range is
  // the entire sequence. (NB: exclusive start, inclusive end)
  var start = range.start,
      end = range.end,
      chromosome = range.chromosome;
  if (start || start === 0) {
    if (record.CHROM !== chromosome)
      return false
    if (!(record.POS > start))
      return false
    if (end || end === 0)
      return record.POS <= end;
    else
      return true;
  } else { // then "All" is in range
    return true;
  }
}

function truePositives(truth, records, range) {
  if (range) {
    var truth = recordsIn(truth, range),
        records = recordsIn(records, range);
  }
  return intersection(truth, records);
}

function falsePositives(truth, records, range) {
  if (range) {
    var truth = recordsIn(truth, range),
        records = recordsIn(records, range);
  }
  return difference(records, truth);
}

function falseNegatives(truth, records, range) {
  if (range) {
    var truth = recordsIn(truth, range),
        records = recordsIn(records, range);
  }
  return difference(truth, records);
}

function precision(truth, records, range) {
  if (range) {
    var truth = recordsIn(truth, range),
        records = recordsIn(records, range);
  }
  var truePos = truePositives(truth, records, range),
      falsePos = falsePositives(truth, records, range);
  return  truePos.length / (truePos.length + falsePos.length);
}

function recall(truth, records, range) {
  if (range) {
    var truth = recordsIn(truth, range),
        records = recordsIn(records, range);
  }
  var truePos = truePositives(truth, records, range);
  return truePos.length / truth.length;
}

function f1score(truth, records, range) {
  var rec = recall(truth, records, range),
      prec = precision(truth, records, range);
  return 2 * (rec * prec) / (rec + prec);
}

function summary(records, attr, range) {
  if (range) records = recordsIn(records, range);
  var sum = 0, standardDeviation = 0, mean,
      length = records.length,
      vals = _.map(records, function(r) { return r.INFO[attr]; });

  for (var idx in vals)
    sum += vals[idx];
  mean = sum / length;
  for (var idx in vals)
    standardDeviation += Math.pow((vals[idx] - mean), 2);
  standardDeviation = Math.sqrt(standardDeviation / (length - 1));

  var fns = fiveNumber(records, attr);

  return {sum: sum, length: length, mean: mean,
          standardDeviation: standardDeviation,
          min: fns.min, firstQuartile: fns.firstQuartile, median: fns.median,
          thirdQuartile: fns.thirdQuartile, max: fns.max};
}

function fiveNumber(records, attr, range) {
  if (range) records = recordsIn(records, range);

  var min, max, median, firstQuartile, thirdQuartile,
      vals = _.map(records, function(r) { return r.INFO[attr]; }),
      length = vals.length,
      half = Math.floor(length / 2),
      first = Math.floor(half / 2),
      third = half + first;

  vals.sort(function (a, b) { return a > b ? 1 : -1; });

  min = vals[0];
  firstQuartile = vals[first];
  median = vals[half];
  thirdQuartile = vals[third];
  max = vals[length - 1];

  return {min: min, firstQuartile: firstQuartile, median: median,
          thirdQuartile: thirdQuartile, max: max, total: length};
}

function intersection(a, b) {
  // NB: Expects a and b be sorted on recordKey, and unique on recordKey.
  // time: O(n)
  var ai = 0, bi = 0,
      result = [];
  while (ai < a.length && bi < b.length) {
    if (recordKey(a[ai]) < recordKey(b[bi])) ai++;
    else if (recordKey(a[ai]) > recordKey(b[bi])) bi++;
    else { // they're equal
      result.push(a[ai]);
      ai++;
      bi++;
    }
  }

  return result;
}

function difference(a, b) {
  // NB: Expects a and b be sorted on recordKey, and unique on recordKey.
  // time: O(n)
  var ai = 0, bi = 0,
      result = [];

  while (bi < b.length) {
    if (recordKey(a[ai]) < recordKey(b[bi])) {
      result.push(a[ai]);
      ai++;
    } else if (recordKey(a[ai]) > recordKey(b[bi])) {
      bi++;
    } else { // they're equal
      ai++;
      bi++;
    }
  }

  return result;
}

window.vcf = window.vcf || {};
window.vcf.tools = {
  recordKey: recordKey,
  recordComparitor: recordComparitor,
  recordsIn: recordsIn,
  truePositives: truePositives,
  falsePositives: falsePositives,
  falseNegatives: falseNegatives,
  precision: precision,
  recall: recall,
  f1score: f1score,
  summaryStats: summary,
  fiveNumberSummary: fiveNumber
};


})();
