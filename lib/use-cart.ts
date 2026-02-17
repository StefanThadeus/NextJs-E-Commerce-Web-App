import useSWR, { mutate } from "swr";

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

export function useCart() {
  const { data, isLoading, error } = useSWR("/api/cart", fetcher, {
    fallbackData: { itemCount: 0 },
  });

  const revalidateCart = () => mutate("/api/cart");

  return {
    itemCount: data?.itemCount || 0,
    isLoading,
    error,
    revalidateCart,
  };
}
