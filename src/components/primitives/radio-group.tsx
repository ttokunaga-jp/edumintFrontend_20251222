// @ts-nocheck
"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CircleIcon } from "lucide-react";



function RadioGroup({
  cls,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      
      {...props}
    />
  );
}

function RadioGroupItem({
  cls,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot=
      
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot=
        style={{
      display: "",
      alignItems: "center",
      justifyContent: "center"
    }}
      >
        <CircleIcon  />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
