/* 

Takes a Box file ID, downloads it, extracts text, sends to AI reviewer
 app/api/review/route.ts
*/ 


import { NextRequest, NextResponse } from 'next/server';
import { getBoxClient } from '@/lib/box';
import { extractText } from '@/lib/extract';
import { reviewContract } from '@/lib/reviewer';
import { Readable } from 'stream';

export async function POST(req: NextRequest) {
    
  const { fileId } = await req.json();

  if (!fileId) {
    return NextResponse.json({ error: 'No fileId provided' }, { status: 400 });
  }

  try {
    
    const client = getBoxClient();
    const fileA = await client.files.getFileById(fileId);
    console.log('filename from Box:', fileA.name);

    // fetch file metadata first so extract.ts knows if it's a PDF or DOCX
    const [file, stream] = await Promise.all([
    client.files.getFileById(fileId),
    client.downloads.downloadFile(fileId)
    ]);

    if (!stream) throw new Error('Box file download failed');

   // Add "as any" to bypass the strict type mismatch
    const text = await extractText(Readable.toWeb(stream) as any, file.name ?? 'unknown_file');
    const review = await reviewContract(text);

    return NextResponse.json({ review });
  } catch (err) {
    console.error('Review failed:', err);
    return NextResponse.json({ error: 'Review failed' }, { status: 500 });
  }
}