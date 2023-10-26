import { usePublications } from "@/api/use-publicaction";
import { Publication } from "@/components/publication";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Loader } from "@/components/ui/loader";
import { useState } from "react";

type PublicationsListProps = {};

export const PublicationsList = (props: PublicationsListProps) => {
  const [selectedPublication, setSelectedPublication] = useState<
    number | undefined
  >(undefined);

  const publicationsQuery = usePublications();

  if (publicationsQuery.isLoading) return <Loader />;

  if (publicationsQuery.error)
    return "An error has occurred: " + publicationsQuery.error.message;

  return (
    <>
      {selectedPublication ? (
        <Publication id={selectedPublication.id} />
      ) : (
        <div className="divide-y">
          {publicationsQuery.data.length > 0 ? (
            publicationsQuery.data?.map((publication) => (
              <div key={publication.id} className="flex justify-between py-4">
                {publication.title}
                <Button onClick={() => setSelectedPublication(publication)}>
                  Edit
                </Button>
              </div>
            ))
          ) : (
            <EmptyState text="No publications found" />
          )}
        </div>
      )}
    </>
  );
};
