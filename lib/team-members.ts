import teamData from "@/data/team-26/members.json";

/** Unified profile type for all team member categories. */
export interface TeamMemberProfile {
  id: string;
  name: string;
  slug: string;
  role: string;
  dept: string;
  team?: string;
  image: string;
  bio?: string;
  linkedin?: string;
  github?: string;
  email?: string;
  instagram?: string;
  phone?: string;
  category: "faculty" | "execom" | "subExecom";
  categoryLabel: string;
}

/** Raw member shape covering all possible fields across categories. */
interface RawMember {
  id: string;
  name: string;
  role: string;
  dept: string;
  image: string;
  team?: string;
  bio?: string;
  linkedin?: string;
  github?: string;
  email?: string;
  instagram?: string;
  phone?: string;
}

const CATEGORY_LABELS: Record<"faculty" | "execom" | "subExecom", string> = {
  faculty: "Faculty",
  execom: "Executive Committee",
  subExecom: "Sub-Executive Committee",
};

/**
 * Generates a URL-safe slug from a member's display name.
 * Lowercase, spaces become hyphens, non-alphanumeric characters are stripped.
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/**
 * Returns true only when a URL points to a real user profile,
 * not a bare-domain placeholder like "https://linkedin.com".
 */
function isRealProfileUrl(
  url: string | undefined,
  domain: string,
): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.hostname.includes(domain) && parsed.pathname.length > 1;
  } catch {
    return false;
  }
}

function buildAllMembers(): TeamMemberProfile[] {
  const result: TeamMemberProfile[] = [];

  const categories: Array<{
    key: "faculty" | "execom" | "subExecom";
    data: RawMember[];
  }> = [
    { key: "faculty", data: teamData.faculty as RawMember[] },
    { key: "execom", data: teamData.execom as RawMember[] },
    { key: "subExecom", data: teamData.subExecom as RawMember[] },
  ];

  for (const { key, data } of categories) {
    for (const raw of data) {
      result.push({
        id: raw.id,
        name: raw.name,
        slug: generateSlug(raw.name),
        role: raw.role,
        dept: raw.dept,
        team: raw.team || undefined,
        image: raw.image,
        bio: raw.bio || undefined,
        linkedin: isRealProfileUrl(raw.linkedin, "linkedin.com")
          ? raw.linkedin
          : undefined,
        github: isRealProfileUrl(raw.github, "github.com")
          ? raw.github
          : undefined,
        email: raw.email || undefined,
        instagram: raw.instagram || undefined,
        phone: raw.phone || undefined,
        category: key,
        categoryLabel: CATEGORY_LABELS[key],
      });
    }
  }

  const slugs = new Set<string>();
  for (const member of result) {
    if (!member.slug || slugs.has(member.slug)) {
      throw new Error(
        `Team 2026 member slugs must be unique. Check the slug for "${member.name}" (${member.id}).`,
      );
    }
    slugs.add(member.slug);
  }

  return result;
}

/** Pre-computed at module level — safe for server components and build-time. */
const allMembers = buildAllMembers();

/** Look up a member by URL slug. Returns null for unknown slugs. */
export function getMemberBySlug(slug: string): TeamMemberProfile | null {
  return allMembers.find((m) => m.slug === slug) ?? null;
}

/** Every valid member slug, used by generateStaticParams. */
export function getAllMemberSlugs(): string[] {
  return allMembers.map((m) => m.slug);
}

/** Full member list, used for sitemap generation. */
export function getAllMembers(): TeamMemberProfile[] {
  return allMembers;
}
