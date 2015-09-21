'use strict';

// React
var React = require('react');

// Material design
var mui = require('material-ui');
var { StylePropable } = mui.Mixins;
var { Dialog, FlatButton, Toolbar, ToolbarGroup, IconButton } = mui;

// Vendors
var Dropzone = require('react-dropzone');

// APP
var ObjectList = require('goby/components/shared/object-list/object-list.jsx');
var AppUtils = require('goby/components/shared/app-utils.jsx');
var { APKTestUploadStore } = require('goby/stores');
var { APKTestUploadActions } = require('goby/actions');

var APKTestUploadDialog = class extends React.Component{

  constructor (props) {
    super(props);

    this._onCancel = this._onCancel.bind(this);
    this._onDrop = this._onDrop.bind(this);
    this._onCleanClick = this._onCleanClick.bind(this);
    this._onStateChange = this._onStateChange.bind(this);

    this.state = { files: [] };
  }

  render() {

    var {
      // style,
      ...other
    } = this.props;

    var styles = {
      dropzone: {
        width: '100%'
      },
      toolbargroup: {
        paddingTop: '3px',
        float: 'left'
      },
      objectlist: {
        maxHeight: '200px',
        overflowY: 'auto',
      },
      cleanButton: {
        marginLeft: '-14px'
      }
    };

    var loginActions = [
      <FlatButton
        key="loginActionCancel"
        label='Close'
        title='Close'
        secondary={true}
        onTouchTap={this._onCancel} />,
    ];


    return (
      <Dialog title="APK Test Upload" actions={loginActions} {...other} ref="dialogIn" >
        <div>
          {this.state.files.length > 0 ? (
            <div>
            <Toolbar style={styles.toolbar}>
              <ToolbarGroup style={styles.toolbargroup}>
                <IconButton style={styles.cleanButton} onTouchTap={this._onCleanClick} ref="upload" iconClassName="mdi mdi-broom" tooltip="Clean finished files" title="Clean finished files" />
              </ToolbarGroup>
            </Toolbar>
            <ObjectList style={styles.objectlist} objectListItems={this.state.files} />
            </div>
          ) : '' }
          <Dropzone onDrop={this._onDrop} style={styles.dropzone} >
            <div>Try dropping some files here, or click to select files to upload.</div>
          </Dropzone>
        </div>
      </Dialog>
      );
  }

  show(){
    this.refs.dialogIn.show();
  }

  _onDrop(files){
    APKTestUploadActions.drop(this.state.projectId, files);
  }

  _onCleanClick() {
    APKTestUploadActions.clean();
  }

  _onCancel() {
    this.refs.dialogIn.dismiss();
  }

  _onStateChange( newState ){
    if ( newState.hasOwnProperty('shouldReloadAPKList') && newState.shouldReloadAPKList === true ) {
      this.props.reload();
    }
    this.setState( newState );
  }

  componentDidMount() {
    var projectId = AppUtils.getProjectIdFromRouter(this.context.router);
    APKTestUploadActions.setProjectId(projectId);
    this.unsubscribe = APKTestUploadStore.listen( this._onStateChange );
  }

  componentWillUnmount() {
    this.unsubscribe(); // Subscribe and unsubscribe because we don't want to use the mixins
  }

};

APKTestUploadDialog.mixins = [StylePropable];

APKTestUploadDialog.contextTypes = {
  muiTheme: React.PropTypes.object,
  router: React.PropTypes.func
}

module.exports = APKTestUploadDialog;


