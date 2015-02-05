var React = require('react/addons');
var {Alert, Button} = require('react-bootstrap');
var uuid = require('uuid');
var Firebase = require('firebase');
var ref = new Firebase('https://tanks-for-fish.firebaseio.com/ais');

var App = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState() { return {}; },
  saveToFirebase(e) {
    e.preventDefault();
    var ai = {
      ai: this.state.ai,
      aiName: this.state.aiName
    };
    console.log(ai, this.state);
    ref.child(this.state.aiName).set(ai);
    this.setState({submitted: true});
  },
  handleDismiss() {
    this.setState({submitted: false, ai: '', aiName:''});
  },
  renderSubmittedAlert() {
    var submittedAlert;
    if (this.state.submitted) {
      submittedAlert = <Alert bsStyle="success" dismissAfter={3000} onDismiss={this.handleDismiss}>
      Sumitted to Firebase, woooo!
      </Alert>
    }
    return submittedAlert;
  },
  render() {
    return (
      <div className="container">
        <h1>Tank AI Uploader</h1>
        {this.renderSubmittedAlert()}
        <form>
          <div className="form-group">
            <label htmlFor="aiName">AI Name</label>
            <input type="text"
              id="aiName"
              name="aiName"
              placeholder="YOLO SWAGGINS"
              valueLink={this.linkState('aiName')}
              className="form-control" />
          </div>

          <div className="form-group">
            <label htmlFor="ai">AI Function</label>
            <textarea
              placeholder="function winTheGame(gameState) { console.log('im the best'); }"
              className="form-control"
              rows="10"
              cols="80"
              valueLink={this.linkState('ai')} />
          </div>

          <Button type="submit" bsStyle="primary"  onClick={this.saveToFirebase}>
            Submit
          </Button>
        </form>
      </div>
    );
  }
});

React.render(<App />, document.querySelector('.app'));
