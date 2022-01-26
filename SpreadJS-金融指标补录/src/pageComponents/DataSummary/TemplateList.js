import React, { useState } from "react";
import { Form, Row, Table, Space, Divider, Modal, Button } from "antd";
import { DownloadOutlined, VerticalAlignBottomOutlined, FormOutlined } from "@ant-design/icons";
import { getInput, getSelector, getButtons } from "../../utils/form";
import { getSummaryTemplates, getSummaryTemplateByKey, updateSummaryTemplates } from "../../requests";
import { getJobs } from "../../requests";

import { exportExcel } from "../spreadjs/ExcelUtils";

import "@grapecity/spread-sheets-resources-zh";
import GC from "@grapecity/spread-sheets";
import { SpreadSheets } from "@grapecity/spread-sheets-react";
import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css";

import "@grapecity/spread-sheets-designer-resources-cn";
import { Designer } from "@grapecity/spread-sheets-designer-react";
import "@grapecity/spread-sheets-designer/styles/gc.spread.sheets.designer.min.css";
import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css";

GC.Spread.Common.CultureManager.culture("zh-cn");

const TemplateList = () => {
  const [form] = Form.useForm();
  const [templateKey, setTemplateKey] = useState(null);
  const [checkModalVisible, setCheckModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);

  const onNameClick = (e) => {
    setTemplateKey(e.target.dataset.key);
    setCheckModalVisible(true);
  };

  const onUpdateClick = (e) => {
    setTemplateKey(e.target.dataset.key);
    setUpdateModalVisible(true);
  };

  const onDeleteClick = () => {
    alert("deleted");
  };

  class CheckTemplateModal extends React.Component {
    state = {
      template: { templateName: "" },
      spread: null,
    };

    initSpread(spread) {
      this.setState({ spread: spread });
      getSummaryTemplateByKey({key: templateKey}).then((res) => {
        if (res && res.length > 0) {
          const template = res[0];
          this.setState({ template: template });
          spread.fromJSON(template.ssjson);
        }
      });
    }

    onImportDataClick() {
      const spread = this.state.spread;
      getJobs({ isDone: true }).then((list) => {
        if(!list || list.length === 0) {
          alert("当前无可汇总数据");
          return;
        }
        const data = {
          "汇总": []
        };
        list.forEach(job => {
          job.data["汇总"]["汇总"]["填报人"] = job.informant;
          job.data["汇总"]["汇总"]["填报时间"] = job.endTime;
          data["汇总"].push(job.data["汇总"]["汇总"]);
        });
        spread.getActiveSheet().setDataSource(
          new GC.Spread.Sheets.Bindings.CellBindingSource(data)
        );
      });
    }

    exportExcel() {
      exportExcel(this.state.template.templateName, this.state.spread);
    }

    render() {
      return (
        <Modal
          title={"查看模板：" + this.state.template.templateName}
          centered
          visible={checkModalVisible}
          onOk={() => setCheckModalVisible(false)}
          okText={"确定"}
          onCancel={() => setCheckModalVisible(false)}
          cancelText={"取消"}
          width={1500}
        >
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            style={{ marginBottom: 10 }}
            onClick={this.exportExcel.bind(this)}
          >
            导出Excel
          </Button>
          <Button
            type="primary"
            icon={<VerticalAlignBottomOutlined />}
            style={{ marginBottom: 10, marginLeft: 20 }}
            onClick={this.onImportDataClick.bind(this)}
          >
            导入汇总数据
          </Button>
          <SpreadSheets
            workbookInitialized={this.initSpread.bind(this)}
            hostStyle={{ height: 700 }}
          ></SpreadSheets>
        </Modal>
      );
    }
  }

  class UpdateTemplateModal extends React.Component {
    state = {
      template: { templateName: "" },
      designer: null,
    };

    initSpread(designer) {
      this.setState({ designer: designer });
      const designerConfig = JSON.parse(
        JSON.stringify(GC.Spread.Sheets.Designer.DefaultConfig)
      );
      delete designerConfig.fileMenu;
      designer.setConfig(designerConfig);
      getSummaryTemplateByKey({key: templateKey}).then((res) => {
        if (res && res.length > 0) {
          const template = res[0];
          const spread = designer.getWorkbook();
          this.setState({ template: template });
          const ssjson = template.ssjson;
          if(ssjson.designerBindingPathSchema){
            designer.setData('treeNodeFromJson', JSON.stringify(ssjson.designerBindingPathSchema));
            designer.setData('oldTreeNodeFromJson', JSON.stringify(ssjson.designerBindingPathSchema));
          }
          spread.fromJSON(template.ssjson);
        }
      });
    }

    exportExcel() {
      exportExcel(
        this.state.template.templateName,
        this.state.designer.getWorkbook()
      );
    }

    updateTemplate() {
      const template = this.state.template;
      const designer = this.state.designer;
      const spread = designer.getWorkbook();
      const ssjson = spread.toJSON();
      const designerBindingPathSchema =
        designer.getData("treeNodeFromJson") ||
        designer.getData("updatedTreeNode") ||
        designer.getData("oldTreeNodeFromJson");
      if(designerBindingPathSchema){
        ssjson.designerBindingPathSchema = JSON.parse(designerBindingPathSchema);
      }
      template.ssjson = ssjson;
      updateSummaryTemplates(template).then((res) => {
        alert("汇总模板修改成功！");
      }, (error) => {
        alert("汇总模板修改失败！"+ error.message);
      });
    }

    render() {
      return (
        <Modal
          title={"修改模板：" + this.state.template.templateName}
          centered
          visible={updateModalVisible}
          onOk={() => setUpdateModalVisible(false)}
          okText={"确定"}
          onCancel={() => setUpdateModalVisible(false)}
          cancelText={"取消"}
          width={1500}
        >
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            style={{ marginBottom: 10 }}
            onClick={this.exportExcel.bind(this)}
          >
            导出Excel
          </Button>
          <Button
            type="primary"
            icon={<FormOutlined />}
            style={{ marginBottom: 10, marginLeft: 20 }}
            onClick={this.updateTemplate.bind(this)}
          >
            保存修改
          </Button>

          <Designer
            designerInitialized={this.initSpread.bind(this)}
            styleInfo={{ width: "100%", height: "calc(100vh - 292px)" }}
          ></Designer>

          {/* <SpreadSheets workbookInitialized={this.initSpread.bind(this)} hostStyle={{height: 300}}></SpreadSheets> */}
        </Modal>
      );
    }
  }

  class GetTable extends React.Component {
    state = {
      columns: [
        {
          title: "模板名称",
          dataIndex: "templateName",
          key: "templateName",
          render: (text, record) => (
            <a href onClick={onNameClick} data-key={record.key}>
              {text}
            </a>
          ),
        },
        {
          title: "数据来源",
          dataIndex: "dataSource",
          key: "dataSource",
        },
        {
          title: "创建者",
          dataIndex: "creator",
          key: "creator",
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          key: "createTime",
        },
        {
          title: "执行汇总",
          key: "summary",
          render: (text, record) => (
            <a href onClick={onNameClick} data-key={record.key}>
              执行
            </a>
          ),
        },
        {
          title: "操作",
          key: "action",
          render: (text, record) => (
            <Space size="middle">
              <a href onClick={onUpdateClick} data-key={record.key}>
                修改
              </a>
              <a href onClick={onDeleteClick} data-key={record.key}>
                删除
              </a>
            </Space>
          ),
        },
      ],
      templateList: [],
    };

    constructor(props) {
      super(props);
      getSummaryTemplates().then((list) => {
        this.setState({ templateList: list });
      });
    }

    render() {
      return (
        <Table
          columns={this.state.columns}
          dataSource={this.state.templateList}
        />
      );
    }
  }

  const getFields = () => {
    const children = [];

    children.push(
      getInput({
        key: "createTemplate1",
        name: "templateName",
        label: "模板名称",
        isRequired: false,
        message: "请填写模板名称！",
        placeholder: "请填写模板名称",
      })
    );

    children.push(
      getSelector({
        key: "createTemplate2",
        name: "templateType",
        label: "所属类型",
        isRequired: false,
        placeholder: "-- 请选择模板类型 --",
        optionArr: [
          {
            value: "财报类型",
            text: "财报类型",
          },
          {
            value: "流动性风险类型",
            text: "流动性风险类型",
          },
          {
            value: "风险台账",
            text: "风险台账",
          },
          {
            value: "关联交易类型",
            text: "关联交易类型",
          },
        ],
      })
    );

    children.push(
      getButtons({
        key: "createTemplate4",
        textAlign: "center",
        primaryText: "查询",
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

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  return (
    <div>
      <Form
        form={form}
        name="advanced_search"
        className="ant-advanced-search-form"
        onFinish={onFinish}
      >
        <h3>模板查询</h3>
        <Divider />
        <Row gutter={24}>{getFields()}</Row>
        <Divider style={{ borderTop: "10px" }} />
        <h3>模板列表</h3>
        <Divider />
        <GetTable></GetTable>
      </Form>
      <CheckTemplateModal templateKey={templateKey}></CheckTemplateModal>
      <UpdateTemplateModal templateKey={templateKey}></UpdateTemplateModal>
    </div>
  );
};

export default TemplateList;
