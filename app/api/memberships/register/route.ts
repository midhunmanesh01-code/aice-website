import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { MEMBERSHIP_FEE } from "@/lib/membership-config";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      college,
      branch,
      year,
      transactionId,
      screenshotUrl,
    } = body;

    // Validate essential fields
    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
      return NextResponse.json(
        { error: "Please enter your full name." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = (phone || "").replace(/\D/g, "");

    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit phone number." },
        { status: 400 }
      );
    }

    if (!branch || !year) {
      return NextResponse.json(
        { error: "Please select your branch and year." },
        { status: 400 }
      );
    }

    const cleanTxId = (transactionId || "").trim();

    if (!cleanTxId || cleanTxId.length < 6) {
      return NextResponse.json(
        { error: "Please enter the valid UPI Transaction ID / UTR." },
        { status: 400 }
      );
    }

    // Check for duplicate transaction ID in Supabase
    const { data: existingTx } = await supabase
      .from("memberships")
      .select("id, status, email")
      .eq("transaction_id", cleanTxId)
      .maybeSingle();

    if (existingTx) {
      return NextResponse.json(
        {
          error:
            "This Transaction ID / UTR has already been submitted. Please check your reference or contact support.",
        },
        { status: 409 }
      );
    }

    // Check for existing active registration for this email
    const { data: existingMember } = await supabase
      .from("memberships")
      .select("id, status, membership_id")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (existingMember) {
      if (existingMember.status === "APPROVED") {
        return NextResponse.json(
          {
            error: `An active AICE Membership (${existingMember.membership_id}) already exists for ${cleanEmail}.`,
          },
          { status: 400 }
        );
      }
      if (existingMember.status === "PENDING") {
        return NextResponse.json(
          {
            error: `A registration for ${cleanEmail} is currently pending finance verification. Please track your status or contact support.`,
          },
          { status: 400 }
        );
      }
    }

    const newRecord = {
      full_name: fullName.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      college: (college || "College of Engineering Chengannur").trim(),
      branch: branch.trim(),
      year: year.trim(),
      amount: MEMBERSHIP_FEE,
      transaction_id: cleanTxId,
      screenshot_url: screenshotUrl || null,
      status: "PENDING",
      membership_id: null,
      created_at: new Date().toISOString(),
      reviewed_at: null,
      reviewed_by: null,
    };

    const { data: insertedData, error: insertError } = await supabase
      .from("memberships")
      .insert([newRecord])
      .select()
      .single();

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json(
        {
          error:
            "Unable to save your registration in the database. Please verify your details or try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Registration submitted successfully! Your payment is under verification.",
      membership: insertedData,
      transactionId: cleanTxId,
      status: insertedData?.status || "PENDING",
    });
  } catch (err: any) {
    console.error("Membership registration exception:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to process membership registration." },
      { status: 500 }
    );
  }
}
