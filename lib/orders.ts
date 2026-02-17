"use server";

import { cookies } from "next/headers";
import { getCart } from "./actions";
import { prisma } from "./prisma";
import { createCheckoutSession, OrderWithItemsAndProducts } from "./stripe";
import { auth } from "./auth";

export type ProcessCheckoutResponse = {
  sessionUrl: string;
  order: OrderWithItemsAndProducts;
};

export async function processCheckout(): Promise<ProcessCheckoutResponse> {
  const cart = await getCart();
  const session = await auth();
  const userId = session?.user?.id;

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  let orderId: string | null = null;

  try {
    const order = await prisma.$transaction(async (tx) => {
      const total = cart.subtotal;

      const newOrder = await tx.order.create({
        data: { total, userId: userId || null },
      });

      const orderItems = cart.items.map((item) => ({
        orderId: newOrder.id,
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      await tx.orderItem.createMany({ data: orderItems });

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      await tx.cart.delete({ where: { id: cart.id } });

      return newOrder;
    });

    orderId = order.id;

    const fullOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: { items: { include: { product: true } } },
    });

    if (!fullOrder) {
      throw new Error("Order not found");
    }

    const { sessionId, sessionUrl } = await createCheckoutSession(fullOrder);

    if (!sessionUrl || !sessionId) {
      throw new Error("Failed to create Stripe session");
    }

    await prisma.order.update({
      where: { id: fullOrder.id },
      data: { stripeSessionId: sessionId, status: "pending_payment" },
    });

    (await cookies()).delete("cartId");

    return { sessionUrl, order: fullOrder };
  } catch (error) {
    if (orderId && error instanceof Error && error.message.includes("Stripe")) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "failed" },
      });
    }

    console.log("Error creating order:", error);
    throw new Error("Failed to create order");
  }
}
