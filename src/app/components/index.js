module.exports = {

  /* Home */
  SignUpDialog: require('./home/sign-up-dialog.jsx'),
  LoginDialog: require('./home/login-dialog.jsx'),

  /* Project */
  APKUploadDialog: require('./project/apk-upload-dialog.jsx'),
  APKTestUploadDialog: require('./project/apk-test-upload-dialog.jsx'),

    /* Live */
    LiveSensors: require('./project/live-sensors.jsx'),
    LiveScreen: require('./project/live-screen.jsx'),
    LiveStatus: require('./project/live-status.jsx'),
    LiveBoxStatus: require('./project/live-box-status.jsx'),

  /* Shared */
  ObjectList: require('./shared/object-list/object-list.jsx'),
  AppUtils: require('./shared/app-utils.jsx'),
  APKSelectionDialog: require('./shared/dialogs/apk-selection.jsx'),
  APKTestSelectionDialog: require('./shared/dialogs/apk-test-selection.jsx'),
  DeviceSelectionDialog: require('./shared/dialogs/device-selection.jsx'),
  FullWidthSection: require('./shared/full-width-section.jsx'),
  InfoBox: require('./shared/info-box.jsx'),
  TogglableIcon: require('./shared/togglable-icon.jsx'),
  List: require('./shared/list/list.jsx'),

};