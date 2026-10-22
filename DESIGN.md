---
version: alpha
name: CHI Paper Planner
description: A paper explorer for CHI attendees to search by meaning, see the paper map, and plan which sessions to attend.
colors:
  primary: '#0D6EFD' # links, tag buttons, interactive controls (mockup link blue)
  secondary: '#5B6472' # captions, metadata, scores
  tertiary: '#01665E' # the single accent: high-similarity dots (brownbluegreen end)
  neutral: '#FFFFFF' # page background
  surface: '#F0F0F0' # navbar and panels
  on-surface: '#212529' # body text and headings
  sand: '#DFC27D' # low-similarity dots (brownbluegreen start)
  error: '#B3261E'
typography:
  headline-lg: { fontFamily: Helvetica, fontSize: 40px, fontWeight: 700, lineHeight: 1.2 }
  headline-md: { fontFamily: Helvetica, fontSize: 24px, fontWeight: 600, lineHeight: 1.2 }
  body-md: { fontFamily: Helvetica, fontSize: 16px, fontWeight: 400, lineHeight: 1.5 }
  label-md: { fontFamily: Helvetica, fontSize: 12px, fontWeight: 400, lineHeight: 1.2 }
rounded: { sm: 4px, md: 8px }
spacing: { xs: 4px, sm: 8px, md: 16px, lg: 32px }
components:
  tag-button:
    backgroundColor: '{colors.neutral}'
    textColor: '{colors.primary}'
    typography: '{typography.body-md}'
    rounded: '{rounded.sm}'
    padding: 4px
  tag-button-hover:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.neutral}'
  navbar:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.on-surface}'
    padding: 16px
  paper-card:
    backgroundColor: '{colors.neutral}'
    textColor: '{colors.on-surface}'
    typography: '{typography.label-md}'
    padding: 8px
---

## Overview

A light, utilitarian research tool in the style of the CHI 2025 Papers Explorer: a plain white page, a gray navbar, one big scatter plot of papers, and a dense grid of paper cards. Data first, chrome last.

## Colors

- **Primary** {colors.primary}: every link and tag button.
- **Tertiary** {colors.tertiary} with **sand** {colors.sand}: the similarity scale on the plot, sand (low) to teal (high). Teal is the one accent per screen.
- **Secondary** {colors.secondary}: scores, authors, captions.

## Typography

Helvetica (system sans) only. Page title {typography.headline-lg}, section headings {typography.headline-md}, text {typography.body-md}, dense card text {typography.label-md}.

## Layout

Desktop-first. Two columns: search and chart on the left, selected papers on the right. Spacing only from the scale above.

## Elevation & Depth

Flat. No shadows; separate regions with whitespace and the {colors.surface} navbar.

## Shapes

{rounded.sm} on tag buttons and inputs; {rounded.md} on panels. No pills.

## Components

Tag buttons ({colors.primary} outline) set a query. Paper cards show title link, score, authors, session, abstract. Reuse these; do not re-implement them per page.

## Do's and Don'ts

- Do keep WCAG AA contrast (4.5:1 for body text).
- Do use the sand to teal scale for similarity, never for decoration.
- Don't add gradients, shadows, or a second accent color.
- Don't hard-code hex values in components; use Tailwind theme tokens.
