"use client";
import { useState } from "react";

export default function RatingInput({ name = "rating", defaultValue = 0 }) {
  const [rating, setRating] = useState(defaultValue);
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {/* hidden input ليروح مع الفورم */}
      <input type="hidden" name={name} value={rating} />

      {[1, 2, 3, 4, 5].map((star) => (
        <button
          type="button"
          key={star}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="text-2xl transition-transform hover:scale-110"
        >
          <span
            className={
              (hover || rating) >= star ? "text-yellow-400" : "text-gray-300"
            }
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );
}
