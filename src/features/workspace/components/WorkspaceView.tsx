"use client";

import React, { useState } from "react";
import { useWorkspaceStore, Task, Note } from "@/store/workspaceStore";
import { useActivityStore } from "@/store/activityStore";
import { useToast } from "@/store/useToastStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  Plus,
  Trash2,
  Pin,
  ChevronRight,
} from "lucide-react";
import {
  DashboardCard,
  SearchBar,
  BottomSheet,
  ConfirmationDialog,
} from "@/components/shared";
import { AnimatePresence, motion } from "framer-motion";

export default function WorkspaceView() {
  const {
    tasks,
    notes,
    addTask,
    deleteTask,
    updateTaskStatus,
    addNote,
    updateNote,
    togglePinNote,
    deleteNote,
  } = useWorkspaceStore();
  const { addLog } = useActivityStore();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"tasks" | "notes" | "calendar">("tasks");

  const [newTaskText, setNewTaskText] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Search for tasks or notes

  const [isNoteSheetOpen, setIsNoteSheetOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteEditMode, setNoteEditMode] = useState<"write" | "preview">("write");

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isEventSheetOpen, setIsEventSheetOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [calendarEvents, setCalendarEvents] = useState<{ [day: number]: string[] }>({
    5: ["Supplier meeting with Ibu Sri"],
    12: ["Deploy shipping mini app sandbox"],
  });

  // Deletion state
  const [noteToDelete, setNoteToDelete] = useState<{ id: string; title: string } | null>(null);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    addTask(newTaskText);
    addLog("workspace", `Created task: "${newTaskText}"`);
    toast("Task Created", `"${newTaskText}" added to tasks`, "success");
    setNewTaskText("");
  };

  const handleCycleStatus = (id: string, text: string, current: Task["status"]) => {
    let nextStatus: Task["status"] = "todo";
    if (current === "todo") nextStatus = "in_progress";
    else if (current === "in_progress") nextStatus = "completed";

    updateTaskStatus(id, nextStatus);
    addLog("workspace", `Task "${text}" advanced to: ${nextStatus.toUpperCase()}`);
    toast("Status Updated", `Task advanced to ${nextStatus.replace("_", " ")}`, "success");
  };

  const handleOpenAddNote = () => {
    setEditingNote(null);
    setNoteTitle("");
    setNoteContent("");
    setNoteEditMode("write");
    setIsNoteSheetOpen(true);
  };

  const handleOpenEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteEditMode("write");
    setIsNoteSheetOpen(true);
  };

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) {
      toast("Error", "Please input note title", "error");
      return;
    }

    if (editingNote) {
      updateNote(editingNote.id, noteTitle, noteContent);
      addLog("workspace", `Updated note: "${noteTitle}"`);
      toast("Success", "Note updated successfully", "success");
    } else {
      addNote(noteTitle, noteContent);
      addLog("workspace", `Created note: "${noteTitle}"`);
      toast("Note Saved", `"${noteTitle}" added to Workspace`, "success");
    }

    setIsNoteSheetOpen(false);
  };

  const handleDeleteNoteTrigger = (id: string, title: string) => {
    setNoteToDelete({ id, title });
  };

  const handleDeleteNoteConfirm = () => {
    if (!noteToDelete) return;
    deleteNote(noteToDelete.id);
    addLog("workspace", `Deleted note: "${noteToDelete.title}"`);
    toast("Deleted", `Note "${noteToDelete.title}" removed`, "success");
    setNoteToDelete(null);
  };

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
    setEventTitle("");
    setIsEventSheetOpen(true);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || selectedDay === null) return;

    const current = calendarEvents[selectedDay] || [];
    setCalendarEvents({
      ...calendarEvents,
      [selectedDay]: [...current, eventTitle],
    });
    addLog("workspace", `Scheduled calendar event on July ${selectedDay}: "${eventTitle}"`);
    toast("Event Scheduled", `"${eventTitle}" added to July ${selectedDay}`, "success");
    setIsEventSheetOpen(false);
  };

  // Filter lists based on SearchBar query
  const filteredTasks = tasks.filter((t) =>
    t.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5 p-4 pb-28">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <div>
          <h2 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50">Workspace Hub</h2>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Manage personal notes writer, Kanban task boards, and schedules</p>
        </div>
        <Briefcase className="h-5 w-5 text-zinc-700 dark:text-zinc-300 animate-pulse" />
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 p-1 rounded-xl">
        {[
          { id: "tasks", label: "Tasks" },
          { id: "notes", label: "Notes Grid" },
          { id: "calendar", label: "Calendar" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setSearchQuery(""); // Clear search on tab switch
            }}
            className={cn(
              "text-[10px] font-bold py-1.5 rounded-lg uppercase tracking-wider transition-all",
              activeTab === tab.id
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm"
                : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* TAB 1: KANBAN TASKS */}
        {activeTab === "tasks" && (
          <motion.div
            key="tasks"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <form onSubmit={handleAddTask} className="flex gap-2">
              <Input
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Add task (e.g. buy spicy tempeh chips)..."
                className="text-xs border-zinc-200 dark:border-zinc-800 h-9.5"
              />
              <Button type="submit" className="h-9.5 text-xs font-bold px-3.5 shadow-sm rounded-lg shrink-0">
                <Plus className="h-4 w-4" />
              </Button>
            </form>

            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search tasks..."
            />

            <div className="space-y-3.5">
              <span className="text-[10px] font-bold text-zinc-555 dark:text-zinc-405 uppercase tracking-wider block px-0.5">
                Kanban Task Boards
              </span>

              <div className="grid grid-cols-1 gap-3.5">
                {(["todo", "in_progress", "completed"] as const).map((col) => {
                  const colTasks = filteredTasks.filter((t) => t.status === col);
                  const titleMap = { todo: "To Do", in_progress: "In Progress", completed: "Completed" };

                  return (
                    <DashboardCard
                      key={col}
                      title={
                        <span
                          className={cn(
                            "text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border",
                            col === "todo"
                              ? "bg-zinc-100 border-zinc-200 text-zinc-700 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300"
                              : col === "in_progress"
                              ? "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-400"
                              : "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-450"
                          )}
                        >
                          {titleMap[col]}
                        </span>
                      }
                      action={
                        <span className="text-[10px] text-zinc-400 font-mono font-bold">
                          {colTasks.length}
                        </span>
                      }
                      className="bg-zinc-50/20 dark:bg-zinc-950/30 p-4"
                    >
                      <div className="space-y-2 mt-2">
                        {colTasks.length === 0 ? (
                          <p className="text-[10px] text-zinc-400 dark:text-zinc-650 text-center py-3">
                            No tasks in this column
                          </p>
                        ) : (
                          colTasks.map((t) => (
                            <div
                              key={t.id}
                              className="p-2.5 bg-white border border-zinc-200 rounded-xl dark:bg-zinc-950 dark:border-zinc-850 shadow-sm flex items-center justify-between gap-3 text-xs"
                            >
                              <span className={cn("truncate min-w-0 font-medium text-zinc-850 dark:text-zinc-200", t.completed && "line-through text-zinc-400 dark:text-zinc-600")}>
                                {t.text}
                              </span>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {col !== "completed" && (
                                  <button
                                    onClick={() => handleCycleStatus(t.id, t.text, t.status)}
                                    className="p-1 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 text-primary transition-all flex items-center gap-0.5 text-[9px] font-bold"
                                  >
                                    <span>Next</span>
                                    <ChevronRight className="h-3 w-3" />
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteTask(t.id)}
                                  className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-550 transition-all"
                                  title="Delete Task"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </DashboardCard>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: NOTES LIBRARY */}
        {activeTab === "notes" && (
          <motion.div
            key="notes"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center px-0.5">
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Saved Notes Library ({filteredNotes.length})
              </span>
              <Button onClick={handleOpenAddNote} className="h-8.5 text-[10px] px-3 font-bold flex items-center gap-1 shadow-sm rounded-lg">
                <Plus className="h-3.5 w-3.5" />
                <span>Write Note</span>
              </Button>
            </div>

            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search notes..."
            />

            {filteredNotes.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-zinc-200 rounded-xl text-zinc-450 text-xs dark:border-zinc-800">
                No notes match search filters
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredNotes.map((note) => (
                  <DashboardCard
                    key={note.id}
                    onClick={() => handleOpenEditNote(note)}
                    interactive
                    title={note.title}
                    action={
                      note.isPinned && (
                        <Pin className="h-3.5 w-3.5 text-amber-500 fill-amber-500/10 shrink-0" />
                      )
                    }
                    className="min-h-[120px] flex flex-col justify-between p-4"
                  >
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-3 leading-relaxed whitespace-pre-wrap">
                      {note.content.replace(/[#*_-]/g, "")}
                    </p>

                    <div
                      className="flex justify-between items-center mt-3.5 border-t border-zinc-100 dark:border-zinc-900 pt-2 text-[9px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="text-zinc-400">Mod: {note.lastModified}</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => togglePinNote(note.id)}
                          className="p-1 rounded hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400"
                          title="Pin note"
                        >
                          <Pin className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteNoteTrigger(note.id, note.title)}
                          className="p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-550"
                          title="Delete note"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </DashboardCard>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 3: CALENDAR */}
        {activeTab === "calendar" && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="px-0.5">
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                Ecosystem Calendar Planner
              </span>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">Click a calendar date to schedule mock events.</p>
            </div>

            {/* Calendar composed in DashboardCard */}
            <DashboardCard title="July 2026">
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mb-2 mt-2">
                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
              </div>

              <div className="grid grid-cols-7 gap-1.5">
                <div /><div /><div />
                {Array.from({ length: 31 }, (_, i) => {
                  const day = i + 1;
                  const dayEvents = calendarEvents[day] || [];
                  const hasEvents = dayEvents.length > 0;

                  return (
                    <button
                      key={day}
                      onClick={() => handleSelectDay(day)}
                      className={cn(
                        "aspect-square rounded-lg flex flex-col justify-between p-1 transition-all select-none relative group border",
                        hasEvents
                          ? "bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-950 font-bold"
                          : "bg-transparent border-zinc-100 text-zinc-700 hover:border-zinc-400 dark:border-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700"
                      )}
                    >
                      <span className="text-[9px]">{day}</span>
                      {hasEvents && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 self-center absolute bottom-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </DashboardCard>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block px-0.5">
                Scheduled Events
              </span>
              {Object.entries(calendarEvents).map(([day, evts]) => (
                <div key={day} className="p-2.5 bg-white border border-zinc-200 rounded-xl flex items-start gap-3 shadow-sm dark:bg-zinc-950 dark:border-zinc-800">
                  <div className="p-2 bg-zinc-50 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 rounded-lg font-extrabold text-[11px] shrink-0 text-center min-w-[38px] border border-zinc-200 dark:border-zinc-800">
                    Jul {day}
                  </div>
                  <div className="space-y-1.5 pt-0.5">
                    {evts.map((e, idx) => (
                      <p key={idx} className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{e}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Write Note BottomSheet */}
      <BottomSheet
        isOpen={isNoteSheetOpen}
        onClose={() => setIsNoteSheetOpen(false)}
        title="Markdown Editor & Note Writer"
      >
        <form onSubmit={handleNoteSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-zinc-450 dark:text-zinc-550 uppercase">Note Title</label>
            <Input
              required
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="e.g. Suppliers Contact Sheet"
              className="h-9 text-xs border-zinc-200 dark:border-zinc-800"
            />
          </div>

          <div className="flex border-b border-zinc-150 pb-1 gap-4 mt-2">
            <button
              type="button"
              onClick={() => setNoteEditMode("write")}
              className={cn(
                "text-[10px] font-bold uppercase tracking-wider pb-1 border-b-2 transition-all",
                noteEditMode === "write"
                  ? "border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
                  : "border-transparent text-zinc-400"
              )}
            >
              Editor Pane
            </button>
            <button
              type="button"
              onClick={() => setNoteEditMode("preview")}
              className={cn(
                "text-[10px] font-bold uppercase tracking-wider pb-1 border-b-2 transition-all",
                noteEditMode === "preview"
                  ? "border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
                  : "border-transparent text-zinc-400"
              )}
            >
              Live Preview
            </button>
          </div>

          <div className="min-h-[160px] bg-zinc-50 border border-zinc-200 rounded-xl dark:bg-zinc-900 dark:border-zinc-800 p-2">
            {noteEditMode === "write" ? (
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="# Enter your markdown text here...&#10;- Bullet lists"
                rows={6}
                className="w-full text-xs p-1.5 bg-transparent font-mono leading-relaxed border-none outline-none focus:ring-0 resize-none text-zinc-800 dark:text-zinc-200"
              />
            ) : (
              <div className="p-2.5 text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap markdown-preview font-sans">
                {noteContent || <span className="text-zinc-400 font-mono">Empty content markdown</span>}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full h-9.5 text-xs font-bold shadow-sm rounded-lg">
            Save & Close Note
          </Button>
        </form>
      </BottomSheet>

      {/* Calendar event BottomSheet */}
      <BottomSheet
        isOpen={isEventSheetOpen}
        onClose={() => setIsEventSheetOpen(false)}
        title="Schedule Day Event"
      >
        <form onSubmit={handleAddEvent} className="space-y-3.5">
          <p className="text-[10px] text-zinc-500">
            Add appointment for **July {selectedDay}, 2026**
          </p>
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-zinc-450 dark:text-zinc-550 uppercase">Event Title</label>
            <Input
              required
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="e.g. Ship tempeh crisps to Andi"
              className="h-9 text-xs border-zinc-200 dark:border-zinc-800"
            />
          </div>
          <Button type="submit" className="w-full h-9.5 text-xs font-bold shadow-sm rounded-lg">
            Create Event Schedule
          </Button>
        </form>
      </BottomSheet>

      {/* Note delete ConfirmationDialog */}
      {noteToDelete && (
        <ConfirmationDialog
          isOpen={!!noteToDelete}
          onClose={() => setNoteToDelete(null)}
          title="Delete Personal Note"
          description={`Are you sure you want to delete "${noteToDelete.title}"? This note's content will be permanently lost.`}
          confirmLabel="Delete Note"
          type="danger"
          onConfirm={handleDeleteNoteConfirm}
        />
      )}
    </div>
  );
}
