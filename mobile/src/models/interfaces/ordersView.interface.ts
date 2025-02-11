export type VideoDataStatus = {
    status: boolean;
    date_start: number;
    date_end: number;
    file_name: string;
    camera_ip?: string;
    video_start_from?: number;
    playlist: string;
};

export type OrderDetail = {
    eTime: number;
    frsName: string;
    id: number;
    oprName: string;
    orId: number;
    sTime: number;
    status: string;
    videos: VideoDataStatus[];
};