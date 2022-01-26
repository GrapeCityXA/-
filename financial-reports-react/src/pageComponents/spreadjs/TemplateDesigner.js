import "@grapecity/spread-sheets-designer-resources-cn";
import { Designer } from "@grapecity/spread-sheets-designer-react";
import "@grapecity/spread-sheets-designer/styles/gc.spread.sheets.designer.min.css";
import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css";

import GC from "@grapecity/spread-sheets";

export let thisDesigner, thisSpread;

const designerInitialized = (designer) => {
  // 获取到默认配置对象
  const designerConfig = JSON.parse(
    JSON.stringify(GC.Spread.Sheets.Designer.DefaultConfig)
  );
  // 删除配置中文件菜单按钮
  delete designerConfig.fileMenu;
  // 把修改后的配置设置回设计器
  designer.setConfig(designerConfig);

  thisSpread = designer.getWorkbook();
  thisDesigner = designer;
};

export const DesignerComponent = (props) => {
  return (
    <Designer
      designerInitialized={designerInitialized}
      styleInfo={{ width: "100%", height: "calc(100vh - 228px)" }}
    ></Designer>
  );
};
