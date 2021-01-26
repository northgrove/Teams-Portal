const msgraph = require('../api/src/controllers/msgraph')
const jwtdecode = require('jwt-decode')


exports.showFrontPage = () => {
    return async (req, res) => {
      const userPhoto = await msgraph.getUserPhoto({
        userId: req.session.userid,
        refreshToken: req.session.refreshToken,
        userUpn: req.session.upn
      })
      console.log("\x1b[33m%s\x1b[0m" ,' - showing frontpage')
      console.log(req.session.aadcode)
      let now = Date.now();
      if (req.query.code) {
      let authcode = req.query.code
      console.log(authcode)
      res.send(`
        <html>
        <center>
          <h1>Azure AD Autorization Flow Example APP</h1>
          <a>You are now logged in</a>
          <br></br>
          <p><img src=${userPhoto} width="96" height="96" border="1"/></p>
          <p><b>Name:</b> ${req.session.displayName}</p>
          <p><b>Username:</b> ${req.session.upn}</p>

          <br></br>
          <a href="/auth/logout">Logout</a>
          <br><br>
          <a href=/token> Generate Service-to-service accessToken</a><br>
          <a href=/tokenuser> Generate accessToken with users refreshToken</a><br>
          <a href=/tokenbehalf> Generate accessToken with users existing accessToken</a><br>
          <br><br>
          <p> Verify token</p>
          <form action=/tokenverify>
            <input type=text name=token>
            <input type=submit value=Submit>
          </form>
          <br><br>
          <div>
          <h3> Lag nytt teams møte</h3><br>
          <label for="start">Start date:</label>
          <form action="/createteam/?code=${authcode}" method="POST">
          <input type="date" id="start" name="meetstart"
            value="2020-08-08"
            min="2018-01-01" max="2022-12-31">
            <input type="time" id="start-time" name="meetstarttime"
            value="03:00">
            <br>
            <label for="start">End date:</label>
            <input type="date" id="end" name="meetend"
            value="2020-08-08"
            min="2018-01-01" max="2022-12-31">
            <input type="time" id="end-time" name="meetendtime"
            value="04:00">
            <br>
            <label for="start">subject:</label>
            <input type="textbox" id="subject" name="subject">
            <br>
            <label for="start">epost til mottaker:</label>
            <input type="textbox" id="epost" name="epost">
            <br>
            <label for="start">Personnummer til mottaker:</label>
            <input type="textbox" id="personnummer" name="personnummer">

            <button type="submit">Lag nytt Teamsmøte</button>
            <br><br>
           
          </div>
          <div>
          <a href="/adauth">
          <button type="button" >login</button>
          </a>
          </div>
        </center>  
        </html>
      `)
      } else if (req.session.aadcode) {
       
        let idportentoken = req.session.aadcode
        let idportendecoded = jwtdecode(idportentoken)
        console.log(idportendecoded)
        let personnummer = idportendecoded.pid
        msgraph.findMeeting(personnummer, function(err, meeting) {
          console.log(meeting)
          let meeting2 = meeting.link
          let person = meeting.epost
          
             
        console.log(meeting2)
        res.send(`
        <html>
        <center>
        <div>Velkommen ${person}</div>
        <br><br>
        <label for="motelink">Din møtelink:</label> <br>
        <a href='${meeting2}'>${meeting2}</label>
        </center>  
        </html>
        `)
      })
      } else {
        res.redirect('/adauth')

      }
    }
  }

exports.logoutPage = () => {
  return async (req, res) => {
    res.send(`
        <html>
        <center>
          <br><br>
          <p>You are now logged out</p>
          <br><br>
          <a href="/login">Login</a>
        </center>  
        </html>
      `)
  }
}