/**
 * Type definitions for rule-based design analysis
 * No AI - only standards-based analysis (WCAG, W3C, color theory)
 */

// ============================================================================
// Accessibility Analysis (WCAG 2.1)
// ============================================================================

export interface AccessibilityReport {
  score: number; // 0-100 based on WCAG compliance
  wcagLevel: 'A' | 'AA' | 'AAA' | 'Fail';
  issues: AccessibilityIssue[];
  summary: {
    totalIssues: number;
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
  };
  recommendations: string[];
}

export interface AccessibilityIssue {
  id: string;
  type: AccessibilityIssueType;
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
  wcagCriterion: string; // e.g., "1.4.3" for contrast
  description: string;
  element: string; // CSS selector
  recommendation: string;
  helpUrl: string;
}

export type AccessibilityIssueType =
  | 'contrast'
  | 'missing-alt'
  | 'missing-label'
  | 'keyboard-navigation'
  | 'aria-invalid'
  | 'heading-order'
  | 'link-name'
  | 'button-name'
  | 'form-label'
  | 'language'
  | 'landmark'
  | 'list-structure'
  | 'table-structure';

// ============================================================================
// Color Analysis (Mathematical)
// ============================================================================

export interface ColorReport {
  palette: ColorPalette;
  harmony: ColorHarmony;
  contrast: ContrastAnalysis;
  accessibility: ColorAccessibility;
  suggestions: ColorSuggestion[];
}

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
  usage: number; // percentage of page
  elements: string[]; // CSS selectors
}

export interface ColorHarmony {
  type: 'complementary' | 'analogous' | 'triadic' | 'tetradic' | 'monochromatic' | 'none';
  score: number; // 0-100
  isHarmonious: boolean;
  explanation: string;
}

export interface ContrastAnalysis {
  pairs: ContrastPair[];
  passRate: number; // percentage passing WCAG AA
  failingPairs: number;
}

export interface ContrastPair {
  foreground: string;
  background: string;
  ratio: number;
  passesAA: boolean; // 4.5:1 for normal text
  passesAAA: boolean; // 7:1 for normal text
  passesAALarge: boolean; // 3:1 for large text
  passesAAALarge: boolean; // 4.5:1 for large text
  element: string;
  fontSize: number;
  fontWeight: number;
}

export interface ColorAccessibility {
  totalPairs: number;
  passingAA: number;
  passingAAA: number;
  criticalIssues: ContrastPair[];
  colorBlindSafe: boolean;
}

export interface ColorSuggestion {
  type: 'contrast' | 'harmony' | 'accessibility';
  original: string;
  suggested: string;
  reason: string;
  improvement: string;
}

// ============================================================================
// Typography Analysis (Formula-Based)
// ============================================================================

export interface TypographyReport {
  fonts: FontInfo[];
  hierarchy: TypographyHierarchy;
  readability: ReadabilityMetrics;
  issues: TypographyIssue[];
  suggestions: TypographySuggestion[];
}

export interface FontInfo {
  family: string;
  weights: number[];
  styles: string[];
  usage: number; // percentage
  elements: string[];
}

export interface TypographyHierarchy {
  levels: HierarchyLevel[];
  isConsistent: boolean;
  scale: number; // modular scale ratio
  issues: string[];
}

export interface HierarchyLevel {
  level: number; // 1 = h1, 2 = h2, etc.
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  usage: number;
}

