import { client } from "@/lib/axios-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type CreatePublicationPayload = {
  title: string;
  file: File;
};

export const publicationKeys = {
  publications: ["publications"],
  publication: (id: number) => ["publication", id],
};

export const usePublications = () => {
  return useQuery({
    queryKey: publicationKeys.publications,
    queryFn: async () => {
      const res = await client.get("/publication");
      return res.data;
    },
  });
};

export const usePublication = (id: number) => {
  return useQuery({
    queryKey: publicationKeys.publication(id),
    queryFn: async () => {
      const res = await client.get("/publication/" + id);
      return res.data;
    },
  });
};

export const useCreatePublication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: publicationKeys.publications,
    mutationFn: async (payload: CreatePublicationPayload) => {
      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("file", payload.file);

      const res = await client.post("/publication", formData);
      return res.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: publicationKeys.publications,
      });
    },
  });
};
