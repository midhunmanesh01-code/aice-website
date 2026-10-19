"use client";

import Image from "next/image";
import Link from "next/link";
import type { TeamMemberProfile } from "@/lib/team-members";
import ParticleBackground from "./ParticleBackground";
import HoloCard from "./HoloCard";
import styles from "./MemberProfile.module.css";

/* ──────────────────────────────────────────────────────────
   SVG Icons (matching reference screenshot with precision)
   ────────────────────────────────────────────────────────── */

function GraduationCapIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function TeamUsersIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m12 2 10 5-10 5-10-5z" />
      <path d="m2 12 10 5 10-5" />
      <path d="m2 17 10 5 10-5" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M8 11v5" />
      <path d="M8 8v.01" />
      <path d="M12 16v-5" />
      <path d="M16 16v-3a2 2 0 0 0-4 0" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────
   Helper functions
   ────────────────────────────────────────────────────────── */

function formatName(name: string): { line1: string; line2: string | null } {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return { line1: parts[0], line2: null };
  }
  const lastPart = parts.slice(1).join(" ");
  // If last part is short initials (like "MS" or "J") and total name is compact, keep on one line
  if (lastPart.length <= 2 && name.length <= 12) {
    return { line1: name, line2: null };
  }
  return {
    line1: parts[0],
    line2: lastPart,
  };
}

function resolveTeam(member: TeamMemberProfile): string {
  // 1. Only Midhun Manesh is in "Web & Tech Team"
  if (
    member.name.toLowerCase().includes("midhun manesh") ||
    member.role.toLowerCase().includes("web & tech")
  ) {
    return "Web & Tech Team";
  }

  // 2. Sarin MS is in "Web Team" only
  if (
    member.name.toLowerCase().includes("sarin") ||
    member.role.toLowerCase() === "webmaster"
  ) {
    return "Web Team";
  }

  // 3. Adhi Narayan is in "Tech Team" only
  if (
    member.name.toLowerCase().includes("adhi") ||
    member.role.toLowerCase() === "tech lead"
  ) {
    return "Tech Team";
  }

  // 4. If member has an explicit team in members.json that isn't generic "Executive Committee", use it
  if (
    member.team &&
    member.team.toLowerCase() !== "executive committee" &&
    member.team.toLowerCase() !== member.categoryLabel.toLowerCase()
  ) {
    return member.team;
  }

  // 5. Execom functional teams strictly matching Execom section categories
  const role = member.role.toLowerCase();
  if (role.includes("creative")) return "Creative Team";
  if (role.includes("content")) return "Content Team";
  if (role.includes("media")) return "Media Team";
  if (role.includes("project")) return "Project Team";
  if (role.includes("treasurer") || role.includes("finance")) return "Finance Team";
  if (role.includes("program") || role.includes("operation")) return "Operation Team";
  if (role.includes("outreach") || /\bpr\b/i.test(role)) return "PR & Outreach Team";
  if (role.includes("student lead") || role.includes("lead")) return "Lead Team";

  if (member.category === "execom") return "Core Team";
  if (member.category === "faculty") return "Advisory Board";

  return "AICE Team";
}

