import { useState } from "react";
import * as XLSX from "xlsx";

import GithubIcon from "../components/GithubIcon";

export default function Home() {
  const [data, setData] = useState([]);
  const [mode, setMode] = useState("table");

  const resetData = () => setData([]);
  const toggleMode = () =>
    setMode((prev) => (prev === "table" ? "json" : "table"));

  const handleOnChange = (e) => {
    const file = e.target.files[0];

    const getSheetData = new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const sheetList = XLSX.read(bufferArray, { type: "buffer" });

        const sheetName = sheetList.SheetNames[0];
        const sheet = sheetList.Sheets[sheetName];

        const sheetData = XLSX.utils.sheet_to_json(sheet);
        resolve(sheetData);
      };

      fileReader.onerror = (e) => reject(e);
    });

    getSheetData.then((e) => setData(e));
  };

  const Table = () => (
    <div className="table">
      <table>
        <thead>
          {Object.keys(data[0]).map((e) => (
            <th>{e}</th>
          ))}
        </thead>
        <tbody>
          {data.map((row) => {
            return (
              <tr>
                {Object.values(row).map((value) => (
                  <td>{value}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const Json = () => (
    <pre className="json">{JSON.stringify(data, null, 4)}</pre>
  );

  const cond = data.length === 0;

  return (
    <main>
      <h1>Lector de archivos Excel</h1>
      <a
        href="https://github.com/Arturo-Lopez/react-nextjs-excel-reader"
        target="_blank"
      >
        <GithubIcon />
        Código del proyecto
      </a>
      {cond ? (
        <>
          <label className="button file" htmlFor="input">
            Seleccione un archivo 🗃️
          </label>
          <input type="file" id="input" onChange={handleOnChange} />
        </>
      ) : (
        <button className="button file" onClick={resetData}>
          Resetar
        </button>
      )}

      {!cond ? (
        <button onClick={toggleMode} className="button switch">
          Modo "{mode}"
        </button>
      ) : null}

      {cond ? <p>No hay datos 😔</p> : mode === "table" ? <Table /> : <Json />}
    </main>
  );
}
