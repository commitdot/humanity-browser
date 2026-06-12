import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // Navigation
  navigateTo: (url: string) => ipcRenderer.invoke('navigate-to', url),
  
  // AI Analysis
  analyzePage: (data: any) => ipcRenderer.invoke('analyze-page', data),
  
  // Redesign
  applyRedesign: (data: any) => ipcRenderer.invoke('apply-redesign', data),
  
  // Events
  onNavigationUpdate: (callback: (data: any) => void) => {
    ipcRenderer.on('navigation-update', (_event, data) => callback(data));
  },
  
  onAnalysisComplete: (callback: (data: any) => void) => {
    ipcRenderer.on('analysis-complete', (_event, data) => callback(data));
  },
});

// Type definitions for TypeScript
export interface ElectronAPI {
  getAppVersion: () => Promise<string>;
  navigateTo: (url: string) => Promise<{ success: boolean; url: string }>;
  analyzePage: (data: any) => Promise<{ success: boolean; analysis: any }>;
  applyRedesign: (data: any) => Promise<{ success: boolean }>;
  onNavigationUpdate: (callback: (data: any) => void) => void;
  onAnalysisComplete: (callback: (data: any) => void) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
