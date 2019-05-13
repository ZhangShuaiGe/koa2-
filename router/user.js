const router = require("koa-router")();
const request = require("request");
const {resJson} = require("~/controller/utils");

router.post("/githubLogin", async ctx => {
    // 获取令牌
    let access_token = await new Promise((resolve,reject)=>{
        try{
            request.post('https://github.com/login/oauth/access_token', {
                form:{
                    "client_id":"cd5ff8839b5e6448b7f3",
                    "client_secret":"a193331ff8ce801dd36fa1398db3a62643dedbdc",
                    "code":ctx.request.body.code,
                    "state":ctx.request.body.state,
                }
            }, function (err,httpResponse,body) {
                if(err){
                    error(err);
                    return;
                }
                console.log(body);
                resolve(body);
            })
        } catch (e) {
            console.log("报错：" + e);
            reject(e);
        }
    });

    //拿令牌 获取github 用户信息
    let github_val = await new Promise((resolve,reject)=>{
        try{
            request({
                url:"https://api.github.com/user?" + access_token,
                headers: {
                    'User-Agent':"ZhangShuaiGe"
                }
            }, function (error, response, body) {
                // console.log('error:', error); // Print the error if one occurred
                // console.log("response",JSON.stringify(response));
                // console.log('statusCode:', response && response.statusCode); // Print the response status code if a
                resolve(JSON.parse(body));
            });
        }catch(err){
            reject(err);
        }
    });
    console.log(github_val);
    resJson(ctx,1,github_val);

});

router.get("/githubLogin",async ctx => {
    ctx.render("user/githubLogin")
});

module.exports = router;