// JSX typings for the Material web custom elements. Props are intentionally
// loose: React 19 sets properties on custom elements when they exist.
import type * as React from "react";

type M3Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
  [key: string]: unknown;
  class?: string;
  slot?: string;
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "md-elevated-button": M3Props;
      "md-filled-button": M3Props;
      "md-filled-tonal-button": M3Props;
      "md-outlined-button": M3Props;
      "md-text-button": M3Props;
      "md-checkbox": M3Props;
      "md-assist-chip": M3Props;
      "md-chip-set": M3Props;
      "md-filter-chip": M3Props;
      "md-input-chip": M3Props;
      "md-suggestion-chip": M3Props;
      "md-dialog": M3Props;
      "md-divider": M3Props;
      "md-branded-fab": M3Props;
      "md-fab": M3Props;
      "md-icon": M3Props;
      "md-filled-icon-button": M3Props;
      "md-filled-tonal-icon-button": M3Props;
      "md-icon-button": M3Props;
      "md-outlined-icon-button": M3Props;
      "md-list": M3Props;
      "md-list-item": M3Props;
      "md-menu": M3Props;
      "md-menu-item": M3Props;
      "md-circular-progress": M3Props;
      "md-linear-progress": M3Props;
      "md-radio": M3Props;
      "md-filled-select": M3Props;
      "md-outlined-select": M3Props;
      "md-select-option": M3Props;
      "md-slider": M3Props;
      "md-switch": M3Props;
      "md-primary-tab": M3Props;
      "md-secondary-tab": M3Props;
      "md-tabs": M3Props;
      "md-filled-text-field": M3Props;
      "md-outlined-text-field": M3Props;
      "md-elevated-card": M3Props;
      "md-filled-card": M3Props;
      "md-outlined-card": M3Props;
      "md-navigation-bar": M3Props;
      "md-navigation-tab": M3Props;
      "md-outlined-segmented-button": M3Props;
      "md-outlined-segmented-button-set": M3Props;
    }
  }
}
