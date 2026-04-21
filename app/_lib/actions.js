"use server";

import { getServerSession } from "next-auth";
import { authConfig } from "../api/auth/[...nextauth]/route";

import { addMinutes, formatISO } from "date-fns";
import { revalidatePath } from "next/cache";

import { getMatchScoreFromAI } from "./ai-actions";
import {
  createJob,
  createNotification,
  deleteJobById,
  publishJobById,
} from "./data-service";
import { jobSchema } from "./schemas/jobSchema";
import { profileSchema } from "./schemas/profileSchema";
import { getSupabaseAdmin, getSupabaseWithAuth, supabase } from "./supabase";

export async function generateEmbedding(text) {
  try {
    if (!text || text.trim().length === 0) return null;

    // 1. فحص وجود التوكن (سيظهر في Vercel Logs)
    const token = process.env.HUGGINGFACE_ACCESS_TOKEN;
    if (!token) {
      console.error(
        "❌ ERROR: HUGGINGFACE_ACCESS_TOKEN is not defined in environment variables!",
      );
      return null;
    }

    console.log("🔄 Sending request to Hugging Face...");

    // 2. استخدام الرابط الأساسي مع التأكد من عدم وجود سلاش إضافي في النهاية
    const MODEL_ID = "sentence-transformers/all-MiniLM-L6-v2";
    const API_URL = `https://api-inference.huggingface.co/models/${MODEL_ID}`;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: text,
        options: { wait_for_model: true },
      }),
    });

    // 3. معالجة الرد
    if (!response.ok) {
      const isJson = response.headers
        .get("content-type")
        ?.includes("application/json");
      if (isJson) {
        const errJson = await response.json();
        console.error("❌ API Error Detail:", errJson);
      } else {
        const errText = await response.text();
        console.error(
          `❌ HTML Error (Status ${response.status}):`,
          errText.slice(0, 150),
        );
      }
      return null;
    }

    const result = await response.json();

    // 4. معالجة شكل الرد (أحياناً تعيد HF مصفوفة متداخلة)
    if (Array.isArray(result)) {
      const finalEmbedding = Array.isArray(result[0]) ? result[0] : result;
      console.log("✅ Embedding success! Length:", finalEmbedding.length);
      return finalEmbedding;
    }

    return null;
  } catch (err) {
    console.error("❌ Critical Code Failure:", err.message);
    return null;
  }
}

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

  const jobDesc = data.description;

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
    const newJob = await createJob({
      ...result.data,
      image_url: imageUrl,
      image_path: filePath,
      created_by: session.user.id,
    });

    const jobId = newJob?.id;

    try {
      if (jobDesc && jobId) {
        const embedding = await generateEmbedding(jobDesc);

        if (embedding) {
          const { error: embErr } = await supabaseAdmin // استخدم supabaseAdmin لضمان الصلاحيات
            .from("jobs")
            .update({ job_embedding: embedding })
            .eq("id", jobId); // ✅ التحديث بناءً على ID الوظيفة الحالية فقط

          if (embErr) console.error("Database Update Error:", embErr.message);
          else console.log("✅ Embedding success for Job ID:", jobId);
        }
      }
    } catch (innerErr) {
      console.error("Embedding Process Error:", innerErr.message);
    }

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

  const jobDesc = data.description;

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

    try {
      if (jobDesc) {
        const embedding = await generateEmbedding(jobDesc);

        if (embedding) {
          const { error: embErr } = await supabaseAdmin
            .from("jobs")
            .update({ job_embedding: embedding })
            .eq("id", jobofferId);

          if (embErr) console.error("Database Update Error:", embErr.message);
        }
      }
    } catch (innerErr) {
      console.error("Embedding Process Error:", innerErr.message);
      // ملاحظة: لا نوقف العملية كاملة إذا فشل الـ Embedding فقط لكي لا يخسر المستخدم بياناته الأخرى
    }

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
  console.log(
    "SESSION TOKEN:",
    session?.supabaseAccessToken ? "EXISTS" : "MISSING",
  );
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

  // extract text from pdf

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
    try {
      let resumeText = "";
      const PDFParser = require("pdf2json");
      const pdfParser = new PDFParser(null, 1);

      let pdfBuffer = null;

      // 1. الحصول على الـ Buffer
      if (cv_file && cv_file.size > 0) {
        pdfBuffer = Buffer.from(await cv_file.arrayBuffer());
      } else if (updatePayload.cv_url) {
        const response = await fetch(updatePayload.cv_url);
        pdfBuffer = Buffer.from(await response.arrayBuffer());
      }

      if (pdfBuffer) {
        resumeText = await new Promise((resolve, reject) => {
          pdfParser.on("pdfParser_dataError", (errData) =>
            reject(errData.parserError),
          );
          pdfParser.on("pdfParser_dataReady", () => {
            resolve(pdfParser.getRawTextContent());
          });
          pdfParser.parseBuffer(pdfBuffer);
        });

        // 2. تنظيف النص (إزالة المسافات الزائدة والسطور الفارغة لتقليل التكلفة)
        const cleanedText = resumeText
          .replace(/\s+/g, " ")
          .trim()
          .substring(0, 10000); // نأخذ أول 10 آلاف حرف لضمان عدم تجاوز حدود الـ API

        if (cleanedText) {
          // 3. توليد الـ Embedding (تأكد من وجود هذه الدالة لديك)
          const embedding = await generateEmbedding(cleanedText);

          if (embedding) {
            const { error: embedError } = await supabase
              .from("profiles")
              .update({ cv_embedding: embedding })
              .eq("id", userId);

            if (embedError)
              console.error("Database Update Error:", embedError.message);
            else console.log("✅ Embedding success for user:", userId);
          }
        }
      }
    } catch (innerErr) {
      console.error("Embedding Process Error:", innerErr.message);
      // ملاحظة: لا نوقف العملية كاملة إذا فشل الـ Embedding فقط لكي لا يخسر المستخدم بياناته الأخرى
    }

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
  // 1. التحقق من الجلسة
  const session = await getServerSession(authConfig);
  if (!session) return { formError: "Du måste vara inloggad" };

  const userId = session.user.id;
  const supabaseClient = getSupabaseWithAuth(session);
  const supabaseAdmin = getSupabaseAdmin();

  // 2. استخراج البيانات من الفورم
  const jobId = formData.get("jobId");
  const firstName = formData.get("firstname");
  const lastName = formData.get("lastname");
  const coverLetter = formData.get("coverletter");
  const fullName = `${firstName} ${lastName}`;

  const newCvFile = formData.get("cv");
  const newAnotherFile = formData.get("another");

  try {
    // 3. جلب بيانات الوظيفة والبروفايل
    const { data: jobData, error: jobError } = await supabaseAdmin
      .from("jobs")
      .select("title, description, created_by")
      .eq("id", jobId)
      .single();

    if (jobError || !jobData)
      throw new Error("Jobbinformationen kunde inte hämtas.");

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("cv_url, cv_path, another_url, another_path")
      .eq("id", userId)
      .single();

    let matchScore = 0;
    let aiAnalysis = "";
    let resumeText = "";

    // 4. استخراج النص من الـ PDF (الجديد أو القديم)
    // 4. استخراج النص من الـ PDF باستخدام pdf2json
    try {
      const PDFParser = require("pdf2json");
      const pdfParser = new PDFParser(null, 1); // الـ 1 تعني استخراج النص فقط

      let pdfBuffer = null;
      if (newCvFile && newCvFile.size > 0) {
        pdfBuffer = Buffer.from(await newCvFile.arrayBuffer());
      } else if (profile?.cv_url) {
        const response = await fetch(profile.cv_url);
        pdfBuffer = Buffer.from(await response.arrayBuffer());
      }

      if (pdfBuffer) {
        // تحويل عملية الاستخراج لـ Promise عشان الـ await يشتغل صح
        resumeText = await new Promise((resolve, reject) => {
          pdfParser.on("pdfParser_dataError", (errData) =>
            reject(errData.parserError),
          );
          pdfParser.on("pdfParser_dataReady", () => {
            resolve(pdfParser.getRawTextContent()); // جلب النص الخام
          });
          pdfParser.parseBuffer(pdfBuffer);
        });
      }

      // 5. إرسال النص للـ AI
      if (resumeText && resumeText.trim().length > 0) {
        const aiResult = await getMatchScoreFromAI(
          resumeText,
          jobData.description,
        );
        matchScore = aiResult.score || 0;
        aiAnalysis = aiResult.reason || "";
      }
    } catch (pdfError) {
      console.error("PDF/AI Logic Error:", pdfError);
      aiAnalysis = "Kunde inte analysera CV pga tekniskt fel.";
    }

    // 6. معالجة رفع الملفات (CV)
    let finalCvUrl = profile?.cv_url;
    let finalCvPath = profile?.cv_path;

    if (newCvFile && newCvFile.size > 0) {
      const cvFileName = `${userId}/${Date.now()}-cv-${newCvFile.name}`;
      const { error: cvUploadError } = await supabaseAdmin.storage
        .from("cv-files")
        .upload(cvFileName, newCvFile);

      if (cvUploadError)
        throw new Error(`CV Upload Error: ${cvUploadError.message}`);

      finalCvUrl = supabaseAdmin.storage
        .from("cv-files")
        .getPublicUrl(cvFileName).data.publicUrl;
      finalCvPath = cvFileName;
    }

    // 7. معالجة رفع الملفات (Another/Portfolio)
    let finalAnotherUrl = profile?.another_url;
    let finalAnotherPath = profile?.another_path;

    if (newAnotherFile && newAnotherFile.size > 0) {
      const anotherFileName = `${userId}/${Date.now()}-portfolio-${newAnotherFile.name}`;
      const { error: anotherError } = await supabaseAdmin.storage
        .from("another-files")
        .upload(anotherFileName, newAnotherFile);

      if (anotherError)
        throw new Error(`Portfolio Upload Error: ${anotherError.message}`);

      finalAnotherUrl = supabaseAdmin.storage
        .from("another-files")
        .getPublicUrl(anotherFileName).data.publicUrl;
      finalAnotherPath = anotherFileName;
    }

    // 8. التحقق من عدم التكرار في التقديم
    const { data: existingApp } = await supabaseClient
      .from("applications")
      .select("id")
      .eq("user_id", userId)
      .eq("job_id", jobId)
      .single();

    if (existingApp) throw new Error("Du har redan sökt det här jobbet.");

    // 9. حفظ الطلب في قاعدة البيانات
    const { error: dbError } = await supabaseClient
      .from("applications")
      .insert({
        user_id: userId,
        job_id: jobId,
        status: "inkommen",
        cv_url: finalCvUrl,
        another_url: finalAnotherUrl,
        coverletter: coverLetter,
        match_score: Math.round(matchScore > 1 ? matchScore : matchScore * 100),
        ai_analysis: aiAnalysis,
      });

    if (dbError) throw dbError;

    // 10. تحديث بروفايل المستخدم بالملفات الجديدة
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

    // 11. إرسال إشعار لصاحب الوظيفة
    if (jobData?.created_by) {
      await supabaseAdmin.from("notifications").insert({
        user_id: jobData.created_by,
        title: "Ny arbetssökande",
        message: `${fullName} har sökt "${jobData.title}"`,
        type: "application",
        link: `/admin/applications/${jobId}`,
      });
    }

    revalidatePath("/jobs");
    revalidatePath("/account/info");

    return { success: true };
  } catch (error) {
    console.error("Apply Job Error:", error);
    return { formError: error.message };
  }
}

