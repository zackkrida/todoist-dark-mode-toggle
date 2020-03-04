import { NowRequest, NowResponse } from "@now/node"
import fetch from "isomorphic-unfetch"
import crypto from "crypto"

const token = process.env.TODOIST_API_KEY

export default async (req: NowRequest, res: NowResponse) => {
  const todoist = await todoistAPI({
    path: "",
    data: {
      commands: [
        {
          type: "user_update",
          uuid: crypto.randomBytes(20).toString("hex"),
          args: { theme: 11 }
        }
      ]
    }
  })

  res.json(todoist)
}

const todoistAPI = async ({ path = "", data = {}, ...options }) => {
  let res = await fetch(`https://todoist.com/api-route${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      token,
      ...data
    })
  })

  return await res.json()
}
