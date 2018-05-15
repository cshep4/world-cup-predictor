import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import UserUtils from "../utils/user-utils";
import {apiUrl, RequestOptions} from "../utils/utils";

@Injectable()
export class AccountService {
  constructor(public http: HttpClient) {}

  retrieveAccount(id, token) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set("Content-Type", 'application/json')
        .set("X-Auth-Token", token);
      const options: RequestOptions = { headers: headers, observe: "response" };
      const url = apiUrl + 'users/' + id;

      this.http.get(url, options)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject("Error retrieving account");
        });
    });
  }

  updateUserDetails(data, token) {
      return new Promise((resolve, reject) => {
          if (!UserUtils.isValidUpdateUserDetails(data)) {
              reject(UserUtils.errorMessage);
              return
          }

          const headers = new HttpHeaders()
            .set("Content-Type", 'application/json')
            .set("X-Auth-Token", token);
          const options: RequestOptions = { headers: headers, observe: "response" };

          this.http.put(apiUrl+'users/update', JSON.stringify(data), options)
            .subscribe(res => {
                resolve(res);
            }, (err) => {
                reject("Error updating details");
            });
      });
  }

  updateUserPassword(data, token) {
    return new Promise((resolve, reject) => {
      if (!UserUtils.isValidUpdatePassword(data)) {
        reject(UserUtils.errorMessage);
        return
      }

      const headers = new HttpHeaders()
        .set("Content-Type", 'application/json')
        .set("X-Auth-Token", token);
      const options: RequestOptions = { headers: headers, observe: "response" };

      this.http.put(apiUrl+'users/updatePassword', JSON.stringify(data), options)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject("Error updating password");
        });
    });
  }

}
