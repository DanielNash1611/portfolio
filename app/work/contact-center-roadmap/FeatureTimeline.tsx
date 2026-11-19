import styles from "./roadmap.module.css";

const periods = [
  { short: "Q2 ’24", label: "Q2 2024" },
  { short: "Q3 ’24", label: "Q3 2024" },
  { short: "Q4 ’24", label: "Q4 2024" },
  { short: "Q1 ’25", label: "Q1 2025" },
  { short: "Q2 ’25", label: "Q2 2025" },
];

const features = [
  { label: "Einstein Email", detail: "Outlook activity capture", period: 0 },
  { label: "Connect UPS.com", period: 0 },
  { label: "Salesforce Texting", period: 1 },
  { label: "Einstein Case Classification", period: 2 },
  { label: "Next Best Action", period: 3 },
  { label: "Einstein Copilot Sales", period: 4 },
];

export default function FeatureTimeline() {
  return (
    <figure
      className={styles.featureTimeline}
      data-case-reveal
      id="feature-timeline"
    >
      <h3 className={styles.timelineHeading}>
        The feature timeline I showed first
      </h3>
      <table className={styles.timeline}>
        <caption className="sr-only">
          Selected proposed features and planning windows
        </caption>
        <thead>
          <tr>
            <th scope="col">Feature</th>
            {periods.map(({ short, label }) => (
              <th key={label} scope="col">
                <span className="sr-only">{label}</span>
                <span aria-hidden="true">{short}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map(({ label, detail, period }, row) => (
            <tr key={label}>
              <th scope="row">
                {label}
                {detail && <small>{detail}</small>}
              </th>
              {periods.map(({ label: window }, index) => (
                <td key={window}>
                  {index === period && (
                    <>
                      <span className="sr-only">Planned for {window}</span>
                      <span
                        aria-hidden="true"
                        className={styles.timelineBar}
                        style={{ animationDelay: `${row * 55}ms` }}
                      />
                    </>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <figcaption className={styles.caption}>
        Reconstructed from Daniel’s recollection and the archived feature
        timeline (Contact Center Roadmap, slide 36). The windows are plans shown
        in the archived deck.
      </figcaption>
    </figure>
  );
}
