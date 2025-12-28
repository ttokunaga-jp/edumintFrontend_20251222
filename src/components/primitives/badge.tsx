// @ts-nocheck
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";



const badgeVariants = cva(
  ,
  {
    variants: {
      variant: {
        default: "",
        secondary: "",
        destructive: "",
        outline: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  cls,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"), cls)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
