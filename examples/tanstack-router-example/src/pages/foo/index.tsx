import { createFileRoute } from "@tanstack/react-router";
import { FooInternalComponent } from "./-internal/FooInternalComponent";

export const Route = createFileRoute("/foo/")({
  component: FooComponent,
});

function FooComponent() {
  return (
    <div className="p-2">
      <h3>Foo</h3>
      <FooInternalComponent />
    </div>
  );
}
