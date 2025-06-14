import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endTime = decodeURIComponent(searchParams.get('endTime')!);
  
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  
  const interval = setInterval(async () => {
    const timeRemaining = (new Date(endTime!).getTime() - Date.now()) / 1000;
    writer.write(encoder.encode(`data: ${JSON.stringify({ timeRemaining })}\n\n`));
  }, 1000);

  request.signal.addEventListener('abort', () => {
    clearInterval(interval);
    writer.close();
  });

  return new NextResponse(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    }
  });
}