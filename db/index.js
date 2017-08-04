const pg = require('pg-promise')()
const db = pg(`postgres://${process.env.USER}@localhost:5432/auth`)

const createUser = "INSERT INTO users(email, password) VALUES($1, $2) RETURNING *"
const findUser = "SELECT email, password FROM users WHERE email = $1;"

module.exports = {
  create: (email, password) => db.oneOrNone(createUser, [email, password]),
  findUser: email => db.any(findUser, [email])
}
