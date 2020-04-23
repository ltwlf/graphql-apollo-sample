import * as isEmail from 'isemail'
import { UserAdapter } from './adapter'

export const context = async ({ request: req, context }) => {

    const auth = (req.headers && req.headers.authorization) || ""

    const email = Buffer.from(auth, "base64").toString("ascii")
    if (!isEmail.validate(email)) return { user: null }

    const userAdapter = new UserAdapter()
    userAdapter.initialize({} as any)

    const user = await userAdapter.findOrCreateUser({ email })

    return { user }
}