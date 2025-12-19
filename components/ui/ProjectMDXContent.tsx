'use client';

interface ProjectMDXContentProps {
  content: string;
}

export function ProjectMDXContent({ content }: ProjectMDXContentProps) {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}