/** Resume jobs and remote career search are separate server-side contracts. */
export function isRemoteCareerEvidenceEnabled(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return (
    env.PORTFOLIO_GUIDE_CAREER_EVIDENCE_ENABLED?.trim().toLowerCase() === "true"
  );
}
