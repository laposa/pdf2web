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
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { IObservable } from "fabric/fabric-impl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  url: z.string().url(),
  tooltip: z.string(),
});

export const ObjectEditor = () => {
  const { canvas } = useFabric();
  const [selectedObject, setSelectedObject] =
    useState<IObservable<void> | null>();

  const [position, setPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [data, setData] = useState({
    url: "",
    tooltip: "",
  });

  const handleObjectSelected = (event) => {
    setSelectedObject(event.selected[0]);
    setPosition({
      x: event.selected[0].left,
      y: event.selected[0].top + 50,
      width: event.selected[0].width * event.selected[0].scaleX,
      height: event.selected[0].height * event.selected[0].scaleY,
    });
    setData({
      url: event.selected[0].url,
      tooltip: event.selected[0].tooltip,
    });
  };

  useEffect(() => {
    if (canvas) {
      canvas.on("selection:created", handleObjectSelected);
      canvas.on("selection:updated", handleObjectSelected);
      canvas.on("selection:cleared", () => {
        setSelectedObject(null);
      });

      canvas.on("object:moving", (event) => {
        setPosition({
          x: event.target.left,
          y: event.target.top + 50,
          width: event.target.width * event.target.scaleX,
          height: event.target.height * event.target.scaleY,
        });
      });
    }
  }, [canvas]);

  useEffect(() => {
    if (selectedObject) {
      selectedObject.tooltip = data.tooltip;
      selectedObject.url = data.url;
    }
  }, [data]);

  console.log(selectedObject);

  if (!selectedObject) return null;

  return (
    <>
      <Popover open={true}>
        <PopoverTrigger asChild>
          <div
            className="absolute pointer-events-none"
            style={{
              left: position.x,
              top: position.y,
              width: position.width,
              height: position.height,
            }}
          ></div>
        </PopoverTrigger>
        <PopoverContent sideOffset={20} side="left" align="center">
          <ObjectForm
            key={selectedObject.id}
            values={data}
            onUpdate={(values) => setData(values)}
          />
        </PopoverContent>
      </Popover>
    </>
  );
};

const ObjectForm = (props: {
  values: z.infer<typeof formSchema>;
  onUpdate: (values: z.infer<typeof formSchema>) => void;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...props.values,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    props.onUpdate(values);
  };

  const watch = form.watch();

  useEffect(() => {
    //   onSubmit(form.getValues());
    if (form.formState.isValid && !form.formState.isValidating) {
      onSubmit(form.getValues());
    }
  }, [watch, form.formState]);

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Link</FormLabel>
            <FormControl>
              <Input type="url" className="h-8" {...field} />
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
              ></Textarea>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
};
