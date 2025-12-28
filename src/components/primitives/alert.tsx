// @ts-nocheck
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";



const alertVariants = cva(
  ,
  {
    variants: {
      variant: {
        default: "",
        destructive: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Alert({
  cls,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"), cls)}
      {...props}
    />
  );
}

function AlertTitle({ cls, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      
      {...props}
    />
  );
}

function AlertDescription({
  cls,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
