import { createClient } from "@/lib/supabase/server";
import { upsertUser } from "@/lib/db/user";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.email?.trim();
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const dbUser = await upsertUser(user.id, email);
    return NextResponse.json({
      user: { id: dbUser.id, email: dbUser.email, createdAt: dbUser.createdAt },
    });
  } catch (err) {
    console.error("User upsert failed:", err);
    return NextResponse.json({ error: "Upsert failed" }, { status: 500 });
  }
}
