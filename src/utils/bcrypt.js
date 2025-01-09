import { hash, compare } from "bcrypt";

export const hashPassword = async (password) => {
  const saltsRound = 10
  return await hash(password, saltsRound)
}

export const comparePassword = async (password, hashedPassword) => {
  return await compare(password, hashedPassword)
}