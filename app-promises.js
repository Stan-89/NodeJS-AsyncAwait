//Playing around with promises

//array of user objects (id/name/schoolId)
const users = [{
  id: 1,
  name: 'Andrew',
  schoolId: 101
}, {
  id: 2,
  name: 'Jessica',
  schoolId: 999
}];

//array of grade objects (id/schoolId/grade)
const grades = [{
  id: 1,
  schoolId: 101,
  grade: 86
}, {
  id: 2,
  schoolId: 999,
  grade: 100
}, {
  id: 3,
  schoolId: 101,
  grade: 80
}];

//Get user takes an id, looks with .find to match it
//If it's found, resolve with that user. If not -> reject
const getUser = (id) => {
  return new Promise((resolve, reject) => {
    const user = users.find((user) => user.id === id);

    if (user) {
      resolve(user);
    } else {
      reject(`Unable to find user with id of ${id}.`);
    }
  });
};
//Always resolving -> since even if wrong id, empty array
//If id ok, we filter and keep the appropriate results
const getGrades = (schoolId) => {
  return new Promise((resolve, reject) => {
    resolve(grades.filter((grade) => grade.schoolId === schoolId));
  });
};

//Getting the status of a user id
const getStatus = (userId) => {
  //Temp var user defined in our scope
  let user;
  //Return a promise (get user) then with the cargo, give it to our var
  //and get the grades with it
  //Then chain -> to get grades and to return a msg with the average
  return getUser(userId).then((tempUser) => {
    user = tempUser;
    return getGrades(user.schoolId);
  }).then((grades) => {
    let average = 0;

    if (grades.length > 0) {
      average = grades.map((grade) => grade.grade).reduce((a, b) => a + b) / grades.length;
    }

    return `${user.name} has a ${average}% in the class.`;
  });
};

//Now, for the Await/Async example
const getStatusAlt = async (userId) => {
  const user = await getUser(userId);
  const grades = await getGrades(user.schoolId);
  let average = 0;

  if(grades.length > 0){
    average = grades.map((grade) => grade.grade).reduce((a,b) => a + b) / grades.length;
  }

  return `${user.name} has a ${average}% in the class.`;
};





getStatusAlt(2).then((status) => {
  console.log(status);
}).catch((e) => {
  console.log(e);
});
/*

//Actual execution of program starts here
//Get status of userID 123 -> if resolved, print it
//If not -> consolelog error
getStatus(123).then((status) => {
  console.log(status);
}).catch((e) => {
  console.log(e);
});
*/
