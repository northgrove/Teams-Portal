const passport = require('passport')
const { logoutURL } = require('../config/passportConfig')
const token = require('./token')
const request = require('request')
const { session } = require('passport')


// AZURE AUTHENTICATE

exports.authenticateAzure = () => {
  return (req, res, next) => {
    const concatUrl = params => {
      let string = ''
      Object.keys(params).forEach(e => {
        if (params[e]) string = `${string}/${params[e]}`
      })
      return string.toString()
    }
    req.session.redirectUrl = concatUrl(req.params)
    try {
      console.log("\x1b[33m%s\x1b[0m" ,' - redirecting to Azure AD for authentication')
      passport.authenticate('azuread-openidconnect', {
        response: res,
        // resourceURL: 'b36e92f3-d48b-473d-8f69-e7887457bd3f', // ## Use if need accesstoken during login
        successRedirect: '/',
        failureRedirect: '/error',
        tenantIdOrName: 'msgroveb2c.onmicrosoft.com'
      })(req, res, next)
    } catch (err) {
      throw `ERROR during authentication: ${err}`
    }
  }
}


// AZURE CALLBACK

exports.authenticateAzureCallback = () => {
  return (req, res, next) => {
    console.log("\x1b[33m%s\x1b[0m" ,' - got callback from Azure AD')
    console.log("\x1b[33m%s\x1b[0m" ,' - Response: ', req.body)
    try {
      passport.authenticate('azuread-openidconnect', {
        response: res,
        successRedirect: req.session.redirectUrl || '/',
        failureRedirect: '/error'
      })(req, res, next)
    } catch (err) {
      throw `ERROR during authentication: ${err}`
    }
  }
}


// AUTHENTICATION CHECK

exports.ensureAuthenticated = () => {
  return async (req, res, next) => {
    console.log("\x1b[33m%s\x1b[0m" ,' - is user authenticated?: ', req.isAuthenticated())
    if (req.isAuthenticated()) {
      /*
      resource = process.env['AZURECONFIG_CLIENTID']
      const bastaToken = await token.validateRefreshAndGetToken( // # Only placed here as an example. In real world do this in the request to backend services insted
        req.session.userid,
        req.session.refreshToken,
        resource
      )
      //console.log(bastaToken)
      */
      return next()
    }
    res.redirect('/login') //?p=B2C_1_signin'')
  }
}


// LOGOUT

exports.logout = (req, res) => {
 return (req, res) => {
    try {
      console.log("\x1b[33m%s\x1b[0m" ,' - logging out')
      req.logout()
      req.session = null
      res.redirect(logoutURL)
    } catch (err) {
      res.status(500).send(err)
      return `ERROR during logout: ${err}`
    }
  }
}


exports.adauth = () => {
  return async (req, res) => {
    let url = 'https://login.microsoftonline.com/596cdefa-aeb5-4122-83b8-ff2da9d9a3d2/oauth2/v2.0/authorize?'
    let clientid = 'client_id=' + process.env['AZURECONFIG_CLIENTID3']
    let response_type='&response_type=code'
    let redirect_uri='&redirect_uri=http://localhost:8080/adcallback'
    let response_mode='&response_mode=query'
    let scope='&scope=openid'
    let state='&state=jau'

    let authurl = url + clientid + response_type + redirect_uri + response_mode + scope + state
    res.redirect(authurl)
}
}

exports.adauthcallback = () => {
  return (req, res) => {
    //res.session.aadcode = req.query.code
    //console.log(res.session.aadcode)
    res.redirect("/?code=" + req.query.code)
  }
  
}