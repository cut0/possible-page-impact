import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/bar/piyo/")({
  component: PiyoComponent,
});

function PiyoComponent() {
  return (
    <div className="p-2">
      <h3>BarPiyo</h3>
    </div>
  );
}
