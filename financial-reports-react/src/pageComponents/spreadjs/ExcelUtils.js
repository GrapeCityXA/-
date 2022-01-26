import { saveAs } from "file-saver";
import { IO } from "@grapecity/spread-excelio";
import GC from "@grapecity/spread-sheets"

export const exportExcel = (
  fileName,
  spread,
  exportOptions = { includeBindingSource: true }
) => {
  if (fileName.substr(-5, 5) !== ".xlsx") {
    fileName += ".xlsx";
  }
  const json = spread.toJSON(exportOptions);
  // {
  //   includeBindingSource: true,
  //   ignoreFormula: false,
  // };
  new IO().save(
    json,
    function (blob) {
      saveAs(blob, fileName);
    },
    function (e) {
      console.log(e);
    }
  );
};

export const exportSsjson = (
  fileName,
  spread,
  exportOptions = {},
  designer
) => {
  const blob = new Blob(
    [
      JSON.stringify(
        getSsjson(
          spread,
          (exportOptions = { includeBindingSource: true }),
          designer
        )
      ),
    ],
    { type: "text/plain;charset=utf-8" }
  );

  if (fileName.substr(-7, 7) !== ".ssjson") {
    fileName += ".ssjson";
  }
  saveAs(blob, fileName);
};

export const getSsjson = (spread, exportOptions = {}, designer) => {
  const ssjson = spread.toJSON(exportOptions);
  if (designer) {
    const designerBindingPathSchema =
      designer.getData("treeNodeFromJson") ||
      designer.getData("updatedTreeNode") ||
      designer.getData("oldTreeNodeFromJson");
    if (designerBindingPathSchema) {
      ssjson.designerBindingPathSchema = JSON.parse(designerBindingPathSchema);
    }
  }
  return ssjson;
};

export const importExcel = (file, spread, designer) => {
  const excelIo = new IO();
  excelIo.open(
    file,
    function (json) {
      spread.fromJSON(json, {});
      designer.refresh();
    },
    function (e) {
      console.error(e.errorMessage);
    }
  );
};

export const importSsjson = (file, spread, designer) => {
  const reader = new FileReader();
  reader.readAsText(file, "UTF-8");
  //读取成功触发onload事件
  reader.onload = function (evt) {
    const fileString = evt.target.result;
    const jsonObj = JSON.parse(fileString);
    // console.log(jsonObj);
    if (jsonObj.designerBindingPathSchema) {
      designer.setData('treeNodeFromJson', JSON.stringify(jsonObj.designerBindingPathSchema));
      designer.setData('oldTreeNodeFromJson', JSON.stringify(jsonObj.designerBindingPathSchema));
    }
    spread.fromJSON(jsonObj);
    designer.refresh();
  };
  // 读取失败触发onerror
  reader.onerror = function (e) {
    console.log(e);
  };
};


// var cellTypes = GC.Spread.Sheets.CellTypes;
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



var originalTextCellTypeGetTextLogic,
    originalCheckboxCellTypeGetTextLogic,
    originalButtonCellTypeGetTextLogic,
    originalHyperlinkCellTypeGetTextLogic,
    originalComboBoxCellTypeGetTextLogic;

export function restorePaint(_GC) {
  
  if(_GC) {
    var cellTypes = _GC.Spread.Sheets.CellTypes;
    originalTextCellTypeGetTextLogic = cellTypes.Text.prototype.getText;
    originalCheckboxCellTypeGetTextLogic = cellTypes.CheckBox.prototype.getText;
    originalButtonCellTypeGetTextLogic = cellTypes.Button.prototype.getText;
    originalHyperlinkCellTypeGetTextLogic = cellTypes.HyperLink.prototype.getText;
    originalComboBoxCellTypeGetTextLogic = cellTypes.ComboBox.prototype.getText;
  }

  var dirtyCellTypes = GC.Spread.Sheets.CellTypes;
  dirtyCellTypes.Text.prototype.getText = originalTextCellTypeGetTextLogic;
  dirtyCellTypes.CheckBox.prototype.getText = originalCheckboxCellTypeGetTextLogic;
  dirtyCellTypes.Button.prototype.getText = originalButtonCellTypeGetTextLogic;
  dirtyCellTypes.HyperLink.prototype.getText = originalHyperlinkCellTypeGetTextLogic;
  dirtyCellTypes.ComboBox.prototype.getText = originalComboBoxCellTypeGetTextLogic;
}