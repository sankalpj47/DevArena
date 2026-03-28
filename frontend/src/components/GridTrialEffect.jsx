import { useEffect, useMemo, useRef, useState } from "react";

export default function GridTrailEffect({ rows = 20, cols = 35, radius = 2 }) {
  const [activeSet, setActiveSet] = useState(new Set());
  const cellSizeRef = useRef({ w: 0, h: 0 });
  const rafRef = useRef(null);
  const timeoutsRef = useRef(new Map());

  useEffect(() => {
    const calc = () => {
      cellSizeRef.current = {
        w: window.innerWidth / cols,
        h: window.innerHeight / rows,
      };
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [cols, rows]);

  useEffect(() => {
    const onMove = (e) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const { clientX: x, clientY: y } = e;
        const { w, h } = cellSizeRef.current;
        if (!w || !h) return;

        const col = Math.floor(x / w);
        const row = Math.floor(y / h);

        const newCells = new Set();
        for (let r = row - radius; r <= row + radius; r++) {
          for (let c = col - radius; c <= col + radius; c++) {
            if (r >= 0 && c >= 0 && r < rows && c < cols) {
              const idx = r * cols + c;
              const dist = Math.hypot(r - row, c - col);

              if (dist <= radius + 0.5) {
                newCells.add(idx);

                if (timeoutsRef.current.has(idx)) {
                  clearTimeout(timeoutsRef.current.get(idx));
                }

                const timeout = setTimeout(() => {
                  setActiveSet((prev) => {
                    const next = new Set(prev);
                    next.delete(idx);
                    return next;
                  });
                  timeoutsRef.current.delete(idx);
                }, 600);

                timeoutsRef.current.set(idx, timeout);
              }
            }
          }
        }

        setActiveSet((prev) => new Set([...prev, ...newCells]));
      });
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      timeoutsRef.current.clear();
    };
  }, [cols, rows, radius]);

  const cells = useMemo(() => Array.from({ length: rows * cols }), [rows, cols]);

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: -1, 
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        backgroundColor: "#00000",
      }}
    >
      {cells.map((_, i) => {
        const isActive = activeSet.has(i);
        return (
          <div
            key={i}
            className="w-full h-full transition-all duration-300 ease-out"
            style={{
              border: "1px solid",
              borderColor: isActive
                ? "rgba(139, 92, 246, 0.6)"
                : "rgba(139, 92, 246, 0.10)",
              boxSizing: "border-box",
            }}
          />
        );
      })}
    </div>
  );
}