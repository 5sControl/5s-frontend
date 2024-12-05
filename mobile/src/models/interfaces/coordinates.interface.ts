export interface Coordinat {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    id?: string;
  }
  
  export interface NewCoordinates {
    x: number;
    y: number;
    width: number;
    height: number;
    id: string;
  }
  
  export interface FourPointsNewCoordinates {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    x3: number;
    y3: number;
    x4: number;
    y4: number;
    id: string;
  }
  
  export interface DrawingCoordinates {
    x: number;
    y: number;
  }