/**
 * WCAG 2.1 Accessibility Checker
 * Rule-based analysis - NO AI
 * Standards: https://www.w3.org/WAI/WCAG21/quickref/
 */

import type {
  AccessibilityReport,
  AccessibilityIssue,
  AccessibilityIssueType,
  ContrastPair,
} from '../../shared/designAnalysisTypes';

export class AccessibilityChecker {
  /**
   * Analyze page for WCAG compliance
   */
  async analyzePage(html: string, url: string): Promise<AccessibilityReport> {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const issues: AccessibilityIssue[] = [];
    
    // Run all checks
    issues.push(...this.checkColorContrast(doc));
    issues.push(...this.checkImageAltText(doc));
    issues.push(...this.checkFormLabels(doc));
    issues.push(...this.checkHeadingOrder(doc));
    issues.push(...this.checkLinkText(doc));
    issues.push(...this.checkARIA(doc));
    issues.push(...this.checkKeyboardNavigation(doc));
    issues.push(...this.checkLanguage(doc));
    issues.push(...this.checkLandmarks(doc));
    
    // Calculate summary
    const summary = this.calculateSummary(issues);
    const score = this.calculateScore(issues);
    const wcagLevel = this.determineWCAGLevel(issues);
    const recommendations = this.generateRecommendations(issues);
    
    return {
      score,
      wcagLevel,
      issues,
      summary,
      recommendations,
    };
  }
  
  /**
   * Check color contrast (WCAG 1.4.3, 1.4.6)
   */
  private checkColorContrast(doc: Document): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const elements = doc.querySelectorAll('*');
    
    elements.forEach((element) => {
      const styles = window.getComputedStyle(element as Element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      const fontSize = parseFloat(styles.fontSize);
      const fontWeight = parseInt(styles.fontWeight);
      
      if (color && backgroundColor && this.isVisible(element as HTMLElement)) {
        const ratio = this.calculateContrastRatio(color, backgroundColor);
        const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
        
        const minRatioAA = isLargeText ? 3 : 4.5;
        const minRatioAAA = isLargeText ? 4.5 : 7;
        
        if (ratio < minRatioAA) {
          issues.push({
            id: `contrast-${issues.length}`,
            type: 'contrast',
            severity: ratio < 3 ? 'critical' : 'serious',
            wcagCriterion: '1.4.3',
            description: `Insufficient color contrast: ${ratio.toFixed(2)}:1 (minimum ${minRatioAA}:1)`,
            element: this.getSelector(element as HTMLElement),
            recommendation: `Increase contrast to at least ${minRatioAA}:1 for WCAG AA compliance`,
            helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html',
          });
        }
      }
    });
    
    return issues;
  }
  
  /**
   * Check image alt text (WCAG 1.1.1)
   */
  private checkImageAltText(doc: Document): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const images = doc.querySelectorAll('img');
    
    images.forEach((img) => {
      const alt = img.getAttribute('alt');
      const role = img.getAttribute('role');
      
      // Decorative images should have empty alt or role="presentation"
      if (role === 'presentation' || role === 'none') {
        return;
      }
      
      if (alt === null) {
        issues.push({
          id: `alt-${issues.length}`,
          type: 'missing-alt',
          severity: 'critical',
          wcagCriterion: '1.1.1',
          description: 'Image missing alt attribute',
          element: this.getSelector(img),
          recommendation: 'Add descriptive alt text or role="presentation" for decorative images',
          helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html',
        });
      } else if (alt.trim() === '' && role !== 'presentation') {
        issues.push({
          id: `alt-empty-${issues.length}`,
          type: 'missing-alt',
          severity: 'serious',
          wcagCriterion: '1.1.1',
          description: 'Image has empty alt text but is not marked as decorative',
          element: this.getSelector(img),
          recommendation: 'Add descriptive alt text or add role="presentation"',
          helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html',
        });
      }
    });
    
