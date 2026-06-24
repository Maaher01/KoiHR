export interface Notice {
  id: number;
  title: string;
  content: string;
  publishedAt: string;
}

export interface NoticeAddEdit {
  title: string;
  content: string;
}
