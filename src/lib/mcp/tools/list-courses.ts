import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, toolError } from "../supabase";

export default defineTool({
  name: "list_courses",
  title: "List Academy courses",
  description: "List published Najeeb Digital Hub Academy courses, optionally filtered by school or a search term.",
  inputSchema: {
    school: z.string().optional().describe("Filter by school name, e.g. 'Design'."),
    search: z.string().optional().describe("Case-insensitive match against the course title."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ school, search }, ctx) => {
    if (!ctx.isAuthenticated()) return toolError("Not authenticated");
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("courses")
      .select("id,title,slug,school,summary,price_amount,currency")
      .eq("is_published", true)
      .order("title")
      .limit(100);
    if (school) query = query.eq("school", school);
    if (search) query = query.ilike("title", `%${search}%`);
    const { data, error } = await query;
    if (error) return toolError(error.message);
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { courses: data ?? [] },
    };
  },
});
