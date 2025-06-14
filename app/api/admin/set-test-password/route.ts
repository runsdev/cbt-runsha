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
    
    // Check if user is admin (implement your admin check here)
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Hash the password (10 rounds is a good default for bcrypt)
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Update the test with the new password hash
    const { error: updateError } = await supabase
      .from("tests")
      .update({ password: passwordHash })
      .eq("slug", slug);
    
    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error setting test password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}