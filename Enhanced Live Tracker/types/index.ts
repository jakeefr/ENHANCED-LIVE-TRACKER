export interface Streamer {
  id: string;
  login: string;
  display_name: string;
  profile_image_url: string;
  title: string;
  viewer_count: number;
  game_id: string;
  game_name: string;
  thumbnail_url: string;
  is_live: boolean;
  started_at?: string;
  language: string;
  tags: string[];
  is_followed: boolean;
  follower_count: number;
  view_count: number;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  box_art_url: string;
  viewer_count: number;
  streamers: Streamer[];
}

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    background: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    inactive: string;
    white: string;
    black: string;
    statusBar: 'light' | 'dark' | 'auto';
  };
}