export async function updateApplicationStatus(applicationId, jobId, newStatus) {
  const session = await getServerSession(authConfig);
  const supabaseAdmin = getSupabaseAdmin();

  if (!session) throw new Error("Du måste vara inloggad");

  console.log("Updating ID:", applicationId, "New Status:", newStatus); // للـ Debug

  // 1. جلب بيانات الوظيفة والطلب (يمكن دمجهما لسرعة الأداء)
  const [
    { data: job, error: jobError },
    { data: application, error: appError },
  ] = await Promise.all([
    supabaseAdmin.from("jobs").select("title").eq("id", jobId).single(),
    supabaseAdmin
      .from("applications")
      .select("user_id")
      .eq("id", applicationId)
      .single(),
  ]);

  if (jobError || appError) {
    console.error("Fetch Error:", jobError || appError);
    throw new Error("Kunde inte hitta data för ansökan");
  }

  // 2. عملية التحديث الفعلية
  const { error: updateError } = await supabaseAdmin
    .from("applications")
    .update({ status: newStatus }) // تأكد أن الاسم في الداتابيز هو status
    .eq("id", applicationId);

  if (updateError) {
    console.error("Supabase Update Error:", updateError); // هذا سيخبرك بالسبب الحقيقي
    throw new Error(`Update failed: ${updateError.message}`);
  }

  // 3. إرسال الإشعار
  try {
    await createNotification({
      user_id: application.user_id,
      title: "Statusuppdatering",
      message: `Din ansökan till ${job.title} har uppdaterats till: ${newStatus}`,
      type: "status",
      link: `/account/applications`,
    });
  } catch (notifError) {
    console.error("Notification failed but status updated:", notifError);
    // لا نرمي خطأ هنا لكي لا يتوقف التحديث إذا فشل الإشعار فقط
  }

  revalidatePath(`/admin/applications/${jobId}`);
  return { success: true };
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

export default async function reviewApplicant(prevState, formData) {
  const session = await getServerSession(authConfig);

  if (!session || session.user.role !== "admin") {
    return { error: "Inte auktoriserad" };
  }

  const supabase = getSupabaseWithAuth(session);
  const currentUserId = session.user.id;

  const appId = formData.get("id"); // قد يأتي كـ string فارغ أو null
  const profId = formData.get("profileId");
  const note = formData.get("note");
  const rating = Number(formData.get("rating"));
  const saved = formData.get("saved") === "on";
  const mainCategory = formData.get("main_category");

  // تنظيف الـ appId: إذا كان فارغاً نجعله null فعلياً
  const cleanAppId = appId && appId !== "" ? appId : null;

  let tags = [];
  try {
    tags = JSON.parse(formData.get("tags") || "[]").map((t) =>
      t.toLowerCase().trim(),
    );
  } catch (e) {
    return { error: "Ogiltiga taggar." };
  }

  // 1. تحديث البروفايل أولاً (الكاتيغوري والتاغ)
  // وضعناها في البداية لضمان حفظها بغض النظر عن حالة المراجعة
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      main_category: mainCategory,
      tags: tags,
    })
    .eq("id", profId);

  if (profileError) {
    console.error("Profile update error:", profileError);
    return { error: "Kunde inte uppdatera profil-tags" };
  }

  // 2. التحقق من وجود مراجعة سابقة لهذا الموظف وهذا البروفايل
  // نستخدم البحث بـ user_id و hr_user_id لأنهما ثابتان حتى لو حُذف الطلب
  const { data: existingReview } = await supabase
    .from("applicant_reviews")
    .select("id, hr_user_id, application_id")
    .eq("user_id", profId)
    .eq("hr_user_id", currentUserId)
    .maybeSingle();

  // 3. منطق الحفظ (Upsert يدوي)
  const reviewData = {
    hr_user_id: currentUserId,
    application_id: cleanAppId,
    user_id: profId,
    note,
    rating,
    saved,
    updated_at: new Date(),
  };

  let reviewError;

  if (existingReview) {
    // إذا كانت المراجعة موجودة، نقوم بعمل Update باستخدام ID المراجعة نفسه
    // هذا يحل مشكلة الـ Conflict تماماً
    const { error } = await supabase
      .from("applicant_reviews")
      .update(reviewData)
      .eq("id", existingReview.id);
    reviewError = error;
  } else {
    // إذا كانت مراجعة جديدة تماماً
    const { error } = await supabase
      .from("applicant_reviews")
      .insert(reviewData);
    reviewError = error;
  }

  if (reviewError) {
    console.error("Review save error:", reviewError);
    return { error: "Fel vid uppdatering av recension" };
  }

  revalidatePath("/admin/applications");
  revalidatePath("/admin/kandidatbank");

  return { success: true };
}

