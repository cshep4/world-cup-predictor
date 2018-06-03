import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import UserUtils from "../utils/user-utils";
import {apiUrl, RequestOptions} from "../utils/utils";

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

  logout(token){
      return new Promise((resolve, reject) => {
            const headers = new HttpHeaders().set('X-Auth-Token', token);
            const options: RequestOptions = { headers: headers, observe: "response" };
            this.http.post(apiUrl+'users/logout', {}, options)
              .subscribe(res => {
                  resolve(res);
              }, (err) => {
                  reject(err);
              });
      });
  }

  setUsedToken(token) {
    return new Promise((resolve, reject) => {
      const body = token;
      const options: RequestOptions = { observe: "response" };

      this.http.put(apiUrl+'token/used', body, options)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

}
