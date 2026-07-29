export const HOMEPAGE_LOOK_QUERY_PARAM = "look";

export const HOMEPAGE_LOOK_FLAGS = {
  studio: {
    enabled: true,
    queryValue: "studio",
    label: "Studio",
  },
  score: {
    enabled: true,
    queryValue: "score",
    label: "Score",
  },
} as const;

export type HomepageLook = "classic" | keyof typeof HOMEPAGE_LOOK_FLAGS;

export function resolveHomepageLook(
  value: string | string[] | undefined,
): HomepageLook {
  const candidate = Array.isArray(value) ? value[0] : value;

  if (
    candidate === HOMEPAGE_LOOK_FLAGS.studio.queryValue &&
    HOMEPAGE_LOOK_FLAGS.studio.enabled
  ) {
    return "studio";
  }

  if (
    candidate === HOMEPAGE_LOOK_FLAGS.score.queryValue &&
    HOMEPAGE_LOOK_FLAGS.score.enabled
  ) {
    return "score";
  }

  return "classic";
}
