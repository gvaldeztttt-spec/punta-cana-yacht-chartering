import { NextResponse } from "next/server";
import { EmailNotConfiguredError, sendQuoteEmails } from "@/lib/email";
import { validateQuoteRequest } from "@/lib/quote";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (typeof body.website === "string" && body.website.trim().length > 0) {
      return NextResponse.json({ ok: true, preview: false });
    }

    const result = validateQuoteRequest(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const emailResult = await sendQuoteEmails({
      request: result.data,
      summary: result.summary,
    });

    return NextResponse.json({
      ok: true,
      sent: emailResult.sent,
      preview: emailResult.preview,
      quote: {
        boatName: result.summary.boat.name,
        price: result.summary.price,
        formattedDate: result.summary.formattedDate,
        duration: result.data.duration,
      },
    });
  } catch (error) {
    if (error instanceof EmailNotConfiguredError) {
      console.error("[quote api] SMTP is not configured");
      return NextResponse.json(
        { error: "Quote email service is temporarily unavailable." },
        { status: 503 },
      );
    }

    const smtpMessage =
      error instanceof Error && "response" in error
        ? String((error as { response?: string }).response ?? "")
        : "";

    if (smtpMessage.includes("SmtpClientAuthentication is disabled for the Tenant")) {
      console.error("[quote api] SMTP AUTH disabled at organization level");
      return NextResponse.json(
        {
          error:
            "Email is blocked by Microsoft 365 organization settings. Enable SMTP AUTH for your entire organization in Exchange admin (Settings → Mail flow), or contact GoDaddy support.",
        },
        { status: 503 },
      );
    }

    console.error("[quote api]", error);
    return NextResponse.json(
      { error: "Unable to send quote email. Please try again." },
      { status: 500 },
    );
  }
}
