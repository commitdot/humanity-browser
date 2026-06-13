/**
 * Color Analysis Tool
 * Mathematical color theory - NO AI
 * Based on color science and WCAG standards
 */

import type {
  ColorReport,
  ColorPalette,
  ColorInfo,
  ColorHarmony,
  ContrastAnalysis,
  ContrastPair,
  ColorAccessibility,
  ColorSuggestion,
} from '../../shared/designAnalysisTypes';

export class ColorAnalyzer {
  /**
   * Analyze colors in a page
   */
  async analyzePage(html: string): Promise<ColorReport> {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Extract color palette
    const palette = this.extractPalette(doc);
    
    // Analyze color harmony
    const harmony = this.analyzeHarmony(palette);
    
    // Analyze contrast
    const contrast = this.analyzeContrast(doc);
    
    // Check accessibility
    const accessibility = this.checkAccessibility(contrast);
    
    // Generate suggestions
    const suggestions = this.generateSuggestions(palette, contrast, harmony);
    
    return {
      palette,
      harmony,
      contrast,
      accessibility,
      suggestions,
    };
  }
  
  /**
   * Extract color palette from document
   */
  private extractPalette(doc: Document): ColorPalette {
    const colorMap = new Map<string, ColorInfo>();
    const elements = doc.querySelectorAll('*');
    
    elements.forEach((element) => {
      const styles = window.getComputedStyle(element as Element);
      
      // Extract colors
      const colors = [
        styles.color,
        styles.backgroundColor,
        styles.borderColor,
        styles.outlineColor,
      ];
      
      colors.forEach((color) => {
        if (color && color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') {
          const hex = this.rgbToHex(color);
          if (hex) {
            const existing = colorMap.get(hex);
            if (existing) {
              existing.usage++;
              existing.elements.push(this.getSelector(element as HTMLElement));
            } else {
              const rgb = this.hexToRgb(hex);
              const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
              colorMap.set(hex, {
                hex,
                rgb,
                hsl,
                usage: 1,
                elements: [this.getSelector(element as HTMLElement)],
              });
            }
          }
        }
      });
    });
    
    // Convert to array and sort by usage
    const all = Array.from(colorMap.values()).sort((a, b) => b.usage - a.usage);
    
    // Categorize colors
    const primary: string[] = [];
    const secondary: string[] = [];
    const accent: string[] = [];
    const neutral: string[] = [];
    
    all.forEach((color) => {
      const { h, s, l } = color.hsl;
      
      // Neutral colors (low saturation)
      if (s < 10) {
        neutral.push(color.hex);
      }
      // Primary colors (high usage, high saturation)
      else if (color.usage > all.length * 0.1 && s > 40) {
        primary.push(color.hex);
      }
      // Accent colors (high saturation, low usage)
      else if (s > 60) {
        accent.push(color.hex);
      }
      // Secondary colors
      else {
        secondary.push(color.hex);
      }
    });
    
    return {
      primary: primary.slice(0, 3),
      secondary: secondary.slice(0, 3),
      accent: accent.slice(0, 3),
      neutral: neutral.slice(0, 5),
      all,
    };
  }
  
  /**
   * Analyze color harmony using color theory
   */
  private analyzeHarmony(palette: ColorPalette): ColorHarmony {
    if (palette.primary.length < 2) {
      return {
        type: 'monochromatic',
        score: 70,
        isHarmonious: true,
        explanation: 'Single color scheme with variations',
      };
    }
    
    // Get hues of primary colors
    const hues = palette.primary.map((hex) => {
      const rgb = this.hexToRgb(hex);
      const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
      return hsl.h;
    });
    
    // Check for complementary (180° apart)
    if (this.isComplementary(hues)) {
      return {
        type: 'complementary',
        score: 90,
        isHarmonious: true,
        explanation: 'Colors are opposite on the color wheel, creating strong contrast',
      };
    }
    
    // Check for analogous (30° apart)
    if (this.isAnalogous(hues)) {
      return {
        type: 'analogous',
        score: 85,
        isHarmonious: true,
        explanation: 'Colors are adjacent on the color wheel, creating harmony',
      };
    }
    
    // Check for triadic (120° apart)
    if (this.isTriadic(hues)) {
      return {
        type: 'triadic',
        score: 88,
        isHarmonious: true,
        explanation: 'Colors are evenly spaced on the color wheel, creating balance',
      };
    }
    
    // Check for tetradic (90° apart)
    if (this.isTetradic(hues)) {
      return {
        type: 'tetradic',
        score: 82,
        isHarmonious: true,
        explanation: 'Four colors forming a rectangle on the color wheel',
      };
    }
    
    // No clear harmony
    return {
      type: 'none',
      score: 60,
      isHarmonious: false,
      explanation: 'Colors do not follow a clear harmonic relationship',
    };
  }
  
