class Users{
    constructor(){
        this.users = {}
    }

    generateUser(openid, quitTime, point){
        return {
            openid: openid,
            quitTime: quitTime ? quitTime : new Date().getTime(),
            point: point ? point : 100,
        }
    }

    getUserInfo(openid){
        let user = this.users[openid]
        if(!user){
            user = this.generateUser(openid)
            this.users[openid] = user
        }
        return user
    }

    updateUserInfo(user){
        const {openid, quitTime, point} = user
        this.users[openid] = this.generateUser(openid, quitTime, point)
    }
}

module.exports = Users