
var AppUtils = {

  text: {
    fieldIsRequired: 'This field is required',
  },

  fieldIsRequired: function (field) {
    var isInvalid = AppUtils.isEmpty(field.getValue());
    return isInvalid ? AppUtils.text.fieldIsRequired : '' ;
  },

  isEmpty: function (textField) {
    return ( $.trim(textField) === '' );
  },

  extend: function () {
    var newObj = {};
    for (var i = 0; i < arguments.length; i++) {
      var obj = arguments[i];
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          newObj[key] = obj[key];
        }
      }
    }
    return newObj;
  }


};




module.exports = AppUtils;