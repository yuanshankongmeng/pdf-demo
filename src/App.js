import React from "react";
import logo from "./logo.svg";
import "./App.css";
import styled from "styled-components";
import { useTable } from "react-table";
import makeData from "./makeData";
import html2canvas from "html2canvas";
import { Document, Page } from "react-pdf";
import jsPdf from "jspdf";

import samplePdf from "./sample.pdf";

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  // Render the UI for your table
  return (
    <table {...getTableProps()} id="my-table-id">
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function App() {
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        columns: [
          {
            Header: "First Name",
            accessor: "firstName",
          },
          {
            Header: "Last Name",
            accessor: "lastName",
          },
        ],
      },
      {
        Header: "Info",
        columns: [
          {
            Header: "Age",
            accessor: "age",
          },
          {
            Header: "Visits",
            accessor: "visits",
          },
          {
            Header: "Status",
            accessor: "status",
          },
          {
            Header: "Profile Progress",
            accessor: "progress",
          },
        ],
      },
    ],
    []
  );

  const data = React.useMemo(() => makeData(20), []);

  const downloadPdf = () => {
    const element = document.getElementById("my-table-id");
    console.log(element);
    html2canvas(element, { onclone: (document) => {} }).then((canvas) => {
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPdf();
      pdf.addImage(
        img,
        "JPEG",
        0,
        0,
        pdf.internal.pageSize.getWidth(),
        pdf.internal.pageSize.getHeight()
      );
      pdf.save("pdf-exported-example.pdf");
    });
  };

  return (
    <div className="table">
      <div>
        <Document file={samplePdf} options={{ workerSrc: "pdf.worker.js" }}>
          <Page pageNumber={1} />
        </Document>
      </div>
      <div>
        <Styles>
          <Table columns={columns} data={data} />
          <button onClick={downloadPdf}>Export</button>
        </Styles>
      </div>
    </div>
  );
}

export default App;