  /**
   * Check if colors are complementary (180° apart)
   */
  private isComplementary(hues: number[]): boolean {
    if (hues.length < 2) return false;
    const diff = Math.abs(hues[0] - hues[1]);
    return Math.abs(diff - 180) < 30;
  }
  
  /**
   * Check if colors are analogous (30° apart)
   */
  private isAnalogous(hues: number[]): boolean {
    if (hues.length < 2) return false;
    for (let i = 0; i < hues.length - 1; i++) {
      const diff = Math.abs(hues[i] - hues[i + 1]);
      if (diff > 60) return false;
    }
    return true;
  }
  
  /**
   * Check if colors are triadic (120° apart)
   */
  private isTriadic(hues: number[]): boolean {
    if (hues.length < 3) return false;
    const sorted = [...hues].sort((a, b) => a - b);
    const diff1 = sorted[1] - sorted[0];
    const diff2 = sorted[2] - sorted[1];
    return Math.abs(diff1 - 120) < 30 && Math.abs(diff2 - 120) < 30;
  }
  
  /**
   * Check if colors are tetradic (90° apart)
   */
  private isTetradic(hues: number[]): boolean {
    if (hues.length < 4) return false;
    const sorted = [...hues].sort((a, b) => a - b);
    for (let i = 0; i < sorted.length - 1; i++) {
      const diff = sorted[i + 1] - sorted[i];
      if (Math.abs(diff - 90) > 30) return false;
    }
    return true;
  }
  
