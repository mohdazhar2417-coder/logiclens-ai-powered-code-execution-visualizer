import { Pause, Play, RotateCcw, Save, SkipBack, SkipForward, Star } from "lucide-react";

function ControlButton({ icon: Icon, label, onClick, disabled, accent = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
        accent ? "bg-amber-400 text-slate-950 hover:bg-amber-300" : "border border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
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
    <div className="panel flex flex-wrap items-center gap-3">
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
  );
}

export default ControlBar;
