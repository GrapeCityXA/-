"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.restorePaint = restorePaint;
exports.importSsjson = exports.importExcel = exports.getSsjson = exports.exportSsjson = exports.exportExcel = void 0;

var _fileSaver = require("file-saver");

var _spreadExcelio = require("@grapecity/spread-excelio");

var _spreadSheets = _interopRequireDefault(require("@grapecity/spread-sheets"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var exportExcel = function exportExcel(fileName, spread) {
  var exportOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    includeBindingSource: true
  };

  if (fileName.substr(-5, 5) !== ".xlsx") {
    fileName += ".xlsx";
  }

  var json = spread.toJSON(exportOptions); // {
  //   includeBindingSource: true,
  //   ignoreFormula: false,
  // };

  new _spreadExcelio.IO().save(json, function (blob) {
    (0, _fileSaver.saveAs)(blob, fileName);
  }, function (e) {
    console.log(e);
  });
};

exports.exportExcel = exportExcel;

var exportSsjson = function exportSsjson(fileName, spread) {
  var exportOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var designer = arguments.length > 3 ? arguments[3] : undefined;
  var blob = new Blob([JSON.stringify(getSsjson(spread, exportOptions = {
    includeBindingSource: true
  }, designer))], {
    type: "text/plain;charset=utf-8"
  });

  if (fileName.substr(-7, 7) !== ".ssjson") {
    fileName += ".ssjson";
  }

  (0, _fileSaver.saveAs)(blob, fileName);
};

exports.exportSsjson = exportSsjson;

var getSsjson = function getSsjson(spread) {
  var exportOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var designer = arguments.length > 2 ? arguments[2] : undefined;
  var ssjson = spread.toJSON(exportOptions);

  if (designer) {
    var designerBindingPathSchema = designer.getData("treeNodeFromJson") || designer.getData("updatedTreeNode") || designer.getData("oldTreeNodeFromJson");

    if (designerBindingPathSchema) {
      ssjson.designerBindingPathSchema = JSON.parse(designerBindingPathSchema);
    }
  }

  return ssjson;
};

exports.getSsjson = getSsjson;

var importExcel = function importExcel(file, spread, designer) {
  var excelIo = new _spreadExcelio.IO();
  excelIo.open(file, function (json) {
    spread.fromJSON(json, {});
    designer.refresh();
  }, function (e) {
    console.error(e.errorMessage);
  });
};

exports.importExcel = importExcel;

var importSsjson = function importSsjson(file, spread, designer) {
  var reader = new FileReader();
  reader.readAsText(file, "UTF-8"); //读取成功触发onload事件

  reader.onload = function (evt) {
    var fileString = evt.target.result;
    var jsonObj = JSON.parse(fileString); // console.log(jsonObj);

    if (jsonObj.designerBindingPathSchema) {
      designer.setData('treeNodeFromJson', JSON.stringify(jsonObj.designerBindingPathSchema));
      designer.setData('oldTreeNodeFromJson', JSON.stringify(jsonObj.designerBindingPathSchema));
    }

    spread.fromJSON(jsonObj);
    designer.refresh();
  }; // 读取失败触发onerror


  reader.onerror = function (e) {
    console.log(e);
  };
}; // var cellTypes = GC.Spread.Sheets.CellTypes;
// var originalTextCellTypeGetTextLogic = cellTypes.Text.prototype.getText;
// console.log(originalTextCellTypeGetTextLogic);
// var originalCheckboxCellTypeGetTextLogic = cellTypes.CheckBox.prototype.getText;
// var originalButtonCellTypeGetTextLogic = cellTypes.Button.prototype.getText;
// var originalHyperlinkCellTypeGetTextLogic = cellTypes.HyperLink.prototype.getText;
// var originalComboBoxCellTypeGetTextLogic = cellTypes.ComboBox.prototype.getText;
// export function replacePaint() {
//     GC.Spread.Sheets.CellTypes.Text.prototype.getText = function (value, context) {
//         var bp = context.sheet.getBindingPath(context.row, context.col);
//         if (bp) {
//             return "[" + bp + "]";
//         }
//         return originalTextCellTypeGetTextLogic.apply(this, arguments);
//     };
//     GC.Spread.Sheets.CellTypes.CheckBox.prototype.getText = function (value, options) {
//         var bp = options.sheet.getBindingPath(options.row, options.col);
//         if (bp) {
//             return "[" + bp + "]";
//         }
//         else {
//             return originalCheckboxCellTypeGetTextLogic.apply(this, arguments);
//         }
//     };
//     GC.Spread.Sheets.CellTypes.Button.prototype.getText = function (value, options) {
//         var bp = options.sheet.getBindingPath(options.row, options.col);
//         if (bp) {
//             return "[" + bp + "]";
//         }
//         return originalButtonCellTypeGetTextLogic.apply(this, arguments);
//     };
//     GC.Spread.Sheets.CellTypes.HyperLink.prototype.getText = function (value, options) {
//         var bp = options.sheet.getBindingPath(options.row, options.col);
//         if (bp) {
//             return "[" + bp + "]";
//         }
//         else {
//             return originalHyperlinkCellTypeGetTextLogic.apply(this, arguments);
//         }
//     };
//     GC.Spread.Sheets.CellTypes.ComboBox.prototype.getText = function (value, options) {
//         var bp = options.sheet.getBindingPath(options.row, options.col);
//         if (bp) {
//             return "[" + bp + "]";
//         }
//         else {
//             return originalComboBoxCellTypeGetTextLogic.apply(this, arguments);
//         }
//     };
// }


exports.importSsjson = importSsjson;
var originalTextCellTypeGetTextLogic, originalCheckboxCellTypeGetTextLogic, originalButtonCellTypeGetTextLogic, originalHyperlinkCellTypeGetTextLogic, originalComboBoxCellTypeGetTextLogic;

function restorePaint(_GC) {
  if (_GC) {
    var cellTypes = _GC.Spread.Sheets.CellTypes;
    originalTextCellTypeGetTextLogic = cellTypes.Text.prototype.getText;
    originalCheckboxCellTypeGetTextLogic = cellTypes.CheckBox.prototype.getText;
    originalButtonCellTypeGetTextLogic = cellTypes.Button.prototype.getText;
    originalHyperlinkCellTypeGetTextLogic = cellTypes.HyperLink.prototype.getText;
    originalComboBoxCellTypeGetTextLogic = cellTypes.ComboBox.prototype.getText;
  }

  var dirtyCellTypes = _spreadSheets["default"].Spread.Sheets.CellTypes;
  dirtyCellTypes.Text.prototype.getText = originalTextCellTypeGetTextLogic;
  dirtyCellTypes.CheckBox.prototype.getText = originalCheckboxCellTypeGetTextLogic;
  dirtyCellTypes.Button.prototype.getText = originalButtonCellTypeGetTextLogic;
  dirtyCellTypes.HyperLink.prototype.getText = originalHyperlinkCellTypeGetTextLogic;
  dirtyCellTypes.ComboBox.prototype.getText = originalComboBoxCellTypeGetTextLogic;
}