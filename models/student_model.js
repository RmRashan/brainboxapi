import db from '../utils/DBConnection.js';

exports.getAllStudents = function(callback) {
    db.query('SELECT * FROM students', callback);
};

exports.getStudentById = function(id, callback) {
    db.query('SELECT * FROM students WHERE id = ?', [id], callback);
};

exports.createStudent = function(newStudent, callback) {
    db.query('INSERT INTO students SET ?', newStudent, callback);
};

exports.updateStudent = function(id, updatedStudent, callback) {
    db.query('UPDATE students SET ? WHERE id = ?', [updatedStudent, id], callback);
};

exports.deleteStudent = function(id, callback) {
    db.query('DELETE FROM students WHERE id = ?', [id], callback);
};