export interface ReadabilityMetrics {
  averageLineLength: number; // characters
  optimalLineLength: boolean; // 45-75 characters
  averageLineHeight: number;
  optimalLineHeight: boolean; // 1.4-1.6
  fleschReadingEase: number; // 0-100
  fleschKincaidGrade: number; // grade level
  readabilityLevel: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface TypographyIssue {
  type: 'line-length' | 'line-height' | 'font-size' | 'contrast' | 'hierarchy';
  severity: 'critical' | 'moderate' | 'minor';
  description: string;
  element: string;
  recommendation: string;
}

export interface TypographySuggestion {
  type: 'font-size' | 'line-height' | 'line-length' | 'font-pairing';
  current: string;
  suggested: string;
  reason: string;
}

// ============================================================================
// Layout Analysis (Algorithm-Based)
// ============================================================================

export interface LayoutReport {
  structure: LayoutStructure;
  spacing: SpacingAnalysis;
  grid: GridAnalysis;
  responsive: ResponsiveAnalysis;
  issues: LayoutIssue[];
  suggestions: LayoutSuggestion[];
}

export interface LayoutStructure {
  type: 'grid' | 'flexbox' | 'float' | 'absolute' | 'mixed';
  complexity: number; // 0-100
  nesting: number; // max depth
  landmarks: string[]; // header, nav, main, aside, footer
}

export interface SpacingAnalysis {
  margins: SpacingMetrics;
  paddings: SpacingMetrics;
  consistency: number; // 0-100
  scale: number[]; // detected spacing scale
  issues: SpacingIssue[];
}

export interface SpacingMetrics {
  values: number[];
  mostCommon: number[];
  variance: number;
  isConsistent: boolean;
}

export interface SpacingIssue {
  type: 'inconsistent' | 'too-tight' | 'too-loose' | 'no-scale';
  element: string;
  current: number;
  suggested: number;
  reason: string;
}

export interface GridAnalysis {
  hasGrid: boolean;
  columns: number;
  gutter: number;
  alignment: number; // 0-100
  issues: string[];
}

export interface ResponsiveAnalysis {
  breakpoints: number[];
  isResponsive: boolean;
  mobileOptimized: boolean;
  issues: string[];
}

export interface LayoutIssue {
  type: 'spacing' | 'alignment' | 'grid' | 'responsive';
  severity: 'critical' | 'moderate' | 'minor';
  description: string;
  element: string;
  recommendation: string;
}

export interface LayoutSuggestion {
  type: 'spacing' | 'grid' | 'alignment' | 'responsive';
  description: string;
  before: string;
  after: string;
  reason: string;
}

// ============================================================================
// Complete Design Analysis
// ============================================================================

export interface DesignAnalysis {
  url: string;
  timestamp: Date;
  overall: OverallScore;
  accessibility: AccessibilityReport;
  colors: ColorReport;
  typography: TypographyReport;
  layout: LayoutReport;
  summary: AnalysisSummary;
}

export interface OverallScore {
  total: number; // 0-100
  breakdown: {
    accessibility: number;
    colors: number;
    typography: number;
    layout: number;
  };
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  level: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
}

export interface AnalysisSummary {
  totalIssues: number;
  criticalIssues: number;
  topIssues: string[];
  quickWins: string[];
  estimatedTime: string; // e.g., "2 hours"
}

// ============================================================================
// Analysis Configuration
// ============================================================================

export interface AnalysisConfig {
  accessibility: {
    enabled: boolean;
    wcagLevel: 'A' | 'AA' | 'AAA';
    includeWarnings: boolean;
  };
  colors: {
    enabled: boolean;
    checkContrast: boolean;
    checkHarmony: boolean;
    checkAccessibility: boolean;
  };
  typography: {
    enabled: boolean;
    checkReadability: boolean;
    checkHierarchy: boolean;
    checkLineLength: boolean;
  };
  layout: {
    enabled: boolean;
    checkSpacing: boolean;
    checkGrid: boolean;
    checkResponsive: boolean;
  };
}

// ============================================================================
// Analysis State
// ============================================================================

export interface AnalysisState {
  isAnalyzing: boolean;
  progress: number; // 0-100
  currentStep: string;
  result: DesignAnalysis | null;
  error: string | null;
}

// ============================================================================
// Export Types
// ============================================================================

export interface AnalysisExport {
  format: 'json' | 'html' | 'pdf' | 'markdown';
  data: DesignAnalysis;
  includeScreenshots: boolean;
  includeRecommendations: boolean;
}

// Made with Bob
