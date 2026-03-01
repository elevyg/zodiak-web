import Image from "next/image";

type StorySectionProps = {
  image: string;
  imageAlt: string;
  paragraphs: string[];
};

export function StorySection({ image, imageAlt, paragraphs }: StorySectionProps) {
  return (
    <section className="bg-white flex flex-col">
      <div className="relative h-[400px] w-screen overflow-hidden bg-white">
        <Image
          src={image}
          alt={imageAlt}
          priority
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="bg-white text-base leading-relaxed text-inkMuted md:text-lg p-12 md:p-16 flex flex-col gap-4">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  );
}
