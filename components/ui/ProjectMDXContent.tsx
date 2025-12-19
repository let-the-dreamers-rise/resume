'use client';

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

interface ProjectMDXContentProps {
  mdxSource: MDXRemoteSerializeResult;
}

export function ProjectMDXContent({ mdxSource }: ProjectMDXContentProps) {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <MDXRemote {...mdxSource} />
    </div>
  );
}