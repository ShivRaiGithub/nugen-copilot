"use client";
import { motion } from "framer-motion";

export function EmptyState() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto flex max-w-2xl flex-col items-center px-4 pt-16 text-center">
      <h2 className="text-3xl font-semibold tracking-tight">What would you like to build with Nugen?</h2>
      <p className="mt-3 text-muted">Ask questions about APIs, deployment, alignment, agents, or workflows.</p>
    </motion.div>
  );
}
