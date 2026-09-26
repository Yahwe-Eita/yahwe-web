"use client";

import { useState } from "react";
import type { GenealogyPerson } from "@/lib/api/types";

function TreeNode({ person }: { person: GenealogyPerson }) {
  return (
    <li>
      <div className={`tree-person${person.active ? "" : " tree-person-inactive"}`}>
        <span aria-hidden="true">{person.name.charAt(0).toUpperCase()}</span>
        <strong>{person.name}</strong>
      </div>
      {person.recruits.length ? (
        <ul>
          {person.recruits.map((child) => (
            <TreeNode person={child} key={child.id} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function GenealogyTree({ root }: { root: GenealogyPerson }) {
  const [zoom, setZoom] = useState(1);
  return (
    <section className="tree-panel" aria-label="Genealogy tree">
      <div className="tree-toolbar">
        <div className="button-row">
          <button className="icon-button" type="button" aria-label="Zoom out" disabled={zoom <= 0.4} onClick={() => setZoom((value) => Math.max(0.4, value - 0.1))}>
            −
          </button>
          <span aria-live="polite">{Math.round(zoom * 100)}%</span>
          <button className="icon-button" type="button" aria-label="Zoom in" disabled={zoom >= 1.6} onClick={() => setZoom((value) => Math.min(1.6, value + 0.1))}>
            +
          </button>
        </div>
      </div>
      <div className="tree-scroll">
        <div className="tree" style={{ zoom }}>
          <ul>
            <TreeNode person={root} />
          </ul>
        </div>
      </div>
    </section>
  );
}
