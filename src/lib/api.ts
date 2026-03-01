import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  timeout: 120000,
});

export interface Video {
  id: string;
  title: string | null;
  url: string;
  status: string;
  duration: number | null;
  thumbnail_url: string | null;
  audio_chunks: number;
  visual_chunks: number;
  total_chunks: number;
  processing_time: number | null;
  error_message: string | null;
  created_at: string;
}

export interface SearchResult {
  score: number;
  video_id: string;
  text: string;
  start_time: number;
  end_time: number;
  type: string;
  timestamp_formatted: string;
  youtube_url: string | null;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  total_results: number;
  latency_ms: number;
}

export const getVideos = () => api.get<Video[]>("/videos");
export const getVideo = (id: string) => api.get<Video>(`/videos/${id}`);
export const submitVideo = (url: string, use_vision: boolean = false) =>
  api.post("/videos", { url, use_vision });
export const deleteVideo = (id: string) => api.delete(`/videos/${id}`);
export const search = (query: string, video_id?: string, top_k: number = 5) =>
  api.post<SearchResponse>("/search", { query, video_id, top_k });
export const smartSearch = (query: string, video_id?: string, top_k: number = 5) =>
  api.post<SearchResponse>("/search/smart", { query, video_id, top_k });
export const getChapters = (video_id: string) =>
  api.get(`/videos/${video_id}/chapters`);