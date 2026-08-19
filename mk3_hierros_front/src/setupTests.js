import "@testing-library/jest-dom";

if (typeof window !== "undefined" && !window.IntersectionObserver) {
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.IntersectionObserver = MockIntersectionObserver;
  window.ResizeObserver = window.ResizeObserver ?? MockIntersectionObserver;
}
