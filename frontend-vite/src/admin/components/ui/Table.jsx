import React from "react";
import { Card, CardBody, Typography, IconButton } from "@material-tailwind/react";

function Table({ headers, data, actions }) {
  return (
    <Card className="h-full w-full">
      <CardBody className="overflow-scroll !px-0 py-2">
        <table className="w-full min-w-max table-auto">
          <thead>
            <tr>
              {headers.map((header) => (
                <th
                  key={header.key}
                  className={`border-b border-gray-300 !p-4 pb-8 ${header.className || ''}`}
                >
                  <Typography color="blue-gray" variant="small" className="!font-bold">
                    {header.label}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => {
              const isLast = index === data.length - 1;
              const classes = isLast ? "!p-4" : "!p-4 border-b border-gray-300";

              return (
                <tr key={row.id}>
                  {headers.map((header) => (
                    <td key={header.key} className={classes}>
                      {header.key === 'actions' ? (
                        <div className="flex justify-end gap-4">
                          {actions?.map((action, i) => (
                            <IconButton key={i} variant="text" size="sm" onClick={() => action.onClick(row)}>
                              {action.icon}
                            </IconButton>
                          ))}
                        </div>
                      ) : (
                        <Typography variant="small" className="!font-normal text-gray-600">
                          {row[header.key]}
                        </Typography>
                      )}
                    </td>
                  ))}
                </tr>
              )}
            )}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}

export default Table;