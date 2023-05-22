// import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { environment } from 'src/environments/environment';

// @Component({
//   selector: 'app-treatment',
//   templateUrl: './custom-trial-config.component.html',
//   styleUrls: ['./custom-trial-config.component.scss']
// })
// export class CustomTrialConfigComponent implements OnInit {

//   tid: string;
//   sid: string;
//   trialStarted = true;

//   constructor(private http: HttpClient) { }

//   ngOnInit() {
//     const queryParams = new URLSearchParams(window.location.search);
//     this.tid = queryParams.get('tid') as string;
//     this.sid = queryParams.get('sid') as string;
//     this.trialStarted = !this.tid || !this.sid;
//   }

//   startTrial() {
//     this.http.post(environment.apiURI + '/subject/create/' + this.tid, { name: 'N/A', reusable: false, customID: this.sid});
//   }

// } 