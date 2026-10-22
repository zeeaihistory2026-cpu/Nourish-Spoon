const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs"), path = require("node:path"), Module = require("node:module");
const ts = require("../apps/admin/node_modules/typescript");
const adminRequire = Module.createRequire(path.resolve("apps/admin/package.json"));
const root = process.cwd();
function load(name) {
  const file = path.join(root, `apps/admin/src/lib/${name}.ts`);
  const mod = new Module(file); mod.require = adminRequire;
  mod._compile(ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText, file);
  return mod.exports;
}
const { salesReport } = load("sales");
const now = Date.parse("2026-10-21T12:00:00+05:00");
const paid = (total, extras = {}) => ({ payment_status: "paid", status: "pending", created_at: "2026-09-20T00:00:00Z", paid_at: "2026-10-21T00:00:00Z", total, ...extras });
test("received revenue includes paid undelivered orders and exact discounted totals only once", () => {
  const report = salesReport([
    paid(2230, { subtotal: 2200, discount: 220, delivery_fee: 250 }),
    paid(500, { status: "delivered" }),
    paid(900, { payment_status: "awaiting_payment" }),
    paid(800, { payment_status: "submitted" }),
    paid(700, { payment_status: "refunded" }),
    paid(null), paid(200, { quote_pending: true }),
  ], now);
  assert.equal(report.revenue, 2730);
  assert.equal(report.weekly.total, 2730);
  assert.equal(report.monthly.total, 2730);
  assert.equal(report.monthly.orders, 2);
  assert.equal(report.accounting.invalidPaidOrders, 2);
});
test("payment dates use Pakistan midnight boundaries and ignore later tracking edits", () => {
  const report = salesReport([
    paid(100, { paid_at: "2026-09-30T19:00:00Z" }), // October 1 in Pakistan
    paid(200, { paid_at: "2026-09-30T18:59:59Z" }),
    paid(300, { paid_at: "2026-10-21T06:00:00Z", updated_at: "2026-11-01T00:00:00Z" }),
    paid(400, { paid_at: "2026-10-22T00:00:00Z" }),
  ], now);
  assert.equal(report.revenue, 600);
  assert.equal(report.monthly.total, 400);
  assert.equal(report.weekly.total, 300);
  assert.equal(report.monthly.points[0].revenue, 100);
  assert.equal(report.monthly.total, report.monthly.points.reduce((sum, point) => sum + point.revenue, 0));
});
test("legacy paid orders stay on their order date and revenue is not capped to the latest 2000", () => {
  const report = salesReport(Array.from({ length: 2105 }, (_, id) => paid(100, { id, paid_at: undefined, created_at: "2026-10-20T00:00:00Z", updated_at: "2026-10-21T00:00:00Z" })), now);
  assert.equal(report.revenue, 210500);
  assert.equal(report.monthly.orders, 2105);
  assert.equal(report.accounting.legacyPaymentDates, 2105);
});
test("receipt PDF validates canonical amounts and labels only verified payments PAID", async () => {
  const { receiptPdf } = load("pdf-documents");
  const previous = process.cwd();
  process.chdir(path.resolve("apps/admin"));
  try {
    const order = paid(2230, { order_number: "NS-DEMO-RECEIPT", customer_name: "Demo Customer", payment_method_code: "bank_transfer", subtotal: 2200, discount: 220, delivery_fee: 250, items: [{ product_name: "Classic Panjeeri", variant_weight: "250g", quantity: 2, unit_price: 1100, total_price: 2200 }] });
    const bytes = await receiptPdf(order);
    assert.equal(Buffer.from(bytes).subarray(0, 4).toString(), "%PDF");
    const target = path.resolve(previous, "tmp/pdfs"); fs.mkdirSync(target, { recursive: true });
    fs.writeFileSync(path.join(target, "sample-paid-receipt.pdf"), bytes);
    fs.writeFileSync(path.join(target, "sample-unpaid-receipt.pdf"), await receiptPdf({ ...order, payment_status: "awaiting_payment" }));
    await assert.rejects(() => receiptPdf({ ...order, total: 9999 }), /needs verification/);
    await assert.rejects(() => receiptPdf({ ...order, quote_pending: true }), /awaiting confirmation/);
    const { revenuePdf } = load("pdf-documents");
    const report = salesReport([{ ...order, id: "demo" }], now);
    fs.writeFileSync(path.join(target, "sample-weekly-revenue.pdf"), await revenuePdf(report, "weekly"));
    fs.writeFileSync(path.join(target, "sample-monthly-revenue.pdf"), await revenuePdf(report, "monthly"));
  } finally { process.chdir(previous); }
});
