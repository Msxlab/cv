import { AccentColor, FontSize, Spacing } from '../types/cv';

// ==================== ACCENT COLORS (26 total) ====================
type ColorDef = { hex: string; hexLight: string };

const makeColor = (hex: string, hexLight: string): ColorDef => ({ hex, hexLight });

export const accentColors: Record<string, ColorDef> = {
  blue: makeColor('#2563eb', '#eff6ff'),
  red: makeColor('#dc2626', '#fef2f2'),
  emerald: makeColor('#059669', '#ecfdf5'),
  violet: makeColor('#7c3aed', '#f5f3ff'),
  amber: makeColor('#d97706', '#fffbeb'),
  rose: makeColor('#e11d48', '#fff1f2'),
  slate: makeColor('#475569', '#f8fafc'),
  cyan: makeColor('#0891b2', '#ecfeff'),
  indigo: makeColor('#4f46e5', '#eef2ff'),
  pink: makeColor('#db2777', '#fdf2f8'),
  orange: makeColor('#ea580c', '#fff7ed'),
  teal: makeColor('#0d9488', '#f0fdfa'),
  lime: makeColor('#65a30d', '#f7fee7'),
  sky: makeColor('#0284c7', '#f0f9ff'),
  fuchsia: makeColor('#c026d3', '#fdf4ff'),
  yellow: makeColor('#ca8a04', '#fefce8'),
  stone: makeColor('#78716c', '#fafaf9'),
  zinc: makeColor('#71717a', '#fafafa'),
  neutral: makeColor('#525252', '#fafafa'),
  ruby: makeColor('#be123c', '#fff1f2'),
  sapphire: makeColor('#1d4ed8', '#eff6ff'),
  forest: makeColor('#166534', '#f0fdf4'),
  wine: makeColor('#881337', '#fff1f2'),
  navy: makeColor('#1e3a5f', '#eff6ff'),
  coral: makeColor('#f97316', '#fff7ed'),
  maroon: makeColor('#7f1d1d', '#fef2f2'),
};

export const accentColorOptions: { value: AccentColor; label: string; swatch: string }[] = Object.entries(accentColors).map(([key, val]) => ({
  value: key as AccentColor,
  label: key.charAt(0).toUpperCase() + key.slice(1),
  swatch: val.hex,
}));

// Fallback for custom colors that start with #
export const getAccentColor = (color: string): ColorDef => {
  if (color.startsWith('#')) {
    return makeColor(color, `${color}1A`); // 10% opacity for light hex
  }
  return accentColors[color] || accentColors['blue'];
};

// ==================== FONTS ====================
export interface FontDef { label: string; css: string; google?: string; category: string }

export const fontFamilies: Record<string, FontDef> = {
  // System fonts
  sans: { label: 'System Sans', css: 'ui-sans-serif, system-ui, -apple-system, sans-serif', category: 'System' },
  serif: { label: 'System Serif', css: 'ui-serif, Georgia, Cambria, "Times New Roman", serif', category: 'System' },
  mono: { label: 'System Mono', css: 'ui-monospace, SFMono-Regular, Menlo, monospace', category: 'System' },
  // Sans-serif Google fonts
  inter: { label: 'Inter', css: '"Inter", sans-serif', google: 'Inter', category: 'Sans-Serif' },
  roboto: { label: 'Roboto', css: '"Roboto", sans-serif', google: 'Roboto', category: 'Sans-Serif' },
  opensans: { label: 'Open Sans', css: '"Open Sans", sans-serif', google: 'Open+Sans', category: 'Sans-Serif' },
  lato: { label: 'Lato', css: '"Lato", sans-serif', google: 'Lato', category: 'Sans-Serif' },
  montserrat: { label: 'Montserrat', css: '"Montserrat", sans-serif', google: 'Montserrat', category: 'Sans-Serif' },
  poppins: { label: 'Poppins', css: '"Poppins", sans-serif', google: 'Poppins', category: 'Sans-Serif' },
  raleway: { label: 'Raleway', css: '"Raleway", sans-serif', google: 'Raleway', category: 'Sans-Serif' },
  nunito: { label: 'Nunito', css: '"Nunito", sans-serif', google: 'Nunito', category: 'Sans-Serif' },
  ubuntu: { label: 'Ubuntu', css: '"Ubuntu", sans-serif', google: 'Ubuntu', category: 'Sans-Serif' },
  rubik: { label: 'Rubik', css: '"Rubik", sans-serif', google: 'Rubik', category: 'Sans-Serif' },
  worksans: { label: 'Work Sans', css: '"Work Sans", sans-serif', google: 'Work+Sans', category: 'Sans-Serif' },
  ibmplexsans: { label: 'IBM Plex Sans', css: '"IBM Plex Sans", sans-serif', google: 'IBM+Plex+Sans', category: 'Sans-Serif' },
  publicsans: { label: 'Public Sans', css: '"Public Sans", sans-serif', google: 'Public+Sans', category: 'Sans-Serif' },
  // Serif Google fonts
  playfair: { label: 'Playfair Display', css: '"Playfair Display", serif', google: 'Playfair+Display', category: 'Serif' },
  georgia: { label: 'Georgia', css: 'Georgia, "Times New Roman", serif', category: 'Serif' },
  merriweather: { label: 'Merriweather', css: '"Merriweather", serif', google: 'Merriweather', category: 'Serif' },
  lora: { label: 'Lora', css: '"Lora", serif', google: 'Lora', category: 'Serif' },
  newsreader: { label: 'Newsreader', css: '"Newsreader", serif', google: 'Newsreader', category: 'Serif' },
  // Monospace Google fonts
  firacode: { label: 'Fira Code', css: '"Fira Code", monospace', google: 'Fira+Code', category: 'Monospace' },
  jetbrains: { label: 'JetBrains Mono', css: '"JetBrains Mono", monospace', google: 'JetBrains+Mono', category: 'Monospace' },
  ibmplexmono: { label: 'IBM Plex Mono', css: '"IBM Plex Mono", monospace', google: 'IBM+Plex+Mono', category: 'Monospace' },
  victormono: { label: 'Victor Mono', css: '"Victor Mono", monospace', google: 'Victor+Mono', category: 'Monospace' },
  // Handwriting / Creative
  dancing: { label: 'Dancing Script', css: '"Dancing Script", cursive', google: 'Dancing+Script', category: 'Handwriting' },
  caveat: { label: 'Caveat', css: '"Caveat", cursive', google: 'Caveat', category: 'Handwriting' },
  pacifico: { label: 'Pacifico', css: '"Pacifico", cursive', google: 'Pacifico', category: 'Handwriting' },
  // Display / Special
  bebas: { label: 'Bebas Neue', css: '"Bebas Neue", sans-serif', google: 'Bebas+Neue', category: 'Display' },
  oswald: { label: 'Oswald', css: '"Oswald", sans-serif', google: 'Oswald', category: 'Display' },
};

