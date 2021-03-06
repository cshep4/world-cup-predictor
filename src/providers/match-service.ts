import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "./auth-service";
import {apiUrl, RequestOptions} from "../utils/utils";

@Injectable()
export class MatchService {
  constructor(public http: HttpClient, public authService: AuthService) {
  }

  retrievePredictedMatches(token, id) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set("Content-Type", 'application/json')
        .set("X-Auth-Token", token);
      const options: RequestOptions = { headers: headers, observe: "response" };

      const url = apiUrl + 'fixtures/predicted/' + id;

      this.http.get(url, options).subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  savePredictions(token, predictions) {
    console.log(predictions);
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set("Content-Type", 'application/json')
        .set("X-Auth-Token", token);
      const options: RequestOptions = { headers: headers, observe: "response" };

      const url = apiUrl + 'predictions/update';

      this.http.post(url, JSON.stringify(predictions), options).subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  retrievePredictionSummary(token, id) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set("Content-Type", 'application/json')
        .set("X-Auth-Token", token);
      const options: RequestOptions = { headers: headers, observe: "response" };

      const url = apiUrl + 'predictions/summary/' + id;

      this.http.get(url, options).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  retrieveMatches(token) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set("Content-Type", 'application/json')
        .set("X-Auth-Token", token);
      const options: RequestOptions = { headers: headers, observe: "response" };

      const url = apiUrl + 'fixtures';

      this.http.get(url, options).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  retrieveUpcomingMatches(token) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set("Content-Type", 'application/json')
        .set("X-Auth-Token", token);
      const options: RequestOptions = { headers: headers, observe: "response" };

      const url = apiUrl + 'fixtures/upcoming';

      this.http.get(url, options).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }
}
