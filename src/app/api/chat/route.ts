import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Charlie is offline. Always return a short message that points visitors at the
// brief/waitlist forms on this page. No Anthropic call, no token cost, no
// chance of going off-script while live chat is paused. Links use markdown
// syntax so the rendered label stays short and tidy.
const OFFLINE_REPLY = `Live chat is offline.

Pick the form on this page that matches what you need — both come straight to the team and we reply within one business day.

• Project to discuss → [Start a brief](https://buildhawk.com.au/#intake)
• Early access to the Hawktress platform → [Join the waitlist](https://buildhawk.com.au/#waitlist)

Urgent? services@buildhawk.com.au · +61 433 366 607`;

export async function POST() {
  return NextResponse.json({ text: OFFLINE_REPLY });
}
