const router = require("koa-router")();
const request = require("request");

router.get("/githubLogin", async ctx => {
    // 获取令牌
    let access_token = await new Promise((success,error)=>{
        try{
            request.post('https://github.com/login/oauth/access_token', {
                form:{
                    "client_id":"cd5ff8839b5e6448b7f3",
                    "client_secret":"a193331ff8ce801dd36fa1398db3a62643dedbdc",
                    "code":ctx.query.code,
                    "state":ctx.query.state,
                }
            }, function (err,httpResponse,body) {
                if(err){
                    error(err);
                    return;
                }
                console.log(body);
                success(body);
            })
        } catch (e) {
            console.log("报错：" + e);
        }
    });

    await new Promise((success,error)=>{
        console.log(1111111,`https://api.github.com/use?${access_token}`);
        request({
            url:`https://api.github.com/use?${access_token}`,
            headers: {
                'User-Agent':"ZhangShuaiGe"
            }
        }, function (error, response, body) {
            console.log('error:', error); // Print the error if one occurred
            console.log("response",JSON.stringify(response));
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('11111111111111body:', body); // Print the HTML for the Google homepage.
        });
    })

});

module.exports = router;