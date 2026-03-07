import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProfile, upsertUser, updateUserProfile } from "@/lib/db/user";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let profile = await getProfile(user.id);
    if (!profile) {
      const email = user.email?.trim() || "";
      if (!email) {
        return NextResponse.json(
          { error: "Email required" },
          { status: 400 }
        );
      }
      await upsertUser(user.id, email);
      profile = await getProfile(user.id);
    }
    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    const name =
      profile.name ||
      user.user_metadata?.full_name ||
      user.user_metadata?.first_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "User";
    const username =
      profile.username ||
      user.user_metadata?.user_name ||
      user.user_metadata?.username ||
      user.email?.split("@")[0] ||
      "";

    return NextResponse.json({
      id: profile.id,
      email: profile.email,
      name,
      username: username ? (username.startsWith("@") ? username : `@${username}`) : `@${profile.email?.split("@")[0] || "user"}`,
      followerCount: profile.followerCount,
      followingCount: profile.followingCount,
    });
  } catch (err) {
    console.error("Profile fetch failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const name = typeof body.name === "string" ? body.name.trim() || null : undefined;
    const username = typeof body.username === "string" ? body.username.trim() || null : undefined;

    await updateUserProfile(user.id, {
      ...(name !== undefined && { name }),
      ...(username !== undefined && { username }),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Profile update failed:", err);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
