
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

type Vehicle = { make: string; model: string; year: number; vin?: string; };

const AddVehicleFormSchema = z.object({
  make: z.string().min(2, { message: "Make must be at least 2 characters." }),
  model: z.string().min(1, { message: "Model is required." }),
  year: z.coerce.number().min(1900, "Please enter a valid year.").max(new Date().getFullYear() + 1, "Year cannot be in the future."),
  vin: z.string().optional(),
});

type AddVehicleDialogProps = {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onAddVehicle: (vehicle: Vehicle) => Promise<void>;
};

export function AddVehicleDialog({ isOpen, onOpenChange, onAddVehicle }: AddVehicleDialogProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof AddVehicleFormSchema>>({
    resolver: zodResolver(AddVehicleFormSchema),
    defaultValues: {
      make: "",
      model: "",
      year: '' as any,
      vin: "",
    },
  });

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    onOpenChange(open);
  }

  async function onSubmit(data: z.infer<typeof AddVehicleFormSchema>) {
    setIsSubmitting(true);
    await onAddVehicle(data);
    setIsSubmitting(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('add_vehicle_title')}</DialogTitle>
          <DialogDescription>
            {t('add_vehicle_desc')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="make"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('vehicle_make')}</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Toyota" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('vehicle_model')}</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Camry" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('vehicle_year')}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 2021" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VIN (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Vehicle Identification Number" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary" disabled={isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('add_vehicle_button')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
