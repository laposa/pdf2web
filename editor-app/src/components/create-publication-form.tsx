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
  title: z.string().min(1),
  file: z.instanceof(File),
});

export const CreatePublicationForm = (props: {
  onRequestClose: () => void;
}) => {
  const createPublicationMutation = useCreatePublication();

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    createPublicationMutation.mutate(values, {
      onSuccess: () => {
        props.onRequestClose();
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field: { onChange }, ...field }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  {...field}
                  onChange={(e) => onChange(e.target.files?.[0])}
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
