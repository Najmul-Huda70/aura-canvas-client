import { auth } from "@/lib/auth";
import { headers } from "next/headers"; 
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tokenData = await auth.api.getToken({
      headers: await headers(),
    });

    return NextResponse.json({ success: true, token: tokenData?.token || null });
  } catch (error) {
    console.error("JWT Generation Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}