import React, { useState } from "react";

const EditableTable = () => {
  const [data, setData] = useState([
    { id: 1, name: "John Doe", gender: "Male", age: 30 },
    { id: 2, name: "Jane Smith", gender: "Female", age: 25 },
  ]);

  const handleCellChange = (rowIndex, key, value) => {
    const updatedData = [...data];
    updatedData[rowIndex][key] = value;
    setData(updatedData);
  };

  const addRow = () => {
    const newRow = { id: data.length + 1, name: "", gender: "", age: "" };
    setData([...data, newRow]);
  };

  const removeRow = (index) => {
    const updatedData = data.filter((_, rowIndex) => rowIndex !== index);
    setData(updatedData);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-center text-2xl font-bold text-gray-800 mb-4">Editable Table</h1>
      <table className="table-auto w-full bg-white shadow-md rounded-lg border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Gender</th>
            <th className="px-4 py-2">Age</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={row.id} className={`${rowIndex % 2 === 0 ? "bg-gray-50" : "bg-gray-100"}`}>
              {Object.keys(row).map((key) => (
                <td key={key} className="border px-4 py-2 text-center">
                  <input
                    type="text"
                    value={row[key]}
                    onChange={(e) => handleCellChange(rowIndex, key, e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
              ))}
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={() => removeRow(rowIndex)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={addRow}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Row
      </button>
    </div>
  );
};

export default EditableTable;
