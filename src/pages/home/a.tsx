/* eslint-disable no-duplicate-imports */
/* eslint-disable max-lines */
/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { AgGridReact } from "ag-grid-react";
import Domo from "ryuu.js";
import { useDispatch, useSelector } from "react-redux";
import { staffReqmtListRequest } from "@/redux/domo/staff-data/actions";
import { RootState } from "@/redux/store";
import toast from "react-hot-toast";
import Papa from "papaparse";
import { MdArrowDropDown } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";
import { GridApi } from "ag-grid-community";
// import { AgGridReact } from "ag-grid-react";
import { FaAngleDown } from "react-icons/fa6";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

//  ADD THESE 2 LINES
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

const team_OPTIONS = ["Blue", "Purple", "Orange", "Pink", "Yellow", "Events", "Other"];
const reasons_OPTIONS = [
  "In ClientMajic, not posted",
  "Not invoiced",
  "Incorrect confirmation",
  "Incorrect cost",
  "Incorrect name on card",
  "Other",
];

const LoadingSpinner = () => (
  <div className="flex justify-center mb-5 mt-14">
    <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-[#212e62]"></div>
  </div>
);

/* ---------------- Simple Modal Component ---------------- */
const ConfirmModal: React.FC<{
  open: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}> = ({ open, title = "Confirm", message, onConfirm, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} aria-hidden />
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full p-6 z-10">
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        <p className="text-sm text-gray-700 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-[#2e8576] hover:bg-[#2e8576] text-white"
          >
            YES
          </button>
        </div>
      </div>
    </div>
  );
};

