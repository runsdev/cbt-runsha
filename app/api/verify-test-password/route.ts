import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  try {
    const { slug, password } = await request.json();
    
    if (!slug || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    // Get the test data
    const { data: test, error: testError } = await supabase
      .from("tests")
      .select("password")
      .eq("slug", slug)
      .single();
    
    if (testError) {
      return NextResponse.json(
        { error: "Test not found" },
        { status: 404 }
      );
    }
    
    // If no password is set for this test
    if (!test.password) {
      return NextResponse.json(
        { error: "This test doesn't require a password" },
        { status: 400 }
      );
    }
    
    // Verify the password
    const isValid = await bcrypt.compare(password, test.password);
    
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error verifying test password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}