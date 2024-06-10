// if interface was used //

export interface ApiResponse<T>{
    status : string ;
    data : T ;
}  

// if class was used //

/*
export class ApiResponse<T>{
    status : string ;
    data : T ;

    constructor(status:string, data:T){
        this.status = status;
        this.data = data;
    }
}
*/

/*
export class ApiResponse<T>{
    status : string ;
    name : T ;
    email : T ;
    address : T ;

    constructor(status:string,name:T,email:T,address:T){
        this.status = status;
        this.email = email;
        this.name = name;
        this.address = address;
    }
}
*/
