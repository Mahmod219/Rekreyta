"use server";

import { getServerSession } from "next-auth";
import { authConfig } from "../api/auth/[...nextauth]/route";

import { revalidatePath } from "next/cache";
import {
  createJob,
  createNotification,
  deleteJobById,
  publishJobById,
} from "./data-service";
import { applySchema } from "./schemas/applySchema";
import { jobSchema } from "./schemas/jobSchema";
import { profileSchema } from "./schemas/profileSchema";
import { getSupabaseAdmin, getSupabaseWithAuth, supabase } from "./supabase";
import { title } from "node:process";
import { success } from "zod";

export async function addJob(prevState, formData) {
  const session = await getServerSession(authConfig);
  const supabaseAdmin = getSupabaseAdmin();

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

  const userId = session.user.id;

  try {
    // ✅ رفع الصورة
    if (file && file.size > 0) {
      const fileName = `${userId}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from("job-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabaseAdmin.storage
        .from("job-images")
        .getPublicUrl(fileName);

      imageUrl = publicUrl.publicUrl;
      filePath = fileName;
    }

    // ✅ حفظ في الداتابيس
    await createJob({
      ...result.data,
      image_url: imageUrl,
      image_path: filePath,
      created_by: session.user.id,
    });

    revalidatePath("/admin/joboffers");

    return { success: true };
  } catch (error) {
    console.error("Error in addJob:", error);
    return {
      formError: `Något gick fel på servern: ${error.message}`,
    };
  }
}

export async function deleteJob(prevState, formData) {
  const session = await getServerSession(authConfig);

  const supabaseAdmin = getSupabaseAdmin();

  if (!session || session.user.role !== "admin") {
    return { formError: "Du har inte behörighet att utföra den här åtgärden" };
  }

  const data = Object.fromEntries(formData);
  const jobId = data.jobofferId;

  try {
    // 1️⃣ جيب job
    const { data: job } = await supabaseAdmin
      .from("jobs")
      .select("image_path")
      .eq("id", jobId)
      .single();

    // 2️⃣ احذف الصورة
    if (job?.image_path) {
      await supabaseAdmin.storage.from("job-images").remove([job.image_path]);
    }

    // 3️⃣ احذف job
    await deleteJobById(jobId);

    revalidatePath("/admin/joboffers");

    return { success: true };
  } catch (error) {
    console.error(error);
    return { formError: "Något gick fel" };
  }
}

export async function publishJob(prevState, formData) {
  const session = await getServerSession(authConfig);

  if (!session || session.user.role !== "admin") {
    return { formError: "Du har inte behörighet att utföra den här åtgärden" };
  }

  const data = Object.fromEntries(formData);
  const jobofferId = data.jobofferId;
  const currentStatus = data.currentStatus === "true";

  try {
    await publishJobById(jobofferId, !currentStatus);
    return { success: true };
  } catch (error) {
    return { formError: "Något gick fel" };
  }
}

export async function updateJob(prevState, formData) {
  const session = await getServerSession(authConfig);

  if (!session || session.user.role !== "admin") {
    return { formError: "Du är inte auktoriserad" };
  }

  const supabaseAdmin = getSupabaseAdmin();

  const data = Object.fromEntries(formData);
  const jobofferId = data.jobofferId;
  const imageFile = data.image;

  delete data.jobofferId;
  delete data.image;

  const result = jobSchema.safeParse(data);
  if (!result.success) {
    return { fieldErrors: result.error.flatten().fieldErrors };
  }

  try {
    let updateData = { ...result.data };

    if (imageFile && imageFile.size > 0) {
      // 1️⃣ get old image
      const { data: currentJob } = await supabaseAdmin
        .from("jobs")
        .select("image_path")
        .eq("id", jobofferId)
        .single();

      // 2️⃣ delete old image
      if (currentJob?.image_path) {
        await supabaseAdmin.storage
          .from("job-images")
          .remove([currentJob.image_path]);
      }

      // 3️⃣ upload new image
      const fileName = `job-${Date.now()}-${imageFile.name}`;

      const { data: uploadData, error: uploadError } =
        await supabaseAdmin.storage
          .from("job-images")
          .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      // 4️⃣ public url
      const { data: publicUrlData } = supabaseAdmin.storage
        .from("job-images")
        .getPublicUrl(fileName);

      updateData.image_path = uploadData.path;
      updateData.image_url = publicUrlData.publicUrl;
    }

    // 🔥 update باستخدام admin
    const { error } = await supabaseAdmin
      .from("jobs")
      .update(updateData)
      .eq("id", jobofferId);

    if (error) throw error;

    revalidatePath("/admin/joboffers");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { formError: "Misslyckades med att uppdatera jobb" };
  }
}

export async function duplicateData(pravState, formData) {
  const session = await getServerSession(authConfig);

  if (!session || session.user.role !== "admin") {
    return { formError: "Du har inte behörighet att utföra den här åtgärden" };
  }
  const supabaseAdmin = getSupabaseAdmin();

  const data = Object.fromEntries(formData);
  const jobId = data.jobofferId;

  const { data: orginalJob, error } = await supabaseAdmin
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .single();

  if (error) {
    console.error("Error fetching job", error);
    throw new Error("Varning: Vi kunde inte hitta funktionen att kopiera.");
  }
  const { id, created_at, ...jobData } = orginalJob;

  const duplicatedData = {
    ...jobData,
    title: `${jobData.title} (Kopia)`,
    published: false,
  };

  const { error: insertError } = await supabaseAdmin
    .from("jobs")
    .insert([duplicatedData]);

  if (insertError) {
    console.log("Error inserting duplicate:", insertError);
    throw new Error("Det gick inte att skapa en kopia av jobbet");
  }
  revalidatePath("/admin/joboffers");
  return { success: true };
}

export async function savedJob(jobId) {
  const session = await getServerSession(authConfig);

  // 1. التحقق من تسجيل الدخول
  if (!session) {
    throw new Error("Du måste vara inloggad för");
  }

  const userId = session.user.id;

  // 2. التحقق هل الوظيفة محفوظة مسبقاً؟
  const { data: existing, error: fetchError } = await supabase
    .from("savedJobs")
    .select("id") // نحتاج فقط التأكد من الوجود
    .eq("user_id", userId)
    .eq("job_id", jobId)
    .single(); // جلب عنصر واحد فقط

  // 3. منطق التبديل (Toggle Logic)

  // أ: إذا كانت موجودة -> قم بحذفها
  if (existing) {
    const { error: deleteError } = await supabase
      .from("savedJobs")
      .delete() // الطريقة الصحيحة للحذف في Supabase هي .delete()
      .eq("user_id", userId)
      .eq("job_id", jobId);

    if (deleteError)
      throw new Error("Misslyckades med att ta bort från sparade jobb");

    revalidatePath("/");
    revalidatePath("/jobs");
    return { success: true, action: "removed" };
  }

  // ب: إذا لم تكن موجودة -> قم بإضافتها
  const { error: insertError } = await supabase
    .from("savedJobs")
    .insert([{ user_id: userId, job_id: jobId }]);

  if (insertError) {
    console.error("Fel vid infogning av sparat jobb:", insertError);
    throw new Error("Misslyckades med att spara jobbet");
  }

  revalidatePath("/");
  revalidatePath("/jobs");
  return { success: true, action: "sparad" };
}

export async function profileInfo(prevState, formData) {
  const session = await getServerSession(authConfig);
  const supabase = getSupabaseWithAuth(session);
  if (!session) {
    return { formError: "Inte auktoriserad" };
  }

  const cv_file = formData.get("cv");
  const another_file = formData.get("another");

  const data = Object.fromEntries(formData);
  const result = profileSchema.safeParse(data);

  if (!result.success) {
    return { fieldErrors: result.error.flatten().fieldErrors };
  }

  let cvUrl, cvPath, clUrl, clPath;

  const userId = session.user.id;

  try {
    if (cv_file && cv_file.size > 0) {
      const cvFileName = `${userId}/${Date.now()}-${cv_file.name}`;
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
      const clFileName = `${userId}/${Date.now()}-${another_file.name}`;
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
    console.error("Fel i profilinformation:", error);
    return { formError: `Server error: ${error.message}` };
  }
}

export async function deleteFile(fileType) {
  const session = await getServerSession(authConfig);
  const supabaseAdmin = getSupabaseAdmin();
  const userId = session?.user?.id;

  if (!userId) return { error: "Inte auktoriserad" };

  try {
    // 1. جلب البيانات (تأكد من جلب المسار الصحيح)
    const { data: profile, error: fetchError } = await supabaseAdmin
      .from("profiles")
      .select("cv_path, another_path")
      .eq("id", userId)
      .single();

    if (fetchError || !profile) throw new Error("Profilen hittades inte");

    const isCv = fileType === "cv";
    const filePath = isCv ? profile.cv_path : profile.another_path;
    const bucket = isCv ? "cv-files" : "another-files";

    console.log("filepath", filePath);

    if (filePath) {
      // 2. حذف الملف من Storage
      // ملاحظة: تأكد أن filePath هو المسار الكامل داخل الـ Bucket
      const { error: storageError } = await supabaseAdmin.storage
        .from(bucket)
        .remove([filePath]);

      if (storageError) {
        console.error("Fel vid borttagning av lagring:", storageError);
        // لا نتوقف هنا، قد يكون الملف محذوفاً أصلاً من الـ storage ونريد تنظيف الداتابيز
      }

      // 3. تصفير الحقول في قاعدة البيانات (هذا الجزء هو الأهم لليوزر)
      const updateData = isCv
        ? { cv_url: null, cv_path: null }
        : { another_url: null, another_path: null };

      const { error: dbError } = await supabaseAdmin
        .from("profiles")
        .update(updateData)
        .eq("id", userId);

      if (dbError) throw dbError;
    }

    revalidatePath("/account/info"); // تأكد من المسار الصحيح للصفحة
    return { success: true };
  } catch (error) {
    console.error("Fel vid raderingsåtgärd:", error.message);
    return { error: error.message };
  }
}

export async function applyToJobb(prevState, formData) {
  const session = await getServerSession(authConfig);
  if (!session) return { formError: "Du måste vara inloggad" };

  const userId = session.user.id;
  const supabase = getSupabaseWithAuth(session);
  const supabaseAdmin = getSupabaseAdmin();

  // 1. استخراج البيانات من الفورم
  const jobId = formData.get("jobId");
  const firstName = formData.get("firstname");
  const lastName = formData.get("lastname");
  const coverLetter = formData.get("coverletter");
  const fullName = `${firstName} ${lastName}`;

  // الملفات الجديدة من الـ input
  const newCvFile = formData.get("cv");
  const newAnotherFile = formData.get("another");

  try {
    // 2. جلب بيانات البروفايل الحالية (للحصول على الروابط والمسارات القديمة)
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("cv_url, cv_path, another_url, another_path")
      .eq("id", userId)
      .single();

    // 3. معالجة السيرة الذاتية (CV)
    let finalCvUrl = profile?.cv_url;
    let finalCvPath = profile?.cv_path;

    if (newCvFile && newCvFile.size > 0) {
      const cvFileName = `${userId}/${Date.now()}-cv-${newCvFile.name}`;
      const { error: cvError } = await supabaseAdmin.storage
        .from("cv-files")
        .upload(cvFileName, newCvFile);

      if (cvError) throw new Error(`CV Upload Error: ${cvError.message}`);

      finalCvUrl = supabaseAdmin.storage
        .from("cv-files")
        .getPublicUrl(cvFileName).data.publicUrl;
      finalCvPath = cvFileName; // تحديث المسار الجديد
    }

    // 4. معالجة الملف الإضافي (Another/Portfolio)
    let finalAnotherUrl = profile?.another_url;
    let finalAnotherPath = profile?.another_path;

    if (newAnotherFile && newAnotherFile.size > 0) {
      const clFileName = `${userId}/${Date.now()}-portfolio-${newAnotherFile.name}`;
      const { error: clError } = await supabaseAdmin.storage
        .from("another-files")
        .upload(clFileName, newAnotherFile);

      if (clError)
        throw new Error(`Fel vid uppladdning av portfölj: ${clError.message}`);

      finalAnotherUrl = supabaseAdmin.storage
        .from("another-files")
        .getPublicUrl(clFileName).data.publicUrl;
      finalAnotherPath = clFileName; // تحديث المسار الجديد
    }
    const { data: existingApplication, error: checkError } = await supabase
      .from("applications")
      .select("id")
      .eq("user_id", userId)
      .eq("job_id", jobId)
      .single(); // نتوقع نتيجة واحدة فقط إذا وجد

    // 2. إذا وجدنا بيانات، فهذا يعني أنه قدم من قبل
    if (existingApplication) {
      throw new Error("Du har redan skickat en ansökan för det här jobbet.");
      // ترجمة: لقد قمت بالفعل بإرسال طلب لهذه الوظيفة.
    }
    // 5. حفظ الطلب في جدول applications
    const { error: dbError } = await supabase.from("applications").insert({
      user_id: userId,
      job_id: jobId,
      status: "inkommen",
      cv_url: finalCvUrl,
      another_url: finalAnotherUrl,
      coverletter: coverLetter,
    });

    if (dbError) throw dbError;

    // 6. تحديث البروفايل (عشان يضل السيفي والباث محدثين دائماً في حساب المستخدم)
    const profileUpdate = {};
    if (newCvFile && newCvFile.size > 0) {
      profileUpdate.cv_url = finalCvUrl;
      profileUpdate.cv_path = finalCvPath;
    }
    if (newAnotherFile && newAnotherFile.size > 0) {
      profileUpdate.another_url = finalAnotherUrl;
      profileUpdate.another_path = finalAnotherPath;
    }

    if (Object.keys(profileUpdate).length > 0) {
      await supabaseAdmin
        .from("profiles")
        .update(profileUpdate)
        .eq("id", userId);
    }

    // 7. إرسال إشعار للأدمن (صاحب الوظيفة)
    const { data: job } = await supabaseAdmin
      .from("jobs")
      .select("created_by, title")
      .eq("id", jobId)
      .single();

    if (job?.created_by) {
      await supabaseAdmin.from("notifications").insert({
        user_id: job.created_by,
        title: "Ny arbetssökande",
        message: `${fullName} ansökt om "${job.title}"`,
        type: "application",
        link: `/admin/applications/${jobId}`,
      });
    }

    revalidatePath("/jobs");
    revalidatePath("/account/info"); // تحديث صفحة البروفايل أيضاً لأن البيانات تغيرت
    return { success: true };
  } catch (error) {
    console.error("Apply Job Error:", error);
    return { formError: error.message };
  }
}

export async function updateApplicationStatus(applicationId, jobId, newStatus) {
  const session = await getServerSession(authConfig);
  const supabaseAdmin = getSupabaseAdmin();
  if (!session) return { formError: "Du måste vara inloggad" };

  const userId = session.user.id;

  const { data: job } = await supabaseAdmin
    .from("jobs")
    .select(" title")
    .eq("id", jobId)
    .single();

  const jobTitle = job.title;

  const { error } = await supabaseAdmin
    .from("applications")
    .update({ status: newStatus })
    .eq("id", applicationId);

  if (error) {
    console.log("Error updating status:", error.message);
    throw new Error("Kunde inte uppdatera appens status");
  }

  createNotification({
    user_id: userId,
    title: "Statusuppdatering",
    message: `Din ansökan till ${jobTitle} status uppdaterad till ${newStatus}`,
    type: "status",
    link: `/account/applications`,
  });

  revalidatePath(`/admin/applications/${jobId}`);
}

export async function markNotificationAsRead(notificationId) {
  const supabaseAdmin = getSupabaseAdmin();
  const { error } = await supabaseAdmin
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId);

  if (error) throw new Error("Kunde inte uppdatera aviseringen");

  // لإجبار Next.js على تحديث البيانات في الصفحة فوراً
  revalidatePath("/notifications");
}

export async function deleteAllNotifications(userId) {
  const supabaseAdmin = getSupabaseAdmin();
  const { error } = await supabaseAdmin
    .from("notifications")
    .delete()
    .eq("user_id", userId);

  if (error) throw new Error("Kunde inte rensa aviseringen");

  // لإجبار Next.js على تحديث البيانات في الصفحة فوراً
  revalidatePath("/notifications");
}
