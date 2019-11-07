const router = require('koa-router')({ prefix: '/api/user' })
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { login } = require('../controller/user')

router.post('/login', async (ctx, next) => {
    const { username, password } = ctx.request.body
    const userData = await login(username, password)

    if(userData.username){
        // 设置session
        ctx.session.username = userData.username
        ctx.session.realname = userData.realname
        ctx.body = new SuccessModel('登陆成功') 
        return
    }
    ctx.body = new ErrorModel('用户名或密码不正确1') 
})

// router.get('/session-test', async (ctx, next) => {
//     if(ctx.session.viewCount == null) {
//         ctx.session.viewCount = 0
//     }
//     ctx.session.viewCount++
//     ctx.body = {
//         errno: 0,
//         viewCount:ctx.session.viewCount
//     }
// })

module.exports = router