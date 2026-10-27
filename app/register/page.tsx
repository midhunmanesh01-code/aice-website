"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
import { MEMBERSHIP_FEE } from "@/lib/membership-config";
import styles from "./Register.module.css";

const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID || "aicecec@upi";
const UPI_NAME = process.env.NEXT_PUBLIC_UPI_NAME || "AICE CEC";

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function UpiPhoneIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form details
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "College of Engineering Chengannur",
    branch: "CL",
    year: "1st Year",
  });

  // Proof details
  const [transactionId, setTransactionId] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(
    null,
  );
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Status & loading
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [submittedData, setSubmittedData] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsMobile(
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        ),
      );
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCopyUpi = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(UPI_ID);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (PNG, JPG, JPEG, WEBP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Screenshot size must be under 10MB.");
      return;
    }

    setError("");
    setScreenshotFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setScreenshotFile(null);
    setScreenshotPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const transactionNote = `AICE Membership - ${formData.fullName || "Student"}`;
  const upiIntentUrl = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(UPI_NAME)}&am=${MEMBERSHIP_FEE}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

  // Step 1 -> Step 2 validation & auto-opening UPI on mobile
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.fullName.trim() || formData.fullName.length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setStep(2);

    // If on mobile device, automatically open the UPI app intent
    if (isMobile) {
      try {
        window.location.href = upiIntentUrl;
      } catch (err) {
        console.warn("Could not auto-open UPI app:", err);
      }
    }
  };

  // Final submission to backend
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanTx = transactionId.trim();
    if (!cleanTx || cleanTx.length < 6) {
      setError("Please enter a valid UPI Transaction ID / UTR number.");
      return;
    }
    if (!screenshotPreview) {
      setError("Please attach a screenshot of your payment receipt.");
      return;
    }

    setLoading(true);

    try {
      let uploadedScreenshotUrl = null;

      // 1. Upload screenshot if available
      if (screenshotPreview) {
        setUploading(true);
        const uploadRes = await fetch("/api/memberships/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            base64Data: screenshotPreview,
            mimeType: screenshotFile?.type || "image/png",
            fileName: screenshotFile?.name || "receipt.png",
          }),
        });

        const uploadJson = await uploadRes.json();
        if (uploadRes.ok && uploadJson.fileUrl) {
          uploadedScreenshotUrl = uploadJson.fileUrl;
        } else {
          console.warn("Screenshot upload warning:", uploadJson.error);
          uploadedScreenshotUrl = screenshotPreview;
        }
        setUploading(false);
      }

      // 2. Submit membership registration
      const res = await fetch("/api/memberships/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          college: formData.college,
          branch: formData.branch,
          year: formData.year,
          transactionId: transactionId.trim(),
          screenshotUrl: uploadedScreenshotUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to submit registration.");
        setLoading(false);
        setUploading(false);
        return;
      }

      setSubmittedData(data);
      setStep(4);
    } catch (err: any) {
      setError(err?.message || "A network error occurred. Please try again.");
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.glowLeft} />
      <div className={styles.glowRight} />

      <div className={styles.container}>
        <Link href="/" className={styles.backBtn}>
          &larr; BACK TO HOME
        </Link>

        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.logoRow}>
              <Image
                src="/logos/aice_logo.png"
                alt="AICE Logo"
                width={32}
                height={32}
                style={{ height: "auto" }}
              />
              <span className={styles.logoText}>AICE</span>
            </div>
            <h1 className={styles.title}>
              JOIN THE <span className={styles.titleAccent}>COMMUNITY.</span>
            </h1>
            <p className={styles.subtitle}>
              Official Artificial Intelligence Forum of CEC
            </p>
          </div>

          {step < 4 && (
            <div className={styles.stepIndicator}>
              <div
                className={`${styles.stepDot} ${
                  step >= 1 ? styles.stepDotActive : ""
                } ${step > 1 ? styles.stepDotCompleted : ""}`}
              >
                <span
                  className={`${styles.stepCircle} ${
                    step === 1
                      ? styles.stepCircleActive
                      : step > 1
                        ? styles.stepCircleCompleted
                        : ""
                  }`}
                >
                  {step > 1 ? <CheckIcon /> : "1"}
                </span>
                <span>DETAILS</span>
              </div>

              <div
                className={`${styles.stepLine} ${
                  step > 1
                    ? styles.stepLineCompleted
                    : step >= 2
                      ? styles.stepLineActive
                      : ""
                }`}
              />

              <div
                className={`${styles.stepDot} ${
                  step >= 2 ? styles.stepDotActive : ""
                } ${step > 2 ? styles.stepDotCompleted : ""}`}
              >
                <span
                  className={`${styles.stepCircle} ${
                    step === 2
                      ? styles.stepCircleActive
                      : step > 2
                        ? styles.stepCircleCompleted
                        : ""
                  }`}
                >
                  {step > 2 ? <CheckIcon /> : "2"}
                </span>
                <span>PAYMENT</span>
              </div>

              <div
                className={`${styles.stepLine} ${
                  step > 2
                    ? styles.stepLineCompleted
                    : step >= 3
                      ? styles.stepLineActive
                      : ""
                }`}
              />

              <div
                className={`${styles.stepDot} ${
                  step === 3 ? styles.stepDotActive : ""
                }`}
              >
                <span
                  className={`${styles.stepCircle} ${
                    step === 3 ? styles.stepCircleActive : ""
                  }`}
                >
                  3
                </span>
                <span>VERIFY</span>
              </div>
            </div>
          )}

          {error && <div className={styles.errorMsg}>{error}</div>}

          {/* STEP 1: STUDENT DETAILS */}
          {step === 1 && (
            <>
              <form className={styles.form} onSubmit={handleProceedToPayment}>
                <div className={styles.formGrid}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="fullName" className={styles.label}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      placeholder="e.g. Jeevan George"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="email" className={styles.label}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="e.g. chn22bt000@ceconline.edu"
                      value={formData.email}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="phone" className={styles.label}>
                      WhatsApp / Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="college" className={styles.label}>
                      College
                    </label>
                    <input
                      type="text"
                      id="college"
                      name="college"
                      required
                      value={formData.college}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="branch" className={styles.label}>
                      Branch / Department *
                    </label>
                    <select
                      id="branch"
                      name="branch"
                      value={formData.branch}
                      onChange={handleChange}
                      className={styles.select}
                    >
                      <option value="CL">Computer Science(AI & ML) (CL)</option>
                      <option value="CS">Computer Science (CS)</option>
                      <option value="EC">Electronics & Comm. (EC)</option>
                      <option value="EEE">
                        Electrical & Electronics (EEE)
                      </option>
                    </select>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="year" className={styles.label}>
                      Year of Study *
                    </label>
                    <select
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className={styles.select}
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={styles.submitBtn}
                >
                  PROCEED TO PAYMENT (₹120) &rarr;
                </button>
              </form>

              {/* Responsive Track Status Link */}
              <div className={styles.trackStatusBox}>
                <Link
                  href="/membership/status"
                  className={styles.trackStatusLink}
                >
                  <span>Already submitted payment?</span>
                  <span className={styles.trackStatusAccent}>
                    Track your membership status &rarr;
                  </span>
                </Link>
              </div>
            </>
          )}

          {/* STEP 2: PAYMENT SCREEN */}
          {step === 2 && (
            <div className={styles.form}>
              <div className={styles.paymentBox}>
                <div
                  style={{
                    fontSize: "0.95rem",
                    color: "#ffffff",
                    fontWeight: 800,
                    letterSpacing: "0.04em",
                  }}
                >
                  Pay ₹{MEMBERSHIP_FEE} to AICE CEC
                </div>

                {/* Mobile: Prominent UPI Launch Button */}
                {isMobile && (
                  <div style={{ width: "100%", maxWidth: "26rem" }}>
                    <a href={upiIntentUrl} className={styles.upiIntentBtn}>
                      <UpiPhoneIcon />
                      <span>OPEN GPAY / UPI APP (₹{MEMBERSHIP_FEE})</span>
                    </a>
                    <p
                      className={styles.guidePill}
                      style={{ marginTop: "0.5rem" }}
                    >
                      Tap above if your UPI app didn&apos;t launch
                      automatically.
                    </p>
                  </div>
                )}

                {/* Desktop: Dynamic QR Code (No GPay button on desktop) */}
                {!isMobile && (
                  <>
                    <div className={styles.qrContainer}>
                      <QRCodeCanvas
                        value={upiIntentUrl}
                        size={210}
                        level="H"
                        includeMargin={false}
                      />
                    </div>

                    <div className={styles.upiDetailsRow}>
                      <div className={styles.upiPill}>
                        <span>
                          UPI ID: <strong>{UPI_ID}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className={styles.copyBtn}
                        >
                          <CopyIcon />
                          {copiedUpi ? "COPIED!" : "COPY"}
                        </button>
                      </div>
                      <p className={styles.guidePill}>
                        1. Scan the QR code using Google Pay, PhonePe, Paytm, or
                        BHIM.
                        <br />
                        2. Pay ₹{MEMBERSHIP_FEE} & note the{" "}
                        <strong>12-digit UPI Reference / UTR Number</strong>.
                      </p>
                    </div>
                  </>
                )}

                {/* Mobile Fallback: QR Code if they want to scan from another phone */}
                {isMobile && (
                  <details
                    style={{
                      width: "100%",
                      maxWidth: "26rem",
                      fontSize: "0.75rem",
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    <summary
                      style={{
                        cursor: "pointer",
                        marginBottom: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      Paying from another phone? View QR Code
                    </summary>
                    <div
                      className={styles.qrContainer}
                      style={{ margin: "0.5rem auto 1rem auto" }}
                    >
                      <QRCodeCanvas
                        value={upiIntentUrl}
                        size={170}
                        level="H"
                        includeMargin={false}
                      />
                    </div>
                    <div className={styles.upiPill}>
                      <span>
                        UPI ID: <strong>{UPI_ID}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className={styles.copyBtn}
                      >
                        <CopyIcon />
                        {copiedUpi ? "COPIED!" : "COPY"}
                      </button>
                    </div>
                  </details>
                )}
              </div>

              {/* Improved Responsive Button Row */}
              <div className={styles.buttonRow}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className={styles.btnSecondary}
                >
                  &larr; BACK
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className={styles.submitBtn}
                >
                  I HAVE PAID • ENTER PROOF &rarr;
                </button>
              </div>

              <div
                className={styles.trackStatusBox}
                style={{
                  borderTop: "none",
                  marginTop: "0.75rem",
                  paddingTop: 0,
                }}
              >
                <Link
                  href="/membership/status"
                  className={styles.trackStatusLink}
                >
                  <span>Already paid?</span>
                  <span className={styles.trackStatusAccent}>
                    Check status &rarr;
                  </span>
                </Link>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT PROOF (UTR + SCREENSHOT) */}
          {step === 3 && (
            <form className={styles.form} onSubmit={handleFinalSubmit}>
              <div className={styles.fieldGroup}>
                <label htmlFor="transactionId" className={styles.label}>
                  UPI Reference / UTR Number (12 Digits) *
                </label>
                <input
                  type="text"
                  id="transactionId"
                  name="transactionId"
                  required
                  placeholder="e.g. 423589123456"
                  maxLength={30}
                  value={transactionId}
                  onChange={(e) =>
                    setTransactionId(
                      e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""),
                    )
                  }
                  className={styles.input}
                  style={{
                    fontFamily: "monospace",
                    letterSpacing: "0.1em",
                    fontSize: "1.05rem",
                  }}
                />
                <span className={styles.guidePill}>
                  Found in your transaction receipt as{" "}
                  <strong>UPI Ref No.</strong> or <strong>UTR</strong>.
                </span>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Payment Screenshot Receipt *
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: "none" }}
                  id="screenshotUpload"
                />

                {!screenshotPreview ? (
                  <div
                    className={styles.uploadDropzone}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div
                      style={{
                        color: "#ef4444",
                        marginBottom: "0.5rem",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <UploadIcon />
                    </div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: "#ffffff",
                      }}
                    >
                      Click or tap to upload payment screenshot
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "rgba(255,255,255,0.5)",
                        marginTop: "0.25rem",
                      }}
                    >
                      PNG, JPG, JPEG up to 10MB
                    </div>
                  </div>
                ) : (
                  <div className={styles.previewContainer}>
                    <img
                      src={screenshotPreview}
                      alt="Payment Receipt Preview"
                      style={{
                        width: "100%",
                        maxHeight: "240px",
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                    <button
                      type="button"
                      onClick={removeFile}
                      className={styles.removeFileBtn}
                      title="Remove image"
                    >
                      <CloseIcon />
                    </button>
                  </div>
                )}
              </div>

              {/* Improved Responsive Button Row */}
              <div className={styles.buttonRow}>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={loading}
                  className={styles.btnSecondary}
                >
                  &larr; BACK
                </button>
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className={styles.submitBtn}
                >
                  {uploading
                    ? "UPLOADING PROOF..."
                    : loading
                      ? "SUBMITTING..."
                      : "SUBMIT REGISTRATION →"}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: SUCCESS / PENDING STATUS */}
          {step === 4 && (
            <div style={{ textAlign: "center", padding: "1rem 0" }}>
              <div
                style={{
                  width: "4rem",
                  height: "4rem",
                  borderRadius: "9999px",
                  backgroundColor: "rgba(16, 185, 129, 0.15)",
                  border: "2px solid #10b981",
                  color: "#10b981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  margin: "0 auto 1.5rem auto",
                  boxShadow: "0 0 25px rgba(16, 185, 129, 0.3)",
                }}
              >
                <CheckIcon />
              </div>

              <h2 className={styles.title} style={{ fontSize: "1.6rem" }}>
                REGISTRATION{" "}
                <span className={styles.titleAccent}>SUBMITTED!</span>
              </h2>

              <p
                className={styles.subtitle}
                style={{ maxWidth: "28rem", margin: "0.5rem auto 1.5rem auto" }}
              >
                {submittedData?.status === "APPROVED"
                  ? "Your membership has been activated! Check your email for your official pass."
                  : "Your payment proof is now being verified by the AICE Finance Team. Once approved, your official membership card will be dispatched to your email."}
              </p>

              <div
                style={{
                  margin: "1.5rem auto",
                  maxWidth: "26rem",
                  padding: "1rem 1.25rem",
                  borderRadius: "0.75rem",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  fontSize: "0.85rem",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,0.6)" }}>
                    Applicant:
                  </span>
                  <strong style={{ color: "#ffffff" }}>
                    {formData.fullName}
                  </strong>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,0.6)" }}>Email:</span>
                  <span style={{ color: "#ffffff", fontFamily: "monospace" }}>
                    {formData.email}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,0.6)" }}>
                    Transaction Ref:
                  </span>
                  <span
                    style={{
                      color: "#ef4444",
                      fontFamily: "monospace",
                      fontWeight: 700,
                    }}
                  >
                    {submittedData?.transactionId || transactionId}
                  </span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "rgba(255,255,255,0.6)" }}>
                    Status:
                  </span>
                  <span
                    style={{
                      color:
                        submittedData?.status === "APPROVED"
                          ? "#10b981"
                          : "#f59e0b",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {submittedData?.status || "UNDER VERIFICATION"}
                  </span>
                </div>
              </div>

              {/* Status link & Return to home */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  maxWidth: "26rem",
                  margin: "0 auto",
                }}
              >
                <div style={{ padding: "0.75rem 0", fontSize: "0.85rem" }}>
                  <Link
                    href={`/membership/status?txId=${encodeURIComponent(submittedData?.transactionId || transactionId)}`}
                    style={{
                      color: "#ef4444",
                      fontWeight: 700,
                      textDecoration: "underline",
                      textUnderlineOffset: "3px",
                    }}
                  >
                    Track your verification status live &rarr;
                  </Link>
                </div>
                <Link
                  href="/"
                  className={styles.btnSecondary}
                  style={{ textDecoration: "none" }}
                >
                  RETURN TO HOME
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
