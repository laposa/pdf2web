import { client } from "@/lib/axios-client";
import { useQuery } from "@tanstack/react-query";

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
