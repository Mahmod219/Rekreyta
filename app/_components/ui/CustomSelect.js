// components/ui/CustomSelect.js
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function CustomSelect({
  label,
  icon: Icon,
  options,
  value,
  onChange,
  name,
  placeholder = "Select an option...",
}) {
  return (
    <div className="flex flex-col gap-2 w-full group">
      {/* العنوان والأيقونة فوق السلكت */}
      {label && (
        <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 group-focus-within:text-[#2ecc91] transition-colors">
          {Icon && <Icon className="h-3.5 w-3.5 stroke-[3px]" />}
          {label}
        </label>
      )}

      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-gray-50/50 border-2 border-transparent focus:border-[#2ecc91]/20 focus:bg-white py-4 px-6 rounded-2xl font-bold text-sm text-gray-700 outline-none transition-all cursor-pointer"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* سهم مخصص */}
        <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#2ecc91]">
          <ChevronDownIcon className="h-4 w-4 stroke-[3px]" />
        </div>
      </div>
    </div>
  );
}
