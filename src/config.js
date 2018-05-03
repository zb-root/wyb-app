var ENV
let gConfig = {
  localhost: {
    apiHost: 'http://localhost:20200'
  },
  development: {
    apiHost: 'http://api.wyb.jamma.cn',
    staticHost: 'http://www.wyb.jamma.cn'
  },
  production: {
    apiHost: 'http://api.wyb.jamma.cn',
    staticHost: 'http://api.wyb.jamma.cn'
  }
}
let apiHost, staticHost

gConfig = gConfig[ENV || 'development']

apiHost || (apiHost = gConfig.apiHost)
staticHost || (staticHost = gConfig.staticHost)

global.apiHost = apiHost
global.avatarsrc = staticHost

global.sso = apiHost + '/sso'
global.passport = apiHost + '/passport'
global.user = apiHost + '/user'
global.verifycode = apiHost + '/verifycode'
global.company = apiHost + '/company'
global.insider = apiHost + '/insider'
global.wechat = apiHost + '/wechat'
global.appCertificate = false
