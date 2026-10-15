import Image from "next/image";
import Link from "next/link";
import type { TeamMemberProfile } from "@/lib/team-members";
import styles from "./MemberProfile.module.css";

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14ZM8.34 10.16H5.67V18h2.67v-7.84ZM7 6a1.55 1.55 0 1 0 0 3.1A1.55 1.55 0 0 0 7 6Zm11.33 7.5c0-2.36-1.26-3.46-2.94-3.46a2.55 2.55 0 0 0-2.3 1.27v-1.1h-2.66V18h2.66v-4.14c0-1.1.21-2.17 1.58-2.17 1.35 0 1.37 1.26 1.37 2.24V18h2.66l-.37-4.5Z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.06c-3.1.67-3.76-1.32-3.76-1.32-.5-1.29-1.24-1.63-1.24-1.63-1.02-.7.08-.69.08-.69 1.12.08 1.7 1.15 1.7 1.15 1 .1.74 2.1 3.58 1.5.1-.73.4-1.23.7-1.52-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.04-1.14 3.04-1.14.61 1.54.23 2.68.12 2.96.72.78 1.14 1.78 1.14 3 0 4.29-2.62 5.23-5.11 5.5.4.35.75 1.02.75 2.06V22c0 .3.2.64.77.53A11.1 11.1 0 0 0 12 .9Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function MemberProfile({
  member,
}: {
  member: TeamMemberProfile;
}) {
  const socials: Array<{
    href: string;
    label: string;
    name: string;
    icon: React.ReactNode;
  }> = [];

  if (member.linkedin) {
    socials.push({
      href: member.linkedin,
      label: `${member.name} on LinkedIn`,
      name: "LinkedIn",
      icon: <LinkedInIcon />,
    });
  }
  if (member.github) {
    socials.push({
      href: member.github,
      label: `${member.name} on GitHub`,
      name: "GitHub",
      icon: <GitHubIcon />,
    });
  }
  if (member.email) {
    socials.push({
      href: `mailto:${member.email}`,
      label: `Email ${member.name}`,
      name: "Email",
      icon: <MailIcon />,
    });
  }

  return (
    <main className={styles.page}>
      <div className={styles.ambientGlow} aria-hidden="true" />

      <header className={styles.header}>
        <Link href="/" className={styles.logoLink} aria-label="AICE home">
          <Image
            src="/logos/aice_logo.png"
            alt=""
            width={28}
            height={28}
            className={styles.logoImage}
            priority
          />
          <span className={styles.logoText}>AICE</span>
          <span className={styles.logoDivider} aria-hidden="true" />
          <span className={styles.headerContext}>TEAM 2026</span>
        </Link>
      </header>

      <div className={styles.content}>
        <section className={styles.profile} aria-labelledby="member-name">
          <div className={styles.photoColumn}>
            <div className={styles.photoEyebrow}>
              <span className={styles.statusDot} aria-hidden="true" />
              AICE · COLLEGE OF ENGINEERING CHENGANNUR
            </div>
            <div className={styles.photoFrame}>
              <Image
                src={member.image}
                alt={`Portrait of ${member.name}`}
                fill
                sizes="(max-width: 700px) min(84vw, 360px), 420px"
                className={styles.photo}
                priority
              />
              <span className={styles.photoIndex} aria-hidden="true">
                TEAM / 26
              </span>
            </div>
          </div>

          <div className={styles.info}>
            <p className={styles.sectionLabel}>MEMBER PROFILE</p>
            <h1 className={styles.name} id="member-name">
              {member.name}
            </h1>
            <p className={styles.role}>{member.role}</p>
            <div className={styles.memberDetails}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Department</span>
                <span className={styles.detailValue}>{member.dept}</span>
              </div>
              {member.team && member.team !== member.categoryLabel && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Team</span>
                  <span className={styles.detailValue}>{member.team}</span>
                </div>
              )}
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Division</span>
                <span className={styles.detailValue}>{member.categoryLabel}</span>
              </div>
            </div>

            {member.bio && <p className={styles.bio}>{member.bio}</p>}

            {socials.length > 0 && (
              <nav className={styles.socialLinks} aria-label="Member links">
                {socials.map((social) => (
                  <a
                    className={styles.socialLink}
                    href={social.href}
                    key={social.name}
                    aria-label={social.label}
                    title={social.name}
                    target={social.name === "Email" ? undefined : "_blank"}
                    rel={social.name === "Email" ? undefined : "noopener noreferrer"}
                  >
                    <span className={styles.socialIcon}>{social.icon}</span>
                    <span>{social.name}</span>
                    {social.name !== "Email" && (
                      <span className={styles.externalMark} aria-hidden="true">↗</span>
                    )}
                  </a>
                ))}
              </nav>
            )}
          </div>
        </section>

        <Link href="/#execom" className={styles.viewTeamLink}>
          Meet the rest of Team 2026
          <span className={styles.linkArrow}><ArrowIcon /></span>
        </Link>
      </div>

      <footer className={styles.footer}>
        <p className={styles.footerText}>
          AICE <span aria-hidden="true">/</span> AI Innovation Community for Excellence
        </p>
      </footer>
    </main>
  );
}
