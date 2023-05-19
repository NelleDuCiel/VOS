import { Component, OnInit } from '@angular/core';
import { TrialSubjectService } from 'src/app/trial/trial-services/trial-subject.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-end-trial',
  templateUrl: './end-trial.component.html',
  styleUrls: ['./end-trial.component.scss']
})
export class EndTrialComponent implements OnInit {
  customID: string;

  constructor(private http: HttpClient, 
    private subjectService: TrialSubjectService,
    private activatedRoute: ActivatedRoute,
  )  { }

  ngOnInit() {
    this.http.get(environment.apiURI + '/custombysubject/' + this.activatedRoute.snapshot.params.subjectID).subscribe((value) => {
       this.customID = (value as { customID: string }).customID;
       console.log(value);
       console.log(this.customID);

        console.log(this.customID); 
        const anchor = document.querySelector('a[href^="https://uantwerpen.eu.qualtrics.com"]');
        if (anchor) {
          anchor.setAttribute('href', `https://uantwerpen.eu.qualtrics.com/jfe/form/SV_9Mu12cUSuEgc08C?VOSid=${this.customID}`);
        }
    });
  }
}