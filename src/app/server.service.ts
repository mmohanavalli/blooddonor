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

    sendEmailMessage(emailData) {
        let mailDatas = new URLSearchParams();

        mailDatas.set('from', emailData.from);
        mailDatas.set('to', emailData.to);
        mailDatas.set('msg', emailData.msg);
        mailDatas.set('sub', emailData.sub);


        return this.http.post(this.baseURL + '/sendMail',
            mailDatas.toString(),
            { headers: this.headersForm })
            .map(this.extractData)
            .catch(this.handleError);
    }

    sendreview(reviewData, seekerID, donorId) {
        let reviewDatas = new URLSearchParams();

        reviewDatas.set('name', reviewData.name);
        reviewDatas.set('email', reviewData.email);
        reviewDatas.set('review', reviewData.review);
        reviewDatas.set('ratings', reviewData.ratings);
        reviewDatas.set('seeker_id', seekerID);
        reviewDatas.set('donor_id', donorId);


        return this.http.post(this.baseURL + '/seeker_review',
            reviewDatas.toString(),
            { headers: this.headersForm })
            .map(this.extractData)
            .catch(this.handleError);
    }

    /** Get Captcha */
    
    getCaptcha() {
        return this.http.get(this.baseURL + '/getcaptcha')
            .map(this.extractObjectData)
            .catch(this.handleError);
    }

    /**Edit Seeker and Donor Profile */

    getSeekerInfo(username) {
        return this.http.get(this.baseURL + '/seeker_details?username=' + username)
            .map(this.extractObjectData)
            .catch(this.handleError);
    }

    getDonorInfo(username) {
        return this.http.get(this.baseURL + '/donor_details?username=' + username)
            .map(this.extractObjectData)
            .catch(this.handleError);
    }

    editSeekerProfile(seekerUpdateData, pass) {
        let seekerData = new URLSearchParams();

        seekerData.set('name', seekerUpdateData.seekerData.name);
        seekerData.set('username', seekerUpdateData.seekerData.username);
        seekerData.set('password', pass);
        seekerData.set('state', seekerUpdateData.seekerData.state);
        seekerData.set('city', seekerUpdateData.seekerData.city);
        seekerData.set('contactnumber', seekerUpdateData.seekerData.contactnumber);
        // seekerData.set('email', seekerUpdateData.seekerData.email);
        seekerData.set('country', seekerUpdateData.seekerData.country);

        return this.http.post(this.baseURL + '/seeker_edit',
            seekerData.toString(),
            { headers: this.headersForm })
            .map(this.extractData)
            .catch(this.handleError);
    }

    editDonorProfile(donorUpdateData, dob, imageName) {
        let donorData = new URLSearchParams();

        let gender;
        if (donorUpdateData.gender == 'Female') {
            gender = 0;
        } else {
            gender = 1;
        }

        donorData.set('name', donorUpdateData.name);
        donorData.set('username', donorUpdateData.username);
        donorData.set('password', donorUpdateData.password);
        donorData.set('dob', dob);
        donorData.set('age', donorUpdateData.age);
        donorData.set('gender', gender);
        donorData.set('bloodgroup', donorUpdateData.bloodgroup);
        donorData.set('weight', donorUpdateData.weight);
        donorData.set('contactnumber', donorUpdateData.contactnumber);
        donorData.set('email', donorUpdateData.email);
        donorData.set('state', donorUpdateData.state);
        donorData.set('city', donorUpdateData.city);
        donorData.set('country', donorUpdateData.country);
        donorData.set('phoneno1', donorUpdateData.phoneno1);
        donorData.set('phoneno2', donorUpdateData.phoneno2);
        donorData.set('phoneno3', donorUpdateData.phoneno3);
        donorData.set('message', donorUpdateData.message);
        donorData.set('image', imageName);

        return this.http.post(this.baseURL + '/donor_edit',
            donorData.toString(),
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
            .map(this.extractObjectData)
            .catch(this.handleError);
    }
    /** Latest Event By Id API */

    getLatestEventsById(eventId: string): Observable<events[]> {
        return this.http.get(this.baseURL + '/latestevent?id=' + eventId)
            .map(this.extractObjectData)
            .catch(this.handleError);
    }

    /** Latest Post API */

    getLatestPostList(): Observable<events[]> {
        return this.http.get(this.baseURL + '/latestpost')
            .map(this.extractObjectData)
            .catch(this.handleError);

    }
    /** Donor list */
    getDonorList(): Observable<events[]> {
        return this.http.get(this.baseURL + '/donorlist')
            .map(this.extractObjectData)
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
            .map(this.extractObjectData)
            .catch(this.handleError);
    }

    /** Donor list By Id API */

    getDonorDetailById(donorId: string) {
        return this.http.get(this.baseURL + '/donorlist?id=' + donorId)
            .map(this.extractObjectData)
            .catch(this.handleError);

    }

    /** Seeker list By Id API */

    geSeekerDetailById(seekerId: string) {
        return this.http.get(this.baseURL + '/postdetails?id=' + seekerId)
            .map(this.extractObjectData)
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

    registerDonorService(donorRegisterData, dob, imageName) {
        let donorData = new URLSearchParams();
        let gender;
        if (donorRegisterData.gender == 'Female') {
            gender = 0;
        } else {
            gender = 1;
        }

        donorData.set('name', donorRegisterData.name);
        donorData.set('username', donorRegisterData.username);
        donorData.set('password', donorRegisterData.password);
        donorData.set('dob', dob);
        donorData.set('age', donorRegisterData.age);
        donorData.set('gender', gender);
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

    /**Blood Request */
    bloodRequestService(bloodRequestData, date , seekerId) {
        let requestData = new URLSearchParams();

        requestData.set('name', bloodRequestData.name);
        requestData.set('age', bloodRequestData.age);
        requestData.set('blood_group', bloodRequestData.bloodgroup);
        requestData.set('date', date);
        requestData.set('units', bloodRequestData.units);
        requestData.set('contactnumber', bloodRequestData.contactnumber);
        requestData.set('state', bloodRequestData.state);
        requestData.set('city', bloodRequestData.city);
        requestData.set('country', bloodRequestData.country);
        requestData.set('purpose', bloodRequestData.purpose);
        requestData.set('seeker_id', seekerId);

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

    private extractObjectData(res: Response) {
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
