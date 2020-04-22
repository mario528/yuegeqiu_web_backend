module.exports = function homeBanner (req, res) {
    res.json({
        data: {
            banner: [
                {
                    url: 'https://yuegeqiu-mario.oss-cn-beijing.aliyuncs.com/banner_1.jpg'
                },
                {
                    url: 'https://yuegeqiu-mario.oss-cn-beijing.aliyuncs.com/banner_1.jpg'
                }
            ],
            news_list: [
                {
                    article_title: '惊！',
                    article_id: 0
                },
                {
                    article_title: '约个球',
                    article_id: 1
                },
                {
                    article_title: '加油',
                    article_id: 2
                },
                {
                    article_title: '我的妈呀',
                    article_id: 3
                }
            ]
        },
        status: true
    }) 
    res.end()
}