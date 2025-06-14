import { Fragment, useEffect, useState } from "react";
import { run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import type { MDXModule } from "mdx/types";

interface MDXContentProps {
  code: string;
}

export default function MDXContent({ code }: MDXContentProps) {
  const [mdxModule, setMdxModule] = useState<MDXModule>();
  const Content = mdxModule ? mdxModule.default : Fragment;

  useEffect(() => {
    async function compileMDX() {
      try {
        const module = await run(code, {
          ...runtime,
          baseUrl: import.meta.url,
        });
        setMdxModule(module);
      } catch (error) {
        console.error("Error compiling MDX:", error);
      }
    }

    if (code) {
      compileMDX();
    }
  }, [code]);

  return <Content />;
}