    return issues;
  }
  
  /**
   * Check form labels (WCAG 1.3.1, 3.3.2)
   */
  private checkFormLabels(doc: Document): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const inputs = doc.querySelectorAll('input:not([type="hidden"]), select, textarea');
    
    inputs.forEach((input) => {
      const id = input.getAttribute('id');
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledby = input.getAttribute('aria-labelledby');
      const title = input.getAttribute('title');
      
      // Check if input has a label
      let hasLabel = false;
      
      if (id) {
        const label = doc.querySelector(`label[for="${id}"]`);
        if (label) hasLabel = true;
      }
      
      if (ariaLabel || ariaLabelledby || title) {
        hasLabel = true;
      }
      
      // Check if input is inside a label
      if (input.closest('label')) {
        hasLabel = true;
      }
      
      if (!hasLabel) {
        issues.push({
          id: `label-${issues.length}`,
          type: 'form-label',
          severity: 'critical',
          wcagCriterion: '3.3.2',
          description: 'Form input missing label',
          element: this.getSelector(input as HTMLElement),
          recommendation: 'Add a <label> element or aria-label attribute',
          helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html',
        });
      }
    });
    
    return issues;
  }
  
  /**
   * Check heading order (WCAG 1.3.1)
   */
  private checkHeadingOrder(doc: Document): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    
    let previousLevel = 0;
    
    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.substring(1));
      
      // Check if heading skips levels
      if (previousLevel > 0 && level > previousLevel + 1) {
        issues.push({
          id: `heading-${issues.length}`,
          type: 'heading-order',
          severity: 'moderate',
          wcagCriterion: '1.3.1',
          description: `Heading level skipped from h${previousLevel} to h${level}`,
          element: this.getSelector(heading as HTMLElement),
          recommendation: `Use h${previousLevel + 1} instead of h${level} to maintain hierarchy`,
          helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html',
        });
      }
      
      previousLevel = level;
    });
    
    // Check for missing h1
    const h1Count = doc.querySelectorAll('h1').length;
    if (h1Count === 0) {
      issues.push({
        id: 'missing-h1',
        type: 'heading-order',
        severity: 'serious',
        wcagCriterion: '1.3.1',
        description: 'Page missing h1 heading',
        element: 'body',
        recommendation: 'Add an h1 heading as the main page title',
        helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html',
      });
    } else if (h1Count > 1) {
      issues.push({
        id: 'multiple-h1',
        type: 'heading-order',
        severity: 'minor',
        wcagCriterion: '1.3.1',
        description: `Page has ${h1Count} h1 headings (should have only one)`,
        element: 'body',
        recommendation: 'Use only one h1 per page for the main title',
        helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html',
      });
    }
    
    return issues;
  }
  
  /**
   * Check link text (WCAG 2.4.4)
   */
  private checkLinkText(doc: Document): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const links = doc.querySelectorAll('a[href]');
    
    const genericTexts = ['click here', 'read more', 'more', 'link', 'here'];
    
    links.forEach((link) => {
      const text = link.textContent?.trim().toLowerCase() || '';
      const ariaLabel = link.getAttribute('aria-label');
      const title = link.getAttribute('title');
      
      if (!text && !ariaLabel && !title) {
        issues.push({
          id: `link-${issues.length}`,
          type: 'link-name',
          severity: 'critical',
          wcagCriterion: '2.4.4',
          description: 'Link has no accessible text',
          element: this.getSelector(link as HTMLElement),
          recommendation: 'Add descriptive text, aria-label, or title attribute',
          helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html',
        });
      } else if (genericTexts.includes(text)) {
        issues.push({
          id: `link-generic-${issues.length}`,
          type: 'link-name',
          severity: 'moderate',
          wcagCriterion: '2.4.4',
          description: `Link has generic text: "${text}"`,
          element: this.getSelector(link as HTMLElement),
          recommendation: 'Use descriptive link text that explains the destination',
          helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html',
        });
      }
    });
    
    return issues;
  }
  
  /**
   * Check ARIA usage (WCAG 4.1.2)
   */
  private checkARIA(doc: Document): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const elementsWithAria = doc.querySelectorAll('[role], [aria-label], [aria-labelledby], [aria-describedby]');
    
    elementsWithAria.forEach((element) => {
      const role = element.getAttribute('role');
      
      // Check for invalid roles
      const validRoles = [
        'alert', 'alertdialog', 'application', 'article', 'banner', 'button',
        'checkbox', 'columnheader', 'combobox', 'complementary', 'contentinfo',
        'definition', 'dialog', 'directory', 'document', 'feed', 'figure', 'form',
        'grid', 'gridcell', 'group', 'heading', 'img', 'link', 'list', 'listbox',
        'listitem', 'log', 'main', 'marquee', 'math', 'menu', 'menubar', 'menuitem',
        'menuitemcheckbox', 'menuitemradio', 'navigation', 'none', 'note', 'option',
        'presentation', 'progressbar', 'radio', 'radiogroup', 'region', 'row',
        'rowgroup', 'rowheader', 'scrollbar', 'search', 'searchbox', 'separator',
        'slider', 'spinbutton', 'status', 'switch', 'tab', 'table', 'tablist',
        'tabpanel', 'term', 'textbox', 'timer', 'toolbar', 'tooltip', 'tree',
        'treegrid', 'treeitem'
      ];
      
      if (role && !validRoles.includes(role)) {
        issues.push({
          id: `aria-${issues.length}`,
          type: 'aria-invalid',
          severity: 'serious',
          wcagCriterion: '4.1.2',
          description: `Invalid ARIA role: "${role}"`,
          element: this.getSelector(element as HTMLElement),
          recommendation: 'Use a valid ARIA role or remove the role attribute',
          helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html',
        });
      }
    });
    
    return issues;
  }
  
  /**
   * Check keyboard navigation (WCAG 2.1.1)
   */
  private checkKeyboardNavigation(doc: Document): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const interactiveElements = doc.querySelectorAll('a, button, input, select, textarea, [onclick], [tabindex]');
    
    interactiveElements.forEach((element) => {
      const tabindex = element.getAttribute('tabindex');
      
      // Check for positive tabindex (anti-pattern)
      if (tabindex && parseInt(tabindex) > 0) {
        issues.push({
          id: `keyboard-${issues.length}`,
          type: 'keyboard-navigation',
          severity: 'moderate',
          wcagCriterion: '2.1.1',
          description: 'Positive tabindex disrupts natural tab order',
          element: this.getSelector(element as HTMLElement),
          recommendation: 'Use tabindex="0" or remove tabindex to maintain natural order',
          helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html',
        });
      }
    });
    
    return issues;
  }
  
  /**
   * Check language attribute (WCAG 3.1.1)
   */
  private checkLanguage(doc: Document): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const html = doc.documentElement;
    const lang = html.getAttribute('lang');
    
    if (!lang) {
      issues.push({
        id: 'missing-lang',
        type: 'language',
        severity: 'serious',
        wcagCriterion: '3.1.1',
        description: 'Page missing lang attribute',
        element: 'html',
        recommendation: 'Add lang attribute to <html> element (e.g., lang="en")',
        helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html',
      });
    }
    
    return issues;
  }
  
  /**
   * Check landmarks (WCAG 1.3.1)
   */
  private checkLandmarks(doc: Document): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    
    const hasMain = doc.querySelector('main, [role="main"]');
    const hasNav = doc.querySelector('nav, [role="navigation"]');
    
    if (!hasMain) {
      issues.push({
        id: 'missing-main',
        type: 'landmark',
        severity: 'moderate',
        wcagCriterion: '1.3.1',
        description: 'Page missing main landmark',
        element: 'body',
        recommendation: 'Add <main> element or role="main" to identify main content',
        helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html',
      });
    }
    
    return issues;
  }
  
  /**
   * Calculate contrast ratio (WCAG formula)
   */
  private calculateContrastRatio(color1: string, color2: string): number {
    const l1 = this.getLuminance(color1);
    const l2 = this.getLuminance(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }
  
  /**
   * Calculate relative luminance (WCAG formula)
   */
  private getLuminance(color: string): number {
    const rgb = this.parseColor(color);
    if (!rgb) return 0;
    
    const [r, g, b] = rgb.map((val) => {
      val = val / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  
  /**
   * Parse color string to RGB
   */
  private parseColor(color: string): [number, number, number] | null {
    // Create a temporary element to parse color
    const temp = document.createElement('div');
    temp.style.color = color;
    document.body.appendChild(temp);
    const computed = window.getComputedStyle(temp).color;
    document.body.removeChild(temp);
    
    const match = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    }
    return null;
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
  
  /**
   * Calculate summary statistics
   */
  private calculateSummary(issues: AccessibilityIssue[]) {
    return {
      totalIssues: issues.length,
      critical: issues.filter(i => i.severity === 'critical').length,
      serious: issues.filter(i => i.severity === 'serious').length,
      moderate: issues.filter(i => i.severity === 'moderate').length,
      minor: issues.filter(i => i.severity === 'minor').length,
    };
  }
  
  /**
   * Calculate overall score
   */
  private calculateScore(issues: AccessibilityIssue[]): number {
    const weights = { critical: 10, serious: 5, moderate: 2, minor: 1 };
    const totalDeductions = issues.reduce((sum, issue) => {
      return sum + weights[issue.severity];
    }, 0);
    
    return Math.max(0, 100 - totalDeductions);
  }
  
  /**
   * Determine WCAG level
   */
  private determineWCAGLevel(issues: AccessibilityIssue[]): 'A' | 'AA' | 'AAA' | 'Fail' {
    const criticalCount = issues.filter(i => i.severity === 'critical').length;
    const seriousCount = issues.filter(i => i.severity === 'serious').length;
    
    if (criticalCount > 0) return 'Fail';
    if (seriousCount > 5) return 'A';
    if (seriousCount > 0) return 'AA';
    return 'AAA';
  }
  
  /**
   * Generate recommendations
   */
  private generateRecommendations(issues: AccessibilityIssue[]): string[] {
    const recommendations: string[] = [];
    const summary = this.calculateSummary(issues);
    
    if (summary.critical > 0) {
      recommendations.push(`Fix ${summary.critical} critical accessibility issues immediately`);
    }
    if (summary.serious > 0) {
      recommendations.push(`Address ${summary.serious} serious issues for WCAG AA compliance`);
    }
    if (summary.moderate > 0) {
      recommendations.push(`Improve ${summary.moderate} moderate issues for better accessibility`);
    }
    
    // Add specific recommendations based on issue types
    const issueTypes = new Set(issues.map(i => i.type));
    
    if (issueTypes.has('contrast')) {
      recommendations.push('Increase color contrast for better readability');
    }
    if (issueTypes.has('missing-alt')) {
      recommendations.push('Add alt text to all images');
    }
    if (issueTypes.has('form-label')) {
      recommendations.push('Label all form inputs');
    }
    
    return recommendations;
  }
}

// Export singleton instance
export const accessibilityChecker = new AccessibilityChecker();

// Made with Bob
