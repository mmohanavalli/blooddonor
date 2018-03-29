export class events {
    public id: number;
    public Title: string;
    public Description: string;
    public Event_Date: string;
    public City: string;
    public Post_Date: string;
    public Date: string;
    public year: string;
    public des: string;
    public latest_event: string;

    // constructor(values: Object = {}) {
    //      Object.assign(this, values);
    // }

    constructor(id: number, Title: string, Description: string,
        Event_Date: string, City: string, Post_Date: string,
        Date: string, year: string, des: string,
        latest_event: string) {
        this.id = id;
        this.Title = Title;
        this.Description = Description;
        this.Event_Date = Event_Date;
        this.City = City;
        this.Post_Date = Post_Date;
        this.Date = Date; 
        this.year = year;
        this.des = des;
        this.latest_event = latest_event;

    }
} 