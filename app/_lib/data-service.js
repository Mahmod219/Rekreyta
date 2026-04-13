"use server";
import { getServerSession } from "next-auth";
import { authConfig } from "../api/auth/[...nextauth]/route";
import { getSupabaseAdmin, getSupabaseWithAuth, supabase } from "./supabase";
import { AtSymbolIcon } from "@heroicons/react/24/solid";
import { count } from "node:console";

export async function getJobs({
  query = "",
  category = "all",
  location = "all",
  type = "all",
  sortBy = "newest",
  page = 1,
  pageSize = 6,
} = {}) {
  let orderColumn = "created_at";
  let ascending = false;

  if (sortBy === "oldest") {
    ascending = true;
  } else if (sortBy === "deadline") {
    orderColumn = "application_deadline";
    ascending = false;
  }
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let supabaseQuery = supabase
    .from("jobs")
    .select("*", { count: "exact" })
    .eq("published", true);

  // 🔹 الفلاتر
  if (query) {
    supabaseQuery = supabaseQuery.or(
      `title.ilike.%${query}%,company.ilike.%${query}%`,
    );
  }

  if (category !== "all") {
    supabaseQuery = supabaseQuery.eq("category", category);
  }

  if (location !== "all") {
    supabaseQuery = supabaseQuery.eq("location", location);
  }

  if (type !== "all") {
    supabaseQuery = supabaseQuery.eq("employmentType", type);
  }

  // 🔥 الترتيب + البجنيشن (مرة واحدة فقط)
  const { data, error, count } = await supabaseQuery
    .order(orderColumn, { ascending, nullsLast: true })
    .range(from, to);

  if (error) throw new Error(error.message);

  return { data, count };
}

export const getJobsAdmin = async function ({
  query = "",
  category = "all",
  location = "all",
  type = "all",
  published = "all",
  sortBy = "newest",
  page = 1,
  pageSize = 10,
} = {}) {
  const session = await getServerSession(authConfig);
  if (!session) throw new Error("Not authenticated");
  const supabase = getSupabaseAdmin();
  const today = new Date().toISOString();

  let orderColumn = "created_at";
  let ascending = false;

  if (sortBy === "oldest") {
    ascending = true;
  } else if (sortBy === "deadline") {
    orderColumn = "application_deadline";
    ascending = false;
  }
  // --- دالة مساعدة لتطبيق الفلاتر المتكررة ---
  const applyFilters = (supabaseQuery) => {
    let q = supabaseQuery.eq("created_by", session.user.id);
    if (query) q = q.or(`title.ilike.%${query}%,company.ilike.%${query}%`);
    if (category !== "all") q = q.eq("category", category);
    if (location !== "all") q = q.eq("location", location);
    if (published !== "all") q = q.eq("published", published);
    if (type !== "all") q = q.eq("employmentType", type);

    return q;
  };

  // 1. جلب البيانات الأساسية للصفحة الحالية (مع البجنيشن)
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let mainQuery = supabase
    .from("jobs")
    .select(`*, applicants:applications(count)`, { count: "exact" });
  mainQuery = applyFilters(mainQuery);

  const { data, error, count } = await mainQuery
    .range(from, to)
    .order(orderColumn, { ascending, nullsLast: true });

  if (error) throw new Error(error.message);

  // 2. 🔥 جلب الإحصائيات بناءً على الفلاتر (بدون بجنيشن)
  // نستخدم Promise.all لتسريع العملية بجعل الاستعلامات تعمل بالتوازي
  const [pubRes, unpubRes, expRes] = await Promise.all([
    applyFilters(
      supabase.from("jobs").select("*", { count: "exact", head: true }),
    ).eq("published", true),
    applyFilters(
      supabase.from("jobs").select("*", { count: "exact", head: true }),
    ).eq("published", false),
    applyFilters(
      supabase.from("jobs").select("*", { count: "exact", head: true }),
    ).lt("application_deadline", today),
  ]);

  const jobsWithCount = data.map((job) => ({
    ...job,
    applicantsCount: job.applicants?.[0]?.count || 0,
    isExpired:
      job.application_deadline &&
      new Date(job.application_deadline) < new Date(),
  }));

  return {
    data: jobsWithCount,
    count: count, // العدد الكلي للنتائج المفلترة (للبجنيشن)
    stats: {
      publishedCount: pubRes.count || 0,
      unpublishedCount: unpubRes.count || 0,
      expiredCount: expRes.count || 0,
    },
  };
};

