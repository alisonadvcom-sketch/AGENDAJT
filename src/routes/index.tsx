import { createFileRoute } from "@tanstack/react-router";
import { JaniceApp } from "@/components/janice-app";

export const Route = createFileRoute("/")({
  component: JaniceApp,
});
