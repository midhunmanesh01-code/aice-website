"use client";

import { useState, useSyncExternalStore, useCallback } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import Navbar from "@/app/components/Navbar";
import type { TeamMemberProfile } from "@/lib/team-members";
import Lanyard from "./Lanyard";
import styles from "./MemberProfile.module.css";

/* ──────────────────────────────────────────────────────────
   SVG Icons matching Screenshot (37).png
   ────────────────────────────────────────────────────────── */

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

function ShareIcon() {
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
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#22c55e"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
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
   Interactive Meta Card Component
   ────────────────────────────────────────────────────────── */

interface MetaCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  index: string;
}

function MetaCard({ icon, label, value, index }: MetaCardProps) {
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const tiltX = (y - 50) * -0.15;
    const tiltY = (x - 50) * 0.15;
    card.style.setProperty("--mouse-x", `${x.toFixed(1)}%`);
    card.style.setProperty("--mouse-y", `${y.toFixed(1)}%`);
    card.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
    card.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.setProperty("--mouse-x", "50%");
    card.style.setProperty("--mouse-y", "50%");
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <div
      className={styles.metaCard}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className={styles.metaCardSpotlight} aria-hidden="true" />
      <div className={styles.metaCardBorderGlow} aria-hidden="true" />
      <div className={styles.metaCardHeader}>
        <div className={styles.metaCardIcon}>{icon}</div>
        <span className={styles.metaCardIndex}>{index}</span>
      </div>
      <div className={styles.metaCardContent}>
        <span className={styles.metaCardLabel}>{label}</span>
        <span className={styles.metaCardValue} title={value}>
          {value}
        </span>
      </div>
    </div>
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
  allMembers?: TeamMemberProfile[];
}

export default function MemberProfile({
  member,
}: MemberProfileProps) {
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

  // Share profile / copy link handler
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const shareUrl =
      typeof window !== "undefined"
        ? window.location.href
        : `https://aice.ceconline.edu/team26/${member.slug}`;
    const shareData = {
      title: `${member.name} — ${member.role} | AICE CEC`,
      text: `${member.name}, ${member.role} at AICE (Artificial Intelligence Community for Excellence), College of Engineering Chengannur.`,
      url: shareUrl,
    };

    if (
      typeof navigator !== "undefined" &&
      navigator.share &&
      navigator.canShare &&
      navigator.canShare(shareData)
    ) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return;
      }
    }

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // fallback
    }
  }, [member.name, member.role, member.slug]);

  // Mobile toggle details handler
  const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);

  const handleToggleDetails = useCallback(() => {
    setMobileDetailsOpen((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => {
          const el = document.getElementById("extended-details");
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 150);
      } else {
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
  const nameLen = member.name.trim().length;
  const wordCount = words.length;
  const maxWordLen = Math.max(...words.map((w) => w.length));

  let nameTierClass = styles.nameTier_short;
  if (nameLen >= 19 || wordCount >= 4 || maxWordLen >= 12) {
    nameTierClass = styles.nameTier_long;
  } else if (nameLen >= 15 || maxWordLen >= 10) {
    nameTierClass = styles.nameTier_medium;
  }

  const qrValue =
    currentHref || `https://aice.ceconline.edu/team26/${member.slug}`;

  const teamValue = resolveTeam(member);

  // Fallback URLs for placeholders as requested
  const linkedinUrl =
    member.linkedin || `https://linkedin.com/in/${member.slug}`;
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
      <Navbar defaultActive="EXECOM" />

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
              <h1 className={`${styles.memberName} ${nameTierClass}`} id="member-heading">
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
                {/* 3 Sleek Meta Cards with Interactive Desktop Reveal */}
                <div className={styles.metaCardsRow}>
                  <MetaCard
                    icon={<GraduationCapIcon />}
                    label="Department"
                    value={member.dept}
                    index=""
                  />
                  <MetaCard
                    icon={<TeamUsersIcon />}
                    label="Team"
                    value={teamValue}
                    index=""
                  />
                  <MetaCard
                    icon={<DivisionLayersIcon />}
                    label="Division"
                    value={member.categoryLabel}
                    index=""
                  />
                </div>

                {/* Action Row */}
                <div className={styles.actionRow}>
                  {/* Primary Crimson Action: Get in touch (Email) */}
                  <a
                    href={emailUrl}
                    className={styles.primaryActionButton}
                    aria-label={`Send email to ${member.name}`}
                  >
                    <MailIcon />
                    <span>Get in touch</span>
                  </a>

                  {/* Social & Utility Button Group */}
                  <div className={styles.socialButtonGroup}>
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

                    {/* Share Profile */}
                    <button
                      type="button"
                      onClick={handleShare}
                      className={`${styles.socialPillButton} ${copied ? styles.copiedPill : ""}`}
                      aria-label={`Share ${member.name}'s profile`}
                    >
                      {copied ? <CheckIcon /> : <ShareIcon />}
                      <span>{copied ? "Link copied" : "Share profile"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
