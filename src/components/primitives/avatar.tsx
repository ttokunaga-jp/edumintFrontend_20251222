// @ts-nocheck
"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";



function Avatar({
  cls,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      
      {...props}
    />
  );
}

function AvatarImage({
  cls,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      
      {...props}
    />
  );
}

function AvatarFallback({
  cls,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
