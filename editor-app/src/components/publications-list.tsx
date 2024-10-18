import { usePublications } from "@/api/use-publicaction";
import { CreatePublicationForm } from "@/components/create-publication-form";
import { Publication } from "@/components/publication";
import { Loader } from "@/components/ui/loader";
import { useState } from "react";

type PublicationListProps = {
  publicationId?: number;
};

export const PublicationsList = (props: PublicationListProps) => {
  const [selectedPublication, setSelectedPublication] = useState<
    number | undefined
  >(props.publicationId ?? undefined);

  const publicationsQuery = usePublications();

  if (publicationsQuery.isLoading) return <Loader />;

  if (publicationsQuery.error)
    return "An error has occurred: " + publicationsQuery.error.message;

  return (
    <>
      {selectedPublication ? (
        <Publication id={selectedPublication} />
      ) : (
        <div className="divide-y">
          <CreatePublicationForm
            onRequestClose={(id) => setSelectedPublication(id)}
          />
        </div>
      )}
    </>
  );
};
