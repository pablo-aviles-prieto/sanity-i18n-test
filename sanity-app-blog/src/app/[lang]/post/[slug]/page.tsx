import { PortableText, type SanityDocument } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { client } from '@/sanity/lib/client';
import Link from 'next/link';
import Image from 'next/image';

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset ? imageUrlBuilder({ projectId, dataset }).image(source) : null;

const options = { next: { revalidate: 30 } };

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string; lang: string }>;
}) {
  const { lang, slug } = await params;
  console.log('lang slug', lang);
  const post = await client.fetch<SanityDocument>(POST_QUERY, { slug }, options);

  const postImageUrl = post?.mainImage
    ? urlFor(post.mainImage)?.width(550).height(310).url()
    : null;

  if (!post) return <div>No post</div>;

  return (
    <main className='container mx-auto max-w-3xl p-8 flex flex-col gap-4'>
      <Link href='/' className='hover:underline'>
        ← Back to posts
      </Link>
      {postImageUrl && (
        <Image
          src={postImageUrl}
          alt={post.title}
          className='aspect-video rounded-xl'
          width='550'
          height='310'
        />
      )}
      <h1 className='text-4xl font-bold mb-8'>{post.title}</h1>
      <div className='prose'>
        <p>Published: {new Date(post.publishedAt).toLocaleDateString()}</p>
        {Array.isArray(post.body) && <PortableText value={post.body} />}
      </div>
    </main>
  );
}
