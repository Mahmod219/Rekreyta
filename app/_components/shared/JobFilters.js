import { ClearFilters, Filter } from "../ui";
import SearchBar from "./SearchBar";

// components/JobFilters.js
export default function JobFilters() {
  return (
    <div className="grid grid-cols-1 items-center  sm:grid-cols-2 lg:grid-cols-2 gap-4 bg-white/90 backdrop-blur-md p-4 sm:p-6 rounded-3xl shadow-lg border border-gray-100 w-full ">
      {/* 1. البحث النصي - جعلناه يأخذ سطر كامل في الموبايل فقط */}
      <div className="w-full">
        <SearchBar placeholder="Jobbtitel, företag eller annat sökord" />
      </div>

      {/* 2. تصنيفات العمل */}
      <Filter
        filterField="category"
        label="Category"
        options={[
          { value: "all", label: "All Categories" },

          { value: "IT & Software", label: "IT & Software" },

          { value: "Healthcare", label: "Healthcare" },

          { value: "Engineering", label: "Engineering" },

          { value: "Education", label: "Education" },

          { value: "Finance", label: "Finance & Accounting" },

          { value: "marketing", label: "Marketing & Sales" },
          { value: "industries", label: "Industries" },

          { value: "Logistics", label: "Logistics & Transport" },
          {
            value: "carpentry & handicrafts",
            label: "Carpentry & handicrafts",
          },

          { value: "Construction", label: "Construction" },

          { value: "Restaurant", label: "Hotels & Restaurants" },
        ]}
      />

      {/* 3. المدن */}
      <Filter
        filterField="location"
        label="Location"
        options={[
          { value: "all", label: "All Sweden" },

          { value: "Stockholm", label: "Stockholm County (Stockholms län)" },

          { value: "Uppsala", label: "Uppsala County (Uppsala län)" },

          { value: "Södermanland", label: "Södermanland County" },

          { value: "Östergötland", label: "Östergötland County" },

          { value: "Jönköping", label: "Jönköping County" },

          { value: "Kronoberg", label: "Kronoberg County" },

          { value: "Kalmar", label: "Kalmar County" },

          { value: "Gotland", label: "Gotland County" },

          { value: "Blekinge", label: "Blekinge County" },

          { value: "Skåne", label: "Skåne County" },

          { value: "Halland", label: "Halland County" },

          { value: "Västra Götaland", label: "Västra Götaland County" },

          { value: "Värmland", label: "Värmland County" },

          { value: "Örebro", label: "Örebro County" },

          { value: "Västmanland", label: "Västmanland County" },

          { value: "Dalarna", label: "Dalarna County" },

          { value: "Gävleborg", label: "Gävleborg County" },

          { value: "Västernorrland", label: "Västernorrland County" },

          { value: "Jämtland", label: "Jämtland County" },

          { value: "Västerbotten", label: "Västerbotten County" },

          { value: "Norrbotten", label: "Norrbotten County" },
        ]}
      />

      {/* 4. نوع الدوام */}
      <Filter
        filterField="type"
        label="Job Type"
        options={[
          { value: "all", label: "All Types" },

          { value: "Full-time", label: "Full-time" },

          { value: "Part-time", label: "Part-time" },

          { value: "Contract", label: "Contract" },

          { value: "Remote", label: "Remote" },

          { value: "Internship", label: "Internship" },

          { value: "Summer Job", label: "Summer Job" },
        ]}
      />
      <div>
        <div className="pt-2 border-t border-gray-100/50 mt-2">
          <ClearFilters />
        </div>
      </div>
    </div>
  );
}
