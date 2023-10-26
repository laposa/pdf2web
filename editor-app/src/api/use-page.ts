import { publicationKeys } from "@/api/use-publicaction";
import { client } from "@/lib/axios-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const pageKeys = {
  page: (id: number) => ["page", id],
};

export const useUpdatePage = (publicationId: number, pageId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: pageKeys.page(pageId),
    mutationFn: async (payload) => {
      const res = await client.put(
        `/publication/${publicationId}/page/${pageId}`,
        payload
      );
      return res.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: publicationKeys.publication(publicationId),
      });
    },
  });
};
