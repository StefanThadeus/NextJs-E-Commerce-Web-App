import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Prisma } from "@prisma/client";

interface OrderItemProps {
  orderItem: Prisma.OrderItemGetPayload<{
    include: { product: true };
  }>;
}

export default function OrderItem({ orderItem }: OrderItemProps) {
  return (
    <li className="border-b border-muted flex py-4 justify-between">
      <div className="flex">
        <div className="overflow-hidden rounded-md border border-muted w-16 h-16">
          {orderItem.product.image && (
            <Image
              className="h-full w-full object-cover"
              src={orderItem.product.image}
              alt={orderItem.product.name}
              width={128}
              height={128}
            />
          )}
        </div>
        <div className="flex flex-col ml-4">
          <div className="font-medium">{orderItem.product.name}</div>
        </div>
      </div>

      <div className="flex flex-col justify-between items-end gap-2">
        <p className="font-medium">{formatPrice(orderItem.price)}</p>

        <div className="flex items-center border border-muted rounded-full">
          <p className="px-3 py-1 text-center">
            Quantity: {orderItem.quantity}
          </p>
        </div>
      </div>
    </li>
  );
}
