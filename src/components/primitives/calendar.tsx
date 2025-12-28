// @ts-nocheck
"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";


import { buttonVariants } from "./button";

function Calendar({
  cls,
  clsMap,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      
      clsMap={{
        months: "",
        month: "",
        caption: "",
        caption_label: "",
        nav: "",
        nav_button: "",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "",
        head_row: "",
        head_cell: "",
        row: "",
        cell: "",
        day: "",
        day_range_start: "",
        day_range_end: "",
        day_selected: "",
        day_today: "",
        day_outside: "",
        day_disabled: "",
        day_range_middle: "",
        day_hidden: "invisible",
        ...clsMap,
      }}
      components={{
        IconLeft: ({ cls, ...props }) => (
          <ChevronLeft  {...props} />
        ),
        IconRight: ({ cls, ...props }) => (
          <ChevronRight  {...props} />
        ),
      }}
      {...props}
    />
  );
}

export { Calendar };
