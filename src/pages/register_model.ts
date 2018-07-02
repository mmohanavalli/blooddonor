export class register {
    public id: number;
    public name: string;
    public userName: string;
    public password: string;
    public state: string;
    public city: string;
    public contactNumber: string;
    public email: string;
    public country: string;

    // constructor(values: Object = {}) {
    //      Object.assign(this, values);
    // }

    constructor(id: number, name: string, userName: string,password: string, 
        state: string, city: string,contactNumber: string, email: string, country: string,
    ) 
    {
        this.id = id;
        this.name = name;
        this.userName = userName;
        this.password = password;
        this.state = state;
        this.city = city;
        this.contactNumber = contactNumber;
        this.email = email;
        this.country = country;

    }
} 