// Load Google Fonts dynamically
const loadedFonts = new Set<string>();
export function loadGoogleFont(fontKey: string) {
  const font = fontFamilies[fontKey];
  if (!font?.google || loadedFonts.has(fontKey)) return;
  loadedFonts.add(fontKey);
  const link = document.createElement('link');
  link.href = `https://fonts.googleapis.com/css2?family=${font.google}:wght@300;400;500;600;700&display=swap`;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

// Font size multipliers
export const fontSizes: Record<FontSize, { label: string; base: string; scale: number }> = {
  small: { label: 'Small', base: 'text-xs', scale: 0.85 },
  medium: { label: 'Medium', base: 'text-sm', scale: 1 },
  large: { label: 'Large', base: 'text-base', scale: 1.15 },
};

// Spacing multipliers
export const spacings: Record<Spacing, { label: string; section: string; item: string; padding: string }> = {
  compact: { label: 'Compact', section: 'mb-3', item: 'space-y-2', padding: 'p-8' },
  normal: { label: 'Normal', section: 'mb-6', item: 'space-y-4', padding: 'p-12' },
  relaxed: { label: 'Relaxed', section: 'mb-8', item: 'space-y-5', padding: 'p-14' },
};

// Get inline style for a CV's style settings
export function getTemplateStyle(fontFamily: string, fontSize: FontSize) {
  const font = fontFamilies[fontFamily] || fontFamilies['sans'];
  if (fontFamilies[fontFamily]?.google) loadGoogleFont(fontFamily);
  return {
    fontFamily: font.css,
    fontSize: fontSize === 'small' ? '12px' : fontSize === 'large' ? '16px' : '14px',
  };
}

// Template info for the template picker
export const templateOptions: { value: string; label: string; description: string }[] = [
  { value: 'modern', label: 'Modern', description: 'Clean and contemporary' },
  { value: 'classic', label: 'Classic', description: 'Traditional professional layout' },
  { value: 'executive', label: 'Executive', description: 'Dark header for senior roles' },
  { value: 'technical', label: 'Technical', description: 'Sidebar layout for developers' },
  { value: 'creative', label: 'Creative', description: 'Colorful gradient header' },
  { value: 'minimalist', label: 'Minimalist', description: 'Ultra-clean whitespace' },
  { value: 'elegant', label: 'Elegant', description: 'Refined typography' },
  { value: 'compact', label: 'Compact', description: 'Dense single-page layout' },
  { value: 'academic', label: 'Academic', description: 'Scholarly design' },
  { value: 'infographic', label: 'Infographic', description: 'Visual skill bars' },
  { value: 'bold', label: 'Bold', description: 'Eye-catching oversized header' },
  { value: 'twotone', label: 'Two-Tone', description: 'Dark/light split sidebar' },
  { value: 'timeline', label: 'Timeline', description: 'Vertical timeline layout' },
  { value: 'metro', label: 'Metro', description: 'Tile-based modern metro' },
  { value: 'newspaper', label: 'Newspaper', description: 'Multi-column press style' },
  { value: 'gradient', label: 'Gradient', description: 'Smooth gradient backgrounds' },
  { value: 'swiss', label: 'Swiss', description: 'Grid-based Swiss design' },
];
