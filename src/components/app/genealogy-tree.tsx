"use client";

import { useState } from "react";
import { initialOf } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import type { GenealogyPerson } from "@/lib/api/types";

function TreeNode({ person }: { person: GenealogyPerson }) {
  return (
    <li>
      <div className={`tree-person${person.active ? "" : " tree-person-inactive"}`}>
        <span aria-hidden="true">{initialOf(person.name)}</span>
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
        <ButtonGroup>
          <Button variant="icon" aria-label="Zoom out" disabled={zoom <= 0.4} onClick={() => setZoom((value) => Math.max(0.4, value - 0.1))}>
            −
          </Button>
          <span aria-live="polite">{Math.round(zoom * 100)}%</span>
          <Button variant="icon" aria-label="Zoom in" disabled={zoom >= 1.6} onClick={() => setZoom((value) => Math.min(1.6, value + 0.1))}>
            +
          </Button>
        </ButtonGroup>
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
