"use server";
import { getServerSession } from "next-auth";
import { authConfig } from "../api/auth/[...nextauth]/route";
import { getSupabaseAdmin, getSupabaseWithAuth, supabase } from "./supabase";
import { is } from "zod/locales";

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
  const userId = session.user.id;

  // 1. جلب معلومات الفريق
  const { data: teamProfile } = await supabase
    .from("team_profiles")
    .select("managed_by")
    .eq("id", userId)
    .maybeSingle();

  const isStaff = !!teamProfile?.managed_by;
  let staffIds = [];

  // 2. إذا كان أدمن (مدير)، نجيب قائمة IDs الموظفين اللي بتبعه
  if (!isStaff) {
    const { data: staffMembers } = await supabase
      .from("team_profiles")
      .select("id")
      .eq("managed_by", userId);

    if (staffMembers) {
      staffIds = staffMembers.map((m) => m.id);
    }
  }

  // --- دالة مساعدة لتطبيق الفلاتر المتكررة ---
  const applyFilters = (supabaseQuery) => {
    let q = supabaseQuery;

    if (isStaff) {
      // الموظف يرى فقط ما أنشأه هو
      q = q.eq("created_by", userId);
    } else {
      // المدير يرى ما أنشأه هو + مصفوفة الموظفين التابعين له
      // ندمج الـ userId مع الـ staffIds في مصفوفة واحدة
      const allAccessibleIds = [userId, ...staffIds];
      q = q.in("created_by", allAccessibleIds);
    }

    // الفلاتر العادية
    if (query) q = q.or(`title.ilike.%${query}%,company.ilike.%${query}%`);
    if (category !== "all") q = q.eq("category", category);
    if (location !== "all") q = q.eq("location", location);
    if (published !== "all") q = q.eq("published", published);
    if (type !== "all") q = q.eq("employmentType", type);

    return q;
  };

  // 3. جلب البيانات الأساسية (بجنيشن)
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let mainQuery = supabase
    .from("jobs")
    .select(`*, applicants:applications(count)`, { count: "exact" });

  mainQuery = applyFilters(mainQuery);

  const { data, error, count } = await mainQuery
    .range(from, to)
    .order(
      sortBy === "oldest"
        ? "created_at"
        : sortBy === "deadline"
          ? "application_deadline"
          : "created_at",
      { ascending: sortBy === "oldest", nullsLast: true },
    );

  if (error) throw new Error(error.message);

  // 4. جلب الإحصائيات بناءً على نفس الفلاتر
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
    count: count,
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
  if (!session) throw new Error("Du måste vara inloggad.");

  const supabase = getSupabaseAdmin(); // نستخدم نسخة الأدمن لتسهيل الجلب عبر الجداول
  const userId = session.user.id;

  // 1. تحديد هوية المستخدم (مدير أم موظف) من جدول team_profiles
  const { data: teamProfile } = await supabase
    .from("team_profiles")
    .select("managed_by")
    .eq("id", userId)
    .maybeSingle();

  const isStaff = !!teamProfile?.managed_by;

  // 2. التحقق من ملكية الوظيفة وصلاحية الوصول
  const { data: jobData, error: jobError } = await supabase
    .from("jobs")
    .select("created_by")
    .eq("id", jobId)
    .single();

  if (jobError || !jobData) throw new Error("Jobbet hittades inte.");

  // منطق التحقق:
  if (isStaff) {
    // إذا كان موظف: يجب أن يكون هو من أنشأ الوظيفة حصراً
    if (jobData.created_by !== userId) {
      return { data: [], count: 0, error: "Behörighet saknas" };
    }
  } else {
    // إذا كان مديراً: يجب أن تكون الوظيفة له أو لأحد موظفيه
    // نتحقق إذا كان منشئ الوظيفة يتبع لهذا المدير
    const { data: creatorProfile } = await supabase
      .from("team_profiles")
      .select("managed_by")
      .eq("id", jobData.created_by)
      .maybeSingle();

    const isJobOwnedByHisStaff = creatorProfile?.managed_by === userId;
    const isJobOwnedByHim = jobData.created_by === userId;

    if (!isJobOwnedByHisStaff && !isJobOwnedByHim) {
      return { data: [], count: 0, error: "Behörighet saknas" };
    }
  }

  // 3. بناء الاستعلام للطلبات
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

  // 4. كود البحث والفلترة
  const searchQuery = query?.toString().trim();
  const statusQuery = status?.toString().trim();
  const matchQuery = match?.toString().trim();

  if (searchQuery) {
    const likeQuery = `%${searchQuery}%`;
    const { data: matchingProfiles } = await supabase
      .from("profiles")
      .select("id")
      .or(
        `firstname.ilike.${likeQuery},lastname.ilike.${likeQuery},email.ilike.${likeQuery}`,
      );

    if (matchingProfiles?.length > 0) {
      const profileIds = matchingProfiles.map((p) => p.id);
      supabaseQuery = supabaseQuery.in("user_id", profileIds);
    } else {
      return { data: [], count: 0 }; // لا توجد نتائج بحث
    }
  }

  if (statusQuery && statusQuery !== "all") {
    supabaseQuery = supabaseQuery.eq("status", statusQuery);
  }

  if (matchQuery && matchQuery !== "all") {
    const [min, max] = matchQuery.split("-").map(Number);
    if (!isNaN(min) && !isNaN(max)) {
      supabaseQuery = supabaseQuery
        .gte("match_score", min)
        .lte("match_score", max);
    }
  }

  const { data, error, count } = await supabaseQuery
    .order("match_score", { ascending: false })
    .range(from, to);

  if (error) throw new Error(error.message);

  return { data, count };
}
// export async function getApplicationsByJob(jobId) {
//   const supabaseAdmin = getSupabaseAdmin();
//   const { data, error } = await supabaseAdmin
//     .from("applications")
//     .select(
//       `
// id,
// status,
// created_at,
// another_url,
// cv_url,
// coverletter,

