import { NowRequest, NowResponse } from '@now/node'
import fetch from 'isomorphic-unfetch'
import crypto from 'crypto'

const token = process.env.TODOIST_API_KEY
const themes = {
  dark: 11,
  light: 0
}

export default async (req: NowRequest, res: NowResponse) => {
  const theme = (req.query.theme as string) || 'dark'

  const todoist = await todoistAPI({
    data: {
      commands: [
        {
          type: 'user_update',
          uuid: crypto.randomBytes(20).toString('hex'),
          args: { theme: themes[theme] }
        }
      ]
    }
  })

  res.json(todoist)
}

const todoistAPI = async ({ data = {}, ...options }) => {
  try {
    let res = await fetch(`https://api.todoist.com/sync/v8/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token,
        ...data
      })
    })
    return await res.json()
  } catch (error) {
    console.error(error.message)
  }
}
