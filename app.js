const { response, request } = require('express')
const upset = require('./upset.js')
const bcrypt = require('bcrypt')
const app = upset.app
const db = upset.db
let lastUpdate = new Date().getTime()

function anonify(request){
    request.session.currentUserName = "anon"
    request.session.currentUser = "1"
}

//PAGE HANDLERS
app.get('', (request, response)=>{
    if (request.session.currentUserName === undefined){
        anonify(request)
    } else {}
    const sql = db.prepare(`
    SELECT * FROM messages INNER JOIN user ON messages.id = user.id
    `);
    const rows = sql.all()
    response.render("index.hbs", {
        content: rows,
        currentUserName: request.session.currentUserName
        })
    console.log(request.session.currentUserName)
})

app.get('/register', (request, response)=>{
    response.render("register.hbs")
})

app.get('/login', (request, response)=>{
    response.render("login.hbs")
})

app.get('/logout', (request, response)=>{
    anonify(request)
    request.session.loggedIn = false
    response.redirect("back")
})

// PENSJONERTE HANDLERE TIL PROFILSIDE
app.get('/profile', (request, response)=>{
    response.redirect("back")
})
app.get('/profileSelf', (request, response)=>{
    response.redirect("back")
})

//ACCOUNT HANDLING

app.post("/usrDatPush", (request, response)=>{
    console.log(request.body)
    const newUsername = request.body.newUsername
    const newPassword = request.body.newPassword
    const paswdConf = request.body.passwordConf

    let hashedBrown = bcrypt.hashSync(newPassword, 10)

    if (newPassword === paswdConf){
        const sql4 = db.prepare('INSERT INTO user (user, paswd) VALUES (?,?)')
        sql4.run(newUsername, hashedBrown)
        const sql5 = db.prepare('SELECT * FROM user WHERE user=?')
        const user = sql5.get(newUsername)
        request.session.currentUser = user.id
        request.session.currentUserName = user.user
        request.session.loggedIn = true
        response.redirect('/')
        SFXacc.play()
    } else {}
})

app.post("/usrDatCheck", (request, response)=>{
    const checkUsername = request.body.username
    const checkPassword = request.body.password


    const sql5 = db.prepare('SELECT * FROM user WHERE user=?')
    const user1 = sql5.get(checkUsername)

    if (user1 == undefined) {
        response.render("login.hbs", {
            error: "[this account doesn't exist!]"
        })
        return
    }

    const result = bcrypt.compareSync(checkPassword, user1.paswd)
    console.log(result)

    if (result === true) {
        request.session.currentUser = user1.id
        request.session.currentUserName = user1.user
        request.session.loggedIn = true
        response.redirect("/")
    }
    else if (result === false) {
        response.render("login.hbs", {
            error: "[username or password incorrect!]"
        })
        return
    }
    console.log(user1)

})

app.get("/usrBeGone", (request, response)=>{
    const user = request.session.currentUser
    if (user === "1") {
        response.redirect("back")
        return
    }
    else {
    console.log({user})
    const sql6 = db.prepare('DELETE FROM user WHERE id=?')
    sql6.run(user)
    anonify(request)
    response.redirect("back")
    }
})

//MESSAGE HANDLING

app.post("/msgSend", (request, response)=>{
    console.log(request.body)
    const msg = request.body.new_msg
    if (msg != ""){
        const sql3 = db.prepare('INSERT INTO messages (msg_txt,id) VALUES (?,?)')
        sql3.run(msg, request.session.currentUser)
    } else {}
    response.redirect("back")
})

app.get('/msgDel', (request, response) => {
    const msgID = request.query.id
    const userID = request.session.currentUser
    const sql = db.prepare("DELETE FROM messages WHERE msg_id=? AND id=? OR id=1")
    sql.run(msgID, userID)
    console.log(request.query.id + " will be eliminated.")
    response.redirect("back")
})

app.get('/msgGet', (request, response) =>{
    response.send(lastUpdate)
})

//SERVER OPERATIONAL
app.listen(3000, ()=>{ 
    console.log("Server is up! Check http://localhost:3000")
})

