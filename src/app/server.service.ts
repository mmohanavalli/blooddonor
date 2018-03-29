import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { events } from "../pages/events_model";

@Injectable()
export class ServerService {
    public file: File;

    baseURL = 'http://blooddonorspot.com/donor';
    headers = new Headers({ 'Content-Type': 'application/json' });
    headersForm = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    headersFormData = new Headers({ 'Content-Type': 'multipart/form-data' });

    constructor(private http: Http) { }


    

/**Home Page RecentDonorsAndSeekersList */

    getRecentDonorsService(): Observable<events[]> {
        return this.http.get(this.baseURL)
            .map(this.extractRecentDonorData)
            .catch(this.handleError);
    }

    getRecentSeekersService(): Observable<events[]> {
        return this.http.get(this.baseURL)
            .map(this.extractRecentSeekerData)
            .catch(this.handleError);
    }

    /** Latest Event API */

    getLatestEvents(): Observable<events[]> {
        return this.http.get(this.baseURL + '/latestevent')
            .map(this.extractDoctorObjectData)
            .catch(this.handleError);
    }
    /** Latest Event By Id API */

    getLatestEventsById(eventId: string): Observable<events[]> {
        return this.http.get(this.baseURL + '/latestevent?id=' + eventId)
            .map(this.extractDoctorObjectData)
            .catch(this.handleError);

    } 
     /** Donor list */
    getDonorList(): Observable<events[]> {
        return this.http.get(this.baseURL + '/donorlist')
            .map(this.extractDoctorObjectData)
            .catch(this.handleError);
    }

    /** Find Donors */
    getFindDonor(findDonorData, bloodGroup): Observable<events[]> {
        if(findDonorData.findDonorData.country == undefined){
            findDonorData.findDonorData.country = "";
            console.log("true");
        }
        if (findDonorData.findDonorData.city == undefined){
            findDonorData.findDonorData.city = "";
        }
        if (bloodGroup == undefined){
            bloodGroup = "";
        }
        console.log(this.baseURL + '/finddonors?bloodgroup='+bloodGroup+'&country='+findDonorData.findDonorData.country+'&city='+findDonorData.findDonorData.city);
        return this.http.get(this.baseURL + '/finddonors?bloodgroup='+bloodGroup+'&country='+findDonorData.findDonorData.country+'&city='+findDonorData.findDonorData.city)
            .map(this.extractDoctorObjectData)
            .catch(this.handleError);
    }

     /** Donor list By Id API */

    getDonorDetailById(donorId: string): Observable<events[]> {
        return this.http.get(this.baseURL + '/donorlist?id=' + donorId)
            .map(this.extractDoctorObjectData)
            .catch(this.handleError);

    } 

    /**Register Seeker */

    registerSeekerService(seekerRegisterData) {
        let seekerData = new URLSearchParams();

        seekerData.set('name', seekerRegisterData.name);
        seekerData.set('username', seekerRegisterData.name);
        seekerData.set('password', seekerRegisterData.name);
        seekerData.set('state', seekerRegisterData.name);
        seekerData.set('city', seekerRegisterData.name);
        seekerData.set('contactnumber', seekerRegisterData.name);
        seekerData.set('email', seekerRegisterData.name);
        seekerData.set('country', seekerRegisterData.name);
        
        return this.http.post(this.baseURL + '/seeker_register',
            seekerData.toString(),
            { headers: this.headersForm })
            .map(this.extractData)
            .catch(this.handleError);
    }

     /**Register Donor */

     postFile(inputValue: any) {

        var formData = new FormData();
     //   formData.append("name", "Name");
        formData.append("file",  inputValue.files[0]);
    
        return this.http.post(this.baseURL + '/donor_register',
        formData,
            { headers: this.headersFormData })
            .map(this.extractData)
            .catch(this.handleError);
    }

     registerDonorService(donorRegisterData , eve) {
        let seekerData = new URLSearchParams();
        const reader = new FileReader();        
             
        seekerData.set('name', donorRegisterData.name);
        seekerData.set('username', donorRegisterData.name);
        seekerData.set('password', donorRegisterData.name);
        seekerData.set('state', donorRegisterData.name);
        seekerData.set('city', donorRegisterData.name);
        seekerData.set('contactnumber', donorRegisterData.name);
        seekerData.set('email', donorRegisterData.name);
        seekerData.set('country', donorRegisterData.name);

        var formData = new FormData();
        formData.append("name", "Name");
        formData.append("username", "Name");
        formData.append("password", "Name");
        formData.append("dob", "Name");
        formData.append("gender", "Name");
        formData.append("bloodgroup", "Name");
        formData.append("weight", "Name");
        formData.append("contactnumber", "Name");
        formData.append("email", "Name");
        formData.append("state", "Name");
        formData.append("city", "Name"); 
        formData.append("country", "Name"); 
        formData.append("phoneno1", "Name"); 
        formData.append("phoneno2", "Name");  
        formData.append("phoneno3", "Name");  
        formData.append("message", "Name");        
        formData.append("file",  eve.files[0]);        
        
        return this.http.post(this.baseURL + '/donor_register',
        formData,
            { headers: this.headersFormData })
            .map(this.extractData)
            .catch(this.handleError);
    }

    // private readFile(file: any) {
    //     const reader = new FileReader();
    //     reader.onloadend = () => {
    //       const formData = new FormData();
    //       const imgBlob = new Blob([reader.result], {type: file.type});
    //       formData.append('file', imgBlob, file.name);
    //       this.postData(formData);
    //     };
    //     reader.readAsArrayBuffer(file);
    //   }
      

     /**Blood Request */
    bloodRequestService(bloodRequestData) {
        let requestData = new URLSearchParams();

        requestData.set('name', bloodRequestData.name);
        requestData.set('age', bloodRequestData.age);
        requestData.set('blood_group', bloodRequestData.bloodgroup);
        requestData.set('date', bloodRequestData.date);
        requestData.set('units', bloodRequestData.units);
        requestData.set('contactnumber', bloodRequestData.contactnumber);
        requestData.set('state', bloodRequestData.state);
        requestData.set('city', bloodRequestData.city);
        requestData.set('country', bloodRequestData.country);
        requestData.set('purpose', bloodRequestData.purpose);
        
        return this.http.post(this.baseURL + '/bloodrequest',
        requestData.toString(),
            { headers: this.headersForm })
            .map(this.extractData)
            .catch(this.handleError);
    }
   
   
    postMessageService(message) {

        let userData = JSON.stringify(
            {
                id: message.id,
                title: message.title,
                text: message.text
            });

        return this.http.post('https://blooddonorspot.com/pages/registerasseeker',
            userData,
            { headers: this.headers })
            .map(this.extractData)
            .catch(this.handleError);
    }


    private extractData(res: Response) {
        res => res.json()
        if(res.status === 200 ){
        let body = res.json();
        let data = body;
         return data;  
    }
             

        console.log("test  1 " + res.json());
        res => res.json()
        console.log("test  2 " + res);
        return res;
    }    

    private extractDoctorObjectData(res: Response) {
        let body = res.json();       
        return body  ;
    }

    private extractRecentDonorData(res: Response) {
        let body = res.json();
        let donors = body.donors;
        return donors  ;
    }

    private extractRecentSeekerData(res: Response) {
        let body = res.json();
        let seeker = body.seeker;
        return seeker  ;
    }

    private handleError(error: Response | any) {
        console.error(error.message || error);
        console.error("Error Type" + error.type);
        console.error("Error Status" + error.status);
        console.error("body content for error" + error._body);
        return Observable.throw(error.status);
    }


}
