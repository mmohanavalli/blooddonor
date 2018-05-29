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


    //Login API

    checkLogin(userLoginData) {
        let loginData = new URLSearchParams();

        loginData.set('username', userLoginData.username);
        loginData.set('password', userLoginData.password);
        loginData.set('type', userLoginData.type);

       

        return this.http.post(this.baseURL + '/login',
            loginData.toString(),
            { headers: this.headersForm })
            .map(this.extractData)
            .catch(this.handleError);
    }

    sendPanicMessage(panicData) {
        let panicDatas = new URLSearchParams();

        panicDatas.set('panic', '1');
        panicDatas.set('msg', panicData.msg);
        panicDatas.set('sub', panicData.sub);
        

        return this.http.post(this.baseURL + '/panic',
        panicDatas.toString(),
            { headers: this.headersForm })
            .map(this.extractData)
            .catch(this.handleError);
    }


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

    /** Latest Post API */

    getLatestPostList(): Observable<events[]> {
        return this.http.get(this.baseURL + '/latestpost')
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
        if (findDonorData.findDonorData.country == undefined) {
            findDonorData.findDonorData.country = "";
            console.log("true");
        }
        if (findDonorData.findDonorData.city == undefined) {
            findDonorData.findDonorData.city = "";
        }
        if (bloodGroup == undefined) {
            bloodGroup = "";
        }
        console.log(this.baseURL + '/finddonors?bloodgroup=' + bloodGroup + '&country=' + findDonorData.findDonorData.country + '&city=' + findDonorData.findDonorData.city);
        return this.http.get(this.baseURL + '/finddonors?bloodgroup=' + bloodGroup + '&country=' + findDonorData.findDonorData.country + '&city=' + findDonorData.findDonorData.city)
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

        seekerData.set('name', seekerRegisterData.seekerData.name);
        seekerData.set('username', seekerRegisterData.seekerData.username);
        seekerData.set('password', seekerRegisterData.seekerData.password);
        seekerData.set('state', seekerRegisterData.seekerData.state);
        seekerData.set('city', seekerRegisterData.seekerData.city);
        seekerData.set('contactnumber', seekerRegisterData.seekerData.contactnumber);
        seekerData.set('email', seekerRegisterData.seekerData.email);
        seekerData.set('country', seekerRegisterData.seekerData.country);

        return this.http.post(this.baseURL + '/seeker_register',
            seekerData.toString(),
            { headers: this.headersForm })
            .map(this.extractData)
            .catch(this.handleError);
    }

    /**Register Donor */

    registerDonorService(donorRegisterData, imageName) {
        let donorData = new URLSearchParams();

        donorData.set('name', donorRegisterData.name);
        donorData.set('username', donorRegisterData.username);
        donorData.set('password', donorRegisterData.password);
        donorData.set('dob', donorRegisterData.dob);
        donorData.set('age', donorRegisterData.age);
        donorData.set('gender', donorRegisterData.gender);
        donorData.set('bloodgroup', donorRegisterData.bloodgroup);
        donorData.set('weight', donorRegisterData.weight);
        donorData.set('contactnumber', donorRegisterData.contactnumber);
        donorData.set('email', donorRegisterData.email);
        donorData.set('state', donorRegisterData.state);
        donorData.set('city', donorRegisterData.city);
        donorData.set('country', donorRegisterData.country);
        donorData.set('phoneno1', donorRegisterData.phoneno1);
        donorData.set('phoneno2', donorRegisterData.phoneno2);
        donorData.set('phoneno3', donorRegisterData.phoneno3);
        donorData.set('message', donorRegisterData.message);
        donorData.set('image', imageName);

        return this.http.post(this.baseURL + '/donor_register',
            donorData.toString(),
            { headers: this.headersForm })
            .map(this.extractData)
            .catch(this.handleError);
    }

    //  registerDonorService(donorRegisterData) {

    //     let formData = new FormData();

    //     formData.append("name", donorRegisterData.name);
    //     formData.append("username", donorRegisterData.username);
    //     formData.append("password", donorRegisterData.password);
    //     formData.append("age", donorRegisterData.dob);
    //     formData.append("dob", donorRegisterData.age);
    //     formData.append("gender", donorRegisterData.gender);
    //     formData.append("bloodgroup", donorRegisterData.bloodgroup);
    //     formData.append("weight", donorRegisterData.weight);
    //     formData.append("contactnumber", donorRegisterData.contactnumber);
    //     formData.append("email", donorRegisterData.email);
    //     formData.append("state", donorRegisterData.state);
    //     formData.append("city", donorRegisterData.city); 
    //     formData.append("country", donorRegisterData.country); 
    //     formData.append("phoneno1", donorRegisterData.phoneno1); 
    //     formData.append("phoneno2", donorRegisterData.phoneno2);  
    //     formData.append("phoneno3", donorRegisterData.phoneno3);  
    //     formData.append("message", donorRegisterData.message);        
    //     formData.append("userfile",  donorRegisterData.userfile[0]);  

    //    return this.http.post(this.baseURL + '/donor_register',
    //    formData
    //         // { headers: undefined}
    //    )
    //         .map(this.extractData)
    //         .catch(this.handleError);
    // }



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
        if (res.status === 200) {
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
        return body;
    }

    private extractRecentDonorData(res: Response) {
        let body = res.json();
        let donors = body.donors;
        return donors;
    }

    private extractRecentSeekerData(res: Response) {
        let body = res.json();
        let seeker = body.seeker;
        return seeker;
    }

    private handleError(error: Response | any) {
        console.error(error.message || error);
        console.error("Error Type" + error.type);
        console.error("Error Status" + error.status);
        console.error("body content for error" + error._body);
        return Observable.throw(error.status);
    }


}
