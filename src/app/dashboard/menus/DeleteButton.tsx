"use client";

import { Trash2 } from "lucide-react";

export default function DeleteButton({ id }: { id: string | number }) {
  return (
    <button 
      type="submit"
      className="inline-flex items-center text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-2 py-1.5 rounded-lg transition-colors"
      onClick={(e) => {
        if(!window.confirm('Yakin ingin menghapus menu ini?')) {
          e.preventDefault();
        }
      }}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