export async function scheduleInterview(formData) {
  const session = await getServerSession(authConfig);

  // 1. التحقق من الصلاحيات (فقط الأدمن يحجز موعد)
  if (!session || session.user.role !== "admin") {
    throw new Error("Du har inte behörighet att boka intervjuer.");
  }

  const supabase = getSupabaseWithAuth(session);

  // 2. استخراج البيانات من الـ Form
  const applicationId = formData.get("applicationId");
  const startDateStr = formData.get("startTime"); // سنستقبله بصيغة ISO من الكالندر
  const duration = parseInt(formData.get("duration")) || 30; // مدة المقابلة بالدقائق (افتراضي 30)
  const type = formData.get("type") || "online";
  const location = formData.get("location") || "";
  const note = formData.get("note") || "";
  const title = formData.get("title") || "";
  const profileId = formData.get("profileId") || "";

  console.log(profileId);

  // 3. حساب وقت النهاية
  const startDate = new Date(startDateStr);
  const endDate = addMinutes(startDate, duration);

  // 4. إدخال البيانات في جدول interviews
  const { data, error } = await supabase
    .from("interviews")
    .insert([
      {
        application_id: applicationId,
        hr_user_id: session.user.id,
        start_time: formatISO(startDate),
        end_time: formatISO(endDate),
        location_or_link: location,
        interviewer_note: note,
        type: type,
        status: "scheduled",
      },
    ])
    .select();

  // 5. معالجة الأخطاء (خاصة خطأ التداخل)
  if (error) {
    console.error("Supabase Interview Error:", error);

    // كود الخطأ 23P01 في Postgres يعني انتهاك قيد الـ EXCLUDE (تداخل مواعيد)
    if (error.code === "23P01") {
      return {
        error:
          "Tidslinjen krockar! Du har redan en annan bokning under denna tid.",
      };
    }

    return { error: "Kunde inte boka intervjun. Försök igen senare." };
  }

  // 6. تحديث حالة الطلب تلقائياً إلى "Interview" (اختياري لكن احترافي)
  await supabase
    .from("applications")
    .update({ status: "intervju" })
    .eq("id", applicationId);

  await createNotification({
    user_id: profileId,
    title: "Statusuppdatering",
    message: `Din ansökan till ${title || "jobbet"} status uppdaterad till intervju`,
    type: "status",
    link: `/account/applications`,
  });

  // تحديث الكاش لصفحة المواعيد وصفحة الطلبات
  revalidatePath("/admin/interviews");
  revalidatePath(`/admin/applications/${applicationId}`);

  return { success: true, data };
}

