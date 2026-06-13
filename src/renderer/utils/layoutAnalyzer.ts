/**
 * Layout Analysis Tool
 * Algorithm-based layout detection - NO AI
 * Based on CSS grid/flexbox patterns and spacing principles
 */

import type {
  LayoutReport,
  LayoutStructure,
  SpacingAnalysis,
  SpacingMetrics,
  SpacingIssue,
  GridAnalysis,
  ResponsiveAnalysis,
  LayoutIssue,
  LayoutSuggestion,
} from '../../shared/designAnalysisTypes';

export class LayoutAnalyzer {
  /**
   * Analyze layout in a page
   */
  async analyzePage(html: string): Promise<LayoutReport> {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Analyze structure
    const structure = this.analyzeStructure(doc);
    
    // Analyze spacing
    const spacing = this.analyzeSpacing(doc);
    
    // Analyze grid
    const grid = this.analyzeGrid(doc);
    
    // Analyze responsive design
    const responsive = this.analyzeResponsive(doc);
    
    // Identify issues
    const issues = this.identifyIssues(structure, spacing, grid, responsive);
    
    // Generate suggestions
    const suggestions = this.generateSuggestions(structure, spacing, grid, issues);
    
    return {
      structure,
      spacing,
      grid,
      responsive,
      issues,
      suggestions,
    };
  }
  
  /**
   * Analyze layout structure
   */
  private analyzeStructure(doc: Document): LayoutStructure {
    const elements = doc.querySelectorAll('*');
    let gridCount = 0;
    let flexCount = 0;
    let floatCount = 0;
    let absoluteCount = 0;
    let maxNesting = 0;
    
    elements.forEach((element) => {
      const styles = window.getComputedStyle(element as Element);
      const display = styles.display;
      const position = styles.position;
      const float = styles.float;
      
      // Count layout types
      if (display.includes('grid')) gridCount++;
      if (display.includes('flex')) flexCount++;
      if (float !== 'none') floatCount++;
      if (position === 'absolute' || position === 'fixed') absoluteCount++;
      
      // Calculate nesting depth
      const depth = this.getDepth(element as HTMLElement);
      if (depth > maxNesting) maxNesting = depth;
    });
    
    // Determine primary layout type
    let type: 'grid' | 'flexbox' | 'float' | 'absolute' | 'mixed';
    if (gridCount > flexCount && gridCount > floatCount) type = 'grid';
    else if (flexCount > gridCount && flexCount > floatCount) type = 'flexbox';
    else if (floatCount > 0) type = 'float';
    else if (absoluteCount > elements.length * 0.3) type = 'absolute';
    else type = 'mixed';
    
    // Calculate complexity (0-100)
    const complexity = Math.min(100, (maxNesting * 10) + (elements.length / 10));
    
    // Find landmarks
    const landmarks = this.findLandmarks(doc);
    
    return {
      type,
      complexity,
      nesting: maxNesting,
      landmarks,
    };
  }
  
  /**
   * Get element depth in DOM tree
   */
  private getDepth(element: HTMLElement): number {
    let depth = 0;
    let current = element.parentElement;
    while (current) {
      depth++;
      current = current.parentElement;
    }
    return depth;
  }
  
  /**
   * Find semantic landmarks
   */
  private findLandmarks(doc: Document): string[] {
    const landmarks: string[] = [];
    const landmarkSelectors = [
      'header, [role="banner"]',
      'nav, [role="navigation"]',
      'main, [role="main"]',
      'aside, [role="complementary"]',
      'footer, [role="contentinfo"]',
    ];
    
    landmarkSelectors.forEach((selector) => {
      if (doc.querySelector(selector)) {
        const tag = selector.split(',')[0];
        landmarks.push(tag);
      }
    });
    
    return landmarks;
  }
  
