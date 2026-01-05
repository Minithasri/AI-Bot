/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect, useRef } from "react";

const Search = (props: any) => {
  const { value, options } = props;
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(options || []);
  const [selected, setSelected] = useState(value);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // AG Grid requires this to return selected value
  props.api.stopEditing = () => {
    props.api.stopEditing();
  };

  // Close editor when clicking outside
  useEffect(() => {
    function handleClickOutside(e: any) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        props.stopEditing();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter list on typing
  useEffect(() => {
    if (!search) {
      setFiltered(options);
    } else {
      setFiltered(options.filter((o: string) => o.toLowerCase().includes(search.toLowerCase())));
    }
  }, [search, options]);

  // AG Grid → return final selected value
  const getValue = () => selected;

  // AG Grid calls this
  props.getValue = getValue;

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        background: "white",
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "4px",
      }}
    >
      <input
        autoFocus
        value={search}
        placeholder="Search…"
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "6px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          marginBottom: "6px",
        }}
      />
      <div
        style={{
          maxHeight: "150px",
          overflowY: "auto",
          border: "1px solid #eee",
          borderRadius: "4px",
        }}
      >
        {filtered.map((item: string) => (
          <div
            key={item}
            onClick={() => {
              setSelected(item);
              props.stopEditing(); // closes editor and saves value
            }}
            style={{
              padding: "8px",
              cursor: "pointer",
              background: selected === item ? "#eaeaea" : "white",
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
