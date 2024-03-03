import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  var token : String | null = localStorage.getItem("saved_token")
  if(token == null){
    return false
  }else{
    return true
  }
};
