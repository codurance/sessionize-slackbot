class AuthenticationController {
    parseToken(bearerToken : string){
        return bearerToken.split(" ")[1];
    }

    compareTokens(bearerToken : string, ourToken : string){
        if(bearerToken !== ourToken) throw Error("Invalid token");
    }
}

export default AuthenticationController;