import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';
import grayMatter from 'gray-matter';
import styles from '../styles/Home.module.css';

export default function BlogPage({ posts }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Masih Ngoding Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">MasihNgoding Blog</a>
        </h1>

        <div className={styles.grid}>
          {posts.map((post) => (
            <Link key={post.path} href={post.path}>
              <a className={styles.card}>
                <h2>{post.title}</h2>
              </a>
            </Link>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}

export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), 'pages/blog');
  const filenames = await fs.readdir(postsDirectory);

  const files = await Promise.all(
    filenames.map(async (filename) => {
      const splitted = filename.split('.');
      if (splitted[splitted.length - 1] === 'mdx') {
        const filePath = path.join(postsDirectory, filename);
        const content = await fs.readFile(filePath, 'utf8');
        const matter = grayMatter(content);
        return {
          filename,
          matter,
        };
      }
    })
  );

  const posts = files
    .filter((file) => file)
    .map((file) => {
      console.log({ file });
      return {
        path: `/blog/${file.filename.replace('.mdx', '')}`,
        title: file.matter.data.title,
      };
    });

  return {
    props: {
      posts,
    },
  };
}
