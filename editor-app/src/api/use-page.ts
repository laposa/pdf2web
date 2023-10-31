import { publicationKeys } from "@/api/use-publicaction";
import { Area } from "@/components/editor/editor";
import { client } from "@/lib/axios-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UpdatePagePayload = {
  name: string;
  areas_json: Area[];
};

export const pageKeys = {
  page: (id: number) => ["page", id],
};

export const useUpdatePage = (publicationId: number, pageId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: pageKeys.page(pageId),
    mutationFn: async (payload: UpdatePagePayload) => {
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
