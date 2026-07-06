import { NextResponse } from "next/server";
import { sendQuoteEmails } from "@/lib/email";
import { validateQuoteRequest } from "@/lib/quote";

export async function POST(request: Request) {
  try {
    const body = await request.json();
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
      preview: emailResult.preview,
      quote: {
        boatName: result.summary.boat.name,
        price: result.summary.price,
        formattedDate: result.summary.formattedDate,
        duration: result.data.duration,
      },
    });
  } catch (error) {
    console.error("[quote api]", error);
    return NextResponse.json(
      { error: "Unable to send quote email. Please try again." },
      { status: 500 },
    );
  }
}