function formatDivision(division: string) {
  if (division.toLowerCase().includes("sub-executive")) {
    return "Sub-Executive\nCommittee";
  }
  if (division.toLowerCase().includes("executive")) {
    return "Executive\nCommittee";
  }
  if (division.toLowerCase().includes("faculty")) {
    return "Faculty\nAdvisor";
  }
  return division;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function MemberProfile({
  member,
}: {
  member: TeamMemberProfile;
}) {

  const { line1, line2 } = formatName(member.name);
  const divisionText = formatDivision(member.categoryLabel);
  const teamText = resolveTeam(member);

  // Personal social & contact links (with individual placeholders if not provided)
  const githubUrl = member.github || "https://github.com";
  const linkedinUrl = member.linkedin || "https://linkedin.com";
  const phoneUrl = member.phone ? `tel:${member.phone}` : "tel:+910000000000";
  const emailUrl = member.email ? `mailto:${member.email}` : "mailto:placeholder@ceconline.edu";

  return (
    <main className={styles.page}>
      <ParticleBackground />

      {/* ──────────────────────────────────────────────────
          1. TOP NAVIGATION BAR
          ────────────────────────────────────────────────── */}
      <header className={styles.topHeader}>
        <Link href="/" className={styles.brandGroup} aria-label="AICE Home">
          <Image
            src="/logos/aice_logo.png"
            alt="AICE Logo"
            width={32}
            height={32}
            className={styles.brandLogo}
            priority
          />
          <span className={styles.brandName}>AICE</span>
          <span className={styles.headerDivider} aria-hidden="true" />
          <div className={styles.headerSubtitle}>
            <span>AI INNOVATION COMMUNITY</span>
            <span>FOR EXCELLENCE</span>
          </div>
        </Link>

        <div className={styles.headerRight}>
          <span className={styles.teamTag}>TEAM 2026</span>
          <span className={styles.headerDivider} aria-hidden="true" />
          <Link href="/#execom" className={styles.directoryLink}>
            <span>MEMBER DIRECTORY</span>
            <span className={styles.directoryArrow} aria-hidden="true">
              {"\u2197"}
            </span>
          </Link>
        </div>
      </header>

      {/* ──────────────────────────────────────────────────
          2. MAIN STAGE: Stepper + Portrait + Member Details
          ────────────────────────────────────────────────── */}
      <section className={styles.mainStage} aria-label="Member Profile Information">
        <div className={styles.stageGrid}>
          {/* ── Profile Columns: Card on Left + Info on Right ── */}
          <div className={styles.profileColumns}>
            {/* ── Cyberpunk Frame Card (Center-Left) ── */}
            <div className={styles.portraitColumn}>
              {/* Glowing Red Atmosphere behind card */}
              <div className={styles.frameGlowAura} aria-hidden="true" />

              {/* 3D Interactive Holographic Foil Card (React Bits) */}
              <HoloCard
                image={member.image}
                alt={`Portrait of ${member.name}`}
                width={360}
                aspectRatio={360 / 482}
                radius={0}
                intensity={0}
                glare={0}
                shadow={false}
                tiltMax={15}
                hoverScale={1.04}
                frame={0}
                edgeSparkle={0}
                className={styles.holoCardWrapper}
              >
                {/* Cyberpunk Futuristic Border SVG with Neon Red Accents (Tilts in 3D) */}
                <svg
                  className={styles.frameSvgOverlay}
                  viewBox="0 0 360 482"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <defs>
                    <filter
                      id="cardNeonRedGlow"
                      x="-40%"
                      y="-40%"
                      width="180%"
                      height="180%"
                    >
                      <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur1" />
                      <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2" />
                      <feMerge>
                        <feMergeNode in="blur2" />
                        <feMergeNode in="blur1" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Base subtle stroke perimeter */}
                  <path
                    d="M 34 0 L 252 0 L 264 12 L 342 12 L 360 26 L 360 450 L 332 482 L 170 482 L 160 472 L 102 472 L 92 482 L 24 482 L 0 458 L 0 275 L 6 268 L 6 235 L 0 228 L 0 34 Z"
                    stroke="rgba(255, 255, 255, 0.25)"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />

                  {/* Glowing Neon Red Accent: Top-Left Segment */}
                  <path
                    d="M 0 75 L 0 34 L 34 0 L 120 0"
                    stroke="#ff2424"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#cardNeonRedGlow)"
                  />
                  <path
                    d="M 0 75 L 0 34 L 34 0 L 120 0"
                    stroke="#ffffff"
                    strokeWidth="0.8"
                    strokeOpacity="0.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Glowing Neon Red Accent: Bottom-Right Segment */}
                  <path
                    d="M 360 385 L 360 450 L 332 482 L 240 482"
                    stroke="#ff2424"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#cardNeonRedGlow)"
                  />
                  <path
                    d="M 360 385 L 360 450 L 332 482 L 240 482"
                    stroke="#ffffff"
                    strokeWidth="0.8"
                    strokeOpacity="0.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                {/* Top-left watermark printed on card face (Tilts in 3D) */}
                <div className={styles.cardWatermark} aria-hidden="true">
                  <Image
                    src="/logos/aice_logo.png"
                    alt=""
                    width={18}
                    height={18}
                    className={styles.watermarkLogo}
                  />
                  <div className={styles.watermarkText}>
                    <span>AICE</span>
                    <span>TEAM 2026</span>
                  </div>
                </div>
              </HoloCard>
            </div>

            {/* ── Member Details (Center-Right) ── */}
            <div className={styles.infoColumn}>
              {/* Breadcrumb line */}
              <div className={styles.breadcrumbRow}>
                <span className={styles.breadcrumbText}>AICE / TEAM 2026</span>
                <span className={styles.breadcrumbPill} aria-hidden="true" />
              </div>

              {/* Bold Name with Red Dot */}
              <h1 className={styles.memberName} id="member-heading">
                <span className={styles.nameLine}>
                  {line1}
                  {!line2 && <span className={styles.redSquarePeriod} aria-hidden="true" />}
                </span>
                {line2 && (
                  <span className={styles.nameLine}>
                    {line2}
                    <span className={styles.redSquarePeriod} aria-hidden="true" />
                  </span>
                )}
              </h1>

              {/* Role & Organization */}
              <div className={styles.roleContainer}>
                <div className={styles.roleRedBar} aria-hidden="true" />
                <div className={styles.roleContent}>
                  <div className={styles.roleTitle}>{member.role}</div>
                  <div className={styles.organization}>
                    AICE – College of Engineering Chengannur
                  </div>
                </div>
              </div>

              {/* Horizontal Divider */}
              <div className={styles.infoDivider} aria-hidden="true" />

              {/* 3-Column Info Grid */}
              <div className={styles.metaGrid}>
                {/* Col 1: Department */}
                <div className={`${styles.metaCol} ${styles.metaColBorder}`}>
                  <span className={styles.metaIcon}>
                    <GraduationCapIcon />
                  </span>
                  <div className={styles.metaInfo}>
                    <span className={styles.metaLabel}>Department</span>
                    <span className={styles.metaValue}>{member.dept}</span>
                  </div>
                </div>

                {/* Col 2: Team */}
                <div className={`${styles.metaCol} ${styles.metaColBorder}`}>
                  <span className={styles.metaIcon}>
                    <TeamUsersIcon />
                  </span>
                  <div className={styles.metaInfo}>
                    <span className={styles.metaLabel}>Team</span>
                    <span className={styles.metaValue}>{teamText}</span>
                  </div>
                </div>

                {/* Col 3: Division */}
                <div className={styles.metaCol}>
                  <span className={styles.metaIcon}>
                    <LayersIcon />
                  </span>
                  <div className={styles.metaInfo}>
                    <span className={styles.metaLabel}>Division</span>
                    <span className={styles.metaValue}>{divisionText}</span>
                  </div>
                </div>
              </div>

              {/* Social Links Row */}
              <nav
                className={styles.socialsRow}
                aria-label={`${member.name} social and contact profiles`}
              >
                <a
                  href={githubUrl}
                  className={styles.socialBtn}
                  aria-label={`${member.name} GitHub profile`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GitHubIcon />
                </a>

                <a
                  href={linkedinUrl}
                  className={styles.socialBtn}
                  aria-label={`${member.name} LinkedIn profile`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkedInIcon />
                </a>

                <a
                  href={phoneUrl}
                  className={styles.socialBtn}
                  aria-label={`Call ${member.name}`}
                >
                  <PhoneIcon />
                </a>

                <a
                  href={emailUrl}
                  className={styles.socialBtn}
                  aria-label={`Email ${member.name}`}
                >
                  <MailIcon />
                </a>
              </nav>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
