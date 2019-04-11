import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import ArticleList from "@/pages/article/articleList/articleList.js";
import articlePublish from "@/pages/article/articlePublish/articlePublish.js";
import articleSet from "@/pages/article/articleSet/articleSet.js";
export default class Router extends Component{
    render() {
        return (
            <Switch>
                <Route path="/admin/ArticleList" component={ArticleList}></Route>
                <Route path="/admin/articlePublish" component={articlePublish}></Route>
                <Route path="/admin/articleSet" component={articleSet}></Route>
            </Switch>
        )
    }
}