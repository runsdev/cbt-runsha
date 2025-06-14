import { NextResponse } from 'next/server';
import { compile } from '@mdx-js/mdx';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeStringify from 'rehype-stringify';
import rehypeReact from 'rehype-react';

// export const config = {
//   runtime: 'nodejs',
// };

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { message: 'Content is required' },
        { status: 400 }
      );
    }

    const code = String(
      await compile(content, {
        outputFormat: 'function-body',
        rehypePlugins: [rehypeReact, rehypeKatex, rehypeStringify],
        remarkPlugins: [remarkMath, remarkGfm],
      })
    );

    return NextResponse.json({ code });
  } catch (error) {
    console.error('Error compiling MDX:', error);
    return NextResponse.json(
      { message: error },
      { status: 500 }
    );
  }
}