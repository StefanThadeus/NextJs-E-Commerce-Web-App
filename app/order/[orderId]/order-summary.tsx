import OrderStatusBadge from "@/components/order-status-badge";
import { OrderWithItemsAndProducts } from "@/lib/stripe";
import { formatPrice } from "@/lib/utils";

interface OrderSummaryProps {
  order: OrderWithItemsAndProducts;
}

export default async function OrderSummary({ order }: OrderSummaryProps) {
  return (
    <div className="flex flex-col pt-4">
      <div className="text-sm text-muted-foreground">
        <div className="flex items-center justify-between border-b pb-1 mb-3">
          <p>Subtotal</p>
          <p className="text-base text-foreground">
            {formatPrice(order.total)}
          </p>
        </div>

        <div className="flex items-center justify-between border-b pb-1 mb-3">
          <p>Taxes</p>
          <p>{formatPrice(0)}</p>
        </div>

        <div className="flex items-center justify-between border-b pb-1 mb-3">
          <p>Shipping</p>
          <p>{formatPrice(0)}</p>
        </div>

        <div className="flex items-center justify-between border-b pb-1 mb-3">
          <p>Status</p>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="flex items-center justify-between border-b pb-1 mb-3">
          <p>Total</p>
          <p className="text-base text-foreground font-semibold">
            {formatPrice(order.total)}
          </p>
        </div>
      </div>
    </div>
  );
}
