"use client";
import { useState } from "react";
import { SearchBar } from "../shared";
import ClearFilters from "../ui/ClearFilters";
import Filter from "../ui/Filter";
import SortByJobAdmin from "./SortByJobAdmin";
import {
  AdjustmentsVerticalIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

export default function JobsfilterAdmin() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full space-y-4">
      {/* السطر العلوي: البحث والتحكم */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <SearchBar placeholder="Sök efter titel, företag eller ID..." />
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-3 px-6 py-3 rounded-2xl border font-bold transition-all ${
            isOpen
              ? "bg-[#2ecc91] text-white border-[#2ecc91] shadow-md"
              : "bg-white text-gray-700 border-gray-200 hover:border-[#2ecc91]"
          }`}
        >
          <AdjustmentsVerticalIcon className="w-5 h-5" />
          <span>Filtrera</span>
          <ChevronUpIcon
            className={`w-4 h-4 transition-transform ${!isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* صندوق الفلاتر - تقسيم عامودين */}
      {isOpen && (
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-2xl shadow-gray-200/40 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col gap-6 ">
            {/* العمود الأول */}
            <div className="space-y-6">
              <Filter
                filterField="category"
                label="Kategori"
                options={[
                  { value: "all", label: "Alla kategorier" },

                  {
                    value: "Administration, ekonomi, juridik",
                    label: "Administration, ekonomi, juridik",
                  },

                  {
                    value: "Bygg och anläggning",
                    label: "Bygg och anläggning",
                  },

                  {
                    value: "Chefer och verksamhetsledare",
                    label: "Chefer och verksamhetsledare",
                  },

                  { value: "Data/IT", label: "Data/IT" },

                  {
                    value: "Försäljning, inköp, marknadsföring",
                    label: "Försäljning, inköp, marknadsföring",
                  },

                  { value: "Hantverksyrken", label: "Hantverksyrken" },
                  {
                    value: "Hotell, restaurang, storhushåll",
                    label: "Hotell, restaurang, storhushåll",
                  },

                  {
                    value: "Hälso- och sjukvård",
                    label: "Hälso- och sjukvård",
                  },
                  {
                    value: "Industriell tillverkning",
                    label: "Industriell tillverkning",
                  },

                  {
                    value: "Installation, drift, underhåll",
                    label: "Installation, drift, underhåll",
                  },
                  {
                    value: "Kropps- och skönhetsvård",
                    label: "Kropps- och skönhetsvård",
                  },

                  {
                    value: "Kultur, media, design",
                    label: "Kultur, media, design",
                  },
                  { value: "Militärt arbete", label: "Militärt arbete" },
                  { value: "Naturbruk", label: "Naturbruk" },
                  {
                    value: "Naturvetenskapligt arbete",
                    label: "Naturvetenskapligt arbete",
                  },
                  { value: "Pedagogiskt arbete", label: "Pedagogiskt arbete" },
                  {
                    value: "Sanering och renhållning",
                    label: "Sanering och renhållning",
                  },
                  { value: "Socialt arbete", label: "Socialt arbete" },
                  { value: "Säkerhetsarbete", label: "Säkerhetsarbete" },
                  { value: "Tekniskt arbete", label: "Tekniskt arbete" },
                  { value: "Transport", label: "Transport" },
                ]}
              />
            </div>
            <div className="space-y-6">
              <Filter
                filterField="location"
                label="Plats / Stad"
                options={[
                  { value: "all", label: "Hela Sverige" },

                  { value: "Stockholm", label: "Stockholm län" },

                  { value: "Uppsala", label: "Uppsala County län" },

                  { value: "Södermanland", label: "Södermanland län" },

                  { value: "Östergötland", label: "Östergötland län" },

                  { value: "Jönköping", label: "Jönköping län" },

                  { value: "Kronoberg", label: "Kronoberg län" },

                  { value: "Kalmar", label: "Kalmar län" },

                  { value: "Gotland", label: "Gotland län" },

                  { value: "Blekinge", label: "Blekinge län" },

                  { value: "Skåne", label: "Skåne län" },

                  { value: "Halland", label: "Halland län" },

                  { value: "Västra Götaland", label: "Västra Götaland län" },

                  { value: "Värmland", label: "Värmland län" },

                  { value: "Örebro", label: "Örebro län" },

                  { value: "Västmanland", label: "Västmanland län" },

                  { value: "Dalarna", label: "Dalarna län" },

                  { value: "Gävleborg", label: "Gävleborg län" },

                  { value: "Västernorrland", label: "Västernorrland län" },

                  { value: "Jämtland", label: "Jämtland län" },

                  { value: "Västerbotten", label: "Västerbotten län" },

                  { value: "Norrbotten", label: "Norrbotten län" },
                ]}
              />
            </div>

            {/* العمود الثاني */}
            <div className="space-y-6">
              <Filter
                filterField="type"
                label="Anställning"
                options={[
                  { value: "Heltid", label: "Heltid" },

                  { value: "Deltid", label: "Deltid" },

                  { value: "Kontrakt", label: "Kontrakt" },

                  { value: "Distant", label: "Distant" },

                  { value: "Praktikplats", label: "Praktikplats" },

                  { value: "Sommarjobb", label: "Sommarjobb" },
                  { value: "Vikariat", label: "Vikariat" },
                ]}
              />
            </div>
            <div>
              <Filter
                filterField="published"
                label="Status"
                options={[
                  { value: "all", label: "Alla" },
                  { value: "true", label: "Publicerad" },
                  { value: "false", label: "Utkast" },
                ]}
              />
            </div>

            {/* مكون الترتيب يأخذ المساحة المتبقية في العمود الثاني */}
            <div className="pt-1">
              <SortByJobAdmin />
            </div>
          </div>

          {/* التذييل: زر المسح ومعلومات إضافية */}
          <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between items-center">
            <div className="text-xs text-gray-400">
              Hittar du inte det du söker? Prova att rensa alla filter.
            </div>
            <ClearFilters />
          </div>
        </div>
      )}
    </div>
  );
}
