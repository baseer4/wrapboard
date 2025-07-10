"use client";

import { useEffect, useState } from "react";
import { X, Keyboard } from "lucide-react";
import { Button } from "./ui/button";

export const keybindings = [
  { keys: "/", action: "Focus message input" },
  { keys: "E", action: "Open emoji/reactions" },
  { keys: "Ctrl + C", action: "Copy" },
  { keys: "Ctrl + V", action: "Paste" },
  { keys: "Ctrl + X", action: "Cut" },
  { keys: "Delete / Backspace", action: "Delete" },
  { keys: "Ctrl + Z", action: "Undo" },
  { keys: "Ctrl + Y", action: "Redo" },
  { keys: "Ctrl + A", action: "Select All" },
  { keys: "Ctrl + S", action: "Save" },
  { keys: "Esc", action: "Close" },
];

export default function KeybindingsModal() {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleOpen = () => {
    setOpen(true);
    requestAnimationFrame(() => setShow(true));
  };

  const handleClose = () => {
    setShow(false);
    setTimeout(() => setOpen(false), 300);
  };

  return (
    <div>
      <h3 className="text-[10px] uppercase px-5 py-3">Show Keybindings</h3>
      <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={handleOpen}
            className="w-1/2 border border-primary-grey-100 bg-primary-black hover:bg-primary-green hover:text-primary-black flex items-center justify-center"
          >
            <Keyboard size={16} />
          </Button>
        </div>
    {open && (
      <div className="fixed top-0 left-0 w-screen h-screen bg-white/15 backdrop-blur-lg text-white flex items-center justify-center z-50">
        <div
          className={`pointer-events-auto w-[700px] h-[400px] bg-primary-black text-white rounded-xl shadow-xl p-6 flex flex-col transform transition-all duration-300 ease-in-out
            ${show ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
              >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Keyboard Shortcuts</h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-white">
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-3">
                {keybindings.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center px-4 py-2 bg-gray-800 rounded-md text-sm"
                  >
                    <span className="font-mono">{item.keys}</span>
                    <span className="text-gray-400">{item.action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