export async function getJob(id) {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.log(error.message);
    return null;
  }

  if (!data) {
    return null;
  }

  return data;
}

export async function updateJobById(id, data) {
  const supabaseAdmin = getSupabaseAdmin();

  return supabaseAdmin.from("jobs").update(data).eq("id", id);
}

export async function createJob(data) {
  const supabaseAdmin = getSupabaseAdmin();
  const { data: job, error } = await supabaseAdmin
    .from("jobs")
    .insert([data])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return job;
}

export async function deleteJobById(id) {
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("jobs")
    .delete()
    .eq("id", id)
    .select();

  console.log("DELETE RESULT:", data, error);
}

export async function publishJobById(id, newStatus) {
  const supabaseAdmin = getSupabaseAdmin();
  const { error } = await supabaseAdmin
    .from("jobs")
    .update({ published: newStatus })
    .eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
}

export async function getRecentJobs() {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false })
    .eq("published", true)
    .limit(6); // جلب 5 فقط

  if (error) throw new Error("Could not fetch recent jobs");
  return data;
}

export async function createProfile(data) {
  const { data: profile, error } = await supabase
    .from("profiles")
    .insert([data])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return profile;
}

// في ملف data-service.js

export async function getAccountInfo(id) {
  const supabaseAdmin = getSupabaseAdmin();

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

export async function getUserApplications(id) {
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("applications")
    .select("*")
    .eq("user_id", id)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error.message);
    return [];
  }

  return data || [];
}

export async function getUserLatestApplications(id) {
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("applications")
    .select(`id, created_at, status, jobs(id, title, company)`)
    .eq("user_id", id)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error.message);
    return [];
  }

  return data || [];
}

