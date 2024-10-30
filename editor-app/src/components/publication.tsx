import { useUpdatePage } from "@/api/use-page";
import { usePublication } from "@/api/use-publicaction";
import { Area, Editor } from "@/components/editor/editor";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Loader } from "@/components/ui/loader";
import { formatDate } from "@/lib/data";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

type PublicationProps = {
  id: number;
};

export const Publication = (props: PublicationProps) => {
  const query = usePublication(props.id);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const activePage = query.data?.pages?.[activePageIndex];

  const updatePageMutation = useUpdatePage(props.id, activePage?.id);

  const handleUpdatePage = (areas: Area[]) => {
    updatePageMutation.mutate({
      name: activePage.name,
      areas_json: areas,
    });
  };

  if (query.data) {
    return (
      <div>
        <h2 className="text-lg font-medium text-center border-b mb-2 pb-2">
          Publication: {query.data.title}
        </h2>

        <div>
          {activePage ? (
            <Editor
              src={activePage.filename}
              data={activePage.areas_json}
              onUpdate={handleUpdatePage}
              isSaving={updatePageMutation.status === "pending"}
              activePageIndex={activePageIndex}
            />
          ) : (
            <EmptyState text="No page found" />
            )}
        </div>
          
        <Pagination
          activePage={activePageIndex}
          updatePage={(index) => setActivePageIndex(index)}
          numPages={query.data.pages.length}
        />
        <div className="text-center text-sm">
          Last saved at: {formatDate(query.data.updated_at)}
        </div>
      </div>
    );
  }

  return <Loader />;
};

type PaginationProps = {
  activePage: number;
  updatePage: (index: number) => void;
  numPages: number;
};

const Pagination = (props: PaginationProps) => {
  const { activePage, updatePage, numPages } = props;

  return (
    <div className="flex py-2 select-none items-center">
      <Button
        size="sm"
        variant="outline"
        onClick={() => updatePage(activePage - 1)}
        disabled={activePage === 0}
      >
        <ArrowLeft />
      </Button>
      <div className="flex-1 text-center font-bold">
        {activePage + 1}/{numPages}
      </div>

      <Button
        size="sm"
        variant="outline"
        onClick={() => updatePage(activePage + 1)}
        disabled={activePage === numPages - 1}
      >
        <ArrowRight />
      </Button>
    </div>
  );
};
