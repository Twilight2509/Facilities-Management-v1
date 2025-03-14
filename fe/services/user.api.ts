import restClient from "./restClient";

export function getProfile(id:String){
    return restClient({
        url:`users/${id}`
    })
}
export function updateProfile(id:String,data:any){
return restClient({
    url:`users/${id}`,
    method:`PUT`,
    data:data,

})
}

export function getAllUser(email?:any,page?: number,size?:number){
    return restClient({
        url:`users/`,
        method:`GET`,
        params: {
            email:email,
            page:page,
            size:6
        }
    })
}

export function getAllRole(){
    return restClient({
        url:`role`,
        method:`GET`,
    })
}


