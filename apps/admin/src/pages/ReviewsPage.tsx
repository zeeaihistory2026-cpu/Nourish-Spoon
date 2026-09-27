import React, { useState, useEffect } from 'react';
import { storeService } from '../services/storeService';
import { Review } from '@packages/types';
import { Star, CheckCircle, EyeOff, Trash2, Heart, MessageSquare, Image as ImageIcon } from 'lucide-react';

export const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(() => storeService.getReviews());
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'hidden'>('all');

  useEffect(() => {
    return storeService.subscribe(() => {
      setReviews([...storeService.getReviews()]);
    });
  }, []);

  const handleStatusChange = (id: string, st: Review['status']) => {
    storeService.updateReviewStatus(id, st);
  };

  const handleToggleFeature = (id: string) => {
    storeService.toggleFeatureReview(id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this customer review?')) {
      storeService.deleteReview(id);
    }
  };

  const filtered = reviews.filter(r => filter === 'all' || r.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#10271A] dark:text-[#F7F1E5]">
            Customer Reviews Moderation
          </h2>
          <p className="text-xs text-[#5A6D60] dark:text-[#8CAE99]">
            Approve, feature, and verify reviews from website and WhatsApp customer feedback.
          </p>
        </div>

        {/* Status filters */}
        <div className="flex space-x-2">
          {(['all', 'approved', 'pending', 'hidden'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                filter === tab
                  ? 'bg-[#0D5428] text-white'
                  : 'bg-white dark:bg-[#14291C] border border-[#E8DFC8] dark:border-[#24422F] text-[#5A6D60] dark:text-[#8CAE99]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(r => (
          <div
            key={r.id}
            className="bg-white dark:bg-[#14291C] rounded-2xl border border-[#E8DFC8] dark:border-[#24422F] p-5 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {r.customer_avatar ? (
                    <img src={r.customer_avatar} alt="" className="w-10 h-10 rounded-full object-cover border" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#0D5428]/15 text-[#0D5428] font-bold text-xs flex items-center justify-center">
                      {r.customer_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-[#10271A] dark:text-[#F7F1E5] flex items-center space-x-1.5">
                      <span>{r.customer_name}</span>
                      {r.verified && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 rounded font-medium">✓ Verified</span>
                      )}
                    </h4>
                    <span className="text-[11px] text-[#7A9383]">{r.location} • {r.review_date}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} size={13} className="text-[#C99B36] fill-[#C99B36]" />
                  ))}
                </div>
              </div>

              {/* Product Badge */}
              <div className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF9EC] dark:bg-[#0D2115] text-[#0D5428] dark:text-[#77A76A] border border-[#E8DFC8]/60 dark:border-[#24422F]">
                📦 {r.product_name}
              </div>

              {/* Review Comment */}
              <p className="text-xs text-[#10271A] dark:text-[#E2EBE5] leading-relaxed italic">
                "{r.comment}"
              </p>

              {/* WhatsApp Quote Screenshot if available */}
              {r.whatsapp_quote && (
                <div className="p-2.5 rounded-xl bg-[#E7F8EE] dark:bg-[#0A2E19] border border-emerald-200 dark:border-emerald-800/40 text-[11px] flex items-start space-x-2">
                  <MessageSquare size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-900 dark:text-emerald-300 block">WhatsApp Chat Snippet:</span>
                    <span className="text-emerald-800 dark:text-emerald-200 whitespace-pre-line">{r.whatsapp_quote}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions footer */}
            <div className="mt-4 pt-3 border-t border-[#E8DFC8] dark:border-[#24422F] flex items-center justify-between text-xs">
              <button
                onClick={() => handleToggleFeature(r.id)}
                className={`flex items-center space-x-1 font-semibold ${
                  r.is_featured ? 'text-[#C99B36]' : 'text-neutral-400 hover:text-[#C99B36]'
                }`}
                title="Toggle featured on Home Screen"
              >
                <Heart size={14} className={r.is_featured ? 'fill-[#C99B36]' : ''} />
                <span>{r.is_featured ? 'Featured' : 'Feature'}</span>
              </button>

              <div className="flex items-center space-x-1">
                {r.status !== 'approved' ? (
                  <button
                    onClick={() => handleStatusChange(r.id, 'approved')}
                    className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 font-semibold"
                    title="Approve Review"
                  >
                    <CheckCircle size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange(r.id, 'hidden')}
                    className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    title="Hide Review"
                  >
                    <EyeOff size={16} />
                  </button>
                )}

                <button
                  onClick={() => handleDelete(r.id)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950"
                  title="Delete Review"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
