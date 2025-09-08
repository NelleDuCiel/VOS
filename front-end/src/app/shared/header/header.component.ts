import { Component, OnInit } from '@angular/core';
import { TrialSubjectService } from 'src/app/trial/trial-services/trial-subject.service';
import { TrialTreatmentService } from 'src/app/trial/trial-services/trial-treatment.service';
import { Observable } from 'rxjs/internal/Observable';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
/**
 * Header displayed in shop.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  /**Specifies shop name on html. */
  titel = 'Shop';

  /**
   * @ignore 
   */
  constructor(
    private treatmentService: TrialTreatmentService,
    private subjectService: TrialSubjectService,
  ) { }

  modalVisible: boolean = false;
  modalImageSrc: string = '';
  modalCaption: string = '';
  
  ngOnInit() {
  }

  get baseURL() {
    return `/t/${this.treatmentService.getTreatmentID()}/s/${this.subjectService.getSubjectID()}/shop/products`
  }

  openModal() {
    this.modalVisible = true;
    this.modalImageSrc = 'shopping-list.png';
    this.modalCaption = 'shopping lijst';
    console.log("image open");
  }

  closeModal(){
    this.modalVisible=false;
  }
}