export async function getUserAppliedJobs(id) {
  const session = await getServerSession(authConfig);
  const supabaseAuth = getSupabaseWithAuth(session);
  const { data, error } = await supabaseAuth
    .from("jobs")
    .select("*")
    .eq("id", id);

  if (error) {
    console.log(error.message);
    return [];
  }

  return data || [];
}
export async function getApplicationsByJob({
  jobId,
  query = "",
  status = "all",
  match = "all",
  page = 1,
  pageSize = 10,
}) {
  const session = await getServerSession(authConfig);
  const supabase = getSupabaseWithAuth(session);

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let supabaseQuery = supabase
    .from("applications")
    .select(
      `
      id,
      status,
      created_at,
      another_url,
      cv_url,
      coverletter,
      match_score,
      ai_analysis,

      jobs (
        id,
        title,
        company
      ),

      profiles (
        id,
        firstname,
        lastname,
        email,
        phone,
        address,
        zipcode,
        city
      )
    `,
      { count: "exact" },
    )
    .eq("job_id", jobId);

  const searchQuery = query?.toString().trim();
  const statusQuery = status?.toString().trim();
  const matchQuery = match?.toString().trim();

  // 🔍 search across profile fields via profile IDs first
  if (searchQuery) {
    const likeQuery = `%${searchQuery}%`;
    const { data: matchingProfiles, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .or(
        `firstname.ilike.${likeQuery},lastname.ilike.${likeQuery},email.ilike.${likeQuery}`,
      );

    if (profileError) {
      console.error(profileError.message);
      throw new Error(profileError.message);
    }

    if (!matchingProfiles || matchingProfiles.length === 0) {
      return { data: [], count: 0 };
    }

    const profileIds = matchingProfiles.map((profile) => profile.id);
    supabaseQuery = supabaseQuery.in("user_id", profileIds);
  }

  // 🔄 status filter
  if (statusQuery && statusQuery !== "all") {
    supabaseQuery = supabaseQuery.eq("status", statusQuery);
  }
  if (matchQuery && matchQuery !== "all") {
    // نقوم بتقسيم النص "75-100" إلى رقمين: 75 و 100
    const [min, max] = matchQuery.split("-").map(Number);

    if (!isNaN(min) && !isNaN(max)) {
      supabaseQuery = supabaseQuery
        .gte("match_score", min)
        .lte("match_score", max);
    }
  }

  // ✅ التنفيذ النهائي
  const { data, error, count } = await supabaseQuery
    .order("match_score", { ascending: false }) // اقتراح: رتبهم حسب الدرجة الأعلى أولاً
    .range(from, to);

  if (error) {
    console.error(error.message);
    throw new Error(error.message);
  }

  return { data, count };
}
// export async function getApplicationsByJob(jobId) {
//   const supabaseAdmin = getSupabaseAdmin();
//   const { data, error } = await supabaseAdmin
//     .from("applications")
//     .select(
//       `
//       id,
//       status,
//       created_at,
//       another_url,
//       cv_url,
//       coverletter,

//       jobs (
//         id,
//         title,
//         company
//       ),

//       profiles (
//         id,
//         firstname,
//         lastname,
//         email,
//          phone,
//          address,
//         zipcode,
//        city
//       )
//     `,
//     )
//     .eq("job_id", jobId)
//     .order("created_at", { ascending: false });

//   if (error) {
//     console.log(error.message);
//     return [];
//   }

//   return data || [];
// }

export async function createNotification({
  user_id,
  title,
  message,
  type,
  link,
}) {
  const supapaseAdmin = getSupabaseAdmin();
  return await supapaseAdmin.from("notifications").insert([
    {
      user_id,
      title,
      message,
      type,
      link,
    },
  ]);
}

export async function getNotifications(userId) {
  // const session = await getServerSession(authConfig);
  // const supabaseAuth = getSupabaseWithAuth(session);
  const supapaseAdmin = getSupabaseAdmin();
  const { data } = await supapaseAdmin
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return data;
}

export default async function getSavedJob(userId) {
  const { data, error } = await supabase
    .from("savedJobs")
    .select(
      `*, jobs(id, created_at, title,location, company, company, employmentType, salary, duration, category,application_deadline,image_url,image_path)`,
    )
    .eq("user_id", userId);

  if (error) {
    console.log(error.message);
    return [];
  }
  return data;
}

export async function getReview(appId) {
  const session = await getServerSession(authConfig);
  const supabase = getSupabaseWithAuth(session);

  const { data, error } = await supabase
    .from("applicant_reviews")
    .select("*")
    .eq("application_id", appId);

  if (error) {
    console.log(error.message);
    return null;
  }
  return data || [];
}

export async function getCandidate({ page = 1, pageSize = 10, query = "" }) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const session = await getServerSession(authConfig);
  const supabase = getSupabaseWithAuth(session);

  // 1. بناء الاستعلام الأساسي
  // أضفنا !inner لضمان عدم إعادة أي مراجعة ليس لها تطبيق أو بروفايل مطابق
  let supabaseQuery = supabase.from("applicant_reviews").select(
    `
      *,
      applications (
        *),
       profiles!inner (*)
    `,
    { count: "exact" },
  );

  // 2. الفلترة حسب الحالة (Saved)
  supabaseQuery = supabaseQuery.eq("saved", true);

  // 3. معالجة البحث (Query)
  if (query) {
    // إصلاح الخطأ المطبعي: أضفت فاصلة قبل email
    // استخدام foreignTable مع الربط الداخلي !inner يضمن حذف النتائج غير المطابقة تماماً
    supabaseQuery = supabaseQuery.or(
      `firstname.ilike.%${query}%,lastname.ilike.%${query}%,email.ilike.%${query}%`,
      { foreignTable: "profiles" },
    );
  }

  // 4. التنفيذ والترتيب
  const { data, error, count } = await supabaseQuery
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Supabase Error:", error.message);
    throw new Error(error.message);
  }

  return { data: data || [], count: count || 0 };
}

