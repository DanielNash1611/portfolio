import {
  AbsoluteFill,
  CanvasImage,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
/** A frame-driven working-method illustration, not a trace of a live AI run. */
export function PortfolioFilm({ compact = false }: { compact?: boolean }) {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const tall = compact || height > width;
  const sec = frame / fps;
  const progress = interpolate(sec, [0, 7.7], [0, 4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#142f33",
        color: "#f3eee4",
        fontFamily: "var(--font-sans, Manrope),Arial,sans-serif",
        overflow: "hidden",
      }}
    >
      <Interactive.Div
        name="Working method caption"
        style={{
          position: "absolute",
          top: height * 0.08,
          left: width * 0.07,
          fontSize: tall ? 27 : 29,
          letterSpacing: 4,
        }}
      >
        DANIEL NASH / FROM OPPORTUNITY TO ADOPTION
      </Interactive.Div>
      <Interactive.Div
        name="One evolving product artifact"
        style={{
          position: "absolute",
          left: width * (tall ? 0.12 : 0.52),
          top: height * (tall ? 0.37 : 0.21),
          width: width * (tall ? 0.76 : 0.4),
          height: height * 0.48,
          backgroundColor: "#f3eee4",
          color: "#142733",
          borderRadius: interpolate(sec, [0, 2.3, 4], [2, 2, 20], {
            extrapolateRight: "clamp",
          }),
          rotate: `${interpolate(sec, [0, 2, 4, 6, 8], [-9, -3, 0, 0, 0])}deg`,
          scale: interpolate(sec, [0, 2, 4, 6, 8], [0.8, 0.93, 1, 1, 0.94]),
        }}
      >
        <Interactive.Div
          name="Opportunity notes"
          style={{
            position: "absolute",
            inset: width * 0.035,
            opacity: interpolate(sec, [0, 1.4, 2.8], [1, 1, 0], {
              extrapolateRight: "clamp",
            }),
            translate: `0 ${interpolate(sec, [0, 2.8], [0, -70])}px`,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-serif, Georgia),serif",
              fontSize: tall ? 50 : 48,
              lineHeight: 1.1,
            }}
          >
            Where is
            <br />
            the friction?
          </div>
          <div
            style={{
              height: 3,
              backgroundColor: "#db6048",
              marginTop: 30,
              width: "75%",
            }}
          />
          <div
            style={{
              height: 3,
              backgroundColor: "#14273330",
              marginTop: 22,
              width: "90%",
            }}
          />
          <div
            style={{
              height: 3,
              backgroundColor: "#14273330",
              marginTop: 22,
              width: "60%",
            }}
          />
        </Interactive.Div>
        <Interactive.Div
          name="Direction becomes a prototype"
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            opacity: interpolate(sec, [1.6, 2.8, 5.3, 6.1], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            clipPath: `inset(${interpolate(sec, [1.8, 3.3], [70, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}% 0 0)`,
          }}
        >
          <CanvasImage
            name="Existing checkout work"
            src={staticFile("images/checkout-redesign/checkout-after.png")}
            width={800}
            height={700}
            fit="contain"
            style={{ width: "100%", height: "100%" }}
          />
        </Interactive.Div>
        <Interactive.Div
          name="Evidence supports the next decision"
          style={{
            position: "absolute",
            inset: width * 0.035,
            opacity: interpolate(sec, [5, 6.1], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div
            style={{
              fontSize: tall ? 31 : 30,
              color: "#a64131",
              letterSpacing: 3,
            }}
          >
            EVIDENCE → DECISION
          </div>
          <div
            style={{
              fontFamily: "var(--font-serif, Georgia),serif",
              fontSize: tall ? 51 : 50,
              lineHeight: 1.1,
              marginTop: 30,
            }}
          >
            Learn.
            <br />
            Improve.
            <br />
            Make it repeatable.
          </div>
        </Interactive.Div>
      </Interactive.Div>
      <Interactive.Div
        name="Opportunity title"
        style={{
          position: "absolute",
          left: width * 0.07,
          top: height * 0.2,
          fontFamily: "var(--font-serif, Fraunces),Georgia,serif",
          fontSize: tall ? 94 : 120,
          lineHeight: 1,
          letterSpacing: "-.06em",
          opacity: interpolate(progress, [0, 0.8, 1.1], [1, 1, 0], {
            extrapolateRight: "clamp",
          }),
          translate: `0 ${interpolate(progress, [0, 1.1], [0, -110], { extrapolateRight: "clamp" })}px`,
        }}
      >
        Opportunity.
      </Interactive.Div>
      <Interactive.Div
        name="Direction title"
        style={{
          position: "absolute",
          left: width * 0.07,
          top: height * 0.2,
          fontFamily: "var(--font-serif, Fraunces),Georgia,serif",
          fontSize: tall ? 94 : 120,
          lineHeight: 1,
          letterSpacing: "-.06em",
          opacity: interpolate(progress, [0.8, 1.2, 1.7, 2.1], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Direction.
      </Interactive.Div>
      <Interactive.Div
        name="Prototype title"
        style={{
          position: "absolute",
          left: width * 0.07,
          top: height * 0.2,
          fontFamily: "var(--font-serif, Fraunces),Georgia,serif",
          fontSize: tall ? 94 : 120,
          lineHeight: 1,
          letterSpacing: "-.06em",
          opacity: interpolate(progress, [1.8, 2.2, 2.7, 3.1], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Prototype.
      </Interactive.Div>
      <Interactive.Div
        name="Evidence title"
        style={{
          position: "absolute",
          left: width * 0.07,
          top: height * 0.2,
          fontFamily: "var(--font-serif, Fraunces),Georgia,serif",
          fontSize: tall ? 94 : 120,
          lineHeight: 1,
          letterSpacing: "-.06em",
          opacity: interpolate(progress, [2.8, 3.2, 3.6, 3.9], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Evidence.
      </Interactive.Div>
      <Interactive.Div
        name="Adoption title"
        style={{
          position: "absolute",
          left: width * 0.07,
          top: height * 0.2,
          fontFamily: "var(--font-serif, Fraunces),Georgia,serif",
          fontSize: tall ? 94 : 120,
          lineHeight: 1,
          letterSpacing: "-.06em",
          opacity: interpolate(progress, [3.6, 4], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Adoption.
      </Interactive.Div>
      <Interactive.Div
        name="Decision path"
        style={{
          position: "absolute",
          left: width * 0.07,
          right: width * 0.07,
          bottom: height * 0.1,
          display: "flex",
          gap: tall ? 12 : 25,
          alignItems: "center",
          fontSize: tall ? 20 : 25,
        }}
      >
        {["Opportunity", "Direction", "Prototype", "Evidence", "Adoption"].map(
          (label, i) => (
            <div
              key={label}
              style={{
                flex: 1,
                opacity: progress >= i - 0.15 ? 1 : 0.35,
                borderTop: `3px solid ${progress >= i - 0.15 ? "#dfc495" : "#ffffff40"}`,
                paddingTop: 20,
              }}
            >
              {label}
            </div>
          ),
        )}
      </Interactive.Div>
      <Interactive.Div
        name="Authored illustration label"
        style={{
          position: "absolute",
          left: width * 0.07,
          bottom: height * 0.035,
          fontSize: tall ? 18 : 20,
          opacity: 0.65,
        }}
      >
        Authored working-method illustration · Project evidence lives in the
        case studies.
      </Interactive.Div>
    </AbsoluteFill>
  );
}
