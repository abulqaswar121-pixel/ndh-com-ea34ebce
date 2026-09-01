import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, toolError } from "../supabase";

export default defineTool({
  name: "get_course",
  title: "Get course details",
  description: "Get a published course with its lesson outline, by course slug.",
  inputSchema: { slug: z.string().describe("Course slug, e.g. 'brand-identity-foundations'.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug }, ctx) => {
    if (!ctx.isAuthenticated()) return toolError("Not authenticated");
    const supabase = supabaseForUser(ctx);
    const { data: course, error } = await supabase
      .from("courses")
      .select("id,title,slug,school,summary,learning_objectives,project_theme,price_amount,currency")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) return toolError(error.message);
    if (!course) return toolError(`No published course found for slug "${slug}".`);
    const { data: lessons } = await supabase
      .from("lessons")
      .select("id,title,position")
      .eq("course_id", course.id)
      .order("position");
    const result = { ...course, lessons: lessons ?? [] };
    return {
      content: [{ type: "text", text: JSON.stringify(result) }],
      structuredContent: { course: result },
    };
  },
});
