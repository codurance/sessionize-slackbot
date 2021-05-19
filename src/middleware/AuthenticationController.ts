class AuthenticationController {
    parseToken(bearerToken : string){
        return bearerToken.split(" ")[1];
    }
}

export default AuthenticationController;