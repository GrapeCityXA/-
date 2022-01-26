import { Component } from 'react';

import "antd/dist/antd.css";
import "./Frame.css";
import logo from '../logo_spjs.png';

import { Layout, Menu, Breadcrumb } from 'antd';
import {
  TableOutlined,
  RadarChartOutlined,
  PlusCircleOutlined,
  ScheduleOutlined,
  BarChartOutlined,
  CaretRightOutlined,
  SearchOutlined,
  SettingFilled,
  UserOutlined
} from '@ant-design/icons';

import routeTo from '../router/config';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export default class SiderDemo extends Component {

  route_key = {
    "/createtemplate" : "1",
    "/managetemplate" : "2",
    "/createjobs" : "3",
    "/mytodojobs" : "6",
    "/mydonejobs" : "7",
    "/templatelist" : "8",
    "/designtemplate" : "9",
  }

  state = {
    route: window.location.hash.substr(1),
    selectedKeys: ["1"],
    openKeys: ["sub1"],
    user: "管理员"
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.substr(1);
      const hashKey = this.route_key[hash];
      this.setState({
        route: hash,
        selectedKeys: [hashKey]
      })
    })
  }

  switchUsers() {
    switch(this.state.user){
      case "管理员":
        this.setState({user: "张叁"})
        break;
      case "张叁":
        this.setState({user: "李四"})
        break;
      case "李四":
        this.setState({user: "王五"})
        break;
      case "王五":
        this.setState({user: "管理员"})
        break;
      default:
        break;
    }
  }

  render() {
    // console.log(window.location.hash.substr(1))
    let Child = routeTo(this.state.route);
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider>
          <div style={{textAlign: "center"}}>
            <img src={logo} className="logo" alt="logo" />
            <h3 style={{color: "#fff", marginBottom: "20px"}}>风险指标补录系统</h3>
          </div>

          <Menu theme="dark" mode="inline" defaultOpenKeys={this.state.openKeys} selectedKeys={this.state.selectedKeys}>
            <SubMenu key="sub1" icon={<TableOutlined />} title="模板管理">
              <Menu.Item key="1"><a href="#/createtemplate">模板创建</a></Menu.Item>
              <Menu.Item key="2"><a href="#/managetemplate">模板管理</a></Menu.Item>
            </SubMenu>
            
            <Menu.Item key="3" icon={<PlusCircleOutlined />}>
              <a href="#/createjobs">创建任务</a>
            </Menu.Item>

            <Menu.Item disabled key="4" icon={<ScheduleOutlined />}>
              指标管理
            </Menu.Item>
            
            <Menu.Item disabled key="5" icon={<RadarChartOutlined />}>
              维度管理
            </Menu.Item>

            <SubMenu key="sub2" icon={<CaretRightOutlined />} title="我的任务">
              <Menu.Item key="6"><a href="#/mytodojobs">我的待办</a></Menu.Item>
              <Menu.Item key="7"><a href="#/mydonejobs">我的已办</a></Menu.Item>
            </SubMenu>

            <SubMenu key="sub3" icon={<BarChartOutlined />} title="数据汇总">
              <Menu.Item key="8"><a href="#/templatelist">查看模板</a></Menu.Item>
              <Menu.Item key="9"><a href="#/designtemplate">设计汇总模板</a></Menu.Item>
            </SubMenu>

          </Menu>
        </Sider>

        <Layout className="site-layout" style={{ backgroundColor: "#fff" }}>
          <Header className="site-layout-header" style={{ padding: 0, height:50, backgroundColor:"#eee", textAlign:"right", fontSize:"16px", lineHeight:"50px" }} >
            <div style={{marginRight: "50px"}}>
              <SearchOutlined className="header-icons" /> 
              <SettingFilled className="header-icons"/> 
              <UserOutlined className="header-icons" onClick={this.switchUsers.bind(this)} /> 
              <span className="header-icons">
                {this.state.user}
              </span>
            </div>
          </Header>
          <Content style={{ margin: '0 16px' }}>
            
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item href="#/createtemplate">模板创建</Breadcrumb.Item>
              <Breadcrumb.Item href="#/managetemplate">模板管理</Breadcrumb.Item>
              <Breadcrumb.Item href="#/createjobs">创建任务</Breadcrumb.Item>
              <Breadcrumb.Item href="#/mytodojobs">我的待办</Breadcrumb.Item>
              <Breadcrumb.Item href="#/mydonejobs">我的已办</Breadcrumb.Item>
              <Breadcrumb.Item href="#/templatelist">查看模板</Breadcrumb.Item>
              <Breadcrumb.Item style={{color: "rgba(0, 0, 0, 0.45)"}} href="#/designtemplate">设计汇总模板</Breadcrumb.Item>
            </Breadcrumb>

            <div className="site-layout-background" style={{ padding: 12, minHeight: 360, maxHeight: 'calc(100vh - 150px)' }}>
              <Child />
            </div>
            
          </Content>
          <Footer style={{ textAlign: 'center', padding: '12px 50px', backgroundColor: "#eee" }}>copyright ©2021 西安葡萄城软件有限公司</Footer>
        </Layout>
      </Layout>
    );
  }
}
