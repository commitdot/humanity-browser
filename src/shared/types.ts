// Browser Tab
export interface Tab {
  id: string;
  url: string;
  title: string;
  favicon?: string;
  loading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
}

// Design Analysis
export interface DesignAnalysis {
  score: number;
  timestamp: Date;
  issues: DesignIssue[];
  suggestions: DesignSuggestion[];
  accessibility: AccessibilityReport;
  colors: ColorPalette;
  typography: TypographyReport;
  layout: LayoutReport;
}

export interface DesignIssue {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'color' | 'typography' | 'layout' | 'accessibility' | 'spacing';
  title: string;
  description: string;
  element?: string;
  fix?: string;
}

export interface DesignSuggestion {
  id: string;
  category: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  cssChanges?: string;
}

// Accessibility
export interface AccessibilityReport {
  score: number;
  wcagLevel: 'A' | 'AA' | 'AAA' | 'fail';
  issues: AccessibilityIssue[];
  passedChecks: number;
  totalChecks: number;
}

export interface AccessibilityIssue {
  id: string;
  type: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  element: string;
  wcagCriteria: string;
  fix: string;
}

// Colors
export interface ColorPalette {
  primary: string[];
  secondary: string[];
  accent: string[];
  neutral: string[];
  all: ColorInfo[];
}

export interface ColorInfo {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  usage: number;
  contrastIssues?: ContrastIssue[];
}

export interface ContrastIssue {
  foreground: string;
  background: string;
  ratio: number;
  required: number;
  level: 'AA' | 'AAA';
}

// Typography
export interface TypographyReport {
  fonts: FontInfo[];
  hierarchy: HierarchyInfo[];
  readability: ReadabilityInfo;
  issues: string[];
}

export interface FontInfo {
  family: string;
  weights: number[];
  usage: number;
  fallback: string[];
}

export interface HierarchyInfo {
  level: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  usage: number;
}

export interface ReadabilityInfo {
  score: number;
  lineLength: { min: number; max: number; avg: number };
  lineHeight: { min: number; max: number; avg: number };
  fontSize: { min: number; max: number; avg: number };
}

// Layout
export interface LayoutReport {
  type: 'grid' | 'flexbox' | 'float' | 'absolute' | 'mixed';
  consistency: number;
  spacing: SpacingInfo;
  alignment: AlignmentInfo;
  responsive: ResponsiveInfo;
}

export interface SpacingInfo {
  consistent: boolean;
  values: number[];
  issues: string[];
}

export interface AlignmentInfo {
  score: number;
  issues: string[];
}

export interface ResponsiveInfo {
  hasMediaQueries: boolean;
  breakpoints: number[];
  mobileOptimized: boolean;
}

// Redesign
export interface RedesignStyle {
  id: string;
  name: string;
  description: string;
  preview?: string;
}

export interface RedesignResult {
  style: RedesignStyle;
  css: string;
  changes: DesignChange[];
  beforeAfter?: {
    before: string;
    after: string;
  };
}

export interface DesignChange {
  category: string;
  description: string;
  cssRule: string;
}

// AI Configuration
export interface AIConfig {
  provider: 'openai' | 'anthropic';
  model: string;
  apiKey: string;
  temperature: number;
  maxTokens: number;
}

// Browser State
export interface BrowserState {
  tabs: Tab[];
  currentTab: string | null;
  history: string[];
  bookmarks: Bookmark[];
}

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  favicon?: string;
  tags: string[];
  createdAt: Date;
}
