# Assignment Tracker
An Assignment tracker to demonstrate CRUD with Vue.js and Firestore.  
  
To run, first clone the repository then `cd` into the project folder  
  
`cd assignment-tracker`  
  
Install all dependencies  
  
`npm install` or `yarn`  
  
The next step is to configure Firebase by providing your credentials.   
  
Create a file in the `firebase` directory and name it `init.js` and put the following code inside the file:
```
import  firebase  from  "firebase";

import  "firebase/firestore";
const  config  = {
    // you firebase credentials
};
const  firebaseApp  =  firebase.initializeApp(config);

export  default  firebaseApp.firestore();
```
You can then run the development server using
`npm run serve`  

A live build of the app can be viewed here.
