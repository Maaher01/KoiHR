import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Notice, NoticeAddEdit } from '../models/notice.interface';

@Injectable({
  providedIn: 'root',
})
export class NoticeService {
  apiUrl = environment.baseUrl + 'Notice/';

  private _httpClient = inject(HttpClient);

  getAllNotices(): Observable<Notice[]> {
    return this._httpClient.get<Notice[]>(this.apiUrl);
  }

  getNoticeById(id: number) {
    return this._httpClient.get<Notice>(this.apiUrl + `${id}`);
  }

  addNotice(addPayload: NoticeAddEdit): Observable<Notice> {
    return this._httpClient.post<Notice>(this.apiUrl, addPayload);
  }

  editNotice(id: number, editPayload: NoticeAddEdit): Observable<Notice> {
    return this._httpClient.put<Notice>(this.apiUrl + `${id}`, editPayload);
  }

  deleteNotice(id: number) {
    return this._httpClient.delete(this.apiUrl + `${id}`);
  }
}