  /**
   * Analyze contrast ratios
   */
  private analyzeContrast(doc: Document): ContrastAnalysis {
    const pairs: ContrastPair[] = [];
    const elements = doc.querySelectorAll('*');
    
    elements.forEach((element) => {
      const styles = window.getComputedStyle(element as Element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      const fontSize = parseFloat(styles.fontSize);
      const fontWeight = parseInt(styles.fontWeight);
      
      if (color && backgroundColor && this.isVisible(element as HTMLElement)) {
        const fgHex = this.rgbToHex(color);
        const bgHex = this.rgbToHex(backgroundColor);
        
        if (fgHex && bgHex) {
          const ratio = this.calculateContrastRatio(fgHex, bgHex);
          const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
          
          pairs.push({
            foreground: fgHex,
            background: bgHex,
            ratio,
            passesAA: ratio >= (isLargeText ? 3 : 4.5),
            passesAAA: ratio >= (isLargeText ? 4.5 : 7),
            passesAALarge: ratio >= 3,
            passesAAALarge: ratio >= 4.5,
            element: this.getSelector(element as HTMLElement),
            fontSize,
            fontWeight,
          });
        }
      }
    });
    
    const passingAA = pairs.filter(p => p.passesAA).length;
    const passRate = pairs.length > 0 ? (passingAA / pairs.length) * 100 : 100;
    const failingPairs = pairs.length - passingAA;
    
    return {
      pairs,
      passRate,
      failingPairs,
    };
  }
  
  /**
   * Check color accessibility
   */
  private checkAccessibility(contrast: ContrastAnalysis): ColorAccessibility {
    const passingAA = contrast.pairs.filter(p => p.passesAA).length;
    const passingAAA = contrast.pairs.filter(p => p.passesAAA).length;
    const criticalIssues = contrast.pairs.filter(p => p.ratio < 3);
    
    // Simple color blind check (would need more sophisticated algorithm for real use)
    const colorBlindSafe = criticalIssues.length === 0;
    
    return {
      totalPairs: contrast.pairs.length,
      passingAA,
      passingAAA,
      criticalIssues,
      colorBlindSafe,
    };
  }
  
  /**
   * Generate color suggestions
   */
  private generateSuggestions(
    palette: ColorPalette,
    contrast: ContrastAnalysis,
    harmony: ColorHarmony
  ): ColorSuggestion[] {
    const suggestions: ColorSuggestion[] = [];
    
    // Suggest fixes for low contrast
    contrast.pairs.forEach((pair) => {
      if (!pair.passesAA) {
        const suggested = this.suggestAccessibleColor(pair.foreground, pair.background);
        suggestions.push({
          type: 'contrast',
          original: pair.foreground,
          suggested,
          reason: `Contrast ratio ${pair.ratio.toFixed(2)}:1 is below WCAG AA minimum`,
          improvement: `Suggested color improves contrast to meet accessibility standards`,
        });
      }
    });
    
    // Suggest harmony improvements
    if (!harmony.isHarmonious && palette.primary.length > 0) {
      const baseColor = palette.primary[0];
      const complementary = this.getComplementaryColor(baseColor);
      suggestions.push({
        type: 'harmony',
        original: baseColor,
        suggested: complementary,
        reason: 'Current colors lack harmonic relationship',
        improvement: 'Complementary color creates visual balance',
      });
    }
    
    return suggestions.slice(0, 10); // Limit to top 10 suggestions
  }
  
  /**
   * Suggest accessible color alternative
   */
  private suggestAccessibleColor(foreground: string, background: string): string {
    const fgRgb = this.hexToRgb(foreground);
    const bgRgb = this.hexToRgb(background);
    const bgLuminance = this.getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
    
    // If background is light, darken foreground; if dark, lighten foreground
    const targetLuminance = bgLuminance > 0.5 ? 0.1 : 0.9;
    
    // Adjust foreground color
    const fgHsl = this.rgbToHsl(fgRgb.r, fgRgb.g, fgRgb.b);
    fgHsl.l = targetLuminance * 100;
    
    const newRgb = this.hslToRgb(fgHsl.h, fgHsl.s, fgHsl.l);
    return this.rgbToHex(`rgb(${newRgb.r}, ${newRgb.g}, ${newRgb.b})`) || foreground;
  }
  
  /**
   * Get complementary color (180° on color wheel)
   */
  private getComplementaryColor(hex: string): string {
    const rgb = this.hexToRgb(hex);
    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    hsl.h = (hsl.h + 180) % 360;
    const newRgb = this.hslToRgb(hsl.h, hsl.s, hsl.l);
    return this.rgbToHex(`rgb(${newRgb.r}, ${newRgb.g}, ${newRgb.b})`) || hex;
  }
  
  /**
   * Calculate contrast ratio (WCAG formula)
   */
  private calculateContrastRatio(color1: string, color2: string): number {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    
    const l1 = this.getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = this.getLuminance(rgb2.r, rgb2.g, rgb2.b);
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }
  
  /**
   * Calculate relative luminance (WCAG formula)
   */
  private getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map((val) => {
      val = val / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }
  
  /**
   * Convert RGB to Hex
   */
  private rgbToHex(rgb: string): string | null {
    const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return null;
    
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }
  
  /**
   * Convert Hex to RGB
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : { r: 0, g: 0, b: 0 };
  }
  
  /**
   * Convert RGB to HSL
   */
  private rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }
  
  /**
   * Convert HSL to RGB
   */
  private hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    h /= 360;
    s /= 100;
    l /= 100;
    
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
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
export const colorAnalyzer = new ColorAnalyzer();

// Made with Bob
