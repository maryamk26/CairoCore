import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getFoldersByUserId, createFolder } from "@/lib/db/folder";

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

    const folders = await getFoldersByUserId(user.id);

    return NextResponse.json({
      folders: folders.map((f) => ({
        id: f.id,
        name: f.name,
        pinCount: f._count.savedPlaces,
        createdAt: f.createdAt,
      })),
    });
  } catch (err) {
    console.error("Profile folders fetch failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch folders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    const name = typeof body.name === "string" ? body.name.trim() : "";

    if (!name) {
      return NextResponse.json(
        { error: "Folder name is required" },
        { status: 400 }
      );
    }

    const folder = await createFolder(user.id, name);

    return NextResponse.json(
      {
        folder: {
          id: folder.id,
          name: folder.name,
          pinCount: 0,
          createdAt: folder.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Create folder failed:", err);
    return NextResponse.json(
      { error: "Failed to create folder" },
      { status: 500 }
    );
  }
}
