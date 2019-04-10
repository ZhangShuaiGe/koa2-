import React, {Component} from 'react';
import { Layout,Icon } from 'antd';
import Menu from "@/pages/base/components/menu";
import Router from "@/pages/base/components/router";
const { Header, Sider, Content } = Layout;
class Base extends Component {
    constructor(){
        super();
        this.state = {
            collapsed: false,
        };
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    render() {
        return (
            <Layout>
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={this.state.collapsed}
                >
                    <Menu />
                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', padding:"0 20px"}}>
                        <Icon
                            className="trigger"
                            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.toggle}
                        />
                    </Header>
                    <Content style={{
                        margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280,
                    }}
                    >

                        {this.props.match.url}
                        {this.props.match.path}
                        <Router></Router>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

export default Base;
