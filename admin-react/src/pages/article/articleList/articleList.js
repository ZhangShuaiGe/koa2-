import React, {Component} from 'react';
import {Table, Divider, Tag, Button, Pagination} from 'antd';
import {http} from "@/pages/utils/http";

const columns = [{
    title: '日期',
    dataIndex: 'time',
    key: 'time',
    render: time => <span>{time}</span>,
    }, {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
}, {
    title: '类型',
    key: 'article_type.type',
    dataIndex: 'article_type.type',
    render: type => <Tag>{type}</Tag>
}, {
    title: '操作',
    key: 'action',
    render: (text, record) => (
        <span>
          <Button>编辑</Button>
          <Divider type="vertical"/>
          <Button type="danger">删除</Button>
        </span>
    ),
}];



export default class ArticleList extends Component {
    state = {
        data:[],
        pages:{},
    };

    componentDidMount() {
        this.articleList();
    }

    //文章列表
    articleList(page) {
        http.post({
            url:"/articleList",
            data:{
                "page": page || 1,
            }
        }, res => {
            this.setState({
                data: res.list,
                pages:res.pages
            })
        });
    }

    // 分页改变
    onShowSizeChange = (current, size) =>{
        this.articleList(current);
    };

    render() {
        const {data,pages} = this.state;
        return (
            <div>
                <Table  pagination={false} rowKey="id" columns={columns} dataSource={data}/>
                <div style={{"textAlign":"center","marginTop":"20px"}}>
                    <Pagination
                            hideOnSinglePage={true}
                            total={pages.count}
                            defaultPageSize={15}
                            onChange={this.onShowSizeChange}
                    >
                    </Pagination>
                </div>
            </div>
        )
    }
}