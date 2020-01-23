//State of user
let state = {
    signedIn: false,
    user: null,
    tempUser: null,
    count: 0 //for counting how many times Submit OTP is clicked
    //its bcoz we can then remove user if count is 3 so that the user can click 3 times max
};
module.exports = state;