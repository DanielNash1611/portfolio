"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Component,
  useEffect,
  useMemo,
  useRef,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { Group, PerspectiveCamera } from "three";
import {
  createExperienceScene,
  type SceneController,
  type SceneInput,
} from "@/lib/experience/scene";
import { renderBudget } from "@/lib/experience/continuity";
import type { SpatialFrame } from "@/lib/experience/types";

type Props = {
  inputs: MutableRefObject<SceneInput>;
  onReady(): void;
  onFailure(): void;
  onSpatial(frame: SpatialFrame): void;
};
function World({ inputs, onReady, onFailure, onSpatial }: Props) {
  const root = useMemo(() => new Group(), []);
  const controller = useRef<SceneController | null>(null);
  const { camera, gl, size, invalidate, setDpr } = useThree();
  const narrow = size.width < 760;
  const dimensions = useRef(size);
  dimensions.current = size;
  useEffect(() => {
    const abort = new AbortController();
    const lost = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
    gl.domElement.addEventListener("webglcontextlost", lost);
    void createExperienceScene(
      root,
      camera as PerspectiveCamera,
      {
        read: () => inputs.current,
        onSpatial,
        onFailure,
        signal: abort.signal,
      },
      dimensions.current.width,
    )
      .then((value) => {
        if (abort.signal.aborted) {
          value.dispose();
          return;
        }
        controller.current = value;
        value.resize(dimensions.current.width, dimensions.current.height);
        onReady();
        invalidate();
      })
      .catch((error: unknown) => {
        if (!abort.signal.aborted) {
          console.warn("Experience scene unavailable", error);
          onFailure();
        }
      });
    // Scroll and explicit controls are the only animation clock. R3F coalesces
    // invalidations into one draw and does no idle work between interactions.
    const update = () => {
      if (document.hidden || inputs.current.suspended) return;
      invalidate();
    };
    window.addEventListener("scroll", update, { passive: true });
    let pendingInputFrame: number | null = null;
    const inputChanged = () => {
      // Framer's scroll subscription can publish during the same animation
      // frame as R3F's demand draw. Queue the final invalidation after that
      // publication so the last scroll pose is painted before becoming idle.
      if (pendingInputFrame === null)
        pendingInputFrame = requestAnimationFrame(() => {
          pendingInputFrame = null;
          update();
        });
    };
    window.addEventListener("experience-input", inputChanged);
    document.addEventListener("visibilitychange", update);
    return () => {
      abort.abort();
      controller.current?.dispose();
      controller.current = null;
      if (pendingInputFrame !== null) cancelAnimationFrame(pendingInputFrame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("experience-input", inputChanged);
      document.removeEventListener("visibilitychange", update);
      gl.domElement.removeEventListener("webglcontextlost", lost);
    };
  }, [
    root,
    camera,
    gl,
    inputs,
    invalidate,
    onReady,
    onFailure,
    onSpatial,
    narrow,
  ]);
  useEffect(() => {
    setDpr(
      Math.min(window.devicePixelRatio, renderBudget(size.width, false).dpr),
    );
    controller.current?.resize(size.width, size.height);
    invalidate();
  }, [size, invalidate, setDpr]);
  useFrame(({ clock }) => controller.current?.update(clock.elapsedTime * 1000));
  return <primitive object={root} dispose={null} />;
}
class CanvasBoundary extends Component<
  { onFailure(): void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export default function ExperienceCanvas(props: Props) {
  const mobile = typeof window !== "undefined" && window.innerWidth < 760;
  return (
    <CanvasBoundary onFailure={props.onFailure}>
      <Canvas
        frameloop="demand"
        dpr={[1, mobile ? 1.25 : 1.5]}
        camera={{ fov: 40, near: 0.05, far: 100, position: [0, 0.15, 7.5] }}
        gl={{ alpha: true, antialias: !mobile, powerPreference: "low-power" }}
      >
        <World {...props} />
      </Canvas>
    </CanvasBoundary>
  );
}
