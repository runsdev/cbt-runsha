import { getTestByTestId } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const testId = searchParams.get('testId') as unknown as number;
  
  // Get test end time from database or cache
  const test = await getTestByTestId(testId!);
  const timeRemaining = (new Date(test.end_time!).getTime() - Date.now()) / 1000;
  
  return NextResponse.json({ serverTimeRemaining: Math.floor(timeRemaining) });
}