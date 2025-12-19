import { Hero } from '../components/ui/Hero';

export default function Home() {
  return (
    <Hero
      name="Ashwin Goyal"
      title="Computer Science Student"
      tagline="Building the future with code, creativity, and artificial intelligence"
      skills={[
        "React & Next.js",
        "Machine Learning",
        "Generative AI",
        "TypeScript",
        "Python",
        "FastAPI"
      ]}
      ctaButtons={[
        {
          label: "View Projects",
          href: "/projects",
          variant: "primary"
        },
        {
          label: "Get In Touch",
          href: "/contact",
          variant: "secondary"
        }
      ]}
    />
  );
}
