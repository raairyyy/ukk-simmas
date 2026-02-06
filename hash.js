import bcrypt from 'bcryptjs'

const password = 'murni123'   // password asli
const saltRounds = 10

const hash = await bcrypt.hash(password, saltRounds)
console.log(hash)
