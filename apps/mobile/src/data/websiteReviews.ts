import publishedReviews from "@packages/catalog/websiteReviews.json";

const screenshots = [
  require("../../assets/website/review-1.png"),
  require("../../assets/website/review-2.png"),
  require("../../assets/website/review-3.png"),
  require("../../assets/website/review-4.png"),
  require("../../assets/website/review-5.png"),
  require("../../assets/website/review-6.png"),
  require("../../assets/website/review-7.png"),
  require("../../assets/website/review-8.png"),
  require("../../assets/website/review-9.png"),
  require("../../assets/website/review-10.png"),
  require("../../assets/website/review-11.png"),
  require("../../assets/website/review-12.png"),
];

// Snapshot of the publicly displayed testimonials on 2026-10-11.
// Relative source dates are retained as provenance, not displayed as live dates.
export const WEBSITE_REVIEWS = publishedReviews.map((review, index) => ({ ...review, screenshotSource: screenshots[index] }));
export type WebsiteReview = (typeof WEBSITE_REVIEWS)[number];
