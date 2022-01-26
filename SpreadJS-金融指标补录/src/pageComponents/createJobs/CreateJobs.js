import React, { useState } from "react";
import { Form, Row, Table, Divider, Modal, Button, Tree } from "antd";
import { getInput, getSelector, getButtons } from "../../utils/form";
import {
  getAllTemplates,
  getTemplateByKey,
  getDepartments,
  saveJob,
} from "../../requests";
import { DownloadOutlined } from "@ant-design/icons";
import { formatDate } from "../../utils/date";

import { exportExcel } from "../spreadjs/ExcelUtils";

import "@grapecity/spread-sheets-resources-zh";
import GC from "@grapecity/spread-sheets";
import { SpreadSheets } from "@grapecity/spread-sheets-react";
import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css";

GC.Spread.Common.CultureManager.culture("zh-cn");

let templateListResult = [];
const CreateJobs = () => {
  const [form] = Form.useForm();
  const [templateKey, setTemplateKey] = useState(null);
  const [checkModalVisible, setCheckModalVisible] = useState(false);
  const [distributionModalVisible, setDistributionModalVisible] = useState(
    false
  );
  const [selectedStaffs, setSelectedStaffs] = useState([]);
  // const [selectedRow, setSelectedRow] = useState(null);
  // const [templateList, setTemplateList] = useState([]);

  class CheckTemplateModal extends React.Component {
    state = {
      template: { templateName: "" },
      spread: null,
    };

    initSpread(spread) {
      this.setState({ spread: spread });
      getTemplateByKey(this.props.templateKey).then((res) => {
        if (res && res.length > 0) {
          const template = res[0];
          this.setState({ template: template });
          spread.fromJSON(template.ssjson);
        }
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
          <SpreadSheets
            workbookInitialized={this.initSpread.bind(this)}
            hostStyle={{ height: 700 }}
          ></SpreadSheets>
        </Modal>
      );
    }
  }

  class DistributionModal extends React.Component {
    state = {
      departmentTree: [],
      expandedKeys: [],
      checkedKeys: [],
      selectedKeys: [],
      autoExpandParent: true,
    };

    componentDidMount() {
      getDepartments().then((departmentTree) => {
        // console.log(departmentTree);
        this.setState({ departmentTree: departmentTree });
        this.setState({ expandedKeys: ["西安分公司"] });
      });
    }

    onExpand(expandedKeysValue) {
      // console.log('onExpand', expandedKeysValue);
      this.setState({ expandedKeys: expandedKeysValue });
      this.setState({ autoExpandParent: true });
    }

    onCheck(checkedKeysValue) {
      // console.log('onCheck', checkedKeysValue);
      this.setState({ checkedKeys: checkedKeysValue });
    }

    onSelect(selectedKeysValue, info) {
      // console.log('onSelect', info);
      this.setState({ selectedKeys: selectedKeysValue });
    }

    render() {
      return (
        <Modal
          title={"分配人员"}
          centered
          visible={distributionModalVisible}
          onOk={() => {
            setDistributionModalVisible(false);
            // console.log("==============>");
            const templateKey = this.props.templateKey;
            let selectedItem = selectedStaffs.find((item) => {
              return item.templateKey === templateKey;
            });
            if (selectedItem) {
              selectedItem.selected = [...this.state.checkedKeys];
              const newSelected = selectedStaffs.map((item) => {
                if (item.templateKey === templateKey) {
                  return selectedItem;
                }
                return item;
              });
              setSelectedStaffs(newSelected);
            } else {
              selectedItem = {
                templateKey: templateKey,
                selected: [...this.state.checkedKeys],
              };
              setSelectedStaffs([...selectedStaffs, selectedItem]);
            }
          }}
          okText={"确定"}
          onCancel={() => setDistributionModalVisible(false)}
          cancelText={"取消"}
          width={500}
        >
          <Tree
            checkable
            onExpand={this.onExpand.bind(this)}
            expandedKeys={this.state.expandedKeys}
            autoExpandParent={this.state.autoExpandParent}
            onCheck={this.onCheck.bind(this)}
            checkedKeys={this.state.checkedKeys}
            onSelect={this.onSelect.bind(this)}
            selectedKeys={this.state.selectedKeys}
            treeData={this.state.departmentTree}
            style={{ height: 400 }}
          />
        </Modal>
      );
    }
  }

  const onNameClick = (e) => {
    setTemplateKey(e.target.dataset.key);
    setCheckModalVisible(true);
  };

  const onDistributionClick = (e) => {
    setTemplateKey(e.target.dataset.key);
    setDistributionModalVisible(true);
  };

  class GetTable extends React.PureComponent {
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
          title: "所属类型",
          dataIndex: "templateType",
          key: "templateType",
          width: 150,
        },
        {
          title: "创建者",
          dataIndex: "creator",
          key: "creator",
          width: 100,
        },
        {
          title: "人员",
          dataIndex: "staff",
          key: "staff",
        },
        {
          title: "操作",
          key: "action",
          width: 100,
          render: (text, record) => (
            <a href onClick={onDistributionClick} data-key={record.key}>
              {"分配人员"}
            </a>
          ),
        },
      ],
      templateList: [],
    };

    constructor(props) {
      super(props);
      getAllTemplates().then((templates) => {
        // console.log("selectedStaffs ===> ", selectedStaffs)
        if (selectedStaffs && selectedStaffs.length) {
          for (let i = 0; i < templates.length; i++) {
            selectedStaffs.forEach((selectItem) => {
              if (selectItem.templateKey == templates[i].key) {
                templates[i].staff = selectItem.selected.join(",");
              }
            });
          }
        }
        // console.log("templates ===> ", templates);
        templateListResult = [...templates];
        this.setState({ templateList: templates });
      });
    }

    rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(
          `selectedRowKeys: ${selectedRowKeys}`,
          "selectedRows: ",
          selectedRows
        );
        // setSelectedRow(selectedRows[0]);
      },
    };

    render() {
      return (
        <Table
          rowSelection={{
            type: "radio",
            ...this.rowSelection,
          }}
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
        key: "createJob1",
        name: "jobName",
        label: "任务名称",
        isRequired: true,
        message: "请填写任务名称！",
        placeholder: "请填写任务名称",
      })
    );

    children.push(
      getSelector({
        key: "createJob2",
        name: "jobType",
        label: "任务类型",
        isRequired: true,
        message: "请选择任务类型!",
        placeholder: "-- 请选择任务类型 --",
        optionArr: [
          {
            value: "文档类",
            text: "文档类",
          },
          {
            value: "数据汇总类",
            text: "数据汇总类",
          },
          {
            value: "设计类",
            text: "设计类",
          },
        ],
      })
    );

    children.push(
      getSelector({
        key: "createJob3",
        name: "jobStatus",
        label: "任务状态",
        isRequired: true,
        message: "请选择任务状态!",
        placeholder: "-- 请选择任务状态 --",
        optionArr: [
          {
            value: "已激活",
            text: "已激活",
          },
          {
            value: "未激活",
            text: "未激活",
          },
        ],
      })
    );

    children.push(
      getButtons({
        key: "createJob4",
        textAlign: "center",
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

  const onFinish = (job) => {
    // if(!selectedRow){
    //   alert("模板不能为空！");
    //   return;
    // }
    // job.template = selectedRow;
    const selectedRow = document.querySelector("tr.ant-table-row-selected");
    if (!selectedRow) {
      alert("模板不能为空！");
      return;
    }
    const rowKey = selectedRow.dataset.rowKey;
    templateListResult.forEach((item) => {
      if (item.key == rowKey) {
        job.template = item;
      }
    });
    // job.template = templateList[rowKey];
    job.beginTime = formatDate();
    job.creator = "管理员";
    job.isDone = false;
    console.log(job);
    saveJob(job).then(() => {
      alert("保存成功！");
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
        <h3>创建任务</h3>
        <Divider />
        <Row gutter={24}>{getFields()}</Row>
        <Divider style={{ borderTop: "10px" }} />
        <h3>模板选择</h3>
        <Divider />
        <GetTable className={"testTable"}></GetTable>
      </Form>
      <CheckTemplateModal templateKey={templateKey} />
      <DistributionModal templateKey={templateKey} />
    </div>
  );
};

export default CreateJobs;
