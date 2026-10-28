"use client";

import { useEffect, useState, useSyncExternalStore, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import Navbar from "@/app/components/Navbar";
import type { TeamMemberProfile } from "@/lib/team-members";
import Lanyard from "./Lanyard";
import styles from "./MemberProfile.module.css";

/* ──────────────────────────────────────────────────────────
   SVG Icons matching Screenshot (37).png
   ────────────────────────────────────────────────────────── */

function GitHubIcon() {
  return (
    <svg
      width="18"
      height="18"
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
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function ContactDownloadIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

function GraduationCapIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
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
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
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

function DivisionLayersIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────
   Team and ID resolution helpers
   ────────────────────────────────────────────────────────── */

function resolveTeam(member: TeamMemberProfile): string {
  if (
    member.name.toLowerCase().includes("midhun manesh") ||
    member.role.toLowerCase().includes("web & tech")
  ) {
    return "Web & Tech Team";
  }

  if (
    member.name.toLowerCase().includes("sarin") ||
    member.role.toLowerCase() === "webmaster"
  ) {
    return "Web Team";
  }

  if (
    member.name.toLowerCase().includes("adhi") ||
    member.role.toLowerCase() === "tech lead"
  ) {
    return "Tech Team";
  }

  if (
    member.team &&
    member.team.toLowerCase() !== "executive committee" &&
    member.team.toLowerCase() !== member.categoryLabel.toLowerCase()
  ) {
    return member.team;
  }

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
  if (member.category === "faculty") return "Faculty Advisor";

  return member.categoryLabel || "AICE Team";
}

function formatMemberId(member: TeamMemberProfile): string {
  const num = member.id.replace(/[^0-9]/g, "").padStart(2, "0");
  if (member.id.startsWith("fac")) {
    return `[AICE-26-FAC-${num}]`;
  }
  if (member.id.startsWith("sub")) {
    return `[AICE-26-SUB-${num}]`;
  }
  return `[AICE-26-${num}]`;
}

function generateVCard(member: TeamMemberProfile): string {
  const parts = member.name.trim().split(/\s+/);
  const lastName = parts.length > 1 ? parts[parts.length - 1] : "";
  const firstName = parts.length > 1 ? parts.slice(0, -1).join(" ") : parts[0];

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${member.name}`,
    `N:${lastName};${firstName};;;`,
    `TITLE:${member.role}`,
    "ORG:AICE - Artificial Intelligence Community for Excellence;College of Engineering Chengannur",
  ];

  const email = member.email || `${member.slug}@ceconline.edu`;
  lines.push(`EMAIL;TYPE=INTERNET,WORK:${email}`);

  const phone = member.phone || "+91 00000 00000";
  lines.push(`TEL;TYPE=CELL,VOICE:${phone}`);

  const linkedin = member.linkedin || `https://linkedin.com/in/${member.slug}`;
  lines.push(`URL;TYPE=LinkedIn:${linkedin}`);

  const github = member.github || `https://github.com/${member.slug}`;
  lines.push(`URL;TYPE=GitHub:${github}`);

  if (member.bio) {
    lines.push(`NOTE:${member.bio}`);
  }

  lines.push("END:VCARD");
  return lines.join("\r\n");
}

/* ──────────────────────────────────────────────────────────
   Member Profile Component
   ────────────────────────────────────────────────────────── */

function useIsDesktop() {
  return useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") return () => {};
      const mql = window.matchMedia("(min-width: 961px)");
      mql.addEventListener("change", onStoreChange);
      return () => mql.removeEventListener("change", onStoreChange);
    },
    () => (typeof window !== "undefined" ? window.matchMedia("(min-width: 961px)").matches : true),
    () => true
  );
}

interface MemberProfileProps {
  member: TeamMemberProfile;
  allMembers: TeamMemberProfile[];
}

export default function MemberProfile({
  member,
  allMembers,
}: MemberProfileProps) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const isDesktop = useIsDesktop();

  // Front image for Lanyard (uses official ID card sample for Sarin MS or member photo)
  const cardFrontImage =
    member.slug === "sarin-ms"
      ? "/assets/official-id-sample.jpg"
      : (member.image || "/assets/placeholder-avatar.svg");

  // Subscribe to client-side window URL cleanly without cascading renders
  const currentHref = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("popstate", onStoreChange);
      return () => window.removeEventListener("popstate", onStoreChange);
    },
    () => window.location.href,
    () => "",
  );

  // Compute previous and next member
  const currentIndex = allMembers.findIndex((m) => m.slug === member.slug);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const totalMembers = allMembers.length || 1;

  const prevMember = allMembers[(safeIndex - 1 + totalMembers) % totalMembers];
  const nextMember = allMembers[(safeIndex + 1) % totalMembers];



  // Keyboard navigation for left / right arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        router.push(`/team26/${prevMember.slug}`);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        router.push(`/team26/${nextMember.slug}`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, prevMember.slug, nextMember.slug]);

  // vCard download handler
  const handleSaveContact = useCallback(() => {
    const vcard = generateVCard(member);
    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${member.slug}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [member]);

  // Mobile toggle details handler
  const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);

  const handleToggleDetails = useCallback(() => {
    setMobileDetailsOpen((prev) => {
      const next = !prev;
      if (!next) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return next;
    });
  }, []);

  // Framer motion entrance stagger
  const createFadeUp = (index: number) => {
    if (shouldReduceMotion) {
      return {
        initial: { opacity: 1, y: 0 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0 },
      };
    }

    return {
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      transition: {
        delay: index * 0.02,
        duration: 0.28,
        ease: "easeOut" as const,
      },
    };
  };

  // Words split — each word is rendered as a strictly non-breaking unit
  const words = member.name.trim().split(/\s+/);

  const qrValue =
    currentHref || `https://aice.ceconline.edu/team26/${member.slug}`;

  const teamValue = resolveTeam(member);
  const formattedId = formatMemberId(member);

  // Fallback URLs for placeholders as requested
  const githubUrl =
    member.github || `https://github.com/${member.slug}`;
  const linkedinUrl =
    member.linkedin || `https://linkedin.com/in/${member.slug}`;
  const phoneUrl = member.phone
    ? `tel:${member.phone}`
    : "tel:+910000000000";
  const emailUrl = member.email
    ? `mailto:${member.email}`
    : `mailto:${member.slug}@ceconline.edu`;

  return (
    <main className={styles.page}>
      {/* ── Top Subtle Hairline Laser ── */}
      <div className={styles.topLightBeam} aria-hidden="true" />

      {/* ── Minimal Tech Grid ("The Checks", Exactly Matched to Reference Spec) ── */}
      <div className={styles.bgGrid} aria-hidden="true" />

      {/* ── Visual Ambient Atmosphere with Focused Crimson Card Aura ── */}
      <div
        className={`${styles.glowCard} ${mobileDetailsOpen ? styles.glowCardDetailsOpen : ""}`}
        aria-hidden="true"
      />
      <div className={styles.glowTopRight} aria-hidden="true" />
      <div className={styles.ambientVignette} aria-hidden="true" />
      <div
        className={`${styles.cardGroundShadow} ${mobileDetailsOpen ? styles.cardGroundShadowDetailsOpen : ""}`}
        aria-hidden="true"
      />

      {/* ── Official Site Navbar ── */}
      <Navbar />

      {/* ── 2. Unified Main Stage (Fullscreen Canvas + Content Grid) ── */}
      <section
        className={styles.mainStage}
        aria-label="Member Profile Information"
      >
        {/* Fullscreen 3D Lanyard Layer — Spans 100% full screen, zero bounding box clipping! */}
        <div
          className={`${styles.lanyardLayer} ${mobileDetailsOpen ? styles.lanyardLayerDetailsOpen : ""}`}
          aria-label={`ID card for ${member.name}`}
        >
          <Lanyard
            frontImage={cardFrontImage}
            backImage={cardFrontImage}
            strapImage={isDesktop ? "/logos/aice_logo.png" : undefined}
            imageFit="cover"
            cardColor="#f8f8fa"
            orientation="portrait"
            finish="glossy"
            cornerRadius={0.3}
            size={isDesktop ? 0.64 : 0.62}
            anchor={isDesktop ? 0.27 : "center"}
            strapLength={isDesktop ? 0.44 : 0.08}
            strapColor="#111111"
            strapWidth={0.65}
            metal="silver"
            gravity={1}
            damping={0.5}
            elasticity={0.5}
            breeze={0.5}
            interactive={isDesktop || !mobileDetailsOpen}
            intro={true}
          />
        </div>

        {/* Content Grid: Left Column Spacer (reserves resting space), Right Column (Details) */}
        <div className={styles.contentGrid}>
          <div
            className={`${styles.cardAnchorArea} ${mobileDetailsOpen ? styles.cardAnchorAreaDetailsOpen : ""}`}
            aria-hidden="true"
          />

          {/* Right Column: Member Details */}
          <motion.div
            {...createFadeUp(2)}
            className={`${styles.detailsColumn} ${mobileDetailsOpen ? styles.detailsColumnDetailsOpen : ""}`}
          >
            {/* Primary Bio Block — In mobile view, this is framed in the initial screen */}
            <div
              id="initial-hero-block"
              className={`${styles.initialHeroBlock} ${mobileDetailsOpen ? styles.heroBlockDetailsOpen : ""}`}
            >
              {/* Tag Row (above the name) */}
              <div className={styles.tagRow}>
                <div className={styles.tagRole}>
                  <span className={styles.tagDot} aria-hidden="true" />
                  <span>{member.role}</span>
                </div>
                <span className={styles.tagOrg}>AICE / TEAM 2026</span>
              </div>

              {/* Name Heading (Strictly whole words; last word has gradient text) */}
              <h1 className={styles.memberName} id="member-heading">
                {words.map((word, idx) => {
                  const isLast = idx === words.length - 1;
                  return (
                    <span key={idx}>
                      <span
                        className={`${styles.nameWord} ${
                          isLast ? styles.gradientWord : ""
                        }`}
                      >
                        {word}
                      </span>
                      {idx < words.length - 1 ? " " : ""}
                    </span>
                  );
                })}
              </h1>

              {/* College & Optional Bio Line */}
              <p className={styles.collegeBio}>
                <span className={styles.collegeName}>
                  AICE – College of Engineering Chengannur.
                </span>
                {member.bio && (
                  <span className={styles.bioText}> {member.bio}</span>
                )}
              </p>

              {/* Mobile Details Toggle Cue (seated at the bottom of the initial mobile view) */}
              <button
                type="button"
                onClick={handleToggleDetails}
                className={`${styles.mobileScrollCue} ${mobileDetailsOpen ? styles.mobileScrollCueOpen : ""}`}
                aria-label={mobileDetailsOpen ? "Hide member details" : "View member details"}
                aria-expanded={mobileDetailsOpen}
              >
                <span className={styles.cueText}>{mobileDetailsOpen ? "Hide details" : "View details"}</span>
                <span className={`${styles.cueIconWrapper} ${mobileDetailsOpen ? styles.cueIconWrapperOpen : ""}`}>
                  <svg
                    className={`${styles.chevronIcon} ${mobileDetailsOpen ? styles.chevronOpen : ""}`}
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </button>
            </div>

            {/* Extended Details Section (Meta cards + Action Buttons) */}
            <div
              id="extended-details"
              className={`${styles.extendedDetails} ${mobileDetailsOpen ? styles.extendedDetailsOpen : ""}`}
            >
              <div className={styles.extendedDetailsInner}>
                {/* 3 Sleek Meta Cards matching Reference Spec */}
                <div className={styles.metaCardsRow}>
                  <div className={styles.metaCard}>
                    <div className={styles.metaCardIcon}>
                      <GraduationCapIcon />
                    </div>
                    <div className={styles.metaCardContent}>
                      <span className={styles.metaCardLabel}>Department</span>
                      <span className={styles.metaCardValue}>{member.dept}</span>
                    </div>
                  </div>
                  <div className={styles.metaCard}>
                    <div className={styles.metaCardIcon}>
                      <TeamUsersIcon />
                    </div>
                    <div className={styles.metaCardContent}>
                      <span className={styles.metaCardLabel}>Team</span>
                      <span className={styles.metaCardValue}>{teamValue}</span>
                    </div>
                  </div>
                  <div className={styles.metaCard}>
                    <div className={styles.metaCardIcon}>
                      <DivisionLayersIcon />
                    </div>
                    <div className={styles.metaCardContent}>
                      <span className={styles.metaCardLabel}>Division</span>
                      <span className={styles.metaCardValue}>{member.categoryLabel}</span>
                    </div>
                  </div>
                </div>

                {/* Action Row */}
                <div className={styles.actionRow}>
                  {/* Primary Red Pill: Save Contact (.vcf) */}
                  <button
                    type="button"
                    onClick={handleSaveContact}
                    className={styles.saveContactButton}
                  >
                    <ContactDownloadIcon />
                    <span>Save contact</span>
                  </button>

                  {/* Social Button Group */}
                  <div className={styles.socialButtonGroup}>
                    {/* GitHub */}
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialPillButton}
                      aria-label={`${member.name} on GitHub`}
                    >
                      <GitHubIcon />
                      <span>GitHub</span>
                    </a>

                    {/* LinkedIn */}
                    <a
                      href={linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialPillButton}
                      aria-label={`${member.name} on LinkedIn`}
                    >
                      <LinkedInIcon />
                      <span>LinkedIn</span>
                    </a>

                    {/* Call (tel:) */}
                    <a
                      href={phoneUrl}
                      className={styles.roundIconButton}
                      aria-label={`Call ${member.name}`}
                    >
                      <PhoneIcon />
                    </a>

                    {/* Email (mailto:) */}
                    <a
                      href={emailUrl}
                      className={styles.roundIconButton}
                      aria-label={`Email ${member.name}`}
                    >
                      <MailIcon />
                    </a>
                  </div>
                </div>
              </div>
            </div>
        </motion.div>
        </div>
      </section>

      {/* ── 4. Footer Bar ── */}
      <motion.footer
        {...createFadeUp(7)}
        className={`${styles.footerBar} ${mobileDetailsOpen ? styles.footerBarOpen : ""}`}
      >
        <div className={styles.container}>
          <nav className={styles.footerNav} aria-label="Member Navigation">
            <Link
              href={`/team26/${prevMember.slug}`}
              className={styles.memberNavButton}
              aria-label={`Previous member: ${prevMember.name}`}
            >
              {"←"} Previous member
            </Link>

            <Link
              href={`/team26/${nextMember.slug}`}
              className={styles.memberNavButton}
              aria-label={`Next member: ${nextMember.name}`}
            >
              Next member {"→"}
            </Link>
          </nav>
        </div>
      </motion.footer>
    </main>
  );
}
