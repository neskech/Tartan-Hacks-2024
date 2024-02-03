/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { assert } from "console";
import { type NextApiRequest, type NextApiResponse } from "next";
import execCommand from "~/util/commandExecutor";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    const prompt = req.body.prompt as string | null
    assert(prompt != null)

    await execCommand('python hehehee')

    //send audio data over
    res.send({})
}
