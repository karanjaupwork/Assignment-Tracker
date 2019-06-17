import firebase from "./init";

export const database = {
  addAssignment: assignment => {
    firebase.collection("assignments").add(assignment);
  },
  getAssignments: () => {
    let assignments = [];
    firebase
      .collection("assignments")
      .get()
      .then(querySnapshot => {
        console.log(querySnapshot);
        querySnapshot.forEach(doc => {
          const assignment = doc.data();
          assignment["id"] = doc.id;
          assignment["due"] = new Date(assignment["due"])
            .toISOString()
            .substr(0, 10);
          assignment["start"] = new Date(assignment["start"])
            .toISOString()
            .substr(0, 10);
          assignments.push(assignment);
        });
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
    return assignments;
  },
  getAssignment: id => {
    firebase
      .collection("assignments")
      .doc(id)
      .get()
      .then(doc => {
        if (doc.exists) {
          const assignment = doc.data();
          assignment["id"] = doc.id;
          return assignment;
        } else {
          return null;
        }
      })
      .catch(function(error) {
        console.log("Error getting document: ", error);
      });
  },
  editAssignment: payload => {
    firebase
      .collection("assignments")
      .doc(payload.id)
      .set(payload);
  },
  deleteAssignment: payload => {
    firebase
      .collection("assignments")
      .doc(payload.id)
      .delete();
  },
  addSubject: payload => {
    let subject = {};
    firebase
      .collection("subjects")
      .add(payload)
      .then(doc => {
        subject.id = doc.id;
        subject.name = doc.data().name;
      });
    return subject;
  },
  getSubjects: () => {
    let subjects = [];
    firebase
      .collection("subjects")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let subject = doc.data();
          subject.id = doc.id;
          subjects.push(subject);
        });
      });
    return subjects;
  }
};