const RecordsFetch: React.FC = () => {
  const dispatch = useDispatch();
  const { data: reduxData, loading } = useSelector((state: RootState) => state.staffReqmtList);
  console.log(reduxData, "reduxData-------");
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [dataId, setDataId] = useState<any[]>([]);
  const [finalData, setFinalData] = useState<any[]>([]);
  const [finalDataOne, setFinalDataOne] = useState<any[]>([]);
  const [onlyNames, setOnlyNames] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showEditable, setShowEditable] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [updatedCount, setUpdatedCount] = useState(0);
  const [updatedRows, setUpdatedRows] = useState<any[]>([]);
  const [pendingRows, setPendingRows] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("PENDING");
  const [columnSearchText, setColumnSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"Amex" | "Airplus">("Amex");

  const [value, setValue] = useState("");
  const editableCols: any = ["invoiceId", "description", "team", "reasons", "Name"];
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const gridRef = useRef<any>(null);
  const editedRowIdsRef = useRef<Set<string>>(new Set());
  const originalDataRef = useRef<any[] | null>(null);
  const rowKey = (r: any) => `${r.row_number}__${r.upload_datetime}__${r.filename}__${r.sub_name}`;
  const isRowSaved = (row: any) => {
    const key = `${row.row_number}__${row.upload_datetime}__${row.filename}__${row.sub_name}`;
    return dataId.some(
      (r) => `${r.row_number}__${r.upload_datetime}__${r.filename}__${r.sub_name}` === key,
    );
  };
  const fetchDatasetSavedRows = async () => {
    try {
      const res: any = await Domo.get(`/data/v1/modifiedData`);
      setDataId(res); // loaded from backend

      setDataId((prev) => {
        const updated = [...prev];
        const key = (r: any) =>
          `${r.row_number}__${r.upload_datetime}__${r.filename}__${r.sub_name}`;

        // Only merge rows that were actually saved (res)
        res.forEach((row: any) => {
          const rowKey = key(row);
          const index = updated.findIndex((r) => key(r) === rowKey);
          if (index !== -1) updated[index] = row;
          else updated.push(row);
        });

        return updated;
      });

      console.log(res, "res------");
      return res;
    } catch (err) {
      console.error("Dataset fetch failed", err);
      return [];
    }
  };
  useEffect(() => {
    fetchDatasetSavedRows();
  }, []);

  useEffect(() => {
    const fetchDatasetSaved = async () => {
      try {
        const query = `SELECT Name FROM "Consultant Details" `;
        const nameDropdown: any = await Domo.post(`/data/v1/consultant`, {
          sql: query,
        });
        const cleaned =
          nameDropdown?.map((r: any) => ({
            original: String(r.Name).trim(),
            key: String(r.Name).trim().toLowerCase(),
          })) || [];

        const uniqueNames = [...new Map(cleaned.map((x: any) => [x.key, x.original])).values()];

        setOnlyNames(uniqueNames);

        return nameDropdown;
      } catch (err) {
        console.error("Dataset fetch failed", err);
        return [];
      }
    };
    fetchDatasetSaved();
  }, []);
  useEffect(() => {
    dispatch(staffReqmtListRequest());
  }, [dispatch]);

  useEffect(() => {
    if (!Array.isArray(reduxData) || !Array.isArray(dataId)) return;
    if (reduxData.length === 0) return;

    const editableCols: any = ["invoiceId", "description", "team", "reasons", "Name"];
    const normalize = (v: any) => Number(v);

    const dataIdMap = new Map(dataId.map((row: any) => [normalize(row.row_number), row]));
    const mergedData: any[] = [];

    reduxData.forEach((row: any) => {
      const rowNum = normalize(row.row_number);
      const savedRow = dataIdMap.get(rowNum);

      if (savedRow) {
        const mergedRow: any = { ...row, ...savedRow };

        editableCols.forEach((col: any) => {
          if (savedRow[col] !== undefined && savedRow[col] !== null) {
            mergedRow[col] = savedRow[col];
          }
        });

        mergedData.push(mergedRow);
      } else {
        mergedData.push({ ...row });
      }
    });

    dataId.forEach((row: any) => {
      const rowNum = normalize(row.row_number);

      if (!reduxData.find((r) => normalize(r.row_number) === rowNum)) {
        const hasValue = editableCols.some(
          (col: any) =>
            row[col] !== undefined && row[col] !== null && row[col].toString().trim() !== "",
        );

        if (hasValue) mergedData.push({ ...row });
      }
    });

    // 🔥 Fallback logic added
    const finalOutput = mergedData.length > 0 ? mergedData : reduxData;

    setFinalData([...finalOutput]); // force refresh for AgGrid
    originalDataRef.current = JSON.parse(JSON.stringify(finalOutput));
  }, [reduxData, dataId]);

  const handleInputChange = useCallback((rowMeta: any, field: any, value: any) => {
    setFinalData((prev) => {
      const updated = prev.map((row) =>
        row.row_number === rowMeta.row_number &&
        row.upload_datetime === rowMeta.upload_datetime &&
        row.filename === rowMeta.filename &&
        row.sub_name === rowMeta.sub_name
          ? { ...row, [field]: value }
          : row,
      );

      if (originalDataRef.current) {
        const orig = originalDataRef.current.find(
          (r) =>
            r.row_number === rowMeta.row_number &&
            r.upload_datetime === rowMeta.upload_datetime &&
            r.filename === rowMeta.filename &&
            r.sub_name === rowMeta.sub_name,
        );

        const origVal = orig ? orig[field] ?? "" : "";

        if ((value ?? "").trim() !== (origVal ?? "").trim()) {
          editedRowIdsRef.current.add(JSON.stringify(rowMeta));
        } else {
          editedRowIdsRef.current.delete(JSON.stringify(rowMeta));
        }
      }

      return updated;
    });
  }, []);

  const handleSubmitClick = () => {
    setError("");
    const editedCount = editedRowIdsRef.current.size;
    if (editedCount > 0) {
      setModalMessage(
        `You have modified ${editedCount} row(s). Do you want to save these changes?`,
      );
    } else {
      setModalMessage("No fields were modified. Do you want to submit anyway?");
    }
    setIsModalOpen(true);
  };
  const refreshTable = () => {
    gridRef.current?.api.refreshClientSideRowModel("everything");
    gridRef.current?.api.redrawRows();
  };

  const handleConfirmSave = async () => {
    const idteam = "cbc63671-a11a-4680-8ae3-9b0dd7a68934"; // ★ TEAM DATASET
    const removableCols = ["invoiceId", "description", "team", "reasons", "Name"];
    setIsModalOpen(false);

    try {
      setError("");
      setIsSaving(true);
      toast.loading("Saving data...");

      if (!finalData || finalData.length === 0) {
        toast.dismiss();
        setError("No data to upload!");
        setIsSaving(false);
        return;
      }

      // -----------------------------------------
      //  ORIGINAL MAIN DATASET LOGIC (UNCHANGED)
      // -----------------------------------------

      const dataColumns = Object.keys(reduxData[0] || {}).filter(
        (col) => !removableCols.includes(col),
      );

      const extraColumns = ["invoiceId", "description", "team", "reasons", "Name"];
      const DATASET_SCHEMA_ORDER = [...dataColumns, ...extraColumns];

      const cleanedData = finalData.map((row) => {
        const orderedRow: any = {};
        DATASET_SCHEMA_ORDER.forEach((col) => {
          orderedRow[col] =
            typeof row[col] === "string" ? row[col].replace(/[\r\n]+/g, " ") : row[col] ?? "";
        });
        return orderedRow;
      });

      const csv = Papa.unparse({
        fields: DATASET_SCHEMA_ORDER,
        data: cleanedData.map((row) => DATASET_SCHEMA_ORDER.map((col) => row[col])),
      });

      const datasetId = "8a8f1f7c-8a34-4495-844b-aba35cbd84ee";

      const isAllKeyFieldsEmpty = cleanedData.every((row) =>
        extraColumns.every((col) => !row[col] || row[col].toString().trim() === ""),
      );

      if (isAllKeyFieldsEmpty) {
        await Domo.post("/domo/codeengine/v2/packages/append", {
          dataset: datasetId,
          rows: csv.split("\n").slice(1),
          delimiter: ",",
        });
        toast.success("Data appended successfully!");
      } else {
        await Domo.post("/domo/codeengine/v2/packages/replace", {
          datasetId,
          rows: csv.split("\n").slice(1),
        });
        toast.success("Data replaced successfully!");
      }

      // -----------------------------------------
      // ★ NEW REQUIREMENT: TEAM GROUPING LOGIC
      // -----------------------------------------

      // Group finalData by team and count
      const teamCounts: any = {};

      finalData.forEach((row) => {
        const team = row.team?.trim() || "Unknown";
        teamCounts[team] = (teamCounts[team] || 0) + 1;
      });

      const teamSummaryArray = Object.entries(teamCounts).map(([team, count]) => ({
        Team: team,
        Ticket_Count: count,
      }));

      // Convert to CSV (Team, Ticket_Count)
      const teamCSV = Papa.unparse({
        fields: ["Team", "Ticket_Count"],
        data: teamSummaryArray.map((r) => [r.Team, r.Ticket_Count]),
      });

      // Append or Replace using same condition logic
      if (isAllKeyFieldsEmpty) {
        await Domo.post("/domo/codeengine/v2/packages/append", {
          dataset: idteam,
          rows: teamCSV.split("\n").slice(1),
        });
        toast.success("Team data appended!");
      } else {
        await Domo.post("/domo/codeengine/v2/packages/replace", {
          datasetId: idteam,
          rows: teamCSV.split("\n").slice(1),
        });
        toast.success("Team data replaced!");
      }
      // ★★★ IMPORTANT: refresh dataId from backend immediately after save
      await fetchDatasetSavedRows();
      setTimeout(() => {
        dispatch(staffReqmtListRequest());
      }, 150);
      // -----------------------------------------

      // Reset tracking
      originalDataRef.current = finalData.map((r) => ({ ...r }));
      editedRowIdsRef.current = new Set();

      toast.success("Saved & table refreshed!");
      toast.dismiss();
    } catch (err) {
      console.error(" Upload error:", err);
      setError("Upload failed. Check console.");
      toast.dismiss();

      toast.error("Upload failed.");
      refreshTable();
    } finally {
      setIsSaving(false);
      toast.dismiss();
    }
  };

  const columnDefs: any = useMemo(() => {
    if (!reduxData || reduxData.length === 0) return [];

    const removableCols = ["invoiceId", "description", "team", "reasons", "Name"];

    const SearchableDropdownEditor = forwardRef((props: any, ref) => {
      const [value, setValue] = useState(props.value || "");
      const [filter, setFilter] = useState("");
      const [open, setOpen] = useState(true); // always open for AG Grid popup
      const wrapperRef = useRef<HTMLDivElement>(null);

      const options: string[] = props.values || [];
      const filteredOptions = options.filter((opt) =>
        opt.toLowerCase().includes(filter.toLowerCase()),
      );

      // AG Grid required methods
      useImperativeHandle(ref, () => ({
        getValue: () => value,
        isPopup: () => true,
        isCancelBeforeStart: () => false,
      }));

      // close popup if clicked outside
      useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
            props.stopEditing(); // tell AG Grid to stop editing
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
      }, [props]);

      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#fff",
            border: "1px solid #d1d5db",
            borderRadius: 4,
            width: "100%",
            minWidth: 120,
            boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
            fontSize: 13,
          }}
        >
          {/* Search box */}
          <input
            autoFocus
            placeholder="Search..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: "6px 8px",
              borderBottom: "1px solid #eee",
              outline: "none",
            }}
          />

          {/* Options */}
          <div style={{ maxHeight: 150, overflowY: "auto" }}>
            {filteredOptions.map((opt) => (
              <div
                key={opt}
                onClick={() => {
                  setValue(opt);
                  props.stopEditing(); // close editor
                }}
                style={{
                  padding: "6px 8px",
                  cursor: "pointer",
                  backgroundColor: value === opt ? "#f3f4f6" : "#fff",
                }}
              >
                {opt}
              </div>
            ))}
            {filteredOptions.length === 0 && (
              <div style={{ padding: "6px 8px", color: "#999" }}>No options</div>
            )}
          </div>
        </div>
      );
    });

    const baseColumns = Object.keys(reduxData[0] || {})
      .filter((col) => !removableCols.includes(col))
      .map((col) => ({
        field: col,
        headerName: col,
        sortable: true,
        resizable: true,
        minWidth: 150,

        editable: false,

        //  FIX: ALWAYS TREAT AS TEXT, no number conversion!
        // valueFormatter: (params: any) => (params.value ?? "").toString(),
        valueFormatter: (params: any) => {
          if (params.value == null || params.value === "") return "";

          const val = Number(params.value);

          if (isNaN(val)) return params.value; // fallback to original

          // Check if number has more than 2 decimal digits
          const decimalPart = val.toString().split(".")[1];
          if (decimalPart && decimalPart.length > 2) {
            return val.toFixed(2); // round to 2 decimal places
          }

          // Otherwise, show as integer if it's whole, or original value
          return val % 1 === 0 ? val.toString() : val.toString();
        },
        cellStyle: { fontSize: "13px" },
      }));

    const DropdownCellRenderer = (props: any) => {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "100%",
            width: "100%",
            padding: "0 10px",
            boxSizing: "border-box",
          }}
        >
          {/* Selected value */}
          <span
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            {props.value || ""}
          </span>

          {/* Dropdown arrow */}
          <span
            style={{
              width: 24,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ▾
          </span>
        </div>
      );
    };

    const TextInputCellRenderer = (props: any) => {
      const hasValue = props.value !== null && props.value !== undefined && props.value !== "";

      return (
        <div
          style={{
            display: "flex",
            alignItems: "center", // 🔑 vertical center
            justifyContent: "space-between",
            height: "100%",
            width: "100%",
            padding: "0 10px",
            boxSizing: "border-box",
          }}
        >
          {/* Left text */}
          <div
            style={{
              flex: 1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "flex",
              alignItems: "center",
            }}
          >
            {hasValue ? props.value : ""}
          </div>

          {/* Right icon (same alignment as dropdown arrow) */}
          {!hasValue && (
            <div
              style={{
                width: 24,
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.5,
              }}
            >
              <FaEdit size={13} />
            </div>
          )}
        </div>
      );
    };

    const editableColumns = [
      {
        field: "invoiceId",
        headerName: "Invoice Id",
        editable: true,

        sortable: true,
        resizable: true,
        minWidth: 150,
        cellRenderer: TextInputCellRenderer,
        cellStyle: { textAlign: "left", fontSize: "13px", backgroundColor: "#f3f4f6" },
        onCellValueChanged: (params: any) =>
          handleInputChange(
            {
              row_number: params.data.row_number,
              upload_datetime: params.data.upload_datetime,
              filename: params.data.filename,
              sub_name: params.data.sub_name,
            },
            "invoiceId",
            params.newValue,
          ),
      },
      {
        field: "description",
        headerName: "Description",

        sortable: true,
        resizable: true,
        editable: true,
        minWidth: 200,
        cellRenderer: TextInputCellRenderer,
        cellStyle: {
          fontSize: "13px",

          backgroundColor: "#f3f4f6",
        },
        onCellValueChanged: (params: any) =>
          handleInputChange(
            {
              row_number: params.data.row_number,
              upload_datetime: params.data.upload_datetime,
              filename: params.data.filename,
              sub_name: params.data.sub_name,
            },
            "description",
            params.newValue,
          ),
      },

      {
        field: "team",
        headerName: "team",
        editable: true,
        singleClickEdit: true,
        minWidth: 200,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: ["Select", ...team_OPTIONS] },
        cellRenderer: DropdownCellRenderer,
        valueFormatter: (params: { value: any }) => params.value || "Select",
        onCellValueChanged: (params: any) =>
          handleInputChange(
            {
              row_number: params.data.row_number,
              upload_datetime: params.data.upload_datetime,
              filename: params.data.filename,
              sub_name: params.data.sub_name,
            },
            "team",
            params.newValue,
          ),
        cellStyle: {
          fontSize: "13px",
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
          backgroundColor: "#f3f4f6",
        },
      },

      {
        field: "reasons",
        headerName: "Reasons",
        editable: true,

        singleClickEdit: true,
        minWidth: 200,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: ["Select", ...reasons_OPTIONS] },
        cellRenderer: DropdownCellRenderer,
        valueFormatter: (params: { value: any }) => params.value || "Select",
        onCellValueChanged: (params: any) =>
          handleInputChange(
            {
              row_number: params.data.row_number,
              upload_datetime: params.data.upload_datetime,
              filename: params.data.filename,
              sub_name: params.data.sub_name,
            },
            "reasons",
            params.newValue,
          ),
        cellStyle: {
          fontSize: "13px",
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
          backgroundColor: "#f3f4f6",
        },
      },

      {
        field: "Name",
        headerName: "Name",
        editable: true,

        singleClickEdit: true,
        minWidth: 200,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: ["Select", ...onlyNames] },
        cellRenderer: DropdownCellRenderer,
        valueFormatter: (params: { value: any }) => params.value || "Select",
        onCellValueChanged: (params: any) =>
          handleInputChange(
            {
              row_number: params.data.row_number,
              upload_datetime: params.data.upload_datetime,
              filename: params.data.filename,
              sub_name: params.data.sub_name,
            },
            "Name",
            params.newValue,
          ),
        cellStyle: {
          fontSize: "13px",
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
          backgroundColor: "#f3f4f6",
        },
      },
    ];

    return [...baseColumns, ...editableColumns];
  }, [reduxData, onlyNames, handleInputChange]);

  const isColumnFiltering = columnSearchText.trim().length > 0;

  const defaultColDef = useMemo(() => {
    const def: any = {
      minWidth: 120,
      filter: true,
      sortable: true,
      resizable: true,
    };
    if (!isColumnFiltering) def.flex = 1; // only set flex when not filtering
    return def;
  }, [isColumnFiltering]);

  const visibleRows = useMemo(() => {
    const editableCols = ["invoiceId", "description", "team", "reasons", "Name"];

    if (!Array.isArray(dataId)) return [];

    const updatedRows: any[] = [];
    const pendingRows: any[] = [];

    dataId.forEach((row) => {
      const hasValue = editableCols.some((col) => row[col] && row[col].toString().trim() !== "");

      if (hasValue) updatedRows.push(row);
      else pendingRows.push(row);
    });

    //  Update counts properly
    setPendingCount(pendingRows.length);
    setUpdatedCount(updatedRows.length);

    console.log(updatedCount, "fhg");
    console.log(pendingCount, "ghj");
    // Return rows based on toggle
    return showEditable ? updatedRows : pendingRows;
  }, [dataId, showEditable]);

  useEffect(() => {
    // If reduxData is not ready yet → stop
    if (!Array.isArray(reduxData)) return;

    // If dataId is not ready yet → also stop
    if (dataId !== null && dataId !== undefined && !Array.isArray(dataId)) return;

    if (!Array.isArray(dataId) || dataId.length === 0) {
      const merged = reduxData;
      setFinalData(merged);
      setUpdatedRows([]);
      setPendingRows(merged);
      return;
    }

    const key = (r: any) => `${r.row_number}__${r.upload_datetime}__${r.filename}__${r.sub_name}`;

    const dataIdMap = new Map(dataId.map((r) => [key(r), r]));
    const merged: any[] = [];

    for (const row of reduxData) {
      const k = key(row);
      if (dataIdMap.has(k)) {
        merged.push({ ...row, ...dataIdMap.get(k) });
        dataIdMap.delete(k);
      } else {
        merged.push(row);
      }
    }

    merged.push(...dataIdMap.values());

    setFinalData(merged);

    const updated = merged.filter((row) => editableCols.some((c: any) => row[c] && row[c] !== ""));

    const pending = merged.filter((row) => !editableCols.some((c: any) => row[c] && row[c] !== ""));

    setUpdatedRows(updated);
    setPendingRows(pending);
  }, [reduxData, dataId]);

  const safePendingRows = Array.isArray(pendingRows) ? pendingRows : [];
  const safeUpdatedRows = Array.isArray(updatedRows) ? updatedRows : [];
  const safeReduxData = Array.isArray(reduxData) ? reduxData : [];
  const safeDataId = Array.isArray(dataId) ? dataId : [];

  let totalRecords = 0;
  let pendingTabCount = 0;
  let updatedTabCount = 0;

  // Case 1 → dataId empty
  if (safeDataId.length === 0) {
    totalRecords = safeReduxData.length;
    pendingTabCount = safeReduxData.length;
    updatedTabCount = 0;
  }
  // Case 2 → dataId has records
  else {
    totalRecords = safePendingRows.length + safeUpdatedRows.length;
    pendingTabCount = safePendingRows.length;
    updatedTabCount = safeUpdatedRows.length;
  }
  const removableCols: any = ["invoiceId", "description", "team", "reasons", "Name"];
  useEffect(() => {
    const countRowsWithValue = dataId.filter((row) =>
      removableCols.some((col: any) => row[col] != null && row[col].toString().trim() !== ""),
    ).length;

    console.log(countRowsWithValue, "ertyuhi-----------");
  }, [dataId]);

  const totalRecordss = Array.isArray(reduxData) ? reduxData.length : 0;
  console.log("Total Records:", totalRecordss);

  // If pending = total records - updated records:
  const pending = totalRecordss - updatedTabCount;
  console.log("Pending:", pending);

  console.log(finalData, "asdfgh");

  console.log(data, "ddata");
  // console.log(visibleRows, "visibleRows-----------------");
  console.log(reduxData, "reduxData");
  console.log(dataId, "daatID");

  console.log(finalData, "finalData");
  const systemFields = useMemo(() => {
    if (!reduxData || reduxData.length === 0) return new Set<string>();

    return new Set(
      Object.keys(reduxData[0]).filter(
        (key) =>
          !key.startsWith("Amex_") && !key.startsWith("Airplus_") && !key.startsWith("Type_"),
      ),
    );
  }, [reduxData]);

