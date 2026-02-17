"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { cookies } from "next/headers";
import { revalidateTag, unstable_cache } from "next/cache";
import { createProdoctCacheKey, createProductsTags } from "./cache-keys";

export interface GetProductsParams {
  query?: string;
  slug?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}

export async function getProducts({
  query,
  slug,
  sort,
  page = 1,
  pageSize = 3,
}: GetProductsParams) {
  const where: Prisma.ProductWhereInput = {};

  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];
  }

  if (slug) {
    where.category = { slug };
  }

  const orderBy: Record<string, "asc" | "desc"> | undefined =
    sort === "price-asc"
      ? { price: "asc" }
      : sort === "price-desc"
        ? { price: "desc" }
        : undefined;

  const skip = pageSize ? pageSize * (page - 1) : undefined;
  const take = pageSize;

  return await prisma.product.findMany({
    where,
    orderBy,
    skip,
    take,
  });
}

export async function getProductsCached(params: GetProductsParams) {
  const cacheKey = createProdoctCacheKey({
    search: params.query,
    categorySlug: params.slug,
    sort: params.sort,
    page: params.page,
    limit: params.pageSize,
  });

  const cacheTags = createProductsTags({
    search: params.query,
    categorySlug: params.slug,
  });

  return unstable_cache(() => getProducts(params), [cacheKey], {
    tags: cacheTags,
    revalidate: 3600,
  })();
}

export async function getProductBySlug(slug: string) {
  return await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
}

export type CartWithProducts = Prisma.CartGetPayload<{
  include: { items: { include: { product: true } } };
}>;

export type ShoppingCart = CartWithProducts & {
  size: number;
  subtotal: number;
};

export type CartItemWithProduct = Prisma.CartItemGetPayload<{
  include: { product: true };
}>;

async function findCartFromCookie(): Promise<CartWithProducts | null> {
  const cartId = (await cookies()).get("cartId")?.value;

  if (!cartId) return null;

  return unstable_cache(
    async (id: string) => {
      return prisma.cart.findUnique({
        where: { id },
        include: {
          items: { include: { product: true }, orderBy: { createdAt: "desc" } },
        },
      });
    },
    [`cart-${cartId}`],
    { tags: [`cart-${cartId}`], revalidate: 3600 },
  )(cartId);
}

export async function getCart(): Promise<ShoppingCart | null> {
  const cart = await findCartFromCookie();

  if (!cart) return null;

  return {
    ...cart,
    size: cart.items.length,
    subtotal: cart.items.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0,
    ),
  };
}

async function getOrCreateCart(): Promise<CartWithProducts> {
  const cart = await findCartFromCookie();

  if (cart) return cart;

  const newCart = await prisma.cart.create({
    data: {},
    include: { items: { include: { product: true } } },
  });

  (await cookies()).set("cartId", newCart.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return newCart;
}

export async function addToCart(productId: string, quantity: number = 1) {
  if (quantity < 1) {
    throw new Error("Quantity must be at least 1");
  }

  const cart = await getOrCreateCart();

  const existingCartItem = cart.items.find(
    (item) => item.productId === productId,
  );

  if (existingCartItem) {
    await prisma.cartItem.update({
      where: { id: existingCartItem.id },
      data: { quantity: existingCartItem.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });
  }

  revalidateTag(`cart-${cart.id}`);
}

export async function setProductQuantity(productId: string, quantity: number) {
  if (quantity < 0) {
    throw new Error("Quantity must be at least 0");
  }

  const cart = await findCartFromCookie();

  if (!cart) {
    throw new Error("Cart not found");
  }

  // TODO: Make sure that product inventory is not exceeded

  try {
    if (quantity === 0) {
      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
          productId,
        },
      });
    } else {
      await prisma.cartItem.updateMany({
        where: {
          cartId: cart.id,
          productId,
        },
        data: {
          quantity,
        },
      });
    }

    revalidateTag(`cart-${cart.id}`);
  } catch (error) {
    console.log("Error updating cart item quantity:", error);
    throw new Error("Failed to update cart item quantity");
  }
}

export async function getProductsCountCached() {
  return unstable_cache(
    async () => {
      return await prisma.product.count();
    },
    ["products-count"],
    { tags: ["products"], revalidate: 3600 },
  )();
}

export async function getCategoryBySlug(slug: string) {
  return await prisma.category.findUnique({
    where: { slug },
    select: { name: true, slug: true },
  });
}

export async function getCategoryBySlugCached(slug: string) {
  return unstable_cache(
    async () => getCategoryBySlug(slug),
    [`category-${slug}`],
    { tags: [`category-${slug}`], revalidate: 3600 },
  )();
}

export async function getAllCategories() {
  return await prisma.category.findMany({
    select: { name: true, slug: true },
    orderBy: { name: "asc" },
  });
}

export async function getAllCategoriesCached() {
  return unstable_cache(async () => getAllCategories(), ["categories"], {
    tags: ["categories"],
    revalidate: 3600,
  })();
}
