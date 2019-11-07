const router = require('koa-router')({ prefix: '/api/blog' })
// router.prefix('/api/blog')
const loginCheck  = require('../middleware/loginCheck')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { getList ,getDetail, newBlog, updateBlog, deleteBlog }  = require('../controller/blog')

router.get('/list', async (ctx, next) => {
    let author = ctx.query.author || ''
    const keyword = ctx.query.keyword || ''
    // const loginResult = loginCheck(req)
    // 强制查询当前登陆用户的博客列表
    if(ctx.query.isadmin) {
        if(ctx.session.username == null) {
            // 有值说明返回的是promise对象，即登陆不成功
            ctx.body = new ErrorModel('用户名或密码不正确')
            return
        }
        author = ctx.session.username
    }
    const listData = await getList(author,keyword)
    if(listData){
        ctx.body = new SuccessModel(listData,'获取博客列表成功')
    }
})

router.get('/detail', async (ctx, next) => {
    const detailData = await getDetail(ctx.query.id)
    ctx.body = new SuccessModel(detailData,'获取博客详情成功')
})

router.post('/new', loginCheck, async (ctx, next) => {
    const body = ctx.request.body
    body.author = ctx.session.username
    const data = await newBlog(body)
    
    ctx.body = new SuccessModel(data,'新建博客成功') 
})

router.post('/update', loginCheck, async (ctx, next) =>{
    const flag = await updateBlog(ctx.query.id,ctx.request.body)
    if(flag) {
        ctx.body = new SuccessModel('更新博客成功')
    }else {
        ctx.body = new ErrorModel('更新博客失败')
    }
})

router.post('/del', loginCheck, async (ctx, next) => {
    const author = ctx.session.username
    const flag = await deleteBlog(ctx.query.id, author)
    if(flag) {
        ctx.body = new SuccessModel('删除博客成功')
    }else {
        ctx.body = new ErrorModel('删除博客失败')
    }
})

module.exports = router