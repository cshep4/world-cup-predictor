import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import UserUtils from "../utils/user-utils";

const apiUrl = 'http://localhost:8080/';

interface RequestOptions {
  headers?: HttpHeaders | { [header: string]: string | Array<string> };
  observe?: any;
}

@Injectable()
export class AuthService {
  constructor(public http: HttpClient) {}

  login(credentials) {
    return new Promise((resolve, reject) => {
        const headers = new HttpHeaders().set("Content-Type", 'application/json');
        const options: RequestOptions = { headers: headers, observe: "response" };

        this.http.post(apiUrl+'login', JSON.stringify(credentials), options)
          .subscribe(res => {
              resolve(res);
          }, (err) => {
              reject(err);
          });
    });
  }

  register(data) {
      return new Promise((resolve, reject) => {
          if (!UserUtils.isValidRegistrationDetails(data)) {
              reject(UserUtils.errorMessage);
              return
          }

          const headers = new HttpHeaders().set("Content-Type", 'application/json');
          const options: RequestOptions = { headers: headers, observe: "response" };

          this.http.post(apiUrl+'users/sign-up', JSON.stringify(data), options)
            .subscribe(res => {
                resolve(res);
            }, (err) => {
                reject("Error registering");
            });
      });
  }

  logout(){
      return new Promise((resolve, reject) => {
            const headers = new HttpHeaders().set('X-Auth-Token', localStorage.getItem('token'));
            const options: RequestOptions = { headers: headers, observe: "response" };

            this.http.post(apiUrl+'users/logout', {}, options)
              .subscribe(res => {
                  localStorage.clear();
                  resolve(res);
              }, (err) => {
                  reject(err);
              });
      });
  }

}
