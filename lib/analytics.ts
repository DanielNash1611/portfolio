export type AnalyticsEventProps = Record<string, unknown>;

export const track = (event: string, props: AnalyticsEventProps = {}): void => {
  if (process.env.NODE_ENV !== "production") {
    console.info("[analytics]", event, props);
  }
  // Placeholder: wire up real analytics provider when ready.
};
