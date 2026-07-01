"use client";

import React, { useState } from "react";
import { useWorkspaceStore, Task, Note } from "@/store/workspaceStore";
import { useActivityStore } from "@/store/activityStore";
import { useToast } from "@/store/useToastStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  Plus,
  Trash2,
  Pin,
  ChevronRight,
  X,
} from "lucide-react";

// Custom Dialog component
const CustomDialog = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-sm"
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black z-50 transition-opacity"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: "-40%", x: "-50%" }}
          animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
          exit={{ opacity: 0, scale: 0.95, y: "-40%", x: "-50%" }}
          transition={{ duration: 0.2 }}
          className={cn("fixed top-1/2 left-1/2 bg-surface rounded-xl border border-text-muted/10 shadow-high z-50 p-5 w-[90%]", maxWidth)}
        >
          <div className="flex justify-between items-center border-b border-text-muted/10 pb-3 mb-4">
            <span className="text-xs font-bold text-text-primary uppercase tracking-wider">{title}</span>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-primary/10 text-text-muted">
              <X className="h-4 w-4" />
            </button>
          </div>
          {children}
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default function WorkspaceView() {
  const { tasks, notes, addTask, toggleTask, deleteTask, updateTaskStatus, addNote, updateNote, togglePinNote, deleteNote } = useWorkspaceStore();
  const { addLog } = useActivityStore();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"tasks" | "notes" | "calendar">("tasks");

  const [newTaskText, setNewTaskText] = useState("");
  const [taskFilter, setTaskFilter] = useState<"all" | "todo" | "completed">("all");

  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteEditMode, setNoteEditMode] = useState<"write" | "preview">("write");

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [calendarEvents, setCalendarEvents] = useState<{ [day: number]: string[] }>({
    5: ["Supplier meeting with Ibu Sri"],
    12: ["Deploy shipping mini app sandbox"]
  });

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
    setIsNoteDialogOpen(true);
  };

  const handleOpenEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteEditMode("write");
    setIsNoteDialogOpen(true);
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

    setIsNoteDialogOpen(false);
  };

  const handleDeleteNote = (id: string, title: string) => {
    if (confirm(`Delete note "${title}"?`)) {
      deleteNote(id);
      addLog("workspace", `Deleted note: "${title}"`);
      toast("Deleted", `Note "${title}" removed`, "success");
    }
  };

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
    setEventTitle("");
    setIsEventDialogOpen(true);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || selectedDay === null) return;
    const current = calendarEvents[selectedDay] || [];
    setCalendarEvents({
      ...calendarEvents,
      [selectedDay]: [...current, eventTitle]
    });
    addLog("workspace", `Scheduled calendar event on July ${selectedDay}: "${eventTitle}"`);
    toast("Event Scheduled", `"${eventTitle}" added to July ${selectedDay}`, "success");
    setIsEventDialogOpen(false);
  };



  return (
    <div className="flex flex-col gap-5 p-4 pb-28 bg-background">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-text-muted/10 pb-3">
        <div>
          <h2 className="font-heading text-lg font-bold text-text-primary">Workspace Hub</h2>
          <p className="text-[11px] text-text-muted">Manage personal notes writer, Kanban task boards, and schedules</p>
        </div>
        <Briefcase className="h-5 w-5 text-primary animate-pulse" />
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1 bg-surface border border-text-muted/10 p-1 rounded-lg">
        {[
          { id: "tasks", label: "Tasks" },
          { id: "notes", label: "Notes Grid" },
          { id: "calendar", label: "Calendar" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "text-[10px] font-bold py-1.5 rounded-md uppercase tracking-wider transition-all",
              activeTab === tab.id
                ? "bg-primary text-white shadow-low"
                : "text-text-muted hover:bg-primary/5"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        
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
                className="text-xs border-text-muted/15 h-9.5"
              />
              <Button type="submit" className="h-9.5 text-xs font-bold px-3.5 shadow-low shrink-0">
                <Plus className="h-4 w-4" />
              </Button>
            </form>

            <div className="space-y-3.5">
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider block px-0.5">
                Kanban Task Boards
              </span>

              <div className="grid grid-cols-1 gap-3.5">
                {(["todo", "in_progress", "completed"] as const).map((col) => {
                  const colTasks = tasks.filter((t) => t.status === col);
                  const titleMap = { todo: "To Do", in_progress: "In Progress", completed: "Completed" };
                  
                  return (
                    <Card key={col} className="border border-text-muted/15 bg-surface/50 shadow-low">
                      <CardContent className="p-3 space-y-2">
                        <div className="flex justify-between items-center border-b border-text-muted/5 pb-1.5 mb-1.5">
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded",
                            col === "todo" ? "bg-text-muted/15 text-text-primary" : col === "in_progress" ? "bg-secondary/15 text-secondary" : "bg-success/15 text-success"
                          )}>
                            {titleMap[col]}
                          </span>
                          <span className="text-[10px] text-text-muted font-mono">{colTasks.length}</span>
                        </div>

                        {colTasks.length === 0 ? (
                          <p className="text-[10px] text-text-muted/50 text-center py-2">No tasks in column</p>
                        ) : (
                          <div className="space-y-2">
                            {colTasks.map((t) => (
                              <div
                                key={t.id}
                                className="p-2.5 bg-surface border border-text-muted/10 rounded-md shadow-low flex items-center justify-between gap-3 text-xs"
                              >
                                <span className={cn("truncate min-w-0 font-medium", t.completed && "line-through text-text-muted")}>
                                  {t.text}
                                </span>
                                
                                <div className="flex items-center gap-1.5 shrink-0">
                                  {col !== "completed" && (
                                    <button
                                      onClick={() => handleCycleStatus(t.id, t.text, t.status)}
                                      className="p-1 rounded hover:bg-primary/10 text-primary transition-all flex items-center gap-0.5 text-[9px] font-bold"
                                    >
                                      <span>Next</span>
                                      <ChevronRight className="h-3 w-3" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => deleteTask(t.id)}
                                    className="p-1 rounded hover:bg-secondary/10 text-secondary transition-all"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "notes" && (
          <motion.div
            key="notes"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center px-0.5">
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Saved Notes Library
              </span>
              <Button onClick={handleOpenAddNote} className="h-8.5 text-[10px] px-3 font-bold flex items-center gap-1 shadow-low">
                <Plus className="h-3.5 w-3.5" />
                <span>Write Note</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {notes.map((note) => (
                <Card
                  key={note.id}
                  onClick={() => handleOpenEditNote(note)}
                  className="border border-text-muted/15 shadow-low bg-surface hover:border-primary/20 transition-all p-3.5 min-h-[120px] flex flex-col justify-between cursor-pointer relative"
                >
                  {note.isPinned && (
                    <Pin className="absolute right-3.5 top-3.5 h-3.5 w-3.5 text-secondary shrink-0" />
                  )}
                  <div className="space-y-1.5 pr-6 min-w-0">
                    <h4 className="font-bold text-xs text-text-primary truncate">{note.title}</h4>
                    <p className="text-[10px] text-text-muted line-clamp-3 leading-relaxed whitespace-pre-wrap">
                      {note.content.replace(/[#*_-]/g, "")}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-3.5 border-t border-text-muted/5 pt-2">
                    <span className="text-[9px] text-text-muted/60">Mod: {note.lastModified}</span>
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => togglePinNote(note.id)}
                        className="p-1 rounded hover:bg-secondary/10 text-secondary"
                      >
                        <Pin className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id, note.title)}
                        className="p-1 rounded hover:bg-secondary/10 text-secondary"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "calendar" && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="px-0.5">
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider block">
                Ecosystem Calendar Planner
              </span>
              <p className="text-[10px] text-text-muted mt-0.5">Click a calendar date to schedule mock events.</p>
            </div>

            <Card className="border border-text-muted/15 shadow-low bg-surface">
              <CardContent className="p-4">
                <div className="flex items-center justify-between border-b border-text-muted/10 pb-2 mb-3">
                  <span className="font-bold text-xs text-text-primary">July 2026</span>
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-text-muted mb-2">
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
                          "aspect-square rounded flex flex-col justify-between p-1 transition-all select-none relative group",
                          hasEvents
                            ? "bg-primary/10 border border-primary/20 text-primary font-bold"
                            : "bg-background border border-text-muted/5 text-text-primary hover:border-primary/20"
                        )}
                      >
                        <span className="text-[9px]">{day}</span>
                        {hasEvents && (
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary self-center absolute bottom-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block px-0.5">
                Scheduled Events
              </span>
              {Object.entries(calendarEvents).map(([day, evts]) => (
                <div key={day} className="p-2.5 bg-surface border border-text-muted/10 rounded-lg flex items-start gap-3 shadow-low">
                  <div className="p-2 bg-secondary/10 text-secondary rounded font-extrabold text-[11px] shrink-0 text-center min-w-[36px]">
                    Jul {day}
                  </div>
                  <div className="space-y-1">
                    {evts.map((e, idx) => (
                      <p key={idx} className="text-xs font-semibold text-text-primary">{e}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Note dialog */}
      <CustomDialog onClose={() => setIsNoteDialogOpen(false)} title="Markdown Editor & Note Writer" isOpen={isNoteDialogOpen} maxWidth="max-w-md">
        <form onSubmit={handleNoteSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-text-muted uppercase">Note Title</label>
            <Input
              required
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="e.g. Suppliers Contact Sheet"
              className="h-9 text-xs border-text-muted/15"
            />
          </div>

          <div className="flex border-b border-text-muted/10 pb-1 gap-4">
            <button
              type="button"
              onClick={() => setNoteEditMode("write")}
              className={cn(
                "text-[10px] font-bold uppercase tracking-wider pb-1 border-b-2 transition-all",
                noteEditMode === "write" ? "border-primary text-primary" : "border-transparent text-text-muted"
              )}
            >
              Editor Pane
            </button>
            <button
              type="button"
              onClick={() => setNoteEditMode("preview")}
              className={cn(
                "text-[10px] font-bold uppercase tracking-wider pb-1 border-b-2 transition-all",
                noteEditMode === "preview" ? "border-primary text-primary" : "border-transparent text-text-muted"
              )}
            >
              Live Preview
            </button>
          </div>

          <div className="min-h-[160px] bg-background border border-text-muted/10 rounded-md">
            {noteEditMode === "write" ? (
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="# Enter your markdown text here...&#10;- Bullet lists"
                rows={6}
                className="w-full text-xs p-2.5 bg-transparent font-mono leading-relaxed border-none outline-none focus:ring-0 resize-none text-text-primary"
              />
            ) : (
              <div className="p-3 text-xs text-text-primary leading-relaxed whitespace-pre-wrap markdown-preview font-sans">
                {noteContent || <span className="text-text-muted/40 font-mono">Empty content markdown</span>}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full h-9.5 text-xs font-bold shadow-low">
            Save & Close Note
          </Button>
        </form>
      </CustomDialog>

      {/* Calendar add event dialog */}
      <CustomDialog onClose={() => setIsEventDialogOpen(false)} title="Schedule Day Event" isOpen={isEventDialogOpen}>
        <form onSubmit={handleAddEvent} className="space-y-3.5">
          <p className="text-[10px] text-text-muted">
            Add appointment for **July {selectedDay}, 2026**
          </p>
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-text-muted uppercase">Event Title</label>
            <Input
              required
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="e.g. Ship tempeh crisps to Andi"
              className="h-9 text-xs border-text-muted/15"
            />
          </div>
          <Button type="submit" className="w-full h-9.5 text-xs font-bold shadow-low">
            Create Event Schedule
          </Button>
        </form>
      </CustomDialog>

    </div>
  );
}
