// @ts-nocheck
"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";



function Tabs({
  cls,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      
      {...props}
    />
  );
}

function TabsList({
  cls,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      
      {...props}
    />
  );
}

function TabsTrigger({
  cls,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      
      {...props}
    />
  );
}

function TabsContent({
  cls,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
