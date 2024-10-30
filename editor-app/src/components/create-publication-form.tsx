import { useCreatePublication } from "@/api/use-publicaction";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader } from "lucide-react";
import { useForm } from "react-hook-form";

import * as z from "zod";

const formSchema = z.object({
  file: z.instanceof(File),
});

export const CreatePublicationForm = (props: {
  onRequestClose: (id: number) => void;
}) => {
  const createPublicationMutation = useCreatePublication();

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createPublicationMutation.mutate(values, {
      onSuccess: (data) => {
        props.onRequestClose(data.publication.id);
        window.dispatchEvent(new CustomEvent("pdf2webEditor.created", { detail: data.publication }));
      },
    });
  };

  return (
    <Form {...form}>
      {createPublicationMutation.isError ? (
        <Alert variant={"destructive"}>
          <AlertCircle className="w-4 h-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {createPublicationMutation.error?.message}
          </AlertDescription>
        </Alert>
      ) : null}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="file"
          render={({ field: { onChange }, ...field }) => (
            <FormItem>
              <FormLabel>PDF File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  {...field}
                  onChange={(e) => onChange(e.target.files?.[0])}
                  accept=".pdf"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={createPublicationMutation.isPending}>
          {createPublicationMutation.status === "pending" ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Creating
            </>
          ) : (
            <>Create</>
          )}
        </Button>
      </form>
    </Form>
  );
};
