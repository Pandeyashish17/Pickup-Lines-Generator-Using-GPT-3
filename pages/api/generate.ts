import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { keyword } = req.query;
  const API_KEY = req.query.apikey;
  const count = parseInt(req.query.count as string, 10);

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/engines/text-davinci-003/completions",
      {
        prompt: `Generate a pickup line about ${keyword} and don't repeat the same pickup line.`,
        max_tokens: 1000,
        temperature: 0.5,
        n: count,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Get the generated pickup lines from the response
    const { choices } = response.data;
    const generatedLines = choices.map((choice: any) => {
      return { line: choice.text.trim() };
    });
    console.log(generatedLines);

    // Send the pickup lines back to the client
    res.status(200).json(generatedLines);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
