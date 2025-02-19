export default function transformUserDetails(userDetails: any){
    if (!userDetails) return undefined;
  
    return {
      first_name: userDetails.first_name,
      last_name: userDetails.last_name,
      usercode: userDetails.usercode,
      userGroup: {
        id: userDetails.userGroup.id.toString(), 
      },
      email: userDetails.email,
      password: userDetails.password,
    };
  };