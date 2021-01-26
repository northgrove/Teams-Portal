const request = require('request-promise').defaults({ encoding: null })
const token = require('./token')
const { defaultPhoto } = require('./defaultPhoto')
const config = require('../config/passportConfig')
const atoken = require('../controllers/getAccesstoken')
const { response } = require('express')

// GET USERS PHOTO FROM MICROSOFT GRAPH API
exports.getUserPhoto = async ({ userId, refreshToken, userUpn }) => {
  console.log("\x1b[33m%s\x1b[0m" ,' - requesting userphoto from graph.microsoft.com')
  let userPhoto = ''
  const resource = 'https://graph.microsoft.com'
  const accessToken = "jaujau" //await token.validateRefreshAndGetToken(userId, refreshToken, resource)
  return request
    .get({
      headers: { 'content-type': 'image/jpg' },
      url: `https://graph.microsoft.com/beta/users/${userUpn}/photo/$value`,
      auth: { bearer: accessToken }
    })
    .then(response => {
      userPhoto = 'data:image/jpg;base64,' + new Buffer.from(response).toString('base64')
      console.log("\x1b[33m%s\x1b[0m" ,' - got users photo in return from graph.microsoft.com')
      return userPhoto
    })
    .catch(err => {
      console.log("\x1b[33m%s\x1b[0m" ,' - an error occured getting user photo, sending default photo. Make sure your Azure AD app has access to the Graph API and that the user has a photo uploaded')
      userPhoto = defaultPhoto
      return userPhoto
    })
}


exports.createTeamsmeeting =  () => {
  return async (req, res, next) => {
  console.log("\x1b[33m%s\x1b[0m" ,' - createing new team meeting')
  //console.log(req)
  //console.log(req.user)
  userId = req.user.upn
  refreshToken = req.user.refreshToken
  var aadcode = req.query.code
  console.log(req)
  let teamslink = ''
  const resource = 'https://graph.microsoft.com'
  const tokenURI = 'https://login.microsoftonline.com/msgrove.onmicrosoft.com/oauth2/token'
  const accessToken = await atoken.getAccessTokenUser(tokenURI, aadcode, resource)
  
  //const accessToken = await token.validateRefreshAndGetToken(userId, refreshToken, resource)
 
  console.log(accessToken)

  const onlineMeeting = {
    'startDateTime':req.body.meetstart + 'T' + req.body.meetstarttime + '.0000000-00:00',
    'endDateTime':req.body.meetend + 'T' + req.body.meetendtime + '.0000000-00:00',
    'subject':req.body.subject
  };

  JSONform = JSON.stringify(onlineMeeting)
  console.log(JSONform)

  let newMeeting = []
  newMeeting.personnummer = req.body.personnummer
  newMeeting.epost = req.body.epost
  newMeeting.subject = req.body.subject

  return request
    .post({
      headers: { 'content-type': 'application/json' },
      url: `https://graph.microsoft.com/beta/me/onlinemeetings`,
      auth: { bearer: accessToken },
      body: JSONform
    })
    /*.on('response', function(response) {
     console.log(response) // <--- Here 200
     })*/
     
  
    .then(response => {
      teamsmeeting = JSON.parse(new Buffer.from(response).toString())
      console.log("\x1b[33m%s\x1b[0m" ,' - got teams meeting in return from graph.microsoft.com')
      console.log(teamsmeeting)
      newMeeting.link = teamsmeeting.joinWebUrl
      this.meetings.push(newMeeting)
      this.findMeeting(newMeeting.personnummer, async function(err, meeting) {
        console.log(meeting)
      })
      res.send(`
      <html>
      <center>
      <div>Nytt teammøte er opprettet</div>
      <br><br>
      <label for="motelink">Din møtelink:</label> <br>
      <a href='${teamsmeeting.joinWebUrl}'>${teamsmeeting.joinWebUrl}</a>
      <br><br>
      Subject: ${teamsmeeting.subject}
      <br>
      Deltakere: ${newMeeting.epost}
      <br>
      Dato: ${teamsmeeting.startDateTime}
      <br>


      </center>  
      </html>
      
      `)
    })
    .catch(err => {
      console.log("\x1b[33m%s\x1b[0m" ,' - an error occured getting teams meeting')
      errresp = new Buffer.from(err.error).toString()
      console.log(errresp)
      return err
    })
  }
}


exports.meetings = []

// SEARCH FOR USER IN STORE
exports.findMeeting = async function(personnummer, fn) {
  for (let i = 0, len = exports.meetings.length; i < len; i++) {
    var meeting = exports.meetings[i]
    if (meeting.personnummer === personnummer) {
      return fn(null, meeting)
    }
  }
  return fn(null, null)
}