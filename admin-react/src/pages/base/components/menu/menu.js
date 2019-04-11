import React, {Component} from 'react';
import { Menu, Icon} from 'antd';
import {withRouter} from "react-router-dom";
import "./menu.less";
const SubMenu = Menu.SubMenu;

class MenuList extends Component {

    clickMenu = (e) => {
        this.props.history.push(e.key);
    }

    state = {
        collapsed: false,
    }

    render() {
        return (
            <div>
                <div className="ui-logo"></div>
                <Menu
                    onClick={this.clickMenu}
                    className="nenu-height"
                    defaultOpenKeys={['sub1']}
                    defaultSelectedKeys={["/admin/articleList"]}
                    mode="inline"
                    theme="dark"
                    inlineCollapsed={this.state.collapsed}
                >
                    <SubMenu key="sub1" title={<span><Icon type="mail" /><span>文章管理</span></span>}>
                        <Menu.Item key="/admin/articleList">文章列表</Menu.Item>
                        <Menu.Item key="/admin/articlePublish">文章发布</Menu.Item>
                        <Menu.Item key="/admin/articleSet">文章设置</Menu.Item>
                    </SubMenu>

                </Menu>
            </div>
        );
    }
}
export default withRouter(MenuList)