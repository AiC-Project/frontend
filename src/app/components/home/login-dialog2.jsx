var React = require('react');

var mui = require('material-ui');
var { StylePropable } = mui.Mixins;

var { Dialog, TextField, FlatButton } = mui;
var { Auth } = require('../../stores/auth.jsx');

var InfoBox = require('../shared/info-box.jsx');
var AppUtils = require('../shared/app-utils.jsx');

var LoginDialog = class extends React.Component{

  constructor (props) {
    super(props);
    this.state = {
      loginError: false,
      loginErrorMessage: '',
      blockFields: false,
      loginSuccess: false,
      userName: '',
      loginEmailError: '',
      loginPasswordError: '',
    };

    this._onLoginSubmit = this._onLoginSubmit.bind(this);
    this._onLoginCancel = this._onLoginCancel.bind(this);
    this.checkFields = this.checkFields.bind(this);
    this.cleanFields = this.cleanFields.bind(this);
  }

  render() {

    var {
      // style,
      ...other
    } = this.props;

    var successBox = <InfoBox boxType={InfoBox.SUCCESS}>New user <strong>{this.state.userName}</strong> successfully registered.</InfoBox>;
    var errorBox = this.state.loginError ? ( <InfoBox boxType={InfoBox.ERROR}>{this.state.loginErrorMessage}</InfoBox>) : '';

    var styles = {
      root:{

      },
      submit: {
        display: this.state.loginSuccess ? 'none' : 'auto'
      }
    };

    var loginActions = [
      <FlatButton
        key="loginActionCancel"
        label={this.state.loginSuccess ? 'Close' : 'Cancel'}
        title={this.state.loginSuccess ? 'Close' : 'Cancel'}
        secondary={true}
        onTouchTap={this._onLoginCancel}
        className="btLoginCancel"  />,
      <FlatButton
        key="loginActionSubmit"
        label="Submit"
        title="Submit"
        primary={true}
        onTouchTap={this._onLoginSubmit}
        style={styles.submit}
        className="btLoginSubmit"  />
    ];

    //style={this.mergeAndPrefix(styles.root,style)}
    return (
      <Dialog title="Login" actions={loginActions} {...other} ref="loginDialogIn" onShow={this.cleanFields} >
        {this.state.loginSuccess ? successBox : (
          <form onsubmit={this._onLoginSubmit}>
          {errorBox}
          <TextField className="loginEmail" onEnterKeyDown={this._onLoginSubmit} ref="loginEmail" changed={false} errorText={this.state.loginEmailError} onChange={this.checkFields.bind(this, 'loginEmail')} floatingLabelText="login" disabled={this.state.blockFields} /><br />
          <TextField className="loginPassword" onEnterKeyDown={this._onLoginSubmit} ref="loginPassword" changed={false}  errorText={this.state.loginPasswordError} onChange={this.checkFields.bind(this, 'loginPassword')} floatingLabelText="password" type="password"  disabled={this.state.blockFields} />
          </form>
        )}
      </Dialog>
      );
  }

  show(){
    this.setState({ loginError: false,
      loginErrorMessage: '',
      blockFields: false,
      loginSuccess: false,
      userName: '',
      loginEmailError: '',
      loginPasswordError: '',
      });

    this.refs.loginDialogIn.show();
    // this.cleanFields();
  }

  blockFields(){
    this.setState({ blockFields: true });
  }

  unblockFields(){
    this.setState({ blockFields: false });
  }

  cleanFields() {
    this.refs.loginEmail.clearValue();
    this.refs.loginEmail.props.changed = false;
    this.refs.loginPassword.clearValue();
    this.refs.loginPassword.props.changed = false;
  }

  checkFields(elem) {
    var noErrors = true;
    var errorMessage;
    var elementsToCheck = ['loginEmail', 'loginPassword'];
    if(elem !== undefined && this.refs[elem].props.changed === false){
      this.refs[elem].props.changed = true;
    }
    for (var i = 0; i < elementsToCheck.length ; i++) {
      if (this.refs[elementsToCheck[i]] !== undefined && this.refs[elementsToCheck[i]].props.changed){
        errorMessage = AppUtils.fieldIsRequired( this.refs[elementsToCheck[i]] );
        var newState = {};
        newState[elementsToCheck[i] + 'Error'] = errorMessage;
        this.setState(newState);
        noErrors = noErrors && (errorMessage === '');
      }
    }
    return noErrors;
  }

  _onLoginSubmit(e) {
    e.preventDefault();
    if(this.checkFields()){
      this.blockFields();
      var { router } = this.context;
      var nextPath = router.getCurrentQuery().nextPath;
      var email = this.refs.loginEmail.getValue();
      var pass = this.refs.loginPassword.getValue();
      Auth.login(email, pass, (results) => {
        console.log(results);
        if ( results.hasOwnProperty('authenticated') && results.authenticated === true ){
          Auth.redirectIfLogged(router);
        } else {
          this.setState({ loginError: true, loginErrorMessage: results.hasOwnProperty('errorMessage') ? results.errorMessage : 'Unknown error' });
          this.unblockFields();
        }
      });
    }
  }

  _onLoginCancel() {
    this.refs.loginDialogIn.dismiss();
  }

};

LoginDialog.mixins = [StylePropable];

LoginDialog.contextTypes = {
  muiTheme: React.PropTypes.object,
  router: React.PropTypes.func
}

module.exports = LoginDialog;

