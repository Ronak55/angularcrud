import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { EmployeeModel } from './employee-dashboard.model';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent {

  formValue !: FormGroup;
  employeeModelObj : EmployeeModel = new EmployeeModel();
  employeeData !: any;
  showAdd !: boolean;
  showUpdate !: boolean;
  

constructor(private formBuilder : FormBuilder, private api : ApiService){



  this.formValue = this.formBuilder.group({
      // firstname:[''],
      // lastname:[''],
      // email:[''],
      // mobilephone:[''],
      // salary:[''],
      firstname:new FormControl('', [Validators.required]),
      lastname:new FormControl('', [Validators.required]),
      email:new FormControl('', [Validators.required, Validators.email]),
      mobilephone:new FormControl('', [Validators.required, Validators.minLength(10)]),
      salary:new FormControl('', [Validators.required]),
  })

  this.getAllEmployee()

}

get firstname(){
  return this.formValue.get('firstname')
}

get lastname(){
  return this.formValue.get('lastname')
}

get email(){
  return this.formValue.get('email')
}

get mobilephone(){
  return this.formValue.get('mobilephone')
}

get salary(){
  return this.formValue.get('salary')
}

clickAddEmployee(){

  this.formValue.reset();
  this.showAdd = true;
  this.showUpdate = false;

}



postEmployeeDetails(){


  // console.log(this.employeeModelObj.id);
  const lastempId = this.employeeData.length > 0 ? parseInt(this.employeeData[this.employeeData.length - 1].id, 10) + 1 : 1;


  this.employeeModelObj.id = lastempId.toString();
  this.employeeModelObj.firstname = this.formValue.value.firstname;
  this.employeeModelObj.lastname = this.formValue.value.lastname;
  this.employeeModelObj.email = this.formValue.value.email;
  this.employeeModelObj.mobilephone = this.formValue.value.mobilephone;
  this.employeeModelObj.salary = this.formValue.value.salary;

  this.api.postEmployee(this.employeeModelObj).subscribe(res=>{
    console.log(res);
  alert("Employee added successfully")
  let ref = document.getElementById("cancel")
  ref?.click();
  this.formValue.reset();
  this.getAllEmployee()
},
err=>{
  alert("Something went wrong")
})

}

getAllEmployee(){

  this.api.getEmployee().subscribe(res=>
    this.employeeData= res
    )
}

deleteEmployee(row:any){

  console.log(row.id)
  this.api.deleteEmployee(row.id).subscribe(res=>{
    alert("Employee Deleted !")
    this.getAllEmployee()
  })
}

onEdit(row:any){

  this.showAdd = false;
  this.showUpdate = true;

  this.formValue.controls['firstname'].setValue(row.firstname);
  
  this.formValue.controls['lastname'].setValue(row.lastname);

  this.formValue.controls['email'].setValue(row.email);
  
  this.formValue.controls['mobilephone'].setValue(row.mobilephone);
  
  this.formValue.controls['salary'].setValue(row.salary);
}

updateEmployeeDetails(){

 
   const lastempId = this.employeeData[this.employeeData.length - 1].id;

  this.employeeModelObj.id = lastempId.toString(); 
  console.log(this.employeeModelObj.id)
  this.employeeModelObj.firstname = this.formValue.value.firstname;
  this.employeeModelObj.lastname = this.formValue.value.lastname;
  this.employeeModelObj.email = this.formValue.value.email;
  this.employeeModelObj.mobilephone = this.formValue.value.mobilephone;
  this.employeeModelObj.salary = this.formValue.value.salary;

  this.api.updateEmployee(this.employeeModelObj, this.employeeModelObj.id).subscribe(res=>{
    alert("Updated Successfully !")
    let ref = document.getElementById("cancel")
  ref?.click();
  this.formValue.reset();
  this.getAllEmployee()
    
  })
}

}