// jobs (
//   id,
//   title,
//   company
// ),

// profiles (
//   id,
//   firstname,
//   lastname,
//   email,
//    phone,
//    address,
//   zipcode,
//  city
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

export async function getAiMatchedJobs() {
  try {
    const session = await getServerSession(authConfig);
    const userId = session?.user?.id;

    if (!userId) return []; // حماية إضافية إذا لم تكن هناك جلسة

    const supabase = getSupabaseWithAuth(session);

    // 1. جلب الـ Vector الخاص بالمستخدم
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("cv_embedding")
      .eq("id", userId)
      .maybeSingle(); // استخدام maybeSingle أفضل لتجنب أخطاء single() إذا كان البروفايل غير موجود

    if (profileError || !profile?.cv_embedding) {
      console.log("No embedding found for user:", userId);
      return [];
    }

    // 2. مناداة الـ RPC للحصول على الوظائف المطابقة
    const { data: matchedJobs, error: rpcError } = await supabase.rpc(
      "get_matching_jobs",
      {
        user_cv_embedding: profile.cv_embedding,
        match_threshold: 0.3,
        match_count: 20,
      },
    );

    if (rpcError) {
      console.error("RPC Error:", rpcError.message);
      return [];
    }

    return matchedJobs || [];
  } catch (error) {
    console.error("Unexpected error in getAiMatchedJobs:", error);
    return [];
  }
}

