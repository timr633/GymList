//Gym Class
class Workout {
    constructor(exercise, rep, weight) {
        this.exercise = exercise;
        this.rep = rep;
        this.weight = weight;
    }
}

//UI class
class UI {
    static displayWorkouts() {
        const workouts = Store.getWorkouts();
        workouts.forEach((workout) => UI.addWorkoutToList(workout));
    }
    static addWorkoutToList(workout) {
        const list = document.querySelector('#gym-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${workout.exercise}</td>
            <td>${workout.rep}</td>
            <td>${workout.weight}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
      `;

        list.appendChild(row);
    }

    static deleteWorkout(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#gym-form');
        container.insertBefore(div, form);
        // Vanish after 3 sec
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#exercise').value = '';
        document.querySelector('#rep').value = '';
        document.querySelector('#weight').value = '';
    }
}
//Store class
class Store {
    static getWorkouts() {
        let workouts;
        if (localStorage.getItem('workouts') === null) {
            workouts = [];
        } else {
            workouts = JSON.parse(localStorage.getItem('workouts'));
        }

        return workouts;
    }

    static addWorkout(workout) {
        const workouts = Store.getWorkouts();
        workouts.push(workout);
        localStorage.setItem('workouts', JSON.stringify(workouts));
    }

    static removeWorkout(weight) {
        const workouts = Store.getWorkouts();
        workouts.forEach((workout, index) => {
            if (workout.weight === weight) {
                workouts.splice(index, 1);
            }
        });

        localStorage.setItem('workouts', JSON.stringify(workouts));
    }
}

//Events to show book

document.addEventListener('DOMContentLoaded', UI.displayWorkouts);

//Event to Add
document.querySelector('#gym-form').addEventListener('submit', (e) => {

    e.preventDefault();
    //Get form Values
    const exercise = document.querySelector('#exercise').value;
    const rep = document.querySelector('#rep').value;
    const weight = document.querySelector('#weight').value;


    // validate
    if (exercise === '' || rep === '' || weight === '') {
        UI.showAlert('Please fill in all the fields', 'danger');
    } else {
        //Instatiate workout

        const workout = new Workout(exercise, rep, weight);

        //Add workout to UI
        UI.addWorkoutToList(workout);

        //Add workout to Store
        Store.addWorkout(workout);

        //Show success message
        UI.showAlert('Workout Added', 'success');

        //Clear fields
        UI.clearFields();
    }
});


//Event remove from UI
document.querySelector('#gym-list').addEventListener('click', (e) => {
    UI.deleteWorkout(e.target);

    //Remove workout from Store
    Store.removeWorkout(e.target.parentElement.previousElementSibling.textContent);

    //Show success message
    UI.showAlert('Workout Deleted', 'success');
})
