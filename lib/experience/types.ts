export interface Vec3 {
  x: number;
  y: number;
  z?: number;
}
export type Chapter = "intro" | "gravity" | "ai";
export type Perspective = "audience" | "cello";
export type Point3 = readonly [number, number, number];
export interface SpatialFrame {
  sources: readonly Point3[];
  listener: Point3;
  forward: Point3;
  up: Point3;
}
