const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const { create, findUser } = require('./db/index')
const app = express();

app.use(bodyParser.urlencoded({ extended: false}))
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug')

app.get('/', (req, res) => {
  if(!req.session.populated){
    res.render('index')
  } else if(req.session.populated){
    res.render('index', {email: req.session.id})
  }
})

app.get('/signup', (req, res) => {
  res.render('signup')
})

app.post('/signup', (req, res) => {
  const { email, password, passwordConfirmation } = req.body
  if(!email || !password){
    res.render('signup', {message: 'Please provide an email and a password to sign up'})
  } else if (password !== passwordConfirmation) {
    res.render('signup', {message: 'Passwords do not match'})
  } else if (email && password && password === passwordConfirmation){
    findUser(email)
      .then(result => {
        const userExists = (result[0].email === email)
        if(userExists) {
          res.render('signup', {message: 'User already exists.'})
        } 
      })
      .catch(err => {
        req.session.id = email
        create(email, password).then(result => res.redirect('/'))
      })
  }
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/login', (req, res) => {
  const { email, password } = req.body
  if(!email || !password){
    res.render('login', {message: 'Please provide an email and a password to log in.'})
  }
  findUser(email)
    .then(result => {
      const match = (result[0].password === password)
      if(!match){
        res.render('login', {message: 'Incorrect email or password.'})
      }
    })
    .then(result => {
      req.session.id = email
      res.redirect('/')
    })
    .catch(err => {
      console.log(err);
      res.render('login', {message: 'Incorrect email or password'})
    })
})

app.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/')
})

app.listen(3000, () => {
  console.log('listening on port 3000');
})
