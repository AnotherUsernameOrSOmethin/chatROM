const fs = require('fs')
const path = require('path')
const express = require('express')
const session = require('express-session')
const hbs = require('hbs')
const sqlite3 = require('better-sqlite3')
const db = sqlite3('./chatroom2.db')


//Starter opp express, og skrur på public-mappen
const app = express()
const pubDirPath = path.join(__dirname, "./public")
app.use(express.static(pubDirPath))

//Bruker urlencoded-middleware, for å la oss få tilgang til request.body i post-forms
app.use(express.urlencoded({ extended: true }));

//Legger til Handlebars for å få til Server Side Rendering
const viewPath = path.join(__dirname, "./views/pages")
const partialsPath = path.join(__dirname, "./views/partials")
app.set("view engine", hbs)
app.set('views',viewPath)
hbs.registerPartials(partialsPath)

app.use(session({
    secret: "shut up",
    resave: false,
    saveUninitialized: false
}))

exports.app = app
exports.db = db