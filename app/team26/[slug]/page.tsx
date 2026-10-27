import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Syne, Space_Grotesk, JetBrains_Mono, Inter } from "next/font/google";
import {
  getMemberBySlug,
  getAllMemberSlugs,
  getAllMembers,
} from "@/lib/team-members";
import MemberProfile from "./MemberProfile";

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono-jb",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

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
          alt: `${member.name} — ${member.role}, AICE CEC`,
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

export default async function MemberProfilePage({
  params,
}: ProfilePageProps) {
  const { slug } = await params;
  const member = getMemberBySlug(slug);

  if (!member) {
    notFound();
  }

  const allMembers = getAllMembers();

  return (
    <div
      className={`${syne.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${inter.variable}`}
    >
      <MemberProfile member={member} allMembers={allMembers} />
    </div>
  );
}
