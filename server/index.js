import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { google } from 'googleapis'

import Quiz from './models/quizModel.js'

dotenv.config();
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors());

// fetch data from google sheets
const readGoogleSheets = async () => {
    try{
        const auth = new google.auth.GoogleAuth({
            keyFile: "key.json",
            scopes: "https://www.googleapis.com/auth/spreadsheets", 
        });
        
        //Auth client Object
        const authClientObject = await auth.getClient();
        //Google sheets instance
        const googleSheetsInstance = google.sheets({ version: "v4", auth: authClientObject });
        const spreadsheetId = "1Mjz9tF5Sz2Q3TRvdzloSlDVJNqNgkjSCKwla6QF_7Ps";
        const readData = await googleSheetsInstance.spreadsheets.values.get({
            auth, //auth object
            spreadsheetId, // spreadsheet id
            range: "MCQ!A:G", //range of cells to read from.
        })

        // fetch records from db
        const dbData = await Quiz.find();
        if(readData.data?.values.length){
            let readDataObj = readData.data?.values.map((data) => {
                return {
                    Question: data[0],
                    Options: { A:data[1],
                        B:data[2],
                        C:data[3],
                        D:data[4]}, 
                    Answer:data[5], 
                    Explanation:data[6] 
                }
            })
            readDataObj.shift();

            // insert all records if db is empty
            if(dbData.length === 0){
                // insert values Quiz db
                await Quiz.insertMany(readDataObj);
                return;
            }

            // update changed rows
            for(let i=0; i<dbData.length; i++){
                if(readDataObj[i].Question !== dbData[i].Question || readDataObj[i].Options.A !== dbData[i].Options.A || readDataObj[i].Options.B !== dbData[i].Options.B || readDataObj[i].Options.C !== dbData[i].Options.C || readDataObj[i].Options.D !== dbData[i].Options.D || readDataObj[i].Answer !== dbData[i].Answer || readDataObj[i].Explanation !== dbData[i].Explanation){
                    await Quiz.updateOne({ _id: dbData[i]._id }, readDataObj[i]);
                }
            }

            // insert new rows
            if(dbData.length < readDataObj.length){
                let newData = readDataObj.slice(dbData.length, readDataObj.length);
                await Quiz.insertMany(newData);
            }
        }
    }
    catch(err){
        console.log(err);
    }
}

// fetch sheets after every hour
readGoogleSheets()
setInterval(() => {
    readGoogleSheets()
}, 60*60*1000);
// }, 60*1000 );

// routes
app.get('/fetch-all-records', async(req, res) => {
    try {
        const data = await Quiz.find().limit(10);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(404).json("No data found");
    }
})


const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect( MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, () => {console.log(`server running on port ${PORT}`)}))
    .catch((err) => console.log(err.message))