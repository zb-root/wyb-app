var ENV
let gConfig = {
  localhost: {
    apiHost: 'http://localhost:20200'
  },
  development: {
    apiHost: 'http://api.wyb.jamma.cn',
    avatarHost:'http://www.wyb.jamma.cn',
    staticHost: 'http://www.wyb.jamma.cn/wyb/app'
  },
  production: {
    apiHost: 'http://api.wyb.jamma.cn',
    staticHost: 'http://www.wyb.jamma.cn'
  }
}
let apiHost, staticHost,avatarHost

gConfig = gConfig[ENV || 'development']

apiHost || (apiHost = gConfig.apiHost)
staticHost || (staticHost = gConfig.staticHost)
avatarHost || (avatarHost = gConfig.avatarHost)

global.apiHost = apiHost
global.staticHost = staticHost
global.avatarsrc = avatarHost

global.sso = apiHost + '/sso'
global.passport = apiHost + '/passport'
global.user = apiHost + '/user'
global.verifycode = apiHost + '/verifycode'
global.company = apiHost + '/company'
global.insider = apiHost + '/insider'
global.wechat = apiHost + '/wechat'
global.passport_wechat = apiHost + '/passport/wechat'
global.redirect_uri = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7c7aa23a249cf275&redirect_uri='
global.appCertificate = false
