import { NextResponse } from 'next/server';
import { getBlogPosts, getBlogTags } from '@/lib/content/blog';

export async function GET() {
  try {
    const posts = await getBlogPosts();
    const tags = await getBlogTags();

    return NextResponse.json({
      posts,
      tags,
      count: posts.length,
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}