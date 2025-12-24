export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  particles: string;
  music: string;
  image: string;
}

export interface CanvasElement {
  id: string;
  type: 'text' | 'image';
  x: number;
  y: number;
  content?: string;
  fill?: string;
  fontSize?: number;
  fontFamily?: string;
  align?: 'left' | 'center' | 'right';
  rotation: number;
  scaleX: number;
  scaleY: number;
}

export type Category = 'noel' | 'nouvel-an' | 'hiver' | 'feerie' | 'nature' | 'artdeco';
