import React, { memo } from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import Button from "../ui/Button";

const Table = memo(function Table({
  headers = [],
  data = [],
  actions = [],
  isLoading = false,
  className = "",
}) {
  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  {headers.map((header, index) => (
                    <th
                      key={header.key || index}
                      scope="col"
                      className={`py-3.5 text-left text-sm font-semibold text-gray-900 
                        ${index === 0 ? "pl-4 pr-3 sm:pl-6" : "px-3"}
                        ${header.className || ""}`}
                    >
                      {header.label}
                    </th>
                  ))}
                  {actions.length > 0 && (
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Actions</span>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={headers.length + (actions.length ? 1 : 0)}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900" />
                        <span>Yükleniyor...</span>
                      </div>
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={headers.length + (actions.length ? 1 : 0)}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      Gösterilecek veri bulunamadı
                    </td>
                  </tr>
                ) : (
                  data.map((row, rowIndex) => (
                    <tr key={row.id || rowIndex}>
                      {headers.map((header, colIndex) => (
                        <td
                          key={`${rowIndex}-${header.key || colIndex}`}
                          className={`whitespace-nowrap py-4 text-sm
                            ${
                              colIndex === 0
                                ? "pl-4 pr-3 font-medium text-gray-900 sm:pl-6"
                                : "px-3 text-gray-500"
                            }
                            ${header.cellClassName || ""}`}
                        >
                          {header.render
                            ? header.render(row[header.key], row)
                            : row[header.key]}
                        </td>
                      ))}
                      {actions.length > 0 && (
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex justify-end gap-2">
                            {actions.map((action, actionIndex) => (
                              <button
                                key={actionIndex}
                                onClick={() => action.onClick(row)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                {action.icon}
                              </button>
                            ))}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Table;
