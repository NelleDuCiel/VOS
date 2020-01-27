var ROUTES_INDEX = {"name":"<root>","kind":"module","className":"AppModule","children":[{"name":"routes","filename":"src/app/admin/admin-routing.module.ts","module":"AdminRoutingModule","children":[{"path":"admin","component":"AdminComponent","canActivate":["AuthGuard"],"children":[{"path":"","canActivateChild":["AuthGuard"],"component":"AdminLandingComponent"},{"path":"subjectManage","component":"SubjectManageComponent"},{"path":"itemCreate","canActivateChild":["AuthGuard"],"component":"ItemCreateComponent"},{"path":"itemManage","canActivateChild":["AuthGuard"],"component":"ItemManageComponent","resolve":{"items":"ItemResolverService"},"children":[{"path":"baseEdit/:itemID","component":"ItemCreateComponent","outlet":"itemOutlet"}]},{"path":"treatmentCreate","canActivateChild":["AuthGuard"],"resolve":{"treatment":"TreatmentService"},"component":"TreatmentCreateComponent"},{"path":"treatmentEdit/:id","canActivateChild":["AuthGuard"],"component":"TreatmentCreateComponent","children":[{"path":"editItem/:itemID","canActivateChild":["AuthGuard"],"component":"ItemCreateComponent","outlet":"itemOutlet"},{"path":"editFilter/:treeID","canActivateChild":["AuthGuard"],"component":"TreeCreateComponent","outlet":"treeOutlet"}]},{"path":"filterCreate","canActivateChild":["AuthGuard"],"component":"TreeManageComponent","children":[{"path":"new","component":"TreeCreateComponent","outlet":"treeOutlet"},{"path":"edit/:treeID","component":"TreeCreateComponent","outlet":"treeOutlet"}]},{"path":"labelCreate","canActivateChild":["AuthGuard"],"component":"LabelCreateComponent"},{"path":"taxCreate","canActivateChild":["AuthGuard"],"component":"TaxCreateComponent"},{"path":"scoreCreate","canActivateChild":["AuthGuard"],"component":"ScoreCreateComponent"}]}],"kind":"module"},{"name":"routes","filename":"src/app/app-routing.module.ts","module":"AppRoutingModule","children":[{"path":"","component":"LandingComponent"},{"path":"auth","loadChildren":"./auth/auth.module#AuthModule","children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/auth/auth.module.ts","module":"AuthModule","children":[{"path":"register","component":"RegisterComponent"},{"path":"login","component":"LoginComponent"}],"kind":"module"}],"module":"AuthModule"}]},{"path":"**","component":"NotfoundComponent"}],"kind":"module"},{"name":"routes","filename":"src/app/trial/trial-routing.module.ts","module":"TrialRoutingModule","children":[{"path":"t/:treatmentID/s/:subjectID/shop","component":"TrialComponent","resolve":{"treatment":"TrialTreatmentService"},"children":[{"path":"","component":"TrialLandingComponent"},{"path":"cart","component":"ShoppingCartComponent"},{"path":"products","component":"TrialShopComponent"},{"path":"products/:id","component":"FoodDetailsComponent"}]},{"path":"t","component":"TrialConfigComponent"},{"path":"t/:treatmentID","component":"TrialConfigComponent"},{"path":"t/:treatmentID/s/:subjectID/start","component":"StartTrialComponent"},{"path":"t/:treatmentID/s/:subjectID/q1","component":"Q1Component"},{"path":"t/:treatmentID/s/:subjectID/q2","component":"Q2Component"},{"path":"t/:treatmentID/s/:subjectID/end","loadChildren":"./end-trial/end-trial.module#EndTrialModule","children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/trial/end-trial/end-trial.module.ts","module":"EndTrialModule","children":[{"path":"","component":"EndTrialComponent"}],"kind":"module"}],"module":"EndTrialModule"}]}],"kind":"module"}]}
