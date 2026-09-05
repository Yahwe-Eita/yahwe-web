"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { GenealogyPerson } from "@/lib/api/types";

function TreeNode({ person }: { person: GenealogyPerson }) {
  const children = person.recruits ?? [];
  return (
    <li>
      <div className="tree-person">
        <span>{person.name.charAt(0).toUpperCase()}</span>
        <strong>{person.name.split("(")[0].trim().split(" ")[0]}</strong>
      </div>
      {children.length ? (
        <ul>
          {children.map((child, index) => (
            <TreeNode person={child} key={child.id ?? child.userId ?? `${child.name}-${index}`} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function GenealogyTree({ root }: { root: GenealogyPerson }) {
  const [scale, setScale] = useState(1);
  return (
    <section className="tree-panel">
      <div className="tree-toolbar">
        <div className="button-row">
          <button
            className="icon-button"
            type="button"
            aria-label="Zoom in"
            onClick={() => setScale((value) => Math.min(1.6, value + 0.1))}
          >
            +
          </button>
          <button
            className="icon-button"
            type="button"
            aria-label="Zoom out"
            onClick={() => setScale((value) => Math.max(0.4, value - 0.1))}
          >
            −
          </button>
        </div>
      </div>
      <div className="tree-scroll">
        <motion.div className="tree" animate={{ scale }}>
          <ul><TreeNode person={root} /></ul>
        </motion.div>
      </div>
    </section>
  );
}
