import React, {Component} from 'react';
import {Table, Divider, Tag, Button } from 'antd';
import {http} from "@/pages/utils/http";

const columns = [{
    title: '日期',
    dataIndex: 'name',
    key: 'name',
    render: text => <a href="javascript:;">{text}</a>,
    }, {
    title: '标题',
    dataIndex: 'age',
    key: 'age',
}, {
    title: '类型',
    key: 'tags',
    dataIndex: 'tags',
    render: tags => (
            <span>
                  {tags.map(tag => {
                      let color = tag.length > 5 ? 'geekblue' : 'green';
                      if (tag === 'loser') {
                          color = 'volcano';
                      }
                      return <Tag color={color} key={tag}>{tag.toUpperCase()}</Tag>;
                  })}
            </span>
    ),
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

const data = [{
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
}, {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
}, {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
}];

export default class ArticleList extends Component {
    constructor(){
        super();
        http.post({
            url:"/admin/articleList"
        })
    }
    render() {
        return (
                <div>
                    <Table columns={columns} dataSource={data}/>
                </div>
        )
    }
}