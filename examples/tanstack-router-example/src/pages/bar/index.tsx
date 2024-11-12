import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/bar/")({
  component: BarComponent,
});

function BarComponent() {
  return (
    <div className="p-2">
      <h3>Bar</h3>
    </div>
  );
}