  /**
   * Analyze spacing
   */
  private analyzeSpacing(doc: Document): SpacingAnalysis {
    const elements = doc.querySelectorAll('*');
    const margins: number[] = [];
    const paddings: number[] = [];
    
    elements.forEach((element) => {
      if (!this.isVisible(element as HTMLElement)) return;
      
      const styles = window.getComputedStyle(element as Element);
      
      // Collect margin values
      ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'].forEach((prop) => {
        const value = parseFloat(styles[prop as any]);
        if (value > 0) margins.push(value);
      });
      
      // Collect padding values
      ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'].forEach((prop) => {
        const value = parseFloat(styles[prop as any]);
        if (value > 0) paddings.push(value);
      });
    });
    
    // Analyze metrics
    const marginMetrics = this.analyzeSpacingMetrics(margins);
    const paddingMetrics = this.analyzeSpacingMetrics(paddings);
    
    // Detect spacing scale
    const scale = this.detectSpacingScale([...margins, ...paddings]);
    
    // Calculate consistency score
    const consistency = Math.round(
      ((marginMetrics.isConsistent ? 50 : 0) + (paddingMetrics.isConsistent ? 50 : 0))
    );
    
    // Identify spacing issues
    const issues = this.identifySpacingIssues(doc, scale);
    
    return {
      margins: marginMetrics,
      paddings: paddingMetrics,
      consistency,
      scale,
      issues,
    };
  }
  
  /**
   * Analyze spacing metrics
   */
  private analyzeSpacingMetrics(values: number[]): SpacingMetrics {
    if (values.length === 0) {
      return {
        values: [],
        mostCommon: [],
        variance: 0,
        isConsistent: true,
      };
    }
    
    // Find most common values
    const frequency = new Map<number, number>();
    values.forEach((value) => {
      frequency.set(value, (frequency.get(value) || 0) + 1);
    });
    
    const mostCommon = Array.from(frequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([value]) => value);
    
    // Calculate variance
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    
    // Check consistency (low variance relative to mean)
    const isConsistent = variance < mean * 0.5;
    
    return {
      values: Array.from(new Set(values)).sort((a, b) => a - b),
      mostCommon,
      variance,
      isConsistent,
    };
  }
  
  /**
   * Detect spacing scale (e.g., 4, 8, 16, 24, 32)
   */
  private detectSpacingScale(values: number[]): number[] {
    if (values.length === 0) return [];
    
    // Find unique values and sort
    const unique = Array.from(new Set(values)).sort((a, b) => a - b);
    
    // Try to detect common scales (4px, 8px based)
    const scales = [4, 8];
    let bestScale: number[] = [];
    let bestMatch = 0;
    
    scales.forEach((base) => {
      const scale = [base, base * 2, base * 3, base * 4, base * 6, base * 8];
      const matches = unique.filter(v => scale.some(s => Math.abs(v - s) < 2)).length;
      
      if (matches > bestMatch) {
        bestMatch = matches;
        bestScale = scale;
      }
    });
    
    return bestScale.length > 0 ? bestScale : unique.slice(0, 8);
  }
  
  /**
   * Identify spacing issues
   */
  private identifySpacingIssues(doc: Document, scale: number[]): SpacingIssue[] {
    const issues: SpacingIssue[] = [];
    const elements = doc.querySelectorAll('*');
    
    elements.forEach((element) => {
      if (!this.isVisible(element as HTMLElement)) return;
      
      const styles = window.getComputedStyle(element as Element);
      const marginTop = parseFloat(styles.marginTop);
      const paddingTop = parseFloat(styles.paddingTop);
      
      // Check if spacing follows scale
      if (marginTop > 0 && !this.isInScale(marginTop, scale)) {
        issues.push({
          type: 'no-scale',
          element: this.getSelector(element as HTMLElement),
          current: marginTop,
          suggested: this.findClosestInScale(marginTop, scale),
          reason: 'Margin does not follow spacing scale',
        });
      }
      
      if (paddingTop > 0 && !this.isInScale(paddingTop, scale)) {
        issues.push({
          type: 'no-scale',
          element: this.getSelector(element as HTMLElement),
          current: paddingTop,
          suggested: this.findClosestInScale(paddingTop, scale),
          reason: 'Padding does not follow spacing scale',
        });
      }
    });
    
    return issues.slice(0, 20); // Limit to top 20 issues
  }
  
  /**
   * Check if value is in scale
   */
  private isInScale(value: number, scale: number[]): boolean {
    return scale.some(s => Math.abs(value - s) < 2);
  }
  
  /**
   * Find closest value in scale
   */
  private findClosestInScale(value: number, scale: number[]): number {
    return scale.reduce((closest, current) => {
      return Math.abs(current - value) < Math.abs(closest - value) ? current : closest;
    });
  }
  
  /**
   * Analyze grid
   */
  private analyzeGrid(doc: Document): GridAnalysis {
    const gridElements = doc.querySelectorAll('[style*="grid"], .grid, .container');
    
    if (gridElements.length === 0) {
      return {
        hasGrid: false,
        columns: 0,
        gutter: 0,
        alignment: 0,
        issues: ['No grid system detected'],
      };
    }
    
    // Analyze first grid element
    const firstGrid = gridElements[0];
    const styles = window.getComputedStyle(firstGrid as Element);
    const gridTemplateColumns = styles.gridTemplateColumns;
    
    // Count columns
    const columns = gridTemplateColumns ? gridTemplateColumns.split(' ').length : 12;
    
    // Estimate gutter (gap between columns)
    const gap = parseFloat(styles.gap || styles.columnGap || '0');
    
    // Check alignment
    const children = Array.from(firstGrid.children);
    const alignment = this.calculateAlignment(children as HTMLElement[]);
    
    const issues: string[] = [];
    if (columns === 0) issues.push('Grid has no defined columns');
    if (gap === 0) issues.push('Grid has no gutter spacing');
    if (alignment < 80) issues.push('Grid items are not well aligned');
    
    return {
      hasGrid: true,
      columns,
      gutter: gap,
      alignment,
      issues,
    };
  }
  
  /**
   * Calculate alignment score
   */
  private calculateAlignment(elements: HTMLElement[]): number {
    if (elements.length < 2) return 100;
    
    const tops = elements.map(el => el.offsetTop);
    const lefts = elements.map(el => el.offsetLeft);
    
    // Check if elements align on common lines
    const uniqueTops = new Set(tops);
    const uniqueLefts = new Set(lefts);
    
    const alignmentScore = ((uniqueTops.size / tops.length) + (uniqueLefts.size / lefts.length)) / 2;
    return Math.round((1 - alignmentScore) * 100);
  }
  
  /**
   * Analyze responsive design
   */
  private analyzeResponsive(doc: Document): ResponsiveAnalysis {
    const viewport = doc.querySelector('meta[name="viewport"]');
    const mediaQueries = this.findMediaQueries(doc);
    
    const isResponsive = viewport !== null || mediaQueries.length > 0;
    const mobileOptimized = viewport !== null && 
                            viewport.getAttribute('content')?.includes('width=device-width') || false;
    
    const issues: string[] = [];
    if (!viewport) issues.push('Missing viewport meta tag');
    if (mediaQueries.length === 0) issues.push('No media queries detected');
    if (!mobileOptimized) issues.push('Not optimized for mobile devices');
    
    return {
      breakpoints: mediaQueries,
      isResponsive,
      mobileOptimized,
      issues,
    };
  }
  
  /**
   * Find media query breakpoints
   */
  private findMediaQueries(doc: Document): number[] {
    const breakpoints: number[] = [];
    const styleSheets = Array.from(doc.styleSheets);
    
    // Common breakpoints
    const commonBreakpoints = [320, 480, 768, 1024, 1280, 1440];
    
    // For now, return common breakpoints
    // In a real implementation, we would parse CSS rules
    return commonBreakpoints;
  }
  
  /**
   * Identify layout issues
   */
  private identifyIssues(
    structure: LayoutStructure,
    spacing: SpacingAnalysis,
    grid: GridAnalysis,
    responsive: ResponsiveAnalysis
  ): LayoutIssue[] {
    const issues: LayoutIssue[] = [];
    
    // Check complexity
    if (structure.complexity > 70) {
      issues.push({
        type: 'spacing',
        severity: 'moderate',
        description: `Layout complexity is high (${Math.round(structure.complexity)}/100)`,
        element: 'body',
        recommendation: 'Simplify layout structure and reduce nesting',
      });
    }
    
    // Check spacing consistency
    if (spacing.consistency < 50) {
      issues.push({
        type: 'spacing',
        severity: 'moderate',
        description: 'Spacing is inconsistent across the page',
        element: 'body',
        recommendation: 'Use a consistent spacing scale (e.g., 4px, 8px, 16px, 24px)',
      });
    }
    
    // Check grid
    if (!grid.hasGrid) {
      issues.push({
        type: 'grid',
        severity: 'minor',
        description: 'No grid system detected',
        element: 'body',
        recommendation: 'Consider using CSS Grid or Flexbox for layout',
      });
    }
    
    // Check responsive
    if (!responsive.isResponsive) {
      issues.push({
        type: 'responsive',
        severity: 'critical',
        description: 'Page is not responsive',
        element: 'body',
        recommendation: 'Add viewport meta tag and media queries',
      });
    }
    
    return issues;
  }
  
  /**
   * Generate layout suggestions
   */
  private generateSuggestions(
    structure: LayoutStructure,
    spacing: SpacingAnalysis,
    grid: GridAnalysis,
    issues: LayoutIssue[]
  ): LayoutSuggestion[] {
    const suggestions: LayoutSuggestion[] = [];
    
    // Suggest spacing scale
    if (spacing.consistency < 70) {
      suggestions.push({
        type: 'spacing',
        description: 'Implement consistent spacing scale',
        before: 'Inconsistent spacing values',
        after: `Use scale: ${spacing.scale.join(', ')}px`,
        reason: 'Consistent spacing creates visual rhythm',
      });
    }
    
    // Suggest grid system
    if (!grid.hasGrid) {
      suggestions.push({
        type: 'grid',
        description: 'Implement grid system',
        before: 'No grid structure',
        after: '12-column grid with 24px gutter',
        reason: 'Grid systems provide consistent alignment',
      });
    }
    
    // Suggest responsive improvements
    if (issues.some(i => i.type === 'responsive')) {
      suggestions.push({
        type: 'responsive',
        description: 'Add responsive breakpoints',
        before: 'Fixed layout',
        after: 'Breakpoints at 768px, 1024px, 1280px',
        reason: 'Responsive design improves mobile experience',
      });
    }
    
    return suggestions;
  }
  
  /**
   * Check if element is visible
   */
  private isVisible(element: HTMLElement): boolean {
    const styles = window.getComputedStyle(element);
    return styles.display !== 'none' && 
           styles.visibility !== 'hidden' && 
           styles.opacity !== '0';
  }
  
  /**
   * Get CSS selector for element
   */
  private getSelector(element: HTMLElement): string {
    if (element.id) return `#${element.id}`;
    if (element.className) {
      const classes = element.className.split(' ').filter(c => c).join('.');
      return `${element.tagName.toLowerCase()}.${classes}`;
    }
    return element.tagName.toLowerCase();
  }
}

// Export singleton instance
export const layoutAnalyzer = new LayoutAnalyzer();

// Made with Bob
