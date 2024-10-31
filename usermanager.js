const fs = require('node:fs');
const path = require('path');

function getUser(userid) {
    const data = fs.readFileSync(path.join(__dirname + '/users', userid + '.json'));
    return JSON.parse(data);
}

function saveUser(userdata) {
    if (!userExists(userdata.id)) createUser(userdata.id, userdata.displayName);
    fs.writeFileSync(path.join(__dirname + '/users', userdata.id + '.json'), JSON.stringify(userdata))
}

function createUser(userid, name) {
    if (userExists(userid)) return;

    const userobject = {
        "id": userid,
        "nickname": name,
        "games": []
    }

    fs.writeFileSync(path.join(__dirname + '/users', userid + '.json'), JSON.stringify(userobject))

}

function userExists(userid) {
   return fs.existsSync(path.join(__dirname + '/users', userid + '.json'));
}

module.exports = {
    getUser,
    saveUser,
    createUser,
    userExists
}