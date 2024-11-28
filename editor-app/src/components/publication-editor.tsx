import { Editor } from "@/components/editor/editor";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PdfManifest, PdfPageArea } from "@/shared";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

type PublicationEditorProps = {
  manifest: PdfManifest;
};

export const PublicationEditor = (props: PublicationEditorProps) => {
  const [manifest, setManifest] = useState<PdfManifest>(props.manifest);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);

  // watch for the custom for setting the manifest
  useEffect(() => {
    const handler = (event: CustomEvent) => {
      setManifest(event.detail);
    };

    window.addEventListener(
      "pdf2webEditor.setManifest",
      handler as unknown as EventListener
    );
    return () =>
      window.removeEventListener(
        "pdf2webEditor.setManifest",
        handler as unknown as EventListener
      );
  }, []);

  const handleUpdatePage = (areas: PdfPageArea[]) => {
    const activePage = manifest.pages.find(
      (page) => page.order === activePageIndex + 1
    )!;
    const updatedPages = manifest.pages.map((page) =>
      page.id === activePage.id ? { ...page, areas } : page
    );

    const updatedManifest = { ...manifest, pages: updatedPages };

    setManifest(updatedManifest);

    window.dispatchEvent(
      new CustomEvent("pdf2webEditor.updated", { detail: updatedManifest })
    );
  };

  const activePage = manifest.pages.find(
    (page) => page.order === activePageIndex + 1
  )!;

  return (
    <div>
      <h2 className="text-lg font-medium text-center border-b mb-2 pb-2">
        Publication: {manifest.source} - {activePageIndex}
      </h2>

      <div>
        {activePage ? (
          <Editor
            src={activePage.filename}
            data={activePage.areas}
            onUpdate={handleUpdatePage}
            activePageIndex={activePageIndex}
          />
        ) : (
          <EmptyState text="No pages found" />
        )}
      </div>

      <Pagination
        activePage={activePageIndex}
        updatePage={(index) => setActivePageIndex(index)}
        numPages={manifest.pages.length}
      />
    </div>
  );
};

type PaginationProps = {
  activePage: number;
  updatePage: (index: number) => void;
  numPages: number;
};

const Pagination = (props: PaginationProps) => {
  const { activePage, updatePage, numPages } = props;

  return (
    <div className="editor-pagination">
      <Button
        size="sm"
        variant="outline"
        onClick={() => updatePage(activePage - 1)}
        disabled={activePage === 0}
      >
        <ArrowLeft />
      </Button>
      <div className="text-center font-bold">
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
