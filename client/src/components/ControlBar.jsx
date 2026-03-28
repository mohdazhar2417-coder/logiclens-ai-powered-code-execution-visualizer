import { Pause, Play, RotateCcw, Save, SkipBack, SkipForward, Star } from "lucide-react";

function ControlButton({ icon: Icon, label, onClick, disabled, accent = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
        accent
          ? "bg-gradient-to-r from-amber-300 via-orange-300 to-violet-300 text-slate-950 hover:brightness-105"
          : "border border-violet-200/60 bg-white/55 text-slate-100 hover:bg-white/85"
      }`}
    >
      <Icon className="size-4" />
      {label}
    </button>
  );
}

function ControlBar({
  canPlay,
  isPlaying,
  onAnalyze,
  onPrev,
  onNext,
  onReset,
  onTogglePlay,
  onSave,
  onFavorite,
  saveDisabled,
  favoriteDisabled,
}) {
  return (
    <div className="rounded-[1.7rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.72),rgba(245,232,255,0.56))] p-4 shadow-[0_14px_36px_rgba(143,105,65,0.08)]">
      <div className="flex flex-wrap items-center gap-3">
      <ControlButton icon={Play} label="Analyze" onClick={onAnalyze} accent />
      <ControlButton icon={SkipBack} label="Prev" onClick={onPrev} disabled={!canPlay} />
      <ControlButton
        icon={isPlaying ? Pause : Play}
        label={isPlaying ? "Pause" : "Auto run"}
        onClick={onTogglePlay}
        disabled={!canPlay}
      />
      <ControlButton icon={SkipForward} label="Next" onClick={onNext} disabled={!canPlay} />
      <ControlButton icon={RotateCcw} label="Reset" onClick={onReset} disabled={!canPlay} />
      <div className="ml-auto flex flex-wrap gap-3">
        <ControlButton icon={Star} label="Favorite sample" onClick={onFavorite} disabled={favoriteDisabled} />
        <ControlButton icon={Save} label="Save trace" onClick={onSave} disabled={saveDisabled} />
      </div>
      </div>
    </div>
  );
}

export default ControlBar;
