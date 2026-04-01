"use server";
import { getSupabaseAdmin, getSupabaseWithAuth, supabase } from "./supabase";
import { getServerSession } from "next-auth";
import { authConfig } from "../api/auth/[...nextauth]/route";

export const getJobs = async function () {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  return data;
};
export const getJobsAdmin = async function () {
  const session = await getServerSession(authConfig);
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("jobs")
    .select(
      `
      *,
      applicants:applications(count) 
    `,
    )
    .eq("created_by", session.user.id);

  if (error) {
    console.log(error);
  }
  const jobsWithCount = data.map((job) => ({
    ...job,
    // الوصول للرقم بداخل المصفوفة التي أعادها سوبابيس
    applicantsCount: job.applicants?.[0]?.count || 0,
  }));
  return jobsWithCount;
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
  const session = await getServerSession(authConfig);
  const supabaseAuth = getSupabaseWithAuth(session);
  const { data, error } = await supabaseAuth
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

export async function getAccountInfo() {
  const session = await getServerSession(authConfig);

  const supabase = getSupabaseWithAuth(session);

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

export async function getUserApplications(id) {
  const session = await getServerSession(authConfig);
  const supabaseAuth = getSupabaseWithAuth(session);
  const { data, error } = await supabaseAuth
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

export async function getApplicationsByJob(jobId) {
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
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
    )
    .eq("job_id", jobId)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error.message);
    return [];
  }

  return data || [];
}

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
