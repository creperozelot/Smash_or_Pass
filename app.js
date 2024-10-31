const express = require('express');
const session = require('express-session');
const multer = require('multer');

require('dotenv').config();

const { cachedDataExists, setCachedData, getCachedData } = require('./cache.js');
const { error } = require('console');
const { userExists, createUser, getUser, saveUser } = require('./usermanager.js');

const path = require('path');
const bodyParser = require('body-parser');
const app = express();

const OAuth2 = require('oauth').OAuth2;
const fs = require('fs');

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
const TWITCH_CALLBACK_URL = process.env.TWITCH_CALLBACK_URL;


// Apply Middleware and Settings

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'generated_secrete',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
}));

// Multer config and setup

const upload = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './public/uploads');
        },
        filename: function(req, file, cb) {
            cb(null, file.originalname);
        }
    }),
    fileFilter: function(req, file, cb) {

        if (file.mimetype !== 'application/json') {
            return cb(new Error('Only JSON Files are allowed'));
        }
        cb(null, true);
    }
});

// Prepare Storage and Server Initizialisation

if (!fs.existsSync('./public/uploads')) {
    fs.mkdirSync('./public/uploads');
}

readGameFiles('./games');
loadGameModes('./featured_games.json');

// Routes

app.get('/', (req, res) => {

    let items;
    let gameid = 'game_main';

    if(!req.query || !req.query.gameid || !cachedDataExists('game_' + req.query.gameid)) {
        items = getCachedData('game_main');
    } else {
        items = getCachedData('game_' + req.query.gameid);
        gameid = 'game_' + req.query.gameid;
    }

    if (req.session.user && !userExists(req.session.user.id)) {
        createUser(req.session.user.id, req.session.user.displayName);
    }

    res.render('index', {user: req.session.user, people: items, featured_gamemodes: getCachedData('data_gamesInfo'), gameid: gameid});
});

app.get('/scoreboard', (req, res) => {
    res.render('scoreboard', {selectedUser: null, data: null, error: null });
});

app.get('/scoreboard/:id', (req, res) => {
    
    const id = req.params.id;
    if (userExists(id)) {

        const usr = getUser(id);

        res.render('scoreboard', {selectedUser: usr.nickname, data: usr, error: null });
    } else {
        res.render('scoreboard', {selectedUser: null, data: null, error: 'User with id ' + id + ' not found' });
    }
});

app.get('/submit', (req, res) => {
    res.render('submit', {user: req.session.user, alert: null, success: null});
})

app.post('/save-results', (req, res) => {

    console.log(req.body);
    const { userid, username, gameid, smashed, passed } = req.body;

    if (!userExists(userid)) createUser(userid, username);

    const usrdata = getUser(userid);

    const game = getCachedData(gameid);

    usrdata.games.push({"name": game.display_name, "gameid": gameid, "smashes": smashed, "passes": passed});

    saveUser(usrdata);

    res.sendStatus(200);
});

app.post('/add-game-mode', upload.single('uploaded_file'), (req, res) => {

    if (!req.file) {
        return res.render('submit', {user: req.session.user, alert: 'Failed to upload file or invalid file type.', success: null})
    }

    const jsonFilePath = path.join(__dirname, 'public/uploads', req.file.filename);
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            fs.unlinkSync(jsonFilePath, function (err) {
                throw new err;
            });
            return res.render('submit', {user: req.session.user, alert: 'Failed to read JSON file, is this really a JSON file?', success: null});
        }

        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (e) {
            console.log(e);
            fs.unlinkSync(jsonFilePath, function (err) {
                throw new err;
            });
            return res.render('submit', {user: req.session.user, alert: 'Failed to read JSON file, contains this file really valid JSON data?', success: null});
        }

        const ret = compareAndLoadgame(req.session.user, jsonData);

        if (ret instanceof Error) {
            fs.unlink(jsonFilePath, function(err) {
                console.log(err);
            })
            return res.render('submit', {user: req.session.user, alert: ret.message, success: null});
        } else {

            fs.unlink(jsonFilePath, function (err) {
                console.log(err);
            })

            return res.render('submit', {user: req.session.user, alert: null, success: ret});
        }
        
    });
});

app.get('/tos', (req, res) => {
    res.render('tos', {});
})

app.get('/privacy', (req, res) => {
    res.render('privacy', {});
})

app.get('/imprint', (req, res) => {
    res.render('imprint', {});
})

// Authentication

app.get('/auth/twitch', (req, res) => {
    const authURL = `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}&redirect_uri=${TWITCH_CALLBACK_URL}&response_type=code&scope=user:read:email`;
    res.redirect(authURL);
})

app.get('/auth/twitch/callback', async (req, res) => {
    const code = req.query.code;

    try {
        const fetch = (await import('node-fetch')).default;

        const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams({
                client_id: TWITCH_CLIENT_ID,
                client_secret: TWITCH_CLIENT_SECRET,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: TWITCH_CALLBACK_URL
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        const userResponse = await fetch('https://api.twitch.tv/helix/users', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Client-ID': TWITCH_CLIENT_ID
            }
        });

        const userData = await userResponse.json();
        const user = userData.data[0];

        req.session.user = {
            id: user.id,
            displayName: user.display_name,
            email: user.email
        };

        res.redirect('/');
    } catch (error) {
        console.error('Error during Twitch authentication:', error);
        res.send('Authentication failed');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});


// Start Server

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


//functions

function readGameFiles(dirPath) {

    fs.readdirSync(dirPath).forEach(file => {   
        const filePath = path.join(dirPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const jsonObject = JSON.parse(fileContent);

        if (!cachedDataExists('game_' + jsonObject.unique_id)) {
            setCachedData('game_' + jsonObject.unique_id, jsonObject);
        } else {
            throw error('Game File with id ' + jsonObject.unique_id + 'already exists! Skipping...')
        };

    });


}

function loadGameModes(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(data);
    setCachedData('data_gamesInfo', json)
}

function compareAndLoadgame(user ,data) {

    const author = user.displayName;

    const id = data.unique_id;
    const displayName = data.display_name;
    const items = data.items;


    if (!id || !displayName || !items) {
        return new Error('Failed to compile data.');
    }

    if (cachedDataExists('game_' + id)) {
        return new Error('ID is already in use.');
    }

    for (i = 0; i < items.length; i++) {
        if (!items[i].name || !items[i].image) {
            return new Error('Items are malformated.');
        }
    }

    const gamedata = {
        "unique_id": id,
        "display_name": displayName,
        "creator": author,
        "items": items
    }

    try {
        fs.writeFileSync(path.join(__dirname, 'games/' + 'game_' + id + '.json'), JSON.stringify(gamedata));
    } catch (error) {
        return new Error('An unexpected error occurred with our filesystem, this is not your fault. Please try again later...')
    }

    setCachedData('game_' + id, gamedata);

    return "Uploaded game Successfully!";

}

