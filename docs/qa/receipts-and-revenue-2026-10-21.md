# Receipts and received revenue

The dashboard revenue card, weekly graph, monthly graph and downloadable reports
use the same calculation in `apps/admin/src/lib/sales.ts`.

- Include orders whose canonical payment status is `paid`, independently of
  delivery status. Exclude awaiting, submitted and refunded payments.
- Sum the saved final order total after discounts, including delivery charges.
  Never recalculate historical sales using current catalogue prices.
- Record `paid_at` when an administrator marks payment received. Tracking and
  fulfilment edits preserve that timestamp. Period boundaries use Pakistan time.
- Older paid records without a payment timestamp retain order-date attribution.
  This fallback is disclosed in the interface and PDFs; no historic payment dates
  or order amounts are fabricated or overwritten.
- Financial summaries read the complete financial projection of the order
  collection, rather than silently limiting revenue to the latest 2,000 orders.
- Invalid or unconfirmed paid totals are excluded and visibly flagged for review.

## Downloads

The customer receipt endpoint authenticates a non-anonymous Firebase account and
checks ownership before generating the PDF. It validates the saved item and order
arithmetic. The document includes the existing Nourish Spoon logo, order reference,
items, subtotal, discounts, delivery, total and verified payment status. Only a
canonical paid order is labelled PAID. Private cache files support Android sharing;
they are not deleted while a recipient may still be reading their URI.

Administrator weekly and monthly reports require the existing dashboard session.
They include the period, daily totals and constituent paid orders. PDF responses
are private and uncached. The PDF asset is explicitly included in Vercel tracing.

## Validation

`tooling/financial.test.cjs` covers paid orders awaiting delivery, exact discounted
amounts, unpaid and refunded exclusions, Pakistan midnight boundaries, future dates,
legacy dates, more than 2,000 orders, receipt arithmetic and PDF generation.
`tooling/dashboard-commerce.test.mjs` additionally checks receipt ownership,
authentication, payment-date preservation, live API totals and both protected PDF
exports. Its first receipt run caught incorrect wrapping of a 404 as a 400;
preserving `AuthError` fixed that, and the focused retest passed.

The complete local unit run passed 19 backend and 30 mobile/financial tests. The
runtime asset audit found 62 referenced assets and no unused images or fonts.
Production verification and device-install records belong in `artifacts/`; this
document does not substitute local results for a successful live deployment.
