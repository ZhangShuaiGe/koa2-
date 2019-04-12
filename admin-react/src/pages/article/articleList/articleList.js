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

    articleList(page) {
        http.post({
            url:"/articleList",
            data:{
                "page": page || 1
            }
        }, res => {
            this.setState({
                data: res.list,
                pages:res.pages
            })
        });
    }

    render() {
        const {data,pages} = this.state;
        return (
                <div>
                    <Table  pagination={false} rowKey="id" columns={columns} dataSource={data}/>
                    <Pagination
                            hideOnSinglePage={false}
                            // defaultPageSize={pages.pageSize}
                    >
                    </Pagination>
                </div>
        )
    }
}