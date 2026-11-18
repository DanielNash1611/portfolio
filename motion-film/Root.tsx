import { Composition } from "remotion";
import { PortfolioFilm } from "./PortfolioFilm";
export const RemotionRoot = () => (
  <>
    <Composition
      id="PortfolioInMotion"
      component={PortfolioFilm}
      durationInFrames={240}
      fps={30}
      width={1600}
      height={900}
    />
    <Composition
      id="PortfolioInMotionMobile"
      component={PortfolioFilm}
      durationInFrames={240}
      fps={30}
      width={900}
      height={1200}
    />
  </>
);
