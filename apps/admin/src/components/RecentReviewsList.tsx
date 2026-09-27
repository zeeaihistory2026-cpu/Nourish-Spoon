import React from 'react';
import { Review } from '@packages/types';
import { ArrowRight, Star } from 'lucide-react';

interface RecentReviewsListProps {
  reviews: Review[];
  onViewAll?: () => void;
  onSelectReview?: (review: Review) => void;
}

export const RecentReviewsList: React.FC<RecentReviewsListProps> = ({
  reviews,
  onViewAll,
  onSelectReview
}) => {
  const displayReviews = reviews.slice(0, 3);

  return (
    <div className="bg-white dark:bg-[#14291C] rounded-2xl p-5 border border-[#E8DFC8] dark:border-[#24422F] shadow-sm flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif text-lg font-bold text-[#10271A] dark:text-[#F7F1E5]">
          Recent Reviews
        </h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-[#0D5428] dark:text-[#77A76A] hover:underline flex items-center space-x-1"
        >
          <span>View All</span>
          <ArrowRight size={12} />
        </button>
      </div>

      <div className="space-y-3.5">
        {displayReviews.map((rev) => (
          <div
            key={rev.id}
            onClick={() => onSelectReview?.(rev)}
            className="flex items-start space-x-3 p-2.5 rounded-xl hover:bg-[#FFF9EC]/50 dark:hover:bg-[#1A3625] transition cursor-pointer border border-transparent hover:border-[#E8DFC8] dark:hover:border-[#24422F]"
          >
            {/* Avatar */}
            {rev.customer_avatar ? (
              <img
                src={rev.customer_avatar}
                alt={rev.customer_name}
                className="w-10 h-10 rounded-full object-cover shrink-0 border border-[#E8DFC8] dark:border-[#2B4B36]"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#C99B36]/20 text-[#C99B36] font-bold text-xs flex items-center justify-center shrink-0">
                {rev.customer_name.charAt(0)}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#10271A] dark:text-[#F7F1E5] truncate">
                  {rev.customer_name}
                </h4>
                <span className="text-[10px] text-[#7A9383]">{rev.review_date}</span>
              </div>

              {/* Star Rating */}
              <div className="flex items-center space-x-0.5 my-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={11}
                    className="text-[#C99B36] fill-[#C99B36]"
                  />
                ))}
              </div>

              <p className="text-xs text-[#3E5245] dark:text-[#B5CCC0] line-clamp-2 italic leading-relaxed">
                "{rev.comment}"
              </p>
            </div>

            {/* Product mini thumbnail */}
            <img
              src={rev.product_name.includes('Panjeeri') ? '/assets/products/panjeeri_card.jpg' : '/assets/products/energy_balls_card.jpg'}
              alt=""
              className="w-10 h-10 rounded-lg object-cover shrink-0 border border-[#E8DFC8] dark:border-[#2B4B36]"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
