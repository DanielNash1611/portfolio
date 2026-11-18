"use client";
import { Component, type ReactNode } from "react";
export default class MotionBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode; onFailure?(): void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure?.();
  }
  render() {
    return this.state.failed
      ? (this.props.fallback ?? null)
      : this.props.children;
  }
}
