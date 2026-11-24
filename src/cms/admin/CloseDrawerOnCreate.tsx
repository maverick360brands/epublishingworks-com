"use client";

import { useDocumentDrawerContext, useDocumentInfo, useModal } from "@payloadcms/ui";
import { useEffect, useRef } from "react";

// When an author (or book) is created from the "Add new" drawer on another form, close the
// drawer as soon as it saves, so the editor lands back on the form they were filling in,
// with the new item already selected. Outside a drawer this renders nothing and does nothing.
export function CloseDrawerOnCreate() {
  const { drawerSlug } = useDocumentDrawerContext();
  const { id } = useDocumentInfo();
  const { closeModal } = useModal();
  const createdHere = useRef(id === undefined || id === null);

  useEffect(() => {
    if (drawerSlug && createdHere.current && id !== undefined && id !== null) {
      createdHere.current = false;
      closeModal(drawerSlug);
    }
  }, [drawerSlug, id, closeModal]);

  return null;
}
