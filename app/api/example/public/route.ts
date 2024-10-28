import { NextResponse, NextRequest } from "next/server";
export async function GET(request: NextRequest) {
  return NextResponse.json({}, { status: 200 });
}

// Existing POST method here...

export async function POST(request: NextRequest) {
  return NextResponse.json({}, { status: 201 });
}
