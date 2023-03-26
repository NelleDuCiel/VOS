import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TrialSubjectService } from '../trial-services/trial-subject.service';
import { ActivatedRoute } from '@angular/router';

/**
 * Subject select comoponent
 * 
 * Used in trial config. Emits result for subject selection OR subject generation to parent element.
 */
@Component({
  selector: 'app-subject-select',
  templateUrl: './subject-select.component.html',
  styleUrls: ['./subject-select.component.scss']
})
export class SubjectSelectComponent implements OnInit {
  /**Holds currently selected treatmentID, for use in checking if trial already exists. */
  treatmentID: any;
  /**Form for selecting subject by ID. */
  subjectForm = new FormGroup({
    customID: new FormControl('', Validators.required)
  });
  
  /**Submit Button disabled switch. */
  btnDisabled = true;
  /**Databinding to parent for subjectID emission. */
  @Output() selected = new EventEmitter<string>();
  /**Databinding for recieving treatmentID from parent. */
  @Input('tID') set tID(id: string) {
    this.btnDisabled = false;
    this.treatmentID = id;
  }

  constructor(private trialSubjectService: TrialSubjectService, private formBuilder: FormBuilder, private route: ActivatedRoute) { }
  /**
   * Not really needed anymore because component is hidden while treatmentID is not selected
   */
  ngOnInit() {
    
      this.btnDisabled = true;

      this.subjectForm = this.formBuilder.group({customID: ['', Validators.required]})
      this.route.queryParams.subscribe(params => {
        const idValue = decodeURIComponent(params['id']);
        console.log(idValue);
        this.subjectForm.patchValue({
          customID: idValue
        });
        this.btnDisabled = false;
      });
      // this.subjectForm.invalid;
  }
  /**
   * OnClick Form submission.
   * Checks if subject and treatment --> subject select fails if not subjectID is emited to parent
   * @emits customID
   */
  onSubmit() {
    const customID = this.subjectForm.controls.customID.value;

    if (!customID){
      return;
    }

    this.trialSubjectService.checkDataRecording(this.treatmentID, customID)
      .subscribe(
        () => {
          // already exists
          this.selected.emit(customID)
        },
        (error) => {
          //
          if (error.error.noTrial) {
            this.trialSubjectService.generateCustomSubject(this.treatmentID, customID).subscribe(
              (val: string) => {
                console.log(val)
                this.selected.emit(val);
              },
              (innerError: any) => {
                console.error(innerError);
              }
            );
          }  else{
          console.error(error);
        }
      }
    );
  }
  /**
   * OnClick listener for creating a subject.
   * Calls service for generating subject, after success emits subjectID to parent.
   * @emits subjectID
   */
  generateSubject() {
    if (!this.treatmentID) {
      return;
    }
    this.trialSubjectService.generateNewSubject(this.treatmentID).subscribe((val: string) => {
      this.selected.emit(val);
    })
  }
  
}
