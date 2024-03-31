/* eslint-disable quote-props, @typescript-eslint/naming-convention */

import Anthropic from "@anthropic-ai/sdk";
import {ANTHROPIC_KEY} from "/server/variable";


const anthropic = new Anthropic({apiKey: ANTHROPIC_KEY});

export async function askClaude(userPrompt: string, systemPrompt?: string): Promise<string> {
  const message = await anthropic.messages.create({
    "model": "claude-3-sonnet-20240229",
    "max_tokens": 1000,
    "temperature": 1,
    "system": systemPrompt,
    "messages": [{
      role: "user",
      content: [{
        type: "text",
        text: userPrompt
      }]
    }]
  });
  const text = message.content.find((block) => block.type === "text")?.text ?? "";
  return text;
}