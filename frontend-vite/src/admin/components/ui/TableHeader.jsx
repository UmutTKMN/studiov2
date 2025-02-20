import { Input, Button, Typography } from "@material-tailwind/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

function TableHeader({ 
  title, 
  subtitle, 
  onSearch, 
  onAdd, 
  addButtonText = "Yeni Ekle",
  showSearch = true 
}) {
  return (
    <div className="flex justify-between md:items-center gap-y-4 flex-col md:flex-row mb-6">
      <div>
        <Typography className="font-bold text-xl">{title}</Typography>
        {subtitle && (
          <Typography variant="small" className="font-normal text-gray-600">
            {subtitle}
          </Typography>
        )}
      </div>
      <div className="flex gap-2">
        {showSearch && (
          <div className="relative w-72">
            <Input
              type="search"
              placeholder="Ara..."
              onChange={(e) => onSearch?.(e.target.value)}
              className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500"
              labelProps={{
                className: "hidden",
              }}
              icon={<MagnifyingGlassIcon className="text-gray-500" />}
            />
          </div>
        )}
        {onAdd && (
          <Button onClick={onAdd}>{addButtonText}</Button>
        )}
      </div>
    </div>
  );
}

export default TableHeader;
