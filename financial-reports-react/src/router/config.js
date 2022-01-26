// 引入路由视图组件
import CreateTemplate from '../pageComponents/templateManager/CreateTemplate'
import ManageTemplate from '../pageComponents/templateManager/ManageTemplate'
import CreateJobs from '../pageComponents/createJobs/CreateJobs'
import MyTodoJobs from '../pageComponents/myJobs/MyTodoJobs'
import MyDoneJobs from '../pageComponents/myJobs/MyDoneJobs'
import TemplateList from '../pageComponents/DataSummary/TemplateList'
import DesignTemplate from '../pageComponents/DataSummary/DesignTemplate'

// 路由配置表
const routes = {
    "/createtemplate" : CreateTemplate,
    "/managetemplate" : ManageTemplate,
    "/createjobs" : CreateJobs,
    "/mytodojobs" : MyTodoJobs,
    "/mydonejobs" : MyDoneJobs,
    "/templatelist" : TemplateList,
    "/designtemplate" : DesignTemplate
};

// 抛出路由配置表
export default function routeTo(link) {
    return routes[link] ? routes[link] : CreateTemplate;
};
