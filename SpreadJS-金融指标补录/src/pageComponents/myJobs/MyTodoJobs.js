import React, { useState } from "react";
import { Form, Row, Table, Divider, Modal, Button } from "antd";
import { DownloadOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { getInput, getSelector, getButtons } from "../../utils/form";
import { getJobByKey, getJobs, updateJob } from "../../requests";
import { exportExcel, restorePaint } from "../spreadjs/ExcelUtils";

import "@grapecity/spread-sheets-resources-zh";
import GC from "@grapecity/spread-sheets";
import { SpreadSheets } from "@grapecity/spread-sheets-react";
import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css";
import { formatDate } from "../../utils/date";

const MyTodoJobs = () => {
  const [form] = Form.useForm();
  const [jobKey, setJobKey] = useState(null);
  const [handleModalVisible, setHandleModalVisible] = useState(false);

  class HandleModal extends React.Component {
    state = {
      spread: null,
      job: { jobName: "" },
    };

    initSpread(spread) {
      restorePaint()
      const _this = this;
      _this.setState({ spread: spread });
      getJobByKey({ key: jobKey }).then((jobArr) => {
        if (jobArr && jobArr.length) {
          _this.setState({ job: jobArr[0] });
          spread.fromJSON(jobArr[0].template.ssjson);
          // 生成绑定json
          const sheetCount = spread.getSheetCount();
          for(let i=0; i<sheetCount; i++) {
            spread.getSheet(i).setDataSource(
              new GC.Spread.Sheets.Bindings.CellBindingSource({})
            );
          }
        }
      });
    }

    exportExcel() {
      exportExcel(this.state.job.jobName, this.state.spread);
    }

    onSubmitClick() {
      //----- 工作状态更改 ------
      const job = this.state.job;
      job.isDone = true;
      job.endTime = formatDate();
      job.jobStatus = "已完成";
      job.informant = "张叁";
      console.log("job ========> ", job);

      // ----- 数据提交 -------
      const spread = this.state.spread;
      const sheetCount = spread.getSheetCount();
      const data = {};
      for(let i=0; i<sheetCount; i++) {
        const sheet = spread.getSheet(i);
        const dataSource = sheet.getDataSource().getSource();
        data[sheet.name()] = dataSource;
      }

      job.data = data;
      updateJob(job).then(
        (res) => {
          alert("提交成功！");
          console.log(res);
        },
        (err) => {
          console.log("提交失败！", err);
        }
      );
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
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            style={{ marginBottom: 10, marginLeft: 20 }}
            onClick={this.onSubmitClick.bind(this)}
          >
            提交填报数据
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
          render: (text, record) => <a href onClick={onHandleClick} data-key={record.key}>{text}</a>,
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
          title: "到达时间",
          dataIndex: "beginTime",
          key: "beginTime",
        },
        {
          title: "操作",
          key: "action",
          render: (text, record) => (
            <a href onClick={onHandleClick} data-key={record.key}>
              {"办理"}
            </a>
          ),
        },
      ],
      jobList: [],
    };

    constructor(props) {
      super(props);
      getJobs({ isDone: false }).then((list) => {
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
            value: "已激活",
            text: "已激活",
          },
          {
            value: "进行中",
            text: "进行中",
          },
          {
            value: "重新开始",
            text: "重新开始",
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

export default MyTodoJobs;
