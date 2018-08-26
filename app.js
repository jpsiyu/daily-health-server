const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const qs = require('querystring')
const request = require('request')
const CONF = require('./config.js')
const Users = require('./users')

// app and middlewares 
const app = express()
app.use(bodyParser.json())
app.use(morgan('tiny'))

app.get('/api/openid', (req, res) => {
    const code = req.query.code
    const data = {
        appid: 'wx5cd1e1f078680282',
        secret: '000d3ab836c0b37a2f7e122f89779635',
        js_code: code,
        grant_type: 'authorization_code',
    }
    const content = qs.stringify(data)

    const options = {
        protocol: 'https:',
        port: 443,
        hostname: 'https://api.weixin.qq.com',
        path: '/sns/jscode2session?' + content,
        method: 'GET',
    }
    const p = options.hostname + options.path

    request(p, (error, response, body) => {
        if (!error) {
            const bodyObj = JSON.parse(body)
            const openid = bodyObj.openid
            res.status(200).json({ ok: true, openid: openid, user: users.getUserInfo(openid) })
        } else {
            res.status(200).json({ ok: false, openid: undefined, user: undefined })
        }
    })
})

app.post('/api/update', (req, res) => {
    console.log(req.body)
    users.updateUserInfo(req.body)
    res.status(200).json({ ok: true })
})

app.use((req, res) => {
    res.type('text/plain')
    res.status(404).json('404 Not Found')
})

app.use((error, req, res, next) => {
    console.log(error.stack)
    res.status(500).json('505 Internal Server Error')
})

const users = new Users()
app.listen(CONF.port, '127.0.0.1', () => console.log(`server listening on ${CONF.port}`))