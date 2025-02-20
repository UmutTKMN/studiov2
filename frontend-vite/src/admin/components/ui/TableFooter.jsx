import React from "react";
import { Button, Typography } from "@material-tailwind/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

function TableFooter() {
  const [active, setActive] = React.useState(2);

  const next = () => {
    if (active === 10) return;

    setActive(active + 1);
  };

  const prev = () => {
    if (active === 1) return;

    setActive(active - 1);
  };
  return (
    <section className="container mx-auto py-20 px-4">
      <div className="flex items-center gap-8 justify-between">
        <Typography variant="small" className="font-bold text-gray-600">
          Page <strong className="text-gray-900">{active}</strong> of{" "}
          <strong className="text-gray-900">10</strong>
        </Typography>
        <div className="flex gap-4 items-center">
          <Button
            size="sm"
            variant="outlined"
            onClick={prev}
            disabled={active === 1}
            className="flex gap-1 items-center border-gray-300"
          >
            <ChevronLeftIcon strokeWidth={3} className="h-3 w-3" />
            prev
          </Button>
          <Button
            size="sm"
            variant="outlined"
            onClick={next}
            disabled={active === 10}
            className="flex gap-1 items-center border-gray-300"
          >
            next
            <ChevronRightIcon strokeWidth={3} className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default TableFooter;