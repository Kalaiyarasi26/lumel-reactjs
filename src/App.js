import "./styles.css";
import { useState } from "react";
import data from "./data.json";

export default function App() {
  const [userInput, setUserInput] = useState({});
  const [rows, setRows] = useState(data.rows);
  const [percentages, setPercentages] = useState({});

  const getRowValue = (row) => {
    if (row.children) {
      return row.children.reduce((sum, child) => sum + child.value, 0);
    }
    return row.value;
  };

  const handleAllocation = (rowId, currentValue) => {
    const percent = Number(userInput[rowId]) || 0;
    const newValue = currentValue + (currentValue * percent) / 100;

    const updateRows = (items) =>
      items.map((item) => {
        if (item.id === rowId) return { ...item, value: newValue };
        if (item.children)
          return { ...item, children: updateRows(item.children) };
        return item;
      });

    setRows(updateRows(rows));
  };

  const handleShowPercentage = (rowId) => {
    const percent = Number(userInput[rowId]) || 0;
    setPercentages({ ...percentages, [rowId]: percent });
  };

  return (
    <div className="App">
      <table
        border="1"
        cellPadding="8"
        style={{ borderCollapse: "collapse", width: "80%" }}
      >
        <thead>
          <tr>
            <th>Label</th>
            <th>Value</th>
            <th>Input %</th>
            <th>Allocation %</th>
            <th>Allocation Val</th>
            <th>Variance %</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((item) => (
            <>
              <tr key={item.id}>
                <td>{item.label}</td>
                <td>{getRowValue(item)}</td>
                <td>
                  <input
                    type="number"
                    placeholder="Type here"
                    value={userInput[item.id] || ""}
                    onChange={(e) =>
                      setUserInput({ ...userInput, [item.id]: e.target.value })
                    }
                  />
                </td>
                <td>
                  <button onClick={() => handleAllocation(item.id, item.value)}>
                    Allocation %
                  </button>
                </td>
                <td>
                  <button onClick={() => handleShowPercentage(item.id)}>
                    Allocation val
                  </button>
                </td>
                <td>
                  {percentages[item.id] ? percentages[item.id] + "%" : "0%"}
                </td>
              </tr>

              {item.children?.map((row) => (
                <tr key={row.id}>
                  <td>&nbsp;&nbsp;{row.label}</td>
                  <td>{row.value}</td>
                  <td>
                    <input
                      type="number"
                      placeholder="Type here"
                      value={userInput[row.id] || ""}
                      onChange={(e) =>
                        setUserInput({ ...userInput, [row.id]: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <button onClick={() => handleAllocation(row.id, row.value)}>
                      Allocation %
                    </button>
                  </td>
                  <button onClick={() => handleShowPercentage(row.id)}>
                    Allocation val
                  </button>
                  <td>
                    {percentages[row.id] ? percentages[row.id] + "%" : "0%"}
                  </td>
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
