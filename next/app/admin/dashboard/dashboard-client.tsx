"use client";

import { useState, useMemo, useTransition, useCallback } from "react";
import {
  assignLeads,
  unassignLeads,
  updateLeadStatus,
  deleteLeads,
  addContactNote,
  deleteContactNote,
  clockIn,
  clockOut,
} from "@/actions/admin";
import { logoutAction } from "@/actions/auth";

// --------------- Types ---------------

interface Note {
  id: string;
  content: string;
  authorId: string;
  author: { id: string; name: string };
  createdAt: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  assignedToId: string | null;
  assignedTo: { id: string; name: string } | null;
  notes: Note[];
  createdAt: Date;
}

interface Operator {
  id: string;
  name: string;
  email: string;
  _count: { assignedLeads: number };
}

// --------------- Status helpers ---------------

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  NEW: { label: "New", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  CONTACTED: { label: "Contacted", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  QUALIFIED: { label: "Qualified", color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
  CONVERTED: { label: "Converted", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  LOST: { label: "Lost", color: "text-red-700", bg: "bg-red-50 border-red-200" },
};

const STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"];

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.NEW;
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

// --------------- Main component ---------------

export default function DashboardClient({
  leads: initialLeads,
  operators,
  role,
  userId,
  clockedIn: initialClockedIn,
  activeClockRecordId: _activeClockRecordId,
}: {
  leads: Lead[];
  operators: Operator[];
  role: string;
  userId: string;
  clockedIn: boolean;
  activeClockRecordId: string | null;
}) {
  const [leads, setLeads] = useState(initialLeads);
  const [activeTab, setActiveTab] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [openLead, setOpenLead] = useState<Lead | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Clock in/out state for operators
  const [isClockedIn, setIsClockedIn] = useState(initialClockedIn);
  const [clockLoading, setClockLoading] = useState(false);

  const isAdminView = role === "SUPER_ADMIN" || role === "ADMIN";
  const isOperator = role === "OPERATOR";

  // Filter leads by active tab
  const filteredLeads = useMemo(() => {
    if (activeTab === "all") return leads;
    if (activeTab === "unassigned") return leads.filter((l) => !l.assignedToId);
    return leads.filter((l) => l.assignedToId === activeTab);
  }, [leads, activeTab]);

  // Stats
  const stats = useMemo(() => ({
    total: leads.length,
    new: leads.filter((l) => l.status === "NEW").length,
    unassigned: leads.filter((l) => !l.assignedToId).length,
  }), [leads]);

  // Selection handlers
  const toggleSelect = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (selected.size === filteredLeads.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filteredLeads.map((l) => l.id)));
    }
  }, [selected.size, filteredLeads]);

  const clearSelection = useCallback(() => setSelected(new Set()), []);

  // Bulk assign
  function handleBulkAssign(operatorId: string) {
    const ids = Array.from(selected);
    startTransition(async () => {
      await assignLeads(ids, operatorId);
      setLeads((prev) =>
        prev.map((l) =>
          ids.includes(l.id)
            ? {
                ...l,
                assignedToId: operatorId,
                assignedTo: operators.find((o) => o.id === operatorId)
                  ? { id: operatorId, name: operators.find((o) => o.id === operatorId)!.name }
                  : null,
              }
            : l
        )
      );
      setSelected(new Set());
      setAssignOpen(false);
    });
  }

  function handleBulkUnassign() {
    const ids = Array.from(selected);
    startTransition(async () => {
      await unassignLeads(ids);
      setLeads((prev) =>
        prev.map((l) =>
          ids.includes(l.id) ? { ...l, assignedToId: null, assignedTo: null } : l
        )
      );
      setSelected(new Set());
    });
  }

  // Bulk delete
  function handleBulkDelete() {
    if (!confirm(`Delete ${selected.size} selected lead(s)? This cannot be undone.`)) return;
    const ids = Array.from(selected);
    startTransition(async () => {
      await deleteLeads(ids);
      setLeads((prev) => prev.filter((l) => !ids.includes(l.id)));
      setSelected(new Set());
    });
  }

  // Single lead assign (from detail sidebar)
  function handleAssignLead(leadId: string, operatorId: string | null) {
    startTransition(async () => {
      if (operatorId) {
        await assignLeads([leadId], operatorId);
        const op = operators.find((o) => o.id === operatorId);
        setLeads((prev) =>
          prev.map((l) =>
            l.id === leadId
              ? { ...l, assignedToId: operatorId, assignedTo: op ? { id: op.id, name: op.name } : null }
              : l
          )
        );
      } else {
        await unassignLeads([leadId]);
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, assignedToId: null, assignedTo: null } : l))
        );
      }
      // Update the open lead too
      if (openLead?.id === leadId) {
        setOpenLead((prev) => {
          if (!prev) return null;
          const op = operatorId ? operators.find((o) => o.id === operatorId) : null;
          return {
            ...prev,
            assignedToId: operatorId,
            assignedTo: op ? { id: op.id, name: op.name } : null,
          };
        });
      }
    });
  }

  // Status update
  function handleStatusUpdate(leadId: string, status: string) {
    startTransition(async () => {
      await updateLeadStatus(leadId, status);
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status } : l))
      );
      if (openLead?.id === leadId) {
        setOpenLead((prev) => (prev ? { ...prev, status } : null));
      }
    });
  }

  // Delete single lead
  function handleDeleteLead(leadId: string) {
    if (!confirm("Delete this lead? This cannot be undone.")) return;
    startTransition(async () => {
      await deleteLeads([leadId]);
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      setOpenLead(null);
    });
  }

  // Notes
  function handleAddNote(leadId: string, note: Note) {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, notes: [note, ...l.notes] } : l))
    );
    if (openLead?.id === leadId) {
      setOpenLead((prev) => prev ? { ...prev, notes: [note, ...prev.notes] } : null);
    }
  }

  function handleDeleteNote(leadId: string, noteId: string) {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, notes: l.notes.filter((n) => n.id !== noteId) } : l))
    );
    if (openLead?.id === leadId) {
      setOpenLead((prev) => prev ? { ...prev, notes: prev.notes.filter((n) => n.id !== noteId) } : null);
    }
  }

  // Clock in handler
  async function handleClockIn() {
    setClockLoading(true);
    try {
      let lat: number | undefined;
      let lng: number | undefined;
      if (navigator.geolocation) {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 })
          );
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
        } catch {
          // Location denied or unavailable — proceed without
        }
      }
      const result = await clockIn(lat, lng);
      if ("error" in result && result.error) {
        alert(result.error);
      } else {
        setIsClockedIn(true);
      }
    } finally {
      setClockLoading(false);
    }
  }

  // Clock out handler — also signs out
  async function handleClockOut() {
    if (!confirm("Clock out? This will also sign you out.")) return;
    setClockLoading(true);
    try {
      let lat: number | undefined;
      let lng: number | undefined;
      if (navigator.geolocation) {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 })
          );
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
        } catch {
          // proceed without location
        }
      }
      await clockOut(lat, lng);
      // Sign out
      await logoutAction();
    } catch {
      setClockLoading(false);
    }
  }

  // If operator is not clocked in, show clock-in gate
  if (isOperator && !isClockedIn) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-20">
        <div className="mx-auto max-w-sm text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#012340]/10">
            <svg className="h-10 w-10 text-[#012340]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#0a1628]">Clock In to Start</h2>
          <p className="mt-2 text-sm text-[#0a1628]/50">
            You need to clock in before you can access the dashboard. Your work hours and location will be recorded.
          </p>
          <button
            type="button"
            onClick={handleClockIn}
            disabled={clockLoading}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {clockLoading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Clocking in...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Clock In
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-[#e5e0d5] bg-white px-6 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#0a1628]">Leads</h1>
            <p className="mt-0.5 text-sm text-[#0a1628]/50">
              {isAdminView ? "Manage and assign contact leads" : "Your assigned leads"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Clock out button for operators */}
            {isOperator && isClockedIn && (
              <button
                type="button"
                onClick={handleClockOut}
                disabled={clockLoading}
                className="flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {clockLoading ? "..." : "Clock Out"}
              </button>
            )}
            <div className="flex items-center gap-1.5 rounded-lg bg-[#0a1628]/5 px-3 py-1.5 text-xs font-medium text-[#0a1628]/70">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
              {stats.new} new
            </div>
            {isAdminView && (
              <div className="flex items-center gap-1.5 rounded-lg bg-[#0a1628]/5 px-3 py-1.5 text-xs font-medium text-[#0a1628]/70">
                <span className="inline-block h-2 w-2 rounded-full bg-orange-400" />
                {stats.unassigned} unassigned
              </div>
            )}
            <div className="rounded-lg bg-[#012340] px-3 py-1.5 text-xs font-semibold text-white">
              {stats.total} total
            </div>
          </div>
        </div>

        {/* Operator tabs — admin/super admin only */}
        {isAdminView && operators.length > 0 && (
          <div className="mt-4 flex items-center gap-1 overflow-x-auto">
            <TabButton
              active={activeTab === "all"}
              onClick={() => { setActiveTab("all"); clearSelection(); }}
              label="All Leads"
              count={leads.length}
            />
            <TabButton
              active={activeTab === "unassigned"}
              onClick={() => { setActiveTab("unassigned"); clearSelection(); }}
              label="Unassigned"
              count={stats.unassigned}
            />
            {operators.map((op) => {
              const count = leads.filter((l) => l.assignedToId === op.id).length;
              return (
                <TabButton
                  key={op.id}
                  active={activeTab === op.id}
                  onClick={() => { setActiveTab(op.id); clearSelection(); }}
                  label={op.name}
                  count={count}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-6 py-4">
        {filteredLeads.length === 0 ? (
          <div className="flex h-60 flex-col items-center justify-center rounded-xl border border-dashed border-[#d1c7b1] text-[#0a1628]/40">
            <svg className="mb-2 h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25-2.25M12 13.875V7.5M3.75 7.5h16.5" />
            </svg>
            <p className="text-sm font-medium">No leads found</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-hidden rounded-xl border border-[#e5e0d5] bg-white md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#e5e0d5] bg-[#faf8f4]">
                    {isAdminView && (
                      <th className="w-10 px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.size === filteredLeads.length && filteredLeads.length > 0}
                          onChange={toggleAll}
                          className="h-4 w-4 rounded border-[#d1c7b1] accent-[#012340]"
                        />
                      </th>
                    )}
                    <th className="px-4 py-3 font-semibold text-[#0a1628]/70">Name</th>
                    <th className="px-4 py-3 font-semibold text-[#0a1628]/70">Email</th>
                    <th className="px-4 py-3 font-semibold text-[#0a1628]/70">Phone</th>
                    <th className="px-4 py-3 font-semibold text-[#0a1628]/70">Status</th>
                    {isAdminView && (
                      <th className="px-4 py-3 font-semibold text-[#0a1628]/70">Assigned to</th>
                    )}
                    <th className="px-4 py-3 font-semibold text-[#0a1628]/70">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => setOpenLead(lead)}
                      className={`cursor-pointer border-b border-[#e5e0d5]/60 transition last:border-0 hover:bg-[#faf8f4] ${
                        selected.has(lead.id) ? "bg-[#012340]/[0.03]" : ""
                      }`}
                    >
                      {isAdminView && (
                        <td className="w-10 px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selected.has(lead.id)}
                            onChange={() => toggleSelect(lead.id)}
                            className="h-4 w-4 rounded border-[#d1c7b1] accent-[#012340]"
                          />
                        </td>
                      )}
                      <td className="px-4 py-3 font-medium text-[#0a1628]">{lead.name}</td>
                      <td className="px-4 py-3 text-[#0a1628]/60">{lead.email}</td>
                      <td className="px-4 py-3 text-[#0a1628]/60">{lead.phone || "—"}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={lead.status} />
                      </td>
                      {isAdminView && (
                        <td className="px-4 py-3 text-[#0a1628]/60">
                          {lead.assignedTo ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0a1628]/5 px-2 py-0.5 text-xs font-medium text-[#0a1628]/80">
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              {lead.assignedTo.name}
                            </span>
                          ) : (
                            <span className="text-xs text-[#0a1628]/30">—</span>
                          )}
                        </td>
                      )}
                      <td className="whitespace-nowrap px-4 py-3 text-[#0a1628]/40 text-xs">
                        {new Date(lead.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="flex flex-col gap-2 md:hidden">
              {filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => setOpenLead(lead)}
                  className={`cursor-pointer rounded-xl border bg-white p-4 transition hover:shadow-sm ${
                    selected.has(lead.id) ? "border-[#012340]/30 bg-[#012340]/[0.02]" : "border-[#e5e0d5]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {isAdminView && (
                        <input
                          type="checkbox"
                          checked={selected.has(lead.id)}
                          onChange={(e) => { e.stopPropagation(); toggleSelect(lead.id); }}
                          onClick={(e) => e.stopPropagation()}
                          className="h-4 w-4 rounded border-[#d1c7b1] accent-[#012340]"
                        />
                      )}
                      <span className="font-semibold text-[#0a1628]">{lead.name}</span>
                    </div>
                    <StatusBadge status={lead.status} />
                  </div>
                  <p className="mt-1.5 text-sm text-[#0a1628]/60">{lead.email}</p>
                  <p className="mt-1 line-clamp-1 text-sm text-[#0a1628]/40">{lead.message}</p>
                  <div className="mt-2 flex items-center justify-between">
                    {isAdminView && lead.assignedTo ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0a1628]/5 px-2 py-0.5 text-xs font-medium text-[#0a1628]/70">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {lead.assignedTo.name}
                      </span>
                    ) : (
                      <span />
                    )}
                    <span className="text-xs text-[#0a1628]/30">
                      {new Date(lead.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bulk action bar */}
      {isAdminView && selected.size > 0 && (
        <div className="sticky bottom-0 left-0 right-0 flex items-center justify-center px-4 pb-4">
          <div className="flex items-center gap-3 rounded-full border border-[#e5e0d5] bg-white px-5 py-2.5 shadow-lg">
            <span className="text-sm font-medium text-[#0a1628]">
              {selected.size} selected
            </span>
            <div className="h-4 w-px bg-[#e5e0d5]" />
            <div className="relative">
              <button
                type="button"
                onClick={() => setAssignOpen(!assignOpen)}
                disabled={isPending}
                className="rounded-full bg-[#012340] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#012340]/90 disabled:opacity-50"
              >
                {isPending ? "Assigning..." : "Assign to"}
              </button>
              {assignOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-48 overflow-hidden rounded-xl border border-[#e5e0d5] bg-white py-1 shadow-xl">
                  {operators.map((op) => (
                    <button
                      key={op.id}
                      type="button"
                      onClick={() => handleBulkAssign(op.id)}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-[#0a1628] transition hover:bg-[#faf8f4]"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#012340]/10 text-[10px] font-bold text-[#012340]">
                        {op.name[0]}
                      </span>
                      {op.name}
                    </button>
                  ))}
                  {operators.length === 0 && (
                    <p className="px-4 py-3 text-xs text-[#0a1628]/40">No operators yet</p>
                  )}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleBulkUnassign}
              disabled={isPending}
              className="rounded-full border border-[#e5e0d5] px-4 py-1.5 text-xs font-medium text-[#0a1628]/60 transition hover:bg-[#faf8f4] disabled:opacity-50"
            >
              Unassign
            </button>
            <button
              type="button"
              onClick={handleBulkDelete}
              disabled={isPending}
              className="rounded-full border border-red-200 px-4 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={clearSelection}
              className="rounded-full px-3 py-1.5 text-xs font-medium text-[#0a1628]/40 transition hover:text-[#0a1628]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Lead detail slide-over */}
      {openLead && (
        <LeadDetailSidebar
          lead={openLead}
          operators={operators}
          isAdmin={isAdminView}
          isPending={isPending}
          userId={userId}
          role={role}
          onClose={() => setOpenLead(null)}
          onStatusUpdate={handleStatusUpdate}
          onAssign={handleAssignLead}
          onDelete={handleDeleteLead}
          onAddNote={handleAddNote}
          onDeleteNote={handleDeleteNote}
        />
      )}
    </div>
  );
}

// --------------- Tab button ---------------

function TabButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "bg-[#012340] text-white"
          : "text-[#0a1628]/50 hover:bg-[#0a1628]/5 hover:text-[#0a1628]"
      }`}
    >
      {label}
      <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
        active ? "bg-white/20 text-white" : "bg-[#0a1628]/5 text-[#0a1628]/40"
      }`}>
        {count}
      </span>
    </button>
  );
}

// --------------- Lead detail sidebar ---------------

function LeadDetailSidebar({
  lead,
  operators,
  isAdmin,
  isPending,
  userId,
  role,
  onClose,
  onStatusUpdate,
  onAssign,
  onDelete,
  onAddNote,
  onDeleteNote,
}: {
  lead: Lead;
  operators: Operator[];
  isAdmin: boolean;
  isPending: boolean;
  userId: string;
  role: string;
  onClose: () => void;
  onStatusUpdate: (leadId: string, status: string) => void;
  onAssign: (leadId: string, operatorId: string | null) => void;
  onDelete: (leadId: string) => void;
  onAddNote: (leadId: string, note: Note) => void;
  onDeleteNote: (leadId: string, noteId: string) => void;
}) {
  const [noteText, setNoteText] = useState("");
  const [noteLoading, setNoteLoading] = useState(false);

  async function handleSubmitNote() {
    if (!noteText.trim()) return;
    setNoteLoading(true);
    const result = await addContactNote(lead.id, noteText.trim());
    if ("note" in result && result.note) {
      onAddNote(lead.id, {
        ...result.note,
        createdAt: new Date(result.note.createdAt).toISOString(),
      });
      setNoteText("");
    }
    setNoteLoading(false);
  }

  async function handleRemoveNote(noteId: string) {
    if (!confirm("Delete this note?")) return;
    await deleteContactNote(noteId);
    onDeleteNote(lead.id, noteId);
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/30"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e5e0d5] px-6 py-4">
          <h2 className="text-base font-bold text-[#0a1628]">Lead Details</h2>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                type="button"
                onClick={() => onDelete(lead.id)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 transition hover:bg-red-50 hover:text-red-600"
                title="Delete lead"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#0a1628]/40 transition hover:bg-[#0a1628]/5 hover:text-[#0a1628]"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Contact info */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#012340]/10 text-lg font-bold text-[#012340]">
              {lead.name[0]?.toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0a1628]">{lead.name}</h3>
              <p className="text-sm text-[#0a1628]/50">{lead.email}</p>
            </div>
          </div>

          {lead.phone && (
            <div className="mt-4 flex items-center gap-2 text-sm text-[#0a1628]/70">
              <svg className="h-4 w-4 text-[#0a1628]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              {lead.phone}
            </div>
          )}

          {/* Message */}
          <div className="mt-6">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#0a1628]/40">
              Message
            </label>
            <div className="rounded-xl bg-[#faf8f4] p-4 text-sm leading-relaxed text-[#0a1628]/80">
              {lead.message}
            </div>
          </div>

          {/* Date */}
          <div className="mt-4 text-xs text-[#0a1628]/30">
            Submitted{" "}
            {new Date(lead.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>

          {/* Status */}
          <div className="mt-6">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#0a1628]/40">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => {
                const cfg = STATUS_CONFIG[s];
                const active = lead.status === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onStatusUpdate(lead.id, s)}
                    disabled={isPending || active}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                      active
                        ? `${cfg.bg} ${cfg.color}`
                        : "border-[#e5e0d5] text-[#0a1628]/40 hover:border-[#0a1628]/20 hover:text-[#0a1628]/60"
                    } disabled:cursor-default`}
                  >
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Assigned to — admin only */}
          {isAdmin && (
            <div className="mt-6">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#0a1628]/40">
                Assigned to
              </label>
              <select
                value={lead.assignedToId || ""}
                onChange={(e) => onAssign(lead.id, e.target.value || null)}
                disabled={isPending}
                className="h-10 w-full rounded-xl border border-[#e5e0d5] bg-white px-3 text-sm text-[#0a1628] outline-none transition focus:border-[#012340] focus:ring-2 focus:ring-[#012340]/10 disabled:opacity-50"
              >
                <option value="">Unassigned</option>
                {operators.map((op) => (
                  <option key={op.id} value={op.id}>
                    {op.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Notes section */}
          <div className="mt-6">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#0a1628]/40">
              Notes
            </label>

            {/* Add note form */}
            <div className="mb-4 flex gap-2">
              <input
                type="text"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmitNote(); } }}
                placeholder="Add a note..."
                className="h-9 flex-1 rounded-lg border border-[#e5e0d5] bg-white px-3 text-sm text-[#0a1628] outline-none transition focus:border-[#012340] focus:ring-2 focus:ring-[#012340]/10"
              />
              <button
                type="button"
                onClick={handleSubmitNote}
                disabled={noteLoading || !noteText.trim()}
                className="rounded-lg bg-[#012340] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#012340]/90 disabled:opacity-50"
              >
                {noteLoading ? "..." : "Add"}
              </button>
            </div>

            {/* Notes list */}
            {lead.notes && lead.notes.length > 0 ? (
              <div className="flex flex-col gap-2">
                {lead.notes.map((note) => (
                  <div
                    key={note.id}
                    className="group rounded-lg border border-[#e5e0d5]/60 bg-[#faf8f4] px-3 py-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-[#0a1628]/80">{note.content}</p>
                      {(note.authorId === userId || role === "SUPER_ADMIN" || role === "ADMIN") && (
                        <button
                          type="button"
                          onClick={() => handleRemoveNote(note.id)}
                          className="shrink-0 opacity-0 transition group-hover:opacity-100"
                          title="Delete note"
                        >
                          <svg className="h-3.5 w-3.5 text-red-400 hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-[#0a1628]/40">
                      <span>{note.author.name}</span>
                      <span>&middot;</span>
                      <span>
                        {new Date(note.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#0a1628]/30">No notes yet</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
