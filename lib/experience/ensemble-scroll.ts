export function ensembleFrame(progress: number) {
  const p = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
  const t = Math.max(0, Math.min(1, (p - 0.06) / 0.68));
  const alignment = t * t * (3 - 2 * t);
  return {
    progress: p,
    alignment,
    phase: p * Math.PI * 8,
    baton: -35 * alignment + Math.sin(p * Math.PI * 6) * 16,
  };
}

export function canPinEnsemble(viewport: number, content: number, top: number) {
  return (
    [viewport, content, top].every(Number.isFinite) &&
    viewport >= 600 &&
    content > 0 &&
    content + top + 8 <= viewport
  );
}
