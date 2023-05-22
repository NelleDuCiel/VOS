import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TrialSubjectService } from '../trial-services/trial-subject.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


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
  errorMessage: string;
  /**Databinding to parent for subjectID emission. */
  @Output() selected = new EventEmitter<string>();
  /**Databinding for recieving treatmentID from parent. */
  @Input('tID') set tID(id: string) {
    this.btnDisabled = false;
    this.treatmentID = id;
  }

  constructor(private trialSubjectService: TrialSubjectService, private formBuilder: FormBuilder, private route: ActivatedRoute,
    private http: HttpClient) { }
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

        // Automatically submit the form if the id parameter is present
      this.errorMessage = ''; // Clear any previous error message
      // Check if the form is valid
      if (this.subjectForm.valid) {
        // Make the API call to check if the custom ID already exists
        const customID = this.subjectForm.get('customID').value;
        this.http.get<string>(environment.apiURI + '/subjectbycustom/' + customID).subscribe(
          response => {
            if (response) {
              // If the custom ID already exists, show an error message
              this.errorMessage = `U heeft uw ID "${customID}" reeds ingegeven, indien dit incorrect is, gelieve elke.godden@uantwerpen.be te contacteren.`;
            } else {
              this.onSubmit();
            }
          },
          error => {
              // Handle any other errors that occur during the API call
              console.error('API call failed:', error);
              this.errorMessage = 'Er gebeurde een fout tijdens het ophalen van je sessie, gelieve later opnieuw te proberen.';
            }
        );
        }
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
