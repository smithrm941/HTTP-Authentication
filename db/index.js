const pg = require('pg-promise')()
const db = pg(`postgres://${process.env.USER}@localhost:5432/auth`)

const createUser = "INSERT INTO users(email, password) VALUES($1, $2) RETURNING *"

module.exports = {
  create: (email, password) => db.oneOrNone(createUser, [email, password]),
}
