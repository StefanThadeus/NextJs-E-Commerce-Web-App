import Stripe from "stripe";
import { Prisma } from "@prisma/client";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-12-15.clover",
  typescript: true,
});

export type OrderWithItemsAndProducts = Prisma.OrderGetPayload<{
  include: { items: { include: { product: true } } };
}>;

export async function createCheckoutSession(order: OrderWithItemsAndProducts) {
  if (!order.items || order.items.length === 0) {
    throw new Error("Order has no items");
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
    order.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.name,
          description: item.product.description || undefined,
          images: item.product.image ? [item.product.image] : undefined,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

  const successUrl = `${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${process.env.NEXT_PUBLIC_URL}/checkout/cancel?session_id={CHECKOUT_SESSION_ID}`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        orderId: order.id,
        ...(order.userId && { userId: order.userId }),
      },
    });

    return { sessionId: session.id, sessionUrl: session.url };
  } catch (error) {
    console.log("Error creating checkout session:", error);
    throw new Error("Failed to create checkout session");
  }
}
