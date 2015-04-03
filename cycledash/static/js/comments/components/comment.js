'use strict';

var React = require('react'),
    moment = require('moment');


var CommentsPage = React.createClass({
  propTypes: {
    comments: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
  },
  render: function() {
    return (
      <section>
        <h1>All Comments</h1>
        <Comments comments={this.props.comments} />
      </section>
    );
  }
});

var LatestComments = React.createClass({
  propTypes: {
    comments: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
  },
  render: function() {
    return (
      <div className='comments'>
        <h4>Last {this.props.comments.length} Comments</h4>
        <Comments comments={this.props.comments} />
        <a href='/comments' className='all-comments'>See all…</a>
      </div>
    );
  }
});

var Comments = React.createClass({
  propTypes: {
    comments: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
  },
  render: function() {
    var comments = this.props.comments.map(c => <Comment comment={c} key={c.id} />);
    return (
      <ul className='comments'>
        {comments}
      </ul>
    );
  }
});

var Comment = React.createClass({
  propTypes: {
    comment: React.PropTypes.object.isRequired
  },
  urlForComment: function(c) {
    return `/runs/${c.vcf_id}/examine?query=${c.contig}:${c.position}-${1+c.position}`;
  },
  render: function() {
    var comment = this.props.comment;
    // moment uses the local timezone by default (converting the
    // value, which starts as a UNIX timestamp, to that timezone)
    var relativeDate = moment.unix(comment.created).fromNow();
    var authorName = comment.author_name ?
        comment.author_name.slice(0, 15) : 'Anonymous';
    return (
        <li>
          <span className='run-id'>
          <a href={`/runs/${comment.vcf_id}/examine`}>Run {comment.vcf_id}</a>
          </span>
          <a className='location' href={this.urlForComment(comment)}>
            {comment.contig}:{comment.position}
          </a>
          <span className='summary-container'>
            <b>{authorName}</b>: <span className='summary'>{comment.comment_text.slice(0, 45)}</span>
          </span>
          <span className='time' title={comment.last_modified}>{relativeDate}</span>
        </li>
    );
  }
});


module.exports = { LatestComments, CommentsPage };
