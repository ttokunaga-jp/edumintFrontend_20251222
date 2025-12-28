// @ts-nocheck
import * as React from "react";



function Card({ cls, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      
      {...props}
    />
  );
}

function CardHeader({ cls, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      
      {...props}
    />
  );
}

function CardTitle({ cls, ...props }: React.ComponentProps<"div">) {
  return (
    <h4
      data-slot="card-title"
      
      {...props}
    />
  );
}

function CardDescription({ cls, ...props }: React.ComponentProps<"div">) {
  return (
    <p
      data-slot="card-description"
      
      {...props}
    />
  );
}

function CardAction({ cls, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      
      {...props}
    />
  );
}

function CardContent({ cls, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      
      {...props}
    />
  );
}

function CardFooter({ cls, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
