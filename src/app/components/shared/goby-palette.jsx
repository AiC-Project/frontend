var mui = require('material-ui');
var Colors = mui.Styles.Colors;
var ColorManipulator = mui.Utils.ColorManipulator;

var GobyPalette = {
  primary1Color: Colors.lightBlue500,
  primary2Color: Colors.lightBlue700,
  primary3Color: Colors.lightBlue300,
  accent1Color: Colors.lightGreen500,
  accent2Color: Colors.lightGreen700,
  accent3Color: Colors.lightGreen300,
  textColor: Colors.darkBlack,
  canvasColor: Colors.white,
  borderColor: Colors.grey300,
  disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.3)
};

module.exports = GobyPalette;