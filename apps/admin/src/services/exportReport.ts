import { Order } from '@packages/types';

/** Escape spreadsheet formula prefixes as well as CSV quotes. */
export function exportOrders(orders: Order[]) {
  const cell = (value: unknown) => {
    let text = String(value ?? '');
    if (/^[=+@-]/.test(text)) text = "'" + text;
    return '"' + text.replace(/"/g, '""') + '"';
  };
  const rows = [['Order', 'Customer', 'City', 'Status', 'Total (PKR)'], ...orders.map(o => [o.order_number, o.customer_name, o.delivery_city, o.status, o.total])];
  const blob = new Blob(['\uFEFF' + rows.map(row => row.map(cell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = `Nourish_Spoon_Orders_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

