export default function InputField({
  label,
  name,
  defaultValue,
  error,
  type = "text",
  placeholder,
  icon: Icon, // أضفنا إمكانية تمرير أيقونة اختيارية
}) {
  return (
    <div className="flex flex-col gap-2 w-full group mb-2">
      {/* 1. العنوان (Label) بنفس تصميم الـ CustomSelect */}
      {label && (
        <label
          className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ml-1 transition-colors ${
            error
              ? "text-red-500"
              : "text-gray-400 group-focus-within:text-[#2ecc91]"
          }`}
        >
          {Icon && <Icon className="h-3.5 w-3.5 stroke-[3px]" />}
          {label}
        </label>
      )}

      {/* 2. حقل الإدخال (Input) */}
      <div className="relative">
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue ?? ""}
          className={`
            w-full px-6 py-4 rounded-2xl border-2 font-bold text-sm outline-none transition-all duration-200
            
            /* الحالة الطبيعية */
            bg-gray-50/50 text-gray-700 placeholder:text-gray-300 placeholder:font-medium
            
            /* حالة الـ Focus */
            focus:bg-white focus:ring-4 focus:ring-[#2ecc91]/5
            
            ${
              error
                ? "border-red-500/50 bg-red-50/30 focus:border-red-500 focus:ring-red-500/5 text-red-600"
                : "border-transparent focus:border-[#2ecc91]/20 hover:bg-gray-100/50"
            }
          `}
        />
      </div>

      {/* 3. رسالة الخطأ المنسقة */}
      {error && (
        <p className="text-red-500 text-[11px] font-bold mt-1 ml-2 flex items-center gap-1 italic">
          <span className="text-lg leading-none">*</span> {error[0]}
        </p>
      )}
    </div>
  );
}
