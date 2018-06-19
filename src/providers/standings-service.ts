import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "./auth-service";
import {Injectable} from "@angular/core";
import {apiUrl, RequestOptions} from "../utils/utils";

@Injectable()
export class StandingsService {
  constructor(public http: HttpClient, public authService: AuthService) {
  }

  retrieveUserLeagues(token, id) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set("Content-Type", 'application/json')
        .set("X-Auth-Token", token);
      const options: RequestOptions = { headers: headers, observe: "response" };

      const url = apiUrl + 'standings/userLeagues/' + id;

      this.http.get(url, options).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  addLeague(token, id, name) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set("Content-Type", 'application/json')
        .set("X-Auth-Token", token);
      const options: RequestOptions = { headers: headers, observe: "response" };

      const url = apiUrl + 'standings/add';
      const body = {
        name: name,
        userId: id
      };

      this.http.post(url, body, options).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  joinLeague(token, id, pin) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set("Content-Type", 'application/json')
        .set("X-Auth-Token", token);
      const options: RequestOptions = { headers: headers, observe: "response" };

      const url = apiUrl + 'standings/join';
      const body = {
        leagueId: pin,
        userId: id
      };

      this.http.post(url, body, options).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  leaveLeague(token, id, pin) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set("Content-Type", 'application/json')
        .set("X-Auth-Token", token);
      const options: RequestOptions = { headers: headers, observe: "response" };

      const url = apiUrl + 'standings/leave';
      const body = {
        leagueId: pin,
        userId: id
      };

      this.http.post(url, body, options).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  getLeagueTable(token, pin) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set("Content-Type", 'application/json')
        .set("X-Auth-Token", token);
      const options: RequestOptions = { headers: headers, observe: "response" };

      let url;
      if (pin) {
        url = apiUrl + 'standings/league/' + pin;
      } else {
        url = apiUrl + 'standings/overall';
      }

      this.http.get(url, options).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  renameLeague(token, pin, name) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set("Content-Type", 'application/json')
        .set("X-Auth-Token", token);
      const options: RequestOptions = { headers: headers, observe: "response" };

      const url = apiUrl + 'standings/rename';
      const body = {
        id: pin,
        name: name
      };

      this.http.put(url, body, options).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }
}
