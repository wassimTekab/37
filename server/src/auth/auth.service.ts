import { Injectable, UnauthorizedException } from "@nestjs/common";
// @ts-ignore
// eslint-disable-next-line
import { UserService } from "../user/user.service";
import { Credentials } from "./Credentials";
import { PasswordService } from "./password.service";
import { TokenService } from "./token.service";
import { UserInfo, User, ApiError } from "./UserInfo";
import { EmailResetPasswordCredential, ResetPasswordCredential, UserCredentials } from "./Credentials";
import axios from 'axios';
import { createClient } from '@supabase/supabase-js'



@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
  ) {}

  async validateUser(
    username: string,
    password: string
  ): Promise<UserInfo | null> {
    const user = await this.userService.findOne({
      where: { username },
    });
    if (user && (await this.passwordService.compare(password, user.password))) {
      const { roles } = user;
      return { username, roles };
    }
    return null;
  }

 
  async supabaseLogin(credentials: Credentials) {
    credentials.email = credentials.email.toLowerCase();
    const { data } = await axios.post(
      process.env.KONG_URL + "/auth/v1/token?grant_type=password",
      {
        email: credentials.email,
        password: credentials.password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.ANON_KEY as string,
          Authorization: `Bearer ${process.env.SERVICE_ROLE_KEY}`,
        },
      }
    );
    return data;
  }

  async signUp(credentials : UserCredentials):Promise<User | ApiError> {
    if(credentials.role?.toLowerCase() === "service_role" || credentials.role?.toLowerCase() === "admin" || credentials.role?.toLowerCase() === "super-admin"){
      throw new UnauthorizedException(`You can't sign up with the role ${credentials.role}`);
    }
    credentials.email = credentials.email.toLowerCase();
    return await axios.post((process.env.KONG_URL || '')+'/auth/v1/admin/users',
        credentials,
        {
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.ANON_KEY||'',
            'Authorization': `Bearer ${process.env.SERVICE_ROLE_KEY||''}`
          }
        })
        .then(async response => {
        const authData = await this.supabaseLogin({email: credentials.email , password: credentials.password});
        return authData;
        })
        .catch(error => {
          return error.response.data;
        });
    }
  
  async sendEmailToResetPassword(credential : EmailResetPasswordCredential){
    const supabase = createClient('http://kong:8000', process.env.SERVICE_ROLE_KEY||'')

    const redirectTo = process.env.SITE_URL+'/auth/reset-password';
    const { data, error } = await supabase.auth.api
    .resetPasswordForEmail(credential.email,{
        redirectTo
    })
    if(data){
      return data;
    }else{
      return error;
    }
  }


  async resetPassword(credentials : ResetPasswordCredential){
  const supabase = createClient('http://kong:8000', process.env.SERVICE_ROLE_KEY||"")
  const { data, error } = await supabase.auth.api
    .updateUser(credentials.access_token,{
        password: credentials.password
    })
    if(data){
      return data;
    }else{
      return error;
    }
  }
}