export async function deleteInterview(interviewId) {
  const session = await getServerSession(authConfig);
  const supabase = getSupabaseWithAuth(session);

  const { error } = await supabase
    .from("interviews")
    .delete()
    .eq("id", interviewId);

  if (error) {
    console.error("Error deleting interview:", error);
    return { error: "Kunde inte radera intervjun." };
  }

  revalidatePath("/admin/interviews");
  return { success: true };
}

export async function updateInterviewTime(interviewId, startISO, endISO) {
  const session = await getServerSession(authConfig);
  const supabase = getSupabaseWithAuth(session);

  const { error } = await supabase
    .from("interviews")
    .update({
      start_time: startISO,
      end_time: endISO,
    })
    .eq("id", interviewId);

  if (error) {
    // خطأ تداخل المواعيد (الذي برمجناه في SQL سابقا)
    if (error.code === "23P01") {
      return { error: "Tidslinjen krockar! Du har redan en annan bokning." };
    }
    return { error: "Kunde inte uppdatera tiden." };
  }

  revalidatePath("/admin/interviews");
  return { success: true };
}

/**
 * 3. تحديث كامل لتفاصيل المقابلة (من الـ Modal)
 */
export async function updateInterviewDetails(formData) {
  const session = await getServerSession(authConfig);
  const supabase = getSupabaseWithAuth(session);

  console.log(formData);

  const id = formData.get("id");
  const type = formData.get("type");
  const location = formData.get("location");
  const note = formData.get("note");
  const userIdN = formData.get("userId");

  console.log(userIdN);

  const { error } = await supabase
    .from("interviews")
    .update({
      type,
      location_or_link: location,
      interviewer_note: note,
    })
    .eq("id", id);

  if (error) return { error: "Kunde inte uppdatera intervjun." };

  await createNotification({
    user_id: userIdN,
    // title: "Statusuppdatering",
    // message: `Din ansökan till ${title || "jobbet"} status uppdaterad till intervju`,
    // type: "status",
    // link: `/account/applications`,
  });

  revalidatePath("/admin/interviews");
  return { success: true };
}