export async function getInterviews() {
  const session = await getServerSession(authConfig);
  if (!session || session.user.role !== "admin")
    throw new Error("Unauthorized");

  const supabase = getSupabaseWithAuth(session);

  const { data, error } = await supabase
    .from("interviews")
    .select(
      `
      *,
      applications (
        profiles (id, firstname, lastname)
      )
    `,
    )
    .order("start_time", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function getExpairedJobs() {
  const session = await getServerSession(authConfig);
  const supabase = getSupabaseAdmin(session);
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("published", true)
    .eq("application_deadline", new Date().toISOString().split("T")[0]);
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function getStaleInterViews() {
  const session = await getServerSession(authConfig);
  const supabase = getSupabaseWithAuth(session);

  const sevsenDaysAgo = new Date();
  sevsenDaysAgo.setDate(sevsenDaysAgo.getDate() - 7);

  const { data, error } = await supabase
    .from("interviews")
    .select(
      `id, start_time,
      applications(id, job_id, status, profiles(firstname, lastname, email))`,
    )
    .lte("start_time", sevsenDaysAgo.toISOString())
    .eq("applications.status", "intervju");
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function getTopJobs() {
  const session = await getServerSession(authConfig);
  const supabase = getSupabaseWithAuth(session);

  // 1. نجلب الوظائف مع العد
  const { data, error } = await supabase
    .from("jobs")
    .select(`id, title, company, applications(count)`)
    .eq("published", true);

  if (error) throw new Error(error.message);

  // 2. نرتب البيانات يدوياً بناءً على نتيجة العد
  const sortedData = data
    .sort((a, b) => {
      const countA = a.applications?.[0]?.count || 0;
      const countB = b.applications?.[0]?.count || 0;
      return countB - countA; // تنازلي (الأكثر أولاً)
    })
    .slice(0, 5); // نأخذ أول 5 فقط

  return sortedData;
}
export async function getBottomJobs() {
  const session = await getServerSession(authConfig);
  const supabase = getSupabaseWithAuth(session);

  // 1. نجلب الوظائف مع العد
  const { data, error } = await supabase
    .from("jobs")
    .select(`id, title, company, applications(count)`)
    .eq("published", true);

  if (error) throw new Error(error.message);

  // 2. نرتب البيانات يدوياً بناءً على نتيجة العد
  const sortedData = data
    .sort((a, b) => {
      const countA = a.applications?.[0]?.count || 0;
      const countB = b.applications?.[0]?.count || 0;
      return countA - countB; // تنازلي (الأكثر أولاً)
    })
    .slice(0, 5); // نأخذ أول 5 فقط

  return sortedData;
}

export async function getJobsStatusCount() {
  const supabase = getSupabaseAdmin();

  // 1. جلب عدد الوظائف المنشورة (True)
  const { count: published, error: error1 } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .eq("published", true);

  // 2. جلب عدد الوظائف غير المنشورة (False / Drafts)
  const { count: drafts, error: error2 } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .eq("published", false);

  if (error1 || error2) throw new Error("Kunne inte hämta jobbstatistik");

  const total = (published || 0) + (drafts || 0);

  return {
    total,
    published: published || 0,
    drafts: drafts || 0,
  };
}

export async function getTotalApplications() {
  const session = await getServerSession(authConfig);
  const supabase = getSupabaseWithAuth(session);

  const { data, error } = await supabase.from("applications").select("status");

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getWeeklyApplicationStats() {
  const session = await getServerSession(authConfig);
  const supabase = getSupabaseWithAuth(session);

  // جلب طلبات آخر 7 أيام
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data, error } = await supabase
    .from("applications")
    .select("created_at, status")
    .gte("created_at", sevenDaysAgo.toISOString());

  if (error) throw new Error(error.message);

  // أيام الأسبوع بالسويدي
  const daysMap = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"];

  // تجهيز مصفوفة البيانات للتشارت
  const stats = daysMap.map((day) => ({ day, received: 0, processed: 0 }));

  data.forEach((app) => {
    const dayIndex = new Date(app.created_at).getDay();
    stats[dayIndex].received++;

    // أي حالة غير 'incoming' نعتبرها Processed
    if (app.status !== "inkommen") {
      stats[dayIndex].processed++;
    }
  });

  // إعادة ترتيب المصفوفة لتبدأ من الاثنين وليس الأحد (اختياري حسب الرغبة)
  return stats;
}
