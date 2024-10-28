import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getUserRole } from "@/utils/getUserRole";
import { SDG, Module, Section } from "@/types/sections";

export async function POST(request: Request) {
  try {
    console.log("POST /api/sdgs");
    const supabase = createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = await getUserRole(supabase);
    // if (role !== "admin") {
    //   return NextResponse.json({ error: "Unauthorized. You need to be an admin" }, { status: 401 });
    // }

    const body = await request.json();
    const { title, description, sdg_display_id, modules } = body as SDG;

    // Validate input
    if (!title || !description || !sdg_display_id || !modules) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    try {
      // Insert SDG
      const { data: sdg, error: sdgError } = await supabase
        .from("sdgs")
        .insert({ title, description, sdg_display_id })
        .select()
        .single();

      if (sdgError) throw sdgError;

      // Insert learning modules
      for (const learningModule of modules) {
        const { data: moduleData, error: moduleError } = await supabase
          .from("module")
          .insert({
            sdg_id: sdg.sdg_id,
            title: learningModule.title,
            subtitle: learningModule.subtitle,
            order_id: learningModule.order_id,
            estimate_completion_min: 3, // Default value, adjust as needed
          })
          .select()
          .single();

        if (moduleError) throw moduleError;

        // Insert sections for each learning module
        if (learningModule.sections && learningModule.sections.length > 0) {
          const sectionsToInsert = learningModule.sections.map(
            (section: Section) => ({
              module_id: moduleData.module_id,
              data: section.data,
              order_id: section.order_id,
              title: section.title,
              section_type: section.type,
            })
          );

          const { error: sectionError } = await supabase
            .from("section")
            .insert(sectionsToInsert);

          if (sectionError) throw sectionError;
        }
      }

      return NextResponse.json(
        { message: "SDG created successfully" },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error saving SDG:", error);
      return NextResponse.json(
        { error: "An error occurred while saving the SDG" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in POST /api/sdgs:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json(
      { message: "GET method not implemented" },
      { status: 405 }
    );
  } catch (error) {
    console.error("Error in GET /api/sdgs:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
