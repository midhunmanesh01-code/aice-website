import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMemberBySlug, getAllMemberSlugs } from "@/lib/team-members";
import MemberProfile from "./MemberProfile";

interface ProfilePageProps {
  params: Promise<{ slug: string }>;
}

/** Only pre-rendered slugs are valid; all others trigger the branded 404. */
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
    return { title: "Member Not Found" };
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
      card: "summary",
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

  return <MemberProfile member={member} />;
}
