"use client";

import React from "react";
import MaximusKningtChat from "@/components/ui/maximus-kningt-chat";

export default function DemoPage() {
  return (
    <main className="min-h-screen w-full bg-black text-white">
      {/* Chat Component */}
      <section className="flex justify-center items-start w-full">
        <MaximusKningtChat />
      </section>

      {/* Footer */}
      <footer className="text-center text-neutral-500 py-2 mt-10 border-t border-neutral-800 text-sm">
        © {new Date().getFullYear()} Maximus Kningt Demo Page
      </footer>
    </main>
  );
}
