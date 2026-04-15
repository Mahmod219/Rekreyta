import React from "react";
import Filter from "../ui/Filter";
import { SearchBar } from "../shared";
import ClearFilters from "../ui/ClearFilters";

export default function KandidatFilter() {
  return (
    <div className="flex flex-col gap-6  p-3 flex-wrap w-full">
      <SearchBar placeholder="Sök namn, e-post, kategori, tags..." />
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
      <ClearFilters />
    </div>
  );
}
