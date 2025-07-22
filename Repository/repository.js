//repository.js
//const { Pool } = require('pg'); //Node.js PostgreSQL veritabanı istemcisidir.
//PostgreSQL veritabanıyla bağlantı kurmanı, sorgu çalıştırmanı, veri çekip işlemeni sağlar.
import pkg from 'pg';
const { Pool } = pkg;


const pool = new Pool({
  user: 'postgres',         // PostgreSQL kullanıcı adın
  host: 'localhost',        // Veritabanı sunucusu
  database: 'postgres',     // Veritabanı adı (senin durumunda 'postgres')
  password: '1234',        // Senin belirlediğin şifre
  port: 5432,               // PostgreSQL portu
});

const createStudent = async ({ isim, soyisim, tc_kimlik, adres}) => {
    const result = await pool.query( // postgresql sorgu göndermek için 
      `INSERT INTO student (isim, soyisim, tc_kimlik, adres) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [isim, soyisim, tc_kimlik, adres]
    );
    return result.rows[0]; //nesneyi döndürülür 0. dizeden başlayarak döndür
};

const getAllStudents = async () => { //Fonksiyonun işlem yapması için dışarıdan herhangi bilgi almasına gerek yok.
    
    const result = await pool.query('SELECT * FROM student ORDER BY id ASC'); // Tüm öğrencileri ID'ye göre sırala ve getir
    return result.rows; // Tüm öğrenci satırlarını JSON dizisi olarak cevapla

};


const getStudentById = async (id) => {
  console.log('Repository - Gelen id:', id);
  const result = await pool.query('SELECT * FROM student WHERE id = $1', [id]); // DÜZELTİLMİŞ HALİ
  if (result.rows.length === 0) return null;
  return result.rows[0];
};



const updateStudent= async (id,{isim,soyisim,tc_kimlik,adres}) => { 
    
 const result = await pool.query(
      `UPDATE student 
       SET isim = $1, soyisim = $2, tc_kimlik = $3, adres = $4 
       WHERE id = $5 RETURNING *`, //veriyi güncelle güncelleneni döndür
      [isim, soyisim, tc_kimlik, adres, id]
 )
      return result.rows[0]; //bulunannı döndür

};

const deleteStudent= async (id) => { 
    
 const result = await pool.query('DELETE FROM student WHERE id = $1 RETURNING *', [id]); //öğrenciyi sil ve satırı döndür
 return result.rows[0];
 res.send('Öğrenci silindi'); //bulunanı döndür

};


//bir dosyada yazdığın bir değişkeni, fonksiyonu veya sınıfı başka bir dosyada kullanabilmen için onu "dışa aktarman" (export etmen) gerekir.

export {
createStudent,
getStudentById,
updateStudent,
deleteStudent,
getAllStudents,

};