export async function hasCvFile() {
  const session = await getServerSession(authConfig);
  const supabase = getSupabaseWithAuth(session);

  const userId = session?.user?.id;

  const { data, error } = await supabase
    .from("profiles")
    .select("cv_url")
    .eq("id", userId);

  if (error) {
    console.log("could not get cv", error);
  }

  return data || [];
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

export async function getCandidate({
  page = 1,
  pageSize = 10,
  query = "",
  category = "all",
}) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const session = await getServerSession(authConfig);
  const supabase = getSupabaseWithAuth(session);

  // 1. الاستعلام الأساسي - أعدنا !inner لتصفية الصفوف التي لا تملك بروفايل مطابق
  let supabaseQuery = supabase
    .from("applicant_reviews")
    .select(
      `
    *,
    applications (*),
    profiles!inner (*) 
  `,
      { count: "exact" },
    )
    .eq("saved", true);

  const searchQuery = query?.toString().trim();
  const categoryQuery = category?.toString().trim();

  // 2. فلترة الكاتيجوري
  if (categoryQuery && categoryQuery !== "all") {
    // استخدام !inner يجعل هذا السطر يحذف المراجعة بالكامل من النتائج إذا لم تكن من هذا القسم
    supabaseQuery = supabaseQuery.eq("profiles.main_category", categoryQuery);
  }

  // 3. البحث (searchQuery)
  if (searchQuery) {
    const searchTerm = searchQuery.toLowerCase().trim();

    // جلب IDs البروفايلات المطابقة للبحث
    const { data: matchingProfiles } = await supabase
      .from("profiles")
      .select("id")
      .or(
        `firstname.ilike.%${searchTerm}%,` +
          `lastname.ilike.%${searchTerm}%,` +
          `email.ilike.%${searchTerm}%,` +
          `main_category.ilike.%${searchTerm}%,` +
          `tags.ov.{${searchTerm}}`,
      );

    if (matchingProfiles && matchingProfiles.length > 0) {
      const profileIds = matchingProfiles.map((p) => p.id);
      supabaseQuery = supabaseQuery.in("user_id", profileIds);
    } else {
      // إذا كان هناك نص بحث ولم نجد أي بروفايل، نرجع مصفوفة فارغة
      return { data: [], count: 0 };
    }
  }

  // 3. التنفيذ
  const { data, error, count } = await supabaseQuery
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Supabase Final Query Error:", error.message);
    throw new Error(error.message);
  }

  return { data: data || [], count: count || 0 };
}
export async function getInterviews() {
  const session = await getServerSession(authConfig);
  if (!session || session.user.role !== "admin")
    throw new Error("Unauthorized");
  const hrId = session.user.id;

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
    .eq("hr_user_id", hrId)
    .order("start_time", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function getExpairedJobs() {
  const session = await getServerSession(authConfig);
  const supabase = getSupabaseAdmin(session);
  const userId = session?.user?.id;

  const { data: teamProfile } = await supabase
    .from("team_profiles")
    .select("managed_by")
    .eq("id", userId)
    .maybeSingle();

  const isStaff = !!teamProfile?.managed_by;
  let staffIds = [];

  if (!isStaff) {
    const { data: staffMembers } = await supabase
      .from("team_profiles")
      .select("id")
      .eq("managed_by", userId);

    if (staffMembers) {
      staffIds = staffMembers.map((m) => m.id);
    }
  }
  const createBaseQuery = () => {
    let q = supabase.from("jobs").select("*");

    if (isStaff) {
      q = q.eq("created_by", userId);
    } else {
      const fullAccess = [userId, ...staffIds];
      q = q.in("created_by", fullAccess);
    }
    return q;
  };
  const { data, error } = await createBaseQuery().eq(
    "application_deadline",
    new Date().toISOString().split("T")[0],
  );
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function getStaleInterViews() {
  const session = await getServerSession(authConfig);
  const supabase = getSupabaseWithAuth(session);

  const userId = session?.user?.id;

  const sevsenDaysAgo = new Date();
  sevsenDaysAgo.setDate(sevsenDaysAgo.getDate() - 7);

  const { data: teamProfile } = await supabase
    .from("team_profiles")
    .select("managed_by")
    .eq("id", userId)
    .maybeSingle();

  const isStaff = !!teamProfile?.managed_by;
  let staffIds = [];

  if (!isStaff) {
    const { data: staffMembers } = await supabase
      .from("team_profiles")
      .select("id")
      .eq("managed_by", userId);

    if (staffMembers) {
      staffIds = staffMembers.map((m) => m.id);
    }
  }

  const createBaseQuery = () => {
    let q = supabase.from("interviews").select(
      `id, start_time,
      applications!inner(id, job_id, status, profiles(firstname, lastname, email), jobs!inner(created_by))`,
    );
    if (isStaff) {
      q = q.eq("applications.jobs.created_by", userId);
    } else {
      const fullAccess = [userId, ...staffIds];
      q = q.in("applications.jobs.created_by", fullAccess);
    }
    return q;
  };

  const { data, error } = await createBaseQuery()
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
  const userId = session?.user?.id;

  const { data: teamProfile } = await supabase
    .from("team_profiles")
    .select("managed_by")
    .eq("id", userId)
    .maybeSingle();

  const isStaff = !!teamProfile?.managed_by;
  let staffIds = [];

  if (!isStaff) {
    const { data: staffMembers } = await supabase
      .from("team_profiles")
      .select("id")
      .eq("managed_by", userId);

    if (staffMembers) {
      staffIds = staffMembers.map((m) => m.id);
    }
  }

  const createBaseQuery = () => {
    let q = supabase
      .from("jobs")
      .select(`id, title, company, applications(count)`);

    if (isStaff) {
      q = q.eq("created_by", userId);
    } else {
      const fullAccess = [userId, ...staffIds];
      q = q.in("created_by", fullAccess);
    }
    return q;
  };

  // 1. نجلب الوظائف مع العد
  const { data, error } = await createBaseQuery();

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
  const userId = session?.user?.id;

  const { data: teamProfile } = await supabase
    .from("team_profiles")
    .select("managed_by")
    .eq("id", userId)
    .maybeSingle();

  const isStaff = !!teamProfile?.managed_by;
  let staffIds = [];

  if (!isStaff) {
    const { data: staffMembers } = await supabase
      .from("team_profiles")
      .select("id")
      .eq("managed_by", userId);

    if (staffMembers) {
      staffIds = staffMembers.map((m) => m.id);
    }
  }

  const createBaseQuery = () => {
    let q = supabase
      .from("jobs")
      .select(`id, title, company, applications(count)`);

    if (isStaff) {
      q = q.eq("created_by", userId);
    } else {
      const fullAccess = [userId, ...staffIds];
      q = q.in("created_by", fullAccess);
    }
    return q;
  };

  // 1. نجلب الوظائف مع العد
  const { data, error } = await createBaseQuery();

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
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id;
  const supabase = getSupabaseAdmin();

  const { data: teamProfile } = await supabase
    .from("team_profiles")
    .select("managed_by")
    .eq("id", userId)
    .maybeSingle();

  const isStaff = !!teamProfile?.managed_by;
  let staffIds = [];

  if (!isStaff) {
    const { data: staffMembers } = await supabase
      .from("team_profiles")
      .select("id")
      .eq("managed_by", userId);

    if (staffMembers) {
      staffIds = staffMembers.map((m) => m.id);
    }
  }

  // دالة مساعدة لإنشاء استعلام جديد في كل مرة لتجنب التضارب
  const createBaseQuery = () => {
    let q = supabase.from("jobs").select("*", { count: "exact", head: true });

    if (isStaff) {
      q = q.eq("created_by", userId);
    } else {
      const fullAccess = [userId, ...staffIds];
      q = q.in("created_by", fullAccess);
    }
    return q;
  };

  // 1. جلب عدد الوظائف المنشورة - ننشئ استعلام مستقل
  const { count: published, error: error1 } = await createBaseQuery().eq(
    "published",
    true,
  );

  // 2. جلب عدد الوظائف غير المنشورة - ننشئ استعلام مستقل آخر
  const { count: drafts, error: error2 } = await createBaseQuery().eq(
    "published",
    false,
  );

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
  // تأكد من تعريف userId هنا
  const userId = session?.user?.id;

  if (!userId) return [];

  const supabase = getSupabaseWithAuth(session);

  // 1. تحديد صلاحيات المستخدم (Staff أم Admin)
  const { data: teamProfile } = await supabase
    .from("team_profiles")
    .select("managed_by")
    .eq("id", userId)
    .maybeSingle();

  const isStaff = !!teamProfile?.managed_by;
  let staffIds = [];

  if (!isStaff) {
    const { data: staffMembers } = await supabase
      .from("team_profiles")
      .select("id")
      .eq("managed_by", userId);

    if (staffMembers) {
      staffIds = staffMembers.map((m) => m.id);
    }
  }

  // 2. بناء الاستعلام مع استخدام !inner للفلترة الحقيقية
  const createBaseQuery = () => {
    // استخدم !inner لإخبار سوبابيس بضرورة وجود علاقة مطابقة تماماً
    let q = supabase.from("applications").select(`
        status, 
        jobs!inner(created_by)
      `);

    if (isStaff) {
      q = q.eq("jobs.created_by", userId);
    } else {
      const fullAccess = [userId, ...staffIds];
      q = q.in("jobs.created_by", fullAccess);
    }
    return q;
  };

  const { data, error } = await createBaseQuery();

  if (error) {
    console.error("Error fetching applications:", error);
    throw new Error("Kunne inte hämta ansökningar");
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

export async function getTeamMembers(adminId) {
  const supabase = getSupabaseAdmin(); // نستخدم نسخة الأدمن لجلب بيانات الفريق

  const { data, error } = await supabase
    .from("team_profiles")
    .select(
      `
      id, 
      email, 
      employee_id, 
      sub_role, 
      created_at,
      users:id (
        name,
        image
      )
    `,
    )
    .eq("managed_by", adminId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching team:", error);
    return [];
  }

  // تنظيف البيانات لتعود بشكل مسطح (Flatten) ليسهل التعامل معها في المكونات
  const formattedData = data.map((member) => ({
    id: member.id,
    email: member.email,
    employee_id: member.employee_id,
    sub_role: member.sub_role,
    created_at: member.created_at,
    name: member.users?.name || "Väntar på inloggning...", // إذا لم يسجل دخول بعد
    image: member.users?.image || null,
  }));

  return formattedData;
}

export async function getTeamProfileInfo(id) {
  const supabaseAdmin = getSupabaseAdmin();

  const { data, error } = await supabaseAdmin
    .from("team_profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.log(error.message);
    return null;
  }

  return data;
}
