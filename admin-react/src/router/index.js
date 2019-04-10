import {Switch, Route, Redirect} from 'react-router-dom';
import React, {Component} from 'react';
//根
import Base from "@/pages/base/base";
//登录
import Login from "@/pages/login/login";

class RouteConfig extends Component {
    render() {
        return (
            <Switch>
                <Route path="/admin/login" component={Login}></Route>
                <Route path="/admin/:id" component={Base}></Route>
                <Redirect to="/admin/login" />
            </Switch>
        )
    }
}

export default RouteConfig;