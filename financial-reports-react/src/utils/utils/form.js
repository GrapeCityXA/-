
import { Form, Row, Col, Input, Button, Select, Upload, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

export const getInput = (options) => {
  const { key, name, label, isRequired, message, placeholder } = options;

  return (
    <Col span={6} key={key}>
      <Form.Item
        key={key + "_form_item1"}
        name={name}
        label={label}
        rules={[
          {
            required: isRequired,
            message: message,
          },
        ]}
      >
        <Input placeholder={placeholder} />
      </Form.Item>
    </Col>
  );
};

export const getSelector = (options) => {
  const { key, name, label, isRequired, message, placeholder, optionArr } = options;

  return (
    <Col span={6} key={key}>
      <Form.Item
        key={key + "_form_item1"}
        name={name}
        label={label}
        rules={[{ required: isRequired, message: message }]}
      >
        <Select 
          placeholder={placeholder}>
          {optionArr.map((item) => (
            <Option value={item.value}>{item.text}</Option>
          ))}
        </Select>
      </Form.Item>
    </Col>
  );
};

export const getUploader = (options) => {
  let { key, direction, action, text, beforeUpload, accept } = options;

  direction = direction ? direction : "vertical";

  return (
    <Col span={6} key={key}>
      <Row gutter={16} key={key + "_uploader"}>
        <Col span={8} key={key + "_uploader_label"}>
          <span style={{ verticalAlign: "bottom" }}>{text}</span>
        </Col>

        <Col span={8} key={key + "_uploader_button"}>
          <Space direction={direction} style={{ width: "100%" }} size="small">
            <Upload
              action={action}
              maxCount={1}
              accept={accept}
              beforeUpload={beforeUpload}
            >
              <Button icon={<UploadOutlined />}>上传文件</Button>
            </Upload>
          </Space>
        </Col>
      </Row>
    </Col>
  );
};

export const getButtons = (options) => {
  const {
    key,
    textAlign,
    primaryText,
    primaryClick,
    viceText,
    viceClick,
  } = options;

  return (
    <Col key={key} span={6} style={{ textAlign: { textAlign } }}>
      <Button type="primary" onClick={primaryClick}>
        {primaryText}
      </Button>
      <Button
        style={{
          margin: "0 8px",
        }}
        onClick={viceClick}
      >
        {viceText}
      </Button>
    </Col>
  );
};