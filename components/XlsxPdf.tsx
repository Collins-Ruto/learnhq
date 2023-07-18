"use client";
import React, { useState } from "react";
import type { WorkSheet } from "xlsx";
import * as XLSX from "xlsx";
// import * as fs from "fs";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Image from "next/image";

// interface ExcelRow {
//   [key: string]: string;
// }

function Page() {
  const doc = new jsPDF("landscape");

  const [results, setResults] = useState<string[][]>([[]]);
  const handleFileInput = (event: React.SyntheticEvent) => {
    const files = (event.target as HTMLInputElement).files;

    if (files && files.length > 0) {
      const file = files[0] as File;
      const reader = new FileReader();

      reader.onload = function (e) {
        const workbook = XLSX.read((e.target as FileReader).result, {
          type: "binary",
        });

        console.log("wk", workbook);

        // Access and parse the workbook as needed
        const sheetName = workbook.SheetNames[0] ?? "";
        const sheet = workbook.Sheets[sheetName] as WorkSheet;
        const data: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        setResults(data);

        // console.log(data);
      };

      reader.readAsBinaryString(file);
    }
  };

  results.forEach((result) => {
    result.splice(19, 1);
    result.splice(21, 1);
  })

  const newResults = [...results.slice(2)];
  
  console.log(newResults);

  if (results[1] &&  (results[1]?.length ?? 9) > 0) {
 
    results[1][0] =  "ADM";
  }

  autoTable(doc, {
    body: [
      [
        {
          content: "Ace Academy",
          styles: {
            halign: "center",
            fontSize: 16,
          },
        },
      ],
    ],
    theme: "plain",
  });

  autoTable(doc, {
    body: [
      [
        {
          content: results[0],
          styles: {
            halign: "center",
            fontSize: 12,
          },
        },
      ],
    ],
    theme: "plain",
  });

  const columnStyles = {
    '1': {
      // Second column (index 1)
      minCellWidth: 30, // Set the minimum width for the second column (adjust the value as needed)
    },
    '24': {
      cellWidth: 8
    },
    '22': {
      cellWidth: 10
    },
    '21': {
      cellWidth: 8
    },
    '23': {
      cellWidth: 8
    }
  };

  autoTable(doc, {
    head: [results[1] ?? []],
    body: newResults,
    theme: "grid",
    headStyles: {
      fillColor: "#343a40",
    },
    columnStyles: columnStyles,
    styles: {
      fontSize: 7,
      minCellWidth: 9,
    },
  });

  const download = () => {
    doc.save("results");
  };

  return (
    <div>
      <div>
        <label className="mb-2 block font-medium" htmlFor="file_input">
          Upload excel file
        </label>
        <input
          onChange={(e) => {
            handleFileInput(e);
          }}
          className="block w-fit cursor-pointer rounded bg-gray-500 text-lg leading-loose text-gray-900 focus:outline-none"
          type="file"
          name="file"
          id="file_input"
        />
        <p className="mt-1 text-sm text-gray-600" id="file_input_help">
          xlsx
        </p>
      </div>
      <button
        onClick={() => {
          download();
        }}
        type="button"
        className="flex items-center rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        Download
        <Image
          src="https://img.icons8.com/sf-regular-filled/48/FFFFFF/downloading-updates.png"
          className="ml-1 w-6 "
          height={100}
          width={100}
          alt=""
        />
      </button>
    </div>
  );
}

export default Page;
