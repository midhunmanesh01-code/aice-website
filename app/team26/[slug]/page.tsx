import type { Metadata } from "next";
import { notFound } from "next/navigation";
import localFont from "next/font/local";
import cardPortraits from "@/data/team-26/card-portraits.json";
import { getMemberBySlug, getAllMemberSlugs } from "@/lib/team-members";
import MemberProfile from "./MemberProfile";

const syne = localFont({
  src: "./fonts/syne.woff2",
  weight: "700 800",
  variable: "--font-syne",
  display: "swap",
});

const spaceGrotesk = localFont({
  src: "./fonts/space-grotesk.woff2",
  weight: "400 700",
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: "./fonts/jetbrains-mono.woff2",
  weight: "400 700",
  variable: "--font-mono-jb",
  display: "swap",
  adjustFontFallback: false,
});

const inter = localFont({
  src: "./fonts/inter.woff2",
  weight: "400 700",
  variable: "--font-inter",
  display: "swap",
});

const cardFont = localFont({
  src: "./fonts/montserrat-latin.woff2",
  weight: "500 700",
  display: "swap",
});
const portraitsBySource: Readonly<Partial<Record<string, string>>> =
  cardPortraits.filesBySource;

interface ProfilePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllMemberSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const member = getMemberBySlug(slug);

  if (!member) {
    return { title: "Member Not Found | AICE CEC" };
  }

  const title = `${member.name} — ${member.role}`;
  const description = `${member.name}, ${member.role} at AICE — AI Innovation Community for Excellence, College of Engineering Chengannur.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | AICE CEC`,
      description,
      url: `/team26/${member.slug}`,
      siteName: "AICE CEC",
      type: "profile",
      images: [
        {
          url: member.image,
          width: 600,
          height: 600,
          alt: `${member.name} | AICE CEC`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | AICE CEC`,
      description,
      images: [member.image],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function MemberProfilePage({ params }: ProfilePageProps) {
  const { slug } = await params;
  const member = getMemberBySlug(slug);

  if (!member) {
    notFound();
  }

  const portraitFile = portraitsBySource[member.image];
  const cutoutUrl =
    portraitFile && new URL(portraitFile, cardPortraits.baseUrl).href;

  return (
    <div
      className={`${syne.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${inter.variable}`}
    >
      <MemberProfile
        member={member}
        cardFontFamily={cardFont.style.fontFamily}
        cardCutout={cutoutUrl}
      />
    </div>
  );
}
