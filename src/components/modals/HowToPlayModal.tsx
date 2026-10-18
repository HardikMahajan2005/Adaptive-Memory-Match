import { Brain, ShieldCheck, Zap, Layers, Sparkles } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { GlassButton } from '@/components/ui/GlassButton';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How to Play Adaptive Memory Match" maxWidth="lg">
      <div className="flex flex-col gap-4 text-xs sm:text-sm text-slate-300 dark:text-slate-300 light:text-slate-700 leading-relaxed">
        {/* Core Objective */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/10">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-cyan-400">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-semibold text-white dark:text-white light:text-slate-900 text-sm mb-1">
              Objective & Card Grid
            </h4>
            <p>
              Match all 8 unique pairs in a 4×4 grid of 16 frosted glass cards. Symbols include Heart, Star, Leaf, Moon, Sun, Diamond, Lightning, and Paper Plane.
            </p>
          </div>
        </div>

        {/* Move Rules & Interaction Lock */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/10">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-semibold text-white dark:text-white light:text-slate-900 text-sm mb-1">
              Moves & Input Safeguards
            </h4>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>1 Move = 1 Pair Attempt</strong> (flipping 2 cards). Revealing the first card does not consume a move.</li>
              <li>Clicking the same card twice or clicking already matched cards is safely ignored.</li>
              <li>During a mismatch, input is locked until the cards turn back over; rapid clicks are ignored.</li>
              <li>Restarting cleanly cancels all pending timers, guaranteeing that old games cannot interfere with new games.</li>
            </ul>
          </div>
        </div>

        {/* Adaptive Difficulty System */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/10">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-semibold text-white dark:text-white light:text-slate-900 text-sm mb-1">
              Adaptive Difficulty Engine
            </h4>
            <p className="mb-2">
              At the end of each round, the game engine evaluates your moves and time to adapt the next round:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-400/20">
                <span className="font-bold text-emerald-400 block mb-0.5">Strong (≤ 12 moves)</span>
                <span>Next difficulty increases (Easy → Medium → Hard)</span>
              </div>
              <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-400/20">
                <span className="font-bold text-sky-400 block mb-0.5">Moderate (13–20)</span>
                <span>Current difficulty is maintained</span>
              </div>
              <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-400/20">
                <span className="font-bold text-rose-400 block mb-0.5">Struggling (≥ 21)</span>
                <span>Difficulty decreases to practice (Hard → Medium → Easy)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Difficulty Parameters */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/10">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-semibold text-white dark:text-white light:text-slate-900 text-sm mb-1">
              Difficulty Levels
            </h4>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Easy:</strong> 2.5s opening memory preview + relaxed 1.2s mismatch reveal window.</li>
              <li><strong>Medium:</strong> 1.2s opening preview + 0.9s mismatch reveal window.</li>
              <li><strong>Hard:</strong> No opening preview + fast 0.65s mismatch reveal window.</li>
            </ul>
          </div>
        </div>

        {/* Keyboard & Accessibility */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/10">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-semibold text-white dark:text-white light:text-slate-900 text-sm mb-1">
              Accessibility & Keyboard Controls
            </h4>
            <p>
              Navigate cards using <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 font-mono text-[11px]">Tab</kbd>. Flip any focused card using <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 font-mono text-[11px]">Space</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 font-mono text-[11px]">Enter</kbd>. Close dialogs with <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 font-mono text-[11px]">Escape</kbd>.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <GlassButton variant="primary" fullWidth onClick={onClose}>
            Got it, Let's Play!
          </GlassButton>
        </div>
      </div>
    </Modal>
  );
};
