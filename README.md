# FIFA World Cup 2026 — Interactive Match Centre

An ultra-performant, zero-dependency, monolithic frontend application designed to deliver real-time tournament telemetry, synchronous state updates, and a frictionless broadcast experience for the 2026 FIFA World Cup.

## ⚡ Architectural Paradigm

The architecture intentionally eschews heavy VDOM-based frameworks in favor of a **vanilla DOM reconciliation pipeline**. This provides sub-millisecond render cycles, crucial for mitigating layout thrashing during high-frequency live data mutations.

### Core Systems

1. **Reactive State Container**: Centralized immutable data structures (`const teamsData`, `const fixturesData`) act as the single source of truth. Mutations trigger targeted downstream DOM injection routines rather than full-tree recalculations.
2. **IntersectionObserver Telemetry**: A highly optimized viewport intersection observer (`initScrollAnimations`) handles declarative class toggling (`.animate-on-scroll`). By offloading visibility calculations to the browser's compositing thread, we eliminate main-thread jank during accelerated scroll events.
3. **Event Delegation Matrix**: Bound to the document root, the event listener matrix utilizes robust event bubbling mechanics to intercept interaction events (e.g., category filtering on group tabs), drastically reducing memory overhead compared to direct node binding.
4. **Asynchronous Polling Engine**: A non-blocking asynchronous interval mechanism (`fetchLiveUpdates`) simulates a WebSocket-like continuous connection, dynamically interpolating JSON payloads into the live ticker matrix without disrupting main-thread execution.
5. **DASH/HLS Video Integration Protocol**: The `video-player-wrapper` implements a custom HTML5 `MediaElement` controller logic, gracefully handling asynchronous metadata loading, programmatic play/pause state synchronization, and adaptive bitrate streaming error boundaries via the `video-error-overlay`.

## 🎨 Minimal Luxury CSS Methodology

The styling paradigm relies on a highly restrained, tokenized **Design System** orchestrated via native CSS Custom Properties (`:root`).

- **Hardware-Accelerated Transitions**: All temporal state changes (`opacity`, `transform: translateY`) are explicitly scoped to properties that bypass the browser's reflow/repaint pipelines, rendering purely on the GPU.
- **Structural Grid Systems**: Implementations of CSS Grid (`grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))`) establish intrinsically fluid layout topologies that collapse deterministically on constrained viewports.
- **Negative Space Calibration**: Utilization of generous margin geometries and `clamp()` typography functions to establish a precise typographic hierarchy (Oswald 300 / Inter 400), emulating premium editorial aesthetics.
- **Sub-pixel Anti-aliasing**: Enforcement of `-webkit-font-smoothing: antialiased` combined with `#0a0a0a` low-luminosity backgrounds and fractional opacity borders (`rgba(255, 255, 255, 0.06)`) to mitigate contrast halation and establish a monolithic visual hierarchy.

## 🚀 Deployment Pipeline

This application is statically deployed leveraging the GitHub Pages CDN infrastructure. The underlying architecture ensures zero server-side rendering (SSR) dependencies, allowing edges nodes to cache the immutable payload infinitely.

### Local Development Environment

Execute a local development server to instantiate the asset pipeline and bypass CORS restrictions during API integration:

```bash
# Instantiate via Node.js minimal HTTP server (or equivalent)
npx http-server -p 8081
```

Navigate to the localized loopback address: `http://localhost:8081`

## 📦 Extensibility Matrix

The `script.js` module is structurally partitioned to facilitate rapid integration of remote telemetry endpoints:

- **Target Node**: `function fetchLiveUpdates()`
- **Implementation Vector**: Replace the hardcoded DOM simulation loop with a `fetch()` call to a REST or GraphQL endpoint, mapping the asynchronous payload schema directly to the `$el.innerHTML` injection target.
