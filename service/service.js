//service.js
//const repository = require('../Repository/repository'); //veritabanı yapısı içe aktarılır.
//const Student = require('../Entity/entity'); //sınıf yapısı içe aktarılır.

import * as repository from '../Repository/repository.js';
import Student from '../Entity/entity.js';

const createStudent = async (studentData) => { 
  const created = await repository.createStudent(studentData);
  return new Student(created);
};

const getAllStudents = async () => {
  const students = await repository.getAllStudents();
  return students.map(s => new Student(s)); //
};

//students dizisi, veritabanından gelen ham öğrenci nesnelerinden oluşuyor.
//map ile dizideki her öğrenci (s) için yeni bir Student nesnesi oluşturuluyor.
//Sonuç olarak, Student sınıfından nesnelerden oluşan yeni bir dizi elde ediliyor.



const getStudentById = async (id) => {
  console.log('Service: Gelen id:', id);
  const studentData = await repository.getStudentById(id);
  if (!studentData) return null;
  return new Student(studentData);
};



const updateStudent = async (id, studentData) => {
  const updated = await repository.updateStudent(id, studentData);
  return new Student(updated);
};

const deleteStudent = async (id) => {
  const deleted = await repository.deleteStudent(id);
  return deleted ? true : false;
};

//Bu satırda yukarıdaki tüm servis fonksiyonları modül dışına açılır.
//Böylece başka dosyalar (örn. controller) bu fonksiyonları kullanabilir.
export {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
