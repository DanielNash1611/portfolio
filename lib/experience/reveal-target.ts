/** Reveal bookmarked content before measuring its position. Native details
 * remains the source of truth, including browser find-in-page and keyboard use. */
export function revealExperienceTarget(root: HTMLElement, hash: string) {
  if (!/^#experience-[a-z-]+$/.test(hash)) return null;
  const target = root.querySelector<HTMLElement>(hash);
  let ancestor = target?.parentElement;
  while (ancestor && ancestor !== root) {
    if (ancestor instanceof HTMLDetailsElement) ancestor.open = true;
    ancestor = ancestor.parentElement;
  }
  return target;
}
