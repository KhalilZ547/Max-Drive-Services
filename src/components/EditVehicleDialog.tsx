
"use client";

import { useState, useEffect } from "react";
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
import type { VehicleData } from "@/app/dashboard/vehicles/actions";

type Vehicle = { make: string; model: string; year: number; vin?: string; };

const EditVehicleFormSchema = z.object({
  make: z.string().min(2, { message: "Make must be at least 2 characters." }),
  model: z.string().min(1, { message: "Model is required." }),
  year: z.coerce.number().min(1900, "Please enter a valid year.").max(new Date().getFullYear() + 1, "Year cannot be in the future."),
  vin: z.string().optional(),
});

type EditVehicleDialogProps = {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    vehicle: VehicleData | null;
    onUpdateVehicle: (vehicleId: string, data: Vehicle) => Promise<void>;
};

export function EditVehicleDialog({ isOpen, onOpenChange, vehicle, onUpdateVehicle }: EditVehicleDialogProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof EditVehicleFormSchema>>({
    resolver: zodResolver(EditVehicleFormSchema),
  });

  useEffect(() => {
    if (vehicle) {
        form.reset({
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            vin: vehicle.vin || "",
        });
    }
  }, [vehicle, form]);

  async function onSubmit(data: z.infer<typeof EditVehicleFormSchema>) {
    if (!vehicle) return;
    setIsSubmitting(true);
    await onUpdateVehicle(vehicle.id, data);
    setIsSubmitting(false);
  }

  if (!vehicle) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Vehicle</DialogTitle>
          <DialogDescription>
            Update the details for your vehicle below.
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
                    <Input {...field} disabled={isSubmitting} />
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
                    <Input {...field} disabled={isSubmitting} />
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
                    <Input type="number" {...field} disabled={isSubmitting} />
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
                    <Input {...field} disabled={isSubmitting} />
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
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
