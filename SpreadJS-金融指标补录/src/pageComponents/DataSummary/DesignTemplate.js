import React from "react";
import { Form, Row } from "antd";
import { getInput, getSelector, getUploader, getButtons } from "../../utils/form"
import { saveSummaryTemplates } from "../../requests"

import { DesignerComponent, 
      thisDesigner as designer,  
      thisSpread as spread
    } from "../spreadjs/TemplateDesigner"
import { importExcel,importSsjson } from "../spreadjs/ExcelUtils"

import { formatDate } from "../../utils/date";

const DesignTemplate = () => {
  const [form] = Form.useForm();

  const beforeUpload = (file) => {
    if (file.name && file.name.endsWith(".xlsx")) {
      importExcel(file, spread, designer);
    } else if(file.name) {
      importSsjson(file, spread, designer);
    }
    // 直接阻止上传即可
    return false;
  };

  const getFields = () => {
    const children = [];

    children.push(
      getInput({
        key: "createTemplate1",
        name: "templateName",
        label: "模板名称",
        isRequired: true,
        message: "请填写模板名称！",
        placeholder: "请填写模板名称",
      })
    );
    
    children.push(
      getSelector({
        key: "createTemplate2",
        name: "dataSource",
        label: "数据来源",
        isRequired: true,
        placeholder: "-- 请选择数据来源 --",
        message: "请选择数据来源!",
        optionArr: [
          {
            value: "财报类数据",
            text: "财报类数据",
          },
          {
            value: "流动性风险类数据",
            text: "流动性风险类数据",
          },
          {
            value: "风险台账类数据",
            text: "风险台账类数据",
          },
          {
            value: "关联交易类数据",
            text: "关联交易类数据",
          },
        ],
      })
    );

    children.push(
      getUploader({
        key: "createTemplate3",
        action: "#",
        text: "上传本地模板：",
        accept: ".xlsx,.ssjson,.json",
        beforeUpload,
      })
    );

    children.push(
      getButtons({
        key: "createTemplate4",
        textAlign: "left",
        primaryText: "保存",
        primaryClick: () => {
          form.submit();
        },
        viceText: "重置",
        viceClick: () => {
          form.resetFields();
        },
      })
    );

    return children;
  };

  const onFinish = (template) => {
    template.creator = "管理员";
    template.createTime = formatDate();
    template.ssjson = spread.toJSON();
    const designerBindingPathSchema =
      designer.getData("treeNodeFromJson") ||
      designer.getData("updatedTreeNode") ||
      designer.getData("oldTreeNodeFromJson");
    if(designerBindingPathSchema){
      template.ssjson.designerBindingPathSchema = JSON.parse(designerBindingPathSchema);
    }
    saveSummaryTemplates(template).then((res) => {
      alert("模板保存成功!");
    },(error) => {
      alert("模板保存失败：" + error.message);
    });
  };

  return (
    <div>
      <Form
        form={form}
        name="advanced_search"
        className="ant-advanced-search-form"
        onFinish={onFinish}
      >
        <Row gutter={24}>{getFields()}</Row>
      </Form>
      <DesignerComponent></DesignerComponent>
    </div>
  );
};

export default DesignTemplate;
