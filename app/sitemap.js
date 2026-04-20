import { supabase } from "@/app/_lib/supabase";

export default async function sitemap() {
  const baseUrl = "https://rekreyta.vercel.app/";

  // 1. جلب كل الوظائف من قاعدة البيانات لإنشاء روابط ديناميكية لها
  const { data: jobs } = await supabase.from("jobs").select("id, updated_at");

  const jobUrls =
    jobs?.map((job) => ({
      url: `${baseUrl}/jobs/${job.id}`,
      lastModified: new Date(job.updated_at),
    })) || [];

  // 2. الروابط الثابتة للموقع
  const routes = ["", "/jobs", "/about", "/contact"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  return [...routes, ...jobUrls];
}
