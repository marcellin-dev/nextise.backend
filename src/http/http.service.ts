/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class HttpService {
  constructor(private config: ConfigService) { }
  async POST(url: string, data: any, headers?: any, timeout?: number) {
    return this.handleRequest(url, 'POST', data, headers, timeout);
  }
  async PATCH(url: string, data?: any, headers?: any) {
    return this.handleRequest(url, 'PATCH', data, headers);
  }

  async GET(url: string, headers?: any) {
    return this.handleRequest(url, 'GET', null, headers);
  }

  async handleRequest(url: string, method: string, data?: any, headers?: any, timeout?: number,) {
    if (!headers) {
      headers = {};
    }

    return axios.request({
      url: url,
      method: method,
      data: data,
      headers: headers ? headers : {},
      timeout: timeout
    });
  }
}
