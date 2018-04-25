import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AuthService} from "./auth-service";
import {apiUrl, RequestOptions} from "../utils/utils";

@Injectable()
export class ScoreService {
  constructor(public http: HttpClient,
              public authService: AuthService) {
  }

  retrieveScoreAndRank(token, id) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set("Content-Type", 'application/json')
        .set("X-Auth-Token", token);
      const options: RequestOptions = { headers: headers, observe: "response" };

      const url = apiUrl + 'score/scoreAndRank/' + id;

      this.http.get(url, options).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }
}
