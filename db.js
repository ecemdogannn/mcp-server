const { Pool } = require('pg'); //Node.js PostgreSQL veritabanı istemcisidir.
//PostgreSQL veritabanıyla bağlantı kurmanı, sorgu çalıştırmanı, veri çekip işlemeni sağlar.

const pool = new Pool({
  user: 'postgres',         // PostgreSQL kullanıcı adın
  host: 'localhost',        // Veritabanı sunucusu
  database: 'postgres',     // Veritabanı adı (senin durumunda 'postgres')
  password: '1234',        // Senin belirlediğin şifre
  port: 5432,               // PostgreSQL portu
});

module.exports = pool;