const filteredColumnDefs = useMemo(() => {
  const search = columnSearchText.toLowerCase().trim();
  const categoryPrefix = `${selectedCategory}_`;

  const editableCols = ["invoiceId", "description", "team", "reasons", "Name"];

  return columnDefs.filter((col: any) => {
    const header = (col.headerName || "").toLowerCase();
    const field = col.field || "";

    const isSystemColumn = systemFields.has(field);
    const isCategoryColumn = field.startsWith(categoryPrefix);
    const isEditableColumn = editableCols.includes(field);
    const matchesSearch = search === "" || header.includes(search);

    return (isSystemColumn || isCategoryColumn || isEditableColumn) && matchesSearch;
  });
}, [columnDefs, selectedCategory, columnSearchText, systemFields]);


  const onGridReady = (params: any) => {
    setGridApi(params.api);
  };

  const clearAllFilters = () => {
    if (!gridApi) return;

    gridApi.setFilterModel(null);
    gridApi.setGridOption("quickFilterText", ""); // ✅ v31 way
    setColumnSearchText("");
  };

  console.log(reduxData, "reduxData");
  const filteredRowData = useMemo(() => {
    if (!finalData || finalData.length === 0) return [];

    const typeKey = `Type_${selectedCategory}`;

    return finalData.filter((row: any) => row[typeKey] === selectedCategory);
  }, [finalData, selectedCategory]);

  return (
    <div className="">
      <div className="max-w-[95vw] mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* HEADER */}
        <div className="border border-gray-200 px-6 py-4 flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold text-black">Amex Records Management</h1>

            {/* Toggle Button */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showEditable}
                onChange={() => setShowEditable((prev) => !prev)}
                className="sr-only peer"
              />
              <div className="flex gap-4 items-center">
                <button
                  onClick={() => setActiveTab("PENDING")}
                  className={`px-4 py-2 rounded-xl ${
                    activeTab === "PENDING" ? "bg-[#212e62] text-white" : "bg-gray-200"
                  }`}
                >
                  Pending ({pending})
                </button>

                <button
                  onClick={() => setActiveTab("UPDATED")}
                  className={`px-4 py-2 rounded-xl ${
                    activeTab === "UPDATED" ? "bg-[#212e62] text-white" : "bg-gray-200"
                  }`}
                >
                  Updated ({updatedTabCount})
                </button>
              </div>
            </label>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <div>
              Total Records: <span className="font-bold text-[#212e62]">{totalRecordss}</span>
            </div>

            <button
              onClick={handleSubmitClick}
              disabled={isSaving}
              className="bg-[#212e62] hover:bg-[#212e62] rounded-xl text-white px-6 py-2.5 font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-xl"
            >
              {isSaving ? "Submitting..." : "Submit Changes"}
            </button>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          </div>
        )}
        <span className="text-sm text-red-500 flex items-center text-center py-1 mt-2 justify-center">
          Save your edits — only saved rows move to Updated records. Unsaved changes will be lost,
          even if you refresh.
        </span>
        {/* LOADING */}

        <div className="p-4 flex items-center gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center justify-center w-12 bg-[#212e62] text-white rounded-l-xl border border-gray-400">
              <FiSearch size={18} />
            </span>

            <input
              className="w-full h-10 pl-14 pr-4 border border-gray-300 rounded-xl text-gray-600 placeholder-gray-400 focus:outline-none"
              placeholder="Search Header name..."
              value={columnSearchText}
              onChange={(e) => {
                const value = e.target.value;
                setColumnSearchText(value);

                if (gridApi) {
                  gridApi.setGridOption("quickFilterText", value);
                }
              }}
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative w-40">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as "Amex" | "Airplus")}
              className="w-full h-10 appearance-none border border-gray-300 rounded-xl px-3 pr-9 text-sm focus:outline-none bg-white"
            >
              <option value="Amex">Amex</option>
              <option value="Airplus">Airplus</option>
            </select>

            {/* Dropdown Icon */}
            {/* <span className="pointer-events-none absoluteleft-4 flex items-center text-gray-500">
              <FaAngleDown size={14} />
            </span> */}
          </div>

          {/* Clear Filter Button */}
          <button
            className="h-10 bg-[#1976d2] text-white px-4 text-sm font-medium rounded-xl shadow hover:bg-[#125a9c] transition"
            onClick={clearAllFilters}
          >
            Clear All Filter
          </button>
        </div>

        {loading && <LoadingSpinner />}
        {/* AG GRID TABLE */}
        {!loading && finalData && finalData.length > 0 && (
          <div className="p-4">
            <div
              className="ag-theme-alpine rounded-xl overflow-hidden shadow-lg"
              style={{ height: "550px", width: "100%", padding: "10px" }}
            >
              <AgGridReact
                ref={gridRef}
                // rowData={activeTab === "PENDING" ? pendingRows : updatedRows}
                rowData={filteredRowData}
                columnDefs={filteredColumnDefs}
                animateRows={true}
                pagination={true}
                paginationPageSize={100}
                suppressHorizontalScroll={false}
                enableBrowserTooltips={true}
                suppressMovableColumns={false}
                rowSelection="multiple"
                theme="legacy"
                defaultColDef={defaultColDef}
                enableCellTextSelection={true}
                cellSelection={true}
                onGridReady={onGridReady}
              />
            </div>
          </div>
        )}

        {!loading && finalData && finalData.length === 0 && (
          <div className="text-center text-gray-500 py-20">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="text-lg font-medium">No records found in dataset.</p>
          </div>
        )}
      </div>

      {/* Confirm modal */}
      <ConfirmModal
        open={isModalOpen}
        title="Save Confirmation"
        message={modalMessage}
        onConfirm={handleConfirmSave}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default RecordsFetch;
function isRowEdited(_row: any): boolean {
  throw new Error("Function not implemented.");
}
