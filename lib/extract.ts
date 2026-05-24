/**
 * @file extract.ts
 * @description Converts a Box file stream into plain text, supports pdf and docx
 */

import mammoth from 'mammoth';

async function streamToBuffer(stream: ReadableStream): Promise<Buffer> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  return Buffer.concat(chunks);
}

function getFileType(filename: string): 'pdf' | 'docx' {
  const lower = filename.toLowerCase();
  if (lower.endsWith('.pdf')) return 'pdf';
  if (lower.endsWith('.docx')) return 'docx';
  throw new Error(`Unsupported file type: ${filename}`);
}

export async function extractText(
  stream: ReadableStream,
  filename: string
): Promise<string> {
  const buffer = await streamToBuffer(stream);
  const type = getFileType(filename);

 if (type === 'pdf') {
  const { extractText } = await import('unpdf');
  return (await extractText(new Uint8Array(buffer))).text.join();
 }


  if (type === 'docx') {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }
  throw new Error(`Unsupported file type: ${filename}`);
}