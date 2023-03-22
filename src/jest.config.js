const d3Pkgs = [
  "d3",
  "d3-array",
  "d3-axis",
  "d3-brush",
  "d3-chord",
  "d3-color",
  "d3-contour",
  "d3-delaunay",
  "d3-dispatch",
  "d3-drag",
  "d3-dsv",
  "d3-ease",
  "d3-fetch",
  "d3-force",
  "d3-format",
  "d3-geo",
  "d3-hierarchy",
  "d3-interpolate",
  "d3-path",
  "d3-polygon",
  "d3-quadtree",
  "d3-random",
  "d3-scale",
  "d3-scale-chromatic",
  "d3-selection",
  "d3-shape",
  "d3-time",
  "d3-time-format",
  "d3-timer",
  "d3-transition",
  "d3-zoom",
];

module.exports = {
  transformIgnorePatterns: [
    `/node_modules/(?!${d3Pkgs.join(
      "|",
    )}|internmap|d3-delaunay|delaunator|robust-predicates)`,
  ],
  moduleNameMapper: {
    d3: "/node_modules/d3/dist/d3.min.js",
  },
  projects: [
    {
      runner: "@jest-runner/electron/main",
      testEnvironment: "node",
      testMatch: ["./__tests__/main.test.js"],
    },
    {
      runner: "@jest-runner/electron",
      testEnvironment: "@jest-runner/electron/environment",
      testMatch: ["./__tests__/renderer.test.js"],
    },
  ],
};
