/**
 * @file reviewer.ts
 * @description Sends extracted contract text to Claude and returns a structured risk review
 */

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export type ContractReview = {
  summary: string;
  clauses: {
    name: string;
    text: string;
    risk: 'low' | 'medium' | 'high';
    explanation: string;
  }[];
  missing: string[];
  redFlags: string[];
};

const SYSTEM_PROMPT = `
You are a contract analyst. Review contracts and identify key clauses, risks, and missing standard terms.
You are not providing legal advice — you are flagging patterns for human review.

Respond with valid JSON matching this exact shape:
{
  "summary": "plain English summary of what this contract does",
  "clauses": [
    {
      "name": "clause name",
      "text": "relevant excerpt from the contract",
      "risk": "low" | "medium" | "high",
      "explanation": "why this risk level"
    }
  ],
  "missing": ["standard clauses not found in this contract"],
  "redFlags": ["anything requiring immediate attention"]
}

Return raw JSON only. No markdown, no code fences, no explanation outside the JSON.
`;

export async function reviewContract(text: string): Promise<ContractReview> {
  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Please review this contract:\n\n${text.slice(0, 12000)}`, // ~3000 tokens
      },
    ],
  });

  const raw = response.content[0].type === 'text' ? response.content[0].text : null;
  if (!raw) throw new Error('No response from Claude');

  // strip code fences in case Claude wraps the JSON
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  return JSON.parse(cleaned) as ContractReview;
}