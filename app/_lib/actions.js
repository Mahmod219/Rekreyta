"use server";

import { getServerSession } from "next-auth";
import { authConfig } from "../api/auth/[...nextauth]/route";

import { jobSchema } from "./schemas/jobScheam";
import {
  updateJobById,
  createJob,
  deleteJobById,
  publishJobById,
} from "./data-service";
import { revalidatePath } from "next/cache";
import { supabase } from "./supabase";
import { profileSchema } from "./schemas/profileSchema";
import { success } from "zod";
import { applySchema } from "./schemas/applySchema ";

export async function addJob(prevState, formData) {
  const session = await getServerSession(authConfig);

  if (!session || session.user.role !== "admin") {
    return { formError: "Not authorized" };
  }

  const file = formData.get("image");

  const data = Object.fromEntries(formData);

  const result = jobSchema.safeParse(data);

  if (!result.success) {
    return {
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  let imageUrl = null;
  let filePath = null;

  try {
    // ✅ رفع الصورة
    if (file && file.size > 0) {
      const fileName = `${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("job-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from("job-images")
        .getPublicUrl(fileName);

      imageUrl = publicUrl.publicUrl;
      filePath = fileName;
    }

    // ✅ حفظ في الداتابيس
    await createJob({
      ...result.data,
      image_url: imageUrl,
      image_path: filePath, // 🔥 مهم للحذف لاحقاً
    });

    revalidatePath("/admin/joboffers");

    return { success: true };
  } catch (error) {
    console.error("Error in addJob:", error);
    return {
      formError: `Something went wrong on the server: ${error.message}`,
    };
  }
}

export async function deleteJob(prevState, formData) {
  const session = await getServerSession(authConfig);

  if (!session || session.user.role !== "admin") {
    return { formError: "You are not authorized to perform this action" };
  }

  const data = Object.fromEntries(formData);
  const jobId = Number(data.jobofferId);

  try {
    // 1️⃣ جيب job
    const { data: job } = await supabase
      .from("jobs")
      .select("image_path")
      .eq("id", jobId)
      .single();

    // 2️⃣ احذف الصورة
    if (job?.image_path) {
      await supabase.storage.from("job-images").remove([job.image_path]);
    }

    // 3️⃣ احذف job
    await deleteJobById(jobId);

    revalidatePath("/admin/joboffers");

    return { success: true };
  } catch (error) {
    console.error(error);
    return { formError: "Delete failed" };
  }
}

export async function publishJob(prevState, formData) {
  const session = await getServerSession(authConfig);

  if (!session || session.user.role !== "admin") {
    return { formError: "You are not authorized to perform this action" };
  }

  const data = Object.fromEntries(formData);
  const jobofferId = data.jobofferId;
  const currentStatus = data.currentStatus === "true";

  try {
    await publishJobById(jobofferId, !currentStatus);
    revalidatePath("/admin/joboffers");
    return { success: true };
  } catch (error) {
    return { formError: "Something went wrong on the server" };
  }
}

export async function updateJob(prevState, formData) {
  const session = await getServerSession(authConfig);

  if (!session || session.user.role !== "admin") {
    return { formError: "You are not authorized to perform this action" };
  }

  const data = Object.fromEntries(formData);
  const jobofferId = data.jobofferId;
  const imageFile = data.image; // استلام الملف

  // تنظيف البيانات قبل الـ Validation
  delete data.jobofferId;
  delete data.image;

  const result = jobSchema.safeParse(data);
  if (!result.success) {
    return { fieldErrors: result.error.flatten().fieldErrors };
  }

  try {
    let updateData = { ...result.data };

    // التحقق من وجود صورة جديدة مرفوعة
    if (imageFile && imageFile.size > 0) {
      // 1. جلب بيانات الصورة القديمة من DB
      const { data: currentJob } = await supabase
        .from("jobs")
        .select("image_path")
        .eq("id", jobofferId)
        .single();

      // 2. حذف الصورة القديمة من الـ Storage إذا وجدت
      if (currentJob?.image_path) {
        await supabase.storage
          .from("job-images")
          .remove([currentJob.image_path]);
      }

      // 3. رفع الصورة الجديدة
      const fileName = `job-${Date.now()}-${imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("job-images")
        .upload(fileName, imageFile);

      if (uploadError) throw new Error("Upload failed");

      // 4. الحصول على الرابط العام (Public URL)
      const { data: publicUrlData } = supabase.storage
        .from("job-images")
        .getPublicUrl(fileName);

      // تحديث الحقول المطلوبة في الكائن الذي سيُرسل للـ DB
      updateData.image_path = uploadData.path;
      updateData.image_url = publicUrlData.publicUrl;
    }

    // تحديث قاعدة البيانات
    const { error: updateError } = await supabase
      .from("jobs")
      .update(updateData)
      .eq("id", jobofferId);

    if (updateError) throw updateError;

    revalidatePath("/admin/joboffers");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { formError: "Failed to update job offer" };
  }
}

export default async function profileInfo(prevState, formData) {
  const session = await getServerSession(authConfig);

  if (!session || session.user.role !== "user") {
    return { formError: "Not authorized" };
  }

  const cv_file = formData.get("cv");
  const another_file = formData.get("another");

  const data = Object.fromEntries(formData);
  const result = profileSchema.safeParse(data);

  if (!result.success) {
    return { fieldErrors: result.error.flatten().fieldErrors };
  }

  let cvUrl, cvPath, clUrl, clPath;

  try {
    if (cv_file && cv_file.size > 0) {
      const cvFileName = `${Date.now()}-${cv_file.name}`;
      const { error: cvError } = await supabase.storage
        .from("cv-files")
        .upload(cvFileName, cv_file);

      if (cvError) throw new Error(`CV Upload Error: ${cvError.message}`);

      const { data: cvPublic } = supabase.storage
        .from("cv-files")
        .getPublicUrl(cvFileName);

      cvUrl = cvPublic.publicUrl;
      cvPath = cvFileName;
    }

    if (another_file && another_file.size > 0) {
      const clFileName = `${Date.now()}-${another_file.name}`;
      const { error: clError } = await supabase.storage
        .from("another-files")
        .upload(clFileName, another_file);

      if (clError) throw new Error(`CL Upload Error: ${clError.message}`);

      const { data: clPublic } = supabase.storage
        .from("another-files")
        .getPublicUrl(clFileName);

      clUrl = clPublic.publicUrl;
      clPath = clFileName;
    }

    const updatePayload = {
      id: session.user.id,
      ...result.data,
      updated_at: new Date().toISOString(),
    };

    if (cvUrl) {
      updatePayload.cv_url = cvUrl;
      updatePayload.cv_path = cvPath;
    }
    if (clUrl) {
      updatePayload.another_url = clUrl;
      updatePayload.another_path = clPath;
    }

    const { error: dbError } = await supabase
      .from("profiles")
      .upsert(updatePayload, { onConflict: "id" });

    if (dbError) throw dbError;

    revalidatePath("/account/info");
    return { success: true };
  } catch (error) {
    console.error("Error in profileInfo:", error);
    return { formError: `Server error: ${error.message}` };
  }
}

export async function deleteFile(fileType) {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id;

  if (!userId) return { error: "Not authorized" };

  // 1. جلب المسارات باستخدام id
  const { data: profile } = await supabase
    .from("profiles")
    .select("cv_path, another_path")
    .eq("id", userId) // 👈 تم التغيير إلى id
    .single();

  if (!profile) return { error: "Profile not found" };

  const isCv = fileType === "cv";
  const filePath = isCv ? profile.cv_path : profile.another_path;
  const bucket = isCv ? "cv-files" : "another-files";

  if (filePath) {
    // 2. حذف الملف من Storage
    await supabase.storage.from(bucket).remove([filePath]);

    // 3. تصفير الحقول في القاعدة باستخدام id
    const updateData = isCv
      ? { cv_url: null, cv_path: null }
      : { another_url: null, another_path: null };

    await supabase.from("profiles").update(updateData).eq("id", userId); // 👈 تم التغيير إلى id
  }

  revalidatePath("/account");
  return { success: true };
}

export async function applyToJobb(prevState, formData) {
  const session = await getServerSession(authConfig);

  if (!session) return { formError: "You must be logged in" };

  const data = Object.fromEntries(formData);
  const result = applySchema.safeParse(data);

  if (!result.success) {
    return { fieldErrors: result.error.flatten().fieldErrors };
  }

  const userId = session.user.id;
  const jobId = formData.get("jobId");

  const { data: existing } = await supabase
    .from("applications")
    .select("id")
    .eq("user_id", userId)
    .eq("job_id", jobId)
    .single();

  if (existing) return { formError: "You already applied for this job" };

  const { error } = await supabase.from("applications").insert({
    user_id: userId,
    job_id: jobId,
    status: "pending",
  });

  if (error) {
    return { formError: "Somthing went wrong" };
  }
  revalidatePath("/jobs/");
  return { success: true };
}

export async function updateApplicationStatus(applicationId, jobId, newStatus) {
  const { error } = await supabase
    .from("applications")
    .update({ status: newStatus })
    .eq("id", applicationId);

  if (error) {
    console.error("Error updating status:", error.message);
    throw new Error("Could not update application status");
  }

  revalidatePath(`/admin/applications/${jobId}`);
}
