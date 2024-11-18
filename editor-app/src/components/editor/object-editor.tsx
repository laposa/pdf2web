import { useFabric } from "@/components/fabric/use-fabric";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Trash } from "lucide-react";
import { PdfPageArea } from "@/shared";

const formSchema = z.object({
  url: z.string().url().optional(),
  tooltip: z.string().optional(),
});

export const ObjectEditor = () => {
  const { selectedObject, position, handleSave, canvas } = useFabric();

  if (!selectedObject) return null;

  const handleRemove = () => {
    canvas.remove(selectedObject);
  };

  return (
    <>
      <Popover open={true}>
        <PopoverTrigger asChild>
          <button
            className="absolute pointer-events-none"
            style={{
              left: position.x,
              top: position.y,
              width: position.width,
              height: position.height,
            }}
          ></button>
        </PopoverTrigger>
        <PopoverContent sideOffset={20} side="left" align="center">
          <ObjectForm
            key={(selectedObject as any).id}
            object={selectedObject}
            onUpdate={() => {
              handleSave();
            }}
          />
          <button
            onClick={handleRemove}
            className="mt-4 flex items-center justify-center p-2 bg-red-500 text-white rounded"
          >
            <Trash className="h-5 w-5" />
          </button>
        </PopoverContent>
      </Popover>
    </>
  );
};

const ObjectForm = (props: {
  onUpdate: (values: z.infer<typeof formSchema>) => void;
  object: PdfPageArea;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: props.object.url || "",
      tooltip: props.object.tooltip || "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    props.onUpdate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  className="h-8"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    props.object.url = e.target.value;
                    props.onUpdate(form.getValues());
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tooltip"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tooltip</FormLabel>
              <FormControl>
                <Textarea
                  className="h-8"
                  placeholder="Enter tooltip text"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    props.object.tooltip = e.target.value;
                    props.onUpdate(form.getValues());
                  }}
                ></Textarea>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
