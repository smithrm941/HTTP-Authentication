const express = require('express')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const { create } = require('./db/index')
const app = express();

app.use(bodyParser.urlencoded({ extended: false}))
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

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
    req.session.id = email
    create(email, password).then(result => res.redirect('/'))
  }
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/')
})

app.listen(3000, () => {
  console.log('listening on port 3000');
})
