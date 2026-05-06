import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Charlie is offline. Always return a short message that points visitors at the
// brief/waitlist forms on this page. No Anthropic call, no token cost, no
// chance of going off-script while live chat is paused.
const OFFLINE_REPLY = `Live chat is offline at the moment. The fastest way to reach the team is to fill in the brief or jump on the Hawktress waitlist — both are on this page.

Brief (builders, trades, suppliers): https://buildhawk.com.au/#intake
Hawktress waitlist: https://buildhawk.com.au/#waitlist

If it is urgent: services@buildhawk.com.au or +61 433 366 607.`;

export async function POST() {
  return NextResponse.json({ text: OFFLINE_REPLY });
}
