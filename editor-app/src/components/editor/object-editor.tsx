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
import { IObservable, Object } from "fabric/fabric-impl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  url: z.string().url().optional(),
  tooltip: z.string().optional(),
});

export const ObjectEditor = () => {
  const { canvas } = useFabric();
  const [selectedObject, setSelectedObject] =
    useState<IObservable<Object> | null>();

  const [position, setPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const getPosition = (object: Object) => {
    return {
      x: object.left ?? 0,
      y: object.top ? object.top + 50 : 0,
      width: object.width && object.scaleX ? object.width * object.scaleX : 0,
      height:
        object.height && object.scaleY ? object.height * object.scaleY : 0,
    };
  };

  const handleObjectSelected = (event: fabric.IEvent<Event>) => {
    const object = event.selected?.[0];
    if (object !== undefined) {
      setSelectedObject(object);
      setPosition(getPosition(object));
    }
  };

  useEffect(() => {
    if (canvas) {
      canvas.on("selection:created", handleObjectSelected);
      canvas.on("selection:updated", handleObjectSelected);
      canvas.on("selection:cleared", () => {
        setSelectedObject(null);
      });

      canvas.on("object:moving", (event: fabric.IEvent<Event>) => {
        const object = event.target;
        if (object) {
          setPosition(getPosition(object));
        }
      });
      canvas.on("object:scaling", (event: fabric.IEvent<Event>) => {
        const object = event.target;
        if (object) {
          setPosition(getPosition(object));
        }
      });
    }
  }, [canvas]);

  if (!selectedObject) return null;

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
            // @ts-ignore
            key={selectedObject.id}
            object={selectedObject}
            onUpdate={() => {}}
          />
        </PopoverContent>
      </Popover>
    </>
  );
};

const ObjectForm = (props: {
  onUpdate: (values: z.infer<typeof formSchema>) => void;
  object: IObservable<Object>;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      // @ts-ignore
      url: props.object.url,
      // @ts-ignore
      tooltip: props.object.tooltip,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    props.onUpdate(values);
  };

  const watch = form.watch();

  useEffect(() => {
    // @ts-ignore
    props.object.tooltip = watch.tooltip;
    // @ts-ignore
    props.object.url = watch.url;
    props.onUpdate(watch);
  }, [watch]);

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
      </form>
    </Form>
  );
};
