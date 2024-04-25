const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const sqlite3 = require('better-sqlite3')
const db = sqlite3('./users.db', {verbose: console.log})
const session = require('express-session')
const dotenv = require('dotenv'); 

dotenv.config()


const saltRounds = 10
const app = express()
const staticPath = path.join(__dirname, 'public')


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))



// Define your middleware and routes here


app.use(express.static(staticPath));


app.post('/login', (req, res) => {
    console.log('req.body:', req.body)
    let user = checkUserPassword(req.body.username, req.body.password) 
    if ( user != null) {
        req.session.loggedIn = true
        req.session.username = req.body.username
        req.session.userrole = user.role
        req.session.userid = user.userid

    //res.redirect('/');
    // Pseudocode - Adjust according to your actual frontend framework or vanilla JS

    } 

    if (user == null || !req.session.loggedIn) {
        res.json(null);
    }
    else {res.json(user)}


})

app.post('/register', (req, res) => {
    console.log("registerUser", req.body);
    const reguser = req.body;
    const user = addUser(reguser.username, reguser.firstname, reguser.lastname, reguser.password, reguser.role, reguser.email)
    // Redirect to user list or confirmation page after adding user
    if (user)   {
        req.session.loggedIn = true
        req.session.username = user.username
        req.session.userrole = user.role
        req.session.userid = user.id

        req.session.loggedIn = true
        res.redirect('/app.html');
        // Pseudocode - Adjust according to your actual frontend framework or vanilla JS
    } 
});

function addUser(username, firstname, lastname, password, roleId, email) {
    //Denne funksjonen må endres slik at man hasher passordet før man lagrer til databasen
    //rolle skal heller ikke være hardkodet.
    const saltRounds = 10
    const hash = bcrypt.hashSync(password, saltRounds)
    let sql = db.prepare("INSERT INTO user (username, firstname, lastname, password, roleId, email) " + 
                         " values (?, ?, ?, ?, ?, ?)")
    const info = sql.run(username, firstname, lastname, hash, roleId, email)
    
    //sql=db.prepare('select user.id as userid, username, task.id as taskid, timedone, task.name as task, task.points from done inner join task on done.idtask = task.id where iduser = ?)')
    sql = db.prepare('SELECT user.id as userId, user.username, role.name AS role FROM user INNER JOIN role on user.roleId = role.id WHERE user.id  = ?');
    let rows = sql.all(info.lastInsertRowid)  
    console.log("rows.length", rows.length)

    return rows[0]
}

app.get('/users', (req, res) => {
    const sql = db.prepare("SELECT user.id, user.username, user.firstname, user.lastname, user.email FROM user INNER JOIN role ON user.roleId = role.id WHERE role.name = 'User'")
    let rows = sql.all()
    console.log("rows.length", rows.length)

    res.send(rows);
});

function checkUserPassword(username, password){
    console.log(username, password)
    const sql = db.prepare('SELECT user.id as userid, user.username, role.name as role, password FROM user inner join role on user.roleId = role.id WHERE username  = ?');
    let user = sql.get(username);
    if (user.password == password) {
        return user 
    } else {
        null;
    }
}

function checkLoggedIn(req, res, next) {
    console.log('CheckLoggedIn')
    if (!req.session.loggedIn) {
        res.sendFile(path.join(__dirname, "./public/login.html"));
    } else {
        next();
    }

}

app.post("/updateUser", (req, res) => {
    console.log(req.body)
    const user = req.body
    if (user.password != "" || user.password != null) {
        updateUserDB2(user.userID, user.username, user.firstname, user.lastname, user.email, user.password)
    } else {
        updateUserDB(user.userID, user.username, user.firstname, user.lastname, user.email)
    }
    res.redirect('/');
})

function updateUserDB(id, username, firstname, lastname, email) {
    const sql = db.prepare("update user set username=(?), firstname=(?), lastname=(?), email=(?) WHERE id=(?)")
    const info = sql.run(username, firstname, lastname, email, id)
}

function updateUserDB2(id, username, firstname, lastname, email, password) {
    const sql = db.prepare("update user set username=(?), firstname=(?), lastname=(?), email=(?), password=(?) WHERE id=(?)")

    const hash = bcrypt.hashSync(password, saltRounds);

    const info = sql.run(username, firstname, lastname, email, hash, id)
}





app.get('/', checkLoggedIn,(req, res) => {
    res.sendFile(path.join(__dirname, "public/app.html"));
  });
  


//denne må defineres etter middleware. 
//Jeg prøvde å flytte den opp, for å rydde i koden og da fungerte det ikke
app.use(express.static(staticPath));


app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});





