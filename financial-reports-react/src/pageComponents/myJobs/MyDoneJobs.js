import React, { useState } from "react";
import { Form, Row, Table, Divider, Modal, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { getInput, getSelector, getButtons } from "../../utils/form";
import { getJobByKey, getJobs } from "../../requests";
import { exportExcel, restorePaint } from "../spreadjs/ExcelUtils";

import "@grapecity/spread-sheets-resources-zh";
import GC from "@grapecity/spread-sheets";
import { SpreadSheets } from "@grapecity/spread-sheets-react";
import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css";

const MyDoneJobs = () => {
  const [form] = Form.useForm();
  const [jobKey, setJobKey] = useState(null);
  const [handleModalVisible, setHandleModalVisible] = useState(false);

  class HandleModal extends React.Component {
    state = {
      spread: null,
      job: { jobName: "" },
    };

    initSpread(spread) {
      restorePaint();
      const _this = this;
      _this.setState({ spread: spread });
      getJobByKey(jobKey).then((jobArr) => {
        if (jobArr && jobArr.length) {
          _this.setState({ job: jobArr[0] });
          spread.fromJSON(jobArr[0].template.ssjson);
          const sheetCount = spread.getSheetCount();
          // 绑定数据
          console.log(jobArr[0].data);
          for(let i=0; i<sheetCount; i++) {
            spread.getSheet(i).setDataSource(
              new GC.Spread.Sheets.Bindings.CellBindingSource(jobArr[0].data[spread.getSheet(i).name()])
            );
          }
        }
      });
    }

    exportExcel() {
      exportExcel(this.state.job.jobName, this.state.spread);
    }

    render() {
      return (
        <Modal
          title={"填报：" + this.state.job.jobName}
          centered
          visible={handleModalVisible}
          onOk={() => setHandleModalVisible(false)}
          okText={"确定"}
          onCancel={() => setHandleModalVisible(false)}
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

  const onHandleClick = (e) => {
    setJobKey(e.target.dataset.key);
    setHandleModalVisible(true);
  };

  class GetTable extends React.Component {
    state = {
      columns: [
        {
          title: "任务名称",
          dataIndex: "jobName",
          key: "jobName",
          render: (text) => <a>{text}</a>,
        },
        {
          title: "任务类型",
          dataIndex: "jobType",
          key: "jobType",
        },
        {
          title: "任务状态",
          dataIndex: "jobStatus",
          key: "jobStatus",
        },
        {
          title: "发起人",
          dataIndex: "creator",
          key: "creator",
        },
        {
          title: "填报人",
          dataIndex: "informant",
          key: "informant",
        },
        {
          title: "完成时间",
          dataIndex: "endTime",
          key: "endTime",
        },
        {
          title: "操作",
          key: "action",
          render: (text, record) => (
            <a href onClick={onHandleClick} data-key={record.key}>
              {"查看"}
            </a>
          ),
        },
      ],
      jobList: [],
    };

    constructor(props) {
      super(props);
      getJobs({ isDone: true }).then((list) => {
        this.setState({ jobList: list });
      });
    }

    render() {
      return (
        <Table columns={this.state.columns} dataSource={this.state.jobList} />
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
        isRequired: false,
        message: "请填写任务名称！",
        placeholder: "请填写任务名称",
      })
    );

    children.push(
      getSelector({
        key: "createJob2",
        name: "jobType",
        label: "任务类型",
        isRequired: false,
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
        isRequired: false,
        placeholder: "-- 请选择任务状态 --",
        optionArr: [
          {
            value: "已完成",
            text: "已完成",
          },
          {
            value: "已关闭",
            text: "已关闭",
          },
          {
            value: "待审核",
            text: "待审核",
          },
        ],
      })
    );

    children.push(
      getButtons({
        key: "createJob4",
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
        <h3>查询任务</h3>
        <Divider />
        <Row gutter={24}>{getFields()}</Row>
        <Divider style={{ borderTop: "10px" }} />
        <h3>任务列表</h3>
        <Divider />
        <GetTable></GetTable>
      </Form>
      <HandleModal />
    </div>
  );
};

export default MyDoneJobs;
