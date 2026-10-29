"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { toPng, toBlob } from "html-to-image";
import type { TeamMemberProfile } from "@/lib/team-members";
import styles from "./ShareCardModal.module.css";

/* ──────────────────────────────────────────────────────────
   SVG Icons
   ────────────────────────────────────────────────────────── */

function CloseIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function CopyImageIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
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
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* Person/User Stat Icon (Screenshot bottom-left stat) */
function UserStatIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

/* Tag/Team Stat Icon (Screenshot bottom-left stat) */
function TagStatIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────
   Resolution Helpers
   ────────────────────────────────────────────────────────── */

function resolveClassOrDept(dept: string): { label: string; value: string } {
  if (!dept) return { label: "CL", value: "CL '28" };
  if (dept.toLowerCase().includes("faculty") || dept.toLowerCase().includes("advisor")) {
    return { label: "DEPT", value: "Faculty" };
  }
  if (dept.toLowerCase().includes("computer science")) {
    return { label: "DEPT", value: "CSE" };
  }
  // Standard format as in data: "CL '28", "CL '29"
  return { label: "CL", value: dept };
}

function resolveCardTeam(member: TeamMemberProfile): string {
  if (
    member.name.toLowerCase().includes("midhun manesh") ||
    member.role.toLowerCase().includes("web & tech")
  ) {
    return "Web & Tech";
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
  if (member.team && member.team.toLowerCase() !== "executive committee") {
    return member.team;
  }
  const r = member.role.toLowerCase();
  if (r.includes("creative")) return "Creative Team";
  if (r.includes("content")) return "Content Team";
  if (r.includes("media")) return "Media Team";
  if (r.includes("project")) return "Project Team";
  if (r.includes("treasurer") || r.includes("finance")) return "Finance Team";
  if (r.includes("program") || r.includes("operation")) return "Operations";
  if (r.includes("outreach") || /\bpr\b/i.test(r)) return "PR & Outreach";
  if (r.includes("student lead") || r.includes("lead")) return "Lead Team";
  if (member.category === "execom") return "Core Team";
  return "AICE Team";
}

/* ──────────────────────────────────────────────────────────
   Share Card Modal Component
   ────────────────────────────────────────────────────────── */

interface ShareCardModalProps {
  member: TeamMemberProfile;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareCardModal({
  member,
  isOpen,
  onClose,
}: ShareCardModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const modalBoxRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copiedType, setCopiedType] = useState<"image" | "link" | null>(null);
  const [memberImgDataUrl, setMemberImgDataUrl] = useState<string | null>(null);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/team26/${member.slug}`
      : `https://aice.ceconline.edu/team26/${member.slug}`;

  // Pre-cache member photo as data URL (CORS-safe for html-to-image)
  useEffect(() => {
    if (!isOpen) return;
    let isCurrent = true;

    const convertToDataUrl = async () => {
      const targetSrc = member.image || "/assets/placeholder-avatar.svg";
      try {
        const response = await fetch(targetSrc, { mode: "cors" });
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          if (isCurrent && typeof reader.result === "string") {
            setMemberImgDataUrl(reader.result);
          }
        };
        reader.readAsDataURL(blob);
      } catch {
        if (isCurrent) setMemberImgDataUrl(targetSrc);
      }
    };

    convertToDataUrl();
    return () => {
      isCurrent = false;
    };
  }, [isOpen, member.image]);

  // ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Light dismiss on clicking modal overlay backdrop
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalBoxRef.current && !modalBoxRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // High-Resolution PNG Card Download
  const handleDownload = useCallback(async () => {
    if (!cardRef.current || downloading) return;
    setDownloading(true);

    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#212124",
      });

      const fileName = `AICE-Execom-2026-${member.slug}.png`;
      const anchor = document.createElement("a");
      anchor.download = fileName;
      anchor.href = dataUrl;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    } catch (err) {
      console.error("Failed to generate member pass:", err);
    } finally {
      setDownloading(false);
    }
  }, [downloading, member.slug]);

  // Copy card image to clipboard
  const handleCopyImage = useCallback(async () => {
    if (!cardRef.current) return;

    try {
      const blob = await toBlob(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
        backgroundColor: "#212124",
      });

      if (blob && typeof navigator !== "undefined" && navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob }),
        ]);
        setCopiedType("image");
        setTimeout(() => setCopiedType(null), 2400);
        return;
      }
    } catch (err) {
      console.warn("Direct clipboard image write unsupported, falling back to link:", err);
    }

    // Fallback: copy link
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedType("link");
        setTimeout(() => setCopiedType(null), 2400);
      }
    } catch {}
  }, [shareUrl]);

  // Copy profile link to clipboard
  const handleCopyLink = useCallback(async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedType("link");
        setTimeout(() => setCopiedType(null), 2400);
      }
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  }, [shareUrl]);

  // Native Web Share API
  const handleNativeShare = useCallback(async () => {
    if (!cardRef.current) return;

    try {
      const blob = await toBlob(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
        backgroundColor: "#212124",
      });

      if (blob && typeof navigator !== "undefined" && navigator.canShare) {
        const file = new File([blob], `AICE-Execom-${member.slug}.png`, {
          type: "image/png",
        });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `${member.name} — ${member.role} | AICE CEC`,
            text: `${member.name}, ${member.role} at AICE (Artificial Intelligence Community for Excellence), College of Engineering Chengannur.`,
          });
          return;
        }
      }
    } catch (err) {
      if ((err as Error)?.name === "AbortError") return;
    }

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${member.name} — ${member.role} | AICE CEC`,
          text: `${member.name}, ${member.role} at AICE CEC.`,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return;
      }
    } else {
      handleCopyLink();
    }
  }, [handleCopyLink, member.name, member.role, member.slug, shareUrl]);

  if (!isOpen) return null;

  const displayImage = memberImgDataUrl || member.image || "/assets/placeholder-avatar.svg";
  const classInfo = resolveClassOrDept(member.dept);
  const teamValue = resolveCardTeam(member);
  const isNameLong = member.name.length > 18;

  return (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Share ${member.name}'s profile card`}
    >
      <div className={styles.modalBox} ref={modalBoxRef}>
        {/* 1. Modal Top Bar: Location Context & Close Button */}
        <div className={styles.topBar}>
          <div className={styles.breadcrumb} aria-label="Location context">
            <span className={styles.breadcrumbPart}>AICE CEC</span>
            <span className={styles.breadcrumbSep}>/</span>
            <span className={styles.breadcrumbPart}>Team 26</span>
            <span className={styles.breadcrumbSep}>/</span>
            <span className={`${styles.breadcrumbPart} ${styles.breadcrumbActive}`}>
              Share Profile
            </span>
          </div>

          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>
        </div>

        {/* 2. Official Member Credential Card (Pixel-Matched to Screenshot 2026-10-29 225502.png) */}
        <div className={styles.cardWrapper}>
          <div className={styles.card} ref={cardRef} id="share-card-element">
            {/* Dominant Inset Hero Photo */}
            <div className={styles.photoContainer}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={displayImage}
                alt={member.name}
                className={styles.photoImg}
                crossOrigin="anonymous"
              />
            </div>

            {/* Left-Aligned Identity Section */}
            <div className={styles.contentSection}>
              {/* Name Row */}
              <div className={styles.nameRow}>
                <h3
                  className={`${styles.memberName} ${
                    isNameLong ? styles.memberNameCompact : ""
                  }`}
                >
                  {member.name}
                </h3>
              </div>

              {/* 2-line Role / Bio Description */}
              <p className={styles.roleBio}>
                {member.role} at AICE CEC.
                <br />
                {member.bio || "AI Innovation Community for Excellence."}
              </p>

              {/* Bottom Row: Left Stats (User & Tag) + Right Pill Button */}
              <div className={styles.bottomRow}>
                <div className={styles.statsGroup}>
                  <div className={styles.statItem} title={classInfo.label}>
                    <span className={styles.statIcon}>
                      <UserStatIcon />
                    </span>
                    <span>{classInfo.value}</span>
                  </div>

                  <div className={styles.statItem} title="Team">
                    <span className={styles.statIcon}>
                      <TagStatIcon />
                    </span>
                    <span>{teamValue}</span>
                  </div>
                </div>

                <div className={styles.pillButton}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logos/aice_logo.png"
                    alt="AICE"
                    className={styles.pillLogo}
                    crossOrigin="anonymous"
                  />
                  <span>Execom &apos;26</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Modal Actions */}
        <div className={styles.actionsArea}>
          <button
            type="button"
            className={styles.primaryActionBtn}
            onClick={handleDownload}
            disabled={downloading}
            aria-label="Download credential card as PNG"
          >
            {downloading ? (
              <>
                <span className={styles.spinner} />
                <span>Generating Card...</span>
              </>
            ) : (
              <>
                <DownloadIcon />
                <span>Download Card (PNG)</span>
              </>
            )}
          </button>

          <div className={styles.secondaryActionsGrid}>
            <button
              type="button"
              className={`${styles.secondaryActionBtn} ${
                copiedType === "image" ? styles.successActionBtn : ""
              }`}
              onClick={handleCopyImage}
              aria-label="Copy credential image to clipboard"
            >
              {copiedType === "image" ? <CheckIcon /> : <CopyImageIcon />}
              <span>{copiedType === "image" ? "Copied Image" : "Copy Image"}</span>
            </button>

            <button
              type="button"
              className={`${styles.secondaryActionBtn} ${
                copiedType === "link" ? styles.successActionBtn : ""
              }`}
              onClick={handleCopyLink}
              aria-label="Copy profile link"
            >
              {copiedType === "link" ? <CheckIcon /> : <LinkIcon />}
              <span>{copiedType === "link" ? "Copied Link" : "Copy Link"}</span>
            </button>

            <button
              type="button"
              className={styles.secondaryActionBtn}
              onClick={handleNativeShare}
              aria-label="Share credential card"
            >
              <ShareIcon />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
