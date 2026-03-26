import { notFound } from "next/navigation";
import { supabase } from "./supabase";
export const getJobs = async function () {
  const { data, error } = await supabase
    .from("jobs")
    .select(
      `
      *,
      applicants:applications(count) 
    `,
    )
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return []; // إرجاع مصفوفة فارغة لتجنب أخطاء الـ map لاحقاً
  }

  // الخطوة الناقصة: تحويل شكل البيانات
  const jobsWithCount = data.map((job) => ({
    ...job,
    // الوصول للرقم بداخل المصفوفة التي أعادها سوبابيس
    applicantsCount: job.applicants?.[0]?.count || 0,
  }));

  return jobsWithCount;
};
export const getJobsAdmin = async function () {
  const { data, error } = await supabase.from("jobs").select("*");

  if (error) {
    console.log(error);
  }
  return data;
};

export async function getJob(id) {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.log(error.message);
    notFound();
  }

  return data;
}

export async function updateJobById(id, data) {
  return supabase.from("jobs").update(data).eq("id", id);
}

export async function createJob(data) {
  const { data: job, error } = await supabase
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
  const { error } = await supabase.from("jobs").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function publishJobById(id, newStatus) {
  const { error } = await supabase
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
    .limit(6); // جلب 5 فقط

  if (error) throw new Error("Could not fetch recent jobs");
  return data;
}

export async function createProfile(data) {
  const { data: profile, error } = await supabase
    .from("jobs")
    .insert([data])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return profile;
}

export async function getAccountInfo(id) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.log(error.message);
    notFound();
  }

  return data;
}

export async function getUserApplications(id) {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", id);

  if (error) {
    console.log(error.message);
    notFound();
  }

  return data;
}

export async function getUserAppliedJobs(id) {
  const { data, error } = await supabase.from("jobs").select("*").eq("id", id);

  if (error) {
    console.log(error.message);
    notFound();
  }

  return data;
}

export async function getApplicationsByJob(jobId) {
  const { data, error } = await supabase
    .from("applications")
    .select(
      `
      id,
      status,
      created_at,

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
        cv_url,
        another_url,
        coverletter,
         phone,
         address,
        zipcode,
       city
      )
    `,
    )
    .eq("job_id", jobId)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error.message);
    notFound();
  }

  return data;
}
