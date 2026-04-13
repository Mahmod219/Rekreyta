"use client";

import svLocale from "@fullcalendar/core/locales/sv";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useState } from "react";
import { toast } from "sonner";

// استيراد الأكشنز التي قمنا ببنائها
import { updateInterviewTime } from "@/app/_lib/actions";

// استيراد المودال (سنفترض أنك وضعته في نفس المجلد أو مجلد المكونات)
import EditInterviewModal from "./EditInterviewModal";

export default function InterviewCalendar({ interviews }) {
  // حالة لتخزين الموعد المختار لفتحه في المودال
  const [selectedInterview, setSelectedInterview] = useState(null);
  // حالة لإظهار مؤشر التحميل عند التواصل مع السيرفر
  const [loading, setLoading] = useState(false);

  // --- 1. تحويل البيانات للصيغة التي يفهمها التقويم ---
  const events = interviews.map((iv) => ({
    id: iv.id,
    title: `${iv.applications?.profiles?.firstname} ${iv.applications?.profiles?.lastname}`,
    start: iv.start_time,
    end: iv.end_time,

    extendedProps: {
      type: iv.type,
      location: iv.location_or_link,
      note: iv.interviewer_note,
      userId: iv.applications?.profiles?.id, // نمرر الملاحظات لتظهر في المودال لاحقاً
    },
    backgroundColor: iv.type === "online" ? "#2ecc91" : "#4f46e5",
    borderColor: "transparent",
  }));

  // --- 2. دالة التعامل مع السحب والإفلات (تحديث الوقت) ---
  async function handleEventDrop(info) {
    setLoading(true);
    const { event } = info;

    const result = await updateInterviewTime(
      event.id,
      event.start.toISOString(),
      event.end.toISOString(),
    );

    if (result?.error) {
      toast.error(result.error);
      info.revert(); // إعادة الموعد لمكانه الأصلي في حال فشل الأكشن
    } else {
      toast.success("Tiden har uppdaterats");
    }
    setLoading(false);
  }

  // --- 3. دالة التعامل مع الضغط (فتح المودال) ---
  function handleEventClick(info) {
    // نقوم بتجهيز كائن الموعد الذي تم النقر عليه
    const interviewData = {
      id: info.event.id,
      title: info.event.title,
      extendedProps: info.event.extendedProps,
    };

    // نضعه في الـ State ليفتح المودال تلقائياً
    setSelectedInterview(interviewData);
  }

  return (
    <div
      className={`relative ${loading ? "opacity-60 pointer-events-none" : ""} transition-opacity`}
    >
      {/* مؤشر تحميل بسيط يظهر فوق التقويم */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
      )}

      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          locale={svLocale}
          events={events}
          // إعدادات التفاعل
          editable={true} // يسمح بالسحب والتحجيم
          selectable={true}
          eventDrop={handleEventDrop} // عند سحب الموعد لمكان آخر
          eventResize={handleEventDrop} // عند تغيير مدة الموعد بالسحب من الأسفل
          eventClick={handleEventClick} // عند الضغط لفتح التفاصيل
          // إعدادات العرض
          slotMinTime="07:00:00"
          slotMaxTime="17:00:00"
          timeZone="local"
          allDaySlot={false}
          height="auto"
          expandRows={true}
          stickyHeaderDates={true}
          handleWindowResize={true}
          // تصميم شكل الموعد داخل المربع
          eventContent={(eventInfo) => (
            <div className="flex flex-col h-full justify-start overflow-hidden leading-tight">
              {/* وقت المقابلة بخط رمادي صغير */}
              <span className="text-[10px] font-bold text-gray-400 mb-1">
                {eventInfo.timeText}
              </span>

              {/* اسم المتقدم بخط أسود عريض وسطرين كحد أقصى */}
              <span className="text-[12px] font-black text-gray-800  wrap-break-word leading-[1.2]">
                {eventInfo.event.title}
              </span>
            </div>
          )}
        />
      </div>

      {/* --- 4. استدعاء المودال عند اختيار موعد --- */}
      {selectedInterview && (
        <EditInterviewModal
          interview={selectedInterview}
          onClose={() => setSelectedInterview(null)} // وظيفة الإغلاق
        />
      )}

      <style jsx global>{`
        /* زيادة المسافة الرأسية للساعة لكي يظهر النص بوضوح */
        .fc .fc-timegrid-slot {
          height: 3rem !important;
          border-bottom: 1px solid #f1f5f9 !important;
        }

        /* تحسين شكل الموعد (Event Card) */
        .fc-v-event {
          background-color: white !important; /* خلفية بيضاء للبطاقة */
          border: none !important;
          border-left: 5px solid var(--fc-event-bg-color) !important; /* الخط الملون جهة اليسار */
          border-radius: 12px !important;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08) !important;
          padding: 8px !important;
          margin: 1px 2px !important;
        }

        /* تنسيق النصوص داخل البطاقة */
        .fc-event-main-frame {
          padding: 0 !important;
        }

        /* إزالة الخطوط المزعجة ليكون الشكل أنظف (Clean Design) */
        .fc-theme-standard .fc-scrollgrid {
          border: none !important;
        }

        .fc .fc-col-header-cell-cushion {
          padding: 6px 0 !important;
          font-weight: 800;
          text-transform: uppercase;
          font-size: 11px;
          color: #64748b;
        }
      `}</style>
    </div>
  );
}
