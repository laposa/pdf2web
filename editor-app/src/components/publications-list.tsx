import { usePublications } from "@/api/use-publicaction";
import { CreatePublicationForm } from "@/components/create-publication-form";
import { Publication } from "@/components/publication";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Loader } from "@/components/ui/loader";
import { useState } from "react";

type PublicationListProps = {
  publicationId?: number;
};

export const PublicationsList = (props: PublicationListProps) => {
  const [selectedPublication, setSelectedPublication] = useState<
    number | undefined
  >(props.publicationId ?? undefined);

  const [creating, setCreating] = useState(false);

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
          {publicationsQuery.data.length > 0 ? (
            publicationsQuery.data?.map((publication) => (
              <div key={publication.id} className="flex justify-between py-4">
                {publication.title}
                <Button onClick={() => setSelectedPublication(publication.id)}>
                  Edit
                </Button>
              </div>
            ))
          ) : (
            <EmptyState text="No publications found" />
          )}

          <Dialog open={creating} onOpenChange={(val) => setCreating(val)}>
            <DialogTrigger asChild>
              <Button>Add publication</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add publication</DialogTitle>
              </DialogHeader>
              <CreatePublicationForm
                onRequestClose={() => setCreating(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  );
};