export async function addStaffMember(formData) {
  const session = await getServerSession(authConfig);

  // 1. حماية الأكشن: فقط الأدمن لديه الصلاحية
  if (!session || session.user.role !== "admin") {
    throw new Error("Behörighet saknas.");
  }

  const supabaseAdmin = getSupabaseAdmin();
  const adminId = session.user.id;

  const email = formData.get("email")?.toLowerCase().trim();
  const employeeId = formData.get("employee_id");
  const subRole = formData.get("role");

  if (!email || !employeeId) throw new Error("Alla fält är obligatoriska.");

  // 2. فحص هل الإيميل موجود مسبقاً في جدول اليوزرز
  const { data: existingUser } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingUser) {
    // أ- إذا كان المستخدم موجوداً (سجل دخول سابقاً كطالب عمل مثلاً)
    // نحدث دوره إلى admin في جدول users
    await supabaseAdmin
      .from("users")
      .update({ role: "admin" })
      .eq("id", existingUser.id);

    // ننشئ أو نحدث بياناته في جدول فريق العمل الجديد team_profiles
    const { error: upsertError } = await supabaseAdmin
      .from("team_profiles")
      .upsert({
        id: existingUser.id, // نستخدم نفس ID اليوزر للربط
        email: email,
        managed_by: adminId,
        employee_id: employeeId,
        sub_role: subRole,
      });

    if (upsertError) throw new Error("Kunde inte uppdatera teamprofil.");
  } else {
    // ب- إذا كان الموظف جديد تماماً ولم يسجل دخول أبداً
    // ننشئ له سجلاً في team_profiles بالإيميل فقط (سيتولد ID تلقائي مؤقت)
    // والربط الحقيقي سيحدث في ملف authConfig عند أول تسجيل دخول له
    const { error: insertError } = await supabaseAdmin
      .from("team_profiles")
      .insert([
        {
          email: email,
          managed_by: adminId,
          employee_id: employeeId,
          sub_role: subRole,
          // ملاحظة: الـ id هنا سيكون UUID عشوائي مؤقتاً
        },
      ]);

    if (insertError)
      throw new Error("Kunde inte lägga till medarbetare في جدول الفريق.");
  }

  // 3. تحديث واجهة الإدارة
  revalidatePath("/admin/team");
  return { success: true };
}

export async function deleteStaffMember(memberId) {
  const session = await getServerSession(authConfig);

  // حماية الأكشن: فقط الأدمن يملك صلاحية الحذف
  if (!session || session.user.role !== "admin") {
    throw new Error("Behörighet saknas.");
  }

  const supabaseAdmin = getSupabaseAdmin();

  // 1. تغيير رتبة المستخدم في جدول users ليعود مستخدماً عادياً
  // نستخدم memberId لأنه هو نفسه الـ ID في جدول users
  const { error: userError } = await supabaseAdmin
    .from("users")
    .update({ role: "user" })
    .eq("id", memberId);

  if (userError) throw new Error("Kunde inte återställa användarroll.");

  // 2. حذف الموظف من جدول team_profiles تماماً
  const { error: teamError } = await supabaseAdmin
    .from("team_profiles")
    .delete()
    .eq("id", memberId);

  if (teamError)
    throw new Error("Kunde inte ta bort medarbetaren från teamet.");

  // 3. تحديث الصفحة
  revalidatePath("/admin/team");
  return { success: true };
}
